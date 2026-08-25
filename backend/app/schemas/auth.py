from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role_id: UUID
    department_id: Optional[UUID] = None

class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    role_id: UUID
    department_id: Optional[UUID] = None
    is_active: bool

    class Config:
        from_attributes = True
