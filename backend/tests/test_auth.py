import pytest
from app.models import User

def test_register_student_success(client):
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

def test_register_duplicate_email_fails(client):
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

def test_login_success_and_profile_me(client):
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

def test_login_invalid_password_fails(client):
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

def test_unauthenticated_me_fails(client):
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401

def test_rbac_student_blocked_from_admin_route(client):
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
