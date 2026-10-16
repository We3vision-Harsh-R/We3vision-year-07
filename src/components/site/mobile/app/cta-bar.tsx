import type { ContactInfo } from "./contact";
import { IcChat, IcPhone, IcWhatsApp } from "./icons";
import { AppLink } from "./link";

/** The sticky bottom bar of liquid glass: Call, WhatsApp, Message. Uses the real details from the site settings; hides what is missing. */
export function CtaBar({ contact, messageHref }: { contact: ContactInfo | null; messageHref: string }) {
  return (
    <nav className="ma-cta" aria-label="Contact us">
      {contact?.phoneHref && (
        <a href={`tel:${contact.phoneHref}`}>
          <IcPhone />
          Call
        </a>
      )}
      {contact?.whatsapp && (
        <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
          <IcWhatsApp />
          WhatsApp
        </a>
      )}
      <AppLink href={messageHref} className="is-main">
        <IcChat />
        Message
      </AppLink>
    </nav>
  );
}
