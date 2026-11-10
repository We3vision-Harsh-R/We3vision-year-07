import type { MobileSection } from "../types";
import { AppShowcase } from "../../../modern/app-showcase";

// App showcase on the phone: the same responsive section as the laptop page (styles .aps-* in styles/app-showcase.css).
export const AppShowcaseSection: MobileSection<"appShowcase"> = ({ data }) => <AppShowcase data={data} />;
