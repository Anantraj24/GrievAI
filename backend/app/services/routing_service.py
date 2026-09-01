import uuid
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.models import Grievance, AIAnalysis, Category, Department
from app.rules.priority import calculate_priority
from app.rules.sla import calculate_sla_deadline
from app.rules.routing import resolve_department_routing

def apply_routing(db: Session, grievance_id: uuid.UUID):
    """
    Applies deterministic priority scoring, SLA computation, and department assignment
    based on the latest AI analysis signals and configured routing rules.
    """
    grievance = db.query(Grievance).filter(Grievance.id == grievance_id).first()
    if not grievance:
        return

    ai_analysis = db.query(AIAnalysis).filter(
        AIAnalysis.grievance_id == grievance_id
    ).order_by(AIAnalysis.created_at.desc()).first()

    signals = ai_analysis.priority_signals if ai_analysis else {}
    extracted = ai_analysis.extracted_json if ai_analysis else {}

    cat_name = None
    if grievance.category:
        cat_name = grievance.category.name
    elif extracted.get("category"):
        cat_name = extracted.get("category")

    # 1. Deterministic Priority Calculation
    priority_level, reasons = calculate_priority(
        text=f"{grievance.title or ''} {grievance.description}",
        category_name=cat_name,
        safety_signal=signals.get("safety_signal", False),
        essential_service_signal=signals.get("essential_service_signal", False),
        affected_scope=signals.get("affected_scope", "Individual"),
        duration_days=extracted.get("duration_days", 1)
    )

    if not grievance.priority:
        grievance.priority = priority_level.value
        grievance.priority_reasons = reasons

    # 2. SLA Deadline Computation
    if not grievance.sla_deadline:
        grievance.sla_deadline = calculate_sla_deadline(
            created_at=grievance.created_at,
            priority=grievance.priority
        )

    # 3. Deterministic Department Routing
    if not grievance.assigned_department_id:
        dept_id = resolve_department_routing(
            db=db,
            category_id=grievance.category_id,
            subcategory_id=grievance.subcategory_id,
            category_name=cat_name
        )
        if dept_id:
            grievance.assigned_department_id = dept_id

    db.commit()
