import os
import sys
from sqlalchemy.orm import Session

from app.core.database import engine, SessionLocal, Base
from app.core.security import get_password_hash
from app.models import (
    Role,
    Department,
    User,
    Category,
    Subcategory,
    SLARule,
    RoutingRule,
    InstitutionSetting
)


def seed():
    print("Starting database seed...")
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # -------------------------------------------------------------
        # 1. Roles
        # -------------------------------------------------------------
        roles_data = [
            {"name": "student", "permissions": {"can_submit": True, "can_view_own": True}},
            {"name": "authority", "permissions": {"can_view_assigned": True, "can_resolve": True, "can_escalate": True}},
            {"name": "admin", "permissions": {"is_superadmin": True, "can_manage_all": True}},
        ]
        
        role_map = {}
        for r_item in roles_data:
            role = db.query(Role).filter(Role.name == r_item["name"]).first()
            if not role:
                role = Role(name=r_item["name"], permissions=r_item["permissions"])
                db.add(role)
                db.flush()
            role_map[r_item["name"]] = role
        db.commit()
        print(f"[OK] Seeded {len(role_map)} Roles")

        # -------------------------------------------------------------
        # 2. Departments
        # -------------------------------------------------------------
        depts_data = [
            {"name": "IT Infrastructure & Digital Services", "description": "Campus networks, Wi-Fi, ERP, and computing labs."},
            {"name": "Estate & Campus Facilities", "description": "Plumbing, electrical, civil maintenance, and campus grounds."},
            {"name": "Academic Affairs & Examinations", "description": "Course registration, grading, timetables, and academic policies."},
            {"name": "Hostel Administration & Dining", "description": "Hostel room allocations, maintenance, and dining hall quality."},
            {"name": "Finance & Student Accounts", "description": "Tuition fees, scholarships, and refunds."},
        ]

        dept_map = {}
        for d_item in depts_data:
            dept = db.query(Department).filter(Department.name == d_item["name"]).first()
            if not dept:
                dept = Department(name=d_item["name"], description=d_item["description"], is_active=True)
                db.add(dept)
                db.flush()
            dept_map[d_item["name"]] = dept
        db.commit()
        print(f"[OK] Seeded {len(dept_map)} Departments")


        # -------------------------------------------------------------
        # 3. Users
        # -------------------------------------------------------------
        users_data = [
            {
                "email": "student@example.com",
                "full_name": "Alice Student",
                "password": "password123",
                "role": "student",
                "department": None,
            },
            {
                "email": "authority@example.com",
                "full_name": "Dr. Authority Officer",
                "password": "password123",
                "role": "authority",
                "department": "Estate & Campus Facilities",
            },
            {
                "email": "admin@example.com",
                "full_name": "Sarah Jenkins",
                "password": "password123",
                "role": "admin",
                "department": None,
            },
            {
                "email": "anantraj@institution.edu",
                "full_name": "AnantRaj",
                "password": "password123",
                "role": "student",
                "department": None,
            },
            {
                "email": "ramesh.sharma@institution.edu",
                "full_name": "Dr. Ramesh Sharma",
                "password": "password123",
                "role": "authority",
                "department": "Estate & Campus Facilities",
            },
            {
                "email": "arvind.nambiar@institution.edu",
                "full_name": "Prof. Arvind Nambiar",
                "password": "password123",
                "role": "authority",
                "department": "Academic Affairs & Examinations",
            }
        ]

        user_count = 0
        for u_item in users_data:
            user = db.query(User).filter(User.email == u_item["email"]).first()
            dept = dept_map.get(u_item["department"]) if u_item["department"] else None
            role = role_map[u_item["role"]]
            
            if not user:
                user = User(
                    email=u_item["email"],
                    full_name=u_item["full_name"],
                    password_hash=get_password_hash(u_item["password"]),
                    role_id=role.id,
                    department_id=dept.id if dept else None,
                    is_active=True
                )
                db.add(user)
                user_count += 1
            else:
                user.password_hash = get_password_hash(u_item["password"])
                user.role_id = role.id
                if dept:
                    user.department_id = dept.id
        db.commit()
        print(f"[OK] Seeded {user_count} Users")

        # -------------------------------------------------------------
        # 4. Categories & Subcategories
        # -------------------------------------------------------------
        categories_data = [
            {
                "name": "Estate & Campus Facilities",
                "department": "Estate & Campus Facilities",
                "default_priority": "MEDIUM",
                "subcategories": [
                    "Plumbing & Water Supply",
                    "HVAC & Air Conditioning",
                    "Classroom & Lab Infrastructure",
                    "Electrical & Power Outage"
                ]
            },
            {
                "name": "Academic Affairs",
                "department": "Academic Affairs & Examinations",
                "default_priority": "HIGH",
                "subcategories": [
                    "Grade Discrepancy",
                    "Exam Timetable Clash",
                    "Course Registration & Faculty"
                ]
            },
            {
                "name": "IT & Digital Services",
                "department": "IT Infrastructure & Digital Services",
                "default_priority": "HIGH",
                "subcategories": [
                    "Wi-Fi / LAN Downtime",
                    "Student Portal / ERP Bugs",
                    "Lab Workstation Failure"
                ]
            },
            {
                "name": "Hostel & Residence",
                "department": "Hostel Administration & Dining",
                "default_priority": "MEDIUM",
                "subcategories": [
                    "Mess Food Quality & Hygiene",
                    "Room Allocation & Maintenance"
                ]
            },
            {
                "name": "Campus Safety & Harassment",
                "department": "Estate & Campus Facilities",
                "default_priority": "CRITICAL",
                "subcategories": [
                    "Campus Lighting / Dark Zones",
                    "Campus Safety & Harassment Incident"
                ]
            },
            {
                "name": "Finance & Accounts",
                "department": "Finance & Student Accounts",
                "default_priority": "MEDIUM",
                "subcategories": [
                    "Fee & Payment Discrepancy",
                    "Scholarship Disbursement"
                ]
            }
        ]

        for cat_item in categories_data:
            cat = db.query(Category).filter(Category.name == cat_item["name"]).first()
            if not cat:
                cat = Category(
                    name=cat_item["name"],
                    default_priority_policy=cat_item["default_priority"],
                    is_active=True
                )
                db.add(cat)
                db.flush()

            # Subcategories
            for sub_name in cat_item["subcategories"]:
                sub = db.query(Subcategory).filter(
                    Subcategory.category_id == cat.id,
                    Subcategory.name == sub_name
                ).first()
                if not sub:
                    sub = Subcategory(category_id=cat.id, name=sub_name)
                    db.add(sub)
                    db.flush()

            # Routing Rule
            target_dept = dept_map.get(cat_item["department"])
            if target_dept:
                r_rule = db.query(RoutingRule).filter(
                    RoutingRule.category_id == cat.id,
                    RoutingRule.subcategory_id.is_(None)
                ).first()
                if not r_rule:
                    r_rule = RoutingRule(
                        category_id=cat.id,
                        subcategory_id=None,
                        department_id=target_dept.id,
                        priority=1
                    )
                    db.add(r_rule)

        db.commit()
        print("[OK] Seeded Categories, Subcategories, and Routing Rules")

        # -------------------------------------------------------------
        # 5. SLA Rules
        # -------------------------------------------------------------
        sla_data = [
            {"priority": "CRITICAL", "hours": 12},
            {"priority": "HIGH", "hours": 24},
            {"priority": "MEDIUM", "hours": 48},
            {"priority": "LOW", "hours": 120}
        ]

        for sla in sla_data:
            rule = db.query(SLARule).filter(SLARule.priority == sla["priority"]).first()
            if not rule:
                rule = SLARule(priority=sla["priority"], hours=sla["hours"])
                db.add(rule)
        db.commit()
        print("[OK] Seeded SLA Rules")

        # -------------------------------------------------------------
        # 6. Institutional Settings
        # -------------------------------------------------------------
        settings_data = [
            {"key": "institution_name", "value": {"name": "National Institute of Technology"}, "description": "Host Institution Name"},
            {"key": "ai_triage_enabled", "value": {"enabled": True}, "description": "Global AI Autonomous Triage Flag"},
            {"key": "auto_escalate_on_sla_breach", "value": {"enabled": True}, "description": "Automatic tier escalation on SLA deadline breach"}
        ]

        for s_item in settings_data:
            setting = db.query(InstitutionSetting).filter(InstitutionSetting.key == s_item["key"]).first()
            if not setting:
                setting = InstitutionSetting(key=s_item["key"], value=s_item["value"], description=s_item["description"])
                db.add(setting)
        db.commit()
        print("[OK] Seeded Institution Settings")

        print("\n[SUCCESS] Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error during seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
