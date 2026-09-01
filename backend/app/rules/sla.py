from datetime import datetime, timedelta, timezone
from typing import Optional, Dict

DEFAULT_SLA_HOURS: Dict[str, int] = {
    "CRITICAL": 12,
    "HIGH": 24,
    "MEDIUM": 48,
    "LOW": 120
}

def get_sla_hours(priority: str) -> int:
    norm = priority.upper().strip() if priority else "MEDIUM"
    return DEFAULT_SLA_HOURS.get(norm, 48)

def calculate_sla_deadline(
    created_at: Optional[datetime] = None,
    priority: str = "MEDIUM",
    custom_hours: Optional[int] = None
) -> datetime:
    base_time = created_at or datetime.now(timezone.utc)
    if base_time.tzinfo is None:
        base_time = base_time.replace(tzinfo=timezone.utc)
        
    hours = custom_hours if custom_hours is not None else get_sla_hours(priority)
    return base_time + timedelta(hours=hours)

def is_sla_breached(
    deadline: Optional[datetime],
    now: Optional[datetime] = None
) -> bool:
    if not deadline:
        return False
    current_time = now or datetime.now(timezone.utc)
    if deadline.tzinfo is None:
        deadline = deadline.replace(tzinfo=timezone.utc)
    if current_time.tzinfo is None:
        current_time = current_time.replace(tzinfo=timezone.utc)
    return current_time > deadline

def hours_remaining(
    deadline: Optional[datetime],
    now: Optional[datetime] = None
) -> float:
    if not deadline:
        return 0.0
    current_time = now or datetime.now(timezone.utc)
    if deadline.tzinfo is None:
        deadline = deadline.replace(tzinfo=timezone.utc)
    if current_time.tzinfo is None:
        current_time = current_time.replace(tzinfo=timezone.utc)
    delta = deadline - current_time
    return delta.total_seconds() / 3600.0
