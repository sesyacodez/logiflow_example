// GhostLoad — visualizes a re-routed shipment at original destination
import { GitBranch } from 'lucide-react';

interface GhostLoadProps {
  originalPoint: string;
  redirectedTo?: string;
}

export function GhostLoad({ originalPoint, redirectedTo }: GhostLoadProps) {
  return (
    <div className="relative rounded-lg border border-dashed border-slate-600 bg-slate-800/50 p-4 transition-opacity duration-300 opacity-60">
      <span className="absolute -top-2.5 left-3 flex items-center gap-1 rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-400 border border-slate-600">
        <GitBranch className="h-3 w-3" />
        Redirected
      </span>
      <p className="text-slate-500 line-through text-sm mt-1">{originalPoint}</p>
      {redirectedTo && (
        <p className="text-indigo-400 text-xs mt-1 flex items-center gap-1">
          → {redirectedTo}
        </p>
      )}
    </div>
  );
}
