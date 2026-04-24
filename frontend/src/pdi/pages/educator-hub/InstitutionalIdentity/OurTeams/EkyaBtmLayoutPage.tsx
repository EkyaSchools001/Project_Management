import React from "react";
import { CampusDetailPage } from "@pdi/components/educator-hub/OurTeams/CampusDetailPage";
import { ekyaBtmLayoutTeam } from "@pdi/data/teams/ekya-btm-layout";

const EkyaBtmLayoutPage = () => {
  return <CampusDetailPage data={ekyaBtmLayoutTeam} />;
};

export default EkyaBtmLayoutPage;
