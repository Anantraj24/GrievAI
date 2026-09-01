import pytest
import uuid
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db
from app.models import Role, User, Department, Category, Grievance, AIAnalysis, GrievanceEmbedding
from app.core.security import get_password_hash
from app.ai.ai_service import OllamaClient
from app.api.ai import cosine_similarity

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    
    student_role = Role(name="student", permissions={"can_submit": True})
    authority_role = Role(name="authority", permissions={"can_resolve": True})
    admin_role = Role(name="admin", permissions={"is_superadmin": True})
    db.add_all([student_role, authority_role, admin_role])
    db.flush()

    student = User(
        email="ai_student@example.com",
        password_hash=get_password_hash("password123"),
        full_name="AI Student",
        role_id=student_role.id,
        is_active=True
    )
    authority = User(
        email="ai_authority@example.com",
        password_hash=get_password_hash("password123"),
        full_name="AI Officer",
        role_id=authority_role.id,
        is_active=True
    )
    db.add_all([student, authority])
    db.commit()
    yield
    Base.metadata.drop_all(bind=test_engine)

client = TestClient(app)

def get_auth_token(email: str, password: str = "password123") -> str:
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    return res.json()["access_token"]

@pytest.mark.asyncio
async def test_ollama_client_offline_fallback():
    # Points to dummy unreachable port
    offline_client = OllamaClient(base_url="http://localhost:59999")
    
    # 1. Analyze text fallback
    res = await offline_client.analyze_grievance("Hostel room water problem", "Block B")
    assert res is not None
    assert res["confidence"] == 0.0
    assert res["fallback"] is True
    assert "Hostel room water problem" in res["issue_summary"]

    # 2. Embedding fallback
    emb = await offline_client.generate_embedding("Sample text")
    assert len(emb) == 1024
    assert all(x == 0.0 for x in emb)

    # 3. Draft response fallback
    draft = await offline_client.draft_response("Hostel water problem", "Plumber dispatched")
    assert len(draft) > 10
    assert "Thank you" in draft

def test_cosine_similarity_math():
    v1 = [1.0, 0.0, 0.0]
    v2 = [1.0, 0.0, 0.0]
    assert cosine_similarity(v1, v2) == 1.0

    v3 = [0.0, 1.0, 0.0]
    assert cosine_similarity(v1, v3) == 0.0

    v4 = [1.0, 1.0, 0.0]
    sim = cosine_similarity(v1, v4)
    assert 0.70 < sim < 0.72

def test_get_ai_analysis_api():
    student_token = get_auth_token("ai_student@example.com")
    headers = {"Authorization": f"Bearer {student_token}"}

    # 1. Create Grievance
    create_res = client.post("/api/v1/grievances", json={
        "title": "Wi-Fi Down in Library",
        "description": "Internet connection not working on second floor of central library",
        "location": "Central Library 2nd Floor"
    }, headers=headers)
    g_id = create_res.json()["id"]

    # 2. Directly attach an AI analysis row to DB
    db = TestingSessionLocal()
    analysis = AIAnalysis(
        grievance_id=uuid.UUID(g_id),
        model_name="llama3",
        extracted_json={
            "language": "English",
            "issue_summary": "Wi-Fi failure in library 2nd floor",
            "category": "IT & Digital Services",
            "safety_signal": False,
            "confidence": 0.95
        },
        classification_confidence=0.95,
        status="COMPLETED"
    )
    db.add(analysis)
    db.commit()

    # 3. Fetch via API
    ai_res = client.get(f"/api/v1/grievances/{g_id}/ai-analysis", headers=headers)
    assert ai_res.status_code == 200
    ai_data = ai_res.json()
    assert ai_data["confidence"] == 0.95
    assert ai_data["category"] == "IT & Digital Services"

def test_related_grievance_semantic_search():
    auth_token = get_auth_token("ai_authority@example.com")
    auth_headers = {"Authorization": f"Bearer {auth_token}"}
    student_token = get_auth_token("ai_student@example.com")
    student_headers = {"Authorization": f"Bearer {student_token}"}

    # 1. Create Grievance A & B
    res_a = client.post("/api/v1/grievances", json={
        "title": "Water leak room 101",
        "description": "Water leaking continuously in room 101"
    }, headers=student_headers)
    id_a = res_a.json()["id"]

    res_b = client.post("/api/v1/grievances", json={
        "title": "Water leak room 102",
        "description": "Water leaking in adjacent room 102"
    }, headers=student_headers)
    id_b = res_b.json()["id"]

    # 2. Save similar embeddings for A and B
    db = TestingSessionLocal()
    vec_a = [0.9] * 512 + [0.1] * 512
    vec_b = [0.88] * 512 + [0.12] * 512

    db.add(GrievanceEmbedding(grievance_id=uuid.UUID(id_a), embedding=vec_a, embedding_model="bge-m3"))
    db.add(GrievanceEmbedding(grievance_id=uuid.UUID(id_b), embedding=vec_b, embedding_model="bge-m3"))
    db.commit()

    # 3. Query related from A
    related_res = client.get(f"/api/v1/grievances/{id_a}/related", headers=auth_headers)
    assert related_res.status_code == 200
    related_items = related_res.json()
    assert len(related_items) >= 1
    assert related_items[0]["id"] == id_b
    assert related_items[0]["similarity_score"] >= 0.85
    assert related_items[0]["relation_type"] == "DUPLICATE"
