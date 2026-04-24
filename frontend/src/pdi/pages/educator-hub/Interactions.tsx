import React from "react";
import { InteractionsDashboard } from "@pdi/components/educator-hub/interactions/InteractionsDashboard";
import { PageHeader } from "@pdi/components/layout/PageHeader";
import { UsersThree } from "@phosphor-icons/react";

const Interactions = () => {
  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Interactions" 
        subtitle="School community interactions and engagement"
        icon={<UsersThree className="w-6 h-6 text-primary" weight="duotone" />}
      />
      
      <InteractionsDashboard />
    </div>
  );
};

export default Interactions;
