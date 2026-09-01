from datetime import timedelta
from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core import security
from app.core.config import settings
from app.schemas.auth import Token, UserResponse, UserRegister, UserLogin
from app.models import User, Role
from app.api import deps

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    user_in: UserRegister,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Register a new student account.
    """
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    # Get or create default 'student' role
    student_role = db.query(Role).filter(Role.name.ilike("student")).first()
    if not student_role:
        student_role = Role(name="student", permissions={"can_submit": True, "can_view_own": True})
        db.add(student_role)
        db.flush()

    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        password_hash=security.get_password_hash(user_in.password),
        role_id=student_role.id,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=student_role.name,
        role_id=student_role.id,
        department=None,
        department_id=None,
        avatar_url=user.avatar_url,
        is_active=user.is_active,
        created_at=user.created_at
    )


@router.post("/login", response_model=Token)
def login_json(
    user_in: UserLogin,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Authenticate user with JSON credentials and generate Bearer JWT token.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not security.verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password."
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive or suspended."
        )

    role_name = user.role.name if user.role else "student"
    dept_id = str(user.department_id) if user.department_id else None

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = security.create_access_token(
        subject=user.id,
        role=role_name,
        department_id=dept_id,
        expires_delta=access_token_expires
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": role_name,
        "user_id": user.id
    }


@router.post("/token", response_model=Token)
def login_oauth2_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    OAuth2 compatible token login for Swagger UI.
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password."
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive."
        )

    role_name = user.role.name if user.role else "student"
    dept_id = str(user.department_id) if user.department_id else None

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = security.create_access_token(
        subject=user.id,
        role=role_name,
        department_id=dept_id,
        expires_delta=access_token_expires
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": role_name,
        "user_id": user.id
    }


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(deps.get_current_active_user)) -> Any:
    """
    Fetch the profile of the currently logged-in user.
    """
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role.name if current_user.role else None,
        role_id=current_user.role_id,
        department=current_user.department.name if current_user.department else None,
        department_id=current_user.department_id,
        avatar_url=current_user.avatar_url,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )


@router.post("/logout")
def logout() -> Any:
    """
    Stateless JWT logout confirmation.
    """
    return {"message": "Successfully logged out."}
