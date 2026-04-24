import React from "react";
import { CampusDetailPage } from "@pdi/components/educator-hub/OurTeams/CampusDetailPage";
import { cmrpuHrbrTeam } from "@pdi/data/teams/cmrpu-hrbr";

const CmrpuhRbrPage = () => {
  return <CampusDetailPage data={cmrpuHrbrTeam} />;
};

export default CmrpuhRbrPage;
