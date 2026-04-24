import React from "react";
import { CampusDetailPage } from "@/components/educator-hub/OurTeams/CampusDetailPage";
import { ekyaNiceRoadTeam } from "@/data/teams/ekya-nice-road";

const EkyaNiceRoadPage = () => {
  return <CampusDetailPage data={ekyaNiceRoadTeam} />;
};

export default EkyaNiceRoadPage;
