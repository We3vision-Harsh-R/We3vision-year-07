import { VrFloor } from "../metaverse/vr-floor";
import type { SectionComponent } from "./shared";

/** The office of the metaverse team seen from above: Rutvi sits down, the four teams work in the corners (see metaverse/vr-floor.tsx). */
export const VrFloorSection: SectionComponent<"vrFloor"> = ({ data }) => (
  <VrFloor
    heading={data.heading}
    hint={data.hint}
    name={data.name}
    tipTitle={data.tipTitle}
    tipText={data.tipText}
    industriesTitle={data.industriesTitle}
    ctaLabel={data.ctaLabel}
    govTitle={data.govTitle}
    projects={data.projects}
    cabins={data.cabins}
  />
);
