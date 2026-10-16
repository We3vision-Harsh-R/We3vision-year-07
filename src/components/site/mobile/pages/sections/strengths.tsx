import type { MobileSection } from "../types";
import { CardList } from "../blocks";

export const StrengthsSection: MobileSection<"strengths"> = ({ data, id }) => (
  <CardList id={id} chip={data.chip} heading={data.heading} intro={data.intro} items={data.items.map((x) => ({ title: x.title, text: x.description }))} />
);
