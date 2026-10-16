import { VrProcess } from "../metaverse/vr-process";
import type { SectionComponent } from "./shared";

/** The steps of the work as stations on the floor of the metaverse studio, Rutvi walks along them (see metaverse/vr-process.tsx). */
export const VrProcessSection: SectionComponent<"vrProcess"> = ({ data, sectionId }) => <VrProcess id={sectionId} chip={data.chip} heading={data.heading} intro={data.intro} items={data.items} />;
