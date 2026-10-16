"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { submitLead, type LeadState } from "@/actions/leads";
import { APPS, type WidgetKind } from "./launcher-data";
import { Ic } from "./launcher-ic";

// The widgets of the launcher. Each one is drawn inside a glass tile (the tile itself is made by launcher.tsx).
// Real data only: the time of the phone, the contact details from the site settings.

export type Contact = { phone: string; phoneHref: string; email: string; whatsapp: string; address: string; maps: string; social: { label: string; href: string }[] };

/** where a tap on the whole widget leads (none = it only shows something; ext = another website, opened in a new tab) */
export function widgetLink(kind: WidgetKind, contact: Contact | null): { href: string; glyph: string; ext?: boolean } | null {
  switch (kind) {
    case "pitch": return { href: "/contact", glyph: "mail" };
    case "contact": return { href: "/contact", glyph: "mail" };
    case "years": return { href: "/about", glyph: "about" };
    case "whatsapp": return contact?.whatsapp ? { href: `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Hello We3vision, I would like to talk about a project.")}`, glyph: "mail", ext: true } : { href: "/contact", glyph: "mail" };
    case "visit": return contact?.maps ? { href: contact.maps, glyph: "folder", ext: true } : { href: "/contact", glyph: "mail" };
    default: return null;
  }
}

/** a clock value that updates on its own, every `ms` milliseconds (only the component that uses it re-renders) */
function useNow(ms: number) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const t0 = window.setTimeout(() => setNow(new Date()), 0);
    const t = window.setInterval(() => setNow(new Date()), ms);
    return () => { window.clearTimeout(t0); window.clearInterval(t); };
  }, [ms]);
  return now;
}

/** the analog clock: the hands move on every frame (the second hand sweeps), without re-rendering anything */
function ClockInner() {
  const now = useNow(30000);
  const hr = useRef<SVGGElement>(null);
  const mn = useRef<SVGGElement>(null);
  const sc = useRef<SVGGElement>(null);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const d = new Date();
      const s = d.getSeconds() + d.getMilliseconds() / 1000;
      const m = d.getMinutes() + s / 60;
      const h = (d.getHours() % 12) + m / 60;
      if (hr.current) hr.current.style.transform = `rotate(${h * 30}deg)`;
      if (mn.current) mn.current.style.transform = `rotate(${m * 6}deg)`;
      if (sc.current) sc.current.style.transform = `rotate(${s * 6}deg)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  const day = now ? now.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase() : "THU";
  const num = now ? now.getDate() : 15;
  return (
    <>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x="49" y="5" width={i % 3 === 0 ? 2.4 : 1.4} height={i % 3 === 0 ? 7 : 4.5} rx="0.8" transform={`rotate(${i * 30} 50 50)`} className="lnc-tick" />)}
        <g ref={hr} className="lnc-hand"><rect x="48.200" y="26" width="3.600" height="26" rx="1.800" /></g>
        <g ref={mn} className="lnc-hand"><rect x="48.800" y="14" width="2.400" height="38" rx="1.200" /></g>
        <g ref={sc} className="lnc-hand lnc-s"><rect x="49.500" y="12" width="1" height="42" rx="0.500" /></g>
        <circle cx="50" cy="50" r="3.200" className="lnc-pin" />
      </svg>
      <span className="lnc-clock-d"><small>{day}</small><b>{num}</b></span>
    </>
  );
}

function CalendarInner() {
  const now = useNow(60000);
  const d = now ?? new Date(2026, 9, 16);
  const today = d.getDay();
  return (
    <>
      <small className="lnc-cal-d">{d.toLocaleDateString("en-US", { weekday: "long" })}</small>
      <b className="lnc-cal-n">{d.getDate()}</b>
      <span className="lnc-cal-m">{d.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
      <div className="lnc-cal-w" aria-hidden="true">
        {["S", "M", "T", "W", "T", "F", "S"].map((l, i) => <i key={i} className={i === today ? "is-today" : ""}>{l}</i>)}
      </div>
    </>
  );
}

function PitchInner() {
  return (
    <>
      <Image src="/brand/logo-white.webp" alt="" width={600} height={468} unoptimized />
      <b>Have an idea?<br />Let&apos;s build it.</b>
      <span>Start a project</span>
    </>
  );
}

function ContactInner({ contact }: { contact: Contact | null }) {
  return (
    <>
      <small>Talk to us</small>
      {contact ? (
        <>
          <a data-act href={`tel:${contact.phoneHref}`} className="lnc-ctc-r">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
            <span>Call us</span>
          </a>
          <a data-act href={`mailto:${contact.email}`} className="lnc-ctc-r">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M3 7l9 6.500L21 7" /></svg>
            <span>Email us</span>
          </a>
        </>
      ) : <span className="lnc-ctc-r"><span>We3vision Private Limited</span></span>}
    </>
  );
}

function YearsInner() {
  return (
    <>
      <b className="lnc-yrs-n">7</b>
      <span className="lnc-yrs-t">years of<br />We3vision</span>
      <small>Our story</small>
    </>
  );
}

function WhatsAppInner() {
  return (
    <>
      <span className="lnc-wa-i" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-7.800 13.500L3 21l4.700-1.200A9 9 0 1 0 12 3z M8.800 8.500c.3-.6.700-.6 1-.6l.5.100.8 1.800-.6.900c.5 1 1.300 1.800 2.300 2.300l.9-.6 1.800.8c0 .5-.1 1.200-.7 1.500-.9.500-2.400.2-4.200-1-1.800-1.300-2.900-3-3-4.100 0-.5.200-.8.400-1z" /></svg>
      </span>
      <b>Chat on<br />WhatsApp</b>
      <small>We are online</small>
    </>
  );
}

function VisitInner({ contact }: { contact: Contact | null }) {
  return (
    <>
      <span className="lnc-vs-i" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s7-6.100 7-11.500a7 7 0 0 0-14 0C5 14.900 12 21 12 21z M12 7.500a2.500 2.500 0 1 0 0 5 2.500 2.500 0 0 0 0-5z" /></svg></span>
      <b>Visit us</b>
      <small>{contact?.address ?? "Surat, Gujarat"}</small>
    </>
  );
}

function SocialInner({ contact }: { contact: Contact | null }) {
  const list = contact?.social ?? [];
  return (
    <>
      <small>Follow us</small>
      {list.length ? list.slice(0, 2).map((s) => (
        <a key={s.href} data-act href={s.href} target="_blank" rel="noopener noreferrer" className="lnc-ctc-r">
          <svg viewBox="0 0 24 24" aria-hidden="true">{/linkedin/i.test(s.label) ? <path d="M4 4h16v16H4z M8 10v6 M8 7.500v.01 M12 16v-6 M12 12.500c0-1.500 1-2.500 2.300-2.500S16.500 11 16.500 12.500V16" /> : <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z M12 8.500a3.500 3.500 0 1 0 0 7 3.500 3.500 0 0 0 0-7z M17.200 6.800v.01" />}</svg>
          <span>{s.label}</span>
        </a>
      )) : <span className="lnc-ctc-r"><span>We3vision</span></span>}
    </>
  );
}

function QuickInner() {
  return (
    <>
      <small>Our services</small>
      <span className="lnc-qk">
        {["web", "app", "ai", "seo"].map((id) => <a key={id} data-act href={APPS[id].href} aria-label={APPS[id].label}><Ic app={APPS[id]} mini /></a>)}
      </span>
    </>
  );
}

/** a message to We3vision, written on the home screen: it goes to the same inbox as the contact page (the lead action) */
function MessageInner() {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const done = state.status === "success";
  return (
    <form action={action} className="lnc-msg" data-act>
      <small>Send us a message</small>
      {done ? (
        <p className="lnc-msg-ok" role="status">{state.message}</p>
      ) : (
        <>
          <input name="name" placeholder="Your name" autoComplete="name" required minLength={2} aria-label="Your name" />
          <input name="email" type="email" placeholder="Your e-mail" autoComplete="email" required aria-label="Your e-mail" />
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="lnc-hp" />
          <input name="message" placeholder="How can we help?" required minLength={10} className="lnc-msg-t" aria-label="Your message" />
          <button type="submit" disabled={pending}>{pending ? "Sending…" : "Send"}</button>
          {state.status === "error" && <span className="lnc-msg-er" role="alert">{state.message}</span>}
        </>
      )}
    </form>
  );
}

export const WIDGET_CLASS: Record<WidgetKind, string> = { clock: "lnc-clock", pitch: "lnc-pitch", date: "lnc-cal", contact: "lnc-ctc", years: "lnc-yrs", whatsapp: "lnc-wa", visit: "lnc-vs", social: "lnc-ctc lnc-soc", quick: "lnc-ctc lnc-quick2", message: "lnc-mw" };

/** what is inside the glass tile of a widget */
export function WidgetInner({ kind, contact }: { kind: WidgetKind; contact: Contact | null }) {
  switch (kind) {
    case "clock": return <ClockInner />;
    case "date": return <CalendarInner />;
    case "pitch": return <PitchInner />;
    case "contact": return <ContactInner contact={contact} />;
    case "years": return <YearsInner />;
    case "whatsapp": return <WhatsAppInner />;
    case "visit": return <VisitInner contact={contact} />;
    case "social": return <SocialInner contact={contact} />;
    case "quick": return <QuickInner />;
    case "message": return <MessageInner />;
  }
}
