import type { MobileSection } from "../types";
import { Cloud } from "../../app";
import { HeroBlock } from "../blocks";

// The train-ticket journey is a scroll scene on the laptop: here its heading and text.
export const CareerJourneySection: MobileSection<"careerJourney"> = ({ data, index }) => (
  <HeroBlock index={index} chip={data.chip} heading={data.heading} text={data.text}>
    {data.locationLabel && <div className="ma-gap"><Cloud items={[data.locationLabel]} /></div>}
  </HeroBlock>
);
