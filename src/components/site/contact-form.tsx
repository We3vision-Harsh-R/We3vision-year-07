"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { submitLead, type LeadState } from "@/actions/leads";
import { leadProblems, limitPhone, type LeadProblems, type LeadValues } from "@/lib/contact-validation";
import { GlowEdge } from "./glow-edge";

const field =
  "w-full rounded-lg border border-violet/10 bg-[hsl(calc(var(--th)_+_348.73)_calc(60%_*_var(--ts))_10.78%)] px-4 py-3.5 text-base text-violet outline-none transition placeholder:text-orchid focus:border-violet/50 focus:bg-[hsl(calc(var(--th)_+_347.5)_calc(57.14%_*_var(--ts))_13.73%)]";

type Key = keyof LeadValues;
const ORDER: Key[] = ["name", "email", "phone", "message"];

// The contact form of the pages ("Let's talk" / "Get a free quote"). Every field is checked while the visitor works (when he leaves it, and again
// as he types once it has been marked), with a red border and a clear line under it; "Get a free quote" shows a spinner while it is sent and
// cannot be pressed twice; the answer (thanks or an error) is read out and shown. The same rules run again on the server (actions/leads.ts).
// Rules: lib/contact-validation.ts (name: letters, spaces, - and ' only; email; an Indian mobile of 10 digits or a number with its country code;
// a message of at least 10 characters).
export function ContactForm({ buttonLabel }: { buttonLabel: string }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const [v, setV] = useState<LeadValues>({ name: "", email: "", phone: "", message: "" });
  const [seen, setSeen] = useState<Partial<Record<Key, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // the sketch canvas can put a first message into the form ("Send to our artist")
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const text = (e as CustomEvent<{ message?: string }>).detail?.message;
      if (text) setV((x) => (x.message.trim() ? x : { ...x, message: text }));
    };
    window.addEventListener("w3v-prefill", onPrefill);
    return () => window.removeEventListener("w3v-prefill", onPrefill);
  }, []);

  const problems: LeadProblems = leadProblems(v, { phoneRequired: true });
  const shown = (k: Key) => (seen[k] ? problems[k] : undefined);
  const set = (k: Key, value: string) => setV((x) => ({ ...x, [k]: value }));
  const leave = (k: Key) => setSeen((x) => ({ ...x, [k]: true }));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (Object.keys(problems).length === 0) return; // all good: the form goes to the server
    e.preventDefault();
    setSeen({ name: true, email: true, phone: true, message: true });
    const first = ORDER.find((k) => problems[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  if (state.status === "success") {
    return (
      <div role="status" aria-live="polite" className="bglow card-glass rounded-[19px] border border-violet/[0.12] p-10 text-center">
        <GlowEdge />
        <p className="text-vfade pb-1 text-3xl font-semibold tracking-tight">Message sent</p>
        <p className="mt-3 text-orchid">{state.message}</p>
      </div>
    );
  }

  const props = (k: Key) => ({
    name: k,
    value: v[k],
    "aria-invalid": shown(k) ? (true as const) : undefined,
    "aria-describedby": shown(k) ? `cf-${k}-err` : undefined,
    className: `${field} cfx-in${shown(k) ? " cfx-bad" : ""}${k === "message" ? " resize-y" : ""}`,
    onBlur: () => leave(k),
  });
  const error = (k: Key) =>
    shown(k) ? (
      <p id={`cf-${k}-err`} role="alert" className="cfx-err">
        {shown(k)}
      </p>
    ) : null;

  return (
    <form ref={formRef} action={action} onSubmit={onSubmit} noValidate className="space-y-3">
      <div>
        <input {...props("name")} onChange={(e) => set("name", e.target.value)} maxLength={100} autoComplete="name" aria-label="Full name" placeholder="Full Name" />
        {error("name")}
      </div>
      <div>
        <input {...props("email")} onChange={(e) => set("email", e.target.value)} type="email" maxLength={200} autoComplete="email" aria-label="Email" placeholder="Email" />
        {error("email")}
      </div>
      <div>
        <input {...props("phone")} onChange={(e) => set("phone", limitPhone(e.target.value))} type="tel" inputMode="tel" maxLength={20} autoComplete="tel" aria-label="Mobile number" placeholder="Mobile number (+91)" />
        {error("phone")}
      </div>
      <div>
        <textarea {...props("message")} onChange={(e) => set("message", e.target.value)} maxLength={2000} rows={5} aria-label="Message" placeholder="Tell us about your project" />
        {error("message")}
      </div>
      <input type="hidden" name="phoneRequired" value="1" />
      {/* Honeypot: hidden from people, bots fill it in. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {state.status === "error" && (
        <p role="alert" className="text-sm text-rose-300">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="btn-primary inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg text-sm font-semibold text-void transition hover:brightness-110 disabled:opacity-60"
      >
        {pending && <span className="cfx-spin" aria-hidden />}
        {pending ? "Sending…" : buttonLabel}
      </button>
    </form>
  );
}
