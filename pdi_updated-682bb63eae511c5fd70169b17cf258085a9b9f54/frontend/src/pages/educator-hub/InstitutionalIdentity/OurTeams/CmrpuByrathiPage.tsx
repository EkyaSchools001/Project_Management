import React from "react";
import { CampusDetailPage } from "@/components/educator-hub/OurTeams/CampusDetailPage";
import { cmrpuByrathiTeam } from "@/data/teams/cmrpu-byrathi";

const CmrpuByrathiPage = () => {
  return <CampusDetailPage data={cmrpuByrathiTeam} />;
};

export default CmrpuByrathiPage;
