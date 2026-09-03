import uuid
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_

from app.api import deps
from app.models import (
    User,
    Role,
    Department,
    Category,
    Subcategory,
    SLARule,
    InstitutionalIssue,
    InstitutionalIssueMember,
    AuditLog
)
from app.core import security
from app.schemas.auth import UserResponse, UserCreate, UserUpdate
from app.schemas.admin import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentResponse,
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    SubcategoryCreate,
    SubcategoryResponse,
    SLARuleUpdate,
    SLARuleResponse,
    InstitutionalIssueResponse,
    InstitutionalIssueMemberResponse
)

router = APIRouter(dependencies=[Depends(deps.require_role(["admin"]))])

# ----------------------------------------------------------------------
# 1. User Management
# ----------------------------------------------------------------------

@router.get("/users", response_model=List[UserResponse])
def list_users(
    role: Optional[str] = None,
    department_id: Optional[uuid.UUID] = None,
    search: Optional[str] = None,
    db: Session = Depends(deps.get_db)
) -> Any:
    """List all users with filtering and search."""
    query = db.query(User)
    if role:
        query = query.join(User.role).filter(Role.name.ilike(role.strip()))
    if department_id:
        query = query.filter(User.department_id == department_id)
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(User.full_name.ilike(search_fmt), User.email.ilike(search_fmt))
        )
    users = query.order_by(desc(User.created_at)).all()
    return [
        UserResponse(
            id=u.id,
            email=u.email,
            full_name=u.full_name,
            role=u.role.name if u.role else None,
            role_id=u.role_id,
            department=u.department.name if u.department else None,
            department_id=u.department_id,
            avatar_url=u.avatar_url,
            is_active=u.is_active,
            created_at=u.created_at
        ) for u in users
    ]

@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(deps.get_db)
) -> Any:
    """Create a new user (Staff/Authority/Student) via Admin Center."""
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    role = db.query(Role).filter(Role.id == user_in.role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found.")

    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        password_hash=security.get_password_hash(user_in.password),
        role_id=user_in.role_id,
        department_id=user_in.department_id,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=role.name,
        role_id=user.role_id,
        department=user.department.name if user.department else None,
        department_id=user.department_id,
        avatar_url=user.avatar_url,
        is_active=user.is_active,
        created_at=user.created_at
    )

@router.put("/users/{id}", response_model=UserResponse)
def update_user(
    id: uuid.UUID,
    user_in: UserUpdate,
    db: Session = Depends(deps.get_db)
) -> Any:
    """Update user profile or status."""
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if user_in.full_name is not None:
        user.full_name = user_in.full_name
    if user_in.avatar_url is not None:
        user.avatar_url = user_in.avatar_url
    if user_in.department_id is not None:
        user.department_id = user_in.department_id
    if user_in.is_active is not None:
        user.is_active = user_in.is_active

    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role.name if user.role else None,
        role_id=user.role_id,
        department=user.department.name if user.department else None,
        department_id=user.department_id,
        avatar_url=user.avatar_url,
        is_active=user.is_active,
        created_at=user.created_at
    )

@router.delete("/users/{id}", response_model=dict)
def deactivate_user(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db)
) -> Any:
    """Deactivate a user account."""
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.is_active = False
    db.commit()
    return {"message": "User deactivated successfully.", "id": str(id)}

# ----------------------------------------------------------------------
# 2. Department Management
# ----------------------------------------------------------------------

@router.get("/departments", response_model=List[DepartmentResponse])
def list_departments(db: Session = Depends(deps.get_db)) -> Any:
    """List all departments."""
    depts = db.query(Department).order_by(Department.name.asc()).all()
    return depts

@router.post("/departments", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
def create_department(
    dept_in: DepartmentCreate,
    db: Session = Depends(deps.get_db)
) -> Any:
    """Create a new department."""
    existing = db.query(Department).filter(Department.name == dept_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Department with this name already exists.")

    dept = Department(
        name=dept_in.name,
        description=dept_in.description,
        is_active=dept_in.is_active
    )
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept

@router.put("/departments/{id}", response_model=DepartmentResponse)
def update_department(
    id: uuid.UUID,
    dept_in: DepartmentUpdate,
    db: Session = Depends(deps.get_db)
) -> Any:
    """Update department info."""
    dept = db.query(Department).filter(Department.id == id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found.")

    if dept_in.name is not None:
        dept.name = dept_in.name
    if dept_in.description is not None:
        dept.description = dept_in.description
    if dept_in.is_active is not None:
        dept.is_active = dept_in.is_active

    db.commit()
    db.refresh(dept)
    return dept

# ----------------------------------------------------------------------
# 3. Category & Taxonomy Management
# ----------------------------------------------------------------------

@router.get("/categories", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(deps.get_db)) -> Any:
    """List all categories and nested subcategories."""
    cats = db.query(Category).order_by(Category.name.asc()).all()
    return cats

@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    cat_in: CategoryCreate,
    db: Session = Depends(deps.get_db)
) -> Any:
    """Create a new grievance category."""
    existing = db.query(Category).filter(Category.name == cat_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category with this name already exists.")

    cat = Category(
        name=cat_in.name,
        default_priority_policy=cat_in.default_priority_policy,
        is_active=cat_in.is_active
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@router.post("/categories/{id}/subcategories", response_model=SubcategoryResponse, status_code=status.HTTP_201_CREATED)
def create_subcategory(
    id: uuid.UUID,
    sub_in: SubcategoryCreate,
    db: Session = Depends(deps.get_db)
) -> Any:
    """Add a subcategory under a category."""
    cat = db.query(Category).filter(Category.id == id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found.")

    existing = db.query(Subcategory).filter(
        Subcategory.category_id == id,
        Subcategory.name == sub_in.name
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Subcategory already exists in this category.")

    sub = Subcategory(category_id=id, name=sub_in.name)
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub

# ----------------------------------------------------------------------
# 4. SLA Rules Management
# ----------------------------------------------------------------------

@router.get("/sla-rules", response_model=List[SLARuleResponse])
def list_sla_rules(db: Session = Depends(deps.get_db)) -> Any:
    """List all SLA resolution policies."""
    return db.query(SLARule).order_by(SLARule.hours.asc()).all()

@router.put("/sla-rules/{priority}", response_model=SLARuleResponse)
def update_sla_rule(
    priority: str,
    rule_in: SLARuleUpdate,
    db: Session = Depends(deps.get_db)
) -> Any:
    """Update or create SLA target hours for a given priority level."""
    norm_p = priority.upper().strip()
    rule = db.query(SLARule).filter(SLARule.priority == norm_p).first()
    if not rule:
        rule = SLARule(priority=norm_p, hours=rule_in.hours)
        db.add(rule)
    else:
        rule.hours = rule_in.hours
    db.commit()
    db.refresh(rule)
    return rule

# ----------------------------------------------------------------------
# 5. Institutional Issues Management
# ----------------------------------------------------------------------

@router.get("/institutional-issues", response_model=List[InstitutionalIssueResponse])
def list_institutional_issues(db: Session = Depends(deps.get_db)) -> Any:
    """List all detected institutional clusters."""
    issues = db.query(InstitutionalIssue).order_by(desc(InstitutionalIssue.created_at)).all()
    results = []
    for issue in issues:
        members_data = []
        for m in issue.members:
            if m.grievance:
                members_data.append(InstitutionalIssueMemberResponse(
                    grievance_id=m.grievance.id,
                    grievance_code=m.grievance.grievance_code,
                    title=m.grievance.title,
                    status=m.grievance.status,
                    added_at=m.added_at
                ))
        results.append(InstitutionalIssueResponse(
            id=issue.id,
            title=issue.title,
            category_id=issue.category_id,
            category_name=issue.category.name if issue.category else None,
            status=issue.status,
            related_grievance_count=issue.related_grievance_count or len(members_data),
            affected_locations=issue.affected_locations,
            first_reported_at=issue.first_reported_at,
            last_reported_at=issue.last_reported_at,
            members=members_data,
            created_at=issue.created_at,
            updated_at=issue.updated_at
        ))
    return results
