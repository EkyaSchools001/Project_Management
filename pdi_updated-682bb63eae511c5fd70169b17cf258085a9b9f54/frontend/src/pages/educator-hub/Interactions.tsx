import React from "react";
import { InteractionsDashboard } from "@/components/educator-hub/interactions/InteractionsDashboard";
import { PageHeader } from "@/components/layout/PageHeader";
import { UsersThree } from "@phosphor-icons/react";

const Interactions = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-6">
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
