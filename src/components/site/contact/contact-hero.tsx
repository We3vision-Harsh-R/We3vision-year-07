import type { ReactNode } from "react";
import { contactFrom } from "@/components/site/mobile/app/contact";
import { IcMail, IcPhone, IcPin, IcWhatsApp } from "@/components/site/mobile/app/icons";
import type { SiteSettings } from "@/lib/cms/settings";
import "@/styles/contact-unified.css";

// The top of the Contact page, one design for laptop and phone (owner, 2026-11-28): a label, the question, one line, and four "reach us now" cards
// (call, WhatsApp, mail, visit) made from Admin > Settings > contact cards. Styles: styles/contact-unified.css (prefix cth-).
export function ContactHero({ site }: { site: SiteSettings }) {
  const c = contactFrom(site);
  const acts: { href: string; label: string; value: string; icon: ReactNode; ext?: boolean }[] = [];
  if (c?.phone) acts.push({ href: `tel:${c.phoneHref}`, label: "Call us", value: c.phone, icon: <IcPhone /> });
  if (c?.whatsapp) acts.push({ href: `https://wa.me/${c.whatsapp}`, label: "WhatsApp", value: "Chat with us", icon: <IcWhatsApp />, ext: true });
  if (c?.email) acts.push({ href: `mailto:${c.email}`, label: "E-mail", value: c.email, icon: <IcMail /> });
  if (c?.maps) acts.push({ href: c.maps, label: "Visit us", value: site.contactCards[0]?.title || "Our office", icon: <IcPin />, ext: true });
  return (
    <header className="cth">
      <span className="hb2-pg-arch hb2-pg-a1" aria-hidden />
      <span className="hb2-pg-arch hb2-pg-a2" aria-hidden />
      <div className="hb2-wrap cth-in">
        <p className="cth-label">Contact us</p>
        <h1>
          <em>How can</em> we help you?
        </h1>
        <p className="cth-line">Choose what you want to talk about: a project, a partnership, an internship or job, or industry training. The We3vision team replies to every message.</p>
        {acts.length > 0 && (
          <nav className="cth-acts" aria-label="Reach us now">
            {acts.map((a) => (
              <a key={a.label} href={a.href} className="cth-act" {...(a.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <span className="cth-ai">{a.icon}</span>
                <span className="cth-at">
                  <span className="cth-al">{a.label}</span>
                  <span className="cth-av">{a.value}</span>
                </span>
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
