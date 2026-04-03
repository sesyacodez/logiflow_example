// Priority system constants and color mappings for LogiFlow AI

export const PRIORITY = {
  NORMAL:   1,
  ELEVATED: 2,
  CRITICAL: 3,
} as const;

export type PriorityLevel = typeof PRIORITY[keyof typeof PRIORITY];

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

export const PRIORITY_MULTIPLIER: Record<number, number> = {
  [PRIORITY.NORMAL]:   1,
  [PRIORITY.ELEVATED]: 2,
  [PRIORITY.CRITICAL]: 3,
};
