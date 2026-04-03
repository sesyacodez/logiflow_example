// Manager view layout
import { SyncIndicator } from '@/components/shared/SyncIndicator';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              id="manager-back-btn"
              className="flex items-center justify-center h-10 w-10 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-slate-400" />
            </Link>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-400" />
              <span className="font-semibold text-slate-100">Delivery Manager</span>
            </div>
          </div>
          <SyncIndicator status="live" />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
