import { notificationService } from './notificationService';

export interface ClientReview {
  id: string;
  rating: number;
  name: string;
  role?: string;
  feedback: string;
  date: string;
  timestamp: number;
}

const STORAGE_KEY = 'vince_client_reviews_cloud_v1';
const NTFY_RATINGS_TOPIC = 'vince_quijano_portfolio_ratings_live';

class RatingService {
  private reviews: ClientReview[] = [];
  private listeners: Set<(reviews: ClientReview[]) => void> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;

  constructor() {
    this.loadFromStorage();
    this.initBroadcastChannel();
    this.initRealtimeStream();
    this.fetchCloudHistory();
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('vince_client_reviews');
      if (data) {
        this.reviews = JSON.parse(data);
      } else {
        this.reviews = [];
      }
    } catch {
      this.reviews = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reviews.slice(0, 100)));
      localStorage.setItem('vince_client_reviews', JSON.stringify(this.reviews.slice(0, 100)));
    } catch {}
  }

  private initBroadcastChannel() {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel('portfolio_ratings_channel');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'NEW_REVIEW') {
            this.handleIncomingReview(event.data.review, false);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel ratings not supported', e);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if ((e.key === STORAGE_KEY || e.key === 'vince_client_reviews') && e.newValue) {
          try {
            this.reviews = JSON.parse(e.newValue);
            this.notifyListeners();
          } catch {}
        }
      });
    }
  }

  private fetchCloudHistory() {
    if (typeof window === 'undefined') return;

    fetch(`https://ntfy.sh/${NTFY_RATINGS_TOPIC}/json?poll=1&since=all`)
      .then((res) => {
        if (!res.ok) return '';
        return res.text();
      })
      .then((text) => {
        if (!text) return;
        const lines = text.trim().split('\n');
        lines.forEach((line) => {
          try {
            const item = JSON.parse(line);
            if (item.event === 'message' && item.message) {
              const reviewData: ClientReview = JSON.parse(item.message);
              if (reviewData && reviewData.id && reviewData.rating) {
                this.handleIncomingReview(reviewData, false);
              }
            }
          } catch {}
        });
      })
      .catch(() => {});
  }

  private initRealtimeStream() {
    if (typeof window === 'undefined') return;

    try {
      this.eventSource = new EventSource(`https://ntfy.sh/${NTFY_RATINGS_TOPIC}/sse`);
      this.eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && parsed.event === 'message' && parsed.message) {
            const reviewData: ClientReview = JSON.parse(parsed.message);
            if (reviewData && reviewData.id && reviewData.rating) {
              this.handleIncomingReview(reviewData, false);
            }
          }
        } catch {}
      };
      this.eventSource.onerror = () => {
        if (this.eventSource) {
          this.eventSource.close();
          setTimeout(() => this.initRealtimeStream(), 20000);
        }
      };
    } catch (e) {
      console.warn('Realtime ratings stream error', e);
    }
  }

  private handleIncomingReview(review: ClientReview, broadcast = true) {
    if (this.reviews.some((r) => r.id === review.id)) return;

    this.reviews = [review, ...this.reviews].slice(0, 100);
    this.saveToStorage();
    this.notifyListeners();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio_new_review_event', { detail: review }));
    }

    if (broadcast) {
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'NEW_REVIEW',
          review,
        });
      }

      try {
        fetch(`https://ntfy.sh/${NTFY_RATINGS_TOPIC}`, {
          method: 'POST',
          body: JSON.stringify(review),
          headers: {
            'Content-Type': 'application/json',
          },
        }).catch(() => {});
      } catch {}
    }
  }

  public submitReview(data: Omit<ClientReview, 'id' | 'date' | 'timestamp'>): ClientReview {
    const newRev: ClientReview = {
      ...data,
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      date: 'Just now',
      timestamp: Date.now(),
    };

    this.handleIncomingReview(newRev, true);
    notificationService.recordLike(
      {
        id: `rate_${newRev.id}`,
        title: `Portfolio (${newRev.rating}★): "${newRev.feedback ? newRev.feedback.slice(0, 50) : 'Rated your portfolio'}"`,
        thumbnail: '/assets/images/headshot/headshot.jpg',
      },
      newRev.name
    );
    return newRev;
  }

  public getReviews(): ClientReview[] {
    return [...this.reviews];
  }

  public getAverageRating(): { average: string; count: number } {
    if (this.reviews.length === 0) {
      return { average: '0.0', count: 0 };
    }
    const sum = this.reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    const avg = (sum / this.reviews.length).toFixed(1);
    return { average: avg, count: this.reviews.length };
  }

  public subscribe(listener: (reviews: ClientReview[]) => void) {
    this.listeners.add(listener);
    listener([...this.reviews]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const copy = [...this.reviews];
    this.listeners.forEach((l) => l(copy));
  }
}

export const ratingService = new RatingService();
