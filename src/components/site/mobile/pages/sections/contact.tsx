import type { MobileSection } from "../types";
import { Card, GroupedList, LeadForm, ListRow, Section } from "../../app";
import { IcChevron } from "../../app/icons";
import type { SiteSettings } from "@/lib/cms/settings";
import { lines } from "../../app/text";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?\d[\d\s().-]{6,}$/;

/** the enquiry form and the contact cards: shared by the "contact" and "careerHelpDesk" sections (id="contact" is the target of the Message button) */
export function ContactBlock({ chip, heading, text, buttonLabel, site }: { chip: string; heading: string; text: string; buttonLabel: string; site: SiteSettings }) {
  return (
    <Section id="contact" chip={chip} title={heading} intro={text}>
      <Card><LeadForm buttonLabel={buttonLabel || undefined} /></Card>
      <details className="ma-fold ma-gap">
        <summary>Phone, e-mail and offices<IcChevron /></summary>
        <div className="ma-stack ma-gap">
          {site.contactCards.map((card, i) => (
            <GroupedList key={i} header={card.title}>
              {lines(card.lines).map((l, n) => (
                <ListRow key={n} title={l} href={EMAIL.test(l) ? "mailto:" + l : PHONE.test(l) ? "tel:" + l.replace(/[^\d+]/g, "") : undefined} />
              ))}
            </GroupedList>
          ))}
        </div>
      </details>
    </Section>
  );
}

export const ContactSection: MobileSection<"contact"> = ({ data, site }) => (
  <ContactBlock chip={data.chip} heading={data.heading} text={data.text} buttonLabel={data.buttonLabel} site={site} />
);
