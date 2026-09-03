import pytest
import uuid
from app.models import Notification, Role, User, Department, Category, Subcategory, SLARule
from app.services.institutional_service import aggregate_grievances_to_issue

def get_auth_token(client, email: str, password: str = "password123") -> str:
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    return res.json()["access_token"]

def test_notifications_crud(client, db_session):
    student_token = get_auth_token(client, "student1@example.com")
    headers = {"Authorization": f"Bearer {student_token}"}

    # 1. Fetch current user id
    me_res = client.get("/api/v1/auth/me", headers=headers)
    user_id = uuid.UUID(me_res.json()["id"])

    # 2. Add two test notifications to DB
    notif1 = Notification(
        user_id=user_id,
        event_type="STATUS_CHANGED",
        message="Your grievance GRV-2026-0001 has been assigned.",
        is_read=False
    )
    notif2 = Notification(
        user_id=user_id,
        event_type="COMMENT_ADDED",
        message="A new response was added to your grievance.",
        is_read=False
    )
    db_session.add_all([notif1, notif2])
    db_session.commit()

    # 3. List notifications
    list_res = client.get("/api/v1/notifications", headers=headers)
    assert list_res.status_code == 200
    data = list_res.json()
    assert len(data["items"]) == 2
    assert data["unread_count"] == 2

    # 4. Mark one as read
    read_res = client.post(f"/api/v1/notifications/{notif1.id}/read", headers=headers)
    assert read_res.status_code == 200
    assert read_res.json()["is_read"] is True

    # 5. Mark all as read
    read_all_res = client.post("/api/v1/notifications/read-all", headers=headers)
    assert read_all_res.status_code == 200
    assert read_all_res.json()["count"] == 1

    # Verify unread count is now 0
    final_list = client.get("/api/v1/notifications", headers=headers)
    assert final_list.json()["unread_count"] == 0

def test_admin_endpoints_access_control(client):
    student_token = get_auth_token(client, "student1@example.com")
    admin_token = get_auth_token(client, "admin1@example.com")

    student_headers = {"Authorization": f"Bearer {student_token}"}
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Student access blocked -> 403
    blocked_res = client.get("/api/v1/admin/users", headers=student_headers)
    assert blocked_res.status_code == 403

    # 2. Admin access allowed -> 200
    allowed_res = client.get("/api/v1/admin/users", headers=admin_headers)
    assert allowed_res.status_code == 200
    assert len(allowed_res.json()) >= 3

def test_admin_department_and_category_crud(client, db_session):
    admin_token = get_auth_token(client, "admin1@example.com")
    headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Create Department
    dept_res = client.post("/api/v1/admin/departments", json={
        "name": "Hostel Affairs & Dining",
        "description": "Hostel facilities and mess quality"
    }, headers=headers)
    assert dept_res.status_code == 201
    dept_id = dept_res.json()["id"]

    # 2. Create Category
    cat_res = client.post("/api/v1/admin/categories", json={
        "name": "Hostel Life",
        "default_priority_policy": "MEDIUM"
    }, headers=headers)
    assert cat_res.status_code == 201
    cat_id = cat_res.json()["id"]

    # 3. Add Subcategory
    sub_res = client.post(f"/api/v1/admin/categories/{cat_id}/subcategories", json={
        "name": "Mess Food Hygiene"
    }, headers=headers)
    assert sub_res.status_code == 201
    assert sub_res.json()["name"] == "Mess Food Hygiene"

    # 4. List Categories
    cats_res = client.get("/api/v1/admin/categories", headers=headers)
    assert cats_res.status_code == 200
    hostel_cat = next((c for c in cats_res.json() if c["id"] == cat_id), None)
    assert hostel_cat is not None
    assert len(hostel_cat["subcategories"]) == 1

def test_admin_sla_rules_update(client):
    admin_token = get_auth_token(client, "admin1@example.com")
    headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Update Critical SLA hours from default to 8 hours
    res = client.put("/api/v1/admin/sla-rules/CRITICAL", json={"hours": 8}, headers=headers)
    assert res.status_code == 200
    assert res.json()["priority"] == "CRITICAL"
    assert res.json()["hours"] == 8

@pytest.mark.asyncio
async def test_institutional_cluster_service(client, db_session):
    student_token = get_auth_token(client, "student1@example.com")
    headers = {"Authorization": f"Bearer {student_token}"}

    # 1. Create two grievances
    res1 = client.post("/api/v1/grievances", json={
        "title": "Water leakage in block B floor 2",
        "description": "Floor 2 bathrooms are completely flooded",
        "location": "Hostel Block B"
    }, headers=headers)
    res2 = client.post("/api/v1/grievances", json={
        "title": "No tap water in block B floor 2",
        "description": "Water supply stopped on floor 2",
        "location": "Hostel Block B"
    }, headers=headers)

    g_id1 = uuid.UUID(res1.json()["id"])
    g_id2 = uuid.UUID(res2.json()["id"])

    # 2. Aggregate to Institutional Issue
    issue = await aggregate_grievances_to_issue(
        db=db_session,
        grievance_ids=[g_id1, g_id2]
    )
    assert issue is not None
    assert issue.related_grievance_count == 2
    assert len(issue.members) == 2
    assert issue.status == "UNDER_INVESTIGATION"

    # 3. Query through Admin API
    admin_token = get_auth_token(client, "admin1@example.com")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    issues_res = client.get("/api/v1/admin/institutional-issues", headers=admin_headers)
    assert issues_res.status_code == 200
    issues = issues_res.json()
    assert len(issues) >= 1
    target = next((i for i in issues if i["id"] == str(issue.id)), None)
    assert target is not None
    assert len(target["members"]) == 2
