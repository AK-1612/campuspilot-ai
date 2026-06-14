"""
QR router — GET /qr/lookup

Resolves a scanned QR code to its campus node metadata.
"""

import logging
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional

from backend.db_client import db_client, MOCK_NODES

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/qr", tags=["QR Codes"])


class QRLocationResponse(BaseModel):
    id: str
    code: str
    name: str
    building: str
    floor: int
    description: Optional[str] = None


@router.get("/lookup", response_model=QRLocationResponse)
def lookup_qr(
    code: str = Query(..., description="QR code value scanned from the physical marker.")
) -> QRLocationResponse:
    """
    Resolve a QR code to its associated campus location node.

    Attempts resolution against Neo4j first, then falls back to the
    in-memory mock graph if the database is unavailable.
    """
    cypher = """
    MATCH (q:QRPoint {code: $code})
    RETURN q.id AS id, q.code AS code, q.name AS name,
           q.building AS building, q.floor AS floor,
           q.description AS description
    """
    try:
        with db_client.get_session() as session:
            result = session.run(cypher, code=code)
            record = result.single()
            if record:
                return QRLocationResponse(
                    id=record["id"],
                    code=record["code"],
                    name=record["name"],
                    building=record["building"],
                    floor=record["floor"],
                    description=record["description"],
                )
    except Exception as exc:
        logger.warning("Neo4j QR lookup failed, using mock fallback: %s", exc)

    for node in MOCK_NODES.values():
        if node.get("type") == "QRPoint" and node.get("code") == code:
            return QRLocationResponse(
                id=node["id"],
                code=node["code"],
                name=node["name"],
                building=node["building"],
                floor=node["floor"],
                description=node.get("description"),
            )

    raise HTTPException(
        status_code=404,
        detail=f"QR code '{code}' was not recognised. Verify the code and try again.",
    )
