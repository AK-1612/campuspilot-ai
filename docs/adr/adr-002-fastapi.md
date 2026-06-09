# ADR-002: FastAPI over Flask/Django and REST over GraphQL

## Status
Approved

## Context
We require a lightweight, high-performance web service to power our backend navigation APIs. The API needs to receive user queries, resolve QR-based positions, route queries to the LLM agent, and run Cypher queries against Neo4j.
Flask lacks native asynchronous support and schema validation out of the box, whereas Django is too heavy and opinionated for a microservice architecture.
Furthermore, we need to decide between REST and GraphQL for communication between our frontend PWA and backend APIs.

## Decision
We chose FastAPI as our python web framework and REST APIs for client-server communication.

## Consequences
- **Pros**:
  - Asynchronous capability (`async/await`) allows handling multiple parallel connections efficiently, especially during model calls to Claude API.
  - Automatic OpenAPI documentation generation (Swagger UI) allows implementation team to quickly test endpoints.
  - Native Pydantic integration for strict request/response validation.
  - REST is simple to cache, works with standard proxies/service workers, and has less client-side footprint than GraphQL client libraries, supporting offline-first requirements.
- **Cons**:
  - Requires explicit code setup for dependency injection.
