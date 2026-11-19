"use client";

import { useActionState, useRef, useState, type FormEvent } from "react";
import { submitLead, type LeadState } from "@/actions/leads";
import { leadProblems, limitPhone, type LeadProblems, type LeadValues } from "@/lib/contact-validation";

type Key = keyof LeadValues;
const ORDER: Key[] = ["name", "email", "phone", "message"];

/**
 * The enquiry form (name, e-mail, phone, message). Sends to the same inbox as the contact page (Admin > Leads) through the same action, honeypot and rate limit.
 * The values are kept in state (a form action empties an uncontrolled form when the server answers, so a wrong phone number used to erase everything the
 * visitor had typed). The same rules as the laptop form (lib/contact-validation.ts) run while the visitor types, with a clear line under the field.
 */
export function LeadForm({ buttonLabel = "Send a Message" }: { buttonLabel?: string }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const [v, setV] = useState<LeadValues>({ name: "", email: "", phone: "", message: "" });
  const [seen, setSeen] = useState<Partial<Record<Key, boolean>>>({});
  const ref = useRef<HTMLFormElement>(null);
  const problems: LeadProblems = leadProblems(v, { phoneRequired: true });
  const shown = (k: Key) => (seen[k] ? problems[k] : undefined);
  const set = (k: Key, value: string) => setV((x) => ({ ...x, [k]: value }));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (Object.keys(problems).length === 0) return;
    e.preventDefault();
    setSeen({ name: true, email: true, phone: true, message: true });
    const first = ORDER.find((k) => problems[k]);
    if (first) ref.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  if (state.status === "success") {
    return (
      <p className="ma-note ma-note-ok" role="status">
        {state.message}
      </p>
    );
  }
  const common = (k: Key) => ({
    name: k,
    value: v[k],
    onBlur: () => setSeen((x) => ({ ...x, [k]: true })),
    "aria-invalid": shown(k) ? (true as const) : undefined,
    "aria-describedby": shown(k) ? `lf-${k}-err` : undefined,
  });
  const err = (k: Key) =>
    shown(k) ? (
      <em id={`lf-${k}-err`} role="alert" className="ma-ferr">
        {shown(k)}
      </em>
    ) : null;

  return (
    <form ref={ref} action={action} onSubmit={onSubmit} noValidate className="ma-form">
      <label className="ma-field">
        <span>Your name</span>
        <input className="ma-input" {...common("name")} onChange={(e) => set("name", e.target.value)} maxLength={100} autoComplete="name" placeholder="Your name" />
        {err("name")}
      </label>
      <label className="ma-field">
        <span>E-mail</span>
        <input className="ma-input" {...common("email")} onChange={(e) => set("email", e.target.value)} type="email" inputMode="email" maxLength={200} autoComplete="email" placeholder="you@company.com" />
        {err("email")}
      </label>
      <label className="ma-field">
        <span>Mobile number</span>
        <input className="ma-input" {...common("phone")} onChange={(e) => set("phone", limitPhone(e.target.value))} type="tel" inputMode="tel" maxLength={20} autoComplete="tel" placeholder="Mobile number (+91)" />
        {err("phone")}
      </label>
      <label className="ma-field">
        <span>How can we help?</span>
        <textarea className="ma-input" {...common("message")} onChange={(e) => set("message", e.target.value)} maxLength={2000} placeholder="Tell us about your project" />
        {err("message")}
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="ma-hp" />
      <input type="hidden" name="phoneRequired" value="1" />
      <button type="submit" className="ma-btn ma-btn-fill ma-btn-block" disabled={pending} aria-busy={pending}>
        {pending ? "Sending…" : buttonLabel}
      </button>
      {state.status === "error" && (
        <p className="ma-note ma-note-er" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
