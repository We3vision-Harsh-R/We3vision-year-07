import type { MobileSection } from "../types";
import { RowList } from "../blocks";

export const CareerValuesSection: MobileSection<"careerValues"> = ({ data, id }) => (
  <RowList id={id} chip={data.chip} heading={data.heading} intro={data.intro} items={data.items.map((x) => ({ title: x.title, text: x.description }))} />
);
