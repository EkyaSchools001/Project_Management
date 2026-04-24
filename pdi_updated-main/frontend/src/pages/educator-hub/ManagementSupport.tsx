import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { TeacherMgmtSupport } from "@/components/educator-hub/ManagementSupport/TeacherDashboard";
import { LeaderMgmtSupport } from "@/components/educator-hub/ManagementSupport/LeaderDashboard";
import { AdminMgmtSupport } from "@/components/educator-hub/ManagementSupport/AdminDashboard";
import { ManagementMgmtSupport } from "@/components/educator-hub/ManagementSupport/ManagementDashboard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Gear } from "@phosphor-icons/react";

const ManagementSupport = () => {
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
        return <AdminMgmtSupport />;
      case "LEADER":
        return <LeaderMgmtSupport />;
      case "MANAGEMENT":
        return <ManagementMgmtSupport />;
      case "TEACHER":
      default:
        return <TeacherMgmtSupport />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Management & Support" 
        subtitle="ESS, Support Tickets & Institutional Policies"
        icon={<Gear className="w-6 h-6 text-primary" weight="duotone" />}
      />
      
      {renderDashboard()}
    </div>
  );
};

export default ManagementSupport;
