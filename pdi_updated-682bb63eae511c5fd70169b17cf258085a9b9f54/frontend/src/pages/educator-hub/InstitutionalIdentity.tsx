import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { InstitutionalIdentityView } from "@/components/educator-hub/InstitutionalIdentity/IdentityView";
import { PageHeader } from "@/components/layout/PageHeader";
import { Buildings } from "@phosphor-icons/react";

const InstitutionalIdentity = () => {
  const { user } = useAuth();
  
  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw.includes("ELC") || raw.includes("PDI") || raw.includes("LEADER") || raw === "TESTER";
  };
  return (
    <div className="p-6 space-y-4">
      <PageHeader 
        title="Institutional Identity" 
        subtitle="Core values, mission, and community"
        icon={<Buildings className="w-6 h-6 text-primary" weight="duotone" />}
      />
      
      <InstitutionalIdentityView canEdit={canEdit()} />
    </div>
  );
};

export default InstitutionalIdentity;
