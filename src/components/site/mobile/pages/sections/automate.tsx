import type { MobileSection } from "../types";
import { Section } from "../../app";
import { IaSwap } from "./ios27-a-client";

// Before -> after as an iOS segmented control: every row swaps its problem for its answer with a small crossfade (both stay in the page).
export const AutomateSection: MobileSection<"automate"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    {data.items.length > 0 && (
      <IaSwap labels={[data.beforeLabel || "Before", data.afterLabel || "After"]} rows={data.items.map((x) => ({ a: x.problem, b: x.solution }))} />
    )}
  </Section>
);
