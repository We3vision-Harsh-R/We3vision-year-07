import type { ReactNode } from "react";
import type { MobileSection } from "../../types";
import { AppLink, LeadForm, Section } from "../../../app";
import { IcChat, IcMail, IcPhone, IcPin, IcWhatsApp } from "../../../app/icons";
import { Lines, Rich, lines } from "../../../app/text";

// /contact as the "Contacts" card of We3vision: a monogram, the four quick actions (call, WhatsApp, mail, map) from the real settings,
// the form as a "New Message" sheet, the contact cards as labelled fields, the offices with a Maps link. Same CMS words. Styles: (m)/m/contact/page.css.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?\d[\d\s().-]{6,}$/;

function Action({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <AppLink href={href} className="mp-con-act">
      <span aria-hidden="true">{icon}</span>
      {label}
    </AppLink>
  );
}

/** the top: the company's contact card */
export const ContactCard: MobileSection<"pageHero"> = ({ data, index, site, contact }) => {
  const H = index === 0 ? "h1" : "h2";
  const name = site.legalName || site.name;
  return (
    <section className="mp-con-card">
      <span className="mp-con-mono" aria-hidden="true">
        {name.trim().charAt(0).toUpperCase()}
      </span>
      <p className="mp-con-name">{name}</p>
      {data.chip && <span className="ma-chip">{data.chip}</span>}
      <H className="mp-con-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-con-t">{data.text}</p>}
      {contact && (
        <nav className="mp-con-acts" aria-label="Quick actions">
          {contact.phoneHref && <Action href={"tel:" + contact.phoneHref} label="Call" icon={<IcPhone />} />}
          {contact.whatsapp && <Action href={"https://wa.me/" + contact.whatsapp} label="WhatsApp" icon={<IcWhatsApp />} />}
          {contact.email && <Action href={"mailto:" + contact.email} label="Mail" icon={<IcMail />} />}
          {contact.maps && <Action href={contact.maps} label="Map" icon={<IcPin />} />}
        </nav>
      )}
      <div className="mp-con-links">
        {data.primaryLabel && data.primaryHref && (
          <a className="ma-btn ma-btn-fill ma-btn-block" href={data.primaryHref}>
            <IcChat className="mp-con-bi" />
            {data.primaryLabel}
          </a>
        )}
        {data.secondaryLabel && data.secondaryHref && (
          <a className="ma-btn ma-btn-glass ma-btn-block" href={data.secondaryHref}>
            {data.secondaryLabel}
          </a>
        )}
      </div>
    </section>
  );
};

/** the form as a message sheet, then the contact cards of the settings as labelled fields */
export const ContactForm: MobileSection<"contact"> = ({ data, site }) => (
  <Section id="contact" chip={data.chip} title={data.heading} intro={data.text}>
    <div className="mp-con-sheet">
      <div className="mp-con-grab" aria-hidden="true" />
      <LeadForm buttonLabel={data.buttonLabel || undefined} />
    </div>
    {site.contactCards.map((card, i) => (
      <div key={i} className="mp-con-fields">
        {card.title && <p className="mp-con-fh">{card.title}</p>}
        <ul>
          {lines(card.lines).map((l, n) => {
            const kind = EMAIL.test(l) ? "email" : PHONE.test(l) ? "phone" : "";
            const href = kind === "email" ? "mailto:" + l : kind === "phone" ? "tel:" + l.replace(/[^\d+]/g, "") : undefined;
            return (
              <li key={n}>
                {href ? (
                  <a href={href} className="mp-con-f is-link">
                    <span className="mp-con-fk">{kind}</span>
                    {l}
                  </a>
                ) : (
                  <span className="mp-con-f">{l}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </Section>
);

/** the offices: one card per place with a Maps link (the laptop shows them on a globe) */
export const ContactReach: MobileSection<"reach"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading}>
    {data.text && (
      <p className="mp-con-rt">
        <Rich text={data.text} />
      </p>
    )}
    <ul className="mp-con-places">
      {data.places.map((p, i) => (
        <li key={i}>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.lat && p.lng ? `${p.lat},${p.lng}` : p.label)}`} target="_blank" rel="noopener noreferrer" className="mp-con-place">
            <span className="mp-con-pin" aria-hidden="true">
              <IcPin />
            </span>
            <span className="mp-con-pl">{p.label}</span>
            {p.lat && p.lng && (
              <span className="mp-con-ll">
                {p.lat}, {p.lng}
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
    {data.buttonLabel && (
      <div className="ma-actions">
        <a className="ma-btn ma-btn-tinted ma-btn-block" href={data.buttonHref || "#contact"}>
          {data.buttonLabel}
        </a>
      </div>
    )}
  </Section>
);
