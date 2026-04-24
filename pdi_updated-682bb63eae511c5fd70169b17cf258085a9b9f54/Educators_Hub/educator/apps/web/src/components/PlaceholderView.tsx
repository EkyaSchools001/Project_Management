import React from 'react';

export function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 relative z-10 animate-slide-up">
      <section className="glass-panel border-white/60 p-12 text-center group hover:bg-white/70 transition-all duration-500">
        <div className="w-16 h-16 mx-auto mb-6 bg-indigo-50/50 rounded-2xl flex items-center justify-center border border-indigo-100/50 group-hover:scale-110 transition-transform duration-300">
          <span className="text-3xl">✨</span>
        </div>
        <p className="mb-4 text-xs uppercase tracking-[0.3em] font-bold text-indigo-500/80">Coming Soon</p>
        <h2 className="text-4xl font-extrabold text-slate-800 mb-4">{title}</h2>
        <p className="mt-2 text-lg text-slate-600 font-medium max-w-lg mx-auto leading-relaxed">
          We are currently crafting a spectacular experience for this section. Check back soon for powerful new tools and insights.
        </p>
      </section>
    </div>
  );
}
