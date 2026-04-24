import React from "react";
import { CampusDetailPage } from "@pdi/components/educator-hub/OurTeams/CampusDetailPage";
import { ekyaByrathiTeam } from "@pdi/data/teams/ekya-byrathi";

const EkyaByrathiPage = () => {
  return <CampusDetailPage data={ekyaByrathiTeam} />;
};

export default EkyaByrathiPage;
