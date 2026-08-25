import uuid
import asyncio
from ..models import Grievance, GrievanceEmbedding, AIAnalysis
from ..ai.ai_service import ai_client
from ..api.deps import SessionLocal
from .routing_service import apply_routing

async def process_grievance_ai(grievance_id: uuid.UUID):
    """
    Background task to process grievance with AI:
    1. Extract entities & urgency
    2. Analyze sentiment
    3. Generate embeddings
    """
    db = SessionLocal()
    try:
        grievance = db.query(Grievance).filter(Grievance.id == grievance_id).first()
        if not grievance:
            return
            
        text_content = f"{grievance.title}\n{grievance.description}"
        
        # 1. Generate Embeddings
        embedding = await ai_client.generate_embedding(text_content)
        if embedding:
            db_embedding = GrievanceEmbedding(
                grievance_id=grievance_id,
                embedding=embedding,
                embedding_model="nomic-embed-text"
            )
            db.add(db_embedding)
            
        # 2. Extract Entities
        entities_data = await ai_client.extract_entities(text_content)
            
        # 3. Analyze Sentiment
        sentiment_data = await ai_client.analyze_sentiment(text_content)
        
        # Save AI Analysis
        ai_analysis = AIAnalysis(
            grievance_id=grievance_id,
            model_name="llama3",
            extracted_json={
                "entities": entities_data,
                "sentiment": sentiment_data
            },
            status="COMPLETED"
        )
        db.add(ai_analysis)
        
        db.commit()
        
        # 4. Apply Deterministic Routing and Priority
        apply_routing(db, grievance_id)
        
    except Exception as e:
        print(f"Error in background AI task: {e}")
        db.rollback()
    finally:
        db.close()

def process_grievance_ai_sync(grievance_id: uuid.UUID):
    """Synchronous wrapper for the background task."""
    asyncio.run(process_grievance_ai(grievance_id))
