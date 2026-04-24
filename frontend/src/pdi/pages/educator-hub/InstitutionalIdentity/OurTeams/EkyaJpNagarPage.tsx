import React from "react";
import { CampusDetailPage } from "@pdi/components/educator-hub/OurTeams/CampusDetailPage";
import { ekyaJpNagarTeam } from "@pdi/data/teams/ekya-jp-nagar";

const EkyaJpNagarPage = () => {
  return <CampusDetailPage data={ekyaJpNagarTeam} />;
};

export default EkyaJpNagarPage;
