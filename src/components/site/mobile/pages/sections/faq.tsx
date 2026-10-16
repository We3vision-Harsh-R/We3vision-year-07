import type { MobileSection } from "../types";
import { QaList } from "../blocks";

export const FaqSection: MobileSection<"faq"> = ({ data, id }) => (
  <QaList id={id} chip={data.chip} heading={data.heading} intro={data.intro} items={data.items.map((x) => ({ q: x.question, a: x.answer }))} />
);
