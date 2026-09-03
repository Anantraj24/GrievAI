import pytest
import uuid

def get_auth_token(client, email: str, password: str = "password123") -> str:
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    return res.json()["access_token"]

def test_create_and_fetch_grievance(client):
    student_token = get_auth_token(client, "student1@example.com")
    headers = {"Authorization": f"Bearer {student_token}"}

    payload = {
        "title": "Water leak in Room 302",
        "description": "Continuous water leakage from ceiling in block A room 302",
        "location": "Hostel Block A, Room 302",
        "is_anonymous": False
    }

    # 1. Create
    res = client.post("/api/v1/grievances", json=payload, headers=headers)
    assert res.status_code == 201
    data = res.json()
    assert "grievance_code" in data
    assert data["grievance_code"].startswith("GRV-")
    assert data["status"] == "SUBMITTED"
    assert data["priority"] in ["HIGH", "MEDIUM", "LOW", "CRITICAL"]
    assert len(data["status_history"]) == 1
    grievance_id = data["id"]

    # 2. Get details
    get_res = client.get(f"/api/v1/grievances/{grievance_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Water leak in Room 302"

def test_add_comment_and_feedback(client):
    student_token = get_auth_token(client, "student1@example.com")
    headers = {"Authorization": f"Bearer {student_token}"}

    # 1. Create Grievance
    res = client.post("/api/v1/grievances", json={
        "title": "Broken bench",
        "description": "Bench broken in classroom 101"
    }, headers=headers)
    g_id = res.json()["id"]

    # 2. Add Student Comment
    comment_res = client.post(f"/api/v1/grievances/{g_id}/comments", json={
        "content": "Please prioritize this before exam week."
    }, headers=headers)
    assert comment_res.status_code == 200
    assert comment_res.json()["content"] == "Please prioritize this before exam week."

    # 3. Resolve status by authority
    auth_token = get_auth_token(client, "authority1@example.com")
    auth_headers = {"Authorization": f"Bearer {auth_token}"}
    client.post(f"/api/v1/grievances/{g_id}/status", json={"status": "PENDING_REVIEW"}, headers=auth_headers)
    client.post(f"/api/v1/grievances/{g_id}/status", json={"status": "ASSIGNED"}, headers=auth_headers)
    client.post(f"/api/v1/grievances/{g_id}/status", json={"status": "IN_PROGRESS"}, headers=auth_headers)
    resolve_res = client.post(f"/api/v1/grievances/{g_id}/status", json={"status": "RESOLVED", "reason": "Fixed bench legs"}, headers=auth_headers)
    assert resolve_res.status_code == 200
    assert resolve_res.json()["status"] == "RESOLVED"

    # 4. Student submits feedback
    feedback_res = client.post(f"/api/v1/grievances/{g_id}/feedback", json={
        "rating": 5,
        "feedback_text": "Thank you for the quick fix!"
    }, headers=headers)
    assert feedback_res.status_code == 200
    assert feedback_res.json()["rating"] == 5
