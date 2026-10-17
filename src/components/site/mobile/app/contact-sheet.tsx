"use client";

import type { ContactInfo } from "./contact";
import { IcChat, IcChevron, IcMail, IcPhone, IcWhatsApp } from "./icons";
import { AppLink } from "./link";
import { useSheet } from "./use-sheet";

/** the small sheet behind the phone button: Call, WhatsApp, E-mail and the message form (real details from Admin > Settings) */
export function ContactSheet({ open, onClose, contact, messageHref, onJump }: { open: boolean; onClose: () => void; contact: ContactInfo | null; messageHref: string; onJump: (id: string) => void }) {
  const { shown, state, drag, grab } = useSheet(open, onClose);
  if (!shown) return null;
  const toForm = messageHref.startsWith("#");
  return (
    <div className="ma-sheet" data-state={state} role="dialog" aria-modal="true" aria-label="Contact us">
      <button type="button" className="ma-sheet-back" aria-label="Close" tabIndex={-1} onClick={onClose} />
      <div className="ma-sheet-panel ma-sheet-sm" style={drag ? { transform: `translate3d(0, ${drag}px, 0)`, transition: "none" } : undefined}>
        <div className="ma-sheet-grab" {...grab}>
          <i />
        </div>
        <div className="ma-sheet-head">
          <b>Talk to We3vision</b>
          <button type="button" className="ma-sheet-x" onClick={onClose} aria-label="Close">
            Done
          </button>
        </div>
        <ul className="ma-sheet-list">
          {contact?.phone && (
            <li>
              <a className="ma-sheet-row" href={`tel:${contact.phoneHref}`}>
                <span className="ma-sheet-tile ma-tile-green"><IcPhone /></span>
                <span className="ma-sheet-txt"><b>Call</b><small>{contact.phone}</small></span>
                <IcChevron className="ma-sheet-chev" />
              </a>
            </li>
          )}
          {contact?.whatsapp && (
            <li>
              <a className="ma-sheet-row" href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <span className="ma-sheet-tile ma-tile-wa"><IcWhatsApp /></span>
                <span className="ma-sheet-txt"><b>WhatsApp</b><small>Chat with us</small></span>
                <IcChevron className="ma-sheet-chev" />
              </a>
            </li>
          )}
          {contact?.email && (
            <li>
              <a className="ma-sheet-row" href={`mailto:${contact.email}`}>
                <span className="ma-sheet-tile ma-tile-blue"><IcMail /></span>
                <span className="ma-sheet-txt"><b>E-mail</b><small>{contact.email}</small></span>
                <IcChevron className="ma-sheet-chev" />
              </a>
            </li>
          )}
          <li>
            {toForm ? (
              <button type="button" className="ma-sheet-row" onClick={() => onJump(messageHref.slice(1))}>
                <span className="ma-sheet-tile ma-tile-tint"><IcChat /></span>
                <span className="ma-sheet-txt"><b>Send a message</b><small>Open the form on this page</small></span>
                <IcChevron className="ma-sheet-chev" />
              </button>
            ) : (
              <AppLink href={messageHref} className="ma-sheet-row">
                <span className="ma-sheet-tile ma-tile-tint"><IcChat /></span>
                <span className="ma-sheet-txt"><b>Send a message</b><small>Open the contact page</small></span>
                <IcChevron className="ma-sheet-chev" />
              </AppLink>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
