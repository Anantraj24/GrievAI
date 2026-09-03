#!/bin/sh
set -e

echo "=== Starting GrievAI Production Backend ==="

# Run pending database migrations
echo "Running database schema migrations via Alembic..."
alembic upgrade head || {
    echo "Warning: Alembic migration reported an error or already up to date. Continuing..."
}

# Determine port (default to 8000 if not set by host provider)
PORT="${PORT:-8000}"
WORKERS="${WEB_CONCURRENCY:-2}"

echo "Launching Gunicorn with $WORKERS Uvicorn workers on port $PORT..."
exec gunicorn -w "$WORKERS" -k uvicorn.workers.UvicornWorker app.main:app --bind "0.0.0.0:$PORT" --timeout 120 --access-logfile - --error-logfile -
