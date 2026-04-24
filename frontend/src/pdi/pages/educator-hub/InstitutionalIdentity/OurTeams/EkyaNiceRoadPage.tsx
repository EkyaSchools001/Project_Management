import React from "react";
import { CampusDetailPage } from "@pdi/components/educator-hub/OurTeams/CampusDetailPage";
import { ekyaNiceRoadTeam } from "@pdi/data/teams/ekya-nice-road";

const EkyaNiceRoadPage = () => {
  return <CampusDetailPage data={ekyaNiceRoadTeam} />;
};

export default EkyaNiceRoadPage;
