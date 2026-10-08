import { VrOffice } from "../metaverse/vr-office";
import type { SectionComponent } from "./shared";

/** The 3D office walk that opens the Metaverse page. */
export const VrEntry: SectionComponent<"vrEntry"> = ({ data }) => {
  const captions = data.captions
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return <VrOffice heading={data.heading} text={data.text} hint={data.hint} captions={captions} />;
};
