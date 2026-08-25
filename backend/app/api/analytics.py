from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Any, Dict
from . import deps
from .. import models

router = APIRouter()

@router.get("/dashboard", response_model=Dict[str, Any])
def get_dashboard_analytics(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get analytics for Admin/Authority dashboard.
    """
    if current_user.role.name == "Student":
        raise HTTPException(status_code=403, detail="Authorities only")
        
    # Base query for department filter if Authority
    base_query = db.query(models.Grievance)
    if current_user.role.name == "Authority" and current_user.department_id:
        base_query = base_query.filter(models.Grievance.assigned_department_id == current_user.department_id)
        
    # Status Breakdown
    status_counts = base_query.with_entities(
        models.Grievance.status, func.count(models.Grievance.id)
    ).group_by(models.Grievance.status).all()
    status_breakdown = {status: count for status, count in status_counts}
    
    # Priority Breakdown
    priority_counts = base_query.with_entities(
        models.Grievance.priority, func.count(models.Grievance.id)
    ).group_by(models.Grievance.priority).all()
    priority_breakdown = {priority or "Unassigned": count for priority, count in priority_counts}
    
    # SLA Breaches (Escalated)
    sla_breaches = base_query.filter(models.Grievance.status == "ESCALATED").count()
    
    # Recent activity
    recent_grievances = base_query.order_by(models.Grievance.created_at.desc()).limit(5).all()
    recent = [{"id": g.id, "title": g.title, "status": g.status, "priority": g.priority} for g in recent_grievances]
    
    # Average Resolution Time (for CLOSED/RESOLVED grievances)
    resolved_query = base_query.filter(models.Grievance.status.in_(["RESOLVED", "CLOSED"])).all()
    avg_resolution_time = 0
    if resolved_query:
        total_time = sum((g.updated_at - g.created_at).total_seconds() for g in resolved_query)
        avg_resolution_time = total_time / len(resolved_query) / 3600 # in hours
    
    return {
        "status_breakdown": status_breakdown,
        "priority_breakdown": priority_breakdown,
        "sla_breaches": sla_breaches,
        "recent_activity": recent,
        "avg_resolution_time_hours": avg_resolution_time,
        "total": sum(status_breakdown.values())
    }
