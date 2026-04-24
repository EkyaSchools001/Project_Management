import { cn } from "@/lib/utils";

// Accept both Lucide and Phosphor icon components
type IconComponent = React.ComponentType<{ className?: string; size?: string | number; weight?: string }>;

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: IconComponent;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className, onClick }: StatCardProps) {
  return (
    <div
      className={cn(
        "stat-card group relative overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-primary/20",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-150 group-hover:bg-primary/10" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-black capitalize tracking-[0.15em] text-zinc-900 leading-none">
              {title}
            </p>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-5xl font-black text-zinc-950 tracking-tight group-hover:text-primary transition-colors duration-300">
              {value}
            </p>
          </div>

          {subtitle && (
            <p className="text-sm font-medium text-zinc-800 mt-2 line-clamp-1">{subtitle}</p>
          )}

          {trend && (
            <div className={cn(
              "flex items-center gap-1.5 text-xs mt-3 px-2 py-1 rounded-full w-fit font-bold",
              trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-destructive/10 text-destructive"
            )}>
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-[10px] opacity-70 font-medium">monthly</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className="flex-shrink-0 ml-3">
            <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-border/50 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-350 ease-out group-hover:scale-110 group-hover:-rotate-3 text-primary">
              <Icon size={24} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
