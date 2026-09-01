import uuid
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.api import deps
from app.models import Grievance, AIAnalysis, GrievanceEmbedding, GrievanceRelation, User
from app.schemas.enums import RoleEnum
from app.schemas.grievance import (
    AIAnalysisResult,
    ResponseDraftRequest,
    ResponseDraftResponse,
    RelatedGrievanceResponse
)
from app.ai.ai_service import ai_client

router = APIRouter()

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Compute cosine similarity between two float vectors."""
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot = sum(a * b for a, b in zip(v1, v2))
    norm_a = sum(a * a for a in v1) ** 0.5
    norm_b = sum(b * b for b in v2) ** 0.5
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return max(0.0, min(1.0, dot / (norm_a * norm_b)))


@router.get("/grievances/{id}/ai-analysis", response_model=AIAnalysisResult)
def get_grievance_ai_analysis(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Fetch the latest structured AI analysis for a grievance.
    """
    grievance = db.query(Grievance).filter(Grievance.id == id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found.")

    role = current_user.role.name.lower() if current_user.role else "student"
    if role == RoleEnum.STUDENT.value and grievance.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized to view this grievance analysis.")

    latest_ai = db.query(AIAnalysis).filter(
        AIAnalysis.grievance_id == id
    ).order_by(desc(AIAnalysis.created_at)).first()

    if not latest_ai:
        raise HTTPException(status_code=404, detail="AI analysis not yet generated for this grievance.")

    ext = latest_ai.extracted_json or {}
    return AIAnalysisResult(
        language=ext.get("language", "English"),
        issue_summary=ext.get("issue_summary", grievance.description[:100]),
        category=ext.get("category"),
        subcategory=ext.get("subcategory"),
        location=ext.get("location", grievance.location),
        duration_days=ext.get("duration_days", 1),
        previously_reported=ext.get("previously_reported", False),
        reported_to=ext.get("reported_to"),
        affected_scope=ext.get("affected_scope", "Individual"),
        safety_signal=ext.get("safety_signal", False),
        essential_service_signal=ext.get("essential_service_signal", False),
        confidence=float(latest_ai.classification_confidence or 0.0)
    )


@router.get("/grievances/{id}/related", response_model=List[RelatedGrievanceResponse])
def get_related_grievances(
    id: uuid.UUID,
    threshold: float = Query(0.65, ge=0.0, le=1.0),
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.require_role(["authority", "admin"]))
) -> Any:
    """
    Semantic similarity search: Finds duplicate or related complaints across the institution.
    """
    target_emb = db.query(GrievanceEmbedding).filter(GrievanceEmbedding.grievance_id == id).first()
    if not target_emb or not target_emb.embedding:
        return []

    target_vec = target_emb.embedding
    if isinstance(target_vec, dict) or not isinstance(target_vec, list):
        # Handle custom vector representation if any
        target_vec = list(target_vec)

    all_embeddings = db.query(GrievanceEmbedding).filter(
        GrievanceEmbedding.grievance_id != id
    ).all()

    results = []
    for other in all_embeddings:
        other_vec = other.embedding
        if isinstance(other_vec, dict) or not isinstance(other_vec, list):
            other_vec = list(other_vec)
            
        score = cosine_similarity(target_vec, other_vec)
        if score >= threshold:
            g = other.grievance
            if g:
                rel_type = "DUPLICATE" if score >= 0.85 else "RELATED"
                results.append(RelatedGrievanceResponse(
                    id=g.id,
                    grievance_code=g.grievance_code,
                    title=g.title,
                    description=g.description,
                    status=g.status,
                    category=g.category.name if g.category else None,
                    similarity_score=round(score, 3),
                    relation_type=rel_type,
                    created_at=g.created_at
                ))

    results.sort(key=lambda x: x.similarity_score, reverse=True)
    return results[:limit]


@router.post("/grievances/{id}/response-draft", response_model=ResponseDraftResponse)
async def generate_response_draft(
    id: uuid.UUID,
    draft_req: ResponseDraftRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.require_role(["authority", "admin"]))
) -> Any:
    """
    Generate an AI response draft for authorities with adjustable tone (Formal, Empathetic, Direct).
    """
    grievance = db.query(Grievance).filter(Grievance.id == id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found.")

    tone = draft_req.tone or "Formal"
    resolution_context = f"Category: {grievance.category.name if grievance.category else 'General'}. Status: {grievance.status}."
    
    draft_text = await ai_client.draft_response(
        grievance_text=f"{grievance.title or ''}\n{grievance.description}",
        resolution_notes=resolution_context,
        tone=tone
    )

    return ResponseDraftResponse(
        draft=draft_text,
        tone=tone
    )
