import type { MobileSection } from "../types";
import { Cloud } from "../../app";
import { HeroBlock } from "../blocks";
import { lines } from "../../app/text";

export const VrEntrySection: MobileSection<"vrEntry"> = ({ data, index }) => (
  <HeroBlock index={index} heading={data.heading} text={data.text}>
    {lines(data.captions).length > 0 && <div className="ma-gap"><Cloud items={lines(data.captions)} /></div>}
  </HeroBlock>
);
