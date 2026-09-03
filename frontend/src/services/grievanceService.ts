import { Grievance, GrievanceStatus, PriorityLevel, FeedbackRating, UserRole } from '../types';
import { storage } from './storage';
import { INITIAL_GRIEVANCES } from './mockData';
import { AIEngine } from './aiEngine';
import { NotificationService } from './notificationService';
import { AuditService } from './auditService';
import { api } from '../api/api';

const STORAGE_KEY = 'grievai_grievances';

export function mapBackendGrievance(bg: any): Grievance {
  const statusStr = (bg.status || 'SUBMITTED').toLowerCase();
  const normalizedStatus: GrievanceStatus = 
    statusStr === 'in_progress' ? 'in_progress' :
    statusStr === 'under_review' ? 'under_review' :
    statusStr === 'information_requested' ? 'information_requested' :
    statusStr === 'resolved' ? 'resolved' :
    statusStr === 'escalated' ? 'escalated' :
    statusStr === 'duplicate_closed' ? 'duplicate_closed' :
    statusStr === 'closed' ? 'closed' : 'submitted';

  return {
    id: bg.grievance_code || bg.id,
    trackingCode: bg.grievance_code || `TRK-${bg.id?.slice(0, 8)}`,
    title: bg.title || 'Untitled Grievance',
    description: bg.description || '',
    category: bg.category_id || 'Estate & Campus Facilities',
    subcategory: bg.subcategory_id || 'General Support',
    location: bg.location || 'Main Campus',
    studentId: bg.student_id || 'student',
    studentName: bg.is_anonymous ? 'Anonymous Student' : (bg.student_name || 'Alice Student'),
    studentEmail: bg.is_anonymous ? 'anonymous@institution.edu' : (bg.student_email || 'student1@example.com'),
    assignedAuthorityId: bg.assigned_authority_id || 'authority',
    assignedAuthorityName: bg.assigned_authority_name || 'Dr. Authority',
    department: bg.department_id || 'Estate & Campus Facilities',
    priority: (bg.priority || 'MEDIUM') as PriorityLevel,
    status: normalizedStatus,
    createdAt: bg.created_at || new Date().toISOString(),
    updatedAt: bg.updated_at || new Date().toISOString(),
    slaDeadline: bg.sla_deadline || new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    slaBreached: bg.sla_breached || false,
    aiAnalysis: AIEngine.analyze(bg.description || '', bg.location),
    timeline: (bg.status_history || []).map((sh: any, idx: number) => ({
      id: sh.id || `sh_${idx}`,
      title: `Status: ${sh.to_status}`,
      description: sh.reason || `Status updated to ${sh.to_status}`,
      timestamp: sh.created_at || new Date().toISOString(),
      actor: sh.changed_by_user_id || 'System Protocol',
      actorRole: 'authority',
      type: 'status_change',
    })),
    comments: (bg.comments || []).map((c: any) => ({
      id: c.id,
      authorId: c.author_id,
      authorName: c.author_name || 'User',
      authorRole: (c.author_role || 'student') as UserRole,
      authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${c.author_id}`,
      content: c.content,
      timestamp: c.created_at,
      isInternalOnly: c.is_internal || false,
    })),
    attachments: (bg.evidence || []).map((ev: any) => ({
      id: ev.id,
      name: ev.file_name,
      size: `${Math.round((ev.file_size_bytes || 1024) / 1024)} KB`,
      type: ev.mime_type || 'image/png',
      url: ev.file_url || '',
      uploadedAt: ev.uploaded_at || new Date().toISOString(),
    })),
  };
}

export class GrievanceService {
  /**
   * Fetch all grievances asynchronously from FastAPI backend, updating cache.
   */
  public static async getAllAsync(filters?: { status?: string; department_id?: string; category_id?: string }): Promise<Grievance[]> {
    try {
      const res = await api.get('/grievances', { params: filters });
      if (Array.isArray(res.data)) {
        const liveGrievances = res.data.map(mapBackendGrievance);
        // Merge or replace local storage cache
        storage.set(STORAGE_KEY, liveGrievances);
        return liveGrievances;
      }
    } catch (err) {
      console.warn('Backend unavailable, reading from local storage:', err);
    }
    return this.getAll();
  }

  /**
   * Fetch a single grievance by ID asynchronously from FastAPI backend.
   */
  public static async getByIdAsync(id: string): Promise<Grievance | undefined> {
    try {
      const res = await api.get(`/grievances/${id}`);
      if (res.data) {
        const item = mapBackendGrievance(res.data);
        return item;
      }
    } catch (err) {
      console.warn(`Could not fetch grievance ${id} from live API:`, err);
    }
    return this.getById(id);
  }

  /**
   * Create grievance via live FastAPI backend.
   */
  public static async createAsync(data: {
    title?: string;
    description: string;
    location?: string;
    category_id?: string;
    subcategory_id?: string;
    is_anonymous?: boolean;
  }): Promise<Grievance | null> {
    try {
      const res = await api.post('/grievances', {
        title: data.title || data.description.slice(0, 60),
        description: data.description,
        location: data.location || 'Campus',
        category_id: data.category_id,
        subcategory_id: data.subcategory_id,
        is_anonymous: data.is_anonymous || false,
      });

      if (res.data) {
        const created = mapBackendGrievance(res.data);
        const currentList = this.getAll();
        storage.set(STORAGE_KEY, [created, ...currentList]);
        return created;
      }
    } catch (err) {
      console.error('Failed to create grievance on live backend:', err);
    }
    return null;
  }

  /**
   * Update status via live FastAPI backend.
   */
  public static async updateStatusAsync(id: string, status: string, reason?: string): Promise<boolean> {
    try {
      await api.post(`/grievances/${id}/status`, {
        status: status.toUpperCase(),
        reason: reason || `Updated to ${status}`,
      });
      return true;
    } catch (err) {
      console.error('Failed to update status on backend:', err);
      return false;
    }
  }

  /**
   * Add comment via live FastAPI backend.
   */
  public static async addCommentAsync(id: string, content: string, isInternal: boolean = false): Promise<any> {
    try {
      const res = await api.post(`/grievances/${id}/comments`, {
        content,
        is_internal: isInternal,
      });
      return res.data;
    } catch (err) {
      console.error('Failed to post comment to backend:', err);
      return null;
    }
  }

  /**
   * Submit feedback via live FastAPI backend.
   */
  public static async submitFeedbackAsync(id: string, rating: number, feedbackText?: string): Promise<boolean> {
    try {
      await api.post(`/grievances/${id}/feedback`, {
        rating,
        feedback_text: feedbackText || '',
      });
      return true;
    } catch (err) {
      console.error('Failed to post feedback to backend:', err);
      return false;
    }
  }

  /**
   * Fetch AI analysis results from live FastAPI backend.
   */
  public static async getAIAnalysisAsync(id: string): Promise<any> {
    try {
      const res = await api.get(`/grievances/${id}/ai-analysis`);
      return res.data;
    } catch (err) {
      console.warn('AI analysis not available from backend yet:', err);
      return null;
    }
  }

  /**
   * Fetch related semantic duplicate grievances from live backend.
   */
  public static async getRelatedAsync(id: string): Promise<any[]> {
    try {
      const res = await api.get(`/grievances/${id}/related`);
      return res.data || [];
    } catch (err) {
      console.warn('Semantic related scan failed:', err);
      return [];
    }
  }

  // -------------------------------------------------------------------------
  // Synchronous / Cache Methods for compatibility
  // -------------------------------------------------------------------------

  public static getAll(): Grievance[] {
    const list = storage.get<Grievance[]>(STORAGE_KEY, INITIAL_GRIEVANCES);
    return list.map((g) => {
      if (g.studentName === 'Anant Sharma') {
        return { ...g, studentName: 'AnantRaj', studentEmail: 'student1@example.com' };
      }
      return g;
    });
  }

  public static getById(id: string): Grievance | undefined {
    const all = this.getAll();
    return all.find((g) => g.id.toLowerCase() === id.toLowerCase());
  }

  public static getByStudent(studentId?: string): Grievance[] {
    const all = this.getAll();
    if (!studentId) return all;
    return all.filter((g) => g.studentId === studentId || g.studentEmail.toLowerCase().includes('student1') || g.studentEmail.toLowerCase().includes('anant'));
  }

  public static getByDepartment(department?: string): Grievance[] {
    const all = this.getAll();
    if (!department) return all;
    return all.filter((g) => g.department === department);
  }

  public static create(data: {
    title?: string;
    description: string;
    location?: string;
    category?: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    attachments?: Array<{ name: string; size: string; type: string; url: string }>;
  }): Grievance {
    const all = this.getAll();
    const count = all.length + 101;
    const caseId = `GRV-2024-${count}`;
    const trackingCode = `TRK-${Math.floor(1000 + Math.random() * 9000)}-${caseId.slice(-2)}`;

    // Run local AI analysis
    const aiAnalysis = AIEngine.analyze(data.description, data.location);

    const hours = aiAnalysis.priority === 'CRITICAL' ? 12 : aiAnalysis.priority === 'HIGH' ? 24 : 48;
    const slaDeadline = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    const title = data.title || aiAnalysis.summary.slice(0, 70);
    const category = data.category || aiAnalysis.category;
    const subcategory = aiAnalysis.subcategory;
    const department = aiAnalysis.recommendedDepartment;

    const newGrievance: Grievance = {
      id: caseId,
      trackingCode,
      title,
      description: data.description,
      category,
      subcategory,
      location: data.location || 'Main Campus',
      studentId: data.studentId,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      assignedAuthorityId: 'usr_authority_01',
      assignedAuthorityName: 'Dr. Authority',
      department,
      priority: aiAnalysis.priority,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaDeadline,
      slaBreached: false,
      aiAnalysis,
      attachments: (data.attachments || []).map((att, index) => ({
        ...att,
        id: `att_${Date.now()}_${index}`,
        uploadedAt: new Date().toISOString(),
      })),
      comments: [],
      timeline: [
        {
          id: `tl_${Date.now()}_1`,
          title: 'Grievance Submitted',
          description: `Case registered by ${data.studentName}.`,
          timestamp: new Date().toISOString(),
          actor: data.studentName,
          actorRole: 'student',
          type: 'submission',
        },
        {
          id: `tl_${Date.now()}_2`,
          title: 'AI Intelligence Triage Completed',
          description: `Auto-classified as ${aiAnalysis.priority} (${aiAnalysis.confidenceScore}% confidence) -> ${department}.`,
          timestamp: new Date(Date.now() + 1000).toISOString(),
          actor: 'GrievAI Engine',
          actorRole: 'system',
          type: 'ai_analysis',
        }
      ],
      officialDraftResponse: AIEngine.generateOfficialDraft({
        id: caseId,
        title,
        description: data.description,
        location: data.location || 'Campus',
        category,
        department,
        studentName: data.studentName,
        assignedAuthorityName: 'Dr. Authority',
      } as any),
    };

    storage.set(STORAGE_KEY, [newGrievance, ...all]);

    // Proactively sync with FastAPI backend
    this.createAsync({
      title,
      description: data.description,
      location: data.location,
    }).catch((e) => console.warn('Sync to backend failed:', e));

    return newGrievance;
  }

  public static updateStatus(id: string, status: GrievanceStatus, actorName: string, actorRole: UserRole, note?: string): Grievance | null {
    const all = this.getAll();
    const grievance = all.find((g) => g.id.toLowerCase() === id.toLowerCase());
    if (!grievance) return null;

    const oldStatus = grievance.status;
    grievance.status = status;
    grievance.updatedAt = new Date().toISOString();

    const timelineTitle = 
      status === 'in_progress' ? 'Status: In Progress' :
      status === 'under_review' ? 'Status: Under Review' :
      status === 'information_requested' ? 'Information Requested' :
      status === 'resolved' ? 'Grievance Resolved' :
      status === 'escalated' ? 'Case Escalated' :
      status === 'duplicate_closed' ? 'Closed as Duplicate' :
      `Status changed to ${status}`;

    grievance.timeline.push({
      id: `tl_${Date.now()}`,
      title: timelineTitle,
      description: note || `Status updated from ${oldStatus.toUpperCase()} to ${status.toUpperCase()} by ${actorName}.`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      actorRole,
      type: status === 'resolved' ? 'resolution' : status === 'escalated' ? 'escalation' : 'status_change',
    });

    storage.set(STORAGE_KEY, all);

    // Sync with backend
    this.updateStatusAsync(id, status, note).catch((e) => console.warn('Sync status to backend failed:', e));

    return grievance;
  }

  public static addComment(id: string, authorId: string, authorName: string, authorRole: UserRole, authorAvatar: string, content: string, isInternalOnly: boolean = false): Grievance | null {
    const all = this.getAll();
    const grievance = all.find((g) => g.id.toLowerCase() === id.toLowerCase());
    if (!grievance) return null;

    const newComment = {
      id: `cmt_${Date.now()}`,
      authorId,
      authorName,
      authorRole,
      authorAvatar,
      content,
      timestamp: new Date().toISOString(),
      isInternalOnly,
    };

    grievance.comments.push(newComment);
    grievance.updatedAt = new Date().toISOString();

    grievance.timeline.push({
      id: `tl_${Date.now()}`,
      title: isInternalOnly ? 'Internal Note Added' : 'Message Posted',
      description: `${authorName} (${authorRole}): "${content.slice(0, 60)}..."`,
      timestamp: new Date().toISOString(),
      actor: authorName,
      actorRole: authorRole,
      type: 'comment',
    });

    storage.set(STORAGE_KEY, all);

    // Sync with backend
    this.addCommentAsync(id, content, isInternalOnly).catch((e) => console.warn('Sync comment to backend failed:', e));

    return grievance;
  }

  public static resolve(id: string, actorName: string, resolutionSummary: string, rootCauseCategory: string, officialResponse?: string): Grievance | null {
    const all = this.getAll();
    const grievance = all.find((g) => g.id.toLowerCase() === id.toLowerCase());
    if (!grievance) return null;

    grievance.status = 'resolved';
    grievance.resolutionSummary = resolutionSummary;
    grievance.rootCauseCategory = rootCauseCategory;
    if (officialResponse) {
      grievance.officialDraftResponse = officialResponse;
      grievance.comments.push({
        id: `cmt_res_${Date.now()}`,
        authorId: 'authority',
        authorName: actorName,
        authorRole: 'authority',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: officialResponse,
        timestamp: new Date().toISOString(),
      });
    }

    grievance.timeline.push({
      id: `tl_${Date.now()}`,
      title: 'Grievance Resolved',
      description: `Resolution summary: ${resolutionSummary}. Root Cause: ${rootCauseCategory}.`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      actorRole: 'authority',
      type: 'resolution',
    });

    storage.set(STORAGE_KEY, all);

    // Sync with backend
    this.updateStatusAsync(id, 'RESOLVED', resolutionSummary).catch((e) => console.warn('Sync resolution to backend failed:', e));

    return grievance;
  }

  public static escalate(id: string, actorName: string, tier: 1 | 2 | 3, reason: string, priorityOverride?: PriorityLevel): Grievance | null {
    const all = this.getAll();
    const grievance = all.find((g) => g.id.toLowerCase() === id.toLowerCase());
    if (!grievance) return null;

    grievance.status = 'escalated';
    grievance.isEscalated = true;
    grievance.escalationTier = tier;
    grievance.escalationReason = reason;
    if (priorityOverride) {
      grievance.priority = priorityOverride;
    }

    const tierLabel = tier === 3 ? 'Tier 3 (Institutional Ombudsman)' : tier === 2 ? 'Tier 2 (Dean / Head of Department)' : 'Tier 1 (Senior Authority Review)';

    grievance.timeline.push({
      id: `tl_${Date.now()}`,
      title: `Escalated to ${tierLabel}`,
      description: `Escalated by ${actorName}. Reason: ${reason}.`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      actorRole: 'authority',
      type: 'escalation',
    });

    storage.set(STORAGE_KEY, all);

    // Sync with backend
    this.updateStatusAsync(id, 'ESCALATED', `Tier ${tier}: ${reason}`).catch((e) => console.warn('Sync escalation to backend failed:', e));

    return grievance;
  }

  public static requestInfo(id: string, actorName: string, message: string): Grievance | null {
    const all = this.getAll();
    const grievance = all.find((g) => g.id.toLowerCase() === id.toLowerCase());
    if (!grievance) return null;

    grievance.status = 'information_requested';
    grievance.infoRequestedText = message;

    grievance.comments.push({
      id: `cmt_info_${Date.now()}`,
      authorId: 'authority',
      authorName: actorName,
      authorRole: 'authority',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      content: `⚠️ Action Required: ${message}`,
      timestamp: new Date().toISOString(),
    });

    grievance.timeline.push({
      id: `tl_${Date.now()}`,
      title: 'Information Requested from Student',
      description: `Authority request: "${message}"`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      actorRole: 'authority',
      type: 'status_change',
    });

    storage.set(STORAGE_KEY, all);

    // Sync with backend
    this.updateStatusAsync(id, 'PENDING_REVIEW', message).catch((e) => console.warn('Sync info request to backend failed:', e));

    return grievance;
  }

  public static mergeDuplicate(id: string, primaryCaseId: string, actorName: string, note?: string): Grievance | null {
    const all = this.getAll();
    const grievance = all.find((g) => g.id.toLowerCase() === id.toLowerCase());
    const primaryGrievance = all.find((g) => g.id.toLowerCase() === primaryCaseId.toLowerCase());
    if (!grievance || !primaryGrievance) return null;

    grievance.status = 'duplicate_closed';
    grievance.mergedIntoId = primaryCaseId;

    if (!primaryGrievance.duplicateOf) primaryGrievance.duplicateOf = [];
    primaryGrievance.duplicateOf.push(id);

    grievance.timeline.push({
      id: `tl_${Date.now()}`,
      title: 'Closed as Duplicate',
      description: `Merged into parent case #${primaryCaseId} by ${actorName}. ${note || ''}`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      actorRole: 'authority',
      type: 'status_change',
    });

    storage.set(STORAGE_KEY, all);

    // Sync with backend
    this.updateStatusAsync(id, 'CLOSED', `Merged into ${primaryCaseId}: ${note || ''}`).catch((e) => console.warn('Sync merge duplicate to backend failed:', e));

    return grievance;
  }

  public static submitFeedback(id: string, feedback: FeedbackRating): Grievance | null {
    const all = this.getAll();
    const grievance = all.find((g) => g.id.toLowerCase() === id.toLowerCase());
    if (!grievance) return null;

    grievance.feedback = feedback;
    grievance.timeline.push({
      id: `tl_fb_${Date.now()}`,
      title: 'Student Feedback Submitted',
      description: `Rated ${feedback.rating}/5 stars. "${feedback.feedbackText}"`,
      timestamp: new Date().toISOString(),
      actor: grievance.studentName,
      actorRole: 'student',
      type: 'feedback',
    });

    storage.set(STORAGE_KEY, all);

    // Sync with backend
    this.submitFeedbackAsync(id, feedback.rating, feedback.feedbackText).catch((e) => console.warn('Sync feedback to backend failed:', e));

    return grievance;
  }
}
