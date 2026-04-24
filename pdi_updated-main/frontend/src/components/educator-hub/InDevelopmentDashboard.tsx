import React from "react";
import { Hammer, ArrowLeft, HardHat, Clock, Rocket } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface InDevelopmentDashboardProps {
  title: string;
}

const InDevelopmentDashboard: React.FC<InDevelopmentDashboardProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Educator Hub</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-dashed border-slate-300 p-12">
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse" />
          <HardHat className="w-24 h-24 text-primary relative z-10" weight="duotone" />
        </div>

        <div className="max-w-md space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="text-lg text-slate-600">
            We're building something amazing! This module is currently under active development as part of our Educator Hub enhancement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2">
            <Clock className="w-6 h-6 text-blue-500 mx-auto" weight="bold" />
            <h3 className="font-semibold text-sm">Target Launch</h3>
            <p className="text-xs text-slate-500">Q2 2024</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2">
            <Hammer className="w-6 h-6 text-amber-500 mx-auto" weight="bold" />
            <h3 className="font-semibold text-sm">Status</h3>
            <p className="text-xs text-slate-500">In Development</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2">
            <Rocket className="w-6 h-6 text-purple-500 mx-auto" weight="bold" />
            <h3 className="font-semibold text-sm">Priority</h3>
            <p className="text-xs text-slate-500">High Impact</p>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default InDevelopmentDashboard;
