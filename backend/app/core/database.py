from sqlalchemy import create_engine, event, pool
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import Generator

from app.core.config import settings

_is_sqlite = settings.DATABASE_URL.startswith("sqlite")
_is_postgres = not _is_sqlite

if _is_sqlite:
    # SQLite — used only for local dev / CI. Enable WAL and busy timeout
    # to handle concurrent writers without "database is locked" errors.
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        connect_args={"check_same_thread": False, "timeout": 30},
    )

    @event.listens_for(engine, "connect")
    def _set_sqlite_pragmas(dbapi_connection, _connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA busy_timeout=30000")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.close()

else:
    # PostgreSQL — tuned for Render/Supabase free tier (25 connection limit).
    # pool_size + max_overflow must stay ≤ 25 across all workers.
    # With 2 gunicorn workers (render.yaml) we allow up to 10 connections per worker.
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,          # Verify connection is alive before use
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW,
        pool_timeout=settings.DB_POOL_TIMEOUT,
        pool_recycle=settings.DB_POOL_RECYCLE,  # Prevent stale connections
        # Use NullPool if running on serverless (uncomment if needed)
        # poolclass=pool.NullPool,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator:
    """Yield a database session, ensuring it is closed after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
