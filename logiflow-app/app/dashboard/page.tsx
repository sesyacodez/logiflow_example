// Dispatcher Urgency Hub — the main dashboard page for LogiFlow AI
'use client';

import { useState, useCallback } from 'react';
import { RefreshCw, AlertOctagon, Truck, PackageCheck } from 'lucide-react';
import { DeliveryPointCard } from '@/components/dashboard/DeliveryPointCard';
import { DeliveryMap } from '@/components/dashboard/DeliveryMap';
import { ActionList } from '@/components/dashboard/ActionList';
import { MOCK_DELIVERY_POINTS, MOCK_SUGGESTIONS, MOCK_ROUTES } from '@/lib/api/mock-data';
import { PRIORITY } from '@/lib/priority/constants';
import type { DeliveryPoint, PrioritySuggestion } from '@/lib/api/types';

const KPI_CARDS = (points: DeliveryPoint[]) => [
  {
    id: 'kpi-critical',
    icon: AlertOctagon,
    label: 'Critical Points',
    value: points.filter(p => p.priority === PRIORITY.CRITICAL).length,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
  },
  {
    id: 'kpi-elevated',
    icon: RefreshCw,
    label: 'Elevated Points',
    value: points.filter(p => p.priority === PRIORITY.ELEVATED).length,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'kpi-trucks',
    icon: Truck,
    label: 'Trucks In-Transit',
    value: MOCK_ROUTES.filter(r => r.status === 'in_transit').length,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
  },
  {
    id: 'kpi-delivered',
    icon: PackageCheck,
    label: 'Delivered Today',
    value: MOCK_ROUTES.filter(r => r.status === 'delivered').length,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
];

export default function DashboardPage() {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [suggestions, setSuggestions] = useState<PrioritySuggestion[]>(MOCK_SUGGESTIONS);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [lastCalcMs, setLastCalcMs] = useState<number>(1870);
  const [points] = useState(MOCK_DELIVERY_POINTS);

  const prioritySorted = [...points].sort((a, b) => b.score - a.score);

  const handleRecalculate = useCallback(async () => {
    setIsRecalculating(true);
    const start = performance.now();
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 600));
    setLastCalcMs(Math.round(performance.now() - start));
    setIsRecalculating(false);
  }, []);

  const handleApprove = useCallback((suggestion: PrioritySuggestion) => {
    setSuggestions(prev => prev.filter(s => s.truck_id !== suggestion.truck_id));
  }, []);

  const handleIgnore = useCallback((suggestion: PrioritySuggestion) => {
    setSuggestions(prev => prev.filter(s => s.truck_id !== suggestion.truck_id));
  }, []);

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Urgency Hub</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time supply chain overview — prioritized by demand score</p>
        </div>
        <button
          id="recalculate-btn"
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="flex items-center gap-2 min-h-12 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
        >
          <RefreshCw className={`h-4 w-4 ${isRecalculating ? 'animate-spin' : ''}`} />
          Recalculate
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4">
        {KPI_CARDS(points).map(({ id, icon: Icon, label, value, color, bg }) => (
          <div key={id} id={id} className={`rounded-xl border p-4 ${bg}`}>
            <div className={`flex items-center gap-2 text-xs font-medium mb-2 ${color}`}>
              <Icon className="h-4 w-4" />
              {label}
            </div>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Main split layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left — Map + Delivery Point List */}
        <div className="space-y-5">
          <DeliveryMap
            points={points}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {prioritySorted.map((point) => (
              <DeliveryPointCard
                key={point.id}
                point={point}
                isSelected={selectedId === point.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </div>

        {/* Right — AI Action List */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <ActionList
            suggestions={suggestions}
            onApprove={handleApprove}
            onIgnore={handleIgnore}
            isRecalculating={isRecalculating}
            lastCalcMs={lastCalcMs}
          />
        </div>
      </div>
    </div>
  );
}
