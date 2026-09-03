# GrievAI: Autonomous Institutional Student Grievance Resolution Architecture

## 1. System Topology Overview

GrievAI is an institutional-grade, multi-tier autonomous grievance intelligence platform. It fuses **Deterministic Finite State Automata (DFA)** with **Dense Vector Retrieval (pgvector)** and **Local Multi-Modal Large Language Models (Ollama)** to achieve rapid, explainable, and compliant grievance triage, routing, and resolution.

```mermaid
graph TD
    Client[React + Vite Frontend (Tailwind + Design Tokens)] -->|HTTPS / REST API| Gateway[FastAPI Backend Gateway]
    Gateway -->|JWT / RBAC Guard| AuthRouter[Auth & Profile Router]
    Gateway -->|Grievance CRUD| GrievanceRouter[Grievance Management Router]
    Gateway -->|Admin Ops| AdminRouter[Admin & Taxonomy Center]
    Gateway -->|Notifications| NotifRouter[In-App Notification Stream]
    Gateway -->|Intelligence Query| AIRouter[AI Intelligence & Duplicate Engine]
    Gateway -->|Analytics Aggregation| AnalyticsRouter[Institutional Analytics Router]

    Gateway -->|BackgroundTasks| AITaskWorker[Asynchronous AI Pipeline]
    
    AITaskWorker -->|NLU Extraction & Classification| OllamaLLM[Ollama Local LLM (Llama 3 / Mistral)]
    AITaskWorker -->|1024-dim Dense Embeddings| OllamaEmbed[BGE-M3 Vector Encoder]
    AITaskWorker -->|Deterministic Routing & SLA| RuleEngine[Rule-Based Priority & SLA Engine]

    RuleEngine -->|Persist State| SupabaseDB[(Supabase Cloud PostgreSQL + pgvector)]
    OllamaEmbed -->|Dense Cosine Index| SupabaseDB
```

---

## 2. Core Architectural Pillars

### A. Dual Intelligence Engine (Deterministic + Probabilistic)
1. **Probabilistic Layer (Ollama / Local LLMs)**:
   - Performs natural language understanding (NLU) on student text.
   - Extracts affected scopes, duration, entity references, and sentiment.
   - Computes 1024-dimensional dense vectors using BGE-M3.
   - Generates contextual official response drafts for department officers.
2. **Deterministic Layer (Rules Engine)**:
   - Prioritizes critical safety keywords (`spark`, `harassment`, `gas leak`, `flooding`) with immediate escalation.
   - Enforces mathematical SLA resolution targets (12h for Critical, 24h for High, 48h for Medium, 120h for Low).
   - Validates forward-only finite state transitions (`SUBMITTED` -> `PENDING_REVIEW` -> `ASSIGNED` -> `IN_PROGRESS` -> `RESOLVED` -> `CLOSED`).

### B. Scalable Vector Storage (Supabase PostgreSQL + pgvector)
- 23 normalized relational tables storing users, roles, departments, categories, subcategories, status histories, evidence metadata, and institutional cluster links.
- Uses `vector(1024)` columns indexed with cosine similarity (`<=>`) to instantly detect duplicates and recurring campus problems.

### C. Role-Based Access Control (RBAC) & Security Hardening
- **JWT Cryptography**: Signed with `HS256`, 7-day expiration, and payload-embedded role identifiers.
- **Object-Level Authorization (IDOR Protection)**: Students are strictly confined to their own grievances and uploaded evidence files.
- **Upload Hardening**: File type whitelisting (PDF, PNG, JPG, WEBP, DOCX), 10MB size restriction, SHA-256 integrity hashing, and executable file extension blocking.
- **Prompt Injection Defense**: Pre-flight regex neutralization of jailbreak phrases (`system prompt override`, `ignore previous instructions`, `DAN`).

---

## 3. Database Schema (23 Core Entities)

1. `users`: Student, Authority, and Admin account credentials and department affiliations.
2. `roles`: Role definitions and JSON permission maps.
3. `departments`: Institutional administrative divisions.
4. `categories`: High-level grievance domains.
5. `subcategories`: Granular complaint types.
6. `grievances`: Master complaint records with SLA deadlines, priorities, and status.
7. `grievance_status`: Lookup table for valid lifecycle states.
8. `status_history`: Immutable transition log with timestamps and changing actors.
9. `ai_analysis`: Extracted structured NLU entities, confidence scores, and safety flags.
10. `grievance_embeddings`: 1024-dimensional vector representations.
11. `grievance_relations`: Semantic duplicate and parent-child ticket associations.
12. `institutional_issues`: High-level problem clusters spanning multiple student reports.
13. `institutional_issue_members`: Junction links between cluster issues and grievances.
14. `comments`: Public and internal communication threads.
15. `evidence`: Uploaded files, MIME types, checksums, and storage keys.
16. `feedback`: 5-star ratings, structured tags, and resolution sentiment reviews.
17. `sla_rules`: Priority-to-hours mapping policies.
18. `sla_escalation_rules`: Automated escalation rules when SLAs breach.
19. `sla_breaches`: Audit table recording breached tickets and response times.
20. `routing_rules`: Department routing policy mappings.
21. `notifications`: In-app alert queue for students and staff.
22. `audit_logs`: Enterprise compliance activity trail.
23. `alembic_version`: Database migration tracking state.
