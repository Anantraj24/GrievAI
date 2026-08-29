import { AuditLogEntry, UserRole } from '../types';
import { storage } from './storage';
import { INITIAL_AUDIT_LOGS } from './mockData';

const STORAGE_KEY = 'grievai_audit_logs';

export class AuditService {
  public static getAll(): AuditLogEntry[] {
    return storage.get<AuditLogEntry[]>(STORAGE_KEY, INITIAL_AUDIT_LOGS);
  }

  public static log(entry: {
    actorId: string;
    actorName: string;
    actorRole: UserRole | 'system';
    action: string;
    grievanceId?: string;
    details: string;
  }): AuditLogEntry {
    const all = this.getAll();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ipAddress: '10.14.' + Math.floor(Math.random() * 50 + 1) + '.' + Math.floor(Math.random() * 200 + 1),
    };
    storage.set(STORAGE_KEY, [newEntry, ...all]);
    return newEntry;
  }
}
