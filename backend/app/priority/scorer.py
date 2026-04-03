# Priority scoring engine: Score = (DemandRatio \u00d7 PriorityMultiplier) + TimeSinceLastDelivery
"""Priority scoring calculation engine."""

from pydantic import BaseModel, Field
from datetime import datetime


class ScoringInput(BaseModel):
    demand_ratio: float = Field(..., ge=0.0, le=1.0)
    priority_multiplier: int = Field(..., ge=1, le=3)
    time_since_last_delivery: float = Field(..., ge=0.0) # hours


def calculate_score(data: ScoringInput) -> float:
    """The central scoring formula: (DemandRatio \u00d7 PriorityMultiplier) + TimeSinceLastDelivery."""
    # Score increases as demand ratio is higher, priority is critical, or time since delivery is high
    return (data.demand_ratio * data.priority_multiplier) + data.time_since_last_delivery
