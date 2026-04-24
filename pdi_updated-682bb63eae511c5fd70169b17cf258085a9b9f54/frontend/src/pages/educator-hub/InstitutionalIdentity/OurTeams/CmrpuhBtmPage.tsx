import React from "react";
import { CampusDetailPage } from "@/components/educator-hub/OurTeams/CampusDetailPage";
import { cmrpuBtmTeam } from "@/data/teams/cmrpu-btm";

const CmrpuhBtmPage = () => {
  return <CampusDetailPage data={cmrpuBtmTeam} />;
};

export default CmrpuhBtmPage;
