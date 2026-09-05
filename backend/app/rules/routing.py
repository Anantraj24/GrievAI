from typing import Optional, Tuple
from uuid import UUID
from sqlalchemy.orm import Session
from app.models import RoutingRule, Department, Category

def resolve_department_routing(
    db: Session,
    category_id: Optional[UUID] = None,
    subcategory_id: Optional[UUID] = None,
    category_name: Optional[str] = None
) -> Optional[UUID]:
    """
    Deterministically resolves the department responsible for handling a grievance
    based on configuration routing rules and department mappings.
    """
    # 1. Exact match on (category_id, subcategory_id)
    if category_id and subcategory_id:
        rule = db.query(RoutingRule).filter(
            RoutingRule.category_id == category_id,
            RoutingRule.subcategory_id == subcategory_id
        ).order_by(RoutingRule.priority.desc()).first()
        if rule and rule.department_id:
            return rule.department_id

    # 2. Match on category_id only
    if category_id:
        rule = db.query(RoutingRule).filter(
            RoutingRule.category_id == category_id,
            RoutingRule.subcategory_id.is_(None)
        ).order_by(RoutingRule.priority.desc()).first()
        if rule and rule.department_id:
            return rule.department_id

    # 3. Match category by name keyword against active departments
    cat_text = category_name or ""
    if not cat_text and category_id:
        cat_obj = db.query(Category).filter(Category.id == category_id).first()
        if cat_obj:
            cat_text = cat_obj.name

    if cat_text:
        cat_lower = cat_text.lower()
        departments = db.query(Department).filter(Department.is_active == True).all()
        import re
        for dept in departments:
            dept_lower = dept.name.lower()
            if any(term in dept_lower for term in ["facilities", "estate"]) and any(term in cat_lower for term in ["facilities", "estate", "plumbing", "electrical"]):
                return dept.id
            if "academic" in dept_lower and "academic" in cat_lower:
                return dept.id
            if bool(re.search(r'\b(it|digital|information technology|computing)\b', dept_lower)) and any(term in cat_lower for term in ["it", "digital", "wifi", "network", "internet", "erp"]):
                return dept.id
            if "hostel" in dept_lower and any(term in cat_lower for term in ["hostel", "residence", "mess", "dining"]):
                return dept.id
            if "finance" in dept_lower and any(term in cat_lower for term in ["finance", "fee", "account", "scholarship"]):
                return dept.id

    return None
