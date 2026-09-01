import uuid
import asyncio
import logging
from app.models import Grievance, GrievanceEmbedding, AIAnalysis, StatusHistory
from app.ai.ai_service import ai_client
from app.core.database import SessionLocal
from app.services.routing_service import apply_routing

logger = logging.getLogger(__name__)

async def process_grievance_ai(grievance_id: uuid.UUID):
    """
    Background task to process grievance with AI:
    1. Extract structured NLU entities, category, signals & confidence
    2. Generate vector embedding
    3. Save AI analysis and embedding record
    4. Apply deterministic routing, priority & SLA calculation
    """
    db = SessionLocal()
    try:
        grievance = db.query(Grievance).filter(Grievance.id == grievance_id).first()
        if not grievance:
            return
            
        text_content = f"{grievance.title or ''}\n{grievance.description}".strip()
        
        # 1. Generate Embeddings
        embedding = await ai_client.generate_embedding(text_content)
        if embedding and len(embedding) == 1024:
            existing_emb = db.query(GrievanceEmbedding).filter(GrievanceEmbedding.grievance_id == grievance_id).first()
            if not existing_emb:
                db_embedding = GrievanceEmbedding(
                    grievance_id=grievance_id,
                    embedding=embedding,
                    embedding_model="bge-m3"
                )
                db.add(db_embedding)
            
        # 2. Extract Structured NLU Analysis
        analysis_data = await ai_client.analyze_grievance(text=text_content, location=grievance.location)
        
        ai_analysis = AIAnalysis(
            grievance_id=grievance_id,
            model_name="llama3",
            extracted_json=analysis_data,
            classification_confidence=analysis_data.get("confidence", 0.0),
            priority_signals={
                "safety_signal": analysis_data.get("safety_signal", False),
                "essential_service_signal": analysis_data.get("essential_service_signal", False),
                "affected_scope": analysis_data.get("affected_scope", "Individual")
            },
            status="COMPLETED" if not analysis_data.get("fallback") else "LOW_CONFIDENCE"
        )
        db.add(ai_analysis)
        db.commit()
        
        # 3. Apply Deterministic Priority & Routing
        apply_routing(db, grievance_id)
        
    except Exception as e:
        logger.error(f"Error in background AI task: {e}")
        db.rollback()
    finally:
        db.close()

def process_grievance_ai_sync(grievance_id: uuid.UUID):
    """Synchronous wrapper for FastAPI BackgroundTasks."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.create_task(process_grievance_ai(grievance_id))
        else:
            asyncio.run(process_grievance_ai(grievance_id))
    except RuntimeError:
        asyncio.run(process_grievance_ai(grievance_id))
