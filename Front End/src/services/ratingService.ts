import { apiFetch, ApiError } from '../config/api';
import { notificationService } from './notificationService';
import { getVisitorId, ownerAuthHeaders, isOwnerUnlocked, lockOwner } from './visitorSession';

export interface ClientReview {
  id: string;
  rating: number;
  name: string;
  role?: string;
  feedback: string;
  createdAt: string;
  timestamp: number;
  hidden?: boolean;
}

export interface RatingsState {
  reviews: ClientReview[]; // pages loaded so far (newest first)
  average: string; // average of all eligible (public) reviews — computed by the server
  count: number; // number of eligible (public) reviews — computed by the server
  total: number; // number of reviews in the current list (includes hidden ones for the owner)
  hasMore: boolean;
  status: 'idle' | 'loading' | 'ready' | 'error';
  loadingMore: boolean;
  error: string;
  isOwner: boolean;
}

const PAGE_SIZE = 10;
// Reviews that were previously cached only in this browser (pre-database versions of the site).
const LEGACY_STORAGE_KEYS = ['vince_client_reviews_cloud_v1', 'vince_client_reviews'];

interface ListResponse {
  reviews: ClientReview[];
  average: string;
  count: number;
  total: number;
  hasMore: boolean;
  isOwner: boolean;
}

class RatingService {
  private state: RatingsState = {
    reviews: [],
    average: '0.0',
    count: 0,
    total: 0,
    hasMore: false,
    status: 'idle',
    loadingMore: false,
    error: '',
    isOwner: false,
  };
  private listeners = new Set<(s: RatingsState) => void>();
  private refreshSeq = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.refresh();
      window.addEventListener('portfolio_owner_status_changed', () => this.refresh());
    }
  }

  private setState(patch: Partial<RatingsState>) {
    this.state = { ...this.state, ...patch };
    const snapshot = this.state;
    this.listeners.forEach((l) => l(snapshot));
  }

  private headers() {
    return isOwnerUnlocked() ? ownerAuthHeaders() : {};
  }

  private async fetchPage(offset: number): Promise<ListResponse> {
    try {
      return await apiFetch<ListResponse>(`/api/ratings?offset=${offset}&limit=${PAGE_SIZE}`, {
        headers: this.headers(),
      });
    } catch (err) {
      // A stale/rotated owner key should not break the public view.
      if (err instanceof ApiError && err.status === 401 && isOwnerUnlocked()) {
        lockOwner();
        return apiFetch<ListResponse>(`/api/ratings?offset=${offset}&limit=${PAGE_SIZE}`);
      }
      throw err;
    }
  }

  /** Reloads the first page and the summary from the database. */
  public async refresh(): Promise<void> {
    const seq = ++this.refreshSeq;
    this.setState({ status: this.state.status === 'ready' ? 'ready' : 'loading', error: '' });
    try {
      const data = await this.fetchPage(0);
      if (seq !== this.refreshSeq) return;
      this.setState({
        reviews: data.reviews,
        average: data.average,
        count: data.count,
        total: data.total,
        hasMore: data.hasMore,
        isOwner: Boolean(data.isOwner),
        status: 'ready',
        error: '',
      });
    } catch (err) {
      if (seq !== this.refreshSeq) return;
      this.setState({ status: 'error', error: (err as Error).message || 'Could not load reviews.' });
    }
  }

  public async loadMore(): Promise<void> {
    if (this.state.loadingMore || !this.state.hasMore) return;
    const seq = this.refreshSeq;
    this.setState({ loadingMore: true, error: '' });
    try {
      const data = await this.fetchPage(this.state.reviews.length);
      if (seq !== this.refreshSeq) return;
      const seen = new Set(this.state.reviews.map((r) => r.id));
      this.setState({
        reviews: [...this.state.reviews, ...data.reviews.filter((r) => !seen.has(r.id))],
        average: data.average,
        count: data.count,
        total: data.total,
        hasMore: data.hasMore,
        loadingMore: false,
      });
    } catch (err) {
      this.setState({ loadingMore: false, error: (err as Error).message || 'Could not load more reviews.' });
    }
  }

  /** Persists a review. Throws with a user-friendly message on failure (nothing is shown as saved). */
  public async submitReview(data: { rating: number; name: string; role?: string; feedback: string }) {
    const result = await apiFetch<{ review: ClientReview; average: string; count: number }>('/api/ratings', {
      method: 'POST',
      body: JSON.stringify({ ...data, visitorId: getVisitorId() }),
    });

    notificationService.recordLike(
      {
        id: `rate_${result.review.id}`,
        title: `Portfolio (${result.review.rating}★): "${
          result.review.feedback ? result.review.feedback.slice(0, 50) : 'Rated your portfolio'
        }"`,
        thumbnail: '/assets/images/headshot/headshot.jpg',
      },
      result.review.name
    );

    await this.refresh();
    return result.review;
  }

  /** Owner only: hide or restore a review from the public list. */
  public async setHidden(id: string, hidden: boolean): Promise<void> {
    await apiFetch('/api/ratings?action=moderate', {
      method: 'POST',
      headers: ownerAuthHeaders(),
      body: JSON.stringify({ id, hidden }),
    });
    await this.refresh();
  }

  /** Reviews cached in this browser by older versions of the site (they never reached a database). */
  public getLegacyLocalReviews(): any[] {
    const byId = new Map<string, any>();
    for (const key of LEGACY_STORAGE_KEYS) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(parsed)) parsed.forEach((r) => r && r.id && byId.set(r.id, r));
      } catch {}
    }
    return Array.from(byId.values());
  }

  /** Owner only: uploads legacy browser-cached reviews. Existing database records are never overwritten. */
  public async importLegacyLocalReviews(): Promise<{ imported: number; skipped: number }> {
    const reviews = this.getLegacyLocalReviews();
    const result = await apiFetch<{ imported: number; skipped: number }>('/api/ratings?action=import', {
      method: 'POST',
      headers: ownerAuthHeaders(),
      body: JSON.stringify({ reviews }),
    });
    await this.refresh();
    return result;
  }

  public getState(): RatingsState {
    return this.state;
  }

  public subscribe(listener: (s: RatingsState) => void) {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const ratingService = new RatingService();

export function formatReviewDate(review: Pick<ClientReview, 'createdAt' | 'timestamp'>): string {
  const d = new Date(review.createdAt || review.timestamp);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
