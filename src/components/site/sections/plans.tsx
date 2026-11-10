import { Plans } from "../lazy";
import type { SectionComponent } from "./shared";

/** Plans & pricing (modern/plans.tsx, loaded late so its CSS only goes to pages that show it) */
export const PlansSection: SectionComponent<"plans"> = ({ data }) => <Plans data={data} />;
