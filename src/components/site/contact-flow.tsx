"use client";

import { usePathname } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { submitLead, type LeadState } from "@/actions/leads";
import { GlowEdge } from "./glow-edge";

// The contact section as a short conversation instead of a plain form: 1. what do you want to make (tiles you can pick), 2. when would you like to
// start (chips), 3. how big is it (a slider that grows a little planet system), 4. how can we reach you. A "mission ticket" on the side fills in
// while you choose (the bars of its barcode are made from the choices, a rocket rises with the "launch readiness"). When the message is sent the
// rocket really takes off. It is sent like before (submitLead): what was picked goes at the start of the message. Nothing is required but the
// name and the e-mail (the choices count as a message).

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
const SIZES = [
  { name: "Small and quick", hint: "One clear thing, ready fast." },
  { name: "A solid project", hint: "A full website or app, made with care." },
  { name: "A big build", hint: "Several products that work together." },
  { name: "A long partnership", hint: "We become your technology team." },
];

// the bars of the ticket's barcode: the same choices always give the same bars, other choices give other bars
function bars(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const out: number[] = [];
  for (let i = 0; i < 30; i++) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) + i;
    out.push(1 + ((h >>> 0) % 3));
  }
  return out;
}

function Rocket({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 40" aria-hidden className={className}>
      <path className="cf-r-fl" d="M9 26c0 5 1.2 9 3 12 1.8-3 3-7 3-12z" />
      <path className="cf-r-bd" d="M12 1c4 4 5.5 9 5.5 15v10h-11V16C6.5 10 8 5 12 1z" />
      <circle className="cf-r-w" cx="12" cy="14" r="2.6" />
      <path className="cf-r-fn" d="M6.5 19l-4 6v3l4-2zM17.5 19l4 6v3l-4-2z" />
    </svg>
  );
}

type Props = { buttonLabel: string };

/** the first word of the name for the brief, cut at 18 characters so a very long name or a run of symbols never leaves its box */
const briefName = (n: string) => {
  const w = n.trim().split(" ")[0] ?? "";
  return w.length > 18 ? `${w.slice(0, 18)}…` : w;
};

export function ContactFlow({ buttonLabel }: Props) {
  // the fields get the iPhone look on every page except the Home page (it keeps its own look)
  const ios = usePathname() === "/" ? "" : " ios-in";
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const [step, setStep] = useState(0);
  const [needs, setNeeds] = useState<string[]>([]);
  const [when, setWhen] = useState("");
  const [text, setText] = useState("");
  const [size, setSize] = useState(1);
  const [sized, setSized] = useState(false);
  const [name, setName] = useState("");

  // the sketch canvas can put a first message into the form ("Send to our artist")
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const t = (e as CustomEvent<{ message?: string }>).detail?.message;
      if (t) {
        setText((old) => old || t);
        setStep(3);
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
  const intro = [
    needs.length ? `Interested in: ${needs.join(", ")}.` : "",
    when ? `Start: ${when}.` : "",
    sized ? `Size: ${SIZES[size].name}.` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const message = [intro, text.trim()].filter(Boolean).join("\n\n") || "I would like to talk about a project.";

  // how ready the launch is: every answer fills the fuel a little
  const pct = (needs.length ? 30 : 0) + (when ? 20 : 0) + (sized ? 20 : 0) + (step === 3 ? 10 : 0) + (name.trim().length > 1 ? 10 : 0) + (text.trim() ? 10 : 0);
  const code = bars(needs.join("|") + when + (sized ? size : ""));

  if (state.status === "success") {
    return (
      <div role="status" className="cf-done">
        <div className="cf-launch" aria-hidden>
          <Rocket className="cf-rocket" />
          <i className="cf-smoke" />
          <i className="cf-smoke cf-smoke-b" />
        </div>
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
      {/* the four steps: one line over the whole width (the form and the ticket) */}
      <div className="cf-progress" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} data-on={i <= step} />
        ))}
      </div>
      <div className="cf-main">
        <p className="cf-step">Step {step + 1} of 4</p>

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
          <div key="s2" className="cf-pane">
            <h3 className="cf-q">How big is the idea?</h3>
            <p className="cf-hint">Drag the planet system. It is only a feeling, not a price.</p>
            <div className="cf-size" style={{ "--p": size / 3 } as React.CSSProperties}>
              <div className="cf-orbits" data-touched={sized} aria-hidden>
                <span className="cf-sun" />
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="cf-ring" data-on={sized ? i <= size : i === 0} style={{ "--i": i } as React.CSSProperties}>
                    <b />
                  </span>
                ))}
              </div>
              <div className="cf-size-r">
                <p className="cf-size-n" key={size}>
                  {sized ? SIZES[size].name : "Drag to choose"}
                </p>
                <p className="cf-size-h">{sized ? SIZES[size].hint : "From a small and quick job to a long partnership."}</p>
                <input
                  type="range"
                  min={0}
                  max={3}
                  step={1}
                  value={size}
                  aria-label="How big is the project"
                  aria-valuetext={SIZES[size].name}
                  className="cf-range"
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setSized(true);
                  }}
                />
                <div className="cf-ticks" aria-hidden>
                  {SIZES.map((z, i) => (
                    <span key={z.name} data-on={sized && i <= size} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <form key="s3" action={action} className="cf-pane">
            <h3 className="cf-q">How can we reach you?</h3>
            <p className="cf-hint">We answer ourselves, usually the same day.</p>
            <div className="cf-fields">
              <label className="cf-fld">
                <span className="cf-lab">Full name</span>
                <input name="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={100} autoComplete="name" className={`cf-in${ios}`} placeholder="Your full name…" />
              </label>
              <label className="cf-fld">
                <span className="cf-lab">Email</span>
                <input name="email" type="email" inputMode="email" spellCheck={false} required maxLength={200} autoComplete="email" className={`cf-in${ios}`} placeholder="you@example.com" />
              </label>
              <label className="cf-fld cf-wide">
                <span className="cf-lab">Phone (optional)</span>
                <input name="phone" type="tel" inputMode="tel" maxLength={30} autoComplete="tel" className={`cf-in${ios}`} placeholder="+91 …" />
              </label>
              <label className="cf-fld cf-wide">
                <span className="cf-lab">Message (optional)</span>
                <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={1700} rows={4} className={`cf-in${ios}`} placeholder="Tell us a little about the project…" />
              </label>
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
              <button type="button" className="cf-back" onClick={() => setStep(2)}>
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

        {step < 3 && (
          <div className="cf-nav">
            {step > 0 ? (
              <button type="button" className="cf-back" onClick={() => setStep(step - 1)}>
                ← Back
              </button>
            ) : (
              <span />
            )}
            <button type="button" className="rp-cta" onClick={() => setStep(step + 1)}>
              <span>{(step === 0 && needs.length === 0) || (step === 2 && !sized) ? "Skip" : "Next"}</span>
              <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* the mission ticket: it fills in while you choose; the rocket rises with the launch readiness */}
      <aside className="cf-brief bglow" aria-label="Your brief" style={{ "--pct": pct / 100 } as React.CSSProperties}>
        {/* the border glow of the cards follows the pointer along the edge of the ticket */}
        <GlowEdge />
        <div className="cf-tk-top">
          <p className="cf-brief-t">Mission brief</p>
          <p className="cf-tk-no">W3V · {String(pct).padStart(3, "0")}</p>
        </div>
        <div className="cf-brief-row">
          <span>You want</span>
          <div>
            {needs.length === 0 ? (
              <em>Pick on the left</em>
            ) : (
              <>
                {needs.slice(0, 4).map((n) => (
                  <b key={n} className="cf-pill">
                    {n}
                  </b>
                ))}
                {needs.length > 4 && <b className="cf-pill cf-more">+{needs.length - 4} more</b>}
              </>
            )}
          </div>
        </div>
        <div className="cf-brief-row">
          <span>Start</span>
          <div>{when ? <b className="cf-pill">{when}</b> : <em>Not chosen yet</em>}</div>
        </div>
        <div className="cf-brief-row">
          <span>Size</span>
          <div>{sized ? <b className="cf-pill">{SIZES[size].name}</b> : <em>Not chosen yet</em>}</div>
        </div>
        {(name.trim() || text.trim()) && (
          <div className="cf-brief-row">
            <span>{name.trim() ? `From ${briefName(name)}` : "Note"}</span>
            {text.trim() && (
              <p className="cf-tk-note">
                &ldquo;{text.trim().slice(0, 90)}
                {text.trim().length > 90 ? "…" : ""}&rdquo;
              </p>
            )}
          </div>
        )}
        <div className="cf-tk-cut" aria-hidden />
        <div className="cf-fuel">
          <p>
            <span>Launch readiness</span>
            <b>{pct}%</b>
          </p>
          <div className="cf-fuel-bar" aria-hidden>
            <i />
            <Rocket className="cf-fuel-r" />
          </div>
        </div>
        <svg className="cf-code" viewBox="0 0 120 22" preserveAspectRatio="none" aria-hidden>
          {code.map((w, i) => (
            <rect key={i} x={i * 4} y="0" width={w} height="22" />
          ))}
        </svg>
        <p className="cf-brief-note">We read it before we call you, so we are ready.</p>
      </aside>
    </div>
  );
}
