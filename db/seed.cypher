// Seed Script for CampusPilot AI Graph Database
// Contains 2 buildings (Building A and Building B)
// 3 floors per building, 10+ rooms, lifts, stairs, entrances, and QR nodes.

// Clear existing database contents
MATCH (n) DETACH DELETE n;

// --- BUILDING A ---
// Ground Floor (Floor 0)
CREATE (entA:Entrance {id: "ent-a-0", building: "Building A", name: "Main Entrance A"})
CREATE (qrA0:QRPoint {id: "qr-a-0", code: "QR_BUILDING_A_G", name: "Building A Ground Floor Lobby QR", building: "Building A", floor: 0, description: "Near Main Entrance"})
CREATE (corrA0:Corridor {id: "corr-a-0", building: "Building A", floor: 0, name: "Ground Floor Corridor"})
CREATE (roomA01:Room {id: "room-a-01", name: "Seminar Hall 101", building: "Building A", floor: 0, type: "Seminar Hall"})
CREATE (roomA02:Room {id: "room-a-02", name: "Admission Office 102", building: "Building A", floor: 0, type: "Office"})
CREATE (liftA:Lift {id: "lift-a", building: "Building A", name: "Main Elevator A"})
CREATE (stairsA:Stairs {id: "stairs-a", building: "Building A", name: "Staircase A"})

// First Floor (Floor 1)
CREATE (qrA1:QRPoint {id: "qr-a-1", code: "QR_BUILDING_A_1", name: "Building A First Floor QR", building: "Building A", floor: 1, description: "Next to Elevator A"})
CREATE (corrA1:Corridor {id: "corr-a-1", building: "Building A", floor: 1, name: "First Floor Corridor"})
CREATE (roomA11:Room {id: "room-a-11", name: "AI Lab 201", building: "Building A", floor: 1, type: "Laboratory"})
CREATE (roomA12:Room {id: "room-a-12", name: "Classroom 202", building: "Building A", floor: 1, type: "Classroom"})

// Second Floor (Floor 2)
CREATE (qrA2:QRPoint {id: "qr-a-2", code: "QR_BUILDING_A_2", name: "Building A Second Floor QR", building: "Building A", floor: 2, description: "Near Stairs A"})
CREATE (corrA2:Corridor {id: "corr-a-2", building: "Building A", floor: 2, name: "Second Floor Corridor"})
CREATE (roomA21:Room {id: "room-a-21", name: "Library", building: "Building A", floor: 2, type: "Library"})
CREATE (roomA22:Room {id: "room-a-22", name: "Server Room 302", building: "Building A", floor: 2, type: "Server Room"})

// --- BUILDING B ---
// Ground Floor (Floor 0)
CREATE (entB:Entrance {id: "ent-b-0", building: "Building B", name: "Main Entrance B"})
CREATE (qrB0:QRPoint {id: "qr-b-0", code: "QR_BUILDING_B_G", name: "Building B Ground Floor Lobby QR", building: "Building B", floor: 0, description: "Inside Entrance Lobby"})
CREATE (corrB0:Corridor {id: "corr-b-0", building: "Building B", floor: 0, name: "Ground Floor Corridor B"})
CREATE (roomB01:Room {id: "room-b-01", name: "Auditorium 1", building: "Building B", floor: 0, type: "Auditorium"})
CREATE (roomB02:Room {id: "room-b-02", name: "Cafeteria", building: "Building B", floor: 0, type: "Food Court"})
CREATE (liftB:Lift {id: "lift-b", building: "Building B", name: "Elevator B"})
CREATE (stairsB:Stairs {id: "stairs-b", building: "Building B", name: "Staircase B"})

// First Floor (Floor 1)
CREATE (qrB1:QRPoint {id: "qr-b-1", code: "QR_BUILDING_B_1", name: "Building B First Floor QR", building: "Building B", floor: 1, description: "Next to Elevator B"})
CREATE (corrB1:Corridor {id: "corr-b-1", building: "Building B", floor: 1, name: "First Floor Corridor B"})
CREATE (roomB11:Room {id: "room-b-11", name: "Physics Lab 201", building: "Building B", floor: 1, type: "Laboratory"})
CREATE (roomB12:Room {id: "room-b-12", name: "Classroom 203", building: "Building B", floor: 1, type: "Classroom"})

// Second Floor (Floor 2)
CREATE (qrB2:QRPoint {id: "qr-b-2", code: "QR_BUILDING_B_2", name: "Building B Second Floor QR", building: "Building B", floor: 2, description: "Near Stairs B"})
CREATE (corrB2:Corridor {id: "corr-b-2", building: "Building B", floor: 2, name: "Second Floor Corridor B"})
CREATE (roomB21:Room {id: "room-b-21", name: "Dean's Office", building: "Building B", floor: 2, type: "Office"})
CREATE (roomB22:Room {id: "room-b-22", name: "Conference Room 305", building: "Building B", floor: 2, type: "Meeting Room"})

// --- CONNECTIONS WITHIN BUILDING A ---
// Ground Floor Connections
CREATE (entA)-[:CONNECTS_TO {distance_meters: 5.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(qrA0)
CREATE (qrA0)-[:CONNECTS_TO {distance_meters: 5.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(entA)

CREATE (qrA0)-[:CONNECTS_TO {distance_meters: 10.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(corrA0)
CREATE (corrA0)-[:CONNECTS_TO {distance_meters: 10.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(qrA0)

CREATE (corrA0)-[:CONNECTS_TO {distance_meters: 15.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(roomA01)
CREATE (roomA01)-[:CONNECTS_TO {distance_meters: 15.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(corrA0)

CREATE (corrA0)-[:CONNECTS_TO {distance_meters: 8.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(roomA02)
CREATE (roomA02)-[:CONNECTS_TO {distance_meters: 8.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(corrA0)

// Vertical Connections (Lift A) - Accessible
CREATE (qrA0)-[:CONNECTS_TO {distance_meters: 4.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: true}]->(liftA)
CREATE (liftA)-[:CONNECTS_TO {distance_meters: 4.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: true}]->(qrA0)

// Vertical Connections (Stairs A) - Non-Accessible
CREATE (corrA0)-[:CONNECTS_TO {distance_meters: 6.0, wheelchair_accessible: false, tactile_paving: false, stairs: true, lift: false}]->(stairsA)
CREATE (stairsA)-[:CONNECTS_TO {distance_meters: 6.0, wheelchair_accessible: false, tactile_paving: false, stairs: true, lift: false}]->(corrA0)

// First Floor Connections
CREATE (qrA1)-[:CONNECTS_TO {distance_meters: 10.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(corrA1)
CREATE (corrA1)-[:CONNECTS_TO {distance_meters: 10.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(qrA1)

CREATE (corrA1)-[:CONNECTS_TO {distance_meters: 12.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(roomA11)
CREATE (roomA11)-[:CONNECTS_TO {distance_meters: 12.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(corrA1)

CREATE (corrA1)-[:CONNECTS_TO {distance_meters: 9.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(roomA12)
CREATE (roomA12)-[:CONNECTS_TO {distance_meters: 9.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(corrA1)

CREATE (qrA1)-[:CONNECTS_TO {distance_meters: 4.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: true}]->(liftA)
CREATE (liftA)-[:CONNECTS_TO {distance_meters: 4.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: true}]->(qrA1)

CREATE (corrA1)-[:CONNECTS_TO {distance_meters: 6.0, wheelchair_accessible: false, tactile_paving: false, stairs: true, lift: false}]->(stairsA)
CREATE (stairsA)-[:CONNECTS_TO {distance_meters: 6.0, wheelchair_accessible: false, tactile_paving: false, stairs: true, lift: false}]->(corrA1)

// Second Floor Connections
CREATE (qrA2)-[:CONNECTS_TO {distance_meters: 10.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(corrA2)
CREATE (corrA2)-[:CONNECTS_TO {distance_meters: 10.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(qrA2)

CREATE (corrA2)-[:CONNECTS_TO {distance_meters: 14.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(roomA21)
CREATE (roomA21)-[:CONNECTS_TO {distance_meters: 14.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(corrA2)

CREATE (corrA2)-[:CONNECTS_TO {distance_meters: 8.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(roomA22)
CREATE (roomA22)-[:CONNECTS_TO {distance_meters: 8.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(corrA2)

CREATE (qrA2)-[:CONNECTS_TO {distance_meters: 4.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: true}]->(liftA)
CREATE (liftA)-[:CONNECTS_TO {distance_meters: 4.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: true}]->(qrA2)

CREATE (corrA2)-[:CONNECTS_TO {distance_meters: 6.0, wheelchair_accessible: false, tactile_paving: false, stairs: true, lift: false}]->(stairsA)
CREATE (stairsA)-[:CONNECTS_TO {distance_meters: 6.0, wheelchair_accessible: false, tactile_paving: false, stairs: true, lift: false}]->(corrA2)

// --- CONNECTIONS WITHIN BUILDING B ---
// Ground Floor Connections
CREATE (entB)-[:CONNECTS_TO {distance_meters: 5.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(qrB0)
CREATE (qrB0)-[:CONNECTS_TO {distance_meters: 5.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(entB)

CREATE (qrB0)-[:CONNECTS_TO {distance_meters: 10.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(corrB0)
CREATE (corrB0)-[:CONNECTS_TO {distance_meters: 10.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(qrB0)

CREATE (corrB0)-[:CONNECTS_TO {distance_meters: 15.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(roomB01)
CREATE (roomB01)-[:CONNECTS_TO {distance_meters: 15.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(corrB0)

CREATE (corrB0)-[:CONNECTS_TO {distance_meters: 8.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(roomB02)
CREATE (roomB02)-[:CONNECTS_TO {distance_meters: 8.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(corrB0)

CREATE (qrB0)-[:CONNECTS_TO {distance_meters: 4.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: true}]->(liftB)
CREATE (liftB)-[:CONNECTS_TO {distance_meters: 4.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: true}]->(qrB0)

CREATE (corrB0)-[:CONNECTS_TO {distance_meters: 6.0, wheelchair_accessible: false, tactile_paving: false, stairs: true, lift: false}]->(stairsB)
CREATE (stairsB)-[:CONNECTS_TO {distance_meters: 6.0, wheelchair_accessible: false, tactile_paving: false, stairs: true, lift: false}]->(corrB0)

// First Floor Connections
CREATE (qrB1)-[:CONNECTS_TO {distance_meters: 10.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(corrB1)
CREATE (corrB1)-[:CONNECTS_TO {distance_meters: 10.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(qrB1)

CREATE (corrB1)-[:CONNECTS_TO {distance_meters: 12.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(roomB11)
CREATE (roomB11)-[:CONNECTS_TO {distance_meters: 12.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(corrB1)

CREATE (corrB1)-[:CONNECTS_TO {distance_meters: 9.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(roomB12)
CREATE (roomB12)-[:CONNECTS_TO {distance_meters: 9.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(corrB1)

CREATE (qrB1)-[:CONNECTS_TO {distance_meters: 4.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: true}]->(liftB)
CREATE (liftB)-[:CONNECTS_TO {distance_meters: 4.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: true}]->(qrB1)

CREATE (corrB1)-[:CONNECTS_TO {distance_meters: 6.0, wheelchair_accessible: false, tactile_paving: false, stairs: true, lift: false}]->(stairsB)
CREATE (stairsB)-[:CONNECTS_TO {distance_meters: 6.0, wheelchair_accessible: false, tactile_paving: false, stairs: true, lift: false}]->(corrB1)

// Second Floor Connections
CREATE (qrB2)-[:CONNECTS_TO {distance_meters: 10.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(corrB2)
CREATE (corrB2)-[:CONNECTS_TO {distance_meters: 10.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(qrB2)

CREATE (corrB2)-[:CONNECTS_TO {distance_meters: 14.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(roomB21)
CREATE (roomB21)-[:CONNECTS_TO {distance_meters: 14.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(corrB2)

CREATE (corrB2)-[:CONNECTS_TO {distance_meters: 8.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(roomB22)
CREATE (roomB22)-[:CONNECTS_TO {distance_meters: 8.0, wheelchair_accessible: true, tactile_paving: false, stairs: false, lift: false}]->(corrB2)

CREATE (qrB2)-[:CONNECTS_TO {distance_meters: 4.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: true}]->(liftB)
CREATE (liftB)-[:CONNECTS_TO {distance_meters: 4.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: true}]->(qrB2)

CREATE (corrB2)-[:CONNECTS_TO {distance_meters: 6.0, wheelchair_accessible: false, tactile_paving: false, stairs: true, lift: false}]->(stairsB)
CREATE (stairsB)-[:CONNECTS_TO {distance_meters: 6.0, wheelchair_accessible: false, tactile_paving: false, stairs: true, lift: false}]->(corrB2)

// --- INTER-BUILDING PATHS ---
CREATE (entA)-[:CONNECTS_TO {distance_meters: 50.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(entB)
CREATE (entB)-[:CONNECTS_TO {distance_meters: 50.0, wheelchair_accessible: true, tactile_paving: true, stairs: false, lift: false}]->(entA)
