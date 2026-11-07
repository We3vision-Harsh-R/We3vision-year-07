"use client";

import { useActionState, useRef, useState, type FormEvent } from "react";
import { submitLead, type LeadState } from "@/actions/leads";
import { leadProblems, limitPhone, type LeadProblems, type LeadValues } from "@/lib/contact-validation";

// The contact form of Home 2. Same server action and same rules as the form of the live site (actions/leads.ts, lib/contact-validation.ts):
// every field is checked when the visitor leaves it, a spinner shows while it is sent, and the answer is read out.
type Key = keyof LeadValues;
const ORDER: Key[] = ["name", "email", "phone", "message"];

export function Home2Contact() {
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
      <label>
        <span>Your project</span>
        <textarea {...common("message")} onChange={(e) => set("message", e.target.value)} maxLength={2000} rows={5} placeholder="Tell us about your idea" />
        {err("message")}
      </label>
      <input type="hidden" name="phoneRequired" value="1" />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hb2-ct-hp" />
      {state.status === "error" && (
        <p className="hb2-ct-fail" role="alert">
          {state.message}
        </p>
      )}
      <button type="submit" className="hb2-m-btn hb2-ct-send" disabled={pending} aria-busy={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
