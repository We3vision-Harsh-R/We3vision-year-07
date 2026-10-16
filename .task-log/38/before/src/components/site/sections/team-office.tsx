import { TeamOffice } from "../modern/team-office";
import type { SectionComponent } from "./shared";

/** The people of the company at their desks in the office seen from above (see modern/team-office.tsx). */
export const TeamOfficeSection: SectionComponent<"teamOffice"> = ({ data, sectionId }) => <TeamOffice id={sectionId === "teamOffice" ? "office" : sectionId} chip={data.chip} heading={data.heading} intro={data.intro} members={data.members} />;
