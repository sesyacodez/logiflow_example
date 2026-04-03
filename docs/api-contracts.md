# API Contracts: LogiFlow AI

> REST + WebSocket API definitions between the Next.js frontend and FastAPI backend.
> Base URL: `https://api.logiflow.ai` (production) | `http://localhost:8000` (dev)
> All endpoints require `Authorization: Bearer <access_token>` unless marked **[public]**.

---

## 1. Authentication

### POST `/auth/login`  **[public]**
Exchange credentials for JWT tokens.

**Request**
```json
{
  "email": "dispatcher@logiflow.ai",
  "password": "s3cur3passw0rd"
}
```

**Response `200`**
```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "Bearer",
  "user": {
    "id": "uuid",
    "email": "dispatcher@logiflow.ai",
    "role": "dispatcher" // "dispatcher" | "warehouse" | "manager"
  }
}
```

**Errors**: `401 Invalid credentials`, `422 Validation error`

---

### POST `/auth/refresh`  **[public]**
Exchange a valid refresh token for a new access token.

**Request** (HttpOnly cookie `refresh_token` or body)
```json
{ "refresh_token": "<jwt>" }
```

**Response `200`**
```json
{ "access_token": "<new_jwt>", "token_type": "Bearer" }
```

---

## 2. Delivery Points

### GET `/delivery-points`
List all delivery points with their current inventory summary.

**Query Params**
| Param      | Type   | Default | Description                    |
|------------|--------|---------|--------------------------------|
| `priority` | int    | —       | Filter by priority level (1–3) |
| `region`   | string | —       | Filter by region name          |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Point Alpha",
      "coordinates": { "lat": 50.45, "lng": 30.52 },
      "priority": 3,
      "stock_level": 12,
      "stock_capacity": 500,
      "demand_ratio": 0.024,
      "last_delivery_at": "2026-04-03T08:00:00Z",
      "score": 14.7
    }
  ],
  "total": 42
}
```

---

### GET `/delivery-points/{id}`
Retrieve a single delivery point with full detail.

**Response `200`** — same shape as list item, plus:
```json
{
  "...": "...",
  "recent_events": [
    { "type": "priority_change", "from": 1, "to": 3, "at": "2026-04-03T09:15:00Z" }
  ],
  "pending_routes": ["route-uuid-1"]
}
```

---

### POST `/delivery-points/{id}/urgent`
One-tap urgent request from a Point-of-Delivery Manager.

**Request**
```json
{
  "message": "Critical fuel shortage, generator at risk",
  "requested_quantity": 200
}
```

**Response `201`**
```json
{
  "event_id": "uuid",
  "delivery_point_id": "uuid",
  "new_priority": 3,
  "created_at": "2026-04-03T09:20:00Z"
}
```

---

## 3. Inventory

### GET `/inventory`
Get current stock levels across all delivery points.

**Response `200`**
```json
{
  "data": [
    {
      "delivery_point_id": "uuid",
      "resource_type": "fuel",
      "quantity": 45,
      "unit": "liters",
      "updated_at": "2026-04-03T09:00:00Z"
    }
  ]
}
```

---

### PATCH `/inventory/{delivery_point_id}`
Update stock after a warehouse confirms a load. **[Warehouse role required]**

**Request**
```json
{
  "resource_type": "fuel",
  "quantity_delta": -200,
  "reference_scan": "QR-SCAN-ID-123"
}
```

**Response `200`**
```json
{
  "delivery_point_id": "uuid",
  "new_quantity": 245,
  "updated_at": "2026-04-03T09:30:00Z"
}
```

---

## 4. Routes & Re-allocation

### GET `/routes`
List active logistics routes.

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "truck_id": "T-42",
      "from": "Warehouse Central",
      "to": "Point Alpha",
      "status": "in_transit",  // "planned" | "in_transit" | "redirected" | "delivered"
      "is_ghost": false,
      "redirected_to": null,
      "eta_minutes": 45
    }
  ]
}
```

---

### POST `/routes/{id}/redirect`
Dispatcher approves re-routing a truck. **[Dispatcher role required]**

**Request**
```json
{
  "new_destination_id": "uuid",
  "reason": "Critical demand at Point Alpha exceeds Point Beta"
}
```

**Response `200`**
```json
{
  "route_id": "uuid",
  "previous_destination": "Point Beta",
  "new_destination": "Point Alpha",
  "ghost_created": true,
  "recalculation_ms": 1240
}
```

> The `ghost_created: true` flag tells the frontend to render a `GhostLoad` at the original destination.

---

## 5. Priority Engine

### GET `/priority/scores`
Retrieve the current sorted priority queue (highest score first).

**Response `200`**
```json
{
  "data": [
    {
      "delivery_point_id": "uuid",
      "score": 14.7,
      "demand_ratio": 0.024,
      "priority_multiplier": 3,
      "time_since_last_delivery": 7.5,
      "calculated_at": "2026-04-03T09:25:00Z"
    }
  ]
}
```

---

### POST `/priority/recalculate`
Trigger a full re-allocation calculation. **[Dispatcher role required]**

**Response `200`**
```json
{
  "suggestions": [
    {
      "action": "redirect",
      "truck_id": "T-42",
      "from_destination": "Point Beta",
      "to_destination": "Point Alpha",
      "reason": "Score delta: +8.2",
      "require_approval": true
    }
  ],
  "calculation_ms": 1870
}
```

> `calculation_ms` must be `< 3000` per PRD KPI.

---

## 6. WebSocket: Real-time Inventory Updates

**Endpoint**: `wss://api.logiflow.ai/ws/inventory`

**Subscribe message (client → server)**
```json
{ "type": "subscribe", "delivery_point_ids": ["uuid-1", "uuid-2"] }
```

**Update event (server → client)**
```json
{
  "type": "inventory_update",
  "delivery_point_id": "uuid-1",
  "new_stock": 12,
  "new_priority": 3,
  "timestamp": "2026-04-03T09:30:00Z"
}
```

**Priority alert event (server → client)**
```json
{
  "type": "priority_alert",
  "delivery_point_id": "uuid-1",
  "previous_priority": 1,
  "new_priority": 3,
  "message": "Immediate stockout imminent"
}
```

---

## 7. Data Models (Pydantic / TypeScript)

### TypeScript (Frontend)
```typescript
// lib/api/types.ts

export interface DeliveryPoint {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  priority: 1 | 2 | 3;
  stock_level: number;
  stock_capacity: number;
  demand_ratio: number;
  last_delivery_at: string; // ISO 8601
  score: number;
}

export interface Route {
  id: string;
  truck_id: string;
  from: string;
  to: string;
  status: 'planned' | 'in_transit' | 'redirected' | 'delivered';
  is_ghost: boolean;
  redirected_to: string | null;
  eta_minutes: number;
}

export interface PrioritySuggestion {
  action: 'redirect';
  truck_id: string;
  from_destination: string;
  to_destination: string;
  reason: string;
  require_approval: boolean;
}
```

### Python (Backend)
```python
# backend/app/shared/models.py
from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Literal

class DeliveryPointModel(BaseModel):
    id: UUID4
    name: str
    priority: Literal[1, 2, 3]
    stock_level: int
    stock_capacity: int
    demand_ratio: float
    last_delivery_at: datetime
    score: float

class RouteStatus(str):
    PLANNED   = 'planned'
    IN_TRANSIT = 'in_transit'
    REDIRECTED = 'redirected'
    DELIVERED  = 'delivered'
```
