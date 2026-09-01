import pytest
from app.rules.state_machine import validate_transition, ALLOWED_TRANSITIONS
from app.schemas.enums import GrievanceStatus, RoleEnum

def test_valid_forward_transitions():
    # Admin / Authority valid transitions
    validate_transition("SUBMITTED", "PENDING_REVIEW", "admin")
    validate_transition("PENDING_REVIEW", "ASSIGNED", "authority")
    validate_transition("ASSIGNED", "IN_PROGRESS", "authority")
    validate_transition("IN_PROGRESS", "RESOLVED", "authority")
    validate_transition("RESOLVED", "CLOSED", "admin")

def test_invalid_state_transitions_raise_error():
    # Direct jump from SUBMITTED to RESOLVED is prohibited
    with pytest.raises(ValueError, match="Invalid status transition"):
        validate_transition("SUBMITTED", "RESOLVED", "admin")

    # Modifying closed case is prohibited
    with pytest.raises(ValueError, match="Invalid status transition"):
        validate_transition("CLOSED", "IN_PROGRESS", "admin")

    # Direct jump from SUBMITTED to IN_PROGRESS is prohibited
    with pytest.raises(ValueError, match="Invalid status transition"):
        validate_transition("SUBMITTED", "IN_PROGRESS", "authority")

def test_student_role_restrictions():
    # Student cannot resolve an in-progress grievance
    with pytest.raises(ValueError, match="Students are not authorized"):
        validate_transition("IN_PROGRESS", "RESOLVED", "student", is_owner=True)

    # Student cannot assign a grievance
    with pytest.raises(ValueError, match="Students are not authorized"):
        validate_transition("PENDING_REVIEW", "ASSIGNED", "student", is_owner=True)

    # Student CAN reopen or close their own resolved grievance
    validate_transition("RESOLVED", "REOPENED", "student", is_owner=True)
    validate_transition("RESOLVED", "CLOSED", "student", is_owner=True)

def test_non_owner_student_rejected():
    with pytest.raises(ValueError, match="modify the status of their own grievances"):
        validate_transition("RESOLVED", "CLOSED", "student", is_owner=False)
