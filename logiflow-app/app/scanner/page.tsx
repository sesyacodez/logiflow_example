// Warehouse Fast-Scan interface — mobile-first, high-contrast, large touch targets
'use client';

import { useState } from 'react';
import { ScanLine, CheckCircle2, AlertTriangle, Package, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MOCK_DELIVERY_POINTS } from '@/lib/api/mock-data';

type ScanState = 'idle' | 'scanning' | 'success' | 'error';

const QUICK_POINTS = MOCK_DELIVERY_POINTS.slice(0, 4);

export default function ScannerPage() {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scannedId, setScannedId] = useState<string>('');
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [quantity, setQuantity] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const simulateScan = () => {
    if (scanState === 'scanning') return;
    setScanState('scanning');
    setTimeout(() => {
      const id = `QR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      setScannedId(id);
      setScanState('success');
    }, 1500);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setScanState('idle');
      setScannedId('');
      setSelectedPoint(null);
      setQuantity('');
      setConfirmStep(false);
    }, 2000);
  };

  return (
    <div className="px-4 py-5 max-w-lg mx-auto space-y-5">
      {/* Scanner viewport */}
      <div
        id="scan-viewport"
        onClick={simulateScan}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-2xl border-2 overflow-hidden cursor-pointer',
          'transition-all duration-300 min-h-[220px]',
          scanState === 'idle' && 'border-slate-600 bg-slate-800/60 hover:border-indigo-500/60 hover:bg-slate-800',
          scanState === 'scanning' && 'border-indigo-500 bg-indigo-500/5',
          scanState === 'success' && 'border-emerald-500 bg-emerald-500/5',
          scanState === 'error' && 'border-red-500 bg-red-500/5',
        )}
      >
        {/* Scan line animation */}
        {scanState === 'scanning' && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-bounce" style={{ top: '50%' }} />
            <div className="absolute inset-0 bg-indigo-500/5" />
          </div>
        )}

        {/* Corner brackets */}
        <div className="absolute inset-6 pointer-events-none">
          {[['top-0 left-0', 'border-t-2 border-l-2'],
            ['top-0 right-0', 'border-t-2 border-r-2'],
            ['bottom-0 left-0', 'border-b-2 border-l-2'],
            ['bottom-0 right-0', 'border-b-2 border-r-2']].map(([pos, border], i) => (
            <div
              key={i}
              className={cn(
                'absolute h-6 w-6',
                pos,
                border,
                scanState === 'success' ? 'border-emerald-500' : 'border-indigo-400'
              )}
            />
          ))}
        </div>

        {confirmed ? (
          <div className="flex flex-col items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-14 w-14" />
            <span className="text-lg font-bold">Load Confirmed!</span>
          </div>
        ) : scanState === 'success' ? (
          <div className="flex flex-col items-center gap-1.5 text-center px-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-1" />
            <p className="font-bold text-emerald-400 text-lg">Scan Successful</p>
            <p className="font-mono text-sm text-slate-300 bg-slate-700 rounded px-3 py-1">{scannedId}</p>
            <p className="text-xs text-slate-500 mt-1">Tap again to scan another</p>
          </div>
        ) : scanState === 'scanning' ? (
          <div className="flex flex-col items-center gap-2 text-indigo-400">
            <ScanLine className="h-12 w-12 animate-pulse" />
            <p className="text-sm font-medium">Scanning…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <ScanLine className="h-12 w-12" />
            <p className="text-sm font-medium">Tap to simulate scan</p>
            <p className="text-xs text-slate-600">QR code / Barcode reader</p>
          </div>
        )}
      </div>

      {/* Delivery Point Selector */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Select Delivery Point</h2>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_POINTS.map((p) => (
            <button
              key={p.id}
              id={`select-point-${p.id}`}
              onClick={() => setSelectedPoint(p.id)}
              className={cn(
                'text-left rounded-xl border p-3 min-h-[72px] transition-all active:scale-95',
                selectedPoint === p.id
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-700 bg-slate-800/60 hover:border-slate-600'
              )}
            >
              <p className="text-xs font-semibold text-slate-200 mb-1 leading-tight">{p.name.split(' — ')[0]}</p>
              <StatusBadge priority={p.priority} className="text-xs" />
            </button>
          ))}
        </div>
      </div>

      {/* Quantity input */}
      {selectedPoint && (
        <div>
          <label htmlFor="qty-input" className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
            Quantity (units)
          </label>
          <input
            id="qty-input"
            type="number"
            inputMode="numeric"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            placeholder="Enter quantity loaded"
            className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-lg font-bold text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors min-h-12"
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pb-4">
        <button
          id="confirm-loading-btn"
          onClick={handleConfirm}
          disabled={!selectedPoint || !quantity || confirmed}
          className="flex-1 flex items-center justify-center gap-2 min-h-14 rounded-2xl bg-emerald-600 text-white font-bold text-base hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shadow-lg shadow-emerald-900/40"
        >
          <Package className="h-5 w-5" />
          Confirm Loading
        </button>
        <button
          id="report-shortage-btn"
          className="flex items-center justify-center gap-2 min-h-14 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 text-red-400 font-semibold hover:bg-red-500/20 active:scale-95 transition-all"
        >
          <AlertTriangle className="h-5 w-5" />
          <span className="text-sm">Shortage</span>
        </button>
      </div>

      {/* Pending queue indicator */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
          <Zap className="h-4 w-4 text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-400">3 scans queued locally</p>
          <p className="text-xs text-slate-500">Will sync when connection is restored</p>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-500 ml-auto" />
      </div>
    </div>
  );
}
