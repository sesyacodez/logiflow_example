// Dispatcher dashboard layout with shared nav
import Link from 'next/link';
import { SyncIndicator } from '@/components/shared/SyncIndicator';
import { LayoutDashboard, ScanLine, MapPin, Activity } from 'lucide-react';

const NAV_LINKS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Urgency Hub' },
  { href: '/scanner',   icon: ScanLine,        label: 'Scanner' },
  { href: '/manager',   icon: MapPin,           label: 'Manager' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Top nav bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-slate-100 hidden sm:block">LogiFlow <span className="text-indigo-400">AI</span></span>
            </Link>
            <span className="ml-2 hidden h-5 w-px bg-slate-700 lg:block" />
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <SyncIndicator status="live" />
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
