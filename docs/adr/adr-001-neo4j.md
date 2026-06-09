# ADR-001: Selection of Neo4j for Campus Navigation Graph

## Status
Approved

## Context
Campus environments consist of complex indoor layouts spanning multiple floors, buildings, corridors, lifts, stairs, entrances, and classrooms. 
We need to provide real-time routes filtered by accessibility constraints. For example, a wheelchair user needs paths that bypass stairs and use lifts/ramps exclusively, while a visually impaired user needs paths utilizing tactile paving.
Relational databases (like PostgreSQL) require recursive CTEs or complicated join queries to calculate paths across many hops in an indoor model, which degrades performance and is difficult to maintain.

## Decision
We chose Neo4j (a graph database) as the primary data store for the campus map representation.

## Consequences
- **Pros**:
  - Cypher query language provides native shortest path algorithms (e.g., `shortestPath`) with inline relationship attribute filtering.
  - Natural representation of physical topologies where nodes represent locations and edges represent walkable pathways.
  - Easy filtering of paths by properties (e.g., `WHERE ALL(r IN relationships(p) WHERE r.wheelchair_accessible = true)`).
- **Cons**:
  - Requires running a separate Neo4j database instance.
  - Less common for general-purpose transactional storage.
