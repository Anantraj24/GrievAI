from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthCheck(BaseModel):
    status: str
    message: str

@app.get("/health", response_model=HealthCheck, tags=["health"])
@app.get(f"{settings.API_V1_STR}/health", response_model=HealthCheck, tags=["health"])
def health_check():
    return {"status": "ok", "message": "GrievAI backend is running."}

# Mount routers
from app.api import auth, grievances, analytics, evidence, ai
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(grievances.router, prefix=f"{settings.API_V1_STR}/grievances", tags=["grievances"])
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}", tags=["ai"])
app.include_router(evidence.router, prefix=f"{settings.API_V1_STR}", tags=["evidence"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"])
