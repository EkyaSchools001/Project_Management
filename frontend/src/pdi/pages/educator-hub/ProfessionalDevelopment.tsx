import React from "react";
import { useAuth } from "@pdi/hooks/useAuth";
import { TeacherProfDev } from "@pdi/components/educator-hub/ProfessionalDevelopment/TeacherDashboard";
import { LeaderProfDev } from "@pdi/components/educator-hub/ProfessionalDevelopment/LeaderDashboard";
import { AdminProfDev } from "@pdi/components/educator-hub/ProfessionalDevelopment/AdminDashboard";
import { ManagementProfDev } from "@pdi/components/educator-hub/ProfessionalDevelopment/ManagementDashboard";
import { PageHeader } from "@pdi/components/layout/PageHeader";
import { Lightning } from "@phosphor-icons/react";

const ProfessionalDevelopment = () => {
  const { user } = useAuth();
  
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
        return <AdminProfDev />;
      case "LEADER":
        return <LeaderProfDev />;
      case "MANAGEMENT":
        return <ManagementProfDev />;
      case "TEACHER":
      default:
        return <TeacherProfDev />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Professional Development" 
        subtitle="PDI Tracking & Learning Journeys"
        icon={<Lightning className="w-6 h-6 text-primary" weight="duotone" />}
      />
      
      {renderDashboard()}
    </div>
  );
};

export default ProfessionalDevelopment;
