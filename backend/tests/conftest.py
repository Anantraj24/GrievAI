import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi import Depends

from app.main import app
from app.core.database import Base, get_db
from app.models import Role, User, Department, Category, Subcategory, SLARule
from app.core.security import get_password_hash
from app.api.deps import require_role

# Single in-memory SQLite engine for all tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Dummy protected route for RBAC testing
@app.get("/api/v1/test-admin-only", tags=["test"])
def admin_only_endpoint(user: User = Depends(require_role(["admin"]))):
    return {"message": "Welcome Admin", "user_id": str(user.id)}

@app.get("/api/v1/test-authority-or-admin", tags=["test"])
def authority_or_admin_endpoint(user: User = Depends(require_role(["authority", "admin"]))):
    return {"message": "Welcome Staff", "user_id": str(user.id)}

@pytest.fixture(scope="session", autouse=True)
def setup_test_schema():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)

@pytest.fixture(autouse=True)
def clean_and_seed_db():
    """Reset and seed essential lookup data for each test cleanly without dropping schema."""
    db = TestingSessionLocal()
    try:
        # Clear existing rows in reverse dependency order
        for table in reversed(Base.metadata.sorted_tables):
            db.execute(table.delete())
        db.commit()

        # Seed standard roles
        student_role = Role(name="student", permissions={"can_submit": True, "can_view_own": True})
        authority_role = Role(name="authority", permissions={"can_resolve": True, "can_escalate": True})
        admin_role = Role(name="admin", permissions={"is_superadmin": True, "can_manage_all": True})
        db.add_all([student_role, authority_role, admin_role])
        db.flush()

        # Seed standard department
        dept = Department(name="Estate & Campus Facilities", description="Facilities maintenance", is_active=True)
        db.add(dept)
        db.flush()

        # Seed standard category & subcategory
        cat = Category(name="Estate & Campus Facilities", default_priority_policy="MEDIUM", is_active=True)
        db.add(cat)
        db.flush()

        subcat = Subcategory(category_id=cat.id, name="Plumbing & Water Supply")
        db.add(subcat)
        db.flush()

        # Seed standard SLA rules
        db.add_all([
            SLARule(priority="CRITICAL", hours=12),
            SLARule(priority="HIGH", hours=24),
            SLARule(priority="MEDIUM", hours=48),
            SLARule(priority="LOW", hours=120)
        ])
        db.flush()

        # Seed default test users
        student = User(
            email="student1@example.com",
            password_hash=get_password_hash("password123"),
            full_name="Alice Student",
            role_id=student_role.id,
            is_active=True
        )
        authority = User(
            email="authority1@example.com",
            password_hash=get_password_hash("password123"),
            full_name="Dr. Authority",
            role_id=authority_role.id,
            department_id=dept.id,
            is_active=True
        )
        admin = User(
            email="admin1@example.com",
            password_hash=get_password_hash("password123"),
            full_name="Admin User",
            role_id=admin_role.id,
            is_active=True
        )
        db.add_all([student, authority, admin])
        db.commit()
    finally:
        db.close()

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture(autouse=True)
def mock_background_ai_tasks(monkeypatch):
    """Mocks background task to avoid real network timeouts during unit tests."""
    def noop_sync(grievance_id):
        pass
    monkeypatch.setattr("app.api.grievances.process_grievance_ai_sync", noop_sync)
