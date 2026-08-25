from typing import List
import uuid
from sqlalchemy.orm import Session
from ..models import Grievance, InstitutionalIssue
from ..ai.ai_service import ai_client

async def aggregate_grievances_to_issue(db: Session, grievance_ids: List[uuid.UUID], department_id: uuid.UUID = None):
    """
    Take a list of related grievances and use AI to summarize them into an Institutional Issue.
    """
    grievances = db.query(Grievance).filter(Grievance.id.in_(grievance_ids)).all()
    if not grievances:
        return None
        
    text_corpus = "\n\n".join([f"Grievance {i+1}: {g.title}\n{g.description}" for i, g in enumerate(grievances)])
    
    system_prompt = """
    You are an analyst. Given a list of related grievances, summarize the core underlying institutional issue.
    Provide a short title (max 50 chars) on the first line, and a brief description on the subsequent lines.
    Do not use introductory phrases, just output the title and description.
    """
    
    analysis = await ai_client._generate(prompt=text_corpus, system=system_prompt)
    lines = analysis.strip().split('\n')
    
    title = lines[0][:50]
    description = '\n'.join(lines[1:]).strip() if len(lines) > 1 else "Aggregated issue based on multiple grievances."
    
    issue = InstitutionalIssue(
        title=title,
        description=description,
        department_id=department_id,
        related_grievance_ids=[str(g_id) for g_id in grievance_ids]
    )
    
    db.add(issue)
    db.commit()
    db.refresh(issue)
    return issue
