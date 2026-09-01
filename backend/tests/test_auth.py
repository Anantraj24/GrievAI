import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi import Depends, HTTPException

from app.main import app
from app.core.database import Base, get_db
from app.models import Role, User, Department
from app.api.deps import require_role, get_current_active_user

# In-memory SQLite for fast, isolated test execution
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

# Dummy protected route for RBAC testing
@app.get("/api/v1/test-admin-only")
def admin_only_endpoint(user: User = Depends(require_role(["admin"]))):
    return {"message": "Welcome Admin", "user_id": str(user.id)}

@app.get("/api/v1/test-authority-or-admin")
def authority_or_admin_endpoint(user: User = Depends(require_role(["authority", "admin"]))):
    return {"message": "Welcome Staff", "user_id": str(user.id)}

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    student_role = Role(name="student", permissions={"can_submit": True})
    admin_role = Role(name="admin", permissions={"is_superadmin": True})
    authority_role = Role(name="authority", permissions={"can_resolve": True})
    db.add_all([student_role, admin_role, authority_role])
    db.commit()
    yield
    Base.metadata.drop_all(bind=test_engine)

client = TestClient(app)

def test_register_student_success():
    payload = {
        "email": "newstudent@example.com",
        "password": "securepassword123",
        "full_name": "John Doe"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newstudent@example.com"
    assert data["full_name"] == "John Doe"
    assert data["role"] == "student"
    assert "id" in data

def test_register_duplicate_email_fails():
    payload = {
        "email": "duplicate@example.com",
        "password": "password123",
        "full_name": "First User"
    }
    res1 = client.post("/api/v1/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/v1/auth/register", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]

def test_login_success_and_profile_me():
    reg_payload = {
        "email": "testuser@example.com",
        "password": "mysecretpassword",
        "full_name": "Test User"
    }
    client.post("/api/v1/auth/register", json=reg_payload)

    login_payload = {
        "email": "testuser@example.com",
        "password": "mysecretpassword"
    }
    login_res = client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    assert token_data["role"] == "student"

    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "testuser@example.com"
    assert me_data["full_name"] == "Test User"

def test_login_invalid_password_fails():
    reg_payload = {
        "email": "wrongpwd@example.com",
        "password": "correctpassword",
        "full_name": "Bob Test"
    }
    client.post("/api/v1/auth/register", json=reg_payload)

    login_res = client.post("/api/v1/auth/login", json={
        "email": "wrongpwd@example.com",
        "password": "wrongpassword"
    })
    assert login_res.status_code == 400
    assert "Incorrect email or password" in login_res.json()["detail"]

def test_unauthenticated_me_fails():
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401

def test_rbac_student_blocked_from_admin_route():
    # 1. Register student
    reg_payload = {
        "email": "student_rbac@example.com",
        "password": "password123",
        "full_name": "Student RBAC"
    }
    client.post("/api/v1/auth/register", json=reg_payload)
    
    # 2. Login student
    login_res = client.post("/api/v1/auth/login", json={
        "email": "student_rbac@example.com",
        "password": "password123"
    })
    student_token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {student_token}"}

    # 3. Student tries admin route -> 403 Forbidden
    res = client.get("/api/v1/test-admin-only", headers=headers)
    assert res.status_code == 403
    assert "Required roles: ['admin']" in res.json()["detail"]
