import os
import uuid
import hashlib
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api import deps
from app.core.config import settings
from app.models import Grievance, Evidence, User
from app.schemas.enums import RoleEnum
from app.schemas.grievance import EvidenceResponse

router = APIRouter()

ALLOWED_MIME_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx"
}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

@router.post("/grievances/{id}/evidence", response_model=EvidenceResponse, status_code=status.HTTP_201_CREATED)
async def upload_evidence(
    id: uuid.UUID,
    file: UploadFile = File(...),
    is_resolution: bool = Form(False),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Upload and attach evidence to a grievance with MIME type validation and size checks.
    """
    grievance = db.query(Grievance).filter(Grievance.id == id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found.")

    role = current_user.role.name.lower() if current_user.role else "student"
    if role == RoleEnum.STUDENT.value and grievance.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized to attach files to this grievance.")

    # Validate MIME type
    content_type = file.content_type or "application/octet-stream"
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{content_type}'. Allowed types: PDF, PNG, JPG, WEBP, DOCX."
        )

    # Read and validate size
    content = await file.read()
    file_size = len(content)
    if file_size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of 10 MB ({file_size / (1024*1024):.1f} MB)."
        )

    # Compute SHA256
    checksum = hashlib.sha256(content).hexdigest()
    
    # Save file
    storage_dir = settings.EVIDENCE_STORAGE_DIR
    os.makedirs(storage_dir, exist_ok=True)
    ext = ALLOWED_MIME_TYPES.get(content_type, ".bin")
    storage_key = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(storage_dir, storage_key)

    with open(file_path, "wb") as f:
        f.write(content)

    evidence = Evidence(
        grievance_id=grievance.id,
        uploader_id=current_user.id,
        original_filename=file.filename or storage_key,
        mime_type=content_type,
        file_size_bytes=file_size,
        storage_key=storage_key,
        checksum_sha256=checksum,
        is_resolution_evidence=is_resolution
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)

    return EvidenceResponse(
        id=evidence.id,
        original_filename=evidence.original_filename,
        mime_type=evidence.mime_type,
        file_size_bytes=evidence.file_size_bytes,
        storage_key=evidence.storage_key,
        is_resolution_evidence=evidence.is_resolution_evidence,
        created_at=evidence.created_at
    )


@router.get("/grievances/{id}/evidence/{evidence_id}")
def download_evidence(
    id: uuid.UUID,
    evidence_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Secure file download endpoint with object-level authorization.
    """
    evidence = db.query(Evidence).filter(
        Evidence.id == evidence_id,
        Evidence.grievance_id == id
    ).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence record not found.")

    grievance = evidence.grievance
    role = current_user.role.name.lower() if current_user.role else "student"
    if role == RoleEnum.STUDENT.value and grievance.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized to download this evidence.")

    file_path = os.path.join(settings.EVIDENCE_STORAGE_DIR, evidence.storage_key)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found in storage volume.")

    return FileResponse(
        path=file_path,
        media_type=evidence.mime_type,
        filename=evidence.original_filename
    )
