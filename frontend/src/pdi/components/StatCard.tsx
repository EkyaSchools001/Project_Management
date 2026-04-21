import { cn } from "@pdi/lib/utils";
import React from 'react';

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
        "group relative transition-all duration-300 border border-white/5 bg-[#161B22] p-8 rounded-[1rem] flex flex-col justify-between overflow-hidden",
        onClick && "cursor-pointer hover:border-[#BAFF00]/30 active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#BAFF00]/5 translate-x-16 -translate-y-16 transition-transform group-hover:scale-150 group-hover:bg-[#BAFF00]/10 rounded-full" />

      <div className="flex flex-row items-center justify-between gap-6 relative z-10 w-full mb-6">
        <div className="p-4 rounded-full bg-white/5 border border-white/5 text-foreground/50 group-hover:bg-[#BAFF00]/10 group-hover:text-[#BAFF00] group-hover:border-[#BAFF00]/30 transition-all duration-300">
          {Icon && <Icon size={24} weight="bold" />}
        </div>
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1.5 text-[10px] px-3 py-1 font-bold rounded-full",
            trend?.isPositive ? "bg-[#27AE60]/10 text-[#27AE60]" : "bg-red-500/10 text-red-500"
          )}>
            <span>{trend?.isPositive ? "↑" : "↓"}</span>
            <span>{Math.abs(trend?.value ?? 0)}%</span>
          </div>
        )}
      </div>

      <div className="relative z-10 space-y-2">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 truncate">
            {title}
          </p>
        </div>

        <p className="text-5xl font-black text-foreground tracking-tight group-hover:text-[#BAFF00] transition-colors duration-300 leading-none">
          {value}
        </p>

        {subtitle && (
          <p className="text-[11px] font-semibold text-foreground/40 pt-2 line-clamp-1 border-t border-white/5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
