import os
from typing import List, Union, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "GrievAI"
    API_V1_STR: str = "/api/v1"

    # JWT Secret — MUST be set via environment variable in production.
    # Never use this fallback in production; it's only for local dev without .env.
    SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION_USE_ENV_VAR_32chars_minimum"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Environment & Server
    ENVIRONMENT: str = "development"
    PORT: int = 8000

    # Database — Render provides postgres:// URL; we convert it to SQLAlchemy format
    DATABASE_URL: str = "postgresql+psycopg://grievai_user:grievai_password@localhost:5432/grievai_db"

    # Connection pool — Render free Postgres has a 25-connection limit.
    # Use a conservative pool to avoid "too many connections" errors.
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 5
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 1800  # Recycle connections every 30 min

    # AI / Ollama & Groq Cloud
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "llama3-8b-8192"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_LLM_MODEL: str = "llama3"
    OLLAMA_EMBED_MODEL: str = "bge-m3"
    OLLAMA_TIMEOUT_SECONDS: float = 15.0

    # CORS — comma-separated list of allowed origins in production
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    # Storage
    EVIDENCE_STORAGE_DIR: str = "storage/evidence"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            origins = [i.strip().rstrip("/") for i in v.split(",") if i.strip()]
            return origins if origins else ["*"]
        elif isinstance(v, list):
            return [i.strip().rstrip("/") if isinstance(i, str) else i for i in v]
        return ["*"]

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str | None) -> str:
        if v:
            clean_v = v.strip().strip("'\"")
            # Render and Heroku return postgres:// or postgresql:// — convert both
            if clean_v.startswith("postgres://"):
                return clean_v.replace("postgres://", "postgresql+psycopg://", 1)
            elif clean_v.startswith("postgresql://") and not clean_v.startswith("postgresql+psycopg://"):
                return clean_v.replace("postgresql://", "postgresql+psycopg://", 1)
            return clean_v
        return "postgresql+psycopg://grievai_user:grievai_password@localhost:5432/grievai_db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
