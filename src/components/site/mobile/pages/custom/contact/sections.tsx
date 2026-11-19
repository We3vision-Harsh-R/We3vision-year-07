import type { ReactNode } from "react";
import type { MobileSection } from "../../types";
import { AppLink, LeadForm, Section } from "../../../app";
import { IcChat, IcChevron, IcMail, IcPhone, IcPin, IcWhatsApp } from "../../../app/icons";
import { Lines, Rich, lines } from "../../../app/text";
import { Segmented } from "./client";
import { GTA_ON } from "@/lib/gta";

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


/** GTA-style theme (lib/gta.ts): the classes of this page that only exist while the theme is on (styles: (m)/m/contact/page.css, prefix "gtc-") */
const g = (c: string) => (GTA_ON ? ` ${c}` : "");

/** our own drawing: a neon sunset with a striped sun, a skyline and two palms (decorative) */
const TOWERS: [number, number, number][] = [[0, 22, 54], [24, 16, 80], [42, 26, 46], [70, 14, 96], [86, 24, 62], [112, 18, 40], [132, 28, 88], [162, 16, 56], [180, 24, 104], [206, 18, 66], [226, 26, 44], [254, 14, 84], [270, 22, 58], [294, 18, 94], [314, 28, 50], [344, 16, 72]];
function Scene() {
  return (
    <svg className="gtc-scene" viewBox="0 0 360 230" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gtc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "hsl(calc(var(--th) + 330) calc(70% * var(--ts)) 8%)" }} />
          <stop offset="0.55" style={{ stopColor: "hsl(calc(var(--th) + 20) calc(80% * var(--ts)) 30%)" }} />
          <stop offset="1" style={{ stopColor: "hsl(calc(var(--th) + 70) calc(100% * var(--ts)) 58%)" }} />
        </linearGradient>
        <linearGradient id="gtc-sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "hsl(calc(var(--th) + 100) calc(100% * var(--ts)) 70%)" }} />
          <stop offset="1" style={{ stopColor: "hsl(calc(var(--th) + 40) calc(100% * var(--ts)) 58%)" }} />
        </linearGradient>
        <mask id="gtc-cut">
          <rect width="360" height="230" fill="#fff" />
          <rect y="128" width="360" height="3" />
          <rect y="140" width="360" height="4" />
          <rect y="153" width="360" height="5" />
          <rect y="167" width="360" height="6" />
        </mask>
      </defs>
      <rect width="360" height="230" fill="url(#gtc-sky)" />
      <circle cx="180" cy="128" r="70" fill="url(#gtc-sun)" mask="url(#gtc-cut)" />
      <g style={{ fill: "hsl(calc(var(--th) + 335) calc(60% * var(--ts)) 9%)" }}>
        {TOWERS.map(([x, w, h], i) => (
          <rect key={i} x={x} y={230 - h} width={w} height={h} />
        ))}
      </g>
      <g style={{ fill: "hsl(calc(var(--th) + 100) calc(100% * var(--ts)) 70%)" }} opacity="0.9">
        {TOWERS.filter((_, i) => i % 3 === 1).map(([x, , h], i) => (
          <rect key={i} x={x + 4} y={230 - h + 8} width="3" height="3" />
        ))}
      </g>
      {[28, 318].map((x, i) => (
        <g key={x} transform={`translate(${x} 230) scale(${i ? -1 : 1} 1)`} style={{ stroke: "hsl(calc(var(--th) + 340) calc(60% * var(--ts)) 4%)", fill: "none" }} strokeLinecap="round">
          <path d="M0 0 Q 8 -50 2 -104" strokeWidth="5" />
          <path d="M2 -104 Q 26 -122 50 -100 M2 -104 Q 30 -108 44 -84 M2 -104 Q -22 -124 -48 -100 M2 -104 Q -26 -108 -40 -84 M2 -104 Q 4 -130 18 -140" strokeWidth="4" />
        </g>
      ))}
    </svg>
  );
}

/** one entry of the phone book: a round avatar, the name and what it does */
function Entry({ href, label, sub, icon }: { href: string; label: string; sub: string; icon: ReactNode }) {
  return (
    <AppLink href={href} className="gtc-entry">
      <span className="gtc-av" aria-hidden="true">
        {icon}
      </span>
      <span className="gtc-en">
        <b>{label}</b>
        <small>{sub}</small>
      </span>
      <IcChevron className="gtc-go" />
    </AppLink>
  );
}

/** the top: the company's contact card, open on the page (no box) */
export const ContactCard: MobileSection<"pageHero"> = ({ data, index, site, contact }) => {
  const H = index === 0 ? "h1" : "h2";
  const name = site.legalName || site.name;
  return (
    <section className={`mp-con-hero${g("gtc-hero")}`}>
      {GTA_ON ? (
        <Scene />
      ) : (
        <span className="mp-con-mono" aria-hidden="true">
          {name.trim().charAt(0).toUpperCase()}
        </span>
      )}
      <p className="mp-con-name">{name}</p>
      {data.chip && <span className="ma-chip">{data.chip}</span>}
      <H className="mp-con-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-con-t">{data.text}</p>}
      {contact && GTA_ON && (
        <nav className="gtc-book" aria-label="Quick actions">
          <p className="gtc-bh">Contacts</p>
          {contact.phoneHref && <Entry href={"tel:" + contact.phoneHref} label="Call" sub={contact.phoneHref} icon={<IcPhone />} />}
          {contact.whatsapp && <Entry href={"https://wa.me/" + contact.whatsapp} label="WhatsApp" sub="Chat with us" icon={<IcWhatsApp />} />}
          {contact.email && <Entry href={"mailto:" + contact.email} label="Mail" sub={contact.email} icon={<IcMail />} />}
          {contact.maps && <Entry href={contact.maps} label="Map" sub="Open in Maps" icon={<IcPin />} />}
        </nav>
      )}
      {contact && !GTA_ON && (
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
      <div className={g("gtc-phone")}>
        {GTA_ON && (
          <p className="gtc-top" aria-hidden="true">
            <span>We3vision</span>
            <span>Messages</span>
          </p>
        )}
        {details.length > 0 ? <Segmented label="How to reach us" tabs={["Message", "Phone and e-mail"]} panels={[form, <div key="d" className="mp-con-list">{details}</div>]} /> : form}
      </div>
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
    <ul className={`mp-con-places${g("gtc-ways")}`}>
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
