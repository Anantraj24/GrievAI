from typing import List, Optional
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models import Grievance, InstitutionalIssue, InstitutionalIssueMember
from app.ai.ai_service import ai_client

async def aggregate_grievances_to_issue(
    db: Session,
    grievance_ids: List[uuid.UUID],
    category_id: Optional[uuid.UUID] = None
) -> Optional[InstitutionalIssue]:
    """
    Takes a list of related grievances and creates an aggregated InstitutionalIssue
    with member links in institutional_issue_members table.
    """
    grievances = db.query(Grievance).filter(Grievance.id.in_(grievance_ids)).all()
    if not grievances:
        return None

    text_corpus = "\n\n".join([f"Grievance {i+1}: {g.title or 'No title'}\n{g.description}" for i, g in enumerate(grievances)])

    system_prompt = """You are an institutional problem analyst. Given a list of related complaints, summarize the underlying systemic issue.
Provide a concise title (under 50 characters) on line 1, and a 2-3 sentence summary on subsequent lines."""

    analysis = await ai_client._generate(prompt=text_corpus, system=system_prompt)
    lines = [l.strip() for l in analysis.strip().split("\n") if l.strip()]

    title = lines[0][:50] if lines else f"Systemic Issue ({len(grievances)} reports)"
    description = " ".join(lines[1:]) if len(lines) > 1 else "Aggregated issue based on multiple student grievances."

    # Extract dates & locations
    created_dates = [g.created_at for g in grievances if g.created_at]
    first_reported = min(created_dates) if created_dates else datetime.now(timezone.utc)
    last_reported = max(created_dates) if created_dates else datetime.now(timezone.utc)
    locations = list(set([g.location for g in grievances if g.location]))

    resolved_category = category_id or (grievances[0].category_id if grievances else None)

    issue = InstitutionalIssue(
        title=title,
        category_id=resolved_category,
        status="UNDER_INVESTIGATION",
        first_reported_at=first_reported,
        last_reported_at=last_reported,
        affected_locations=locations,
        related_grievance_count=len(grievances)
    )
    db.add(issue)
    db.flush()

    # Link member grievances
    for g in grievances:
        member = InstitutionalIssueMember(
            issue_id=issue.id,
            grievance_id=g.id
        )
        db.add(member)

    db.commit()
    db.refresh(issue)
    return issue
