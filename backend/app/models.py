import uuid
from sqlalchemy import (
    Column,
    String,
    Boolean,
    ForeignKey,
    Integer,
    SmallInteger,
    BigInteger,
    Numeric,
    DateTime,
    Text,
    JSON,
    Uuid,
    text,
    CheckConstraint,
    UniqueConstraint,
    Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from pgvector.sqlalchemy import Vector
from datetime import datetime

from app.core.database import Base

# Universal cross-dialect type aliases
UUID_TYPE = Uuid().with_variant(PG_UUID(as_uuid=True), 'postgresql')
JSON_TYPE = JSON().with_variant(JSONB, 'postgresql')
VECTOR_TYPE = JSON().with_variant(Vector(1024), 'postgresql')

# ----------------------------------------------------------------------
# 1. Core Identity & Access
# ----------------------------------------------------------------------

class Role(Base):
    __tablename__ = 'roles'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    name = Column(Text, unique=True, nullable=False, index=True)
    permissions = Column(JSON_TYPE, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    users = relationship('User', back_populates='role')


class Department(Base):
    __tablename__ = 'departments'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    name = Column(Text, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    users = relationship('User', back_populates='department')
    grievances = relationship('Grievance', back_populates='assigned_department')
    routing_rules = relationship('RoutingRule', back_populates='department')


class User(Base):
    __tablename__ = 'users'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    email = Column(Text, unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=False)
    full_name = Column(Text, nullable=False)
    role_id = Column(UUID_TYPE, ForeignKey('roles.id', ondelete='RESTRICT'), nullable=False, index=True)
    department_id = Column(UUID_TYPE, ForeignKey('departments.id', ondelete='RESTRICT'), nullable=True, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    avatar_url = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    role = relationship('Role', back_populates='users')
    department = relationship('Department', back_populates='users')
    filed_grievances = relationship('Grievance', foreign_keys='Grievance.student_id', back_populates='student')
    assigned_grievances = relationship('Grievance', foreign_keys='Grievance.assigned_authority_id', back_populates='assigned_authority')
    comments = relationship('Comment', back_populates='author')
    notifications = relationship('Notification', back_populates='user')
    feedback_submissions = relationship('Feedback', back_populates='student')


# ----------------------------------------------------------------------
# 2. Configuration & Taxonomies
# ----------------------------------------------------------------------

class Category(Base):
    __tablename__ = 'categories'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    name = Column(Text, unique=True, nullable=False, index=True)
    default_priority_policy = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    subcategories = relationship('Subcategory', back_populates='category', cascade="all, delete-orphan")
    grievances = relationship('Grievance', back_populates='category')
    routing_rules = relationship('RoutingRule', back_populates='category')
    institutional_issues = relationship('InstitutionalIssue', back_populates='category')


class Subcategory(Base):
    __tablename__ = 'subcategories'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    category_id = Column(UUID_TYPE, ForeignKey('categories.id', ondelete='CASCADE'), nullable=False, index=True)
    name = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint('category_id', 'name', name='uq_subcategory_category_name'),
    )

    category = relationship('Category', back_populates='subcategories')
    grievances = relationship('Grievance', back_populates='subcategory')
    routing_rules = relationship('RoutingRule', back_populates='subcategory')


# ----------------------------------------------------------------------
# 3. Grievance Core
# ----------------------------------------------------------------------

class Grievance(Base):
    __tablename__ = 'grievances'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    grievance_code = Column(Text, unique=True, nullable=False, index=True)
    student_id = Column(UUID_TYPE, ForeignKey('users.id', ondelete='RESTRICT'), nullable=False, index=True)
    title = Column(Text, nullable=True)
    description = Column(Text, nullable=False)
    language_detected = Column(Text, nullable=True)
    category_id = Column(UUID_TYPE, ForeignKey('categories.id', ondelete='RESTRICT'), nullable=True, index=True)
    subcategory_id = Column(UUID_TYPE, ForeignKey('subcategories.id', ondelete='RESTRICT'), nullable=True, index=True)
    location = Column(Text, nullable=True)
    incident_date = Column(DateTime, nullable=True)
    status = Column(Text, nullable=False, default='SUBMITTED', index=True)
    priority = Column(Text, nullable=True, index=True)
    priority_reasons = Column(JSON_TYPE, nullable=True)
    assigned_department_id = Column(UUID_TYPE, ForeignKey('departments.id', ondelete='RESTRICT'), nullable=True, index=True)
    assigned_authority_id = Column(UUID_TYPE, ForeignKey('users.id', ondelete='RESTRICT'), nullable=True, index=True)
    sla_deadline = Column(DateTime(timezone=True), nullable=True, index=True)
    is_anonymous = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    student = relationship('User', foreign_keys=[student_id], back_populates='filed_grievances')
    assigned_authority = relationship('User', foreign_keys=[assigned_authority_id], back_populates='assigned_grievances')
    assigned_department = relationship('Department', back_populates='grievances')
    category = relationship('Category', back_populates='grievances')
    subcategory = relationship('Subcategory', back_populates='grievances')

    assignments = relationship('GrievanceAssignment', back_populates='grievance', cascade="all, delete-orphan")
    status_history = relationship('StatusHistory', back_populates='grievance', cascade="all, delete-orphan", order_by="StatusHistory.created_at.asc()")
    comments = relationship('Comment', back_populates='grievance', cascade="all, delete-orphan", order_by="Comment.created_at.asc()")
    evidence = relationship('Evidence', back_populates='grievance', cascade="all, delete-orphan")
    ai_analyses = relationship('AIAnalysis', back_populates='grievance', cascade="all, delete-orphan")
    embedding = relationship('GrievanceEmbedding', back_populates='grievance', uselist=False, cascade="all, delete-orphan")
    feedback = relationship('Feedback', back_populates='grievance', uselist=False, cascade="all, delete-orphan")
    escalations = relationship('Escalation', back_populates='grievance', cascade="all, delete-orphan")
    notifications = relationship('Notification', back_populates='grievance', cascade="all, delete-orphan")


class GrievanceAssignment(Base):
    __tablename__ = 'grievance_assignments'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    grievance_id = Column(UUID_TYPE, ForeignKey('grievances.id', ondelete='CASCADE'), nullable=False, index=True)
    assigned_to = Column(UUID_TYPE, ForeignKey('users.id', ondelete='RESTRICT'), nullable=False, index=True)
    assigned_by = Column(UUID_TYPE, ForeignKey('users.id', ondelete='RESTRICT'), nullable=False)
    assigned_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    unassigned_at = Column(DateTime(timezone=True), nullable=True)
    reason = Column(Text, nullable=True)

    grievance = relationship('Grievance', back_populates='assignments')
    assignee = relationship('User', foreign_keys=[assigned_to])
    assigner = relationship('User', foreign_keys=[assigned_by])


class StatusHistory(Base):
    __tablename__ = 'status_history'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    grievance_id = Column(UUID_TYPE, ForeignKey('grievances.id', ondelete='CASCADE'), nullable=False, index=True)
    actor_id = Column(UUID_TYPE, ForeignKey('users.id', ondelete='RESTRICT'), nullable=False)
    previous_status = Column(Text, nullable=True)
    new_status = Column(Text, nullable=False)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index('idx_status_history_grievance_created', 'grievance_id', 'created_at'),
    )

    grievance = relationship('Grievance', back_populates='status_history')
    actor = relationship('User')


class Comment(Base):
    __tablename__ = 'comments'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    grievance_id = Column(UUID_TYPE, ForeignKey('grievances.id', ondelete='CASCADE'), nullable=False, index=True)
    author_id = Column(UUID_TYPE, ForeignKey('users.id', ondelete='RESTRICT'), nullable=False)
    body = Column(Text, nullable=False)
    is_internal = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index('idx_comments_grievance_created', 'grievance_id', 'created_at'),
    )

    grievance = relationship('Grievance', back_populates='comments')
    author = relationship('User', back_populates='comments')


class Evidence(Base):
    __tablename__ = 'evidence'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    grievance_id = Column(UUID_TYPE, ForeignKey('grievances.id', ondelete='CASCADE'), nullable=False, index=True)
    uploader_id = Column(UUID_TYPE, ForeignKey('users.id', ondelete='RESTRICT'), nullable=False)
    original_filename = Column(Text, nullable=False)
    mime_type = Column(Text, nullable=False)
    file_size_bytes = Column(BigInteger, nullable=False)
    storage_key = Column(Text, unique=True, nullable=False)
    checksum_sha256 = Column(Text, nullable=False)
    is_resolution_evidence = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    grievance = relationship('Grievance', back_populates='evidence')
    uploader = relationship('User')


# ----------------------------------------------------------------------
# 4. AI & Semantic Layer
# ----------------------------------------------------------------------

class AIAnalysis(Base):
    __tablename__ = 'ai_analyses'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    grievance_id = Column(UUID_TYPE, ForeignKey('grievances.id', ondelete='CASCADE'), nullable=False, index=True)
    model_name = Column(Text, nullable=False)
    model_version = Column(Text, nullable=True)
    extracted_json = Column(JSON_TYPE, nullable=False)
    predicted_category_id = Column(UUID_TYPE, ForeignKey('categories.id', ondelete='RESTRICT'), nullable=True)
    predicted_subcategory_id = Column(UUID_TYPE, ForeignKey('subcategories.id', ondelete='RESTRICT'), nullable=True)
    classification_confidence = Column(Numeric(4, 3), nullable=True)
    priority_signals = Column(JSON_TYPE, nullable=True)
    recommended_department_id = Column(UUID_TYPE, ForeignKey('departments.id', ondelete='RESTRICT'), nullable=True)
    status = Column(Text, nullable=False, default='PENDING')
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index('idx_ai_analyses_grievance_created', 'grievance_id', 'created_at'),
    )

    grievance = relationship('Grievance', back_populates='ai_analyses')
    predicted_category = relationship('Category')
    predicted_subcategory = relationship('Subcategory')
    recommended_department = relationship('Department')


class GrievanceEmbedding(Base):
    __tablename__ = 'grievance_embeddings'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    grievance_id = Column(UUID_TYPE, ForeignKey('grievances.id', ondelete='CASCADE'), unique=True, nullable=False)
    embedding = Column(VECTOR_TYPE, nullable=False)
    embedding_model = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    grievance = relationship('Grievance', back_populates='embedding')


class GrievanceRelation(Base):
    __tablename__ = 'grievance_relations'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    grievance_id_a = Column(UUID_TYPE, ForeignKey('grievances.id', ondelete='CASCADE'), nullable=False, index=True)
    grievance_id_b = Column(UUID_TYPE, ForeignKey('grievances.id', ondelete='CASCADE'), nullable=False, index=True)
    similarity_score = Column(Numeric(4, 3), nullable=False)
    relation_type = Column(Text, nullable=False) # DUPLICATE / RELATED / UNRELATED
    confirmed_by = Column(UUID_TYPE, ForeignKey('users.id', ondelete='RESTRICT'), nullable=True)
    confirmed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    __table_args__ = (
        CheckConstraint('grievance_id_a <> grievance_id_b', name='chk_grievance_relation_different_ids'),
        UniqueConstraint('grievance_id_a', 'grievance_id_b', name='uq_grievance_relation_pair'),
    )

    grievance_a = relationship('Grievance', foreign_keys=[grievance_id_a])
    grievance_b = relationship('Grievance', foreign_keys=[grievance_id_b])
    reviewer = relationship('User', foreign_keys=[confirmed_by])


class InstitutionalIssue(Base):
    __tablename__ = 'institutional_issues'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    title = Column(Text, nullable=False)
    category_id = Column(UUID_TYPE, ForeignKey('categories.id', ondelete='RESTRICT'), nullable=True, index=True)
    status = Column(Text, nullable=False, default='UNDER_INVESTIGATION')
    first_reported_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    last_reported_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    affected_locations = Column(JSON_TYPE, nullable=True)
    related_grievance_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    category = relationship('Category', back_populates='institutional_issues')
    members = relationship('InstitutionalIssueMember', back_populates='issue', cascade="all, delete-orphan")


class InstitutionalIssueMember(Base):
    __tablename__ = 'institutional_issue_members'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    issue_id = Column(UUID_TYPE, ForeignKey('institutional_issues.id', ondelete='CASCADE'), nullable=False, index=True)
    grievance_id = Column(UUID_TYPE, ForeignKey('grievances.id', ondelete='CASCADE'), nullable=False, index=True)
    added_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint('issue_id', 'grievance_id', name='uq_issue_member_issue_grievance'),
    )

    issue = relationship('InstitutionalIssue', back_populates='members')
    grievance = relationship('Grievance')


# ----------------------------------------------------------------------
# 5. Notifications, Escalations, Feedback, Audit
# ----------------------------------------------------------------------

class Notification(Base):
    __tablename__ = 'notifications'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID_TYPE, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    grievance_id = Column(UUID_TYPE, ForeignKey('grievances.id', ondelete='CASCADE'), nullable=True, index=True)
    event_type = Column(Text, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index('idx_notifications_user_unread', 'user_id', 'is_read'),
    )

    user = relationship('User', back_populates='notifications')
    grievance = relationship('Grievance', back_populates='notifications')


class Escalation(Base):
    __tablename__ = 'escalations'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    grievance_id = Column(UUID_TYPE, ForeignKey('grievances.id', ondelete='CASCADE'), nullable=False, index=True)
    escalated_from = Column(UUID_TYPE, ForeignKey('users.id', ondelete='RESTRICT'), nullable=True)
    escalated_to = Column(UUID_TYPE, ForeignKey('users.id', ondelete='RESTRICT'), nullable=True)
    trigger_reason = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    grievance = relationship('Grievance', back_populates='escalations')
    from_user = relationship('User', foreign_keys=[escalated_from])
    to_user = relationship('User', foreign_keys=[escalated_to])


class Feedback(Base):
    __tablename__ = 'feedback'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    grievance_id = Column(UUID_TYPE, ForeignKey('grievances.id', ondelete='CASCADE'), unique=True, nullable=False)
    student_id = Column(UUID_TYPE, ForeignKey('users.id', ondelete='RESTRICT'), nullable=False)
    satisfaction_rating = Column(SmallInteger, CheckConstraint('satisfaction_rating >= 1 AND satisfaction_rating <= 5'), nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    grievance = relationship('Grievance', back_populates='feedback')
    student = relationship('User', back_populates='feedback_submissions')


class AuditLog(Base):
    __tablename__ = 'audit_logs'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    actor_id = Column(UUID_TYPE, ForeignKey('users.id', ondelete='RESTRICT'), nullable=True, index=True)
    action = Column(Text, nullable=False)
    entity_type = Column(Text, nullable=False)
    entity_id = Column(UUID_TYPE, nullable=False)
    metadata_json = Column(JSON_TYPE, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index('idx_audit_entity', 'entity_type', 'entity_id'),
        Index('idx_audit_actor_created', 'actor_id', 'created_at'),
    )

    actor = relationship('User')


# ----------------------------------------------------------------------
# 6. Policy & Automation Configuration
# ----------------------------------------------------------------------

class RoutingRule(Base):
    __tablename__ = 'routing_rules'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    category_id = Column(UUID_TYPE, ForeignKey('categories.id', ondelete='RESTRICT'), nullable=False, index=True)
    subcategory_id = Column(UUID_TYPE, ForeignKey('subcategories.id', ondelete='RESTRICT'), nullable=True, index=True)
    department_id = Column(UUID_TYPE, ForeignKey('departments.id', ondelete='RESTRICT'), nullable=False, index=True)
    priority = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    category = relationship('Category', back_populates='routing_rules')
    subcategory = relationship('Subcategory', back_populates='routing_rules')
    department = relationship('Department', back_populates='routing_rules')


class SLARule(Base):
    __tablename__ = 'sla_rules'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    priority = Column(Text, unique=True, nullable=False, index=True) # LOW/MEDIUM/HIGH/CRITICAL
    hours = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)


class EscalationRule(Base):
    __tablename__ = 'escalation_rules'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    trigger_reason = Column(Text, nullable=False)
    escalate_to_role_id = Column(UUID_TYPE, ForeignKey('roles.id', ondelete='RESTRICT'), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    escalate_to_role = relationship('Role')


class InstitutionSetting(Base):
    __tablename__ = 'institution_settings'
    
    id = Column(UUID_TYPE, primary_key=True, default=uuid.uuid4)
    key = Column(Text, unique=True, nullable=False, index=True)
    value = Column(JSON_TYPE, nullable=False)
    description = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
