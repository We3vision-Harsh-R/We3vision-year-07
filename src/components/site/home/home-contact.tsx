"use client";

import { useActionState, useRef, useState, type FormEvent } from "react";
import { GlassSelect } from "@/components/site/glass-select";
import { GlimmerArt } from "@/components/site/glimmer-art";
import { submitLead, type LeadState } from "@/actions/leads";
import { leadProblems, limitPhone, type LeadProblems, type LeadValues } from "@/lib/contact-validation";
import type { Topic } from "@/lib/contact-topics";

// The contact form of the home design. Same server action and same rules as the form of the live site (actions/leads.ts, lib/contact-validation.ts):
// every field is checked when the visitor leaves it, a spinner shows while it is sent, and the answer is read out.
type Key = keyof LeadValues;
const ORDER: Key[] = ["name", "email", "phone", "message"];

/** `topic` = the Contact page topic (extra questions, the wording of the message box and the button); `courses` = the names for the "Domain" choice; `ticked` = ways that start ticked */
/** a choice list in the glass dropdown of the site; the chosen value travels in a hidden field with the form */
function PickOne({ name, opts, label }: { name: string; opts: string[]; label: string }) {
  const [v, setV] = useState(opts[0]);
  return (
    <>
      <input type="hidden" name={name} value={v} />
      <GlassSelect value={v} options={opts.map((o) => ({ value: o, label: o }))} onChange={setV} label={label} className="ctd-gs" />
    </>
  );
}

export function HomeContact({ topic, courses = [], ticked = [] }: { topic?: Topic; courses?: string[]; ticked?: string[] } = {}) {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const [v, setV] = useState<LeadValues>({ name: "", email: "", phone: "", message: "" });
  const [seen, setSeen] = useState<Partial<Record<Key, boolean>>>({});
  const ref = useRef<HTMLFormElement>(null);
  const problems: LeadProblems = leadProblems(v, { phoneRequired: true });
  const shown = (k: Key) => (seen[k] ? problems[k] : undefined);
  const set = (k: Key, value: string) => setV((x) => ({ ...x, [k]: value }));
  const leave = (k: Key) => setSeen((x) => ({ ...x, [k]: true }));
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (Object.keys(problems).length === 0) return;
    e.preventDefault();
    setSeen({ name: true, email: true, phone: true, message: true });
    const first = ORDER.find((k) => problems[k]);
    if (first) ref.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  if (state.status === "success") {
    return (
      <div className="hb2-ct-ok" role="status" aria-live="polite">
        <GlimmerArt art="plant" size={200} />
        <strong>Message sent</strong>
        <p>{state.message}</p>
      </div>
    );
  }
  const common = (k: Key) => ({
    name: k,
    value: v[k],
    onBlur: () => leave(k),
    "aria-invalid": shown(k) ? (true as const) : undefined,
    "aria-describedby": shown(k) ? `h2c-${k}` : undefined,
    className: shown(k) ? "hb2-ct-bad" : undefined,
  });
  const err = (k: Key) =>
    shown(k) ? (
      <small id={`h2c-${k}`} role="alert">
        {shown(k)}
      </small>
    ) : null;
  return (
    <form ref={ref} action={action} onSubmit={onSubmit} noValidate className="hb2-ct-form">
      <label>
        <span>Full name</span>
        <input {...common("name")} onChange={(e) => set("name", e.target.value)} maxLength={100} autoComplete="name" placeholder="Your name" />
        {err("name")}
      </label>
      <label>
        <span>Email</span>
        <input {...common("email")} onChange={(e) => set("email", e.target.value)} type="email" maxLength={200} autoComplete="email" placeholder="you@company.com" />
        {err("email")}
      </label>
      <label>
        <span>Mobile number</span>
        <input {...common("phone")} onChange={(e) => set("phone", limitPhone(e.target.value))} type="tel" inputMode="tel" maxLength={20} autoComplete="tel" placeholder="+91" />
        {err("phone")}
      </label>
      {topic?.extras.map((x) => {
        const opts = x.key === "domain" ? [...courses, "Not sure yet"] : (x.options ?? []);
        if (x.kind === "checks")
          return (
            <fieldset key={x.key} className="ctd-checks">
              <legend>{x.label}</legend>
              {opts.map((o) => (
                <label key={o} className="ctd-check">
                  <input type="checkbox" name={`d_${x.key}`} value={o} defaultChecked={ticked.includes(o)} />
                  <span>{o}</span>
                </label>
              ))}
            </fieldset>
          );
        if (x.kind === "select")
          return (
            <label key={x.key}>
              <span>{x.label}</span>
              <PickOne name={`d_${x.key}`} opts={opts} label={x.label} />
            </label>
          );
        return (
          <label key={x.key}>
            <span>{x.label}</span>
            <input name={`d_${x.key}`} maxLength={120} placeholder={x.placeholder} />
          </label>
        );
      })}
      <label>
        <span>{topic?.messageLabel ?? "Your project"}</span>
        <textarea {...common("message")} onChange={(e) => set("message", e.target.value)} maxLength={2000} rows={5} placeholder={topic?.placeholder ?? "Tell us about your idea"} />
        {err("message")}
      </label>
      <input type="hidden" name="phoneRequired" value="1" />
      {topic && <input type="hidden" name="topic" value={topic.id} />}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hb2-ct-hp" />
      {state.status === "error" && (
        <p className="hb2-ct-fail" role="alert">
          {state.message}
        </p>
      )}
      <button type="submit" className="hb2-m-btn hb2-ct-send" disabled={pending} aria-busy={pending}>
        {pending ? "Sending…" : (topic?.button ?? "Send message")}
      </button>
    </form>
  );
}
