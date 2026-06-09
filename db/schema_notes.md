# Neo4j Graph Database Schema Notes

This document describes the schema design for the CampusPilot AI campus navigation graph.

## Graph Modeling Decisions
A graph database (Neo4j) is used over relational databases (like PostgreSQL with PostGIS extension) because campus navigation indoors consists of interconnected nodes (rooms, corridor junctions, lifts, staircases, QR codes) where queries are pathfinding-heavy. Representing multi-floor buildings with different accessibility routes requires navigating nested relationships, which is highly efficient in Cypher compared to complex recursive SQL joins.

## Node Types

- **`QRPoint`**: Represents a physical QR code checkpoint placed at a corridor junction, lift lobby, or entrance.
  - Properties: `id` (UUID), `code` (string, the content of the QR code), `name` (string), `building` (string), `floor` (integer), `description` (string).
- **`Room`**: Classrooms, laboratories, faculty offices, libraries, or restrooms.
  - Properties: `id` (UUID), `name` (string), `building` (string), `floor` (integer), `type` (string).
- **`Corridor`**: Connective hallway segments or hallway intersection points.
  - Properties: `id` (UUID), `building` (string), `floor` (integer), `name` (string).
- **`Lift`**: Lifts connecting multiple floors.
  - Properties: `id` (UUID), `building` (string), `name` (string).
- **`Stairs`**: Staircases connecting multiple floors.
  - Properties: `id` (UUID), `building` (string), `name` (string).
- **`Entrance`**: Building entrances connecting the outdoor space to the indoor graph.
  - Properties: `id` (UUID), `building` (string), `name` (string).

## Relationships

- **`CONNECTS_TO`**: Represents a path connecting two physical locations.
  - Properties:
    - `distance_meters` (float): Distance in meters between the locations.
    - `wheelchair_accessible` (boolean): `true` if the route does not contain steps and conforms to ramp slopes.
    - `tactile_paving` (boolean): `true` if tactile paving is present for visually impaired navigation.
    - `stairs` (boolean): `true` if this connection represents traversing stairs.
    - `lift` (boolean): `true` if this connection represents traversing a lift.
