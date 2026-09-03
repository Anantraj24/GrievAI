import { User, Department, Category, SLAPolicy, InstitutionalIssue, UserRole } from '../types';
import { storage } from './storage';
import { INITIAL_USERS, INITIAL_DEPARTMENTS, INITIAL_CATEGORIES, INITIAL_SLA_POLICIES, INITIAL_INSTITUTIONAL_ISSUES } from './mockData';
import { AuditService } from './auditService';
import { api } from '../api/api';

export class AdminService {
  // -------------------------------------------------------------------------
  // Live Backend Async Endpoints
  // -------------------------------------------------------------------------

  public static async getUsersAsync(): Promise<User[]> {
    try {
      const res = await api.get('/admin/users');
      if (Array.isArray(res.data)) {
        const liveUsers: User[] = res.data.map((u: any) => ({
          id: u.id,
          name: u.full_name,
          email: u.email,
          role: (u.role?.toLowerCase() as UserRole) || 'student',
          department: u.department || 'General',
          avatar: u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.email}`,
          status: u.is_active ? 'active' : 'suspended',
          isActive: u.is_active,
          joinedDate: u.created_at ? u.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
        }));
        storage.set('grievai_users', liveUsers);
        return liveUsers;
      }
    } catch (err) {
      console.warn('Could not load users from live backend admin router:', err);
    }
    return this.getUsers();
  }

  public static async getDepartmentsAsync(): Promise<Department[]> {
    try {
      const res = await api.get('/admin/departments');
      if (Array.isArray(res.data)) {
        const liveDepts: Department[] = res.data.map((d: any) => ({
          id: d.id,
          name: d.name,
          code: d.name.slice(0, 3).toUpperCase(),
          headName: 'Department Head',
          headEmail: `head@institution.edu`,
          headAuthorityName: 'Department Head',
          email: 'dept@institution.edu',
          activeCaseload: 0,
          targetResolutionHours: 24,
          slaComplianceRate: 98,
          status: d.is_active ? 'active' : 'inactive',
        }));
        storage.set('grievai_departments', liveDepts);
        return liveDepts;
      }
    } catch (err) {
      console.warn('Could not load departments from live backend:', err);
    }
    return this.getDepartments();
  }

  public static async getCategoriesAsync(): Promise<Category[]> {
    try {
      const res = await api.get('/admin/categories');
      if (Array.isArray(res.data)) {
        const liveCats: Category[] = res.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          departmentId: c.id,
          departmentName: c.name,
          defaultPriority: c.default_priority_policy || 'MEDIUM',
          subcategories: (c.subcategories || []).map((s: any) => s.name),
        }));
        storage.set('grievai_categories', liveCats);
        return liveCats;
      }
    } catch (err) {
      console.warn('Could not load categories from live backend:', err);
    }
    return this.getCategories();
  }

  public static async getInstitutionalIssuesAsync(): Promise<InstitutionalIssue[]> {
    try {
      const res = await api.get('/admin/institutional-issues');
      if (Array.isArray(res.data)) {
        const liveIssues: InstitutionalIssue[] = res.data.map((item: any) => {
          const linked = (item.members || []).map((m: any) => m.grievance_code || m.grievance_id);
          const rawStatus = (item.status || '').toLowerCase();
          const mappedStatus: 'Investigating' | 'Mitigation In Progress' | 'Resolved' = 
            rawStatus.includes('resolved') ? 'Resolved' :
            rawStatus.includes('progress') ? 'Mitigation In Progress' : 'Investigating';

          return {
            id: item.id,
            title: item.title,
            description: `Cluster issue affecting ${item.related_grievance_count || linked.length} complaints.`,
            department: item.category_name || 'Campus Infrastructure',
            category: item.category_name || 'General',
            location: (item.affected_locations && item.affected_locations[0]) || 'Campus Wide',
            affectedStudentsCount: item.related_grievance_count || linked.length,
            linkedGrievanceIds: linked,
            grievanceIds: linked,
            severity: 'CRITICAL',
            status: mappedStatus,
            detectedAt: item.first_reported_at || new Date().toISOString(),
            lastUpdated: item.last_reported_at || new Date().toISOString(),
            recommendedMitigation: 'Deploy engineering taskforce for comprehensive audit and repair.',
          };
        });
        storage.set('grievai_institutional_issues', liveIssues);
        return liveIssues;
      }
    } catch (err) {
      console.warn('Could not load institutional issues from live backend:', err);
    }
    return this.getInstitutionalIssues();
  }

  // -------------------------------------------------------------------------
  // Synchronous Methods with local fallback
  // -------------------------------------------------------------------------

  public static getUsers(): User[] {
    return storage.get<User[]>('grievai_users', INITIAL_USERS);
  }

  public static saveUser(user: User): User {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    let updated: User[];
    if (index >= 0) {
      updated = [...users];
      updated[index] = user;
    } else {
      updated = [user, ...users];
    }
    storage.set('grievai_users', updated);
    AuditService.log({
      actorId: 'admin',
      actorName: 'Admin',
      actorRole: 'admin',
      action: index >= 0 ? 'UPDATE_USER' : 'CREATE_USER',
      details: `User "${user.name}" (${user.email}) saved with role ${user.role}.`,
    });
    return user;
  }

  public static createUser(userData: Partial<User> & { name: string; email: string; role: any }): User {
    const newUser: User = {
      department: 'Estate & Campus Facilities',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      designation: 'Staff',
      phone: '+91 90000 00000',
      joinedDate: new Date().toISOString().slice(0, 10),
      status: 'active',
      isActive: true,
      ...userData,
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };
    return this.saveUser(newUser);
  }

  public static updateUser(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return null;
    const merged = { ...user, ...updates };
    return this.saveUser(merged);
  }

  public static toggleUserStatus(userId: string): User | null {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return null;
    user.status = user.status === 'active' ? 'suspended' : 'active';
    user.isActive = user.status === 'active';
    this.saveUser(user);
    return user;
  }

  public static getDepartments(): Department[] {
    return storage.get<Department[]>('grievai_departments', INITIAL_DEPARTMENTS);
  }

  public static saveDepartment(dept: Department): Department {
    const depts = this.getDepartments();
    const index = depts.findIndex((d) => d.id === dept.id);
    let updated: Department[];
    if (index >= 0) {
      updated = [...depts];
      updated[index] = dept;
    } else {
      updated = [dept, ...depts];
    }
    storage.set('grievai_departments', updated);
    AuditService.log({
      actorId: 'admin',
      actorName: 'Admin',
      actorRole: 'admin',
      action: index >= 0 ? 'UPDATE_DEPARTMENT' : 'CREATE_DEPARTMENT',
      details: `Department "${dept.name}" (${dept.code}) updated.`,
    });
    return dept;
  }

  public static updateDepartment(deptId: string, updates: Partial<Department>): Department | null {
    const depts = this.getDepartments();
    const dept = depts.find((d) => d.id === deptId);
    if (!dept) return null;
    const merged = { ...dept, ...updates };
    return this.saveDepartment(merged);
  }

  public static getCategories(): Category[] {
    return storage.get<Category[]>('grievai_categories', INITIAL_CATEGORIES);
  }

  public static saveCategory(cat: Category): Category {
    const cats = this.getCategories();
    const index = cats.findIndex((c) => c.id === cat.id);
    let updated: Category[];
    if (index >= 0) {
      updated = [...cats];
      updated[index] = cat;
    } else {
      updated = [cat, ...cats];
    }
    storage.set('grievai_categories', updated);
    return cat;
  }

  public static getSLAPolicies(): SLAPolicy[] {
    return storage.get<SLAPolicy[]>('grievai_sla_policies', INITIAL_SLA_POLICIES);
  }

  public static saveSLAPolicies(policies: SLAPolicy[]): void {
    storage.set('grievai_sla_policies', policies);
    AuditService.log({
      actorId: 'admin',
      actorName: 'Admin',
      actorRole: 'admin',
      action: 'UPDATE_SLA_POLICIES',
      details: 'SLA threshold policies modified.',
    });
  }

  public static getInstitutionalIssues(): InstitutionalIssue[] {
    return storage.get<InstitutionalIssue[]>('grievai_institutional_issues', INITIAL_INSTITUTIONAL_ISSUES);
  }

  public static getInstitutionalIssueById(id: string): InstitutionalIssue | undefined {
    return this.getInstitutionalIssues().find((i) => i.id === id);
  }

  public static saveInstitutionalIssue(issue: InstitutionalIssue): InstitutionalIssue {
    const issues = this.getInstitutionalIssues();
    const index = issues.findIndex((i) => i.id === issue.id);
    let updated: InstitutionalIssue[];
    if (index >= 0) {
      updated = [...issues];
      updated[index] = { ...issue, lastUpdated: new Date().toISOString() };
    } else {
      updated = [issue, ...issues];
    }
    storage.set('grievai_institutional_issues', updated);
    AuditService.log({
      actorId: 'admin',
      actorName: 'Admin',
      actorRole: 'admin',
      action: 'UPDATE_INSTITUTIONAL_ISSUE',
      details: `Campus Cluster ${issue.id} ("${issue.title}") updated. Status: ${issue.status}.`,
    });
    return issue;
  }
}
