import { AppShowcase } from "../lazy";
import type { SectionComponent } from "./shared";

/** App showcase (modern/app-showcase.tsx, loaded late so its CSS only goes to pages that show it) */
export const AppShowcaseSection: SectionComponent<"appShowcase"> = ({ data }) => <AppShowcase data={data} />;
