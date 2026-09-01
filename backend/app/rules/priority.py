from typing import Tuple, List, Optional
from app.schemas.enums import PriorityLevel

CRITICAL_KEYWORDS = [
    "ragging", "harass", "harassment", "molest", "assault", "suicide", "threat",
    "violence", "physical abuse", "gas leak", "electric shock", "fire outbreak",
    "short circuit", "dark zone", "stalking", "weapon", "poison"
]

HIGH_KEYWORDS = [
    "exam", "admit card", "timetable clash", "registration deadline", "fee penalty",
    "food poisoning", "contaminated water", "no water", "water outage", "blackout",
    "wifi outage", "lan down", "server down", "erp bug", "scholarship delay",
    "medical emergency", "infestation", "hospital"
]

MEDIUM_KEYWORDS = [
    "air conditioner", "ac not working", "fan broken", "plumbing", "leaking tap",
    "door lock", "window broken", "projector", "chair broken", "room cleaning",
    "garbage", "light bulb", "drainage"
]

def calculate_priority(
    text: str,
    category_name: Optional[str] = None,
    safety_signal: bool = False,
    essential_service_signal: bool = False,
    affected_scope: Optional[str] = "Individual",
    duration_days: int = 1
) -> Tuple[PriorityLevel, List[str]]:
    """
    Pure deterministic priority engine.
    Returns (PriorityLevel, List[reasons])
    """
    text_lower = text.lower()
    reasons: List[str] = []

    # 1. Check Safety Critical Signals
    if safety_signal:
        reasons.append("AI triage identified an active safety/harassment risk flag.")
        return PriorityLevel.CRITICAL, reasons

    for kw in CRITICAL_KEYWORDS:
        if kw in text_lower:
            reasons.append(f"Contains critical safety-related keyword: '{kw}'.")
            return PriorityLevel.CRITICAL, reasons

    # 2. Check High Urgency / Essential Service Signals
    is_high = False
    if essential_service_signal:
        reasons.append("Affects an essential campus lifeline/service (water/electricity/exam).")
        is_high = True

    for kw in HIGH_KEYWORDS:
        if kw in text_lower:
            reasons.append(f"Urgent operational keyword identified: '{kw}'.")
            is_high = True
            break

    if affected_scope and affected_scope.lower() in ["hostel", "floor", "department", "campus"]:
        reasons.append(f"Broad impact scope reported: '{affected_scope}'.")
        is_high = True

    if is_high:
        return PriorityLevel.HIGH, reasons

    # 3. Check Medium Keywords or Duration-based escalation
    for kw in MEDIUM_KEYWORDS:
        if kw in text_lower:
            reasons.append(f"Standard maintenance infrastructure keyword matched: '{kw}'.")
            break

    if duration_days >= 7:
        reasons.append(f"Issue has persisted unresolved for {duration_days} days (escalated to HIGH).")
        return PriorityLevel.HIGH, reasons
    elif duration_days >= 3:
        reasons.append(f"Issue ongoing for {duration_days} days.")
        return PriorityLevel.MEDIUM, reasons

    if category_name and "safety" in category_name.lower():
        reasons.append("Campus safety taxonomy policy defaults to CRITICAL.")
        return PriorityLevel.CRITICAL, reasons
    elif category_name and "academic" in category_name.lower():
        reasons.append("Academic affairs taxonomy policy defaults to HIGH.")
        return PriorityLevel.HIGH, reasons

    if not reasons:
        reasons.append("Standard grievance policy triage.")

    return PriorityLevel.MEDIUM, reasons
