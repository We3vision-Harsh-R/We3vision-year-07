import type { MobileSection } from "../types";
import { StepList } from "../blocks";

export const TeamJourneySection: MobileSection<"teamJourney"> = ({ data, id }) => (
  <StepList id={id} chip={data.chip} heading={data.heading} intro={data.intro} steps={data.steps.map((s) => ({ title: s.stage, kicker: s.who, text: s.text }))} />
);
