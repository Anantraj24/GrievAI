import uuid
from datetime import datetime, timezone
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from app.api import deps
from app.models import (
    User,
    Grievance,
    StatusHistory,
    Comment,
    Feedback,
    GrievanceAssignment,
    Category,
    Subcategory,
    Department
)
from app.schemas.enums import RoleEnum, GrievanceStatus
from app.schemas.grievance import (
    GrievanceCreate,
    GrievanceResponse,
    GrievanceListResponse,
    StatusUpdate,
    AssignmentUpdate,
    CommentCreate,
    CommentResponse,
    FeedbackCreate,
    FeedbackResponse,
    EvidenceResponse,
    StatusHistoryResponse,
    AIAnalysisResult
)
from app.rules.priority import calculate_priority
from app.rules.sla import calculate_sla_deadline, is_sla_breached
from app.rules.routing import resolve_department_routing
from app.services.grievance_service import transition_grievance_status
from app.services.ai_tasks import process_grievance_ai_sync

router = APIRouter()

def generate_grievance_code(db: Session) -> str:
    """Generates a sequential human-readable code: GRV-YYYY-XXXX"""
    year = datetime.now().year
    count = db.query(Grievance).count() + 1
    while True:
        code = f"GRV-{year}-{count:04d}"
        if not db.query(Grievance).filter(Grievance.grievance_code == code).first():
            return code
        count += 1

def map_grievance_to_response(g: Grievance, current_user: User) -> GrievanceResponse:
    """Helper to convert SQLAlchemy Grievance to Pydantic GrievanceResponse with access controls"""
    is_staff = current_user.role.name.lower() in [RoleEnum.AUTHORITY.value, RoleEnum.ADMIN.value]
    
    # Filter internal comments for students
    filtered_comments = []
    for c in g.comments:
        if not c.is_internal or is_staff:
            filtered_comments.append(CommentResponse(
                id=c.id,
                author_id=c.author_id,
                author_name=c.author.full_name if c.author else "Staff",
                author_role=c.author.role.name if c.author and c.author.role else None,
                content=c.body,
                is_internal_only=c.is_internal,
                created_at=c.created_at
            ))

    filtered_evidence = [
        EvidenceResponse(
            id=e.id,
            original_filename=e.original_filename,
            mime_type=e.mime_type,
            file_size_bytes=e.file_size_bytes,
            storage_key=e.storage_key,
            is_resolution_evidence=e.is_resolution_evidence,
            created_at=e.created_at
        ) for e in g.evidence
    ]

    history_list = [
        StatusHistoryResponse(
            id=h.id,
            actor_id=h.actor_id,
            actor_name=h.actor.full_name if h.actor else "System",
            previous_status=h.previous_status,
            new_status=h.new_status,
            reason=h.reason,
            created_at=h.created_at
        ) for h in g.status_history
    ]

    ai_result = None
    if g.ai_analyses:
        latest_ai = g.ai_analyses[-1]
        ext = latest_ai.extracted_json or {}
        ai_result = AIAnalysisResult(
            language=ext.get("language"),
            issue_summary=ext.get("issue_summary"),
            category=ext.get("category"),
            subcategory=ext.get("subcategory"),
            location=ext.get("location"),
            duration_days=ext.get("duration_days"),
            safety_signal=ext.get("safety_signal", False),
            essential_service_signal=ext.get("essential_service_signal", False),
            confidence=float(latest_ai.classification_confidence or 0.0)
        )

    feedback_data = None
    if g.feedback:
        feedback_data = FeedbackResponse(
            id=g.feedback.id,
            rating=g.feedback.satisfaction_rating,
            tags=None,
            feedback_text=g.feedback.comment,
            submitted_at=g.feedback.created_at
        )

    # Anonymity masking for students if anonymous
    student_name = "Anonymous Student" if (g.is_anonymous and not is_staff) else (g.student.full_name if g.student else "Student")
    student_email = "anonymous@hidden.edu" if (g.is_anonymous and not is_staff) else (g.student.email if g.student else "")

    return GrievanceResponse(
        id=g.id,
        grievance_code=g.grievance_code,
        student_id=g.student_id,
        student_name=student_name,
        student_email=student_email,
        title=g.title,
        description=g.description,
        location=g.location,
        incident_date=g.incident_date,
        is_anonymous=g.is_anonymous,
        status=g.status,
        priority=g.priority,
        priority_reasons=g.priority_reasons,
        category_id=g.category_id,
        category_name=g.category.name if g.category else None,
        subcategory_id=g.subcategory_id,
        subcategory_name=g.subcategory.name if g.subcategory else None,
        assigned_department_id=g.assigned_department_id,
        assigned_department_name=g.assigned_department.name if g.assigned_department else None,
        assigned_authority_id=g.assigned_authority_id,
        assigned_authority_name=g.assigned_authority.full_name if g.assigned_authority else None,
        sla_deadline=g.sla_deadline,
        sla_breached=is_sla_breached(g.sla_deadline),
        ai_analysis=ai_result,
        comments=filtered_comments,
        evidence=filtered_evidence,
        status_history=history_list,
        feedback=feedback_data,
        created_at=g.created_at,
        updated_at=g.updated_at
    )


@router.post("", response_model=GrievanceResponse, status_code=status.HTTP_201_CREATED)
def create_grievance(
    grievance_in: GrievanceCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Submit a new student grievance, computing initial priority and triggering AI triage.
    """
    code = generate_grievance_code(db)
    
    # 1. Resolve initial category details if passed
    cat_name = None
    if grievance_in.category_id:
        cat_obj = db.query(Category).filter(Category.id == grievance_in.category_id).first()
        if cat_obj:
            cat_name = cat_obj.name

    # 2. Initial Deterministic Priority Calculation
    initial_priority, reasons = calculate_priority(
        text=f"{grievance_in.title or ''} {grievance_in.description}",
        category_name=cat_name
    )

    # 3. Initial SLA Calculation
    sla_deadline = calculate_sla_deadline(priority=initial_priority.value)

    # 4. Resolve Department Routing
    dept_id = resolve_department_routing(
        db=db,
        category_id=grievance_in.category_id,
        subcategory_id=grievance_in.subcategory_id,
        category_name=cat_name
    )

    grievance = Grievance(
        grievance_code=code,
        student_id=current_user.id,
        title=grievance_in.title,
        description=grievance_in.description,
        location=grievance_in.location,
        incident_date=grievance_in.incident_date,
        is_anonymous=grievance_in.is_anonymous,
        status=GrievanceStatus.SUBMITTED.value,
        priority=initial_priority.value,
        priority_reasons=reasons,
        category_id=grievance_in.category_id,
        subcategory_id=grievance_in.subcategory_id,
        assigned_department_id=dept_id,
        sla_deadline=sla_deadline
    )
    db.add(grievance)
    db.flush()

    # Initial status history entry
    history = StatusHistory(
        grievance_id=grievance.id,
        actor_id=current_user.id,
        previous_status=None,
        new_status=GrievanceStatus.SUBMITTED.value,
        reason="Grievance filed by student."
    )
    db.add(history)
    db.commit()
    db.refresh(grievance)

    # Enqueue background AI triage
    background_tasks.add_task(process_grievance_ai_sync, grievance.id)

    return map_grievance_to_response(grievance, current_user)


@router.get("", response_model=GrievanceListResponse)
def list_grievances(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority_filter: Optional[str] = Query(None, alias="priority"),
    department_id: Optional[uuid.UUID] = Query(None),
    category_id: Optional[uuid.UUID] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    List grievances with role-based visibility scoping, search, and filters.
    """
    query = db.query(Grievance)
    role = current_user.role.name.lower() if current_user.role else "student"

    # Object-level access scoping
    if role == RoleEnum.STUDENT.value:
        query = query.filter(Grievance.student_id == current_user.id)
    elif role == RoleEnum.AUTHORITY.value:
        if current_user.department_id:
            query = query.filter(
                or_(
                    Grievance.assigned_department_id == current_user.department_id,
                    Grievance.assigned_authority_id == current_user.id
                )
            )

    # Filters
    if status_filter:
        query = query.filter(Grievance.status == status_filter.upper().strip())
    if priority_filter:
        query = query.filter(Grievance.priority == priority_filter.upper().strip())
    if department_id:
        query = query.filter(Grievance.assigned_department_id == department_id)
    if category_id:
        query = query.filter(Grievance.category_id == category_id)
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Grievance.title.ilike(search_fmt),
                Grievance.description.ilike(search_fmt),
                Grievance.grievance_code.ilike(search_fmt)
            )
        )

    total = query.count()
    items = query.order_by(desc(Grievance.created_at)).offset((page - 1) * page_size).limit(page_size).all()

    return GrievanceListResponse(
        total=total,
        items=[map_grievance_to_response(g, current_user) for g in items],
        page=page,
        page_size=page_size
    )


@router.get("/{id}", response_model=GrievanceResponse)
def get_grievance_by_id(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Fetch complete grievance details with object-level authorization checks.
    """
    grievance = db.query(Grievance).filter(Grievance.id == id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found.")

    role = current_user.role.name.lower() if current_user.role else "student"
    if role == RoleEnum.STUDENT.value and grievance.student_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this grievance."
        )

    return map_grievance_to_response(grievance, current_user)


@router.post("/{id}/status", response_model=GrievanceResponse)
def update_grievance_status(
    id: uuid.UUID,
    status_in: StatusUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Execute a verified state machine status transition with reason logging.
    """
    grievance = transition_grievance_status(
        db=db,
        grievance_id=id,
        new_status=status_in.status.value,
        current_user=current_user,
        reason=status_in.reason
    )
    return map_grievance_to_response(grievance, current_user)


@router.post("/{id}/assign", response_model=GrievanceResponse)
def assign_grievance(
    id: uuid.UUID,
    assign_in: AssignmentUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.require_role(["authority", "admin"]))
) -> Any:
    """
    Assign grievance to a specific authority user and department.
    """
    grievance = db.query(Grievance).filter(Grievance.id == id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found.")

    assignee = db.query(User).filter(User.id == assign_in.assigned_to_user_id).first()
    if not assignee:
        raise HTTPException(status_code=404, detail="Assigned user not found.")

    grievance.assigned_authority_id = assignee.id
    if assign_in.department_id:
        grievance.assigned_department_id = assign_in.department_id
    elif assignee.department_id:
        grievance.assigned_department_id = assignee.department_id

    old_status = grievance.status
    # Auto-transition from SUBMITTED / PENDING_REVIEW to ASSIGNED
    if old_status in [GrievanceStatus.SUBMITTED.value, GrievanceStatus.PENDING_REVIEW.value]:
        grievance.status = GrievanceStatus.ASSIGNED.value
        history_entry = StatusHistory(
            grievance_id=grievance.id,
            actor_id=current_user.id,
            previous_status=old_status,
            new_status=GrievanceStatus.ASSIGNED.value,
            reason=f"Assigned to {assignee.full_name}" + (f": {assign_in.notes}" if assign_in.notes else "")
        )
        db.add(history_entry)

    # Record assignment
    assignment = GrievanceAssignment(
        grievance_id=grievance.id,
        assigned_to=assignee.id,
        assigned_by=current_user.id,
        reason=assign_in.notes
    )
    db.add(assignment)
    db.commit()
    db.refresh(grievance)

    return map_grievance_to_response(grievance, current_user)


@router.post("/{id}/comments", response_model=CommentResponse)
def add_comment(
    id: uuid.UUID,
    comment_in: CommentCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Add a comment or internal note to the grievance communication thread.
    """
    grievance = db.query(Grievance).filter(Grievance.id == id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found.")

    role = current_user.role.name.lower() if current_user.role else "student"
    if role == RoleEnum.STUDENT.value:
        if grievance.student_id != current_user.id:
            raise HTTPException(status_code=403, detail="Unauthorized.")
        if comment_in.is_internal_only:
            raise HTTPException(status_code=400, detail="Students cannot post internal-only notes.")

    comment = Comment(
        grievance_id=grievance.id,
        author_id=current_user.id,
        body=comment_in.content,
        is_internal=comment_in.is_internal_only
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return CommentResponse(
        id=comment.id,
        author_id=current_user.id,
        author_name=current_user.full_name,
        author_role=role,
        content=comment.body,
        is_internal_only=comment.is_internal,
        created_at=comment.created_at
    )


@router.post("/{id}/feedback", response_model=FeedbackResponse)
def submit_feedback(
    id: uuid.UUID,
    feedback_in: FeedbackCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Submit student satisfaction rating (1-5) and feedback for a resolved grievance.
    """
    grievance = db.query(Grievance).filter(Grievance.id == id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found.")

    if grievance.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the grievance filer can submit feedback.")

    existing_feedback = db.query(Feedback).filter(Feedback.grievance_id == grievance.id).first()
    if existing_feedback:
        raise HTTPException(status_code=400, detail="Feedback has already been submitted for this grievance.")

    feedback = Feedback(
        grievance_id=grievance.id,
        student_id=current_user.id,
        satisfaction_rating=feedback_in.rating,
        comment=feedback_in.feedback_text
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return FeedbackResponse(
        id=feedback.id,
        rating=feedback.satisfaction_rating,
        tags=feedback_in.tags,
        feedback_text=feedback.comment,
        submitted_at=feedback.created_at
    )
