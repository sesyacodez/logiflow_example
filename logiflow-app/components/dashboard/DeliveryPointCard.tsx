// DeliveryPointCard — shows stock level, priority, and quick-action button
'use client';

import { Clock, Package, TrendingDown } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn, formatRelativeTime, formatStockPercent } from '@/lib/utils';
import { PRIORITY } from '@/lib/priority/constants';
import type { DeliveryPoint } from '@/lib/api/types';

interface DeliveryPointCardProps {
  point: DeliveryPoint;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

function StockBar({ level, capacity, priority }: { level: number; capacity: number; priority: 1 | 2 | 3 }) {
  const pct = formatStockPercent(level, capacity);
  const barColor =
    priority === PRIORITY.CRITICAL ? 'bg-red-500' :
    priority === PRIORITY.ELEVATED ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{level.toLocaleString()} units</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-700/60 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function DeliveryPointCard({ point, onSelect, isSelected }: DeliveryPointCardProps) {
  const isCritical = point.priority === PRIORITY.CRITICAL;

  return (
    <button
      id={`dp-card-${point.id}`}
      onClick={() => onSelect?.(point.id)}
      className={cn(
        'w-full text-left rounded-xl border p-4 transition-all duration-200',
        'hover:border-indigo-500/50 hover:bg-slate-800/70',
        isSelected
          ? 'border-indigo-500/70 bg-slate-800/80 shadow-lg shadow-indigo-500/10'
          : 'border-slate-700/60 bg-slate-800/40',
        isCritical && !isSelected && 'border-red-500/30 bg-red-500/5'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {isCritical && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
            )}
            <h3 className="font-semibold text-slate-100 text-sm truncate">{point.name}</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(point.last_delivery_at)}
          </div>
        </div>
        <StatusBadge priority={point.priority} />
      </div>

      <StockBar level={point.stock_level} capacity={point.stock_capacity} priority={point.priority} />

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <TrendingDown className="h-3.5 w-3.5" />
          <span>Demand ratio: <strong className="text-slate-300">{(point.demand_ratio * 100).toFixed(1)}%</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <Package className="h-3.5 w-3.5" />
          <span>Score: <strong className="text-slate-300">{point.score.toFixed(1)}</strong></span>
        </div>
      </div>
    </button>
  );
}
