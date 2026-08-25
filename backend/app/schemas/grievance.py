from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from .enums import GrievanceStatus, PriorityLevel

class GrievanceBase(BaseModel):
    title: Optional[str] = None
    description: str = Field(..., description="The raw natural-language complaint")
    location: Optional[str] = None
    incident_date: Optional[datetime] = None

class GrievanceCreate(GrievanceBase):
    pass

class GrievanceResponse(GrievanceBase):
    id: UUID
    grievance_code: str
    student_id: UUID
    status: GrievanceStatus
    priority: Optional[PriorityLevel] = None
    priority_reasons: Optional[List[str]] = None
    category_id: Optional[UUID] = None
    subcategory_id: Optional[UUID] = None
    assigned_department_id: Optional[UUID] = None
    assigned_authority_id: Optional[UUID] = None
    sla_deadline: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

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
