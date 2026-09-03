import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class NotificationResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    grievance_id: Optional[uuid.UUID] = None
    event_type: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationListResponse(BaseModel):
    items: list[NotificationResponse]
    unread_count: int
