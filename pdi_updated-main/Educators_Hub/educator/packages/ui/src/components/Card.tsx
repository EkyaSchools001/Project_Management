import type { ReactNode } from 'react';

export function Card({ title, children, accent }: { title: string; children: ReactNode; accent?: string }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {accent ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{accent}</span> : null}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
