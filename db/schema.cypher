// CampusPilot AI — Neo4j Schema Definitions
// Version: 1.0

// Constraints
CREATE CONSTRAINT UNIQUE_LOCATION_ID IF NOT EXISTS
FOR (l:Location) REQUIRE l.id IS UNIQUE;

CREATE CONSTRAINT UNIQUE_QR_ID IF NOT EXISTS
FOR (q:QRPoint) REQUIRE q.id IS UNIQUE;

// Indexes
CREATE INDEX LOCATION_NAME_INDEX IF NOT EXISTS
FOR (l:Location) ON (l.name);

CREATE INDEX QR_CODE_INDEX IF NOT EXISTS
FOR (q:QRPoint) ON (q.code);

// Nodes:
// - QRPoint {id, code, name, building, floor, description}
// - Room {id, name, building, floor, type}
// - Corridor {id, building, floor, name}
// - Lift {id, building, name}
// - Stairs {id, building, name}
// - Entrance {id, building, name}

// Relationships:
// - (:QRPoint)-[:CONNECTS_TO {distance_meters: Float, wheelchair_accessible: Boolean, tactile_paving: Boolean, stairs: Boolean, lift: Boolean}]->(:Location)
