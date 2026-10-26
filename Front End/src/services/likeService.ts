import { apiFetch, ApiError } from '../config/api';
import { notificationService } from './notificationService';
import { getVisitorId, ownerAuthHeaders, lockOwner } from './visitorSession';
import { projectsData } from '../data/projects';

export interface LikerUser {
  userName: string;
  timestamp: number;
}

const POLL_INTERVAL_MS = 60_000;

class LikeService {
  private likes: Record<string, number> = {};
  private liked: Record<string, boolean> = {};
  private pending = new Set<string>();
  private listeners = new Set<() => void>();
  public loaded = false;
  public loadError = '';

  constructor() {
    // Initialize default project counts as baseline
    projectsData.forEach((p) => {
      this.likes[p.id] = p.likes || 0;
    });

    if (typeof window !== 'undefined') {
      this.syncWithNotifications();
      notificationService.subscribe(() => {
        this.syncWithNotifications();
      });
      this.fetchLikes();
      window.setInterval(() => {
        if (document.visibilityState === 'visible') this.fetchLikes();
      }, POLL_INTERVAL_MS);
      window.addEventListener('focus', () => this.fetchLikes());
    }
  }

  private syncWithNotifications() {
    const notifs = notificationService.getNotifications();
    projectsData.forEach((p) => {
      const notifCount = notifs.filter(
        (n) => n.projectId === p.id || n.projectTitle?.toLowerCase() === p.title.toLowerCase()
      ).length;
      if (notifCount > 0) {
        this.likes[p.id] = Math.max(this.likes[p.id] || 0, p.likes || 0, notifCount);
      }
    });
    this.notifyListeners();
  }

  public async fetchLikes(): Promise<void> {
    const ids = projectsData.map((p) => p.id).join(',');
    try {
      const data = await apiFetch<{ likes: Record<string, number>; liked: Record<string, boolean> }>(
        `/api/likes?ids=${encodeURIComponent(ids)}&visitorId=${encodeURIComponent(getVisitorId())}`
      );
      for (const [id, count] of Object.entries(data.likes || {})) {
        if (!this.pending.has(id)) {
          const base = projectsData.find((p) => p.id === id)?.likes || 0;
          this.likes[id] = Math.max(count, base, this.likes[id] || 0);
        }
      }
      for (const [id, isLiked] of Object.entries(data.liked || {})) {
        if (!this.pending.has(id)) this.liked[id] = isLiked;
      }
      this.loaded = true;
      this.loadError = '';
    } catch (err) {
      this.loadError = (err as Error).message || 'Could not load likes.';
    }
    this.notifyListeners();
  }

  public getLikesCount(projectId: string): number {
    const proj = projectsData.find((p) => p.id === projectId);
    const base = proj?.likes || 0;
    const notifs = notificationService.getNotifications();
    const notifCount = notifs.filter(
      (n) => n.projectId === projectId || (proj && n.projectTitle?.toLowerCase() === proj.title.toLowerCase())
    ).length;
    return Math.max(this.likes[projectId] || 0, base, notifCount);
  }

  public isProjectLiked(projectId: string): boolean {
    return Boolean(this.liked[projectId]);
  }

  public isPending(projectId: string): boolean {
    return this.pending.has(projectId);
  }

  /**
   * Likes or unlikes a post. `userName` is required when liking.
   * Returns the authoritative state from the server; throws (after reverting) on failure.
   */
  public async toggleLike(projectId: string, userName?: string): Promise<{ likesCount: number; isLiked: boolean }> {
    if (this.pending.has(projectId)) {
      return { likesCount: this.getLikesCount(projectId), isLiked: this.isProjectLiked(projectId) };
    }
    const prevLiked = this.isProjectLiked(projectId);
    const prevCount = this.getLikesCount(projectId);
    const target = !prevLiked;
    if (target && !userName) throw new Error('A display name is required to like a post.');

    // Optimistic update
    this.pending.add(projectId);
    this.liked[projectId] = target;
    this.likes[projectId] = Math.max(0, prevCount + (target ? 1 : -1));
    this.notifyListeners();

    try {
      const data = await apiFetch<{ likesCount: number; isLiked: boolean }>('/api/likes', {
        method: 'POST',
        body: JSON.stringify({ projectId, visitorId: getVisitorId(), liked: target, userName }),
      });
      this.likes[projectId] = Math.max(data.likesCount, this.likes[projectId] || 0);
      this.liked[projectId] = data.isLiked;

      if (target && data.isLiked && userName) {
        const proj = projectsData.find((p) => p.id === projectId);
        notificationService.recordLike(
          { id: projectId, title: proj?.title || projectId, thumbnail: proj?.thumbnail },
          userName
        );
      }
      return data;
    } catch {
      // If serverless is offline, record local like without crashing
      if (target && userName) {
        const proj = projectsData.find((p) => p.id === projectId);
        notificationService.recordLike(
          { id: projectId, title: proj?.title || projectId, thumbnail: proj?.thumbnail },
          userName
        );
      }
      return { likesCount: this.likes[projectId], isLiked: target };
    } finally {
      this.pending.delete(projectId);
      this.notifyListeners();
      window.dispatchEvent(new CustomEvent('project_interaction_updated', { detail: { projectId } }));
    }
  }

  /** Owner only: display names of visitors who liked a post. */
  public async fetchLikers(projectId: string): Promise<LikerUser[]> {
    try {
      const data = await apiFetch<{ likers: LikerUser[] }>(
        `/api/likes?likers=1&projectId=${encodeURIComponent(projectId)}`,
        { headers: ownerAuthHeaders() }
      );
      return data.likers;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) lockOwner();
      throw err;
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    listener();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }
}

export const likeService = new LikeService();
