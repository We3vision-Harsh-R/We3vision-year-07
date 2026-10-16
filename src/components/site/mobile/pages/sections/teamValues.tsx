import type { MobileSection } from "../types";
import { CardList } from "../blocks";

export const TeamValuesSection: MobileSection<"teamValues"> = ({ data, id }) => (
  <CardList id={id} chip={data.chip} heading={data.heading} intro={data.intro} items={data.items} />
);
