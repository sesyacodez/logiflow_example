// ActionList — the AI-generated re-routing suggestions panel for dispatchers
'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, Truck, Brain, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PrioritySuggestion } from '@/lib/api/types';
import { GhostLoad } from './GhostLoad';

interface ActionListProps {
  suggestions: PrioritySuggestion[];
  onApprove: (suggestion: PrioritySuggestion) => void;
  onIgnore: (suggestion: PrioritySuggestion) => void;
  isRecalculating?: boolean;
  lastCalcMs?: number;
}

function SuggestionCard({
  suggestion,
  onApprove,
  onIgnore,
}: {
  suggestion: PrioritySuggestion;
  onApprove: () => void;
  onIgnore: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <Truck className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-100 text-sm mb-0.5">
              Redirect <span className="text-indigo-400">{suggestion.truck_id}</span>
            </p>
            <p className="text-xs text-slate-400">{suggestion.reason}</p>
          </div>
        </div>

        {/* Ghost load visualization */}
        <div className="mb-3 space-y-2">
          <GhostLoad
            originalPoint={suggestion.from_destination}
            redirectedTo={suggestion.to_destination}
          />
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 flex items-center gap-2">
            <ChevronRight className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">{suggestion.to_destination}</span>
          </div>
        </div>

        {/* Action buttons — min 48×48px per WCAG 2.5.5 */}
        <div className="flex gap-2">
          <button
            id={`approve-${suggestion.truck_id}`}
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-2 min-h-12 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve
          </button>
          <button
            id={`ignore-${suggestion.truck_id}`}
            onClick={onIgnore}
            className="flex-1 flex items-center justify-center gap-2 min-h-12 rounded-lg border border-slate-600 bg-slate-700/50 px-4 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-slate-100 active:scale-95 transition-all"
          >
            <XCircle className="h-4 w-4" />
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
}

export function ActionList({
  suggestions,
  onApprove,
  onIgnore,
  isRecalculating = false,
  lastCalcMs,
}: ActionListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-slate-100">AI Action List</h2>
          {suggestions.length > 0 && (
            <span className="rounded-full bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-xs font-medium text-red-400">
              {suggestions.length} pending
            </span>
          )}
        </div>
        {lastCalcMs !== undefined && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Timer className="h-3.5 w-3.5" />
            <span className={cn(lastCalcMs < 3000 ? 'text-emerald-500' : 'text-red-400')}>
              {lastCalcMs}ms
            </span>
          </div>
        )}
      </div>

      {isRecalculating ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm">Recalculating priorities…</p>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-500">
          <CheckCircle2 className="h-10 w-10 text-emerald-500/40" />
          <p className="text-sm font-medium">All routes optimized</p>
          <p className="text-xs text-slate-600">No actions required right now</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {suggestions.map((s) => (
            <SuggestionCard
              key={s.truck_id}
              suggestion={s}
              onApprove={() => onApprove(s)}
              onIgnore={() => onIgnore(s)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
