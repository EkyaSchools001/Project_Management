import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { TeacherAcademicOps } from "@/components/educator-hub/AcademicOperations/TeacherDashboard";
import { LeaderAcademicOps } from "@/components/educator-hub/AcademicOperations/LeaderDashboard";
import { AdminAcademicOps } from "@/components/educator-hub/AcademicOperations/AdminDashboard";
import { ManagementAcademicOps } from "@/components/educator-hub/AcademicOperations/ManagementDashboard";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartBar } from "@phosphor-icons/react";

const AcademicOperations = () => {
  const { user } = useAuth();
  
  // Role Normalization (simplified for local UI routing)
  const getRole = () => {
    const raw = user?.role?.toUpperCase() || "";
    if (raw.includes("ADMIN") || raw.includes("ELC") || raw.includes("PDI")) return "ADMIN";
    if (raw.includes("LEADER") || raw.includes("HOS")) return "LEADER";
    if (raw.includes("MANAGEMENT")) return "MANAGEMENT";
    return "TEACHER";
  };

  const role = getRole();

  const renderDashboard = () => {
    switch (role) {
      case "ADMIN":
        return <AdminAcademicOps />;
      case "LEADER":
        return <LeaderAcademicOps />;
      case "MANAGEMENT":
        return <ManagementAcademicOps />;
      case "TEACHER":
      default:
        return <TeacherAcademicOps />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Academic Operations" 
        subtitle={`Role-based dashboard: ${role}`}
        icon={<ChartBar className="w-6 h-6 text-primary" weight="duotone" />}
      />
      
      {renderDashboard()}
    </div>
  );
};

export default AcademicOperations;
