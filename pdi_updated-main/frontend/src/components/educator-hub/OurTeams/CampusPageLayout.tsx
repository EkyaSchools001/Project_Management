import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaretRight, ArrowLeft, PencilSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface CampusPageLayoutProps {
  children: React.ReactNode;
  schoolName: string;
  breadcrumbPath: string;
  onEdit?: () => void;
  accentColor?: string;
}

export const CampusPageLayout = ({ 
  children, 
  schoolName, 
  breadcrumbPath, 
  onEdit, 
  accentColor = "#e53935" 
}: CampusPageLayoutProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw.includes("ELC") || raw.includes("PDI") || raw.includes("LEADER") || raw === "TESTER";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs & Navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4 relative">
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/educator-hub" className="hover:text-slate-900 transition-colors">Home</Link>
          <CaretRight weight="bold" className="w-3 h-3 flex-shrink-0" />
          <Link to="/educator-hub/institutional-identity/schools" className="hover:text-slate-900 transition-colors">Existing Campuses</Link>
          <CaretRight weight="bold" className="w-3 h-3 flex-shrink-0" />
          <span className="text-slate-900 font-bold">{schoolName}</span>
        </nav>

        <div className="flex items-center justify-between gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-slate-100 flex items-center gap-2 group text-slate-600"
            onClick={() => navigate("/educator-hub/institutional-identity/schools")}
          >
            <ArrowLeft weight="bold" className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Campuses
          </Button>

          {onEdit && canEdit() && (
            <Button 
              className="gap-2 text-white shadow-md"
              style={{ backgroundColor: accentColor }}
              onClick={onEdit}
            >
              <PencilSimple size={18} weight="bold" />
              Edit Content
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer Branding */}
      <div className="py-12 bg-[#1F2839] text-center mt-20">
        <p className="text-slate-500 text-sm tracking-[0.3em] uppercase">
          EKYA SCHOOLS © 2026
        </p>
      </div>
    </div>
  );
};
