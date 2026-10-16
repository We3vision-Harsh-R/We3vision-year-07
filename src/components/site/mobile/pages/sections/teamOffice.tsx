import type { MobileSection } from "../types";
import { TextBlock } from "../blocks";

// The 3D office of the team is a scene on the laptop: here its heading and text.
export const TeamOfficeSection: MobileSection<"teamOffice"> = ({ data, id }) => (
  <TextBlock id={id} chip={data.chip} heading={data.heading} text={data.intro} />
);
