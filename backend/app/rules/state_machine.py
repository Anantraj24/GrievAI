from typing import Dict, List, Optional
from app.schemas.enums import GrievanceStatus, RoleEnum

ALLOWED_TRANSITIONS: Dict[str, List[str]] = {
    GrievanceStatus.SUBMITTED.value: [
        GrievanceStatus.PENDING_REVIEW.value,
        GrievanceStatus.ASSIGNED.value,
        GrievanceStatus.CLOSED.value,
        GrievanceStatus.REJECTED.value,
    ],
    GrievanceStatus.PENDING_REVIEW.value: [
        GrievanceStatus.ASSIGNED.value,
        GrievanceStatus.NEEDS_INFORMATION.value,
        GrievanceStatus.REJECTED.value,
    ],
    GrievanceStatus.NEEDS_INFORMATION.value: [
        GrievanceStatus.PENDING_REVIEW.value,
        GrievanceStatus.ASSIGNED.value,
        GrievanceStatus.REJECTED.value,
    ],
    GrievanceStatus.ASSIGNED.value: [
        GrievanceStatus.IN_PROGRESS.value,
        GrievanceStatus.ESCALATED.value,
        GrievanceStatus.NEEDS_INFORMATION.value,
    ],
    GrievanceStatus.IN_PROGRESS.value: [
        GrievanceStatus.RESOLVED.value,
        GrievanceStatus.ESCALATED.value,
        GrievanceStatus.NEEDS_INFORMATION.value,
    ],
    GrievanceStatus.RESOLVED.value: [
        GrievanceStatus.CLOSED.value,
        GrievanceStatus.REOPENED.value,
    ],
    GrievanceStatus.REOPENED.value: [
        GrievanceStatus.PENDING_REVIEW.value,
        GrievanceStatus.ASSIGNED.value,
        GrievanceStatus.IN_PROGRESS.value,
    ],
    GrievanceStatus.ESCALATED.value: [
        GrievanceStatus.IN_PROGRESS.value,
        GrievanceStatus.RESOLVED.value,
        GrievanceStatus.NEEDS_INFORMATION.value,
    ],
    GrievanceStatus.CLOSED.value: [],
    GrievanceStatus.REJECTED.value: [],
}

def validate_transition(
    old_status: str,
    new_status: str,
    actor_role: str,
    is_owner: bool = False
) -> None:
    """
    Validates whether the requested state transition is valid under the state machine
    and authorized for the given user role.
    Raises ValueError with a descriptive message if invalid.
    """
    old_norm = old_status.upper().strip()
    new_norm = new_status.upper().strip()
    role_norm = actor_role.lower().strip()

    if old_norm == new_norm:
        return

    allowed = ALLOWED_TRANSITIONS.get(old_norm, [])
    if new_norm not in allowed:
        raise ValueError(
            f"Invalid status transition from '{old_norm}' to '{new_norm}'. "
            f"Allowed next states: {allowed if allowed else 'None (Terminal state)'}."
        )

    # Role-based transition permission rules
    if role_norm == RoleEnum.STUDENT.value:
        if not is_owner:
            raise ValueError("Students can only modify the status of their own grievances.")
        # Students can only close or reopen a resolved case
        student_allowed = [
            (GrievanceStatus.RESOLVED.value, GrievanceStatus.CLOSED.value),
            (GrievanceStatus.RESOLVED.value, GrievanceStatus.REOPENED.value),
            (GrievanceStatus.SUBMITTED.value, GrievanceStatus.CLOSED.value)
        ]
        if (old_norm, new_norm) not in student_allowed:
            raise ValueError(f"Students are not authorized to transition status from {old_norm} to {new_norm}.")

    elif role_norm == RoleEnum.AUTHORITY.value:
        # Authorities cannot arbitrarily reopen a closed case
        if old_norm == GrievanceStatus.CLOSED.value:
            raise ValueError("Authorities cannot alter closed grievances.")

    elif role_norm == RoleEnum.ADMIN.value:
        # Admins can perform any valid state machine transition
        pass
    else:
        raise ValueError(f"Unrecognized role '{actor_role}'.")
