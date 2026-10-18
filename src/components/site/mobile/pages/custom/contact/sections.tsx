import type { ReactNode } from "react";
import type { MobileSection } from "../../types";
import { AppLink, LeadForm, Section } from "../../../app";
import { IcChat, IcChevron, IcMail, IcPhone, IcPin, IcWhatsApp } from "../../../app/icons";
import { Lines, Rich, lines } from "../../../app/text";
import { Segmented } from "./client";

// /contact in iOS 27 style, like the Contacts card of We3vision: a glass monogram, the large title, four round glass quick actions
// (call, WhatsApp, mail, map) from the real settings, then one segmented control that switches between the message form (one grouped field)
// and the phone / e-mail rows, and the offices as an open list with a Maps link. Same CMS words. Styles: (m)/m/contact/page.css (prefix "mp-con-").

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?\d[\d\s().-]{6,}$/;

function Action({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <AppLink href={href} className="mp-con-act">
      <span className="mp-con-ai" aria-hidden="true">
        {icon}
      </span>
      <span className="mp-con-al">{label}</span>
    </AppLink>
  );
}

/** the top: the company's contact card, open on the page (no box) */
export const ContactCard: MobileSection<"pageHero"> = ({ data, index, site, contact }) => {
  const H = index === 0 ? "h1" : "h2";
  const name = site.legalName || site.name;
  return (
    <section className="mp-con-hero">
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
      {((data.primaryLabel && data.primaryHref) || (data.secondaryLabel && data.secondaryHref)) && (
        <div className="mp-con-btns">
          {data.primaryLabel && data.primaryHref && (
            <a className="ma-btn ma-btn-fill" href={data.primaryHref}>
              <IcChat className="mp-con-bi" />
              {data.primaryLabel}
            </a>
          )}
          {data.secondaryLabel && data.secondaryHref && (
            <a className="ma-btn ma-btn-glass" href={data.secondaryHref}>
              {data.secondaryLabel}
            </a>
          )}
        </div>
      )}
    </section>
  );
};

/** the form and the contact cards behind one segmented control */
export const ContactForm: MobileSection<"contact"> = ({ data, site }) => {
  const details = site.contactCards.map((card, i) => (
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
                  <span className="mp-con-fv">{l}</span>
                </a>
              ) : (
                <span className="mp-con-f">
                  <span className="mp-con-fv">{l}</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  ));
  const form = <LeadForm buttonLabel={data.buttonLabel || undefined} />;
  return (
    <Section id="contact" chip={data.chip} title={data.heading} intro={data.text}>
      {details.length > 0 ? <Segmented label="How to reach us" tabs={["Message", "Phone and e-mail"]} panels={[form, <div key="d" className="mp-con-list">{details}</div>]} /> : form}
    </Section>
  );
};

/** the offices: an open list, each row opens Maps (the laptop shows them on a globe) */
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
            <span className="mp-con-pb">
              <span className="mp-con-pl">{p.label}</span>
              {p.lat && p.lng && (
                <span className="mp-con-ll">
                  {p.lat}, {p.lng}
                </span>
              )}
            </span>
            <IcChevron className="mp-con-chev" />
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
