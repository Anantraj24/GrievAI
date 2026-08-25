import uuid
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from ..models import Grievance, User
from ..schemas.enums import Status, Role

def transition_grievance_status(
    db: Session,
    grievance_id: uuid.UUID,
    new_status: str,
    current_user: User,
    resolution_notes: Optional[str] = None
) -> Grievance:
    grievance = db.query(Grievance).filter(Grievance.id == grievance_id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
        
    old_status = grievance.status
    
    # Simple RBAC for transitions
    if current_user.role.name == Role.STUDENT.value:
        if old_status == Status.PENDING.value and new_status == Status.CLOSED.value:
            # Student can close their own grievance if it's pending
            pass
        else:
            raise HTTPException(status_code=403, detail="Students cannot perform this transition")
            
    elif current_user.role.name in [Role.AUTHORITY.value, Role.ADMIN.value]:
        # Valid forward transitions
        valid_transitions = {
            Status.PENDING.value: [Status.IN_PROGRESS.value, Status.RESOLVED.value, Status.REJECTED.value],
            Status.IN_PROGRESS.value: [Status.RESOLVED.value, Status.REJECTED.value, Status.ESCALATED.value],
            Status.ESCALATED.value: [Status.IN_PROGRESS.value, Status.RESOLVED.value, Status.REJECTED.value],
            Status.RESOLVED.value: [Status.CLOSED.value], # Awaiting student closure, or auto-close
            Status.REJECTED.value: [Status.CLOSED.value],
            Status.CLOSED.value: []
        }
        
        if new_status not in valid_transitions.get(old_status, []):
            raise HTTPException(status_code=400, detail=f"Invalid transition from {old_status} to {new_status}")
            
    else:
        raise HTTPException(status_code=403, detail="Unauthorized role")
        
    grievance.status = new_status
    if resolution_notes:
        grievance.resolution_notes = resolution_notes
        
    db.commit()
    db.refresh(grievance)
    return grievance
