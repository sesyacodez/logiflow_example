// Utility helpers for LogiFlow AI

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  const diffH = Math.floor(diffMs / 3_600_000);
  const diffM = Math.floor((diffMs % 3_600_000) / 60_000);
  if (diffH > 0) return `${diffH}h ${diffM}m ago`;
  if (diffM > 0) return `${diffM}m ago`;
  return 'just now';
}

export function formatStockPercent(level: number, capacity: number): number {
  if (capacity === 0) return 0;
  return Math.round((level / capacity) * 100);
}
