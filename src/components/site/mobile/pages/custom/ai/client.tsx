"use client";

import { useActionState, useEffect, useRef, useState, type CSSProperties } from "react";
import { submitLead, type LeadState } from "@/actions/leads";
import { useCalm } from "../../../app/use-calm";

/** the small interactive parts of /ai: a run that ticks off its steps, problem/answer switch, ask-a-question chips, and the prompt box that sends a lead */

/**
 * One run of the agent, as the grouped table of iOS Settings: a slider with a glass thumb and a stop for every step (drag it, or tap a row),
 * the step it is on shown in large letters, and every step as a row with a switch. It plays once by itself when it comes into view
 * (everything done at once with "reduce motion").
 */
export function RunSlider({ start, steps }: { start: string; steps: string[] }) {
  const calm = useCalm();
  const box = useRef<HTMLDivElement>(null);
  const n = steps.length;
  const [v, setV] = useState(0);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el || calm) return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let i = 0;
        t = window.setInterval(() => {
          i += 1;
          setV((cur) => (cur > i ? cur : i));
          if (i >= n) window.clearInterval(t);
        }, 800);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(t);
    };
  }, [calm, n]);
  const at = calm && !touched ? n : v;
  const set = (x: number) => {
    setTouched(true);
    setV(Math.max(0, Math.min(n, x)));
  };
  return (
    <div ref={box} className="mp-ai-table" style={{ "--p": at / n } as CSSProperties}>
      <div className="mp-ai-sl">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m3.5 7.5 8.5 6 8.5-6" />
        </svg>
        <div className="mp-ai-sl-box">
          <input type="range" min={0} max={n} step={1} value={at} onChange={(e) => set(Number(e.target.value))} aria-label="Step of the run" aria-valuetext={at === 0 ? start : steps[at - 1]} />
          <span className="mp-ai-sl-dots" aria-hidden="true">
            {Array.from({ length: n + 1 }, (_, i) => (
              <i key={i} style={{ "--i": i / n } as CSSProperties} />
            ))}
          </span>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </div>
      <div className="mp-ai-nowrow">
        <p key={at} className="mp-ai-now" aria-hidden="true">
          {at === 0 ? start : steps[at - 1]}
        </p>
        <div className="ma-stepper" role="group" aria-label="Step">
          <button type="button" aria-label="Previous step" disabled={at === 0} onClick={() => set(at - 1)}>
            −
          </button>
          <i aria-hidden="true" />
          <button type="button" aria-label="Next step" disabled={at === n} onClick={() => set(at + 1)}>
            +
          </button>
        </div>
      </div>
      <ul className="mp-ai-rows">
        {steps.map((s, i) => (
          <li key={i}>
            <button type="button" role="switch" aria-checked={i < at} onClick={() => set(i < at ? i : i + 1)}>
              <span>{s}</span>
              <i className="mp-ai-tg" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** a problem and what AI does about it: a two-part switch flips the card */
export function Flip({ before, after, left, right, done }: { before: string; after: string; left: string; right: string; done?: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className={`mp-ai-flip${on ? " is-ai" : ""}`}>
      <div className="mp-ai-seg" role="group">
        <i aria-hidden="true" />
        <button type="button" aria-pressed={!on} onClick={() => setOn(false)}>{left}</button>
        <button type="button" aria-pressed={on} onClick={() => setOn(true)}>{right}</button>
      </div>
      <div className="mp-ai-faces" aria-live="polite">
        {on ? (
          <p key="b" className="mp-ai-face is-b">
            {after}
            {done && <span className="mp-ai-done">{done}</span>}
          </p>
        ) : (
          <p key="a" className="mp-ai-face">{before}</p>
        )}
      </div>
    </div>
  );
}

/** suggested questions as chips; the assistant answers under them (three dots first, then the words). The first one is answered from the start. */
export function Ask({ items }: { items: { name: string; description: string }[] }) {
  const [at, setAt] = useState(items.length > 0 ? 0 : -1);
  const [typing, setTyping] = useState(false);
  const t = useRef(0);
  useEffect(() => () => window.clearTimeout(t.current), []);
  const pick = (i: number) => {
    window.clearTimeout(t.current);
    setAt(i);
    setTyping(true);
    t.current = window.setTimeout(() => setTyping(false), 650);
  };
  return (
    <div className="mp-ai-ask">
      <div className="mp-ai-chips" role="group">
        {items.map((x, i) => (
          <button key={i} type="button" aria-pressed={at === i} onClick={() => pick(i)}>{x.name}</button>
        ))}
      </div>
      <div className="mp-ai-reply-box" aria-live="polite">
        {at < 0 ? (
          <p className="mp-ai-hint">Tap an industry</p>
        ) : typing ? (
          <p className="mp-ai-dots" aria-label="Typing"><i /><i /><i /></p>
        ) : (
          <div key={at} className="mp-ai-answer">
            <b>{items[at].name}</b>
            <p>{items[at].description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** the contact as a prompt box: write what you want, the name and e-mail slide in when you start; it sends the same lead as the other forms */
export function Prompt({ label }: { label?: string }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const [open, setOpen] = useState(false);
  if (state.status === "success") {
    return (
      <p className="mp-ai-sent" role="status">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
        {state.message || "Thank you! We will contact you soon."}
      </p>
    );
  }
  return (
    <form action={action} className={`mp-ai-prompt${open ? " is-open" : ""}`}>
      <div className="mp-ai-box">
        <textarea name="message" required minLength={10} rows={open ? 4 : 2} placeholder="Tell us what you want AI to do for you" aria-label="Your message" onFocus={() => setOpen(true)} />
        <button type="submit" className="mp-ai-go" disabled={pending} aria-label={label || "Send"}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" /></svg>
        </button>
      </div>
      <div className="mp-ai-who" aria-hidden={!open}>
        <div>
          <input name="name" autoComplete="name" required minLength={2} placeholder="Your name" tabIndex={open ? 0 : -1} />
          <input name="email" type="email" inputMode="email" autoComplete="email" required placeholder="you@company.com" tabIndex={open ? 0 : -1} />
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone (optional)" tabIndex={open ? 0 : -1} />
        </div>
      </div>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="ma-hp" />
      {state.status === "error" && <p className="mp-ai-err" role="alert">{state.message}</p>}
    </form>
  );
}
