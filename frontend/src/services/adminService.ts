import { User, Department, Category, SLAPolicy, InstitutionalIssue } from '../types';
import { storage } from './storage';
import { INITIAL_USERS, INITIAL_DEPARTMENTS, INITIAL_CATEGORIES, INITIAL_SLA_POLICIES, INITIAL_INSTITUTIONAL_ISSUES } from './mockData';
import { AuditService } from './auditService';

export class AdminService {
  // Users
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
      avatar: `https://images.unsplash.com/photo-${Math.floor(1500000000000 + Math.random() * 100000000)}?w=150&auto=format&fit=crop&q=80`,
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

  // Departments
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

  // Categories
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

  // SLA Policies
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

  // Institutional Issues
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
