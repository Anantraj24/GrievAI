from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, BigInteger, Numeric, JSON, DateTime, Text, text, CheckConstraint
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from pgvector.sqlalchemy import Vector
from datetime import datetime

Base = declarative_base()

class Role(Base):
    __tablename__ = 'roles'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(Text, unique=True, nullable=False)
    permissions = Column(JSONB)

class Department(Base):
    __tablename__ = 'departments'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(Text, unique=True, nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)

class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    email = Column(Text, unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    full_name = Column(Text, nullable=False)
    role_id = Column(UUID(as_uuid=True), ForeignKey('roles.id', ondelete='RESTRICT'))
    department_id = Column(UUID(as_uuid=True), ForeignKey('departments.id', ondelete='RESTRICT'), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=text('now()'))
    updated_at = Column(DateTime(timezone=True), server_default=text('now()'), onupdate=text('now()'))

class Category(Base):
    __tablename__ = 'categories'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(Text, unique=True, nullable=False)
    default_priority_policy = Column(Text)
    is_active = Column(Boolean, default=True)

class Subcategory(Base):
    __tablename__ = 'subcategories'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    category_id = Column(UUID(as_uuid=True), ForeignKey('categories.id', ondelete='CASCADE'))
    name = Column(Text, nullable=False)

class Grievance(Base):
    __tablename__ = 'grievances'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    grievance_code = Column(Text, unique=True, nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='RESTRICT'))
    title = Column(Text)
    description = Column(Text, nullable=False)
    language_detected = Column(Text)
    category_id = Column(UUID(as_uuid=True), ForeignKey('categories.id', ondelete='RESTRICT'), nullable=True)
    subcategory_id = Column(UUID(as_uuid=True), ForeignKey('subcategories.id', ondelete='RESTRICT'), nullable=True)
    location = Column(Text)
    incident_date = Column(DateTime)
    status = Column(Text, nullable=False, default='SUBMITTED')
    priority = Column(Text)
    priority_reasons = Column(JSONB)
    assigned_department_id = Column(UUID(as_uuid=True), ForeignKey('departments.id', ondelete='RESTRICT'), nullable=True)
    assigned_authority_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='RESTRICT'), nullable=True)
    sla_deadline = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=text('now()'))
    updated_at = Column(DateTime(timezone=True), server_default=text('now()'), onupdate=text('now()'))

class GrievanceEmbedding(Base):
    __tablename__ = 'grievance_embeddings'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    grievance_id = Column(UUID(as_uuid=True), ForeignKey('grievances.id', ondelete='CASCADE'), unique=True)
    embedding = Column(Vector(1024), nullable=False) # Assuming BGE-M3 1024
    embedding_model = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=text('now()'))

class AIAnalysis(Base):
    __tablename__ = 'ai_analyses'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    grievance_id = Column(UUID(as_uuid=True), ForeignKey('grievances.id', ondelete='CASCADE'))
    model_name = Column(Text, nullable=False)
    model_version = Column(Text)
    extracted_json = Column(JSONB, nullable=False)
    predicted_category_id = Column(UUID(as_uuid=True), ForeignKey('categories.id', ondelete='RESTRICT'), nullable=True)
    predicted_subcategory_id = Column(UUID(as_uuid=True), ForeignKey('subcategories.id', ondelete='RESTRICT'), nullable=True)
    classification_confidence = Column(Numeric(4, 3))
    priority_signals = Column(JSONB)
    recommended_department_id = Column(UUID(as_uuid=True), ForeignKey('departments.id', ondelete='RESTRICT'), nullable=True)
    status = Column(Text, nullable=False, default='PENDING')
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=text('now()'))

class Feedback(Base):
    __tablename__ = 'feedback'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    grievance_id = Column(UUID(as_uuid=True), ForeignKey('grievances.id', ondelete='CASCADE'), unique=True)
    rating = Column(Integer, CheckConstraint('rating >= 1 AND rating <= 5'), nullable=False)
    comments = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=text('now()'))

class InstitutionalIssue(Base):
    __tablename__ = 'institutional_issues'
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    title = Column(Text, nullable=False)
    description = Column(Text)
    status = Column(Text, default='OPEN')
    department_id = Column(UUID(as_uuid=True), ForeignKey('departments.id', ondelete='RESTRICT'), nullable=True)
    related_grievance_ids = Column(JSONB) # List of UUIDs
    created_at = Column(DateTime(timezone=True), server_default=text('now()'))
    updated_at = Column(DateTime(timezone=True), server_default=text('now()'), onupdate=text('now()'))
