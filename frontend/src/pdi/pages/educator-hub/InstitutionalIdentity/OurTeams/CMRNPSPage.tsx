import React from "react";
import { CampusDetailPage } from "@pdi/components/educator-hub/OurTeams/CampusDetailPage";
import { cmrNpsTeam } from "@pdi/data/teams/cmr-nps";

const CMRNPSPage = () => {
  return <CampusDetailPage data={cmrNpsTeam} />;
};

export default CMRNPSPage;
