import os
from typing import List, Union, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "GrievAI"
    API_V1_STR: str = "/api/v1"
    
    # Secret Key for JWT
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Environment & Server
    ENVIRONMENT: str = "production"
    PORT: int = 8000

    # Database
    DATABASE_URL: str = "postgresql+psycopg://grievai_user:grievai_password@localhost:5432/grievai_db"

    # AI / Ollama & Groq Cloud
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "openai/gpt-oss-20b"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_LLM_MODEL: str = "llama3"
    OLLAMA_EMBED_MODEL: str = "bge-m3"
    OLLAMA_TIMEOUT_SECONDS: float = 15.0

    # CORS
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:3000", "http://localhost:5173", "http://localhost:80", "http://127.0.0.1:3000", "http://127.0.0.1:5173"]

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
        extra="ignore"
    )

settings = Settings()
