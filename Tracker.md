# GrievAI — Build Tracker

Update this file as you go — check items off, add dates, and note blockers inline.
Mirrors the phases in `Implementationplan.md`. Status legend: `[ ]` not started,
`[~]` in progress, `[x]` done, `[!]` blocked.

**Last updated:** 2026-08-24

---

## P0 — Architecture & Contracts
- [ ] Migration setup (Alembic) matching `Schema.md`
- [ ] API contract skeletons for every endpoint in `techspec.md` §7
- [ ] `docker-compose.yml` — db + api skeleton boot
- [ ] Decision: session vs. JWT auth
- [ ] Decision: evidence storage target (local disk vs. MinIO/S3-compatible)
- [x] UI/UX screens designed (Stitch → `Design.md`)

## P1 — Foundation
- [ ] Repo structure scaffolded
- [ ] FastAPI base app (config, DB session, error handling, logging)
- [ ] React base app (routing, API client, auth context)
- [ ] Health-check round trip working

## P2 — Authentication + RBAC
- [ ] `users` / `roles` / `departments` tables
- [ ] Register / login / logout / me endpoints
- [ ] Server-side RBAC middleware
- [ ] Login screen + protected routes + role-aware nav
- [ ] Three seeded test users (student/authority/admin) can log in correctly

## P3 — Core Grievance Workflow (pre-AI)
- [ ] `grievances` / `status_history` / `comments` / `evidence` tables
- [ ] Submission endpoint incl. evidence validation
- [ ] Status state machine enforced server-side
- [ ] Student: Submit Grievance / My Grievances / Grievance Details
- [ ] Authority: Grievance Queue / case view / manual status update
- [ ] E2E manual test: submit → view → status update, no AI involved

## P4 — AI Proof of Concept
- [ ] Ollama running locally; model benchmarked (§ techspec.md §3)
- [ ] NLU extraction module + schema validation
- [ ] Classification module
- [ ] TF-IDF+LogReg baseline implemented for comparison
- [ ] `ai_analyses` populated on submission incl. failure/low-confidence fallback

## P5 — Embeddings + pgvector
- [ ] Embedding model selected + benchmarked
- [ ] `grievance_embeddings` populated on submission
- [ ] Related-complaint endpoint + threshold tuned on validation split
- [ ] `grievance_relations` + Duplicate Review UI

## P6 — Human-in-the-Loop AI Surfacing
- [ ] Priority engine (deterministic, unit-tested)
- [ ] Routing table + recommendation + override control
- [ ] Grievance Intelligence Workspace assembled
- [ ] Override actions recorded (feeds override-rate metric)

## P7 — Response, SLA, Escalation, Notifications, Feedback
- [ ] Response drafting module + edit/approve/send flow
- [ ] SLA engine + deadline computation
- [ ] Escalation engine (SLA breach + manual)
- [ ] In-app notifications for full event list
- [ ] Feedback submission on resolved cases
- [ ] Full Definition-of-Done loop (prd.md §10) verified end to end

## P8 — Analytics + Institutional Issue Intelligence
- [ ] `institutional_issues` / `institutional_issue_members` populated from clusters
- [ ] Admin Dashboard (database-truth numbers only)
- [ ] Institutional Issues screen
- [ ] Analytics screen
- [ ] Verified: multiple worded-differently duplicates → correct emerging-issue card

## P9 — Research Experiments
- [ ] Experiment 1: TF-IDF+LogReg vs. LLM classification (Macro-F1)
- [ ] Experiment 2: lexical vs. embedding similarity (P/R/F1)
- [ ] Experiment 3: manual/static vs. AI+deterministic routing (Top-1/Top-3)
- [ ] Experiment 4: template vs. AI-drafted response (human quality score)
- [ ] Results written up in `docs/`

## P10 — Security + UI Polish
- [ ] Auth/object-level/evidence-access/rate-limit/CORS pass complete
- [ ] Security test suite passing (unauthorized access, role escalation, prompt
      injection, upload validation, rate limiting)
- [ ] Prompt-injection test cases documented
- [ ] All 18 screens have loading/empty/error/AI-failure/confirmation states

## P11 — Deployment + Final Demo
- [ ] Full `docker-compose.yml` (db, api, frontend, Ollama)
- [ ] Seed script with convincing demo dataset (incl. hostel-water-cluster scenario)
- [ ] Demo story rehearsed end to end on a fresh machine

---

## Open Decisions Log
*(pulled from `prd.md` §13 — resolve and date-stamp as decided)*
- [ ] Department/category structure source for the demo dataset
- [ ] Target dataset size/shape for a convincing institutional-issue demo
- [ ] Evidence storage: local disk vs. MinIO/S3-compatible
- [ ] Is a research paper submission actually planned, or is P9 for viva/portfolio only?

## Blockers
*(nothing logged yet — add here as they come up, with phase + date)*
