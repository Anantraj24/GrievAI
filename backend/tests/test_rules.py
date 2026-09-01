import pytest
from datetime import datetime, timezone, timedelta
from app.rules.priority import calculate_priority
from app.rules.sla import calculate_sla_deadline, is_sla_breached, get_sla_hours, hours_remaining
from app.schemas.enums import PriorityLevel

def test_priority_critical_safety_keywords():
    priority, reasons = calculate_priority("Someone is ragging students near hostel gate")
    assert priority == PriorityLevel.CRITICAL
    assert any("ragging" in r.lower() for r in reasons)

def test_priority_critical_safety_flag():
    priority, reasons = calculate_priority("Dark pathway issue", safety_signal=True)
    assert priority == PriorityLevel.CRITICAL
    assert any("safety" in r.lower() for r in reasons)

def test_priority_high_urgent_keywords():
    priority, reasons = calculate_priority("Water outage in hostel block B for past 2 days")
    assert priority == PriorityLevel.HIGH
    assert any("water" in r.lower() for r in reasons)

def test_priority_medium_standard_maintenance():
    priority, reasons = calculate_priority("The ceiling fan in room 204 is making squeaking noise")
    assert priority == PriorityLevel.MEDIUM

def test_priority_duration_escalation():
    priority, reasons = calculate_priority(
        "Ceiling fan broken",
        duration_days=8
    )
    assert priority == PriorityLevel.HIGH
    assert any("persisted" in r.lower() for r in reasons)

def test_sla_hours_and_deadlines():
    assert get_sla_hours("CRITICAL") == 12
    assert get_sla_hours("HIGH") == 24
    assert get_sla_hours("MEDIUM") == 48
    assert get_sla_hours("LOW") == 120

    now = datetime(2026, 9, 1, 12, 0, 0, tzinfo=timezone.utc)
    deadline = calculate_sla_deadline(created_at=now, priority="CRITICAL")
    assert deadline == now + timedelta(hours=12)

def test_sla_breach_detection():
    now = datetime.now(timezone.utc)
    past_deadline = now - timedelta(hours=2)
    future_deadline = now + timedelta(hours=5)

    assert is_sla_breached(past_deadline, now=now) is True
    assert is_sla_breached(future_deadline, now=now) is False
    assert hours_remaining(future_deadline, now=now) > 4.5
