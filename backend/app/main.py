import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.db.database import engine, Base
from app.api import api_router


# Ensure all database tables exist immediately upon module load
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all database tables exist on startup
    Base.metadata.create_all(bind=engine)
    yield



app = FastAPI(
    title="VeriMark — Cryptographic Exam Result Ledger API",
    description="Tamper-proof academic transcript ledger powered by binary Merkle trees and Ed25519 dual-key governance.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React/Next.js frontends and Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all /api routes
app.include_router(api_router)


@app.get("/")
def root():
    return {
        "service": "VeriMark Cryptographic Ledger API",
        "status": "operational",
        "version": "1.0.0",
        "documentation": "/docs"
    }
