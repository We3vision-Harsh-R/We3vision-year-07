import type { MobileSection } from "../types";
import { TextBlock } from "../blocks";
import { lines } from "../../app/text";

export const GuideSection: MobileSection<"guide"> = ({ data, id }) => (
  <TextBlock id={id} chip={data.chip} heading={data.heading} text={data.text} points={lines(data.tips)} button={{ label: data.buttonLabel, href: data.buttonHref || "#contact" }} />
);
