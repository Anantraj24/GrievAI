# GrievAI — Project Context

> **AI RULE:** Read this context file first in every session. Use it as the primary project context. Only inspect files relevant to the current task. Do not scan the entire project unless this context is missing or outdated.

_Last verified: 2026-09-08 on commit `6859e36` (branch `main`, working tree clean except QA setup). Update this file when architecture, features, APIs, DB, deps, or workflows change._

## Project purpose & status
GrievAI is an autonomous, "institutional-grade" AI-powered grievance resolution platform for universities/colleges/enterprise campuses. It combines a **local LLM layer (Ollama: Llama 3 + BGE-M3 embeddings)** with a **deterministic rules layer (finite state machine, SLA timers, safety-keyword routing)** to triage, route, escalate, and resolve student complaints with explainability. Full-stack, production-deployed (Render backend + Vercel frontend + Supabase Postgres/pgvector). Status: production-ready with CI/CD, tests, and docs; actively maintained.

## Tech stack & dependencies
- **Backend** (`backend/`): Python 3.10–3.12, FastAPI 0.110, Uvicorn, SQLAlchemy 2.0.29 + Alembic 1.13.1, Pydantic v2 + pydantic-settings, psycopg3, pgvector. Auth: python-jose JWT + passlib[bcrypt]. AI: httpx→Ollama REST API, scikit-learn (offline fallback keyword classifier). Extras: slowapi (rate limiting), gunicorn (prod), python-multipart.
- **Frontend** (`frontend/`): React 19, TypeScript ~6.0, Vite 8, Tailwind CSS 3, react-router-dom 7, axios, recharts, lucide-react, canvas-confetti. Lint: oxlint.
- **Infra**: PostgreSQL + pgvector (Supabase in prod; SQLite `grievai_dev.db` for local), Ollama local AI at `:11434`, Docker Compose (local full-stack), Render (API), Vercel (SPA), GitHub Actions CI.
- **Root meta package** (`package.json`): workspace wrapper running frontend scripts.

## Important folder/file structure
- `backend/app/` — FastAPI app
  - `main.py` — app entrypoint, security headers middleware, CORS, router mounting, `/health`
  - `models.py` — all 23 SQLAlchemy entities (single file)
  - `api/` — routers: `auth.py`, `grievances.py`, `analytics.py`, `evidence.py`, `ai.py`, `notifications.py`, `admin.py`, `deps.py`
  - `core/` — `config.py` (Settings), `database.py`, `security.py`
  - `schemas/` — Pydantic models: `auth.py`, `grievance.py`, `admin.py`, `notification.py`, `enums.py`
  - `rules/` — deterministic engine: `state_machine.py`, `priority.py`, `routing.py`, `sla.py`
  - `services/` — `grievance_service.py`, `routing_service.py`, `sla_service.py`, `institutional_service.py`, `ai_tasks.py`
  - `ai/ai_service.py` — Ollama client (NLU, embeddings, draft generation, fallback)
- `backend/migrations/` — Alembic (1 initial revision: `cd1346307e2b_initial_23_tables.py`)
- `backend/tests/` — pytest suite (auth, grievances, rules, state machine, AI resilience, security/hardening, notifications/admin, production readiness audit)
- `backend/seed.py` — seeds roles, demo users, categories, routing rules, SLA policies
- `frontend/src/` — SPA: `App.tsx` (routes + ProtectedRoute), `api/api.ts` (axios client), `services/` (axios endpoint layer + mockData), `context/` (AuthContext, ToastContext), `types/index.ts`, `pages/` (30 pages in student/authority/admin groups + shared), `components/` (Layouts + common)
- `docs/` — `API_REFERENCE.md`, `ARCHITECTURE.md`, `DEPLOYMENT_GUIDE.md`, research results
- Root deploy: `docker-compose.yml`, `docker-compose.prod.yml`, `DEPLOYMENT.md`, `render.yaml`, `vercel.json`, `Procfile`, `alembic.ini`, `.github/workflows/ci.yml`
- Legacy/design junk (not runtime, ignore): `grievai-uiux-Frontend/` (design system), `Workunderstand/`, `experiments/`, `data/`, root `venv/`, `storage/`

## Architecture & data flow
```
React SPA → HTTPS / JWT → FastAPI (/api/v1)
  ├─ Auth & RBAC (student | authority | admin)
  ├─ Grievance CRUD + lifecycle (forward-only state machine: SUBMITTED→PENDING_REVIEW→NEEDS_INFORMATION/ASSIGNED→IN_PROGRESS→RESOLVED→CLOSED, +REOPENED/REJECTED/ESCALATED)
  ├─ Rules engine: priority (safety keywords + impact), routing (department auto-assign), SLA deadlines (12–120h)
  └─ AI orchestrator: Ollama NLU/embeddings/drafts, pgvector dedupe → institutional issue clusters
DB: PostgreSQL + pgvector (prod) | SQLite (dev)        AI: Ollama (llama3 + bge-m3), graceful offline fallback
```
Submission pipeline: grievance created → AI → priority/routing/SLA auto-applied → assigned authority → resolution draft (AI co-pilot) → feedback (5-star/CSAT). Dedup/relations via 1024-dim embeddings + `grievance_relations`; grouped issues surface as `InstitutionalIssue` clusters.

## Main features
- Smart multi-lingual grievance submission (EN/HI/Hinglish) with category/safety suggestions
- Live status timeline, SLA countdown, immutable `status_history` + `audit_logs`
- Evidence vault (SHA-256, MIME whitelist, 10MB cap) with IDOR checks
- Authority triage board (department/priority/SLA-breach filters), duplicate detection, AI response co-pilot (Formal/Empathetic/Direct), escalation management
- Admin center: analytics (MTTR, SLA adherence), institutional problem clusters, taxonomy & SLA governance (departments/categories/subcategories), user management, audit logs
- In-app notifications; rate limiting; prompt-injection sanitization for AI
- Graceful offline mode: deterministic routing when Ollama is down

## Database / models
`backend/app/models.py` — 23 tables (Base declarative):
Roles, Departments, Users, Categories, Subcategories, Grievances (`GRV-YYYY-XXXX` code), GrievanceAssignments, StatusHistory, Comments, Evidence, AIAnalyses, GrievanceEmbeddings (pgvector), GrievanceRelations (DUPLICATE/RELATED), InstitutionalIssues, InstitutionalIssueMembers, Notifications, Escalations, Feedback, AuditLogs, RoutingRules, SLARules, EscalationRules, InstitutionSettings.
Key enums (`schemas/enums.py`): roles `student|authority|admin`; status `SUBMITTED|PENDING_REVIEW|NEEDS_INFORMATION|ASSIGNED|IN_PROGRESS|RESOLVED|CLOSED|REOPENED|REJECTED|ESCALATED`; priority `LOW|MEDIUM|HIGH|CRITICAL`; relation `DUPLICATE|RELATED|UNRELATED`.
Migrations: Alembic, single initial revision. Seed via `python seed.py` (creates all tables + demo data).

## APIs / backend
All under `/api/v1`. Routers in `backend/app/api/` (details in `docs/API_REFERENCE.md`):
- `auth`: `POST /auth/register`, `POST /auth/login`, `POST /auth/token`, `GET /auth/me`, `POST /auth/logout`
- `grievances`: `POST ""`, `GET ""`, `GET /{id}`, `POST /{id}/status`, `POST /{id}/assign`, `POST /{id}/comments`, `POST /{id}/feedback`
- `ai`: `GET /grievances/{id}/ai-analysis`, `GET /grievances/{id}/related`, `POST /grievances/{id}/response-draft`
- `evidence`: `POST /grievances/{id}/evidence`, `GET /grievances/{id}/evidence/{evidence_id}`
- `analytics`: `GET /analytics/dashboard`
- `notifications`: `GET ""`, `POST /{id}/read`, `POST /read-all`
- `admin`: users CRUD, `GET/POST/PUT /departments`, `GET/POST /categories`, `POST /categories/{id}/subcategories`, `GET/PUT /sla-rules`, `GET /institutional-issues`
- Health: `GET /health` and `GET /api/v1/health`
- Docs (dev only): `/api/v1/docs` (Swagger), `/api/v1/redoc`
- JWT passed as `Authorization: Bearer`; role-gated. Startup: `alembic upgrade head` first (per Render start command).

## Frontend / components
- Routes in `App.tsx`: role-based `ProtectedRoute` guards each portal area. Portals: Student (`/student/*`) allowed roles student+admin; Authority (`/authority/*`) authority+admin; Admin (`/admin/*`) admin only. Plus `/login`, `/register`, `/unauthorized`, `404`.
- `src/api/api.ts`: axios instance, base URL from `VITE_API_URL || http://localhost:8000/api/v1`, attaches JWT from `localStorage.access_token`, global 401→redirect `/login`.
- `src/services/`: `adminService.ts`, `aiEngine.ts`, `grievanceService.ts`, `notificationService.ts`, `auditService.ts`, `storage.ts`, `mockData.ts` (fallback demo data).
- `src/context/`: `AuthContext.tsx` (session + role), `ToastContext.tsx`.
- Reusable layouts: `components/AdminLayout.tsx`, `AuthorityLayout.tsx`, `Layout.tsx`; `components/common/` includes `DemoRoleSwitcher` (dev role switch overlay).
- 30 pages under `src/pages/` (e.g., SubmitGrievance, GrievanceQueue, Workspace, ResolutionWorkspace, AdminAnalytics, InstitutionalIssues, AdminSLA, AdminAuditLogs…).

## Auth / configuration
- Backend `.env` (in `backend/`; template `.env.example`): `PROJECT_NAME`, `ENVIRONMENT`, `PORT`, `SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES` (1440), `DATABASE_URL`, `OLLAMA_BASE_URL`, `OLLAMA_LLM_MODEL=llama3`, `OLLAMA_EMBED_MODEL=bge-m3`, `OLLAMA_TIMEOUT_SECONDS=15.0`, `CORS_ORIGINS`, `EVIDENCE_STORAGE_DIR=storage/evidence`.
- Frontend `.env`: `VITE_API_URL` (dev: `http://localhost:8000/api/v1`, prod: `/api/v1` or Render URL).
- Local dev fallback: set `DATABASE_URL=sqlite:///./grievai_dev.db`, `ENVIRONMENT=development`.
- Demo accounts (from `seed.py`): `student@example.com`, `anantraj@institution.edu`, `authority@example.com`, `ramesh.sharma@institution.edu`, `arvind.nambiar@institution.edu`, `admin@example.com` — all password `password123`.

## Dev / build / test / deploy commands
```bash
# Backend
cd backend && python -m venv venv && .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python seed.py                                  # create tables + seed demo data
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pytest -v                                       # run test suite (tests/)
cd ..\backend && alembic upgrade head           # apply migrations
# Frontend
cd frontend && npm install && npm run dev       # → :5173
npm run build                                   # tsc -b && vite build
npm run lint                                    # oxlint
# Root shortcuts: npm run dev|build|preview (proxies to frontend)
# Full stack Docker: docker-compose up --build   (frontend :3000, api :8000, db :5432)
# Production: Render = alembic upgrade head && gunicorn -w 2 -k uvicorn.workers.UvicornWorker app.main:app; Vercel = vite build with SPA rewrites
```
CI (`.github/workflows/ci.yml`): backend pytest against pgvector Postgres + frontend `npm run build` + Docker image build validation.

## Testing / QA setup
- **Unified QA pipeline** (root): `npm run qa` = `qa:static` (lint + typecheck + build) → `qa:unit` (frontend Vitest + backend pytest) → `qa:e2e` (Playwright). Sub-commands: `qa:static`, `qa:unit`, `qa:e2e`, `lint`, `typecheck`, `build`, `test:frontend`, `test:backend`, `test:e2e`.
- **Frontend unit tests**: Vitest 5 + jsdom, config `frontend/vitest.config.ts`, tests in `src/**/__tests__/*.test.ts`.
- **E2E**: Playwright 1.63 (Chromium), config `frontend/playwright.config.ts`, specs in `frontend/e2e/` (smoke + axe a11y). Starts Vite dev on :5173 automatically. Install browser via `npm --prefix frontend run playwright:install`.
- **Backend**: pytest (in-memory SQLite via `conftest.py`, 31 tests). Requires `DATABASE_URL` dep `psycopg` importable; backend/venv lacks pytest — run with system Python (`python -m pytest`) or install requirements into the venv.
- **Skills**: Antigravity skills in `.agents/skills/` (playwright-automation, api-testing, unit-testing, accessibility-testing, security-testing, ai-bug-triage) + root `skills-lock.json`.
- Note: `frontend/test-results`, `playwright-report/` are gitignored; `npm run lint` (oxlint) exits 0 with pre-existing warnings.

## Current Git branch & important changes
- Branch `main`, tracks `origin/main`. Working tree **clean** at commit `6859e36` ("fix(all): resolve core backend crashes, api contracts, auth flows, and frontend integrations", anantraj24).
- Recent history: README/docs; research benchmarks for routing/response quality; full-stack production deployment infra + CI/CD; prod-readiness stress/security audit suite; strict upload validation/IDOR/prompt-injection hardening; frontend↔backend integration (admin center, notifications, analytics, grievance lifecycle, auth+Supabase session).

## Known bugs, TODOs, and important technical decisions
- **Hardcoded default `SECRET_KEY`** in `backend/app/core/config.py` — fallback used if unset; must be overridden in any real deployment (CI sets one). Do not commit real keys.
- `backend/.env.example` contains a Supabase pooler host; treat DB creds as gitignored secrets (`.env` is gitignored).
- AI is optional: system degrades to deterministic routing when Ollama is unreachable (by design).
- Migrations: single monolithic initial revision; schema changes need new Alembic revisions.
- Legacy/stale dirs (`grievai-uiux-Frontend`, `Workunderstand`, `experiments`, `data`, root `venv`) are not part of the runtime stack — do not build on them.
- Architecture decisions recorded in `docs/ARCHITECTURE.md`; API contracts in `docs/API_REFERENCE.md`.

## Project-specific coding rules
- No `AGENTS.md` exists. Follow conventions below.
- Backend: add endpoints via routers in `app/api/` with Pydantic schemas in `app/schemas/` (v2 style); entities live in `app/models.py`; business rules live in `app/rules/` (deterministic, forward-only state transitions); keep AI calls behind `app/ai/ai_service.py` with graceful fallback; run pytest before finishing.
- Frontend: TypeScript (strict) + oxlint clean; use the shared axios client in `src/api/api.ts`; add API methods under `src/services/`; keep types in `src/types/index.ts`; Tailwind utility classes for styling; role-gate every route via `ProtectedRoute`.
- Never commit secrets or `.env` files. Keep evidence storage gitignored.
- Keep this context file (`anant-context-GrievAI.md`) updated on significant architecture/API/DB/dependency/workflow changes.