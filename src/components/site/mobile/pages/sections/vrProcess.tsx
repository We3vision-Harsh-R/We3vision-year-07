import type { MobileSection } from "../types";
import { StepList } from "../blocks";
import { lines } from "../../app/text";

export const VrProcessSection: MobileSection<"vrProcess"> = ({ data, id }) => (
  <StepList id={id} chip={data.chip} heading={data.heading} intro={data.intro} steps={data.items.map((x) => ({ title: x.title, text: x.text, points: lines(x.points) }))} />
);
