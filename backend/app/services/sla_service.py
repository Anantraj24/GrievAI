from datetime import datetime, timezone
from app.models import Grievance, StatusHistory, Escalation, Notification
from app.schemas.enums import GrievanceStatus
from app.rules.sla import calculate_sla_deadline, is_sla_breached

def check_escalations(db_session):
    """
    CRON worker logic:
    Find active grievances past SLA deadline that are not terminal or already escalated.
    Mark them as ESCALATED, record status history, create escalation record and notify authorities.
    """
    now = datetime.now(timezone.utc)
    
    overdue_grievances = db_session.query(Grievance).filter(
        Grievance.sla_deadline.isnot(None),
        Grievance.sla_deadline < now,
        ~Grievance.status.in_([
            GrievanceStatus.CLOSED.value,
            GrievanceStatus.RESOLVED.value,
            GrievanceStatus.REJECTED.value,
            GrievanceStatus.ESCALATED.value
        ])
    ).all()
    
    for grievance in overdue_grievances:
        old_status = grievance.status
        grievance.status = GrievanceStatus.ESCALATED.value
        
        # 1. Status History
        history = StatusHistory(
            grievance_id=grievance.id,
            actor_id=grievance.assigned_authority_id or grievance.student_id,
            previous_status=old_status,
            new_status=GrievanceStatus.ESCALATED.value,
            reason="Automated SLA breach escalation trigger"
        )
        db_session.add(history)
        
        # 2. Escalation entry
        escalation = Escalation(
            grievance_id=grievance.id,
            escalated_from=grievance.assigned_authority_id,
            trigger_reason=f"SLA deadline breached for priority {grievance.priority}"
        )
        db_session.add(escalation)
        
        # 3. Notification for student
        notif = Notification(
            user_id=grievance.student_id,
            grievance_id=grievance.id,
            event_type="SLA_ESCALATION",
            message=f"Your grievance ({grievance.grievance_code}) has been escalated to senior administration due to SLA deadline expiration."
        )
        db_session.add(notif)
        
    if overdue_grievances:
        db_session.commit()
        
    return len(overdue_grievances)
