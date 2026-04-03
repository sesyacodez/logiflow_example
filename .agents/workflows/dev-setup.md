---
description: First-time development environment setup for LogiFlow AI
---

# Dev Setup Workflow

Sets up the full LogiFlow AI development environment — frontend (Next.js) and backend (FastAPI).

// turbo-all

## Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker Desktop (for PostgreSQL + Redis)
- Git

---

## Step 1: Clone & Install Frontend Dependencies

```bash
cd logiflow
npm install
```

## Step 2: Configure Frontend Environment

Copy the environment template and fill in values:

```bash
copy .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXTAUTH_SECRET=dev-secret-change-in-production
```

## Step 3: Start Local Database Services (Docker)

```bash
docker compose up -d postgres redis
```

This starts:
- PostgreSQL on port `5432` (database: `logiflow`)
- Redis on port `6379`

## Step 4: Install Backend Dependencies

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Step 5: Configure Backend Environment

```bash
copy .env.example .env
```

Edit `backend/.env`:
```
DATABASE_URL=postgresql://logiflow:logiflow@localhost:5432/logiflow
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-jwt-secret-change-in-production
JWT_ALGORITHM=HS256
ALLOWED_ORIGINS=http://localhost:3000
```

## Step 6: Run Database Migrations

```bash
cd backend
alembic upgrade head
```

## Step 7: Seed Development Data (optional)

```bash
cd backend
python scripts/seed_data.py
```

## Step 8: Start Backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Backend API docs available at: http://localhost:8000/docs

## Step 9: Start Frontend

In a new terminal:

```bash
cd logiflow
npm run dev
```

App available at: http://localhost:3000

---

## Verify Setup

- Dispatcher view: http://localhost:3000/dashboard
- Warehouse view: http://localhost:3000/scanner
- API health check: http://localhost:8000/health
- WebSocket test: connect to `ws://localhost:8000/ws/inventory`
