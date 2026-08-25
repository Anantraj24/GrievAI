from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthCheck(BaseModel):
    status: str
    message: str

@app.get(f"{settings.API_V1_STR}/health", response_model=HealthCheck, tags=["health"])
def health_check():
    return {"status": "ok", "message": "GrievAI backend is running."}

# Mount routers
from app.api import auth, grievances, analytics
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(grievances.router, prefix=f"{settings.API_V1_STR}/grievances", tags=["grievances"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"])
# app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
