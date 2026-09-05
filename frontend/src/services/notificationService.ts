import { SystemNotification, UserRole } from '../types';
import { storage } from './storage';
import { INITIAL_NOTIFICATIONS } from './mockData';
import { api } from '../api/api';

const STORAGE_KEY = 'grievai_notifications';

export class NotificationService {
  /**
   * Fetch live in-app notifications from FastAPI backend.
   */
  public static async getAllAsync(unreadOnly: boolean = false): Promise<SystemNotification[]> {
    try {
      const res = await api.get('/notifications', { params: { unread_only: unreadOnly } });
      if (res.data?.items) {
        const currentRole = storage.get<UserRole>('grievai_current_role', 'student');
        const routePrefix = currentRole === 'authority' ? '/authority/workspace' : '/student/grievance';
        const liveNotifs: SystemNotification[] = res.data.items.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          title: item.event_type?.replace(/_/g, ' ') || 'Notification',
          message: item.message,
          type: item.event_type?.toLowerCase().includes('critical') ? 'alert' : 'info',
          createdAt: item.created_at,
          read: item.is_read,
          grievanceId: item.grievance_id,
          link: item.grievance_id ? `${routePrefix}/${item.grievance_id}` : undefined,
        }));
        storage.set(STORAGE_KEY, liveNotifs);
        return liveNotifs;
      }
    } catch (err) {
      console.warn('Could not fetch notifications from live backend:', err);
    }
    return this.getAll();
  }

  public static async markAsReadAsync(id: string): Promise<void> {
    try {
      await api.post(`/notifications/${id}/read`);
    } catch (err) {
      console.warn(`Could not mark notification ${id} as read on backend:`, err);
    }
    this.markAsRead(id);
  }

  public static async markAllAsReadAsync(): Promise<void> {
    try {
      await api.post('/notifications/read-all');
    } catch (err) {
      console.warn('Could not mark all notifications read on backend:', err);
    }
    const all = this.getAll();
    storage.set(STORAGE_KEY, all.map((n) => ({ ...n, read: true })));
  }

  public static getAll(): SystemNotification[] {
    return storage.get<SystemNotification[]>(STORAGE_KEY, INITIAL_NOTIFICATIONS);
  }

  public static getForUser(role: UserRole, userId?: string): SystemNotification[] {
    const all = this.getAll();
    return all.filter((n) => {
      if (n.userId && userId && n.userId === userId) return true;
      if (n.targetRole && n.targetRole === role) return true;
      return !n.targetRole && !n.userId;
    });
  }

  public static getUnreadCount(role: UserRole, userId?: string): number {
    return this.getForUser(role, userId).filter((n) => !n.read).length;
  }

  public static create(notification: Omit<SystemNotification, 'id' | 'createdAt' | 'read'>): SystemNotification {
    const all = this.getAll();
    const newNotif: SystemNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    storage.set(STORAGE_KEY, [newNotif, ...all]);
    return newNotif;
  }

  public static markAsRead(id: string): void {
    const all = this.getAll();
    const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
    storage.set(STORAGE_KEY, updated);
  }

  public static markAllAsRead(role: UserRole, userId?: string): void {
    const all = this.getAll();
    const updated = all.map((n) => {
      const belongs = (n.userId && userId && n.userId === userId) || (n.targetRole && n.targetRole === role);
      return belongs ? { ...n, read: true } : n;
    });
    storage.set(STORAGE_KEY, updated);
  }

  public static clearAll(role: UserRole, userId?: string): void {
    const all = this.getAll();
    const remaining = all.filter((n) => {
      const belongs = (n.userId && userId && n.userId === userId) || (n.targetRole && n.targetRole === role);
      return !belongs;
    });
    storage.set(STORAGE_KEY, remaining);
  }
}
