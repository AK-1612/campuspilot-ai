"""
CampusPilot AI — FastAPI Application Entry Point

Configures the FastAPI application, CORS middleware, and API routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import qr, navigate, alert

app = FastAPI(
    title="CampusPilot AI API",
    description=(
        "Backend services for accessible indoor campus navigation. "
        "Provides graph-based routing, QR checkpoint resolution, "
        "and agentic wayfinding via LangChain and Neo4j."
    ),
    version="1.0.0",
    contact={
        "name": "CampusPilot AI Team",
        "url": "https://github.com/AK-1612/campuspilot-ai",
    },
    license_info={"name": "Apache-2.0"},
)

# CORS — restrict in production to your frontend's origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(qr.router)
app.include_router(navigate.router)
app.include_router(alert.router)


@app.get("/", tags=["Health"])
def health_check() -> dict:
    """Returns API health status."""
    return {"status": "healthy", "service": "CampusPilot AI API", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
