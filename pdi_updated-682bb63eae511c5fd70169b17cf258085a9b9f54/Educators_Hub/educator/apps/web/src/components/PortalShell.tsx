import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { TabConfig } from '@ekya/config';

const roleGradients: Record<string, string> = {
  teacher: 'from-emerald-600 via-teal-600 to-cyan-500',
  hos: 'from-violet-600 via-purple-600 to-fuchsia-500',
  admin: 'from-amber-600 via-orange-600 to-rose-500',
  management: 'from-cyan-600 via-blue-600 to-indigo-500',
  superadmin: 'from-rose-600 via-pink-600 to-rose-400'
};

const roleIcons: Record<string, string> = {
  teacher: '📚',
  hos: '🏛',
  admin: '⚙️',
  management: '📊',
  superadmin: '👑'
};

export function PortalShell({ tabs, children }: { tabs: TabConfig[]; children: ReactNode }) {
  const { setUser, user } = useAuthStore();
  const location = useLocation();
  
  const role = user?.role || 'teacher';
  const gradient = roleGradients[role] || roleGradients.teacher;
  const roleIcon = roleIcons[role] || '📚';

  const isActiveTab = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Animated top bar */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${gradient} px-6 py-3 text-xs text-white/90`}>
        <div className="absolute inset-0 bg-white/10 animate-pulse-slow" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:text-white transition">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              New to the school? Start here
            </button>
            <div className="hidden border-l border-white/20 pl-6 md:block">
              <button className="hover:text-white transition">Pre-service checklist</button>
            </div>
            <div className="hidden border-l border-white/20 pl-6 md:block">
              <button className="hover:text-white transition">Access platforms</button>
            </div>
            <div className="hidden border-l border-white/20 pl-6 md:block">
              <button className="hover:text-white transition">Policies</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-white/20 font-medium">Academic year 2025–26</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-amber-950 text-xs font-bold">Joining guide</span>
          </div>
        </div>
      </div>

      {/* Header with logo and nav */}
      <header className="glass-header">
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-ekya-primary via-ekya-secondary to-ekya-accent opacity-50" />
        <div className="mx-auto max-w-7xl px-6 py-4 md:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg ring-4 ring-white/50 group-hover:rotate-12 transition-transform duration-300`}>
                <span className="text-2xl drop-shadow-sm">{roleIcon}</span>
              </div>
              <div>
                <p className="text-xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">Educator</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{role} portal</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {tabs.slice(0, 6).map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`relative px-4 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-300 ease-out group ${
                    isActiveTab(tab.path)
                      ? 'text-indigo-600 bg-indigo-50/80 shadow-sm ring-1 ring-indigo-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="relative z-10">{tab.label}</span>
                  {isActiveTab(tab.path) && (
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-2xl opacity-80" />
                  )}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-100/60 backdrop-blur-sm border border-slate-200/50 shadow-inner">
                <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${gradient} shadow-sm`} />
                <span className="text-xs font-bold text-slate-700">{user?.email}</span>
              </div>
              <button
                onClick={() => setUser(null)}
                className="px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-700 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="min-h-[calc(100vh-180px)] pb-24 relative z-0">
        {children}
      </main>

      {/* Support bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/70 backdrop-blur-xl border-t border-white/50 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] pb-safe z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 md:px-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'Raise a ticket', color: 'bg-red-500' },
                { label: 'Talk to HR', color: 'bg-blue-500' },
                { label: 'Access learning materials', color: 'bg-green-500' },
                { label: 'Problem solving guide', color: 'bg-purple-500' }
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold text-slate-700 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 border border-slate-100"
                >
                  <span className={`w-2 h-2 rounded-full ${item.color} shadow-inner`} />
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-700 font-medium">Term 2</span>
              <span>·</span>
              <span>Week 18</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}