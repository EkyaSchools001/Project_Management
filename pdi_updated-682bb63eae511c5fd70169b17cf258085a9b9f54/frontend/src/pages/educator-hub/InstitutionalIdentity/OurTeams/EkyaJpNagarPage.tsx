import React from "react";
import { CampusDetailPage } from "@/components/educator-hub/OurTeams/CampusDetailPage";
import { ekyaJpNagarTeam } from "@/data/teams/ekya-jp-nagar";

const EkyaJpNagarPage = () => {
  return <CampusDetailPage data={ekyaJpNagarTeam} />;
};

export default EkyaJpNagarPage;
