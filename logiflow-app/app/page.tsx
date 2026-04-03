// Landing page — role selection for LogiFlow AI
import Link from 'next/link';
import { LayoutDashboard, ScanLine, MapPin, ArrowRight, Zap, Shield, Wifi } from 'lucide-react';

const ROLES = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    title: 'Dispatcher Hub',
    subtitle: 'Fleet Dispatcher',
    description: 'Bird\'s-eye view of all delivery points, AI routing suggestions, and real-time priority alerts.',
    color: 'from-indigo-500/20 to-purple-500/20',
    border: 'border-indigo-500/30 hover:border-indigo-400/60',
    iconColor: 'text-indigo-400',
    badge: 'Desktop',
  },
  {
    href: '/scanner',
    icon: ScanLine,
    title: 'Fast-Scan',
    subtitle: 'Warehouse Operator',
    description: 'High-contrast scanner interface with large touch targets for QR load confirmations.',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    iconColor: 'text-emerald-400',
    badge: 'Mobile',
  },
  {
    href: '/manager',
    icon: MapPin,
    title: 'Delivery Manager',
    subtitle: 'Point-of-Delivery Manager',
    description: 'One-tap urgent shortage reporting and real-time stock level tracking at your delivery point.',
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30 hover:border-amber-400/60',
    iconColor: 'text-amber-400',
    badge: 'Mobile',
  },
];

const FEATURES = [
  { icon: Zap, label: 'Re-allocation in < 3s', desc: 'AI scores recalculated live' },
  { icon: Shield, label: 'JWT-secured payloads', desc: 'Encrypted at rest' },
  { icon: Wifi,  label: 'Offline-first PWA', desc: 'Zero data loss on reconnect' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900 flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 text-center lg:pt-32 lg:pb-24">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-purple-600/8 blur-3xl" />
          <div className="absolute top-32 right-1/4 h-48 w-48 rounded-full bg-amber-500/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          {/* Logo mark */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/40">
            <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 40 40" stroke="currentColor" strokeWidth={2}>
              <circle cx="8" cy="20" r="4" fill="currentColor" opacity="0.9" />
              <circle cx="32" cy="8" r="4" fill="currentColor" opacity="0.9" />
              <circle cx="32" cy="32" r="4" fill="currentColor" opacity="0.9" />
              <line x1="12" y1="18" x2="28" y2="10" strokeLinecap="round" />
              <line x1="12" y1="22" x2="28" y2="30" strokeLinecap="round" />
              <line x1="28" y1="10" x2="28" y2="30" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl lg:text-6xl">
            <span className="gradient-text">LogiFlow AI</span>
          </h1>
          <p className="mt-3 text-lg font-medium text-indigo-400 tracking-wide uppercase text-sm">
            Dynamic Logistics Optimization System
          </p>
          <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            Real-time resource reallocation across your supply chain. 
            AI-driven priority scoring ensures critical needs are always met first.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm">
                <Icon className="h-4 w-4 text-indigo-400" />
                <span className="font-medium text-slate-200">{label}</span>
                <span className="text-slate-500 hidden sm:inline">— {desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="flex-1 px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-slate-500 mb-8">
            Select your role to continue
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {ROLES.map(({ href, icon: Icon, title, subtitle, description, color, border, iconColor, badge }) => (
              <Link
                key={href}
                href={href}
                id={`role-${href.replace('/', '')}`}
                className={`group relative flex flex-col rounded-2xl border bg-gradient-to-br ${color} ${border} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20`}
              >
                {/* Badge */}
                <span className="absolute top-4 right-4 rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                  {badge}
                </span>

                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700`}>
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{subtitle}</p>
                <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-400 flex-1 leading-relaxed">{description}</p>

                <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  Open view
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-600">
        LogiFlow AI — Hackathon Demo • All data is simulated
      </footer>
    </main>
  );
}
