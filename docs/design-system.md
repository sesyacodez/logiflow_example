# Design System: LogiFlow AI

> Canonical design tokens and component rules. All UI code must reference these values — never hardcode hex colors or raw pixel values.

---

## 1. Color Tokens

### Semantic Palette

| Token                  | Hex       | Tailwind Class           | Use                                    |
|------------------------|-----------|--------------------------|----------------------------------------|
| `color-critical`       | `#EF4444` | `text-red-500 bg-red-500`| Immediate stockout / critical alert    |
| `color-elevated`       | `#F59E0B` | `text-amber-500 bg-amber-500` | Stock < 6 hours / warning         |
| `color-stable`         | `#10B981` | `text-emerald-500 bg-emerald-500` | Normal operations             |
| `color-primary`        | `#6366F1` | `text-indigo-500 bg-indigo-500`   | Brand / navigation / actions  |
| `color-surface`        | `#0F172A` | `bg-slate-900`           | Page / card background (dark mode)     |
| `color-surface-raised` | `#1E293B` | `bg-slate-800`           | Elevated cards, modals                 |
| `color-border`         | `#334155` | `border-slate-700`       | Dividers, card borders                 |
| `color-text-primary`   | `#F1F5F9` | `text-slate-100`         | Primary body text                      |
| `color-text-secondary` | `#94A3B8` | `text-slate-400`         | Labels, captions, secondary info       |

### Priority → Color Mapping

```typescript
// lib/priority/constants.ts
export const PRIORITY = {
  NORMAL:   1,
  ELEVATED: 2,
  CRITICAL: 3,
} as const;

export const PRIORITY_COLOR: Record<number, string> = {
  [PRIORITY.NORMAL]:   'text-emerald-500',
  [PRIORITY.ELEVATED]: 'text-amber-500',
  [PRIORITY.CRITICAL]: 'text-red-500',
};

export const PRIORITY_BG: Record<number, string> = {
  [PRIORITY.NORMAL]:   'bg-emerald-500/10 border-emerald-500/30',
  [PRIORITY.ELEVATED]: 'bg-amber-500/10 border-amber-500/30',
  [PRIORITY.CRITICAL]: 'bg-red-500/10 border-red-500/30',
};

export const PRIORITY_LABEL: Record<number, string> = {
  [PRIORITY.NORMAL]:   'Normal',
  [PRIORITY.ELEVATED]: 'Elevated',
  [PRIORITY.CRITICAL]: 'Critical',
};

export const PRIORITY_ICON: Record<number, string> = {
  [PRIORITY.NORMAL]:   '✓',   // Replace with Lucide <CheckCircle>
  [PRIORITY.ELEVATED]: '⚠',   // Replace with Lucide <AlertTriangle>
  [PRIORITY.CRITICAL]: '🔴',  // Replace with Lucide <AlertOctagon>
};
```

> **Rule**: Never use color alone to convey status. Always pair a color class with an icon **and** a text label (e.g., `StatusBadge` component).

---

## 2. Typography

| Token             | Value              | Tailwind              | Use                      |
|-------------------|--------------------|-----------------------|--------------------------|
| `font-sans`       | Inter, Roboto, sans-serif | `font-sans`   | All UI text              |
| `text-display`    | 32px / 700 weight  | `text-3xl font-bold`  | Dashboard headings        |
| `text-title`      | 20px / 600 weight  | `text-xl font-semibold`| Card titles, section headers |
| `text-body`       | 16px / 400 weight  | `text-base`           | Body copy                |
| `text-label`      | 14px / 500 weight  | `text-sm font-medium` | Labels, badges           |
| `text-caption`    | 12px / 400 weight  | `text-xs`             | Timestamps, metadata     |
| `text-stat`       | 28px / 700 weight  | `text-2xl font-bold`  | Stock quantities, KPI numbers |

**Rule**: Quantities and priority levels must always use bold weights to aid at-a-glance reading in the warehouse environment.

---

## 3. Spacing & Sizing

| Token          | Value   | Tailwind  | Use                                   |
|----------------|---------|-----------|---------------------------------------|
| `space-xs`     | 4px     | `p-1`     | Icon gaps                             |
| `space-sm`     | 8px     | `p-2`     | Inner padding for badges              |
| `space-md`     | 16px    | `p-4`     | Standard card padding                 |
| `space-lg`     | 24px    | `p-6`     | Section padding                       |
| `space-xl`     | 32px    | `p-8`     | Page-level padding (desktop)          |
| `touch-target` | 48×48px | `min-h-12 min-w-12` | Minimum for ALL interactive elements |

> **Rule**: All buttons, toggles, and interactive elements must meet the 48×48px touch target minimum (WCAG 2.5.5).

---

## 4. Component Specifications

### `StatusBadge`
Displays a delivery point's priority status. **Must** include icon + label + color.

```tsx
// components/shared/StatusBadge.tsx
import { PRIORITY_COLOR, PRIORITY_BG, PRIORITY_LABEL } from '@/lib/priority/constants';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  priority: 1 | 2 | 3;
}

export function StatusBadge({ priority }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-medium',
        PRIORITY_BG[priority],
        PRIORITY_COLOR[priority],
      )}
    >
      <PriorityIcon priority={priority} />
      {PRIORITY_LABEL[priority]}
    </span>
  );
}
```

### `SyncIndicator`
Required on **every** screen. Shows real-time connectivity status.

```tsx
// components/shared/SyncIndicator.tsx
'use client';

type SyncStatus = 'live' | 'offline' | 'syncing';

export function SyncIndicator({ status }: { status: SyncStatus }) {
  const config = {
    live:    { dot: 'bg-emerald-500 animate-pulse', label: 'Live' },
    offline: { dot: 'bg-red-500',                  label: 'Offline' },
    syncing: { dot: 'bg-amber-500 animate-spin',   label: 'Syncing…' },
  }[status];

  return (
    <div className="flex items-center gap-2 text-sm text-slate-400">
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
}
```

### `GhostLoad` (Re-route Visualization)
When a shipment is re-routed, the original destination renders a ghost card:

```tsx
// components/dashboard/GhostLoad.tsx
export function GhostLoad({ originalPoint }: { originalPoint: string }) {
  return (
    <div className="relative rounded-lg border border-dashed border-slate-600 bg-slate-800/50 p-4 opacity-50">
      <span className="absolute -top-2 left-3 rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-400">
        Redirected
      </span>
      <p className="text-slate-500 line-through">{originalPoint}</p>
    </div>
  );
}
```

### `UrgentButton`
One-tap crisis trigger for Point-of-Delivery Managers:

```tsx
// Must always be visible in the warehouse view
// Min size: 56×56px (exceeds 48px minimum for critical action)
<button
  type="button"
  className="min-h-14 min-w-14 rounded-full bg-red-600 p-4 shadow-lg shadow-red-900/50 active:scale-95"
  aria-label="Report urgent shortage"
>
  <AlertOctagonIcon className="h-6 w-6 text-white" />
</button>
```

---

## 5. Motion & Animation

| Purpose                 | Class / Spec                          |
|-------------------------|---------------------------------------|
| Critical pulse          | `animate-pulse` on status dots        |
| Map critical markers    | CSS `@keyframes ping` (Tailwind `animate-ping`) |
| Page transition         | View Transitions API (`vercel-react-view-transitions` skill) |
| Ghost load appear       | `transition-opacity duration-300`     |
| Button press feedback   | `active:scale-95 transition-transform`|

---

## 6. Dark Mode Rules

- Dark mode is the **only** mode. Do not implement a light/dark toggle.
- Base background: `bg-slate-900` (`#0F172A`)
- Raised surfaces: `bg-slate-800` (`#1E293B`)
- Never use `white` or `black` directly — use slate scale tokens.
- Icon strokes should be `text-slate-300` on dark surfaces for readability.

---

## 7. Responsive Breakpoints

| Breakpoint | Width   | Primary User              |
|------------|---------|---------------------------|
| `default`  | < 640px | Warehouse mobile view     |
| `sm:`      | 640px+  | Tablet (warehouse/manager)|
| `md:`      | 768px+  | Hybrid / transition       |
| `lg:`      | 1024px+ | Dispatcher desktop view   |
| `xl:`      | 1280px+ | Widescreen dispatcher     |

Build mobile-first: default styles target warehouse mobile, `lg:` overrides for dispatcher desktop.
