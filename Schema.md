# GrievAI — Database Schema

**Database:** PostgreSQL + `pgvector` extension
**Companion doc:** `techspec.md` (how each table is used by the AI/rules layers)

Conventions: every table has `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`,
`created_at TIMESTAMPTZ DEFAULT now()`, and `updated_at TIMESTAMPTZ DEFAULT now()`
unless noted. Foreign keys are `ON DELETE RESTRICT` unless stated otherwise — grievance
history must never silently disappear.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for gen_random_uuid()
```

---

## 1. Core Identity & Access

### `roles`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | TEXT UNIQUE NOT NULL | `student`, `authority`, `admin` (extensible) |
| permissions | JSONB | fine-grained permission flags |

### `users`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| email | TEXT UNIQUE NOT NULL | |
| password_hash | TEXT NOT NULL | never expose |
| full_name | TEXT NOT NULL | |
| role_id | UUID FK → roles.id | |
| department_id | UUID FK → departments.id NULL | populated for authority/admin |
| is_active | BOOLEAN DEFAULT true | |
| created_at / updated_at | TIMESTAMPTZ | |

Index: `(email)` unique, `(role_id)`, `(department_id)`.

### `departments`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | TEXT UNIQUE NOT NULL | e.g. "Hostel Administration" |
| description | TEXT NULL | |
| is_active | BOOLEAN DEFAULT true | |

---

## 2. Grievance Core

### `grievances`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| grievance_code | TEXT UNIQUE NOT NULL | human-readable, e.g. `GRV-1024` |
| student_id | UUID FK → users.id | |
| title | TEXT NULL | optional, student-provided |
| description | TEXT NOT NULL | raw natural-language complaint |
| language_detected | TEXT NULL | from AI NLU output |
| category_id | UUID FK → categories.id NULL | final (post-review) category |
| subcategory_id | UUID FK → subcategories.id NULL | |
| location | TEXT NULL | |
| incident_date | DATE NULL | |
| status | TEXT NOT NULL DEFAULT 'SUBMITTED' | see status machine in `techspec.md` |
| priority | TEXT NULL | `LOW/MEDIUM/HIGH/CRITICAL`, deterministic-engine output |
| priority_reasons | JSONB NULL | explainability array |
| assigned_department_id | UUID FK → departments.id NULL | |
| assigned_authority_id | UUID FK → users.id NULL | |
| sla_deadline | TIMESTAMPTZ NULL | computed from priority + `sla_rules` |
| created_at / updated_at | TIMESTAMPTZ | |

Indexes: `(student_id)`, `(status)`, `(priority)`, `(assigned_department_id)`,
`(assigned_authority_id)`, `(sla_deadline)`.

### `grievance_assignments`
Tracks assignment history (a grievance may be reassigned).
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| grievance_id | UUID FK → grievances.id ON DELETE CASCADE | |
| assigned_to | UUID FK → users.id | |
| assigned_by | UUID FK → users.id | |
| assigned_at | TIMESTAMPTZ DEFAULT now() | |
| unassigned_at | TIMESTAMPTZ NULL | |
| reason | TEXT NULL | required on reassignment |

### `status_history`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| grievance_id | UUID FK → grievances.id ON DELETE CASCADE | |
| actor_id | UUID FK → users.id | |
| previous_status | TEXT NULL | |
| new_status | TEXT NOT NULL | |
| reason | TEXT NULL | required for `REJECTED`/`NEEDS_INFORMATION`/`ESCALATED` |
| created_at | TIMESTAMPTZ DEFAULT now() | |

Index: `(grievance_id, created_at)`.

### `comments`
Communication thread between student and authority on a case.
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| grievance_id | UUID FK → grievances.id ON DELETE CASCADE | |
| author_id | UUID FK → users.id | |
| body | TEXT NOT NULL | |
| is_internal | BOOLEAN DEFAULT false | authority-only notes, never shown to student |
| created_at | TIMESTAMPTZ DEFAULT now() | |

Index: `(grievance_id, created_at)`.

---

## 3. Evidence

### `evidence`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| grievance_id | UUID FK → grievances.id ON DELETE CASCADE | |
| uploader_id | UUID FK → users.id | |
| original_filename | TEXT NOT NULL | never trusted for storage path |
| mime_type | TEXT NOT NULL | server-validated, not client-trusted |
| file_size_bytes | BIGINT NOT NULL | |
| storage_key | TEXT UNIQUE NOT NULL | private storage path/object key |
| checksum_sha256 | TEXT NOT NULL | integrity + basic dedup |
| is_resolution_evidence | BOOLEAN DEFAULT false | distinguishes complaint vs. resolution evidence |
| created_at | TIMESTAMPTZ DEFAULT now() | |

Index: `(grievance_id)`. Access is always through an authorized, scoped download
endpoint — never a direct static path.

---

## 4. AI & Semantic Layer

### `ai_analyses`
One row per AI pipeline run on a grievance (kept even across retries, for auditability).
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| grievance_id | UUID FK → grievances.id ON DELETE CASCADE | |
| model_name | TEXT NOT NULL | e.g. `qwen2.5:7b-instruct-q4_K_M` |
| model_version | TEXT NULL | |
| extracted_json | JSONB NOT NULL | raw NLU output (§4.1 in `techspec.md`) |
| predicted_category_id | UUID FK → categories.id NULL | |
| predicted_subcategory_id | UUID FK → subcategories.id NULL | |
| classification_confidence | NUMERIC(4,3) NULL | |
| priority_signals | JSONB NULL | inputs to the deterministic priority engine |
| recommended_department_id | UUID FK → departments.id NULL | AI suggestion, not final |
| status | TEXT NOT NULL DEFAULT 'PENDING' | `PENDING/SUCCESS/FAILED/LOW_CONFIDENCE` |
| error_message | TEXT NULL | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

Index: `(grievance_id, created_at)`.

### `grievance_embeddings`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| grievance_id | UUID FK → grievances.id ON DELETE CASCADE UNIQUE | one current embedding per grievance |
| embedding | VECTOR(N) NOT NULL | `N` = chosen embedding model's output dim (e.g. 1024 for BGE-M3, verify against chosen model) |
| embedding_model | TEXT NOT NULL | for reproducibility if the model changes later |
| created_at | TIMESTAMPTZ DEFAULT now() | |

Index: `ivfflat (embedding vector_cosine_ops)` (or `hnsw` — benchmark both; `hnsw` is
usually the better default for this table size, `ivfflat` is fine and simpler for a
prototype-scale dataset).

### `grievance_relations`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| grievance_id_a | UUID FK → grievances.id ON DELETE CASCADE | |
| grievance_id_b | UUID FK → grievances.id ON DELETE CASCADE | |
| similarity_score | NUMERIC(4,3) NOT NULL | |
| relation_type | TEXT NOT NULL | `DUPLICATE / RELATED / UNRELATED` |
| confirmed_by | UUID FK → users.id NULL | human confirmation, null until reviewed |
| confirmed_at | TIMESTAMPTZ NULL | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

Constraint: `CHECK (grievance_id_a <> grievance_id_b)`, unique on
`(grievance_id_a, grievance_id_b)`. Never auto-set `relation_type = DUPLICATE` as a
final merge — that always requires `confirmed_by`.

### `institutional_issues`
(Supports §11 of `prd.md` — the emerging-issue aggregation. Not in the original 16-table
list but required to persist issue state rather than recompute it on every page load.)
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| title | TEXT NOT NULL | e.g. "Hostel Water Supply — Block A–D" |
| category_id | UUID FK → categories.id NULL | |
| status | TEXT NOT NULL DEFAULT 'UNDER_INVESTIGATION' | |
| first_reported_at | TIMESTAMPTZ NOT NULL | |
| last_reported_at | TIMESTAMPTZ NOT NULL | |
| affected_locations | JSONB NULL | |
| related_grievance_count | INTEGER NOT NULL DEFAULT 0 | denormalized for dashboard speed |
| created_at / updated_at | TIMESTAMPTZ | |

### `institutional_issue_members`
Join table linking grievances to an issue.
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| issue_id | UUID FK → institutional_issues.id ON DELETE CASCADE | |
| grievance_id | UUID FK → grievances.id ON DELETE CASCADE | |
| added_at | TIMESTAMPTZ DEFAULT now() | |

Unique on `(issue_id, grievance_id)`.

---

## 5. Notifications, Escalations, Feedback, Audit

### `notifications`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK → users.id | recipient |
| grievance_id | UUID FK → grievances.id NULL | |
| event_type | TEXT NOT NULL | e.g. `SLA_APPROACHING`, `RESOLVED` |
| message | TEXT NOT NULL | |
| is_read | BOOLEAN DEFAULT false | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

Index: `(user_id, is_read)`.

### `escalations`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| grievance_id | UUID FK → grievances.id ON DELETE CASCADE | |
| escalated_from | UUID FK → users.id NULL | |
| escalated_to | UUID FK → users.id NULL | |
| trigger_reason | TEXT NOT NULL | `SLA_VIOLATED / CRITICAL / REOPENED / NO_RESPONSE` |
| created_at | TIMESTAMPTZ DEFAULT now() | |

### `feedback`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| grievance_id | UUID FK → grievances.id ON DELETE CASCADE UNIQUE | one feedback per case |
| student_id | UUID FK → users.id | |
| satisfaction_rating | SMALLINT NOT NULL | e.g. 1–5 |
| comment | TEXT NULL | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

### `audit_logs`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| actor_id | UUID FK → users.id NULL | null for system-triggered events |
| action | TEXT NOT NULL | e.g. `GRIEVANCE_STATUS_CHANGED`, `EVIDENCE_DOWNLOADED` |
| entity_type | TEXT NOT NULL | e.g. `grievance`, `evidence`, `user` |
| entity_id | UUID NOT NULL | |
| metadata | JSONB NULL | before/after or context |
| created_at | TIMESTAMPTZ DEFAULT now() | |

Index: `(entity_type, entity_id)`, `(actor_id, created_at)`.

---

## 6. Configuration Tables

### `categories`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | TEXT UNIQUE NOT NULL | the 13-category MVP list |
| default_priority_policy | TEXT NULL | e.g. `Ragging` → policy-defined critical |
| is_active | BOOLEAN DEFAULT true | |

### `subcategories`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| category_id | UUID FK → categories.id ON DELETE CASCADE | |
| name | TEXT NOT NULL | |

Unique on `(category_id, name)`.

### `routing_rules`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| category_id | UUID FK → categories.id | |
| subcategory_id | UUID FK → subcategories.id NULL | null = applies to whole category |
| department_id | UUID FK → departments.id | resolved routing target |
| priority | INTEGER DEFAULT 0 | rule precedence when multiple match |

### `sla_rules`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| priority | TEXT UNIQUE NOT NULL | `LOW/MEDIUM/HIGH/CRITICAL` |
| hours | INTEGER NOT NULL | e.g. 24/48/72/120 defaults |

### `escalation_rules`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| trigger_reason | TEXT NOT NULL | |
| escalate_to_role_id | UUID FK → roles.id | |
| is_active | BOOLEAN DEFAULT true | |

### `institution_settings`
Single-row (or small) config table for institution-wide values (name, department
list source, feature flags). Kept intentionally generic rather than hardcoded, per
the "configuration over hardcoded business logic" rule.

---

## 7. Notes on `pgvector` Sizing

Set `VECTOR(N)` to match whichever embedding model wins the benchmark in
`techspec.md` §3/§10 — don't hardcode a dimension before that benchmark runs. Common
values: `BGE-M3` → 1024, `Qwen3-Embedding-0.6B` → check the specific release's output
dimension before migrating (varies by model card; confirm at implementation time
rather than assuming). Changing embedding models later means a migration that
re-embeds all existing `grievance_embeddings` rows — plan for that as a one-time
backfill script, not a live migration.

## 8. Multi-Institution Note

The schema is single-institution in practice (no `institution_id` foreign key
threaded through every table) per the PRD's explicit non-goal. It isn't actively
hostile to adding one later (most tables could take an `institution_id` column
without a redesign), but don't add it preemptively — see `rules.md` on
over-engineering.
