import { getTeam } from "@/lib/team";
import { TeamCrew } from "../modern/team-crew";
import type { SectionComponent } from "./shared";

/** Every person of the company as a card with a department filter (see modern/team-crew.tsx). The people come from the admin panel (Team). */
export const TeamCrewSection: SectionComponent<"teamCrew"> = async ({ data, sectionId }) => {
  const people = await getTeam();
  return <TeamCrew id={sectionId && sectionId !== "teamCrew" ? sectionId : "crew"} chip={data.chip} heading={data.heading} intro={data.intro} people={people} />;
};
