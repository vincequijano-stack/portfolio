import { API_BASE_URL } from '../config/api';
import { notificationService, getVisitorName } from './notificationService';
import { projectsData } from '../data/projects';

export interface LikerUser {
  visitorId?: string;
  userName: string;
  timestamp: number;
}

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
  private likers: Record<string, LikerUser[]> = {};
  private listeners: Set<() => void> = new Set();
  private isLoaded = false;

  constructor() {
    // Initialize default project counts as baseline
    projectsData.forEach((p) => {
      this.likes[p.id] = p.likes || 1;
      this.likers[p.id] = [];
    });

    this.loadFromStorage();
    this.fetchLikes();
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined') {
        const storedLikes = localStorage.getItem('portfolio_cached_likes');
        if (storedLikes) {
          const parsed = JSON.parse(storedLikes);
          this.likes = { ...this.likes, ...parsed };
        }

        const storedLikers = localStorage.getItem('portfolio_cached_likers');
        if (storedLikers) {
          const parsed = JSON.parse(storedLikers);
          this.likers = { ...this.likers, ...parsed };
        }
      }
    } catch {}
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio_cached_likes', JSON.stringify(this.likes));
        localStorage.setItem('portfolio_cached_likers', JSON.stringify(this.likers));
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
          if (data.likers) {
            this.likers = { ...this.likers, ...data.likers };
          }
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
    const list = this.getLikers(projectId);
    const storedCount = this.likes[projectId] !== undefined ? this.likes[projectId] : 0;
    return Math.max(storedCount, list.length);
  }

  public getLikers(projectId: string): LikerUser[] {
    const map = new Map<string, LikerUser>();

    // 1. From likers stored in this service
    const existing = this.likers[projectId] || [];
    existing.forEach((u) => {
      if (u && u.userName) {
        map.set(u.userName.toLowerCase(), u);
      }
    });

    // 2. From notifications for this project
    const notifs = notificationService.getNotifications();
    notifs
      .filter((n) => n.projectId === projectId)
      .forEach((n) => {
        const key = n.userName.toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            userName: n.userName,
            timestamp: n.timestamp,
          });
        }
      });

    // 3. If current user liked the project, ensure their name is in the list
    if (this.isProjectLiked(projectId)) {
      const currentVisitor = getVisitorName() || 'You';
      const key = currentVisitor.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          userName: currentVisitor,
          timestamp: Date.now(),
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
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

    if (!Array.isArray(this.likers[projectId])) {
      this.likers[projectId] = [];
    }

    if (targetLiked) {
      const alreadyHas = this.likers[projectId].some(
        (u) => u.userName.toLowerCase() === visitorName.toLowerCase()
      );
      if (!alreadyHas) {
        this.likers[projectId].unshift({
          visitorId,
          userName: visitorName,
          timestamp: Date.now(),
        });
      }
      this.likes[projectId] = Math.max((this.likes[projectId] || 0) + 1, this.likers[projectId].length);
    } else {
      this.likers[projectId] = this.likers[projectId].filter(
        (u) => u.visitorId !== visitorId && u.userName.toLowerCase() !== visitorName.toLowerCase()
      );
      this.likes[projectId] = Math.max(0, (this.likes[projectId] || 1) - 1);
    }

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
          detail: {
            projectId,
            likesCount: this.getLikesCount(projectId),
            isLiked: targetLiked,
            likers: this.getLikers(projectId),
          },
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
          if (data.success) {
            if (typeof data.likesCount === 'number') {
              this.likes[projectId] = data.likesCount;
            }
            if (Array.isArray(data.likers)) {
              this.likers[projectId] = data.likers;
            }
            this.saveToStorage();
            this.notifyListeners();
            return { likesCount: this.getLikesCount(projectId), isLiked: data.isLiked };
          }
        }
      } catch (e) {
        console.warn('Backend like update failed, using optimistic state', e);
      }
    }

    return { likesCount: this.getLikesCount(projectId), isLiked: targetLiked };
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
