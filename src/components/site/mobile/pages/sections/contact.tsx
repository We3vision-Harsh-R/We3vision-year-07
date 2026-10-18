import type { MobileSection } from "../types";
import { AppLink, LeadForm, Section } from "../../app";
import { IcChevron } from "../../app/icons";
import type { SiteSettings } from "@/lib/cms/settings";
import { lines } from "../../app/text";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?\d[\d\s().-]{6,}$/;

/** the enquiry form (one glass card: it groups a form) and the contact lines as an open list: shared by the "contact" and "careerHelpDesk" sections (id="contact" is the target of the Message button) */
export function ContactBlock({ chip, heading, text, buttonLabel, site }: { chip: string; heading: string; text: string; buttonLabel: string; site: SiteSettings }) {
  return (
    <Section id="contact" chip={chip} title={heading} intro={text}>
      <div className="ma-s27 ma-s27-glass ma-s27-form">
        <LeadForm buttonLabel={buttonLabel || undefined} />
      </div>
      {site.contactCards.length > 0 && (
        <details className="ma-s27 ma-s27-more">
          <summary>
            <span>Phone, e-mail and offices</span>
            <i aria-hidden="true" />
          </summary>
          <div className="ma-s27-cards">
            {site.contactCards.map((card, i) => (
              <section key={i}>
                {card.title && <h3>{card.title}</h3>}
                <ul>
                  {lines(card.lines).map((l, n) => {
                    const href = EMAIL.test(l) ? "mailto:" + l : PHONE.test(l) ? "tel:" + l.replace(/[^\d+]/g, "") : "";
                    return (
                      <li key={n}>
                        <AppLink href={href} className={href ? "ma-s27-link" : "ma-s27-txt"}>
                          <span>{l}</span>
                          {href && <IcChevron />}
                        </AppLink>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </details>
      )}
    </Section>
  );
}

export const ContactSection: MobileSection<"contact"> = ({ data, site }) => (
  <ContactBlock chip={data.chip} heading={data.heading} text={data.text} buttonLabel={data.buttonLabel} site={site} />
);
