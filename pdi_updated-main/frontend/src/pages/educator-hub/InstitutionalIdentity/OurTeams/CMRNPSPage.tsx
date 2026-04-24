import React from "react";
import { CampusDetailPage } from "@/components/educator-hub/OurTeams/CampusDetailPage";
import { cmrNpsTeam } from "@/data/teams/cmr-nps";

const CMRNPSPage = () => {
  return <CampusDetailPage data={cmrNpsTeam} />;
};

export default CMRNPSPage;
