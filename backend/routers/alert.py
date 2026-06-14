from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/alert", tags=["Alert"])

class Alert(BaseModel):
    user: str
    userId: str | None = None
    description: str
    location: str | None = None
    timestamp: datetime = datetime.utcnow()
    isCustom: bool = True
    # Add any other fields as needed

@router.post("", response_model=Alert)
def report_alert(issue: Alert):
    """Receive a hazard/obstacle report.
    In a real system this would store the incident in a database or trigger
    further processing. Here we simply echo back the received payload.
    """
    # For demo purposes, just return the issue
    return issue
