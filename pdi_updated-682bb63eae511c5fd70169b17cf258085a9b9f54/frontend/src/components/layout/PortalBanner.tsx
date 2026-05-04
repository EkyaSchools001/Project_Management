import React from 'react';
import { CaretLeft, PencilSimple, IconProps, Sparkle } from "@phosphor-icons/react";
import { useAuth } from '@/hooks/useAuth';
import { cn } from "@/lib/utils";

interface PortalBannerProps {
  title: string;
  subtitle: string;
  icon?: React.ElementType<IconProps>;
  onBack: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
  backgroundImage?: string;
  className?: string;
  children?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const PortalBanner = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  onBack, 
  onEdit, 
  canEdit,
  backgroundImage,
  className,
  children,
  rightAction
}: PortalBannerProps) => {
  const { user } = useAuth();
  return (
  <div className={cn("relative", className)}>
    {/* Institutional Top Bar */}
    <div className="relative z-30 bg-white border-b border-slate-100 mb-10 py-3">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-1 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2.5 rounded-full bg-[#EA104A] text-white shadow-xl shadow-[#EA104A]/20 hover:bg-[#d00e42] hover:scale-105 transition-all group flex items-center gap-3 px-6"
        >
          <CaretLeft weight="bold" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Hub</span>
        </button>

        <div className="flex items-center gap-4">
          {rightAction && rightAction}
          {((canEdit || (user?.role && ["ADMIN", "SUPERADMIN", "MANAGEMENT", "MANAGER", "LEADER", "COORDINATOR", "PRINCIPAL", "HEAD"].some(r => user.role.toUpperCase().includes(r)))) && onEdit) && (
            <button 
              onClick={onEdit}
              className="p-2.5 rounded-full bg-white border border-primary/20 text-primary shadow-lg hover:bg-slate-50 hover:scale-105 transition-all group flex items-center gap-3 px-6"
            >
              <PencilSimple weight="bold" className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Edit Content</span>
            </button>
          )}
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className={cn(
        "relative h-[260px] md:h-[300px] overflow-hidden rounded-[3rem] shadow-2xl mb-12",
        backgroundImage ? "bg-slate-900" : "bg-[#EA104A]"
      )}>
        {backgroundImage && (
          <>
            <img 
              src={backgroundImage} 
              alt={title}
              className="w-full h-full object-cover opacity-40 mix-blend-overlay transform scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          </>
        )}
        
        {/* Decorative background elements (only for solid mode) */}
        {!backgroundImage && (
          <>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px] mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-20 -mb-20 blur-[80px] mix-blend-multiply opacity-20"></div>
          </>
        )}
        
        {/* EKYA Watermark */}
        <div className="absolute right-0 bottom-[-40px] md:bottom-[-60px] opacity-[0.08] pointer-events-none select-none z-0">
             <span className="text-[160px] md:text-[300px] font-black tracking-tighter leading-none text-white">EKYA</span>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center pl-10 md:pl-16 lg:pl-20 pr-12">
          <div className="flex items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">Educator Hub</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] uppercase drop-shadow-2xl">
                {title}
              </h2>
              <p className="text-white/80 font-medium max-w-2xl text-sm md:text-base leading-relaxed mt-3 drop-shadow-md">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
