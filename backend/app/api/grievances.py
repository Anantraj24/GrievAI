from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import uuid

from .. import models
from ..schemas.grievance import GrievanceCreate, GrievanceResponse, GrievanceListResponse
from ..services.grievance_service import transition_grievance_status
from ..services.ai_tasks import process_grievance_ai_sync
from ..ai.ai_service import ai_client
from . import deps

router = APIRouter()

@router.post("/", response_model=GrievanceResponse)
def create_grievance(
    *,
    db: Session = Depends(deps.get_db),
    grievance_in: GrievanceCreate,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new grievance.
    """
    # Create the db model
    db_obj = models.Grievance(
        title=grievance_in.title,
        description=grievance_in.description,
        category=grievance_in.category,
        student_id=current_user.id,
        status="Pending",
        is_anonymous=grievance_in.is_anonymous
    )
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    
    # Launch background task for AI analysis and embedding
    background_tasks.add_task(process_grievance_ai_sync, grievance_id=db_obj.id)
    
    return db_obj

@router.get("/", response_model=List[GrievanceListResponse])
def read_grievances(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve grievances.
    """
    if current_user.role.name == "Student":
        grievances = db.query(models.Grievance).filter(models.Grievance.student_id == current_user.id).offset(skip).limit(limit).all()
    else:
        # Authorities/Admins see assigned or all based on logic
        grievances = db.query(models.Grievance).offset(skip).limit(limit).all()
    return grievances

@router.get("/{id}", response_model=GrievanceResponse)
def read_grievance(
    *,
    db: Session = Depends(deps.get_db),
    id: uuid.UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get grievance by ID.
    """
    grievance = db.query(models.Grievance).filter(models.Grievance.id == id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
    
    # Check permissions
    if current_user.role.name == "Student" and grievance.student_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
        
    return grievance

from pydantic import BaseModel
class TransitionRequest(BaseModel):
    status: str
    resolution_notes: str | None = None

@router.patch("/{id}/status", response_model=GrievanceResponse)
def update_grievance_status(
    *,
    db: Session = Depends(deps.get_db),
    id: uuid.UUID,
    transition_in: TransitionRequest,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update grievance status.
    """
    return transition_grievance_status(
        db=db,
        grievance_id=id,
        new_status=transition_in.status,
        current_user=current_user,
        resolution_notes=transition_in.resolution_notes
    )

@router.get("/{id}/duplicates", response_model=List[GrievanceResponse])
async def find_duplicates(
    *,
    db: Session = Depends(deps.get_db),
    id: uuid.UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
    threshold: float = 0.8
) -> Any:
    """
    Find semantic duplicates for a grievance.
    """
    if current_user.role.name == "Student":
        raise HTTPException(status_code=403, detail="Authorities only")
        
    target = db.query(models.GrievanceEmbedding).filter(models.GrievanceEmbedding.grievance_id == id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Embedding not found for this grievance")
        
    # pgvector L2 distance: <-> 
    # pgvector inner product (cosine similarity for normalized vectors): <=>
    
    similar_embeddings = db.query(
        models.GrievanceEmbedding,
        models.GrievanceEmbedding.embedding.cosine_distance(target.embedding).label("distance")
    ).filter(
        models.GrievanceEmbedding.grievance_id != id,
        models.GrievanceEmbedding.embedding.cosine_distance(target.embedding) < (1 - threshold)
    ).order_by("distance").limit(5).all()
    
    if not similar_embeddings:
        return []
        
    similar_ids = [e[0].grievance_id for e in similar_embeddings]
    duplicates = db.query(models.Grievance).filter(models.Grievance.id.in_(similar_ids)).all()
    
    return duplicates

class DraftRequest(BaseModel):
    resolution_notes: str

class DraftResponse(BaseModel):
    draft: str

@router.post("/{id}/draft-response", response_model=DraftResponse)
async def draft_grievance_response(
    *,
    db: Session = Depends(deps.get_db),
    id: uuid.UUID,
    draft_in: DraftRequest,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Draft a response using AI based on resolution notes.
    """
    if current_user.role.name == "Student":
        raise HTTPException(status_code=403, detail="Authorities only")
        
    grievance = db.query(models.Grievance).filter(models.Grievance.id == id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
        
    text_content = f"{grievance.title}\n{grievance.description}"
    draft = await ai_client.draft_response(text_content, draft_in.resolution_notes)
    
    return {"draft": draft}

class FeedbackCreate(BaseModel):
    rating: int
    comments: str | None = None

class FeedbackResponse(BaseModel):
    id: uuid.UUID
    grievance_id: uuid.UUID
    rating: int
    comments: str | None
    
    class Config:
        from_attributes = True

@router.post("/{id}/feedback", response_model=FeedbackResponse)
def submit_feedback(
    *,
    db: Session = Depends(deps.get_db),
    id: uuid.UUID,
    feedback_in: FeedbackCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Submit satisfaction survey / feedback for a closed grievance.
    """
    if current_user.role.name != "Student":
        raise HTTPException(status_code=403, detail="Only students can submit feedback")
        
    grievance = db.query(models.Grievance).filter(models.Grievance.id == id, models.Grievance.student_id == current_user.id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found or unauthorized")
        
    if grievance.status not in ["CLOSED", "RESOLVED"]:
        raise HTTPException(status_code=400, detail="Feedback can only be submitted for closed/resolved grievances")
        
    if feedback_in.rating < 1 or feedback_in.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        
    existing_feedback = db.query(models.Feedback).filter(models.Feedback.grievance_id == id).first()
    if existing_feedback:
        raise HTTPException(status_code=400, detail="Feedback already submitted for this grievance")
        
    db_feedback = models.Feedback(
        grievance_id=id,
        rating=feedback_in.rating,
        comments=feedback_in.comments
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    return db_feedback
