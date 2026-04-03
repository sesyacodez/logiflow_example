# Inventory data models and Pydantic schemas for delivery points
"""Inventory-related data models."""

from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Literal, List, Optional


class Coordinate(BaseModel):
    lat: float
    lng: float


class DeliveryPointBase(BaseModel):
    name: str = Field(..., description="Name of the delivery point")
    priority: Literal[1, 2, 3] = Field(1, description="Current priority level (1=Normal, 2=Elevated, 3=Critical)")
    stock_level: int = Field(0, description="Current units in stock")
    stock_capacity: int = Field(500, description="Max units point can hold")
    demand_ratio: float = Field(0.1, description="Rate of consumption")


class DeliveryPoint(DeliveryPointBase):
    id: UUID
    coordinates: Coordinate
    last_delivery_at: datetime
    score: float

    model_config = ConfigDict(from_attributes=True)


class InventoryUpdate(BaseModel):
    resource_type: str = "fuel"
    quantity_delta: int
    reference_scan: Optional[str] = None
