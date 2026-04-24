import React from "react";
import { CampusDetailPage } from "@/components/educator-hub/OurTeams/CampusDetailPage";
import { ekyaItplTeam } from "@/data/teams/ekya-itpl";

const EkyaItplPage = () => {
  return <CampusDetailPage data={ekyaItplTeam} />;
};

export default EkyaItplPage;
