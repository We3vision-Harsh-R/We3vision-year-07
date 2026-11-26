"use client";

import { useActionState, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { submitLead, type LeadState } from "@/actions/leads";
import { SmartLink } from "@/components/site/smart-link";
import { leadProblems, limitPhone, type LeadProblems, type LeadValues } from "@/lib/contact-validation";
import "@/styles/home-talk.css";

// The contact section of the home page as a sentence the visitor completes ("Hi We3vision, I am ... You can reach me at ..."): when the section comes into view
// the sentence appears word by word (a soft blur that clears, each word lit for a moment), and a glowing signal lights one ring for every part that is right.
// Same server action and same rules as the Contact page (actions/leads.ts, lib/contact-validation.ts): the fields are name, email, phone and message;
// what the visitor wants to build is written in front of the idea. CSS prefix: tk- (styles/home-talk.css). One font, one weight, one accent colour.

type Key = keyof LeadValues;
const ORDER: Key[] = ["name", "email", "phone", "message"];
const WANTS = ["A website", "A mobile app", "An AI solution", "A metaverse or VR world", "UI/UX design", "Brand design", "Something else"];
const R = 92;
const C = 2 * Math.PI * R;
const QUARTER = C / 4 - 14;

const IcMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
const IcPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);

export function HomeTalk({ lines }: { lines: string[] }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [idea, setIdea] = useState("");
  const [want, setWant] = useState("");
  const [seen, setSeen] = useState<Partial<Record<Key, boolean>>>({});
  const ref = useRef<HTMLFormElement>(null);
  const root = useRef<HTMLElement>(null);
  const [shownIn, setShownIn] = useState(false);

  // the section appears when it comes into view (once)
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (list) => {
        if (list.some((x) => x.isIntersecting)) {
          setShownIn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const message = `${want ? `I am looking for: ${want}.\n` : ""}${idea}`.trim();
  const values: LeadValues = { name, email, phone, message };
  const problems: LeadProblems = leadProblems(values, { phoneRequired: true });
  const ok = (k: Key) => Boolean(values[k].trim()) && !problems[k];
  const done = ORDER.filter(ok).length;
  const sent = state.status === "success";
  const shown = (k: Key) => (seen[k] ? problems[k] : undefined);
  const leave = (k: Key) => setSeen((x) => ({ ...x, [k]: true }));
  const bad = (k: Key) => (shown(k) ? { "aria-invalid": true as const, "aria-describedby": `tk-e-${k}` } : {});
  const firstError = ORDER.map((k) => ({ k, t: shown(k) })).find((x) => x.t);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (Object.keys(problems).length === 0) return;
    e.preventDefault();
    setSeen({ name: true, email: true, phone: true, message: true });
    const first = ORDER.find((k) => problems[k]);
    if (first) ref.current?.querySelector<HTMLElement>(first === "message" ? "[data-tk=idea]" : `[name="${first}"]`)?.focus();
  };

  const status = sent ? "Sent. We will write back soon." : pending ? "Sending your message…" : done === 4 ? "All set. Press send." : done === 0 ? "Fill the blanks and send." : `${done} of 4 ready`;

  // the words of the sentence appear one after the other: every word (and every blank) gets its place in the row
  let n = 0;
  const words = (text: string) =>
    text
      .split(" ")
      .filter(Boolean)
      .map((w) => (
        <span key={`${n}-${w}`} className="tk-w" style={{ "--i": n++ } as CSSProperties}>
          {w}{" "}
        </span>
      ));
  const blank = (node: ReactNode) => (
    <span className="tk-w" style={{ "--i": n++ } as CSSProperties}>
      {node}{" "}
    </span>
  );

  return (
    <section ref={root} className="tk" id="contact" aria-labelledby="hb2-t8" data-in={shownIn ? "" : undefined}>
      <noscript>
        <style>{".tk .tk-w,.tk .tk-rv{opacity:1!important;filter:none!important;transform:none!important}"}</style>
      </noscript>
      <div className="hb2-wrap tk-grid">
        <div className="tk-main">
        <div className="tk-head">
          <p className="tk-k tk-rv" style={{ "--d": "0ms" } as CSSProperties}>
            Let&apos;s talk
          </p>
          <h2 id="hb2-t8" className="tk-rv" style={{ "--d": "90ms" } as CSSProperties}>
            Have an idea? <em>Let&apos;s build it together.</em>
          </h2>
          <p className="tk-cap tk-rv" style={{ "--d": "180ms" } as CSSProperties}>
            Fill in the blanks below and tell us what you want to make. The We3vision team will get back to you.
          </p>
        </div>

          {sent ? (
            <div className="tk-ok" role="status" aria-live="polite">
              <strong>Message sent</strong>
              <p>{state.status === "success" ? state.message : ""}</p>
            </div>
          ) : (
            <form ref={ref} action={action} onSubmit={onSubmit} noValidate className="tk-form">
              <p className="tk-line">
                {words("Hi We3vision, I am")}
                {blank(
                  <input
                    className="tk-in"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => leave("name")}
                    maxLength={100}
                    autoComplete="name"
                    placeholder="your name"
                    aria-label="Your name"
                    {...bad("name")}
                  />,
                )}
                {words(". You can write to me at")}
                {blank(
                  <input
                    className="tk-in"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => leave("email")}
                    maxLength={200}
                    autoComplete="email"
                    placeholder="you@company.com"
                    aria-label="Your email"
                    {...bad("email")}
                  />,
                )}
                {words("or call me on")}
                {blank(
                  <input
                    className="tk-in"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(limitPhone(e.target.value))}
                    onBlur={() => leave("phone")}
                    maxLength={20}
                    autoComplete="tel"
                    placeholder="+91"
                    aria-label="Your mobile number"
                    {...bad("phone")}
                  />,
                )}
              </p>
              <p className="tk-line tk-line2">{words("I would like help with")}</p>
              <div className="tk-wants tk-rv" role="group" aria-label="What you want to build" style={{ "--d": `${n * 55 + 100}ms` } as CSSProperties}>
                {WANTS.map((w) => (
                  <button key={w} type="button" aria-pressed={want === w} data-on={want === w} onClick={() => setWant(want === w ? "" : w)}>
                    {w}
                  </button>
                ))}
              </div>
              <p className="tk-line tk-line2">{words("Here is my idea:")}</p>
              <textarea
                className="tk-idea tk-rv"
                style={{ "--d": `${n * 55 + 200}ms` } as CSSProperties}
                data-tk="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onBlur={() => leave("message")}
                maxLength={1800}
                rows={2}
                placeholder="Tell us in a few lines what you want to make."
                aria-label="Your idea"
                {...bad("message")}
              />
              <input type="hidden" name="message" value={message} />
              <input type="hidden" name="phoneRequired" value="1" />
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="tk-hp" />
              {firstError && (
                <p id={`tk-e-${firstError.k}`} className="tk-err" role="alert">
                  {firstError.t}
                </p>
              )}
              {state.status === "error" && (
                <p className="tk-err" role="alert">
                  {state.message}
                </p>
              )}
              <button type="submit" className="hb2-m-btn tk-send tk-rv" style={{ "--d": `${n * 55 + 300}ms` } as CSSProperties} disabled={pending} aria-busy={pending}>
                {pending ? "Sending…" : "Send my message"} <span aria-hidden>→</span>
              </button>
            </form>
          )}
        </div>

        <aside className="tk-card tk-rv" style={{ "--d": "300ms" } as CSSProperties} aria-label="Contact details">
          <div className="tk-orb" data-done={done} data-sent={sent} data-busy={pending} aria-hidden>
            <svg viewBox="0 0 220 220">
              <circle className="tk-r-dash" cx="110" cy="110" r="106" />
              {ORDER.map((k, i) => (
                <circle
                  key={k}
                  className="tk-r-arc"
                  data-on={ok(k) || sent}
                  cx="110"
                  cy="110"
                  r={R}
                  strokeDasharray={`${QUARTER} ${C - QUARTER}`}
                  style={{ transform: `rotate(${-90 + i * 90 + 7}deg)`, transformOrigin: "110px 110px" } as CSSProperties}
                />
              ))}
            </svg>
            <i className="tk-ripple" />
            <i className="tk-ripple tk-ripple2" />
            <img className="tk-mark" src="/brand/logo-mark.webp" alt="" width={480} height={395} />
          </div>
          <p className="tk-status" aria-live="polite">
            {status}
          </p>
          <div className="tk-or">
            <span>or reach us directly</span>
          </div>
          <ul className="tk-cl">
            {lines.map((t) => {
              const mail = t.includes("@");
              return (
                <li key={t}>
                  <a href={mail ? `mailto:${t}` : `tel:${t.replace(/\s/g, "")}`}>
                    <span className="tk-ic">{mail ? <IcMail /> : <IcPhone />}</span>
                    <span className="tk-ct">
                      <small>{mail ? "Email us" : "Call us"}</small>
                      {t}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          <SmartLink href="/contact" className="tk-all">
            All contact details <span aria-hidden>→</span>
          </SmartLink>
        </aside>
      </div>
    </section>
  );
}
