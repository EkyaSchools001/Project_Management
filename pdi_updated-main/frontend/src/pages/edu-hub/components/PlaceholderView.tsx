export function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/40 p-12 text-center shadow-xl">
        <div className="mb-6 mx-auto w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-4xl shadow-inner border border-primary/10">
          ✨
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4">{title}</h2>
        <p className="text-slate-500 font-medium text-lg max-w-lg mx-auto leading-relaxed">
          We are currently curating premium resources and curriculum materials for this section. Stay tuned for updates!
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <div className="h-1.5 w-12 rounded-full bg-primary opacity-10" />
          <div className="h-1.5 w-12 rounded-full bg-primary opacity-20" />
          <div className="h-1.5 w-12 rounded-full bg-primary opacity-30" />
        </div>
      </div>
    </div>
  );
}

