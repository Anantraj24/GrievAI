from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.schemas.enums import GrievanceStatus, PriorityLevel, RelationType

class GrievanceBase(BaseModel):
    title: Optional[str] = None
    description: str = Field(..., description="The raw natural-language complaint")
    location: Optional[str] = None
    incident_date: Optional[datetime] = None
    is_anonymous: bool = False

class GrievanceCreate(GrievanceBase):
    category_id: Optional[UUID] = None
    subcategory_id: Optional[UUID] = None

class StatusUpdate(BaseModel):
    status: GrievanceStatus
    reason: Optional[str] = None

class AssignmentUpdate(BaseModel):
    assigned_to_user_id: UUID
    department_id: Optional[UUID] = None
    notes: Optional[str] = None

class CommentCreate(BaseModel):
    content: str = Field(..., min_length=1)
    is_internal_only: bool = False

class CommentResponse(BaseModel):
    id: UUID
    author_id: UUID
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    content: str
    is_internal_only: bool = False
    created_at: datetime

    class Config:
        from_attributes = True

class EvidenceResponse(BaseModel):
    id: UUID
    original_filename: str
    mime_type: str
    file_size_bytes: int
    storage_key: str
    is_resolution_evidence: bool = False
    created_at: datetime

    class Config:
        from_attributes = True

class StatusHistoryResponse(BaseModel):
    id: UUID
    actor_id: UUID
    actor_name: Optional[str] = None
    previous_status: Optional[str] = None
    new_status: str
    reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AIAnalysisResult(BaseModel):
    language: Optional[str] = None
    issue_summary: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    location: Optional[str] = None
    duration_days: Optional[int] = None
    previously_reported: Optional[bool] = None
    reported_to: Optional[str] = None
    affected_scope: Optional[str] = None
    safety_signal: bool = False
    essential_service_signal: bool = False
    confidence: float = Field(..., ge=0, le=1)

class FeedbackCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    tags: Optional[List[str]] = None
    feedback_text: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: UUID
    rating: int
    tags: Optional[List[str]] = None
    feedback_text: Optional[str] = None
    submitted_at: datetime

    class Config:
        from_attributes = True

class ResponseDraftRequest(BaseModel):
    tone: Optional[str] = "Formal" # Formal, Empathetic, Direct

class ResponseDraftResponse(BaseModel):
    draft: str
    tone: str

class RelatedGrievanceResponse(BaseModel):
    id: UUID
    grievance_code: str
    title: Optional[str] = None
    description: str
    status: str
    category: Optional[str] = None
    similarity_score: float
    relation_type: str
    created_at: datetime

class GrievanceResponse(GrievanceBase):
    id: UUID
    grievance_code: str
    student_id: UUID
    student_name: Optional[str] = None
    student_email: Optional[str] = None
    status: str
    priority: Optional[str] = None
    priority_reasons: Optional[List[str]] = None
    category_id: Optional[UUID] = None
    category_name: Optional[str] = None
    subcategory_id: Optional[UUID] = None
    subcategory_name: Optional[str] = None
    assigned_department_id: Optional[UUID] = None
    assigned_department_name: Optional[str] = None
    assigned_authority_id: Optional[UUID] = None
    assigned_authority_name: Optional[str] = None
    sla_deadline: Optional[datetime] = None
    sla_breached: bool = False
    ai_analysis: Optional[AIAnalysisResult] = None
    comments: List[CommentResponse] = []
    evidence: List[EvidenceResponse] = []
    status_history: List[StatusHistoryResponse] = []
    feedback: Optional[FeedbackResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class GrievanceListResponse(BaseModel):
    total: int
    items: List[GrievanceResponse]
    page: int = 1
    page_size: int = 20
