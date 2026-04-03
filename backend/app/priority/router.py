# Priority API routes for AI-driven re-calculation and scoring
"""Priority API endpoints."""

from fastapi import APIRouter, Depends
from typing import List, Optional
from datetime import datetime
from app.priority.scorer import calculate_score, ScoringInput


router = APIRouter()

@router.get("/scores")
async def get_priority_scores() -> dict:
    """Retrieve current sorted priority queue (highest score first)."""
    # Mock data lookup until DB is ready
    return {
        "status": "success",
        "data": [],
        "calculated_at": datetime.utcnow()
    }

@router.post("/recalculate")
async def trigger_recalculate() -> dict:
    """Dispatcher-initiated re-allocation calculation."""
    # This will trigger the AI engine to generate re-routing suggestions
    return {
        "suggestions": [
            {
                "truck_id": "T-42",
                "action": "redirect",
                "from_destination": "Point Beta",
                "to_destination": "Point Alpha",
                "reason": "Critical stockout at Alpha (12 units) vs Alpha score 14.7",
                "require_approval": True
            }
        ],
        "calculation_ms": 1240
    }
