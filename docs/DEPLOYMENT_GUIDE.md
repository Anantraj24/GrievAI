# GrievAI Deployment & Operations Manual

## 1. Prerequisites
- **Python**: 3.11+
- **Node.js**: 18+ (with `npm`)
- **PostgreSQL**: 15+ with `pgvector` extension enabled (or hosted Supabase)
- **Ollama**: (Optional for local inference) `ollama run llama3` & `ollama run bge-m3`

---

## 2. Environment Configuration

### Backend (`backend/.env`)
```ini
PROJECT_NAME="GrievAI"
API_V1_STR="/api/v1"
SECRET_KEY="your-super-secret-key-change-in-production"
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Supabase PostgreSQL Database with pgvector (URL-encoded password for special chars)
DATABASE_URL="postgresql+psycopg://postgres.pwaczzkywwwfrohzzkjl:h%40j4qA2GP24.HRc@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# Ollama AI endpoints
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_LLM_MODEL="llama3"
OLLAMA_EMBED_MODEL="bge-m3"

# Storage
EVIDENCE_STORAGE_DIR="./storage/evidence"
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

### Frontend (`frontend/.env`)
```ini
VITE_API_URL="http://localhost:8000/api/v1"
```

---

## 3. Local Development Startup

### A. Database Initialization
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python seed.py
```

### B. Run Backend Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### C. Run Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
```

---

## 4. Multi-Container Docker Deployment

Build and run both services simultaneously using Docker Compose:

```bash
docker compose up --build -d
```

- **Frontend Application**: `http://localhost:3000`
- **FastAPI API & OpenAPI Docs**: `http://localhost:8000/docs`
