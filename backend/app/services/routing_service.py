import uuid
from typing import Dict, Any, Tuple, Optional
from sqlalchemy.orm import Session
from ..models import Grievance, Department, AIAnalysis
from ..schemas.enums import Priority
from .sla_service import calculate_sla_deadline

def determine_priority_and_routing(
    db: Session, 
    grievance: Grievance, 
    ai_analysis: AIAnalysis
) -> Tuple[Optional[str], Optional[uuid.UUID]]:
    """
    Deterministic engine to map AI-extracted entities and sentiment 
    to a Priority and Department.
    """
    entities = ai_analysis.extracted_json.get("entities", {})
    sentiment = ai_analysis.extracted_json.get("sentiment", {})
    
    predicted_priority = Priority.MEDIUM.value
    predicted_department_id = None
    
    urgency = entities.get("urgency", "Low").upper()
    cat = entities.get("category", "").lower()
    
    # Priority logic
    if urgency == "HIGH" or sentiment.get("sentiment") in ["Angry", "Distressed"] or sentiment.get("requires_empathy"):
        predicted_priority = Priority.HIGH.value
    elif urgency == "LOW" and sentiment.get("sentiment") == "Neutral":
        predicted_priority = Priority.LOW.value
        
    # Department routing logic
    # Fetch all active departments to match
    departments = db.query(Department).filter(Department.is_active == True).all()
    dept_map = {d.name.lower(): d.id for d in departments}
    
    if "maintenance" in cat or "facilities" in cat:
        if "maintenance" in dept_map:
            predicted_department_id = dept_map["maintenance"]
    elif "academic" in cat:
        if "academic affairs" in dept_map:
            predicted_department_id = dept_map["academic affairs"]
    elif "administrative" in cat:
        if "administration" in dept_map:
            predicted_department_id = dept_map["administration"]
            
    return predicted_priority, predicted_department_id

def apply_routing(db: Session, grievance_id: uuid.UUID):
    grievance = db.query(Grievance).filter(Grievance.id == grievance_id).first()
    ai_analysis = db.query(AIAnalysis).filter(AIAnalysis.grievance_id == grievance_id).order_by(AIAnalysis.created_at.desc()).first()
    
    if not grievance or not ai_analysis:
        return
        
    priority, dept_id = determine_priority_and_routing(db, grievance, ai_analysis)
    
    if priority and not grievance.priority:
        grievance.priority = priority
        grievance.sla_deadline = calculate_sla_deadline(priority, grievance.created_at)
        
    if dept_id and not grievance.assigned_department_id:
        grievance.assigned_department_id = dept_id
        
    db.commit()
