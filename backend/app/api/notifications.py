import uuid
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.api import deps
from app.models import Notification, User
from app.schemas.notification import NotificationResponse, NotificationListResponse

router = APIRouter()

@router.get("", response_model=NotificationListResponse)
def list_notifications(
    unread_only: bool = Query(False),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    List in-app notifications for the currently logged in user.
    """
    query = db.query(Notification).filter(Notification.user_id == current_user.id)
    unread_count = query.filter(Notification.is_read == False).count()

    if unread_only:
        query = query.filter(Notification.is_read == False)

    items = query.order_by(desc(Notification.created_at)).limit(limit).all()

    return NotificationListResponse(
        items=[NotificationResponse.model_validate(n) for n in items],
        unread_count=unread_count
    )

@router.post("/{id}/read", response_model=NotificationResponse)
def mark_notification_read(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Mark a single notification as read.
    """
    notif = db.query(Notification).filter(
        Notification.id == id,
        Notification.user_id == current_user.id
    ).first()

    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found.")

    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return NotificationResponse.model_validate(notif)

@router.post("/read-all", response_model=dict)
def mark_all_notifications_read(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Mark all unread notifications as read for current user.
    """
    updated_count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read.", "count": updated_count}
