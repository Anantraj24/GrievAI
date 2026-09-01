from enum import Enum

class RoleEnum(str, Enum):
    STUDENT = "student"
    AUTHORITY = "authority"
    ADMIN = "admin"

Role = RoleEnum

class GrievanceStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    PENDING_REVIEW = "PENDING_REVIEW"
    NEEDS_INFORMATION = "NEEDS_INFORMATION"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"
    REOPENED = "REOPENED"
    REJECTED = "REJECTED"
    ESCALATED = "ESCALATED"

Status = GrievanceStatus

class PriorityLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

Priority = PriorityLevel

class RelationType(str, Enum):
    DUPLICATE = "DUPLICATE"
    RELATED = "RELATED"
    UNRELATED = "UNRELATED"
