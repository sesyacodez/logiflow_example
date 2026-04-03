# Inventory routes for delivery points and stock management
"""Inventory API endpoints."""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.inventory.models import DeliveryPoint, InventoryUpdate

router = APIRouter()

# Placeholder for DB session
# from app.shared.database import get_db

@router.get("/", response_model=dict)
async def list_delivery_points(
    priority: Optional[int] = None,
    region: Optional[str] = None
) -> dict:
    """List all points with their current inventory summary."""
    # Mock database query
    return {
        "status": "success",
        "data": [],
        "total": 0
    }

@router.get("/{id}", response_model=DeliveryPoint)
async def get_delivery_point(id: UUID) -> DeliveryPoint:
    """Retrieve full detail for a single delivery point."""
    # Mock data lookup until DB is ready
    raise HTTPException(status_code=404, detail="Point not found")

@router.patch("/{id}/stock")
async def update_stock(id: UUID, update: InventoryUpdate):
    """Update stock level — requires Warehouse role."""
    return {
        "status": "success",
        "delivery_point_id": str(id),
        "new_quantity": 0,
        "updated_at": datetime.utcnow()
    }
