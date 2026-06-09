from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from backend.db_client import db_client, MOCK_NODES

router = APIRouter(prefix="/qr", tags=["QR Codes"])

class QRLocationResponse(BaseModel):
    id: str
    code: str
    name: str
    building: str
    floor: int
    description: Optional[str] = None

@router.get("/lookup", response_model=QRLocationResponse)
def lookup_qr(code: str = Query(..., description="The content of the scanned QR code")):
    """
    Look up building, floor, and location metadata associated with a physical QR code scanner payload.
    """
    # 1. Try resolving using Neo4j session query
    query = """
    MATCH (q:QRPoint {code: $code})
    RETURN q.id as id, q.code as code, q.name as name, q.building as building, q.floor as floor, q.description as description
    """
    try:
        with db_client.get_session() as session:
            result = session.run(query, code=code)
            record = result.single()
            if record:
                return QRLocationResponse(
                    id=record["id"],
                    code=record["code"],
                    name=record["name"],
                    building=record["building"],
                    floor=record["floor"],
                    description=record["description"]
                )
    except Exception:
        # Fallback to mock search in in-memory nodes
        pass

    # Mock fallback
    for node in MOCK_NODES.values():
        if node.get("type") == "QRPoint" and node.get("code") == code:
            return QRLocationResponse(
                id=node["id"],
                code=node["code"],
                name=node["name"],
                building=node["building"],
                floor=node["floor"],
                description=node.get("description")
            )

    raise HTTPException(status_code=404, detail=f"QR code '{code}' not recognized on campus.")
