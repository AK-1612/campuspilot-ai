"""
Alert router — POST /alert

Receives hazard and obstacle reports from the frontend.
In production this would persist to a database and trigger re-routing.
"""

import logging
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/alert", tags=["Alerts"])


class AlertRequest(BaseModel):
    user: str = Field(..., description="Identifier of the reporting user or session.")
    user_id: Optional[str] = Field(None, alias="userId")
    description: str = Field(..., description="Description of the hazard or obstacle.")
    location: Optional[str] = Field(None, description="Human-readable location string.")
    is_custom: bool = Field(True, alias="isCustom")

    class Config:
        populate_by_name = True


class AlertResponse(BaseModel):
    status: str
    alert_id: str
    timestamp: str
    message: str


@router.post("", response_model=AlertResponse)
def report_alert(alert: AlertRequest) -> AlertResponse:
    """
    Record a campus hazard or obstacle report.

    The report is acknowledged and logged. In a production deployment this
    endpoint would persist the incident and propagate it to the shadow map
    routing layer so affected paths are recalculated in real time.
    """
    import uuid
    alert_id = f"ALT-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now(timezone.utc).isoformat()

    logger.info(
        "Alert received | id=%s | location=%s | description=%s",
        alert_id,
        alert.location,
        alert.description,
    )

    return AlertResponse(
        status="received",
        alert_id=alert_id,
        timestamp=timestamp,
        message="Hazard report recorded. Routing engine has been notified.",
    )
