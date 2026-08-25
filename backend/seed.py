import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import bcrypt

# Setup DB connection
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://grievai_user:grievai_password@localhost:5432/grievai_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed():
    from app.models import Role, User, Department, Base
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 1. Create Roles
    student_role = db.query(Role).filter_by(name="Student").first()
    if not student_role:
        student_role = Role(name="Student")
        db.add(student_role)
        
    authority_role = db.query(Role).filter_by(name="Authority").first()
    if not authority_role:
        authority_role = Role(name="Authority")
        db.add(authority_role)
        
    db.commit()

    # 2. Create Departments
    it_dept = db.query(Department).filter_by(name="IT Services").first()
    if not it_dept:
        it_dept = Department(name="IT Services")
        db.add(it_dept)
        
    facilities_dept = db.query(Department).filter_by(name="Facilities").first()
    if not facilities_dept:
        facilities_dept = Department(name="Facilities")
        db.add(facilities_dept)
        
    db.commit()

    # 3. Create Users
    def get_password_hash(password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    student_user = db.query(User).filter_by(email="student@example.com").first()
    if not student_user:
        student_user = User(
            email="student@example.com",
            full_name="Alice Student",
            hashed_password=get_password_hash("password123"),
            role_id=student_role.id
        )
        db.add(student_user)

    auth_user = db.query(User).filter_by(email="admin@example.com").first()
    if not auth_user:
        auth_user = User(
            email="admin@example.com",
            full_name="Bob Admin",
            hashed_password=get_password_hash("admin123"),
            role_id=authority_role.id,
            department_id=it_dept.id
        )
        db.add(auth_user)

    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
