"use client";

import "@/styles/careers.css";

import Link from "next/link";
import { useState } from "react";
import { applyForJob } from "@/actions/jobs";
import { fieldProblem, isLinkQuestion, urlProblem } from "@/lib/contact-validation";
import { resumeNameProblem } from "@/lib/resume-check";
import { ToastView, useToast } from "./cj-toast";
import {
  CURRENT_STATUS_SUGGESTIONS,
  NOTICE_PERIODS,
  type CareerQuestionView,
} from "@/lib/careers-shared";
import { Combo, Dropdown, ResumeBox } from "./form-controls";

// The apply form on the page of a job: everything in one go. The look is in globals.css (.jb-*, and the fields .cj-*).

type Resume = { url: string; name: string };
const NOTICE = NOTICE_PERIODS.map((n) => ({ value: n, label: n }));

export function JobApply({
  roleId,
  roleTitle,
  questions,
}: {
  roleId: string;
  roleTitle: string;
  questions: CareerQuestionView[];
}) {
  const [f, setF] = useState<Record<string, string>>({});
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [resume, setResume] = useState<Resume | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { toast, notify, close: closeToast } = useToast();
  const [sent, setSent] = useState(false);
  const [tried, setTried] = useState(false);

  // the problem of a field: its rule while it is written, and "needed" for an empty required one after the first try to send
  const NEEDED = ["name", "email", "phone", "city"];
  const prob = (k: string) => fieldProblem(k, f[k] ?? "") || (tried && NEEDED.includes(k) && !(f[k] ?? "").trim() ? "This field is needed." : "");
  const qProb = (q: CareerQuestionView) => {
    const v = custom[q.id] ?? "";
    if (isLinkQuestion(q.label) && q.kind !== "select" && q.kind !== "yesno") return urlProblem(v);
    return tried && q.required && !v.trim() ? "This field is needed." : "";
  };
  const hasProblems = () => ["name", "email", "phone", "city", "linkedin", "about"].some((k) => prob(k)) || questions.some((q) => qProb(q));
  const msg = (id: string, text: string) =>
    text ? (
      <small id={id} className="cj-ferr" role="alert">
        {text}
      </small>
    ) : null;
  const aria = (id: string, text: string) => ({ "aria-invalid": text ? (true as const) : undefined, "aria-describedby": text ? id : undefined });

  const set = (k: string, v: string) => setF((x) => ({ ...x, [k]: v }));

  const upload = async (file: File | undefined) => {
    if (!file) return;
    const bad = resumeNameProblem(file.name, file.size);
    if (bad) {
      setUploadErr(bad);
      return;
    }
    setUploadBusy(true);
    setUploadErr("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/careers/resume", {
        method: "POST",
        body: form,
      });
      const json = (await res.json().catch(() => ({}))) as {
        url?: string;
        name?: string;
        error?: string;
      };
      if (res.ok && json.url)
        setResume({ url: json.url, name: json.name ?? file.name });
      else setUploadErr(json.error ?? "Could not upload the file.");
    } catch {
      setUploadErr("No connection. Please try again.");
    } finally {
      setUploadBusy(false);
    }
  };

  const send = async () => {
    setError("");
    if (hasProblems()) {
      setTried(true);
      return;
    }
    setBusy(true);
    const res = await applyForJob({
      roleId,
      fields: f,
      resume: resume?.url ?? "",
      custom,
      website,
    }).catch(() => ({
      ok: false as const,
      error: "No connection. Please check your internet and try again.",
    }));
    setBusy(false);
    if (res.ok) {
      setSent(true);
      notify("ok", "Your application is sent. Our HR team will write to you.");
    } else {
      setError(res.error);
    }
  };

  if (sent) {
    return (
      <>
        <ToastView toast={toast} onClose={closeToast} />
        <div className="jb-sent" role="status">
          <span className="jb-sent-ic" aria-hidden />
          <h3>Your application is on its way!</h3>
          <p>
            Thank you{f.name ? `, ${f.name.split(" ")[0]}` : ""}. Our HR team
            will read your application for <b>{roleTitle}</b> and write to you
            on {f.email || "your email"}.
          </p>
          <Link href="/careers#openings" className="jb-cta">
            See the other open positions
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastView toast={toast} onClose={closeToast} />
      <form
        className="jb-form"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <div className="jb-grid-form">
          <label className="cj-field">
            <span>
              Full name<em> *</em>
            </span>
            <input
              className="cj-in"
              value={f.name ?? ""}
              maxLength={50}
              autoComplete="name"
              {...aria("jb-name-err", prob("name"))}
              onChange={(e) => set("name", e.target.value)}
            />
            {msg("jb-name-err", prob("name"))}
          </label>
          <label className="cj-field">
            <span>
              Email<em> *</em>
            </span>
            <input
              className="cj-in"
              type="email"
              inputMode="email"
              value={f.email ?? ""}
              maxLength={200}
              autoComplete="email"
              placeholder="you@example.com"
              {...aria("jb-email-err", prob("email"))}
              onChange={(e) => set("email", e.target.value)}
            />
            {msg("jb-email-err", prob("email"))}
          </label>
          <label className="cj-field">
            <span>
              Phone / WhatsApp<em> *</em>
            </span>
            <input
              className="cj-in"
              type="tel"
              inputMode="tel"
              value={f.phone ?? ""}
              maxLength={20}
              autoComplete="tel"
              placeholder="+91 …"
              {...aria("jb-phone-err", prob("phone"))}
              onChange={(e) => set("phone", e.target.value)}
            />
            {msg("jb-phone-err", prob("phone"))}
          </label>
          <label className="cj-field">
            <span>
              The city where you live<em> *</em>
            </span>
            <input
              className="cj-in"
              value={f.city ?? ""}
              {...aria("jb-city-err", prob("city"))}
              maxLength={120}
              autoComplete="address-level2"
              placeholder="e.g. Surat"
              onChange={(e) => set("city", e.target.value)}
            />
            {msg("jb-city-err", prob("city"))}
          </label>
          <div className="cj-field">
            <span>Current career status</span>
            <Combo
              value={f.currentStatus ?? ""}
              suggestions={CURRENT_STATUS_SUGGESTIONS}
              placeholder="Fresher, Sr. Project Manager…"
              label="Current career status"
              onChange={(v) => set("currentStatus", v)}
            />
          </div>
          <label className="cj-field">
            <span>Total experience</span>
            <input
              className="cj-in"
              value={f.experience ?? ""}
              {...aria("jb-experience-err", prob("experience"))}
              maxLength={80}
              placeholder="e.g. 2 years 6 months, or Fresher"
              onChange={(e) => set("experience", e.target.value)}
            />
            {msg("jb-experience-err", prob("experience"))}
          </label>
          <div className="cj-field">
            <span>Notice period</span>
            <Dropdown
              value={f.noticePeriod ?? ""}
              options={NOTICE}
              placeholder="How soon can you join?"
              label="Notice period"
              onChange={(v) => set("noticePeriod", v)}
            />
          </div>
          <label className="cj-field">
            <span>LinkedIn or portfolio link</span>
            <input
              className="cj-in"
              value={f.linkedin ?? ""}
              {...aria("jb-linkedin-err", prob("linkedin"))}
              maxLength={300}
              placeholder="https://…"
              onChange={(e) => set("linkedin", e.target.value)}
            />
            {msg("jb-linkedin-err", prob("linkedin"))}
          </label>
          <div className="cj-field jb-wide">
            <span>
              Your resume<em> *</em>{" "}
              <small className="jb-or">(or a link to your work above)</small>
            </span>
            <ResumeBox
              file={resume}
              busy={uploadBusy}
              error={uploadErr}
              onFile={(file) => void upload(file)}
              onClear={() => setResume(null)}
            />
          </div>
          <label className="cj-field jb-wide">
            <span>Why do you want to join We3vision?</span>
            <textarea
              className="cj-in"
              rows={3}
              value={f.about ?? ""}
              {...aria("jb-about-err", prob("about"))}
              maxLength={1000}
              placeholder="A few lines are enough"
              onChange={(e) => set("about", e.target.value)}
            />
            {msg("jb-about-err", prob("about"))}
          </label>
          {questions.map((q) => (
            <div
              key={q.id}
              className={`cj-field${q.kind === "textarea" ? " jb-wide" : ""}`}
            >
              <span>
                {q.label}
                {q.required && <em> *</em>}
              </span>
              {q.kind === "textarea" ? (
                <textarea
                  className="cj-in"
                  rows={3}
                  value={custom[q.id] ?? ""}
                  maxLength={1000}
                  onChange={(e) =>
                    setCustom({ ...custom, [q.id]: e.target.value })
                  }
                />
              ) : q.kind === "select" || q.kind === "yesno" ? (
                <Dropdown
                  value={custom[q.id] ?? ""}
                  options={(q.kind === "yesno" ? ["Yes", "No"] : q.options).map(
                    (o) => ({ value: o, label: o }),
                  )}
                  placeholder="Choose"
                  label={q.label}
                  onChange={(v) => setCustom({ ...custom, [q.id]: v })}
                />
              ) : (
                <input
                  className="cj-in"
                  value={custom[q.id] ?? ""}
                  maxLength={300}
                  aria-label={q.label}
                  {...aria(`jb-q-${q.id}-err`, qProb(q))}
                  onChange={(e) =>
                    setCustom({ ...custom, [q.id]: e.target.value })
                  }
                />
              )}
              {msg(`jb-q-${q.id}-err`, qProb(q))}
            </div>
          ))}
        </div>
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="cj-trap"
        />
        <div className="jb-send">
          <button type="submit" className="cj-book" disabled={busy}>
            {busy ? "Please wait…" : "Send my application"}
          </button>
          {error ? (
            <p className="cj-err">{error}</p>
          ) : (
            <p className="cj-hint">
              Fields with * are needed. We use your details only to talk to you
              about this job.
            </p>
          )}
        </div>
      </form>
    </>
  );
}
