import type { MobileSection } from "../types";
import { RowList } from "../blocks";

export const CareerTeamsSection: MobileSection<"careerTeams"> = ({ data, id }) => (
  <RowList id={id} chip={data.chip} heading={data.heading} intro={data.intro} items={data.teams.map((t) => ({ title: t.name, text: t.text, href: t.href || undefined }))} />
);
