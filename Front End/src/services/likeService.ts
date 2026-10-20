import { API_BASE_URL } from '../config/api';
import { notificationService, getVisitorName } from './notificationService';
import { projectsData } from '../data/projects';

// Generate or retrieve persistent visitor ID for unique likes
function getVisitorId(): string {
  try {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('portfolio_visitor_uuid');
      if (!id) {
        id = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('portfolio_visitor_uuid', id);
      }
      return id;
    }
  } catch {}
  return 'guest_visitor';
}

class LikeService {
  private likes: Record<string, number> = {};
  private listeners: Set<(likes: Record<string, number>) => void> = new Set();
  private isLoaded = false;

  constructor() {
    // Initialize with default project counts as baseline
    projectsData.forEach((p) => {
      this.likes[p.id] = p.likes || 1;
    });

    this.loadFromStorage();
    this.fetchLikes();
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('portfolio_cached_likes');
        if (stored) {
          const parsed = JSON.parse(stored);
          this.likes = { ...this.likes, ...parsed };
        }
      }
    } catch {}
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio_cached_likes', JSON.stringify(this.likes));
      }
    } catch {}
  }

  public async fetchLikes(): Promise<Record<string, number>> {
    if (!API_BASE_URL) return { ...this.likes };
    try {
      const res = await fetch(`${API_BASE_URL}/api/likes`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.likes) {
          this.likes = { ...this.likes, ...data.likes };
          this.isLoaded = true;
          this.saveToStorage();
          this.notifyListeners();
        }
      }
    } catch {
      // Backend offline: use cached local counts
    }
    return { ...this.likes };
  }

  public getLikesCount(projectId: string): number {
    if (this.likes[projectId] !== undefined) {
      return this.likes[projectId];
    }
    const defaultProj = projectsData.find((p) => p.id === projectId);
    return defaultProj?.likes || 1;
  }

  public isProjectLiked(projectId: string): boolean {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(`project_liked_${projectId}`) === 'true';
      }
    } catch {}
    return false;
  }

  public async toggleLike(
    projectId: string,
    customUserName?: string
  ): Promise<{ likesCount: number; isLiked: boolean }> {
    const currentlyLiked = this.isProjectLiked(projectId);
    const targetLiked = !currentlyLiked;
    const visitorId = getVisitorId();
    const visitorName = customUserName || getVisitorName() || 'Guest Visitor';

    // 1. Optimistic local update
    try {
      if (typeof window !== 'undefined') {
        if (targetLiked) {
          localStorage.setItem(`project_liked_${projectId}`, 'true');
        } else {
          localStorage.removeItem(`project_liked_${projectId}`);
        }
      }
    } catch {}

    const currentCount = this.getLikesCount(projectId);
    const updatedCount = targetLiked
      ? currentCount + 1
      : Math.max(0, currentCount - 1);

    this.likes[projectId] = updatedCount;
    this.saveToStorage();
    this.notifyListeners();

    if (targetLiked) {
      const proj = projectsData.find((p) => p.id === projectId);
      notificationService.recordLike(
        {
          id: projectId,
          title: proj?.title || projectId,
          thumbnail: proj?.thumbnail,
        },
        visitorName
      );
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('project_interaction_updated', {
          detail: { projectId, likesCount: updatedCount, isLiked: targetLiked },
        })
      );
    }

    // 2. Persist to Express backend database if API is configured
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/likes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            visitorId,
            isLiked: targetLiked,
            userName: visitorName,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && typeof data.likesCount === 'number') {
            this.likes[projectId] = data.likesCount;
            this.saveToStorage();
            this.notifyListeners();
            return { likesCount: data.likesCount, isLiked: data.isLiked };
          }
        }
      } catch (e) {
        console.warn('Backend like update failed, using optimistic state', e);
      }
    }

    return { likesCount: updatedCount, isLiked: targetLiked };
  }

  public subscribe(listener: (likes: Record<string, number>) => void) {
    this.listeners.add(listener);
    listener({ ...this.likes });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const copy = { ...this.likes };
    this.listeners.forEach((l) => l(copy));
  }
}

export const likeService = new LikeService();
