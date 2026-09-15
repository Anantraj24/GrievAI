"""QA regression tests.

Each test here pins a specific defect that was found during the end-to-end QA
cycle and fixed at the root cause. Do not delete or weaken these tests - they
guard against the bugs regressing.
"""

def get_auth_token(client, email: str, password: str = "password123") -> str:
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200
    return res.json()["access_token"]


def test_empty_description_rejected(client):
    """Regression: POST /grievances previously accepted an empty description
    (201) because GrievanceBase.description had no min_length validation."""
    token = get_auth_token(client, "student1@example.com")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post(
        "/api/v1/grievances",
        json={"title": "No description", "description": "", "location": "Campus"},
        headers=headers,
    )
    assert res.status_code == 422