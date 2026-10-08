"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitLead, type LeadState } from "@/actions/leads";

const field =
  "w-full rounded-lg border border-violet/10 bg-[hsl(calc(var(--th)_+_348.73)_calc(60%_*_var(--ts))_10.78%)] px-4 py-3.5 text-base text-violet outline-none transition placeholder:text-orchid focus:border-violet/50 focus:bg-[hsl(calc(var(--th)_+_347.5)_calc(57.14%_*_var(--ts))_13.73%)]";

export function ContactForm({ buttonLabel }: { buttonLabel: string }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // the sketch canvas can put a first message into the form ("Send to our artist")
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const text = (e as CustomEvent<{ message?: string }>).detail?.message;
      if (text && messageRef.current && !messageRef.current.value.trim()) messageRef.current.value = text;
    };
    window.addEventListener("w3v-prefill", onPrefill);
    return () => window.removeEventListener("w3v-prefill", onPrefill);
  }, []);

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
      <textarea ref={messageRef} name="message" required minLength={10} maxLength={2000} rows={5} aria-label="Message" className={`${field} resize-y`} placeholder="Message" />
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
