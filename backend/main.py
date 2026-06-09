from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import qr, navigate

app = FastAPI(
    title="CampusPilot AI API",
    description="Backend services for indoor accessible campus navigation, including graph routing and QR lookup.",
    version="1.0"
)

# Configure CORS for PWA access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(qr.router)
app.include_router(navigate.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the CampusPilot AI API!",
        "status": "healthy"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
