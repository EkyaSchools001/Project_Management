import React from "react";
import { CampusDetailPage } from "@/components/educator-hub/OurTeams/CampusDetailPage";
import { ekyaBtmLayoutTeam } from "@/data/teams/ekya-btm-layout";

const EkyaBtmLayoutPage = () => {
  return <CampusDetailPage data={ekyaBtmLayoutTeam} />;
};

export default EkyaBtmLayoutPage;
