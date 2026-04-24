import React from "react";
import { CampusDetailPage } from "@/components/educator-hub/OurTeams/CampusDetailPage";
import { ekyaByrathiTeam } from "@/data/teams/ekya-byrathi";

const EkyaByrathiPage = () => {
  return <CampusDetailPage data={ekyaByrathiTeam} />;
};

export default EkyaByrathiPage;
