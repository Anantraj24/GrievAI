import { SystemNotification, UserRole } from '../types';
import { storage } from './storage';
import { INITIAL_NOTIFICATIONS } from './mockData';

const STORAGE_KEY = 'grievai_notifications';

export class NotificationService {
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
