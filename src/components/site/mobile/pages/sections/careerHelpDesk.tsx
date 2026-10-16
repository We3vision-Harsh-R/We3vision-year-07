import type { MobileSection } from "../types";
import { ContactBlock } from "./contact";

// The help desk is the same enquiry form as the contact section.
export const CareerHelpDeskSection: MobileSection<"careerHelpDesk"> = ({ data, site }) => (
  <ContactBlock chip={data.chip} heading={data.heading} text={data.text} buttonLabel={data.buttonLabel} site={site} />
);
