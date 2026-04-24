import React from "react";
import { CampusDetailPage } from "@pdi/components/educator-hub/OurTeams/CampusDetailPage";
import { cmrpuBtmTeam } from "@pdi/data/teams/cmrpu-btm";

const CmrpuhBtmPage = () => {
  return <CampusDetailPage data={cmrpuBtmTeam} />;
};

export default CmrpuhBtmPage;
