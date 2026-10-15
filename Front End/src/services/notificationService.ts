export interface LikeNotification {
  id: string;
  projectId: string;
  projectTitle: string;
  projectThumbnail: string;
  userName: string;
  timestamp: number;
  read: boolean;
}

const STORAGE_KEY = 'portfolio_notifications_v2';
const NTFY_TOPIC = 'vince_quijano_portfolio_likes_live';

class NotificationService {
  private notifications: LikeNotification[] = [];
  private listeners: Set<(notifications: LikeNotification[]) => void> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;

  constructor() {
    this.loadFromStorage();
    this.initBroadcastChannel();
    this.initRealtimeStream();
  }

  private loadFromStorage() {
    try {
      // Clear legacy storage that had mock sample notifications
      if (typeof window !== 'undefined') {
        localStorage.removeItem('portfolio_notifications_v1');
      }

      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: LikeNotification[] = JSON.parse(data);
        // Only keep genuine notifications (never mock/init samples)
        this.notifications = parsed.filter(
          (n) => !n.id.startsWith('init_') && n.userName !== 'tech_enthusiast' && n.userName !== 'web3_builder'
        );
      } else {
        this.notifications = [];
      }
    } catch {
      this.notifications = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications.slice(0, 30)));
    } catch {}
  }

  private initBroadcastChannel() {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel('portfolio_activity_channel');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'NEW_LIKE') {
            this.handleIncomingNotification(event.data.notification, false);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            this.notifications = JSON.parse(e.newValue);
            this.notifyListeners();
          } catch {}
        }
      });
    }
  }

  private initRealtimeStream() {
    if (typeof window === 'undefined') return;

    // Connect to ntfy.sh SSE stream for live cross-device / cross-visitor real-time notifications
    try {
      this.eventSource = new EventSource(`https://ntfy.sh/${NTFY_TOPIC}/sse`);
      this.eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && parsed.event === 'message' && parsed.message) {
            const notifData = JSON.parse(parsed.message);
            if (notifData && notifData.id) {
              this.handleIncomingNotification(notifData, false);
            }
          }
        } catch {
          // ignore parsing error
        }
      };
      this.eventSource.onerror = () => {
        // Silent recovery: close and let fallback handle it
        if (this.eventSource) {
          this.eventSource.close();
          // Retry after 20 seconds
          setTimeout(() => this.initRealtimeStream(), 20000);
        }
      };
    } catch (e) {
      console.warn('Realtime stream unavailable, local sync active', e);
    }
  }

  private handleIncomingNotification(notification: LikeNotification, broadcast = true) {
    // Avoid duplicates
    if (this.notifications.some((n) => n.id === notification.id)) return;

    this.notifications = [notification, ...this.notifications].slice(0, 30);
    this.saveToStorage();
    this.notifyListeners();

    // Trigger visual toast event in current window
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('portfolio_new_like_toast', { detail: notification })
      );
    }

    if (broadcast) {
      // 1. Broadcast locally across tabs
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'NEW_LIKE',
          notification,
        });
      }

      // 2. Publish globally via public realtime endpoint (fire and forget)
      try {
        fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
          method: 'POST',
          body: JSON.stringify(notification),
          headers: {
            'Content-Type': 'application/json',
          },
        }).catch(() => {});
      } catch {}
    }
  }

  public recordLike(project: { id: string; title: string; thumbnail?: string }): LikeNotification {
    const randomGuestId = Math.floor(1000 + Math.random() * 9000);
    const newNotif: LikeNotification = {
      id: `like_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId: project.id,
      projectTitle: project.title,
      projectThumbnail: project.thumbnail || '/assets/images/projects/project-portfolio.svg',
      userName: `visitor_${randomGuestId}`,
      timestamp: Date.now(),
      read: false,
    };

    this.handleIncomingNotification(newNotif, true);
    return newNotif;
  }

  public markAllAsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.saveToStorage();
    this.notifyListeners();
  }

  public clearAll() {
    this.notifications = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  public getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  public getNotifications(): LikeNotification[] {
    return [...this.notifications];
  }

  public subscribe(listener: (notifications: LikeNotification[]) => void) {
    this.listeners.add(listener);
    listener([...this.notifications]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const copy = [...this.notifications];
    this.listeners.forEach((l) => l(copy));
  }
}

export const notificationService = new NotificationService();
