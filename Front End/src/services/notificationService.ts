export interface LikeNotification {
  id: string;
  projectId: string;
  projectTitle: string;
  projectThumbnail: string;
  userName: string;
  timestamp: number;
  read: boolean;
}

import { getSessionName, setSessionName, isOwnerUnlocked } from './visitorSession';

const STORAGE_KEY = 'portfolio_notifications_v2';
const DELETED_LIKERS_KEY = 'portfolio_deleted_likers_v1';
const NTFY_TOPIC = 'vince_quijano_portfolio_likes_live';

function isLegacyPlaceholderName(userName?: string): boolean {
  const clean = (userName || '').trim();
  if (!clean) return true;
  if (clean === 'tech_enthusiast' || clean === 'web3_builder') return true;
  if (/^visitor_\d+$/i.test(clean)) return true;
  return false;
}

// Owner status is verified by the server (OWNER_KEY) — see visitorSession.unlockOwner().
export function isOwner(): boolean {
  return isOwnerUnlocked();
}

export function getVisitorName(): string {
  return getSessionName();
}

export function setVisitorName(name: string): void {
  const trimmed = name.trim();
  if (trimmed) setSessionName(trimmed);
}

export function hasVisitorName(): boolean {
  return Boolean(getSessionName());
}

class NotificationService {
  private notifications: LikeNotification[] = [];
  private deletedLikers: Set<string> = new Set();
  private listeners: Set<(notifications: LikeNotification[]) => void> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;

  constructor() {
    this.loadDeletedLikers();
    this.loadFromStorage();
    this.initBroadcastChannel();
    this.initRealtimeStream();
    this.fetchCloudHistory();
  }

  private makeLikerKey(projectId: string, userName: string): string {
    return `${(projectId || '').trim().toLowerCase()}::${(userName || '').trim().toLowerCase()}`;
  }

  private loadDeletedLikers() {
    try {
      const raw = localStorage.getItem(DELETED_LIKERS_KEY);
      if (raw) {
        const arr: string[] = JSON.parse(raw);
        if (Array.isArray(arr)) {
          this.deletedLikers = new Set(arr);
        }
      }
    } catch {}
  }

  private saveDeletedLikers() {
    try {
      localStorage.setItem(DELETED_LIKERS_KEY, JSON.stringify(Array.from(this.deletedLikers)));
    } catch {}
  }

  public isLikerRemoved(projectId: string, userName: string): boolean {
    if (isLegacyPlaceholderName(userName)) return true;
    return (
      this.deletedLikers.has(this.makeLikerKey(projectId, userName)) ||
      this.deletedLikers.has(this.makeLikerKey('*', userName))
    );
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('portfolio_notifications_v1');
      }

      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: LikeNotification[] = JSON.parse(data);
        // Keep genuine notifications (ignore legacy mock data and removed likers)
        this.notifications = parsed.filter(
          (n) =>
            !n.id.startsWith('init_') &&
            !isLegacyPlaceholderName(n.userName) &&
            !this.isLikerRemoved(n.projectId, n.userName)
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications.slice(0, 100)));
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

  // Fetch all past likes stored in the cloud topic so historical likers are restored
  private fetchCloudHistory() {
    if (typeof window === 'undefined') return;

    fetch(`https://ntfy.sh/${NTFY_TOPIC}/json?poll=1&since=all`)
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
              const notifData = JSON.parse(item.message);
              if (notifData && notifData.type === 'DELETE_LIKE' && notifData.projectId && notifData.userName) {
                this.applyRemoveLiker(notifData.projectId, notifData.userName, false);
              } else if (
                notifData &&
                notifData.id &&
                !notifData.id.startsWith('init_') &&
                !isLegacyPlaceholderName(notifData.userName) &&
                !this.isLikerRemoved(notifData.projectId, notifData.userName)
              ) {
                this.handleIncomingNotification(notifData, false);
              }
            }
          } catch {}
        });
      })
      .catch(() => {
        // network fallback is silent
      });
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
            if (notifData && notifData.type === 'DELETE_LIKE' && notifData.projectId && notifData.userName) {
              this.applyRemoveLiker(notifData.projectId, notifData.userName, false);
            } else if (
              notifData &&
              notifData.id &&
              !notifData.id.startsWith('init_') &&
              !isLegacyPlaceholderName(notifData.userName) &&
              !this.isLikerRemoved(notifData.projectId, notifData.userName)
            ) {
              this.handleIncomingNotification(notifData, false);
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
      console.warn('Realtime stream unavailable, local sync active', e);
    }
  }

  private handleIncomingNotification(notification: LikeNotification, broadcast = true) {
    if (
      !notification ||
      isLegacyPlaceholderName(notification.userName) ||
      this.isLikerRemoved(notification.projectId, notification.userName)
    ) {
      return;
    }
    // Avoid duplicates
    if (this.notifications.some((n) => n.id === notification.id)) return;

    this.notifications = [notification, ...this.notifications].slice(0, 100);
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

  public recordLike(
    project: { id: string; title: string; thumbnail?: string },
    customUserName?: string
  ): LikeNotification | null {
    // Only real, visitor-supplied names are used — never fabricated placeholders.
    const finalUserName = customUserName?.trim() || getVisitorName();
    if (!finalUserName) return null;

    const newNotif: LikeNotification = {
      id: `like_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId: project.id,
      projectTitle: project.title,
      projectThumbnail: project.thumbnail || '/assets/images/projects/project-portfolio.svg',
      userName: finalUserName,
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

  private applyRemoveLiker(projectId: string, userName: string, broadcast = false) {
    const key = this.makeLikerKey(projectId, userName);
    this.deletedLikers.add(key);
    this.saveDeletedLikers();

    const targetName = (userName || '').trim().toLowerCase();
    const targetPid = (projectId || '').trim().toLowerCase();
    this.notifications = this.notifications.filter((n) => {
      const sameUser = (n.userName || '').trim().toLowerCase() === targetName;
      const sameProj = (n.projectId || '').trim().toLowerCase() === targetPid;
      return !(sameUser && sameProj);
    });
    this.saveToStorage();
    this.notifyListeners();

    if (broadcast) {
      try {
        fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
          method: 'POST',
          body: JSON.stringify({ type: 'DELETE_LIKE', projectId, userName, timestamp: Date.now() }),
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => {});
      } catch {}
    }
  }

  public removeLikerNotifications(projectId: string, userName: string) {
    // If a visitor is re-liking later, we can clear or keep, here owner explicitly removed them
    this.applyRemoveLiker(projectId, userName, true);
  }

  public unmarkRemovedLiker(projectId: string, userName: string) {
    const key = this.makeLikerKey(projectId, userName);
    if (this.deletedLikers.has(key)) {
      this.deletedLikers.delete(key);
      this.saveDeletedLikers();
    }
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
