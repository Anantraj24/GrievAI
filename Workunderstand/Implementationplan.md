# GrievAI — Implementation Plan

**Companion docs:** `Tracker.md` (living checklist against these phases), `rules.md`
(how to work within each phase)

Work phase-by-phase. Do not start P4 before P3 is functionally complete, etc. — the
architecture depends on the deterministic layer (P1–P3) existing and being trustworthy
*before* AI output has anything real to plug into.

---

## P0 — Architecture & Contracts
**Goal:** lock the shape of the system before writing feature code.
- Finalize `Schema.md` against real migration files (Alembic init).
- Finalize API contract skeletons (Pydantic schemas for every endpoint in
  `techspec.md` §7, even if handlers are stubs).
- Stand up `docker-compose.yml`: `db` (Postgres+pgvector), `api` skeleton.
- Decide: session vs. JWT auth (pick one, document why in `rules.md` or a short ADR).
- Decide: evidence storage target (local disk vs. MinIO/S3-compatible) — resolves
  the PRD open question.
**Exit criteria:** `docker compose up` brings up an empty but connected db+api;
migrations run cleanly; every planned endpoint exists as a typed stub.

## P1 — Foundation
- Repository structure per `techspec.md` §1 (`frontend/`, `backend/app/{api,auth,ai,
  models,schemas,services,rules}`, `tests/`, `migrations/`, `data/`, `experiments/`,
  `docs/`).
- Base FastAPI app: config loading, DB session management, error handling
  middleware, logging setup.
- Base React app: routing skeleton, API client, auth context.
**Exit criteria:** a health-check round trip works frontend → backend → db.

## P2 — Authentication + RBAC
- `users`, `roles`, `departments` tables live.
- Register/login/logout/me endpoints, password hashing, session/JWT issuance.
- Server-side RBAC middleware; role-gated route examples for all three personas.
- Frontend: login screen, protected routes, role-aware navigation shell.
**Exit criteria:** three seeded users (student/authority/admin) can log in and each
sees only their permitted routes.

## P3 — Core Grievance Workflow (no AI yet)
- `grievances`, `status_history`, `comments`, `evidence` tables live.
- Submission endpoint (text + metadata + evidence upload, evidence validated per
  `techspec.md` §8).
- Status state machine enforced server-side (`techspec.md` §6) — invalid transitions
  rejected.
- Student screens: Submit Grievance, My Grievances, Grievance Details.
- Authority screens: Grievance Queue, basic case view, manual status update.
**Exit criteria:** a student can submit a grievance with evidence, an authority can
see it, update status through valid transitions, and the student sees the timeline
update — entirely without AI.

## P4 — AI Proof of Concept
- Ollama running locally with the model chosen per `techspec.md` §3 benchmarking.
- NLU extraction module (`ai/`) with schema-validated output (§4.1).
- Classification module, benchmarked against the TF-IDF+LogReg baseline on your
  labeled dataset (§4.2).
- `ai_analyses` table populated on submission; failure/low-confidence states wired
  to the fallback behavior in `techspec.md` §9.
**Exit criteria:** submitting a grievance produces a stored, schema-valid AI analysis
row (or a clean fallback state) without ever blocking submission.

## P5 — Embeddings + pgvector
- Embedding model selected and benchmarked per `techspec.md` §3.
- `grievance_embeddings` table populated on submission.
- Similarity search endpoint (`GET /grievances/{id}/related`) with threshold tuned
  on a validation split.
- `grievance_relations` table, Duplicate Review UI (authority confirms/rejects).
**Exit criteria:** submitting a near-duplicate of an existing grievance surfaces it
as a related candidate with a similarity score, and confirming/rejecting it persists.

## P6 — Human-in-the-Loop AI Surfacing
- Priority engine (`rules/`) consuming AI signals, deterministic, tested in
  isolation (unit tests from `techspec.md` §10).
- Routing table + recommendation surfaced with override control.
- Grievance Intelligence Workspace screen assembled (per `Appflow.md` §5) wiring
  together AI analysis, related complaints, routing, and override actions.
**Exit criteria:** every AI-populated field in the workspace has a working
accept/override path, and overrides are recorded (feeds the override-rate metric).

## P7 — Response, SLA, Escalation, Notifications, Feedback
- Response drafting module (§4.7) + edit/approve/send flow.
- SLA engine + deadline computation on grievance creation/priority change.
- Escalation engine wired to SLA breach and manual escalation.
- In-app notifications for the event list in `Appflow.md` §6.
- Feedback submission on resolved cases.
**Exit criteria:** the full loop in `prd.md` §10 (Definition of Done) works end to
end for a single grievance.

## P8 — Analytics + Institutional Issue Intelligence
- `institutional_issues` / `institutional_issue_members` populated from confirmed
  `RELATED`/`DUPLICATE` clusters above threshold.
- Admin Dashboard, Institutional Issues, Analytics screens — all reading from
  database truth, never AI-generated numbers (`prd.md` §9).
**Exit criteria:** submitting several worded-differently duplicates of the same
issue produces a visible "emerging issue" card with correct counts and locations.

## P9 — Research Experiments
- Run the four experiments from `techspec.md` §11 on your dataset.
- Produce confusion matrices, P/R/F1 tables, threshold-analysis charts, latency
  numbers.
- Write up results in `docs/` — this is the material a viva panel or a paper draft
  would actually cite.
**Exit criteria:** every metric in `techspec.md` §11 has a real number attached to it,
not a placeholder.

## P10 — Security + UI Polish
- Full pass on `techspec.md` §8 (auth, object-level checks, evidence access, rate
  limiting, CORS) plus the security test suite (§10).
- Prompt-injection test cases run and documented.
- UI polish pass against `Design.md` (Stitch) for all 18 screens, plus the shared
  states (loading/empty/error/AI-failure/confirmation).
**Exit criteria:** the security test suite passes; no screen is missing an
error/empty/loading state.

## P11 — Deployment + Final Demo
- Full `docker-compose.yml` (db, api, frontend; Ollama native or containerized per
  the tradeoff in `techspec.md` §12).
- Seed script producing a convincing demo dataset (including the "37 related
  hostel-water complaints" scenario from `prd.md`).
- Rehearse the demo story from `prd.md`/`techspec.md` end to end.
**Exit criteria:** a fresh machine can `docker compose up`, seed data, and run the
full demo story without manual patching.

---

## Sequencing Notes

- P4 and P5 can be developed in parallel branches once P3 is stable, but should not
  merge into the workspace UI (P6) until both are individually working — otherwise
  debugging AI issues gets tangled with debugging the UI wiring.
- P9 (research experiments) can start as soon as P4/P5 produce stable outputs — you
  don't need to wait until P8 to begin collecting classification/retrieval metrics,
  even though it's sequenced last for the write-up.
- If timeline pressure hits, the safest cut is inside P8 (defer advanced
  institutional-issue polish) or P10 (defer non-blocking UI polish) — never cut P6
  (human-in-the-loop) or the security items in P10 that gate the security test
  suite; those are the architectural spine of the project.
