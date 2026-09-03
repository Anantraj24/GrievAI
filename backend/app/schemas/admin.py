import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr

class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class DepartmentResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SubcategoryCreate(BaseModel):
    name: str

class SubcategoryResponse(BaseModel):
    id: uuid.UUID
    category_id: uuid.UUID
    name: str
    created_at: datetime

    class Config:
        from_attributes = True

class CategoryCreate(BaseModel):
    name: str
    default_priority_policy: Optional[str] = "MEDIUM"
    is_active: bool = True

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    default_priority_policy: Optional[str] = None
    is_active: Optional[bool] = None

class CategoryResponse(BaseModel):
    id: uuid.UUID
    name: str
    default_priority_policy: Optional[str] = None
    is_active: bool
    subcategories: List[SubcategoryResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SLARuleUpdate(BaseModel):
    hours: int

class SLARuleResponse(BaseModel):
    id: uuid.UUID
    priority: str
    hours: int
    created_at: datetime

    class Config:
        from_attributes = True

class InstitutionalIssueMemberResponse(BaseModel):
    grievance_id: uuid.UUID
    grievance_code: str
    title: Optional[str] = None
    status: str
    added_at: datetime

class InstitutionalIssueResponse(BaseModel):
    id: uuid.UUID
    title: str
    category_id: Optional[uuid.UUID] = None
    category_name: Optional[str] = None
    status: str
    related_grievance_count: int
    affected_locations: Optional[List[str]] = None
    first_reported_at: datetime
    last_reported_at: datetime
    members: List[InstitutionalIssueMemberResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
