import { apiFetch, ApiError } from '../config/api';
import { notificationService } from './notificationService';
import { getVisitorId, ownerAuthHeaders, isOwnerUnlocked, lockOwner } from './visitorSession';
import { DEFAULT_REVIEWS, ClientReview } from '../data/reviews';

export type { ClientReview };

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
const LOCAL_STORAGE_REVIEWS_KEY = 'vince_client_reviews_cloud_v1';
const LEGACY_STORAGE_KEYS = [LOCAL_STORAGE_REVIEWS_KEY, 'vince_client_reviews'];

interface ListResponse {
  reviews: ClientReview[];
  average: string;
  count: number;
  total: number;
  hasMore: boolean;
  isOwner: boolean;
}

function calculateStats(reviews: ClientReview[]) {
  const eligible = reviews.filter((r) => !r.hidden);
  if (eligible.length === 0) return { average: '0.0', count: 0 };
  const sum = eligible.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  return {
    average: (sum / eligible.length).toFixed(1),
    count: eligible.length,
  };
}

function mergeWithDefaults(incoming: ClientReview[]): ClientReview[] {
  const byName = new Map<string, ClientReview>();
  
  // Real database / local cache reviews take precedence
  incoming.forEach((r) => {
    if (r && r.name) {
      const key = r.name.trim().toLowerCase();
      if (!byName.has(key)) {
        byName.set(key, r);
      }
    }
  });

  // Only fall back to seed reviews for missing reviewers
  DEFAULT_REVIEWS.forEach((r) => {
    const key = r.name.trim().toLowerCase();
    if (!byName.has(key)) {
      byName.set(key, r);
    }
  });

  const merged = Array.from(byName.values());
  merged.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  return merged;
}

function getLocalStoredReviews(): ClientReview[] {
  if (typeof window === 'undefined') return [];
  for (const key of LEGACY_STORAGE_KEYS) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((r) => r && r.id);
      }
    } catch {}
  }
  return [];
}

function saveLocalReview(review: ClientReview) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalStoredReviews();
    const updated = [review, ...existing.filter((r) => r.id !== review.id)];
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(updated));
  } catch {}
}

const initialSeedReviews = mergeWithDefaults(getLocalStoredReviews());
const initialStats = calculateStats(initialSeedReviews);

class RatingService {
  private state: RatingsState = {
    reviews: initialSeedReviews,
    average: initialStats.average,
    count: initialStats.count,
    total: initialSeedReviews.length,
    hasMore: false,
    status: 'ready',
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
      if (err instanceof ApiError && err.status === 401 && isOwnerUnlocked()) {
        lockOwner();
        return apiFetch<ListResponse>(`/api/ratings?offset=${offset}&limit=${PAGE_SIZE}`);
      }
      throw err;
    }
  }

  /** Reloads reviews from API, seamlessly merging with default testimonials. */
  public async refresh(): Promise<void> {
    const seq = ++this.refreshSeq;
    try {
      const data = await this.fetchPage(0);
      if (seq !== this.refreshSeq) return;

      const merged = mergeWithDefaults(data.reviews);
      const computed = calculateStats(merged);

      this.setState({
        reviews: merged,
        average: computed.average,
        count: computed.count,
        total: merged.length,
        hasMore: data.hasMore,
        isOwner: Boolean(data.isOwner),
        status: 'ready',
        error: '',
      });
    } catch (err) {
      if (seq !== this.refreshSeq) return;
      // Fallback: gracefully keep seed reviews + local reviews so rating never drops to zero
      const local = mergeWithDefaults(getLocalStoredReviews());
      const stats = calculateStats(local);
      this.setState({
        reviews: local,
        average: stats.average,
        count: stats.count,
        total: local.length,
        status: 'ready',
        error: '',
      });
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
      const combined = [...this.state.reviews, ...data.reviews.filter((r) => !seen.has(r.id))];
      const stats = calculateStats(combined);
      this.setState({
        reviews: combined,
        average: stats.average,
        count: stats.count,
        total: combined.length,
        hasMore: data.hasMore,
        loadingMore: false,
      });
    } catch (err) {
      this.setState({ loadingMore: false });
    }
  }

  /** Persists a review. Supports both cloud backend and resilient local fallback. */
  public async submitReview(data: { rating: number; name: string; role?: string; feedback: string }) {
    const now = Date.now();
    const fallbackReview: ClientReview = {
      id: `rev_${now}_${Math.random().toString(36).slice(2, 8)}`,
      rating: data.rating,
      name: data.name,
      role: data.role || 'Client / Collaborator',
      feedback: data.feedback,
      createdAt: new Date(now).toISOString(),
      timestamp: now,
    };

    let savedReview = fallbackReview;
    try {
      const result = await apiFetch<{ review: ClientReview; average: string; count: number }>('/api/ratings', {
        method: 'POST',
        body: JSON.stringify({ ...data, visitorId: getVisitorId() }),
      });
      if (result && result.review) {
        savedReview = result.review;
      }
    } catch {
      // Fallback: save to local storage if API backend is unconfigured or unreachable
      saveLocalReview(fallbackReview);
    }

    notificationService.recordLike(
      {
        id: `rate_${savedReview.id}`,
        title: `Portfolio (${savedReview.rating}★): "${
          savedReview.feedback ? savedReview.feedback.slice(0, 50) : 'Rated your portfolio'
        }"`,
        thumbnail: '/assets/images/headshot/headshot.jpg',
      },
      savedReview.name
    );

    // Update in-memory state immediately
    const updated = mergeWithDefaults([savedReview, ...this.state.reviews]);
    const stats = calculateStats(updated);
    this.setState({
      reviews: updated,
      average: stats.average,
      count: stats.count,
      total: updated.length,
      status: 'ready',
    });

    return savedReview;
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
