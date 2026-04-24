import React from "react";
import { CampusDetailPage } from "@pdi/components/educator-hub/OurTeams/CampusDetailPage";
import { ekyaItplTeam } from "@pdi/data/teams/ekya-itpl";

const EkyaItplPage = () => {
  return <CampusDetailPage data={ekyaItplTeam} />;
};

export default EkyaItplPage;
