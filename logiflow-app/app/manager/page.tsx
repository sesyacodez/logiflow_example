// Point-of-Delivery Manager view — one-tap urgent request + stock monitoring
'use client';

import { useState } from 'react';
import { AlertOctagon, TrendingDown, Clock, Package, Send, CheckCircle2, Info } from 'lucide-react';
import { cn, formatStockPercent, formatRelativeTime } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MOCK_DELIVERY_POINTS } from '@/lib/api/mock-data';
import { PRIORITY } from '@/lib/priority/constants';

// This manager is assigned to Point Alpha (critical)
const MY_POINT = MOCK_DELIVERY_POINTS[0];

type UrgentState = 'idle' | 'confirming' | 'sending' | 'sent';

export default function ManagerPage() {
  const [urgentState, setUrgentState] = useState<UrgentState>('idle');
  const [message, setMessage] = useState('');
  const [requestedQty, setRequestedQty] = useState('');

  const stockPct = formatStockPercent(MY_POINT.stock_level, MY_POINT.stock_capacity);
  const hoursLeft = Math.round(MY_POINT.stock_level / (MY_POINT.demand_ratio * MY_POINT.stock_capacity) * 6);

  const handleUrgentTrigger = () => {
    if (urgentState === 'idle') {
      setUrgentState('confirming');
      return;
    }
    if (urgentState === 'confirming') {
      setUrgentState('sending');
      // Simulate API call
      setTimeout(() => setUrgentState('sent'), 1500);
    }
  };

  return (
    <div className="px-4 py-5 max-w-lg mx-auto space-y-5">

      {/* My Delivery Point */}
      <div className={cn(
        'rounded-2xl border p-5',
        MY_POINT.priority === PRIORITY.CRITICAL
          ? 'border-red-500/30 bg-red-500/5'
          : 'border-slate-700 bg-slate-800/60'
      )}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">My Station</p>
            <h1 className="text-xl font-bold text-slate-100">{MY_POINT.name}</h1>
          </div>
          <StatusBadge priority={MY_POINT.priority} />
        </div>

        {/* Stock gauge */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Current Stock</span>
            <span className="font-bold text-2xl text-red-400">{MY_POINT.stock_level} units</span>
          </div>
          <div className="h-4 w-full rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-700"
              style={{ width: `${stockPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-slate-500">
            <span>0</span>
            <span className="text-red-400 font-medium">{stockPct}% remaining</span>
            <span>{MY_POINT.stock_capacity}</span>
          </div>
        </div>

        {/* Time estimates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-800/80 border border-slate-700/60 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Clock className="h-3.5 w-3.5" />
              Est. stockout
            </div>
            <p className="text-xl font-bold text-red-400">~{hoursLeft}h</p>
          </div>
          <div className="rounded-xl bg-slate-800/80 border border-slate-700/60 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <TrendingDown className="h-3.5 w-3.5" />
              Last delivery
            </div>
            <p className="text-lg font-bold text-slate-200">{formatRelativeTime(MY_POINT.last_delivery_at)}</p>
          </div>
        </div>
      </div>

      {/* Urgent Request section */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5">
        <h2 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-red-400" />
          Report Urgent Shortage
        </h2>

        {urgentState === 'sent' ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <p className="font-bold text-emerald-400 text-lg">Request Sent!</p>
            <p className="text-sm text-slate-400">Dispatchers have been notified. Priority upgraded to Critical.</p>
            <button
              onClick={() => setUrgentState('idle')}
              className="mt-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Send another request
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              <div>
                <label htmlFor="urgent-msg" className="text-xs text-slate-400 block mb-1.5">Message (optional)</label>
                <textarea
                  id="urgent-msg"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Describe the situation…"
                  rows={2}
                  className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-red-500/60 focus:outline-none focus:ring-1 focus:ring-red-500/40 transition-colors resize-none"
                />
              </div>
              <div>
                <label htmlFor="urgent-qty" className="text-xs text-slate-400 block mb-1.5">Requested quantity (units)</label>
                <input
                  id="urgent-qty"
                  type="number"
                  inputMode="numeric"
                  value={requestedQty}
                  onChange={e => setRequestedQty(e.target.value)}
                  placeholder="e.g. 200"
                  className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-base font-bold text-slate-100 placeholder:text-slate-600 focus:border-red-500/60 focus:outline-none transition-colors min-h-12"
                />
              </div>
            </div>

            {/* Confirmation warning */}
            {urgentState === 'confirming' && (
              <div className="mb-4 flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">
                  This will immediately escalate your delivery point to <strong>Critical priority</strong>. Dispatchers will be notified to reroute a truck.
                </p>
              </div>
            )}

            {/* The UrgentButton — one-tap, min 56×56px */}
            <button
              id="urgent-btn"
              onClick={handleUrgentTrigger}
              disabled={urgentState === 'sending'}
              className={cn(
                'w-full flex items-center justify-center gap-2.5 min-h-14 rounded-2xl font-bold text-base active:scale-95 transition-all shadow-lg',
                urgentState === 'confirming'
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                  : urgentState === 'sending'
                  ? 'bg-red-800 text-red-200 cursor-not-allowed'
                  : 'bg-red-600/20 border-2 border-red-500 text-red-400 hover:bg-red-600 hover:text-white shadow-red-900/20'
              )}
              aria-label="Report urgent shortage — escalate to critical priority"
            >
              {urgentState === 'sending' ? (
                <>
                  <div className="h-5 w-5 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                  Sending to dispatchers…
                </>
              ) : urgentState === 'confirming' ? (
                <>
                  <Send className="h-5 w-5" />
                  Confirm — Send Urgent Request
                </>
              ) : (
                <>
                  <AlertOctagon className="h-5 w-5" />
                  Report Urgent Shortage
                </>
              )}
            </button>

            {urgentState === 'idle' && (
              <p className="text-center text-xs text-slate-600 mt-2">Tap once to preview, twice to send</p>
            )}
          </>
        )}
      </div>

      {/* Nearby points with surplus */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5">
        <h2 className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2">
          <Package className="h-4 w-4 text-indigo-400" />
          Nearby Surplus Points
        </h2>
        <p className="text-xs text-slate-500 mb-3">P2P resource sharing — borrow from nearby points with surplus</p>
        {MOCK_DELIVERY_POINTS.filter(p => p.priority === PRIORITY.NORMAL && p.id !== MY_POINT.id).map(p => (
          <div key={p.id} className="flex items-center gap-3 py-3 border-b border-slate-700/40 last:border-0">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">{p.name.split(' — ')[0]}</p>
              <p className="text-xs text-slate-500">{p.stock_level} units available</p>
            </div>
            <button
              id={`borrow-${p.id}`}
              className="min-h-10 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 text-xs font-semibold text-indigo-400 hover:bg-indigo-500/20 active:scale-95 transition-all"
            >
              Request borrow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
