import React from "react";
import { useAuth } from "@pdi/hooks/useAuth";
import { TeacherPedagogyLearning } from "@pdi/components/educator-hub/PedagogyLearning/TeacherRepository";
import { LeaderPedagogyLearning } from "@pdi/components/educator-hub/PedagogyLearning/LeaderDashboard";
import { AdminPedagogyLearning } from "@pdi/components/educator-hub/PedagogyLearning/AdminEditor";
import { ManagementPedagogyLearning } from "@pdi/components/educator-hub/PedagogyLearning/ManagementDashboard";
import { PageHeader } from "@pdi/components/layout/PageHeader";
import { ConfidentialityGate } from "@pdi/components/educator-hub/ConfidentialityGate";
import { BookOpen } from "@phosphor-icons/react";

const PedagogyLearning = () => {
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
        return <AdminPedagogyLearning />;
      case "LEADER":
        return <LeaderPedagogyLearning />;
      case "MANAGEMENT":
        return <ManagementPedagogyLearning />;
      case "TEACHER":
      default:
        return <TeacherPedagogyLearning />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Pedagogy & Learning" 
        subtitle="ELC Repository & Instructional Frameworks"
        icon={<BookOpen className="w-6 h-6 text-primary" weight="duotone" />}
      />
      
      <ConfidentialityGate moduleId="peda_learn" moduleName="Pedagogy & Learning">
        {renderDashboard()}
      </ConfidentialityGate>
    </div>
  );
};

export default PedagogyLearning;
