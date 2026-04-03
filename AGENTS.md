# AGENTS.md — LogiFlow AI

This file provides instructions for any AI coding agent (Antigravity, Copilot, Claude, Cursor, etc.) working on the **LogiFlow AI** project. Read this file **before** making any changes.

---

## 1. Project Overview

**LogiFlow AI** is a dynamic logistics optimization system enabling real-time resource reallocation across supply chain delivery points. It targets three user roles: Logistics Dispatchers (desktop), Warehouse Operators (mobile/tablet), and Point-of-Delivery Managers (mobile).

Key documents:
- [`docs/PRD.md`](docs/PRD.md) — Product requirements
- [`docs/design-brief.md`](docs/design-brief.md) — Visual & UX specification
- [`docs/architecture.md`](docs/architecture.md) — Technical architecture
- [`docs/design-system.md`](docs/design-system.md) — Design tokens & component rules
- [`docs/api-contracts.md`](docs/api-contracts.md) — API structure & data models

---

## 2. Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | Next.js 14+ (App Router), React 18+, Tailwind CSS |
| Backend    | FastAPI (Python 3.11+) **or** Node.js + Express |
| Database   | PostgreSQL (persistent) + Redis (priority queues) |
| Auth       | JWT (access + refresh tokens), HTTPS only       |
| PWA        | Service Workers for offline-first support       |
| Deployment | Vercel (frontend) + Railway/Fly.io (backend)    |

---

## 3. Coding Standards

### General
- Write **TypeScript** for all frontend code. No `any` types unless truly unavoidable.
- Use **ES2022+** features. Async/await over promise chains.
- Keep functions small and single-purpose. Max 50 lines per function.
- All files must have a header comment with a one-line description.

### React / Next.js
Follow the `vercel-react-best-practices` skill. Key rules enforced in this project:

1. **No waterfalls** — use `Promise.all()` for independent data fetches (`async-parallel`)
2. **Dynamic imports** — use `next/dynamic` for heavy components like maps (`bundle-dynamic-imports`)
3. **No inline components** — never define a component inside another component (`rerender-no-inline-components`)
4. **Memoize wisely** — wrap expensive computations in `useMemo`; avoid over-memoizing primitives (`rerender-memo`)
5. **Server Components first** — fetch data in Server Components; push interactivity to Client Components at the leaves
6. **Suspense boundaries** — wrap async data regions in `<Suspense>` with meaningful skeletons (`async-suspense-boundaries`)
7. **Passive scroll listeners** — always use `{ passive: true }` on scroll/touch events (`client-passive-event-listeners`)

### Python (Backend)
- Use **Pydantic v2** for all data models and validation.
- Use **async** route handlers in FastAPI everywhere.
- Use **type hints** on all functions.
- Organize by feature, not by layer: `app/inventory/`, `app/routes/`, `app/auth/`.

### CSS / Tailwind
- **Dark Mode first** — all components default to dark theme.
- Use the semantic color tokens defined in `docs/design-system.md`. Never hardcode hex values.
- Mobile breakpoints first: `sm:`, `md:`, `lg:`.
- Use `clsx` or `tailwind-merge` to compose class names conditionally — no template literals.

---

## 4. Priority System Rules

The tri-level priority system is CORE logic. Treat these values as constants, never magic strings:

```typescript
export const PRIORITY = {
  NORMAL:   1,  // Green  — #10B981 — Routine replenishment
  ELEVATED: 2,  // Amber  — #F59E0B — Stock out < 6 hours
  CRITICAL: 3,  // Red    — #EF4444 — Immediate stockout
} as const;
```

The scoring algorithm (from the PRD) must be implemented exactly as:
```
Score = (DemandRatio × PriorityMultiplier) + TimeSinceLastDelivery
```

Never apply re-routing suggestions to `PRIORITY.NORMAL` nodes without dispatcher approval.

---

## 5. Security Rules

- **Never** commit secrets, API keys, or JWT secrets. Use `.env.local` (frontend) and `.env` (backend).
- All API routes that modify state require JWT authentication middleware.
- Payloads containing resource quantities must be encrypted at rest in the DB.
- Sanitize all user inputs on both client and server.

---

## 6. UX Rules (from design-brief.md)

- **Three-Tap Rule**: Any critical action must be reachable in ≤ 3 taps/clicks.
- **Touch Targets**: Minimum 48×48px for all interactive elements (WCAG 2.5.5).
- **Color-only is forbidden**: Never use color as the ONLY indicator of status. Always pair with an icon or text label.
- **Offline Indicator**: Every screen must show a `Live` / `Offline` sync indicator.
- **Ghost Load Pattern**: When a shipment is re-routed, show a ghost icon at the original destination and a "Redirected" badge at the new destination.

---

## 7. Performance Targets

From the PRD KPIs — these must not be regressed:

| Metric                       | Target             |
|------------------------------|--------------------|
| Re-allocation calculation    | < 3 seconds        |
| First Contentful Paint       | < 1.5s on 4G       |
| Offline→Online data sync     | Zero data loss      |
| Critical request fulfillment | ≥ 90% within 2h   |

---

## 8. File Structure

```
logiflow/
├── app/                    # Next.js App Router pages & layouts
│   ├── (dispatcher)/       # Desktop dispatcher views
│   ├── (warehouse)/        # Mobile warehouse views
│   └── api/                # Next.js API routes (thin proxy to backend)
├── components/
│   ├── ui/                 # Primitive UI components (Button, Badge, Card)
│   ├── dashboard/          # Dispatcher-specific components
│   ├── scanner/            # Warehouse scanner components
│   └── shared/             # Cross-role components (StatusBadge, SyncIndicator)
├── lib/
│   ├── api/                # API client functions
│   ├── hooks/              # Custom React hooks
│   ├── priority/           # Priority scoring algorithm
│   └── offline/            # Service Worker & IndexedDB helpers
├── public/
│   └── sw.js               # Service Worker entry point
├── backend/                # FastAPI backend (or Node.js)
│   ├── app/
│   │   ├── auth/
│   │   ├── inventory/
│   │   ├── routes/         # Logistics route management
│   │   └── priority/       # Scoring engine
│   └── tests/
├── docs/                   # All project documentation
└── .agents/                # Agent skills and workflows
```

---

## 9. Workflows

Use the pre-defined agent workflows for common tasks:

| Task              | Workflow File                              |
|-------------------|--------------------------------------------|
| First-time setup  | `.agents/workflows/dev-setup.md`           |
| Deploy to Vercel  | `.agents/workflows/deploy.md`              |
| Add a new feature | `.agents/workflows/add-feature.md`         |

---

## 10. Skills Available

The following agent skills are installed and should be applied automatically:

| Skill                         | When to Use                                      |
|-------------------------------|--------------------------------------------------|
| `vercel-react-best-practices` | Writing any React/Next.js component or page      |
| `vercel-composition-patterns` | Building reusable/compound components            |
| `vercel-react-view-transitions`| Adding page/route animations                    |
| `web-design-guidelines`       | Reviewing UI for accessibility & UX compliance   |
| `deploy-to-vercel`            | Deploying the frontend                           |
| `vercel-cli-with-tokens`      | CI/CD or token-based Vercel deployments          |
