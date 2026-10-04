"use client";

import { useActionState } from "react";
import { submitLead, type LeadState } from "@/actions/leads";

const field =
  "w-full rounded-lg border border-violet/10 bg-[#1d0b2c] px-4 py-3.5 text-sm text-violet outline-none transition placeholder:text-orchid focus:border-violet/50 focus:bg-[#240f37]";

export function ContactForm({ buttonLabel }: { buttonLabel: string }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });

  if (state.status === "success") {
    return (
      <div role="status" className="card-glass rounded-[19px] p-10 text-center">
        <p className="text-vfade pb-1 text-3xl font-semibold tracking-tight">Message sent</p>
        <p className="mt-3 text-orchid">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <input name="name" required minLength={2} maxLength={100} autoComplete="name" aria-label="Full name" className={field} placeholder="Full Name" />
      <input name="email" type="email" required maxLength={200} autoComplete="email" aria-label="Email" className={field} placeholder="Email" />
      <input name="phone" type="tel" maxLength={30} autoComplete="tel" aria-label="Phone (optional)" className={field} placeholder="Phone (optional)" />
      <textarea name="message" required minLength={10} maxLength={2000} rows={5} aria-label="Message" className={`${field} resize-y`} placeholder="Message" />
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
        className="btn-primary h-12 w-full rounded-lg text-sm font-semibold text-void transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Sending…" : buttonLabel}
      </button>
    </form>
  );
}
