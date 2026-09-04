# 🎓 GrievAI — Autonomous AI-Powered Institutional Grievance Resolution Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.110-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%208-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%206-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20pgvector-336791.svg?logo=postgresql&logoColor=white)](https://github.com/pgvector/pgvector)
[![Ollama](https://img.shields.io/badge/AI%20Engine-Ollama%20(Llama%203%20%2B%20BGE--M3)-FB7A24.svg?logo=ollama&logoColor=white)](https://ollama.ai)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%203-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**GrievAI** is an institutional-grade, multi-tier autonomous grievance intelligence and SLA management platform designed for universities, colleges, and enterprise campuses. It combines **Local Generative AI (LLMs & Dense Vector Embeddings)** with **Deterministic Finite State Automata (DFA)** to deliver fast, fair, transparent, and explainable grievance triage, routing, escalation, and resolution.

---

## 📑 Table of Contents

- [Key Capabilities](#-key-capabilities)
- [System Architecture](#-system-architecture)
- [System Prerequisites](#-system-prerequisites)
- [Quick Start Guide (Step-by-Step for New Users)](#-quick-start-guide-step-by-step-for-new-users)
  - [Part 1: Setup & Run AI Service (Ollama)](#part-1-setup--run-the-ai-service-ollama)
  - [Part 2: Setup & Run Backend API (FastAPI)](#part-2-setup--run-the-backend-fastapi)
  - [Part 3: Setup & Run Frontend (React + Vite)](#part-3-setup--run-the-frontend-react--vite)
- [Alternative: 1-Click Docker Startup](#-alternative-1-click-docker-startup)
- [Pre-Seeded Demo Accounts](#-pre-seeded-demo-accounts)
- [Core Portals & Features](#-core-portals--features)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Configuration (.env)](#-environment-configuration-env)
- [Running Tests](#-running-tests)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🚀 Key Capabilities

* 🧠 **Dual Intelligence Engine**:
  * **Probabilistic AI Layer (Ollama / Local LLMs)**: Natural language understanding (NLU), entity & severity extraction, multilingual support (English, Hindi, Hinglish), 1024-dim dense vector embeddings, and AI-assisted official response drafting.
  * **Deterministic Rules Layer**: Safety keyword escalation (gas leak, harassment, electrical sparks), strict mathematical SLA deadline timers (12h–120h), and forward-only state machine transitions.
  * **Graceful Offline Fallback**: If the local AI model is offline or unreachable, the system automatically falls back to deterministic rule routing without dropping user complaints.
* 🔍 **pgvector Semantic Deduplication**: Instantly flags semantically identical complaints and groups recurring issues into high-level **Institutional Problem Clusters**.
* 🛡️ **Role-Based Access Control (RBAC) & Security**:
  * Strict JWT authentication with scoped roles: **Student**, **Authority Officer**, and **Admin**.
  * Complete IDOR protection and upload sanitization (SHA-256 integrity checks, MIME-type whitelisting, 10MB limits).
  * Pre-flight prompt injection defense against LLM jailbreak attempts.
* 📊 **Institutional Analytics**: Real-time resolution metrics, SLA breach audits, category distributions, and department workload performance dashboards.

---

## 🏛 System Architecture

```
                               ┌─────────────────────────────────────────┐
                               │       React 19 Frontend SPA (Vite)      │
                               │  Student Portal │ Authority │ Admin Hub │
                               └────────────────────┬────────────────────┘
                                                    │ HTTPS / JWT Auth
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │         FastAPI Backend Service         │
                               │  ┌──────────────┐ ┌──────────────────┐  │
                               │  │  Auth & RBAC │ │  Grievance CRUD  │  │
                               │  └──────┬───────┘ └────────┬─────────┘  │
                               │         │                  │            │
                               │  ┌──────▼──────────────────▼─────────┐  │
                               │  │    Deterministic Rules Engine     │  │
                               │  │ Priority • SLA Timers • Routing   │  │
                               │  └──────────────────┬────────────────┘  │
                               │                     │                   │
                               │  ┌──────────────────▼────────────────┐  │
                               │  │    AI Microservice Orchestrator   │  │
                               │  │   NLU • Deduplication • Drafts    │  │
                               │  └──────────────────┬────────────────┘  │
                               └─────────────────────┼───────────────────┘
                                                     │
                             ┌───────────────────────┴───────────────────────┐
                             ▼                                               ▼
              ┌─────────────────────────────┐                 ┌─────────────────────────────┐
              │    PostgreSQL + pgvector    │                 │   Ollama Local AI Engine    │
              │  23 Relational Core Tables  │                 │  Llama 3 / Mistral / BGE-M3 │
              │   (or SQLite for Local Dev) │                 │   (Port 11434, with Offline │
              │         (Port 5432)         │                 │          Fallback)          │
              └─────────────────────────────┘                 └─────────────────────────────┘
```

---

## 📦 System Prerequisites

Before starting, ensure you have the following installed on your machine:

| Tool | Minimum Version | Download Link | Purpose |
| :--- | :--- | :--- | :--- |
| **Python** | 3.10 or newer | [python.org](https://www.python.org/downloads/) | Backend API runtime |
| **Node.js** | 18.x or 20.x+ | [nodejs.org](https://nodejs.org/) | Frontend runtime & package manager |
| **Git** | 2.x+ | [git-scm.com](https://git-scm.com/) | Version control |
| **Ollama** *(Optional for AI)* | Latest | [ollama.ai](https://ollama.ai/download) | Local LLM inference engine |
| **Docker** *(Optional)* | Latest | [docker.com](https://www.docker.com/) | Containerized orchestration |

---

## 🛠 Quick Start Guide (Step-by-Step for New Users)

Follow these 3 easy parts to get everything up and running locally.

### Clone the Repository

Open your terminal (PowerShell, Command Prompt, Bash, or Zsh) and run:

```bash
git clone https://github.com/Anantraj24/GrievAI.git
cd GrievAI
```

---

### Part 1: Setup & Run the AI Service (Ollama)

GrievAI uses **Ollama** for local AI intelligence (NLU triage extraction, vector embeddings, and resolution drafting).

> 💡 **Note**: If you do not have Ollama installed yet, **the backend still works!** It will automatically activate its built-in offline fallback engine. To enable full AI features:

1. **Install Ollama**:
   - **Windows & macOS**: Download and run the installer from [ollama.ai/download](https://ollama.ai/download).
   - **Linux**: Run `curl -fsSL https://ollama.com/install.sh | sh`.

2. **Pull the AI Models**:
   Open a terminal and download the recommended LLM and embedding models:
   ```bash
   # Download the LLM for grievance triage and response drafting (approx. 4.7 GB)
   ollama pull llama3

   # Download the dense vector embedding model for similarity & duplicate search
   ollama pull bge-m3
   ```

3. **Start the Ollama Server**:
   ```bash
   ollama serve
   ```
   *Ollama will run at `http://localhost:11434`.*

---

### Part 2: Setup & Run the Backend (FastAPI)

Open a **new terminal window** in the project root (`GrievAI`):

#### 1. Navigate to the backend folder:
```bash
cd backend
```

#### 2. Create and activate a Python Virtual Environment:

- **On Windows (PowerShell):**
  ```powershell
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```
  *(If you get a script execution policy error in PowerShell, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` and then run the activate command again)*

- **On Windows (Command Prompt):**
  ```cmd
  python -m venv venv
  .\venv\Scripts\activate.bat
  ```

- **On macOS / Linux:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

#### 3. Install backend dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 4. Configure Environment Variables:
Create your local `.env` configuration file from the template:

- **Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```
- **Windows (CMD):**
  ```cmd
  copy .env.example .env
  ```
- **macOS / Linux:**
  ```bash
  cp .env.example .env
  ```

> ⚙️ **Database Note**: By default, `.env` is configured to connect to PostgreSQL. If you want to run zero-setup local SQLite development without PostgreSQL, simply set in your `backend/.env`:
> ```ini
> DATABASE_URL=sqlite:///./grievai_dev.db
> ENVIRONMENT=development
> ```

#### 5. Seed the Database with Initial Data & Demo Accounts:
Run the seed script to create all 23 database tables, initial categories, routing rules, SLA policies, and demo users:
```bash
python seed.py
```
*(You will see `[OK] Seeded Roles`, `[OK] Seeded Users`, `[OK] Seeded Categories`, etc.)*

#### 6. Start the FastAPI Development Server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Backend API is live at: **`http://localhost:8000`**
- Interactive Swagger API Documentation: **`http://localhost:8000/api/v1/docs`**
- Healthcheck Endpoint: **`http://localhost:8000/api/v1/health`**

---

### Part 3: Setup & Run the Frontend (React + Vite)

Open a **third terminal window** in the project root (`GrievAI`):

#### 1. Navigate to the frontend folder:
```bash
cd frontend
```

#### 2. Install Node packages:
```bash
npm install
```

#### 3. Configure Frontend Environment:
Create a `.env` file in the `frontend` directory:
- **Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```
- **macOS / Linux / CMD:**
  ```bash
  cp .env.example .env
  ```
Ensure your `frontend/.env` contains:
```ini
VITE_API_URL=http://localhost:8000/api/v1
```

#### 4. Start the Vite Development Server:
```bash
npm run dev
```

- Frontend App is live at: **`http://localhost:5173`** (or **`http://localhost:3000`**)
- Open your browser and navigate to `http://localhost:5173`.

---

## 🐳 Alternative: 1-Click Docker Startup

If you have **Docker** and **Docker Compose** installed, you can spin up the entire stack (PostgreSQL with `pgvector` + FastAPI Backend + React Frontend) with a single command:

```bash
docker-compose up --build
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **Database**: `localhost:5432`

To stop all containers:
```bash
docker-compose down
```

---

## 👥 Pre-Seeded Demo Accounts

The database comes pre-populated with accounts for testing every persona:

| Role | Email | Password | Access / Portal Permissions |
| :--- | :--- | :--- | :--- |
| 🧑‍🎓 **Student** | `student@example.com` | `password123` | Submit complaints, track status live, upload evidence, submit feedback |
| 🧑‍🎓 **Student (Alt)** | `anantraj@institution.edu` | `password123` | Secondary student account for multi-user testing |
| 👮 **Authority Officer** | `authority@example.com` | `password123` | Triage queue, accept AI drafts, change status, assign work, resolve tickets |
| 👮 **Authority (Estate)** | `ramesh.sharma@institution.edu` | `password123` | Estate & Campus Facilities specialist authority |
| 👮 **Authority (Academic)**| `arvind.nambiar@institution.edu`| `password123` | Academic Affairs & Examinations officer |
| 🛡️ **Super Admin** | `admin@example.com` | `password123` | Full admin analytics, SLA policy manager, department routing, user audit logs |

---

## 🌟 Core Portals & Features

### 1. Student Grievance Portal
- **Smart Submission**: Real-time client-side guidance with automatic category suggestions and safety alerts.
- **Multilingual Support**: Submit issues in English, Hindi, or Hinglish.
- **Live Timeline & SLA Tracking**: Transparent status progression with live countdown clocks and immutable audit events.
- **Evidence Vault**: Secure file attachment upload (images, documents, PDFs) with anti-tamper checksums.
- **Resolution Feedback**: 5-star rating system with CSAT sentiment collection.

### 2. Authority Resolution Workspace
- **Actionable Triage Board**: Filter by department, priority level, SLA breach risk, and affected scope.
- **Duplicate & Related Ticket Detection**: Visual semantic similarity score matching with one-click issue merging.
- **AI Response Co-Pilot**: Auto-drafts contextual, empathetic, and professional resolution messages with custom tone selection (Formal, Empathetic, Direct).
- **Escalation Management**: Proactively request supervisor intervention or re-route misclassified tickets.

### 3. Institutional Admin Center
- **System-Wide Analytics**: Real-time statistics on MTTR (Mean Time to Resolution), SLA adherence percentage, and volume trends.
- **Institutional Problem Clusters**: Automatically detects widespread campus anomalies (e.g., floor-wide water outage or Wi-Fi gateway disruption).
- **Taxonomy & SLA Governance**: Define custom departments, categories, subcategories, and priority-to-hour SLA thresholds.

---

## 📂 Project Directory Structure

```
GrievAI/
├── backend/                       # FastAPI Backend Service
│   ├── app/
│   │   ├── ai/                    # Ollama LLM & Vector Client & Prompts
│   │   │   └── ai_service.py      # NLU extraction, embeddings, draft generator
│   │   ├── api/                   # REST API Routers
│   │   │   ├── admin.py           # Admin taxonomy & SLA governance
│   │   │   ├── ai.py              # AI triage, duplicates, & drafts
│   │   │   ├── analytics.py       # Institutional charts & SLA metrics
│   │   │   ├── auth.py            # User registration, login, JWT
│   │   │   ├── evidence.py        # File upload & download handlers
│   │   │   ├── grievances.py      # Grievance CRUD & lifecycle
│   │   │   └── notifications.py   # In-app notification queue
│   │   ├── core/                  # Core App Config & Database Setup
│   │   │   ├── config.py          # Pydantic Settings from .env
│   │   │   ├── database.py        # SQLAlchemy engine & session factory
│   │   │   └── security.py        # Password hashing & JWT tokens
│   │   ├── models.py              # 23 SQLAlchemy Relational Entities
│   │   ├── rules/                 # Deterministic Business Logic
│   │   │   ├── escalation.py      # Automated SLA breach escalation
│   │   │   ├── priority_engine.py # Safety keyword & impact scoring
│   │   │   ├── routing_engine.py  # Department auto-assignment
│   │   │   └── sla_calculator.py  # Mathematical SLA deadline rules
│   │   ├── schemas/               # Pydantic Request/Response Models
│   │   ├── services/              # Background AI workers & helpers
│   │   └── main.py                # FastAPI Application Entrypoint
│   ├── migrations/                # Alembic Migration Versions
│   ├── tests/                     # Pytest Automated Test Suite
│   ├── Dockerfile                 # Backend Container Definition
│   ├── requirements.txt           # Python Dependencies
│   └── seed.py                    # Database Seeder
│
├── frontend/                      # React 19 Single Page Application
│   ├── src/
│   │   ├── components/            # Reusable UI Components & Modals
│   │   ├── context/               # Auth & Global State Context
│   │   ├── pages/                 # 30 Application Pages & Views
│   │   │   ├── admin/             # Admin Control Center Views
│   │   │   ├── authority/         # Authority Triage & Workspace Views
│   │   │   └── student/           # Student Portal & Grievance Views
│   │   ├── services/              # Axios API Client & Endpoints
│   │   ├── types/                 # TypeScript Interface Definitions
│   │   ├── App.tsx                # Main Router & Layout Scaffolding
│   │   └── main.tsx               # Application Bootstrap
│   ├── Dockerfile                 # Frontend Multi-stage Nginx Container
│   ├── package.json               # Node.js Dependencies
│   ├── tailwind.config.js         # Tailwind Design Tokens
│   └── vite.config.ts             # Vite Build Configuration
│
├── docs/                          # Architecture & API References
│   ├── API_REFERENCE.md           # Exhaustive API Endpoints Specification
│   ├── ARCHITECTURE.md            # Topological Architecture Guide
│   └── DEPLOYMENT_GUIDE.md        # Cloud Deployment Instructions
│
├── docker-compose.yml             # Local Multi-Container Compose Config
├── docker-compose.prod.yml        # Production Compose Deployment
├── DEPLOYMENT.md                  # Vercel, Render & Supabase Runbook
└── README.md                      # Primary Documentation
```

---

## 🔧 Environment Configuration (.env)

### Backend (`backend/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PROJECT_NAME` | `GrievAI` | Application display title |
| `ENVIRONMENT` | `development` | `development` or `production` |
| `PORT` | `8000` | Backend listening port |
| `SECRET_KEY` | *(Random hex key)* | Cryptographic key for signing JWT tokens |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | JWT token lifespan (24 hours) |
| `DATABASE_URL` | `postgresql+psycopg://...` | Connection URI (PostgreSQL or SQLite) |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Endpoint for Ollama local AI server |
| `OLLAMA_LLM_MODEL` | `llama3` | Ollama model used for NLU & text drafting |
| `OLLAMA_EMBED_MODEL` | `bge-m3` | Ollama embedding model for vector search |
| `CORS_ORIGINS` | `http://localhost:3000,...` | Whitelisted frontend origins |
| `EVIDENCE_STORAGE_DIR` | `storage/evidence` | Local directory for uploaded files |

### Frontend (`frontend/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:8000/api/v1` | URL pointing to the FastAPI backend API |

---

## 🧪 Running Tests

### Backend Automated Test Suite
The backend includes a test suite verifying authentication, RBAC, state machines, SLA rules, and AI resilience.

Run all tests from the `backend/` directory:
```bash
# Make sure your virtual environment is active
cd backend
pytest -v
```

### Frontend Code Quality & Linting
Run the fast Oxlint linter and TypeScript type checker:
```bash
cd frontend
npm run lint
```

---

## ❓ Troubleshooting & FAQs

### 1. PowerShell Script Execution Error on Windows
- **Symptom**: `File ...\Activate.ps1 cannot be loaded because running scripts is disabled on this system.`
- **Fix**: Open PowerShell and run:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
  Then reactivate your virtual environment.

### 2. Ollama is Not Running or Models Are Not Downloaded
- **Symptom**: AI triage returns fallback classifications or warnings in backend logs.
- **Fix**:
  1. Make sure Ollama is running: open a separate terminal and run `ollama serve`.
  2. Verify the models exist: run `ollama list` and ensure `llama3` and `bge-m3` are listed. If not, run `ollama pull llama3` and `ollama pull bge-m3`.
  3. GrievAI will function normally even without Ollama using its built-in deterministic fallback engine.

### 3. Port Already in Use (8000 or 5173)
- **Symptom**: `[Errno 10048] error while attempting to bind on address ('0.0.0.0', 8000)`
- **Fix**: Change the port in your startup command:
  - For Backend: `uvicorn app.main:app --reload --port 8001` (remember to update `VITE_API_URL` in `frontend/.env`).
  - For Frontend: Vite will automatically suggest the next open port (e.g., `5174`).

### 4. Database Connection Errors
- **Symptom**: `psycopg.OperationalError: could not connect to server`
- **Fix**: If you don't have PostgreSQL installed locally, switch to SQLite for quick testing by editing `backend/.env`:
  ```ini
  DATABASE_URL=sqlite:///./grievai_dev.db
  ```
  Then re-run `python seed.py` and restart the backend.

---

## 📜 License & Contributions

- **License**: MIT License. Open source for educational and institutional research purposes.
- **Contributions**: Contributions, issue reports, and pull requests are welcome!
