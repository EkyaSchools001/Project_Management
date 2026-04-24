import React from "react";
import { CampusDetailPage } from "@/components/educator-hub/OurTeams/CampusDetailPage";
import { cmrpuHrbrTeam } from "@/data/teams/cmrpu-hrbr";

const CmrpuhRbrPage = () => {
  return <CampusDetailPage data={cmrpuHrbrTeam} />;
};

export default CmrpuhRbrPage;
