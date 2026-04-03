// SyncIndicator — shows Live/Offline/Syncing status; required on every screen
'use client';

import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SyncStatus } from '@/lib/api/types';

const CONFIG: Record<SyncStatus, { dot: string; label: string; icon: React.ReactNode }> = {
  live:    { dot: 'bg-emerald-500 animate-pulse', label: 'Live',     icon: <Wifi className="h-3.5 w-3.5 text-emerald-500" /> },
  offline: { dot: 'bg-red-500',                  label: 'Offline',  icon: <WifiOff className="h-3.5 w-3.5 text-red-500" /> },
  syncing: { dot: 'bg-amber-500',                label: 'Syncing…', icon: <RefreshCw className="h-3.5 w-3.5 text-amber-500 animate-spin" /> },
};

interface SyncIndicatorProps {
  status: SyncStatus;
  className?: string;
}

export function SyncIndicator({ status, className }: SyncIndicatorProps) {
  const config = CONFIG[status];
  return (
    <div className={cn('flex items-center gap-1.5 text-xs text-slate-400', className)}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}
