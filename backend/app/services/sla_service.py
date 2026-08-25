from datetime import datetime, timedelta, timezone
from ..models import Grievance
from ..schemas.enums import Priority

def calculate_sla_deadline(priority: str, created_at: datetime) -> datetime:
    """Calculate SLA deadline based on priority level."""
    sla_map = {
        Priority.CRITICAL.value: timedelta(hours=24),
        Priority.HIGH.value: timedelta(hours=48),
        Priority.MEDIUM.value: timedelta(days=5),
        Priority.LOW.value: timedelta(days=7),
    }
    
    delta = sla_map.get(priority, timedelta(days=5))
    return created_at + delta

def check_escalations(db_session):
    """
    CRON worker logic:
    Find grievances past SLA deadline that are not CLOSED or ESCALATED.
    Mark them as ESCALATED and notify admin.
    """
    from ..models import Grievance
    from ..schemas.enums import Status
    
    now = datetime.now(timezone.utc)
    
    overdue_grievances = db_session.query(Grievance).filter(
        Grievance.sla_deadline < now,
        ~Grievance.status.in_([Status.CLOSED.value, Status.RESOLVED.value, Status.REJECTED.value, Status.ESCALATED.value])
    ).all()
    
    for grievance in overdue_grievances:
        grievance.status = Status.ESCALATED.value
        # Add escalation logic (e.g., notify Higher Authorities)
        # We can also add an EscalationLog entry
        
    if overdue_grievances:
        db_session.commit()
    
    return len(overdue_grievances)
