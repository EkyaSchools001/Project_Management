import React from "react";
import { CampusDetailPage } from "@pdi/components/educator-hub/OurTeams/CampusDetailPage";
import { cmrpuItplTeam } from "@pdi/data/teams/cmrpu-itpl";

const CmrpuhItplPage = () => {
  return <CampusDetailPage data={cmrpuItplTeam} />;
};

export default CmrpuhItplPage;
