import type { MobileSection } from "../types";
import { RowList } from "../blocks";

export const AdvantagesSection: MobileSection<"advantages"> = ({ data, id }) => (
  <RowList id={id} chip={data.chip} heading={data.heading} intro={data.intro} items={data.items.map((x) => ({ title: x.title, text: x.description }))} />
);
