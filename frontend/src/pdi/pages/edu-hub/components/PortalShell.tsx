import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@pdi/hooks/useAuth';
import { hubTabs } from '../config';

const roleGradients: Record<string, string> = {
  teacher: 'from-blue-600 via-sky-600 to-cyan-500',
  hos: 'from-primary via-accent to-rose-500',
  leader: 'from-primary via-accent to-rose-500',
  admin: 'from-accent via-red-600 to-rose-600',
  management: 'from-slate-800 via-slate-900 to-black',
  superadmin: 'from-red-600 via-rose-600 to-pink-600'
};

const roleIcons: Record<string, string> = {
  teacher: '📚',
  hos: '🏛',
  leader: '🏛',
  admin: '⚙️',
  management: '📊',
  superadmin: '👑'
};

export function PortalShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  
  const role = (user?.role || 'teacher').toLowerCase();
  const gradient = roleGradients[role] || roleGradients.teacher;
  const roleIcon = roleIcons[role] || '📚';

  const isActiveTab = (path: string) => {
    if (path === '/edu-hub') return location.pathname === '/edu-hub';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-transparent font-sans">
      {/* Animated top bar */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${gradient} px-6 py-3 text-xs text-white/90`}>
        <div className="absolute inset-0 bg-white/10 animate-pulse" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:text-white transition group">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              New to the school? Start here
            </button>
            <div className="hidden border-l border-white/20 pl-6 md:block">
              <button className="hover:text-white transition cursor-pointer">Pre-service checklist</button>
            </div>
            <div className="hidden border-l border-white/20 pl-6 md:block">
              <button className="hover:text-white transition cursor-pointer">Access platforms</button>
            </div>
            <div className="hidden border-l border-white/20 pl-6 md:block">
              <button className="hover:text-white transition cursor-pointer">Policies</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-white/20 font-medium whitespace-nowrap">Academic year 2025–26</span>
          </div>
        </div>
      </div>

      {/* Header with logo and nav */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_24px_rgba(247,53,88,0.02)] sticky top-0 z-50">
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-primary via-accent to-rose-500 opacity-50" />
        <div className="mx-auto max-w-7xl px-6 py-4 md:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg ring-4 ring-white/50 transition-transform duration-300`}>
                <span className="text-2xl drop-shadow-sm">{roleIcon}</span>
              </div>
              <div>
                <p className="text-xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">Educator</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{role} portal</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {hubTabs.slice(0, 6).map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`relative px-4 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-300 ease-out group ${
                    isActiveTab(tab.path)
                      ? 'text-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="relative z-10">{tab.label}</span>
                  {isActiveTab(tab.path) && (
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-accent rounded-b-2xl opacity-80" />
                  )}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-100/60 backdrop-blur-sm border border-slate-200/50 shadow-inner">
                <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${gradient} shadow-sm`} />
                <span className="text-xs font-bold text-slate-700">{user?.fullName}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="min-h-[calc(100vh-180px)] pb-24 relative z-0">
        {children}
      </main>

      {/* Support bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/70 backdrop-blur-xl border-t border-white/50 shadow-[0_-4px_24px_rgba(247,53,88,0.02)] z-50">
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
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold text-slate-700 bg-white shadow-[0_2px_8px_rgba(247,53,88,0.06)] hover:shadow-[0_4px_12px_rgba(247,53,88,0.1)] hover:-translate-y-0.5 transition-all duration-300 border border-slate-100"
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

