import React from "react";
import { CampusDetailPage } from "@/components/educator-hub/OurTeams/CampusDetailPage";
import { cmrpuItplTeam } from "@/data/teams/cmrpu-itpl";

const CmrpuhItplPage = () => {
  return <CampusDetailPage data={cmrpuItplTeam} />;
};

export default CmrpuhItplPage;
