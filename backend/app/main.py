# Backend FastAPI — main application entry point
"""LogiFlow AI — FastAPI backend application factory."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.router import router as auth_router
from app.inventory.router import router as inventory_router
from app.routes.router import router as routes_router
from app.priority.router import router as priority_router
from app.websocket.router import router as ws_router
from app.shared.config import settings

app = FastAPI(
    title="LogiFlow AI API",
    version="1.0.0",
    description="Dynamic Logistics Optimization System — REST + WebSocket API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router,      prefix="/auth",           tags=["auth"])
app.include_router(inventory_router, prefix="/inventory",      tags=["inventory"])
app.include_router(routes_router,    prefix="/routes",         tags=["routes"])
app.include_router(priority_router,  prefix="/priority",       tags=["priority"])
app.include_router(ws_router,        prefix="/ws",             tags=["websocket"])


@app.get("/health", tags=["health"])
async def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok", "service": "logiflow-ai"}
