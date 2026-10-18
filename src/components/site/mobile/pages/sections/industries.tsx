import type { MobileSection } from "../types";
import { Section } from "../../app";
import { oneLine } from "../../app/text";
import { IndustryPicker } from "./ios27-b-client";

/** the industries: capsules to pick one, its answer under them */
export const IndustriesSection: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="ma-s27 ma-rvx">
      <IndustryPicker id={id} items={data.items.map((x) => ({ name: oneLine(x.name), description: x.description }))} />
    </div>
  </Section>
);
