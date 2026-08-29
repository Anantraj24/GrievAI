export type UserRole = 'student' | 'authority' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar: string;
  studentId?: string;
  designation?: string;
  phone?: string;
  joinedDate?: string;
  status: 'active' | 'suspended';
  isActive?: boolean;
}

export type GrievanceStatus = 
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'information_requested'
  | 'resolved'
  | 'escalated'
  | 'duplicate_closed'
  | 'closed';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ExtractedEntity {
  label: string;
  value: string;
  category: 'location' | 'date' | 'person' | 'equipment' | 'course' | 'policy';
}

export interface SimilarGrievance {
  id: string;
  title: string;
  category: string;
  status: GrievanceStatus;
  similarityScore: number; // 0 to 100
  submittedDate: string;
  snippet: string;
}

export interface AIAnalysisResult {
  summary: string;
  category: string;
  subcategory: string;
  confidenceScore: number; // 0 to 100
  priority: PriorityLevel;
  priorityReason: string;
  urgencyScore: number; // 1 to 10
  sentiment: 'Very Negative' | 'Negative' | 'Neutral' | 'Frustrated' | 'Constructive';
  recommendedDepartment: string;
  routingReason: string;
  extractedEntities: ExtractedEntity[];
  similarGrievances: SimilarGrievance[];
  severitySignals: string[];
  suggestedAction: string;
  analyzedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  content: string;
  timestamp: string;
  isInternalOnly?: boolean;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole | 'system';
  type: 'submission' | 'ai_analysis' | 'assignment' | 'status_change' | 'comment' | 'escalation' | 'resolution' | 'feedback';
}

export interface FeedbackRating {
  rating: number; // 1 to 5
  tags: string[]; // e.g. ["Prompt Resolution", "Helpful Staff", "Clear Communication"]
  feedbackText: string;
  submittedAt: string;
}

export interface Grievance {
  id: string; // e.g. "GRV-2024-089"
  trackingCode: string; // e.g. "TRK-9821-X"
  title: string;
  description: string;
  category: string;
  subcategory: string;
  location: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  assignedAuthorityId?: string;
  assignedAuthorityName?: string;
  department: string;
  priority: PriorityLevel;
  status: GrievanceStatus;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string; // ISO date string
  slaBreached: boolean;
  aiAnalysis: AIAnalysisResult;
  attachments: Attachment[];
  comments: Comment[];
  timeline: TimelineEvent[];
  feedback?: FeedbackRating;
  isEscalated?: boolean;
  escalationTier?: 1 | 2 | 3;
  escalationReason?: string;
  mergedIntoId?: string;
  duplicateOf?: string[];
  resolutionSummary?: string;
  rootCauseCategory?: string;
  officialDraftResponse?: string;
  infoRequestedText?: string;
}

export interface SystemNotification {
  id: string;
  userId?: string; // target user, or all if undefined
  targetRole?: UserRole;
  recipientRole?: UserRole;
  title: string;
  message: string;
  grievanceId?: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | 'system';
  action: string;
  grievanceId?: string;
  details: string;
  ipAddress?: string;
}

export interface InstitutionalIssue {
  id: string; // e.g. "ISSUE-CLUSTER-01"
  title: string;
  description: string;
  department: string;
  category: string;
  location: string;
  affectedStudentsCount: number;
  linkedGrievanceIds: string[];
  grievanceIds?: string[];
  severity: PriorityLevel;
  status: 'Investigating' | 'Mitigation In Progress' | 'Resolved';
  detectedAt: string;
  createdAt?: string;
  lastUpdated: string;
  recommendedMitigation: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName?: string;
  headEmail?: string;
  headAuthorityName?: string;
  email?: string;
  activeCaseload: number;
  targetResolutionHours: number;
  slaComplianceRate: number; // percentage
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  departmentId?: string;
  departmentName?: string;
  defaultDepartment?: string;
  subcategories: string[];
  defaultPriority?: PriorityLevel;
  slaHours?: number;
  sensitivityLevel?: 'low' | 'medium' | 'high';
}

export interface SLAPolicy {
  id: string;
  priority?: PriorityLevel;
  priorityLevel?: PriorityLevel;
  firstResponseHours: number;
  resolutionHours: number;
  autoEscalationHours?: number;
  autoEscalateOnBreach?: boolean;
  notificationFrequencyHours?: number;
}
