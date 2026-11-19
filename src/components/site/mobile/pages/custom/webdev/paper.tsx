"use client";

import { useActionState, useState } from "react";
import { submitLead, type LeadState } from "@/actions/leads";
import { limitPhone } from "@/lib/contact-validation";

/**
 * "Write a note, fold it into a paper plane". The contact form is a sheet of paper: To / From / Reply to, and a ruled page for the message. When
 * it is sent the sheet folds up, turns into a paper plane and flies off the screen, and then the answer of the server ("sent" or the error) appears.
 * Same action, same honeypot and same limits as every other form of the site (submitLead), so the message lands in Admin > Leads. Without the
 * script the form still sends (it is a real form). With "reduce motion" there is no flight, only the answer.
 */
const PLANE = "M3 11.4 21 3.5l-4.6 17-4.9-6.6zM11.5 13.9 21 3.5";

export function PaperForm({ label }: { label?: string }) {
  const [round, setRound] = useState(0);
  return <Sheet key={round} label={label} again={() => setRound((r) => r + 1)} />;
}

function Sheet({ label, again }: { label?: string; again: () => void }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const [v, setV] = useState({ name: "", email: "", phone: "", message: "" }); // kept in state: a form action empties an uncontrolled form after an error
  const sent = state.status === "success";
  return (
    <div className={`mp-wd-pp${sent ? " is-sent" : ""}${pending ? " is-busy" : ""}`}>
      <form action={action} className="mp-wd-pp-form" aria-hidden={sent || undefined} inert={sent || undefined}>
        <div className="mp-wd-pp-sheet">
          <i className="mp-wd-pp-fold" aria-hidden="true" />
          <p className="mp-wd-pp-to">
            <span>To</span>
            <b>We3vision</b>
          </p>
          <label className="mp-wd-pp-row">
            <span>From</span>
            <input name="name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} maxLength={100} autoComplete="name" required minLength={2} placeholder="Your name" />
          </label>
          <label className="mp-wd-pp-row">
            <span>Reply to</span>
            <input name="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} maxLength={200} type="email" inputMode="email" autoComplete="email" required placeholder="you@company.com" />
          </label>
          <label className="mp-wd-pp-row">
            <span>Phone</span>
            <input name="phone" value={v.phone} onChange={(e) => setV({ ...v, phone: limitPhone(e.target.value) })} maxLength={20} type="tel" inputMode="tel" autoComplete="tel" required placeholder="Mobile number (+91)" />
          </label>
          <textarea className="mp-wd-pp-note" name="message" value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} maxLength={2000} required minLength={10} rows={3} placeholder="Tell us about your project" aria-label="Your message" />
          <input type="hidden" name="phoneRequired" value="1" />
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="ma-hp" />
        </div>
        <button type="submit" className="mp-wd-pp-send" disabled={pending}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={PLANE} />
          </svg>
          {pending ? "Folding…" : label || "Send a message"}
        </button>
        {state.status === "error" && (
          <p className="mp-wd-pp-err" role="alert">
            {state.message}
          </p>
        )}
      </form>

      {sent && (
        <>
          <svg className="mp-wd-pp-plane" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={PLANE} />
          </svg>
          <div className="mp-wd-pp-done" role="status">
            <p>{state.message || "Your message is on its way."}</p>
            <button type="button" onClick={again}>
              Write another
            </button>
          </div>
        </>
      )}
    </div>
  );
}
