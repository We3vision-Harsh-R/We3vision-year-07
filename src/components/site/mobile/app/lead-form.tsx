"use client";

import { useActionState } from "react";
import { submitLead, type LeadState } from "@/actions/leads";

/** The enquiry form (name, e-mail, phone, message). Sends to the same inbox as the contact page (Admin > Leads) through the same action, honeypot and rate limit. */
export function LeadForm({ buttonLabel = "Send a Message" }: { buttonLabel?: string }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  if (state.status === "success") {
    return (
      <p className="ma-note ma-note-ok" role="status">
        {state.message}
      </p>
    );
  }
  return (
    <form action={action} className="ma-form">
      <label className="ma-field">
        <span>Your name</span>
        <input className="ma-input" name="name" autoComplete="name" required minLength={2} placeholder="Your name" />
      </label>
      <label className="ma-field">
        <span>E-mail</span>
        <input className="ma-input" name="email" type="email" inputMode="email" autoComplete="email" required placeholder="you@company.com" />
      </label>
      <label className="ma-field">
        <span>Phone (optional)</span>
        <input className="ma-input" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" />
      </label>
      <label className="ma-field">
        <span>How can we help?</span>
        <textarea className="ma-input" name="message" required minLength={10} placeholder="Tell us about your project" />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="ma-hp" />
      <button type="submit" className="ma-btn ma-btn-fill ma-btn-block" disabled={pending}>
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
