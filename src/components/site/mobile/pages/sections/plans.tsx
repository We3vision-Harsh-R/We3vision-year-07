import type { MobileSection } from "../types";
import { Plans } from "../../../modern/plans";

// Plans & pricing on the phone: the same responsive section as the laptop page (one column, smaller tilt below 1000px), styles .pln-* in styles/plans.css.
export const PlansSection: MobileSection<"plans"> = ({ data }) => <Plans data={data} />;
