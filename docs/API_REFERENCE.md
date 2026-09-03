# GrievAI REST API Specification (v1)

Base URL: `http://localhost:8000/api/v1`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Register a new student account.
- **Request Body**:
  ```json
  {
    "email": "student@example.com",
    "password": "password123",
    "full_name": "Alice Student"
  }
  ```
- **Response (201 Created)**: User profile object.

### `POST /auth/login`
Authenticate with email and password to receive a Bearer JWT.
- **Request Body**:
  ```json
  {
    "email": "student@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "role": "student",
    "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
  ```

### `GET /auth/me`
Retrieve authenticated user's profile and permissions.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Current user profile.

---

## 2. Grievance Management Endpoints

### `POST /grievances`
Create a new student grievance.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "Water leakage in Room 302",
    "description": "Continuous water leaking from ceiling in block A room 302",
    "location": "Hostel Block A, Room 302",
    "is_anonymous": false
  }
  ```
- **Response (201 Created)**: Created grievance with generated `grievance_code`.

### `GET /grievances`
List grievances (students see their own; authorities see department queue; admins see all).
- **Query Params**: `status`, `department_id`, `category_id`, `skip`, `limit`.
- **Response (200 OK)**: Array of grievance objects.

### `GET /grievances/{id}`
Retrieve full grievance details including status history, evidence, and comments.

### `POST /grievances/{id}/status`
Transition grievance status (restricted to department authorities and admins).
- **Request Body**:
  ```json
  {
    "status": "RESOLVED",
    "reason": "Replaced faulty pipe joint"
  }
  ```

### `POST /grievances/{id}/comments`
Post a public message or internal note.
- **Request Body**:
  ```json
  {
    "content": "Plumber dispatched to location.",
    "is_internal": false
  }
  ```

### `POST /grievances/{id}/feedback`
Submit student satisfaction rating upon case resolution.
- **Request Body**:
  ```json
  {
    "rating": 5,
    "feedback_text": "Resolved very quickly, thank you!"
  }
  ```

---

## 3. Evidence & File Upload Endpoints

### `POST /grievances/{id}/evidence`
Upload and attach supporting documents or resolution proofs.
- **Form Data**: `file` (Multipart), `is_resolution` (boolean).
- **Supported Formats**: PDF, PNG, JPG, WEBP, DOCX (Max 10MB).

### `GET /grievances/{id}/evidence/{evidence_id}`
Download evidence file with object-level IDOR validation.

---

## 4. AI Intelligence Endpoints

### `GET /grievances/{id}/ai-analysis`
Fetch structured NLU classification, confidence, entities, and safety flags.

### `GET /grievances/{id}/related`
Retrieve semantic duplicate candidates and historical similar cases.

### `POST /ai/analyze-preview`
Real-time triage preview during grievance composition.

### `POST /ai/draft-response`
Generate empathetic, context-aware official response drafts for staff.

---

## 5. In-App Notifications

### `GET /notifications`
List notifications for logged-in user with unread count.

### `POST /notifications/{id}/read`
Mark a specific notification as read.

### `POST /notifications/read-all`
Mark all notifications as read.

---

## 6. Admin Center & Institutional Taxonomy

### `GET /admin/users`
List users with role and department filters.

### `POST /admin/users`
Create administrative, authority, or staff accounts.

### `GET /admin/departments` / `POST /admin/departments`
Manage institutional departments.

### `GET /admin/categories` / `POST /admin/categories`
Manage grievance categories and subcategories.

### `GET /admin/sla-rules` / `PUT /admin/sla-rules/{priority}`
Configure target resolution hours by priority.

### `GET /admin/institutional-issues`
View automatically aggregated problem clusters and affected locations.
