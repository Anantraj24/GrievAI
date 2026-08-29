import { Grievance, GrievanceStatus, PriorityLevel, FeedbackRating, UserRole } from '../types';
import { storage } from './storage';
import { INITIAL_GRIEVANCES } from './mockData';
import { AIEngine } from './aiEngine';
import { NotificationService } from './notificationService';
import { AuditService } from './auditService';

const STORAGE_KEY = 'grievai_grievances';

export class GrievanceService {
  public static getAll(): Grievance[] {
    const list = storage.get<Grievance[]>(STORAGE_KEY, INITIAL_GRIEVANCES);
    return list.map((g) => {
      if (g.studentName === 'Anant Sharma') {
        return { ...g, studentName: 'AnantRaj', studentEmail: 'anantraj@institution.edu' };
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
    return all.filter((g) => g.studentId === studentId || g.studentEmail.toLowerCase().includes('anantraj') || g.studentEmail.toLowerCase().includes('anant'));
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

    // Run AI analysis
    const aiAnalysis = AIEngine.analyze(data.description, data.location);

    // Determine SLA deadline based on priority
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
      assignedAuthorityName: 'Dr. Ramesh Sharma',
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
        },
        {
          id: `tl_${Date.now()}_3`,
          title: 'Assigned to Authority',
          description: `Assigned to Dr. Ramesh Sharma (${department}).`,
          timestamp: new Date(Date.now() + 2000).toISOString(),
          actor: 'Dr. Ramesh Sharma',
          actorRole: 'authority',
          type: 'assignment',
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
        assignedAuthorityName: 'Dr. Ramesh Sharma',
      } as any),
    };

    storage.set(STORAGE_KEY, [newGrievance, ...all]);

    // Dispatch Notifications
    NotificationService.create({
      targetRole: 'authority',
      title: `New ${newGrievance.priority} Case: ${newGrievance.id}`,
      message: `${data.studentName} filed "${newGrievance.title.slice(0, 50)}...". Routed to ${department}.`,
      grievanceId: newGrievance.id,
      type: newGrievance.priority === 'CRITICAL' ? 'alert' : 'info',
      link: `/authority/workspace/${newGrievance.id}`,
    });

    NotificationService.create({
      userId: data.studentId,
      targetRole: 'student',
      title: `Case ${newGrievance.id} Registered Successfully`,
      message: `Your grievance has been analyzed by AI and assigned to ${department}. Tracking Code: ${trackingCode}.`,
      grievanceId: newGrievance.id,
      type: 'success',
      link: `/student/grievance/${newGrievance.id}`,
    });

    // Audit Log
    AuditService.log({
      actorId: data.studentId,
      actorName: data.studentName,
      actorRole: 'student',
      action: 'CREATE_GRIEVANCE',
      grievanceId: newGrievance.id,
      details: `Filed grievance "${title}" [${newGrievance.priority}]. Category: ${category}.`,
    });

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

    // Notify Student
    NotificationService.create({
      userId: grievance.studentId,
      targetRole: 'student',
      title: `Grievance #${grievance.id} Status Updated`,
      message: `${actorName} updated status to "${status.replace('_', ' ').toUpperCase()}". ${note ? `Note: ${note}` : ''}`,
      grievanceId: grievance.id,
      type: status === 'resolved' ? 'success' : status === 'escalated' ? 'warning' : 'info',
      link: status === 'resolved' ? `/student/rate/${grievance.id}` : `/student/grievance/${grievance.id}`,
    });

    // Audit Log
    AuditService.log({
      actorId: actorName,
      actorName,
      actorRole,
      action: 'STATUS_CHANGE',
      grievanceId: grievance.id,
      details: `Changed status ${oldStatus} -> ${status}. ${note || ''}`,
    });

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

    if (!isInternalOnly) {
      const isStudent = authorRole === 'student';
      NotificationService.create({
        userId: isStudent ? grievance.assignedAuthorityId : grievance.studentId,
        targetRole: isStudent ? 'authority' : 'student',
        title: `New message on Case #${grievance.id}`,
        message: `${authorName}: "${content.slice(0, 80)}..."`,
        grievanceId: grievance.id,
        type: 'info',
        link: isStudent ? `/authority/workspace/${grievance.id}` : `/student/grievance/${grievance.id}`,
      });
    }

    AuditService.log({
      actorId: authorId,
      actorName: authorName,
      actorRole: authorRole,
      action: isInternalOnly ? 'ADD_INTERNAL_NOTE' : 'POST_COMMENT',
      grievanceId: grievance.id,
      details: `Comment added by ${authorName}.`,
    });

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
      // Add as comment from authority
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

    NotificationService.create({
      userId: grievance.studentId,
      targetRole: 'student',
      title: `Case #${grievance.id} Has Been Resolved`,
      message: `${actorName} has resolved your case. Click to review the resolution and rate your experience.`,
      grievanceId: grievance.id,
      type: 'success',
      link: `/student/rate/${grievance.id}`,
    });

    AuditService.log({
      actorId: actorName,
      actorName,
      actorRole: 'authority',
      action: 'RESOLVE_GRIEVANCE',
      grievanceId: grievance.id,
      details: `Resolved with summary: "${resolutionSummary}" [${rootCauseCategory}].`,
    });

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

    NotificationService.create({
      targetRole: 'admin',
      title: `Escalation Alert: Case #${grievance.id} [${tierLabel}]`,
      message: `${actorName} escalated case: "${reason}". Requires administrative priority.`,
      grievanceId: grievance.id,
      type: 'alert',
      link: `/admin/dashboard`,
    });

    NotificationService.create({
      userId: grievance.studentId,
      targetRole: 'student',
      title: `Case #${grievance.id} Escalated`,
      message: `Your grievance has been escalated to higher administration (${tierLabel}) for expedited resolution.`,
      grievanceId: grievance.id,
      type: 'warning',
      link: `/student/grievance/${grievance.id}`,
    });

    AuditService.log({
      actorId: actorName,
      actorName,
      actorRole: 'authority',
      action: 'ESCALATE_GRIEVANCE',
      grievanceId: grievance.id,
      details: `Escalated to Tier ${tier}. Reason: ${reason}.`,
    });

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

    NotificationService.create({
      userId: grievance.studentId,
      targetRole: 'student',
      title: `Action Required on Case #${grievance.id}`,
      message: `${actorName} requested clarification: "${message.slice(0, 80)}..."`,
      grievanceId: grievance.id,
      type: 'alert',
      link: `/student/grievance/${grievance.id}`,
    });

    AuditService.log({
      actorId: actorName,
      actorName,
      actorRole: 'authority',
      action: 'REQUEST_INFO',
      grievanceId: grievance.id,
      details: `Requested info from student: "${message}"`,
    });

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

    primaryGrievance.timeline.push({
      id: `tl_prim_${Date.now()}`,
      title: 'Linked Duplicate Case',
      description: `Case #${id} was merged into this master ticket.`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      actorRole: 'authority',
      type: 'status_change',
    });

    storage.set(STORAGE_KEY, all);

    NotificationService.create({
      userId: grievance.studentId,
      targetRole: 'student',
      title: `Case #${grievance.id} Merged with #${primaryCaseId}`,
      message: `Your report was identified as related to master case #${primaryCaseId} and linked for unified resolution.`,
      grievanceId: primaryCaseId,
      type: 'info',
      link: `/student/grievance/${primaryCaseId}`,
    });

    AuditService.log({
      actorId: actorName,
      actorName,
      actorRole: 'authority',
      action: 'MERGE_DUPLICATE',
      grievanceId: grievance.id,
      details: `Merged into parent #${primaryCaseId}.`,
    });

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

    NotificationService.create({
      targetRole: 'authority',
      title: `Feedback Received for Case #${grievance.id}`,
      message: `${grievance.studentName} gave a ${feedback.rating}-star rating: "${feedback.feedbackText.slice(0, 60)}..."`,
      grievanceId: grievance.id,
      type: 'info',
      link: `/authority/workspace/${grievance.id}`,
    });

    AuditService.log({
      actorId: grievance.studentId,
      actorName: grievance.studentName,
      actorRole: 'student',
      action: 'SUBMIT_FEEDBACK',
      grievanceId: grievance.id,
      details: `Rated ${feedback.rating}/5 stars. Tags: ${feedback.tags.join(', ')}.`,
    });

    return grievance;
  }
}
