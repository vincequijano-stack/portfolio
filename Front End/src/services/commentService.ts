import { apiFetch } from '../config/api';
import { getVisitorId, ownerAuthHeaders } from './visitorSession';
import { projectsData } from '../data/projects';

export interface ProjectComment {
  id: string;
  projectId: string;
  visitorId: string;
  userName: string;
  text: string;
  timestamp: number;
  avatar?: string;
  createdAt?: string;
}

const POLL_INTERVAL_MS = 60_000;

class CommentService {
  private comments: Record<string, ProjectComment[]> = {};
  private counts: Record<string, number> = {};
  private loading: Record<string, boolean> = {};
  private listeners: Set<() => void> = new Set();
  public loaded = false;

  constructor() {
    // Seed default baseline counts
    projectsData.forEach((p) => {
      this.counts[p.id] = p.commentsCount || 0;
    });

    if (typeof window !== 'undefined') {
      this.fetchCounts();
      window.setInterval(() => {
        if (document.visibilityState === 'visible') this.fetchCounts();
      }, POLL_INTERVAL_MS);
      window.addEventListener('focus', () => this.fetchCounts());
    }
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('Comment listener error:', err);
      }
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public async fetchCounts(): Promise<void> {
    const ids = projectsData.map((p) => p.id).join(',');
    try {
      const data = await apiFetch<{ counts: Record<string, number> }>(
        `/api/comments?ids=${encodeURIComponent(ids)}`
      );
      if (data && data.counts) {
        for (const [id, count] of Object.entries(data.counts)) {
          this.counts[id] = count;
        }
        this.loaded = true;
        this.notify();
      }
    } catch {
      // Offline fallback: keep cached/seed counts
    }
  }

  public async fetchComments(projectId: string, force = false): Promise<ProjectComment[]> {
    if (!force && this.comments[projectId] && !this.loading[projectId]) {
      return this.comments[projectId];
    }

    this.loading[projectId] = true;
    try {
      const data = await apiFetch<{ comments: ProjectComment[]; count: number }>(
        `/api/comments?projectId=${encodeURIComponent(projectId)}`
      );
      if (data && Array.isArray(data.comments)) {
        this.comments[projectId] = data.comments;
        this.counts[projectId] = data.comments.length;
        this.notify();
        return data.comments;
      }
    } catch (err) {
      console.warn(`Could not fetch comments for ${projectId}:`, err);
    } finally {
      this.loading[projectId] = false;
    }
    return this.comments[projectId] || [];
  }

  public getComments(projectId: string): ProjectComment[] {
    return this.comments[projectId] || [];
  }

  public getCommentsCount(projectId: string): number {
    if (typeof this.counts[projectId] === 'number') {
      return this.counts[projectId];
    }
    if (this.comments[projectId]) {
      return this.comments[projectId].length;
    }
    const proj = projectsData.find((p) => p.id === projectId);
    return proj?.commentsCount || 0;
  }

  public isLoading(projectId: string): boolean {
    return Boolean(this.loading[projectId]);
  }

  public async addComment(
    projectId: string,
    userName: string,
    text: string,
    avatar = '💬'
  ): Promise<ProjectComment> {
    const visitorId = getVisitorId();
    const res = await apiFetch<{ comment: ProjectComment; comments: ProjectComment[]; count: number }>(
      '/api/comments',
      {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          visitorId,
          userName,
          text,
          avatar,
        }),
      }
    );

    if (res && res.comment) {
      if (Array.isArray(res.comments)) {
        this.comments[projectId] = res.comments;
      } else {
        const list = this.comments[projectId] ? [...this.comments[projectId]] : [];
        list.push(res.comment);
        this.comments[projectId] = list;
      }
      this.counts[projectId] = typeof res.count === 'number' ? res.count : (this.comments[projectId]?.length || 0);
      this.notify();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('project_interaction_updated', { detail: { projectId } }));
      }
      return res.comment;
    }
    throw new Error('Failed to post comment.');
  }

  public async deleteComment(projectId: string, commentId: string): Promise<boolean> {
    const visitorId = getVisitorId();
    const headers = { ...ownerAuthHeaders() };

    const res = await apiFetch<{ deleted: boolean; count: number }>(
      `/api/comments?projectId=${encodeURIComponent(projectId)}&commentId=${encodeURIComponent(
        commentId
      )}&visitorId=${encodeURIComponent(visitorId)}`,
      {
        method: 'DELETE',
        headers,
      }
    );

    if (res && res.deleted) {
      if (this.comments[projectId]) {
        this.comments[projectId] = this.comments[projectId].filter((c) => c.id !== commentId);
      }
      this.counts[projectId] = typeof res.count === 'number' ? res.count : (this.comments[projectId]?.length || 0);
      this.notify();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('project_interaction_updated', { detail: { projectId } }));
      }
      return true;
    }
    return false;
  }
}

export const commentService = new CommentService();
