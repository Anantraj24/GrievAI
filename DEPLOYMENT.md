# 🚀 GrievAI: Complete Production Deployment Guide

This guide covers deploying the GrievAI full-stack application (FastAPI backend + Vite React frontend + Supabase pgvector database + AI resilience layer).

---

## 🏗️ Architecture Overview

```
                          ┌───────────────────────────┐
                          │   Frontend (Vercel / CDN) │
                          │   React + Vite + Tailwind │
                          └─────────────┬─────────────┘
                                        │ HTTPS / WSS
                                        ▼
                          ┌───────────────────────────┐
                          │ Backend (Render/CloudRun) │
                          │ FastAPI + Gunicorn (ASGI) │
                          └───────┬───────────┬───────┘
                                  │           │
                 SQL / pgvector   │           │ HTTP (Async / Fallback)
                                  ▼           ▼
  ┌───────────────────────────────────┐   ┌───────────────────────────┐
  │ Supabase Cloud PostgreSQL 15/16   │   │ Ollama / Local AI Engine  │
  │  - pgvector semantic search       │   │  - Llama 3 / BGE-M3       │
  │  - 24 normalized schema tables    │   │  - Deterministic fallback │
  └───────────────────────────────────┘   └───────────────────────────┘
```

---

## Option 1: Managed Cloud Deployment (Recommended)

### 1. Database (Supabase)
Your Supabase PostgreSQL instance is already configured with `pgvector` enabled and all 24 database tables migrated.

- **Connection Pooler URL**: 
  `postgresql+psycopg://postgres.pwaczzkywwwfrohzzkjl:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require`

---

### 2. Backend Deployment (Render / Railway / Google Cloud Run)

#### Deploy to Render:
1. Connect your GitHub repository `Anantraj24/GrievAI` to [Render](https://render.com).
2. Render will automatically detect `render.yaml` and configure the web service.
3. Or manually create a **Web Service**:
   - **Runtime**: Python 3
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `alembic upgrade head && gunicorn -w 2 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:$PORT`
4. Set Environment Variables in Render:
   | Variable | Value / Description |
   | :--- | :--- |
   | `DATABASE_URL` | `postgresql+psycopg://...supabase.com:5432/postgres?sslmode=require` |
   | `SECRET_KEY` | *(Generate 32-byte hex secret with `openssl rand -hex 32`)* |
   | `ENVIRONMENT` | `production` |
   | `CORS_ORIGINS` | `https://your-frontend.vercel.app,http://localhost:5173` |
   | `OLLAMA_BASE_URL` | `http://localhost:11434` *(or remote Ollama endpoint)* |

#### Healthcheck Verification:
After deployment, verify: `https://your-backend-url.onrender.com/health`
```json
{
  "status": "ok",
  "message": "GrievAI production backend is operational.",
  "database": "connected",
  "environment": "production"
}
```

---

### 3. Frontend Deployment (Vercel)

1. Import your GitHub repository on [Vercel](https://vercel.com).
2. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api/v1`
4. Deploy! `vercel.json` will automatically handle SPA client-side routing, security headers, and asset caching.

---

## Option 2: Self-Hosted Docker Deployment

### 1. Clone & Configure Environment
```bash
git clone https://github.com/Anantraj24/GrievAI.git
cd GrievAI

# Set production variables in .env
cat << 'EOF' > .env
DATABASE_URL=postgresql+psycopg://grievai_user:grievai_password@db:5432/grievai_db
SECRET_KEY=production_random_secret_key_32_bytes_long_1234
ENVIRONMENT=production
CORS_ORIGINS=http://localhost,http://localhost:3000
VITE_API_URL=http://localhost:8000/api/v1
EOF
```

### 2. Start Full-Stack Multi-Container Pod
```bash
# Build and run containers
docker-compose up -d --build

# Inspect running services
docker-compose ps
```

Services will be available at:
- **Frontend SPA**: `http://localhost:3000`
- **FastAPI Backend API**: `http://localhost:8000`
- **Backend Health Check**: `http://localhost:8000/health`
- **PostgreSQL + pgvector**: `localhost:5432`

---

## 🛡️ Production Security Checklist

- [x] **CORS Origin Whitelisting**: Strict origin checking via `CORS_ORIGINS`.
- [x] **Security Headers**: HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`.
- [x] **Adversarial Prompt Injection Defense**: Pre-flight regex filtering on LLM inputs.
- [x] **Deterministic Safety Fallback**: Safety/harassment alerts auto-escalate to `CRITICAL` (4h SLA) even if AI is offline.
- [x] **Database SSL**: All Supabase connections enforced with `sslmode=require`.
- [x] **Rate Limiting**: Configured on `/api/v1/auth/login` to thwart brute-force attacks.
- [x] **Health Check Telemetry**: Live database ping on `/health`.
