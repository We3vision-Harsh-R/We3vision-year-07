"use client";

import { useActionState, useEffect, useState } from "react";
import { submitLead, type LeadState } from "@/actions/leads";

// The contact section as a short conversation instead of a plain form: 1. what do you want to make (tiles you can pick), 2. when would you like to
// start (chips), 3. how can we reach you. A "brief" card on the side fills in while you choose, so the visitor sees something happen. At the end
// it is sent like before (submitLead): what was picked goes at the start of the message. Nothing is required but the name, the e-mail and, in
// the end, a message that is not empty (the choices count as a message).

const NEEDS: { id: string; label: string; icon: string }[] = [
  { id: "A website", label: "Website", icon: "M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01" },
  { id: "A mobile app", label: "Mobile app", icon: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2" },
  { id: "AI / chatbot", label: "AI / chatbot", icon: "M12 3v3M12 18v3M3 12h3M18 12h3M7.5 7.5l2 2M14.5 14.5l2 2M16.5 7.5l-2 2M9.5 14.5l-2 2M9 9h6v6H9z" },
  { id: "VR / metaverse", label: "VR / metaverse", icon: "M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3.5l-1.5-2h-4l-1.5 2H5a2 2 0 0 1-2-2z" },
  { id: "Brand design", label: "Brand design", icon: "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" },
  { id: "UI/UX design", label: "UI/UX design", icon: "M4 20l4-1 11-11a2.1 2.1 0 0 0-3-3L5 16zM14 6l3 3" },
  { id: "CRM / software", label: "CRM / software", icon: "M4 6h16M4 12h16M4 18h10" },
  { id: "Something else", label: "Something else", icon: "M12 5v14M5 12h14" },
];
const WHEN = ["As soon as possible", "In 1 to 3 months", "I am just exploring"];

type Props = { buttonLabel: string };

export function ContactFlow({ buttonLabel }: Props) {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const [step, setStep] = useState(0);
  const [needs, setNeeds] = useState<string[]>([]);
  const [when, setWhen] = useState("");
  const [text, setText] = useState("");

  // the sketch canvas can put a first message into the form ("Send to our artist")
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const t = (e as CustomEvent<{ message?: string }>).detail?.message;
      if (t) {
        setText((old) => old || t);
        setStep(2);
      }
    };
    window.addEventListener("w3v-prefill", onPrefill);
    return () => window.removeEventListener("w3v-prefill", onPrefill);
  }, []);

  const toggle = (id: string) => setNeeds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const tilt = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--ry", `${(((e.clientX - r.left) / r.width - 0.5) * 12).toFixed(1)}deg`);
    e.currentTarget.style.setProperty("--rx", `${(-((e.clientY - r.top) / r.height - 0.5) * 12).toFixed(1)}deg`);
  };
  const untilt = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty("--ry", "0deg");
    e.currentTarget.style.setProperty("--rx", "0deg");
  };

  // what is sent: the choices first, then what the visitor wrote
  const intro = [needs.length ? `Interested in: ${needs.join(", ")}.` : "", when ? `Start: ${when}.` : ""].filter(Boolean).join("\n");
  const message = [intro, text.trim()].filter(Boolean).join("\n\n") || "I would like to talk about a project.";

  if (state.status === "success") {
    return (
      <div role="status" className="cf-done">
        <svg viewBox="0 0 52 52" aria-hidden className="cf-check">
          <circle cx="26" cy="26" r="23" />
          <path d="M15 27l8 8 14-16" />
        </svg>
        <p className="cf-done-t">Message sent</p>
        <p className="cf-done-p">{state.message}</p>
      </div>
    );
  }

  return (
    <div className="cf">
      <div className="cf-main">
        <div className="cf-progress" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} data-on={i <= step} />
          ))}
        </div>
        <p className="cf-step">Step {step + 1} of 3</p>

        {step === 0 && (
          <div key="s0" className="cf-pane">
            <h3 className="cf-q">What would you like to make?</h3>
            <p className="cf-hint">Pick as many as you like.</p>
            <div className="cf-tiles">
              {NEEDS.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className="cf-tile"
                  aria-pressed={needs.includes(n.id)}
                  onClick={() => toggle(n.id)}
                  onPointerMove={tilt}
                  onPointerLeave={untilt}
                >
                  <svg viewBox="0 0 24 24" aria-hidden className="cf-ic">
                    <path d={n.icon} />
                  </svg>
                  <span>{n.label}</span>
                  <i aria-hidden className="cf-tick" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div key="s1" className="cf-pane">
            <h3 className="cf-q">When would you like to start?</h3>
            <p className="cf-hint">There is no wrong answer.</p>
            <div className="cf-chips">
              {WHEN.map((w) => (
                <button key={w} type="button" className="cf-chip" aria-pressed={when === w} onClick={() => setWhen(when === w ? "" : w)}>
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <form key="s2" action={action} className="cf-pane">
            <h3 className="cf-q">How can we reach you?</h3>
            <p className="cf-hint">We answer ourselves, usually the same day.</p>
            <div className="cf-fields">
              <input name="name" required minLength={2} maxLength={100} autoComplete="name" aria-label="Full name" className="cf-in" placeholder="Your name" />
              <input name="email" type="email" required maxLength={200} autoComplete="email" aria-label="Email" className="cf-in" placeholder="Your email" />
              <input name="phone" type="tel" maxLength={30} autoComplete="tel" aria-label="Phone (optional)" className="cf-in cf-wide" placeholder="Phone (optional)" />
              <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={1700} rows={4} aria-label="Message (optional)" className="cf-in cf-wide" placeholder="Tell us a little about the project (optional)" />
            </div>
            <input type="hidden" name="message" value={message} />
            {/* Honeypot: hidden from people, bots fill it in. */}
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
            {state.status === "error" && (
              <p role="alert" className="cf-err">
                {state.message}
              </p>
            )}
            <div className="cf-nav">
              <button type="button" className="cf-back" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button type="submit" className="rp-cta" disabled={pending}>
                <span>{pending ? "Sending…" : buttonLabel}</span>
                <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </form>
        )}

        {step < 2 && (
          <div className="cf-nav">
            {step > 0 ? (
              <button type="button" className="cf-back" onClick={() => setStep(step - 1)}>
                ← Back
              </button>
            ) : (
              <span />
            )}
            <button type="button" className="rp-cta" onClick={() => setStep(step + 1)}>
              <span>{step === 0 && needs.length === 0 ? "Skip" : "Next"}</span>
              <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* the brief: it fills in while you choose */}
      <aside className="cf-brief" aria-label="Your brief">
        <p className="cf-brief-t">Your brief</p>
        <div className="cf-brief-row">
          <span>You want</span>
          <div>
            {needs.length === 0 ? (
              <em>Pick on the left</em>
            ) : (
              needs.map((n) => (
                <b key={n} className="cf-pill">
                  {n}
                </b>
              ))
            )}
          </div>
        </div>
        <div className="cf-brief-row">
          <span>Start</span>
          <div>{when ? <b className="cf-pill">{when}</b> : <em>Not chosen yet</em>}</div>
        </div>
        <p className="cf-brief-note">We read it before we call you, so we are ready.</p>
      </aside>
    </div>
  );
}
