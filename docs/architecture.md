# Architecture: LogiFlow AI

> Technical architecture for the dynamic logistics optimization system.

---

## 1. System Overview

LogiFlow AI is a three-tier system consisting of:

1. **Frontend** — Next.js 14 PWA (Dispatcher desktop + Warehouse mobile)
2. **Backend API** — FastAPI (Python 3.11+) serving REST + WebSocket endpoints
3. **Data Layer** — PostgreSQL (persistent records) + Redis (real-time priority queues)

```
┌─────────────────────────────────────┐
│            CLIENTS                  │
│  ┌─────────────┐  ┌─────────────┐  │
│  │  Dispatcher │  │  Warehouse  │  │
│  │  (Desktop)  │  │  (Mobile)   │  │
│  └──────┬──────┘  └──────┬──────┘  │
└─────────┼────────────────┼─────────┘
          │  HTTPS / WSS   │
┌─────────▼────────────────▼─────────┐
│         Next.js App (Vercel)        │
│  App Router │ API Routes (Proxy)    │
│  Service Worker (PWA / Offline)     │
└─────────────────┬───────────────────┘
                  │  HTTP / REST
┌─────────────────▼───────────────────┐
│           FastAPI Backend            │
│  /auth  /inventory  /routes          │
│  /priority  /websocket               │
└──────┬──────────────┬────────────────┘
       │              │
┌──────▼──────┐  ┌────▼──────┐
│ PostgreSQL  │  │   Redis   │
│  (persist)  │  │ (queues)  │
└─────────────┘  └───────────┘
```

---

## 2. Frontend Architecture

### Framework
- **Next.js 14** with App Router and React Server Components.
- Routes are grouped by user role using route groups:
  - `app/(dispatcher)/` — Desktop dispatcher views (Urgency Hub, Route Map)
  - `app/(warehouse)/` — Mobile warehouse views (Fast-Scan, Confirm Load)

### State Management
- **Server state**: React Query (SWR) for inventory, delivery points, routes.
- **Local/offline state**: Zustand store + IndexedDB for offline-first queue.
- **Real-time updates**: WebSocket connection via a custom `useWebSocket` hook.

### PWA / Offline
- Service Worker (`public/sw.js`) intercepts network requests and caches critical API responses in IndexedDB.
- Offline mutations (load confirmations, shortage reports) are queued and synced on reconnect.
- A global `SyncIndicator` component shows `Live` / `Offline` / `Syncing` status on every screen.

### Key Component Tree
```
app/
  (dispatcher)/
    dashboard/page.tsx     ← Urgency Hub: Map + Action List
    route/[id]/page.tsx    ← Route detail with Ghost Load pattern
  (warehouse)/
    scanner/page.tsx       ← Fast-Scan interface with camera viewport
    confirm/page.tsx       ← Confirm loading / report shortage
  layout.tsx               ← Root layout: SyncIndicator, AuthGuard
  api/
    inventory/route.ts     ← Proxy to FastAPI /inventory
    priority/route.ts      ← Proxy to FastAPI /priority
    auth/route.ts          ← JWT exchange
```

---

## 3. Backend Architecture

### Framework
**FastAPI** (Python 3.11+) with async handlers throughout.

### Feature-First Organization
```
backend/app/
  auth/        ← JWT issue, verify, refresh
  inventory/   ← CRUD for delivery points and stock levels
  routes/      ← Logistics route management & re-routing
  priority/    ← Scoring engine (DemandRatio × PriorityMultiplier + Time)
  websocket/   ← Real-time push for inventory changes & alerts
  shared/      ← Pydantic models, DB session, middleware
```

### Priority Scoring Engine (`backend/app/priority/`)

```python
# priority/scorer.py
from pydantic import BaseModel

class ScoringInput(BaseModel):
    demand_ratio: float
    priority_multiplier: int   # 1 | 2 | 3
    time_since_last_delivery: float  # hours

def calculate_score(data: ScoringInput) -> float:
    """Score = (DemandRatio × PriorityMultiplier) + TimeSinceLastDelivery"""
    return (data.demand_ratio * data.priority_multiplier) + data.time_since_last_delivery
```

### Real-time WebSocket
- Endpoint: `wss://api.logiflow.ai/ws/inventory`
- Pushes inventory change events to all connected clients within 500ms.
- Clients subscribe per delivery-point ID.

---

## 4. Data Layer

### PostgreSQL Schema (key tables)

| Table              | Purpose                                  |
|--------------------|------------------------------------------|
| `users`            | Auth: id, role, hashed_password          |
| `delivery_points`  | All distribution nodes with coordinates  |
| `inventory`        | Current stock per delivery point         |
| `routes`           | Delivery assignments & truck assignments |
| `priority_events`  | Audit log of priority changes            |
| `realloc_requests` | Dispatcher-approved re-allocation actions|

### Redis Usage
- **Priority queue**: Sorted set `priority:queue` — delivery point IDs scored by the scoring algorithm; polled every 10s by the re-calculation engine.
- **Session cache**: JWT refresh token storage (TTL = 7 days).
- **Pub/Sub**: Channel `inventory:updates` → WebSocket relay.

---

## 5. Authentication Flow

```
Client          Next.js API         FastAPI         PostgreSQL
  │──── POST /api/auth ────►│                             │
  │                          │──── POST /auth/login ──►│  │
  │                          │                         │──►│
  │                          │◄── {access, refresh} ───│  │
  │◄── Set HttpOnly cookie ──│                             │
  │                          │                             │
  │──── Authenticated req ──►│ (reads cookie)              │
  │                          │──── Bearer {access} ───────►│
```

- `access_token`: 15-minute expiry, sent as `Authorization: Bearer`.
- `refresh_token`: 7-day expiry, stored in `HttpOnly` cookie.
- All state-modifying routes require JWT middleware. Read-only routes are public for dashboard previews.

---

## 6. Deployment

| Service    | Platform            | Notes                          |
|------------|---------------------|--------------------------------|
| Frontend   | Vercel              | Edge Network, automatic CI/CD  |
| Backend    | Railway or Fly.io   | Dockerized FastAPI              |
| Database   | Railway PostgreSQL  | Managed instance               |
| Redis      | Redis Cloud (free tier) | Or Railway Redis           |

### Environment Variables

**Frontend (`.env.local`)**
```
NEXT_PUBLIC_API_URL=https://api.logiflow.ai
NEXT_PUBLIC_WS_URL=wss://api.logiflow.ai/ws
NEXTAUTH_SECRET=<secret>
```

**Backend (`.env`)**
```
DATABASE_URL=postgresql://user:pass@host/db
REDIS_URL=redis://...
JWT_SECRET=<secret>
JWT_ALGORITHM=HS256
ALLOWED_ORIGINS=https://logiflow.vercel.app
```

---

## 7. Performance Architecture

| Target                   | Mechanism                                             |
|--------------------------|-------------------------------------------------------|
| Re-calc < 3s             | Redis sorted-set pre-scoring; incremental updates     |
| FCP < 1.5s on 4G         | RSC streaming; `next/dynamic` for map component       |
| Zero data loss offline   | IndexedDB mutation queue + idempotent sync            |
| ≥90% critical fulfillment| Priority queue ensures CRITICAL events rise to top   |
