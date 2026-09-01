import uuid
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import Grievance, User, StatusHistory, AuditLog
from app.rules.state_machine import validate_transition

def transition_grievance_status(
    db: Session,
    grievance_id: uuid.UUID,
    new_status: str,
    current_user: User,
    reason: Optional[str] = None
) -> Grievance:
    """
    Executes a status transition adhering strictly to state machine validation,
    enforcing role-based permissions and recording an immutable StatusHistory record.
    """
    grievance = db.query(Grievance).filter(Grievance.id == grievance_id).first()
    if not grievance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grievance not found"
        )
        
    old_status = grievance.status
    role_name = current_user.role.name if current_user.role else "student"
    is_owner = (grievance.student_id == current_user.id)

    try:
        validate_transition(
            old_status=old_status,
            new_status=new_status,
            actor_role=role_name,
            is_owner=is_owner
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    # 1. Update Grievance Status
    grievance.status = new_status.upper().strip()

    # 2. Record Immutable Status History
    history_entry = StatusHistory(
        grievance_id=grievance.id,
        actor_id=current_user.id,
        previous_status=old_status,
        new_status=grievance.status,
        reason=reason
    )
    db.add(history_entry)

    # 3. Create Audit Log
    audit = AuditLog(
        actor_id=current_user.id,
        action="GRIEVANCE_STATUS_CHANGED",
        entity_type="grievance",
        entity_id=grievance.id,
        metadata_json={
            "old_status": old_status,
            "new_status": grievance.status,
            "reason": reason
        }
    )
    db.add(audit)

    db.commit()
    db.refresh(grievance)
    return grievance
