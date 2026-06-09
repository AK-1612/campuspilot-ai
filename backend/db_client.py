import logging
from .config import settings

logger = logging.getLogger("db_client")

# Import neo4j if available
try:
    from neo4j import GraphDatabase
    NEO4J_AVAILABLE = True
except ImportError:
    NEO4J_AVAILABLE = False

# Mock graph fallback data representation
# Nodes: Room, Entrance, QRPoint, Corridor, Lift, Stairs
MOCK_NODES = {
    # Building A
    "ent-a-0": {"id": "ent-a-0", "building": "Building A", "name": "Main Entrance A", "type": "Entrance", "floor": 0},
    "qr-a-0": {"id": "qr-a-0", "code": "QR_BUILDING_A_G", "name": "Building A Ground Floor Lobby QR", "type": "QRPoint", "building": "Building A", "floor": 0},
    "corr-a-0": {"id": "corr-a-0", "building": "Building A", "name": "Ground Floor Corridor", "type": "Corridor", "floor": 0},
    "room-a-01": {"id": "room-a-01", "name": "Seminar Hall 101", "type": "Room", "building": "Building A", "floor": 0},
    "room-a-02": {"id": "room-a-02", "name": "Admission Office 102", "type": "Room", "building": "Building A", "floor": 0},
    "lift-a": {"id": "lift-a", "building": "Building A", "name": "Main Elevator A", "type": "Lift"},
    "stairs-a": {"id": "stairs-a", "building": "Building A", "name": "Staircase A", "type": "Stairs"},
    "qr-a-1": {"id": "qr-a-1", "code": "QR_BUILDING_A_1", "name": "Building A First Floor QR", "type": "QRPoint", "building": "Building A", "floor": 1},
    "corr-a-1": {"id": "corr-a-1", "building": "Building A", "name": "First Floor Corridor", "type": "Corridor", "floor": 1},
    "room-a-11": {"id": "room-a-11", "name": "AI Lab 201", "type": "Room", "building": "Building A", "floor": 1},
    "room-a-12": {"id": "room-a-12", "name": "Classroom 202", "type": "Room", "building": "Building A", "floor": 1},
    "qr-a-2": {"id": "qr-a-2", "code": "QR_BUILDING_A_2", "name": "Building A Second Floor QR", "type": "QRPoint", "building": "Building A", "floor": 2},
    "corr-a-2": {"id": "corr-a-2", "building": "Building A", "name": "Second Floor Corridor", "type": "Corridor", "floor": 2},
    "room-a-21": {"id": "room-a-21", "name": "Library", "type": "Room", "building": "Building A", "floor": 2},
    "room-a-22": {"id": "room-a-22", "name": "Server Room 302", "type": "Room", "building": "Building A", "floor": 2},

    # Building B
    "ent-b-0": {"id": "ent-b-0", "building": "Building B", "name": "Main Entrance B", "type": "Entrance", "floor": 0},
    "qr-b-0": {"id": "qr-b-0", "code": "QR_BUILDING_B_G", "name": "Building B Ground Floor Lobby QR", "type": "QRPoint", "building": "Building B", "floor": 0},
    "corr-b-0": {"id": "corr-b-0", "building": "Building B", "name": "Ground Floor Corridor B", "type": "Corridor", "floor": 0},
    "room-b-01": {"id": "room-b-01", "name": "Auditorium 1", "type": "Room", "building": "Building B", "floor": 0},
    "room-b-02": {"id": "room-b-02", "name": "Cafeteria", "type": "Room", "building": "Building B", "floor": 0},
    "lift-b": {"id": "lift-b", "building": "Building B", "name": "Elevator B", "type": "Lift"},
    "stairs-b": {"id": "stairs-b", "building": "Building B", "name": "Staircase B", "type": "Stairs"},
    "qr-b-1": {"id": "qr-b-1", "code": "QR_BUILDING_B_1", "name": "Building B First Floor QR", "type": "QRPoint", "building": "Building B", "floor": 1},
    "corr-b-1": {"id": "corr-b-1", "building": "Building B", "name": "First Floor Corridor B", "type": "Corridor", "floor": 1},
    "room-b-11": {"id": "room-b-11", "name": "Physics Lab 201", "type": "Room", "building": "Building B", "floor": 1},
    "room-b-12": {"id": "room-b-12", "name": "Classroom 203", "type": "Room", "building": "Building B", "floor": 1},
    "qr-b-2": {"id": "qr-b-2", "code": "QR_BUILDING_B_2", "name": "Building B Second Floor QR", "type": "QRPoint", "building": "Building B", "floor": 2},
    "corr-b-2": {"id": "corr-b-2", "building": "Building B", "name": "Second Floor Corridor B", "type": "Corridor", "floor": 2},
    "room-b-21": {"id": "room-b-21", "name": "Dean's Office", "type": "Room", "building": "Building B", "floor": 2},
    "room-b-22": {"id": "room-b-22", "name": "Conference Room 305", "type": "Room", "building": "Building B", "floor": 2},
}

MOCK_EDGES = [
    # Building A Ground Floor
    ("ent-a-0", "qr-a-0", 5.0, True, True, False, False),
    ("qr-a-0", "corr-a-0", 10.0, True, True, False, False),
    ("corr-a-0", "room-a-01", 15.0, True, False, False, False),
    ("corr-a-0", "room-a-02", 8.0, True, False, False, False),
    ("qr-a-0", "lift-a", 4.0, True, True, False, True),
    ("corr-a-0", "stairs-a", 6.0, False, False, True, False),

    # Building A First Floor
    ("qr-a-1", "corr-a-1", 10.0, True, True, False, False),
    ("corr-a-1", "room-a-11", 12.0, True, False, False, False),
    ("corr-a-1", "room-a-12", 9.0, True, False, False, False),
    ("qr-a-1", "lift-a", 4.0, True, True, False, True),
    ("corr-a-1", "stairs-a", 6.0, False, False, True, False),

    # Building A Second Floor
    ("qr-a-2", "corr-a-2", 10.0, True, True, False, False),
    ("corr-a-2", "room-a-21", 14.0, True, True, False, False),
    ("corr-a-2", "room-a-22", 8.0, True, False, False, False),
    ("qr-a-2", "lift-a", 4.0, True, True, False, True),
    ("corr-a-2", "stairs-a", 6.0, False, False, True, False),

    # Building B Ground Floor
    ("ent-b-0", "qr-b-0", 5.0, True, True, False, False),
    ("qr-b-0", "corr-b-0", 10.0, True, True, False, False),
    ("corr-b-0", "room-b-01", 15.0, True, False, False, False),
    ("corr-b-0", "room-b-02", 8.0, True, False, False, False),
    ("qr-b-0", "lift-b", 4.0, True, True, False, True),
    ("corr-b-0", "stairs-b", 6.0, False, False, True, False),

    # Building B First Floor
    ("qr-b-1", "corr-b-1", 10.0, True, True, False, False),
    ("corr-b-1", "room-b-11", 12.0, True, False, False, False),
    ("corr-b-1", "room-b-12", 9.0, True, False, False, False),
    ("qr-b-1", "lift-b", 4.0, True, True, False, True),
    ("corr-b-1", "stairs-b", 6.0, False, False, True, False),

    # Building B Second Floor
    ("qr-b-2", "corr-b-2", 10.0, True, True, False, False),
    ("corr-b-2", "room-b-21", 14.0, True, True, False, False),
    ("corr-b-2", "room-b-22", 8.0, True, False, False, False),
    ("qr-b-2", "lift-b", 4.0, True, True, False, True),
    ("corr-b-2", "stairs-b", 6.0, False, False, True, False),

    # Inter-building Path
    ("ent-a-0", "ent-b-0", 50.0, True, True, False, False),
]

# Generate bidirectionality for mock edges
ADJACENCY_LIST = {}
for u, v, dist, wa, tp, st, lf in MOCK_EDGES:
    if u not in ADJACENCY_LIST: ADJACENCY_LIST[u] = []
    if v not in ADJACENCY_LIST: ADJACENCY_LIST[v] = []
    # (neighbor, distance, wheelchair_accessible, tactile_paving, is_stairs, is_lift)
    ADJACENCY_LIST[u].append((v, dist, wa, tp, st, lf))
    ADJACENCY_LIST[v].append((u, dist, wa, tp, st, lf))

class MockSession:
    def run(self, cypher, **kwargs):
        # Extremely simplified cypher execution to satisfy basic query verification.
        # Check if searching for a node or a path
        if "MATCH (q:QRPoint)" in cypher:
            # QR code lookup
            code = kwargs.get("code")
            for node in MOCK_NODES.values():
                if node.get("type") == "QRPoint" and node.get("code") == code:
                    return [MockRecord({"q": MockNode(node)})]
            return []
        
        # Room lookup
        if "MATCH (r:Room)" in cypher:
            name = kwargs.get("room_name")
            for node in MOCK_NODES.values():
                if node.get("type") == "Room" and name.lower() in node.get("name", "").lower():
                    return [MockRecord({"r": MockNode(node)})]
            return []
        
        return []

class MockNode:
    def __init__(self, props):
        self._properties = props
    def __getitem__(self, key):
        return self._properties.get(key)
    def get(self, key, default=None):
        return self._properties.get(key, default)
    @property
    def id(self):
        return self._properties.get("id")
    @property
    def element_id(self):
        return self._properties.get("id")

class MockRecord:
    def __init__(self, data):
        self._data = data
    def __getitem__(self, key):
        return self._data[key]
    def data(self):
        return self._data

class MockNeo4jClient:
    def __init__(self):
        logger.info("Initializing Mock Neo4j Client fallback...")
        
    def session(self):
        return MockSession()
    
    def close(self):
        pass

class Neo4jClient:
    def __init__(self):
        self.driver = None
        self.is_mock = False
        if NEO4J_AVAILABLE:
            try:
                self.driver = GraphDatabase.driver(
                    settings.NEO4J_URI,
                    auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
                )
                self.driver.verify_connectivity()
                logger.info("Connected to Neo4j successfully!")
            except Exception as e:
                logger.warning(f"Neo4j connection failed: {e}. Falling back to mock client.")
                self.driver = MockNeo4jClient()
                self.is_mock = True
        else:
            logger.warning("neo4j-driver not installed. Falling back to mock client.")
            self.driver = MockNeo4jClient()
            self.is_mock = True

    def get_session(self):
        return self.driver.session()

    def close(self):
        if self.driver:
            self.driver.close()

    def find_shortest_path(self, start_id: str, end_id: str, profile: str = "default"):
        # Map profile constraints to boolean flags
        wheelchair_req = profile.lower() in ["wheelchair", "mobility_impaired"]
        tactile_req = profile.lower() in ["vision_impaired", "visually_impaired"]

        if self.is_mock or isinstance(self.driver, MockNeo4jClient):
            return self._find_mock_path(start_id, end_id, wheelchair_req, tactile_req)

        # Execute Cypher pathfinding query
        query = """
        MATCH (start {id: $start_id}), (end {id: $end_id})
        MATCH p = shortestPath((start)-[:CONNECTS_TO*..30]->(end))
        WHERE ALL(r IN relationships(p) WHERE 
          (CASE WHEN $wheelchair_req = true THEN r.wheelchair_accessible = true ELSE true END) AND
          (CASE WHEN $tactile_req = true THEN r.tactile_paving = true ELSE true END)
        )
        RETURN [n IN nodes(p) | {id: n.id, name: n.name, type: labels(n)[0], building: n.building, floor: n.floor}] as path_nodes,
               [r IN relationships(p) | {distance_meters: r.distance_meters, wheelchair_accessible: r.wheelchair_accessible, tactile_paving: r.tactile_paving}] as path_edges
        """
        try:
            with self.get_session() as session:
                result = session.run(query, start_id=start_id, end_id=end_id, wheelchair_req=wheelchair_req, tactile_req=tactile_req)
                record = result.single()
                if record:
                    return {
                        "nodes": record["path_nodes"],
                        "edges": record["path_edges"]
                    }
        except Exception as e:
            logger.warning(f"Cypher path query failed: {e}. Falling back to mock path computation.")
        
        return self._find_mock_path(start_id, end_id, wheelchair_req, tactile_req)

    def _find_mock_path(self, start_id: str, end_id: str, wheelchair_req: bool, tactile_req: bool):
        # Python Dijkstra implementation
        import heapq
        
        # Priority queue: (cost, current_node, path_history, edges_history)
        queue = [(0.0, start_id, [start_id], [])]
        visited = set()
        
        while queue:
            cost, node, path, edges = heapq.heappop(queue)
            
            if node == end_id:
                # Format node dicts and edge dicts
                path_nodes = []
                for nid in path:
                    node_info = MOCK_NODES.get(nid, {"id": nid, "name": nid, "type": "Location"})
                    # Ensure "type" defaults nicely
                    ntype = node_info.get("type", "Location")
                    path_nodes.append({
                        "id": node_info.get("id"),
                        "name": node_info.get("name"),
                        "type": ntype,
                        "building": node_info.get("building"),
                        "floor": node_info.get("floor")
                    })
                return {
                    "nodes": path_nodes,
                    "edges": edges
                }
                
            if node in visited:
                continue
            visited.add(node)
            
            neighbors = ADJACENCY_LIST.get(node, [])
            for neighbor, dist, wa, tp, stairs, lift in neighbors:
                if neighbor in visited:
                    continue
                # Filter by constraints
                if wheelchair_req and not wa:
                    continue
                if tactile_req and not tp:
                    continue
                
                new_edges = list(edges)
                new_edges.append({
                    "distance_meters": dist,
                    "wheelchair_accessible": wa,
                    "tactile_paving": tp
                })
                heapq.heappush(queue, (cost + dist, neighbor, path + [neighbor], new_edges))
                
        return None

db_client = Neo4jClient()

