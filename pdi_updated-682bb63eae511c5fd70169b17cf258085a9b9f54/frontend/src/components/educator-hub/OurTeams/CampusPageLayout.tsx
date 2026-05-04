import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, PencilSimple, Calendar, Buildings } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface CampusPageLayoutProps {
  children: React.ReactNode;
  schoolName: string;
  breadcrumbPath: string;
  onEdit?: () => void;
  accentColor?: string;
  backgroundImage?: string;
}

export const CampusPageLayout = ({ 
  children, 
  schoolName, 
  breadcrumbPath, 
  onEdit, 
  accentColor = "#e53935",
  backgroundImage
}: CampusPageLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canEdit = () => {
    const role = user?.role?.toUpperCase() || "";
    return role === "ADMIN" || role === "SUPERADMIN" || role === "TESTER";
  };

  return (
    <div className="min-h-screen bg-white text-left">
      {/* Institutional Top Bar */}
      <div className="relative z-30 bg-white border-b border-slate-100 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-105 transition-all group flex items-center gap-3 px-6"
          >
            <ArrowLeft weight="bold" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
          </button>

          <div className="flex items-center gap-4">
            {onEdit && canEdit() && (
              <Button 
                className="p-2.5 rounded-xl bg-white border border-primary/20 text-primary shadow-lg hover:bg-slate-50 hover:scale-105 transition-all group flex items-center gap-3 px-6 h-auto"
                onClick={onEdit}
              >
                <PencilSimple size={16} weight="bold" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Edit Content</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Premium Red Banner */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="relative w-full min-h-[280px] overflow-hidden rounded-[3rem] shadow-2xl bg-[#EA104A] flex flex-col justify-end p-10 md:p-14 group">
          {/* Background Image with Premium Overlay */}
          <div className="absolute inset-0">
            {backgroundImage ? (
              <>
                <img 
                  src={backgroundImage} 
                  className="w-full h-full object-cover opacity-40 mix-blend-overlay transform scale-105 group-hover:scale-100 transition-transform duration-[10000ms]" 
                  alt={schoolName}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#EA104A] via-[#EA104A]/60 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-[#EA104A]" />
            )}
          </div>

          {/* EKYA Watermark */}
          <div className="absolute right-0 bottom-[-40px] opacity-[0.08] pointer-events-none select-none z-0">
               <span className="text-[150px] md:text-[280px] font-black tracking-tighter leading-none text-white">EKYA</span>
          </div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-3 text-white/90">
               <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                 <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-md">Educator Hub</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase drop-shadow-2xl">
              {schoolName.split(' ').map((word, i) => (
                <span key={i}>{word} </span>
              ))}
            </h1>
            
            <p className="text-white/80 font-medium text-sm md:text-base max-w-2xl drop-shadow-md">
              Your campus, your class, your timetable: the details specific to where you teach.
            </p>
          </div>
        </div>
      </div>

      <main>
        {children}
      </main>

      <div className="py-12 bg-[#1F2839] text-center mt-20">
        <p className="text-slate-500 text-sm tracking-[0.3em] uppercase">
          EKYA SCHOOLS © 2026
        </p>
      </div>
    </div>
  );
};

