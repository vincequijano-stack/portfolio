import { apiFetch, ApiError } from '../config/api';
import { notificationService } from './notificationService';
import { getVisitorId, ownerAuthHeaders, lockOwner } from './visitorSession';
import { projectsData } from '../data/projects';

export interface LikerUser {
  userName: string;
  timestamp: number;
}

const POLL_INTERVAL_MS = 60_000;

/**
 * Post likes. The server/database is the single source of truth:
 * - counts and "liked by me" come from /api/likes
 * - optimistic updates are reverted if the request fails
 * - one in-flight request per post prevents double-click races
 */
class LikeService {
  private likes: Record<string, number> = {};
  private liked: Record<string, boolean> = {};
  private pending = new Set<string>();
  private listeners = new Set<() => void>();
  public loaded = false;
  public loadError = '';

  constructor() {
    if (typeof window !== 'undefined') {
      this.fetchLikes();
      window.setInterval(() => {
        if (document.visibilityState === 'visible') this.fetchLikes();
      }, POLL_INTERVAL_MS);
      window.addEventListener('focus', () => this.fetchLikes());
    }
  }

  public async fetchLikes(): Promise<void> {
    const ids = projectsData.map((p) => p.id).join(',');
    try {
      const data = await apiFetch<{ likes: Record<string, number>; liked: Record<string, boolean> }>(
        `/api/likes?ids=${encodeURIComponent(ids)}&visitorId=${encodeURIComponent(getVisitorId())}`
      );
      // Don't clobber posts that have a like/unlike request in flight.
      for (const [id, count] of Object.entries(data.likes || {})) {
        if (!this.pending.has(id)) this.likes[id] = count;
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
    return this.likes[projectId] || 0;
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
      this.likes[projectId] = data.likesCount;
      this.liked[projectId] = data.isLiked;

      if (target && data.isLiked && userName) {
        const proj = projectsData.find((p) => p.id === projectId);
        notificationService.recordLike(
          { id: projectId, title: proj?.title || projectId, thumbnail: proj?.thumbnail },
          userName
        );
      }
      return data;
    } catch (err) {
      // Revert so a failed request never leaves an inflated/deflated count on screen.
      this.liked[projectId] = prevLiked;
      this.likes[projectId] = prevCount;
      throw err;
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
