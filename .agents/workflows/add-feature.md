---
description: Add a new feature to LogiFlow AI following project conventions
---

# Add Feature Workflow

Structured process for adding any new feature to LogiFlow AI — from scoping to implementation to verification.

---

## Step 1: Understand the Feature

Before writing any code:

1. Read `docs/PRD.md` to confirm the feature aligns with product requirements.
2. Read `docs/design-brief.md` to understand UX constraints (Three-Tap Rule, touch targets, etc.).
3. Read `docs/design-system.md` to identify which color tokens and components to reuse.
4. Read `docs/api-contracts.md` to check if a backend endpoint already exists or needs to be added.
5. Read `AGENTS.md` for coding standards and priority system rules.

---

## Step 2: Identify the Scope

Determine which layers are affected:

| Layer                    | Changed? | Files to touch                            |
|--------------------------|----------|-------------------------------------------|
| UI Component             | Yes/No   | `components/ui/` or `components/shared/`  |
| Page / Route             | Yes/No   | `app/(dispatcher)/` or `app/(warehouse)/` |
| API Route (proxy)        | Yes/No   | `app/api/`                                |
| Custom Hook              | Yes/No   | `lib/hooks/`                              |
| Priority Logic           | Yes/No   | `lib/priority/`                           |
| Offline Support          | Yes/No   | `lib/offline/`, `public/sw.js`            |
| Backend Endpoint         | Yes/No   | `backend/app/<feature>/`                  |
| DB Migration             | Yes/No   | `backend/alembic/versions/`               |

---

## Step 3: Apply Skills

Before writing code, read the relevant skills:

- **Any React/Next.js component**: `.agents/skills/vercel-react-best-practices/SKILL.md`
- **New compound component**: `.agents/skills/vercel-composition-patterns/SKILL.md`
- **Page transitions/animations**: `.agents/skills/vercel-react-view-transitions/SKILL.md`
- **UX review**: `.agents/skills/web-design-guidelines/SKILL.md`

---

## Step 4: Implement — Frontend

### 4a. Create/update components
- Follow `docs/design-system.md` for tokens and component specs.
- Use `clsx` / `tailwind-merge` for conditional classes. No template literals.
- No inline components (enforce `rerender-no-inline-components`).
- Add `'use client'` directive only when the component needs interactivity.

### 4b. Create/update pages
- Fetch data in a **Server Component** where possible.
- Wrap async regions in `<Suspense fallback={<Skeleton />}>`.
- Use `next/dynamic` for heavy components (maps, charts).

### 4c. Offline support (if applicable)
- Add the new API route to the Service Worker cache list in `public/sw.js`.
- Queue offline mutations in `lib/offline/mutation-queue.ts`.

---

## Step 5: Implement — Backend (if required)

1. Create a new feature folder: `backend/app/<feature>/`
   - `router.py` — FastAPI router with async handlers
   - `models.py` — Pydantic v2 models
   - `service.py` — Business logic
   - `repository.py` — DB queries

2. Register the router in `backend/app/main.py`:
   ```python
   from app.<feature>.router import router as feature_router
   app.include_router(feature_router, prefix="/<feature>", tags=["<Feature>"])
   ```

3. Add a DB migration if schema changes:
   ```bash
   alembic revision --autogenerate -m "add <feature> tables"
   alembic upgrade head
   ```

4. Update `docs/api-contracts.md` with the new endpoint.

---

## Step 6: UX Verification Checklist

Before declaring the feature done, verify:

- [ ] All interactive elements ≥ 48×48px
- [ ] Status is communicated with icon + color + label (never color alone)
- [ ] Critical action reachable in ≤ 3 taps/clicks
- [ ] `SyncIndicator` still visible on all affected screens
- [ ] Mobile-first layout correct at 360px width (default breakpoint)
- [ ] Dark mode renders correctly on all new elements
- [ ] Ghost Load pattern rendered for any re-routing changes

---

## Step 7: Run Verification

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Run frontend dev build (catch build errors)
npm run build

# Run backend tests
cd backend && pytest
```

Fix all type and lint errors before committing.

---

## Step 8: Update Documentation

- Update `docs/api-contracts.md` if a new endpoint was added.
- Update `AGENTS.md` section 8 (File Structure) if new directories were created.
- If a new shared component was created, document it in `docs/design-system.md`.
