import { getTeam } from "@/lib/team";
import { TeamOffice } from "../lazy";
import type { SectionComponent } from "./shared";

/** The people of the company in the office (see modern/team-office.tsx). The people come from the admin panel (Team). */
export const TeamOfficeSection: SectionComponent<"teamOffice"> = async ({ data, sectionId }) => {
  const people = await getTeam();
  return <TeamOffice id={sectionId === "teamOffice" ? "office" : sectionId} chip={data.chip} heading={data.heading} intro={data.intro} people={people} />;
};
