"use client";

import "@/styles/careers.css";



import Link from "next/link";
import { useState } from "react";
import { applyForJob } from "@/actions/jobs";
import { emailProblem, phoneProblem } from "@/lib/contact-validation";
import { CURRENT_STATUS_SUGGESTIONS, NOTICE_PERIODS, type CareerQuestionView } from "@/lib/careers-shared";
import { Combo, Dropdown, ResumeBox } from "./form-controls";

// The apply form on the page of a job: everything in one go. The look is in globals.css (.jb-*, and the fields .cj-*).

type Resume = { url: string; name: string };
const NOTICE = NOTICE_PERIODS.map((n) => ({ value: n, label: n }));

export function JobApply({ roleId, roleTitle, questions }: { roleId: string; roleTitle: string; questions: CareerQuestionView[] }) {
  const [f, setF] = useState<Record<string, string>>({});
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [resume, setResume] = useState<Resume | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const set = (k: string, v: string) => setF((x) => ({ ...x, [k]: v }));

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploadBusy(true);
    setUploadErr("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/careers/resume", { method: "POST", body: form });
      const json = (await res.json().catch(() => ({}))) as { url?: string; name?: string; error?: string };
      if (res.ok && json.url) setResume({ url: json.url, name: json.name ?? file.name });
      else setUploadErr(json.error ?? "Could not upload the file.");
    } catch {
      setUploadErr("No connection. Please try again.");
    } finally {
      setUploadBusy(false);
    }
  };

  const send = async () => {
    setError("");
    const bad = emailProblem(f.email ?? "") || phoneProblem(f.phone ?? "");
    if (bad) {
      setError(bad);
      return;
    }
    setBusy(true);
    const res = await applyForJob({ roleId, fields: f, resume: resume?.url ?? "", custom, website });
    setBusy(false);
    if (res.ok) setSent(true);
    else setError(res.error);
  };

  if (sent) {
    return (
      <div className="jb-sent" role="status">
        <span className="jb-sent-ic" aria-hidden />
        <h3>Your application is on its way!</h3>
        <p>
          Thank you{f.name ? `, ${f.name.split(" ")[0]}` : ""}. Our HR team will read your application for <b>{roleTitle}</b> and write to you on {f.email || "your email"}.
        </p>
        <Link href="/careers#openings" className="jb-cta">
          See the other open positions
        </Link>
      </div>
    );
  }

  return (
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
          <input className="cj-in" value={f.name ?? ""} maxLength={100} autoComplete="name" onChange={(e) => set("name", e.target.value)} />
        </label>
        <label className="cj-field">
          <span>
            Email<em> *</em>
          </span>
          <input className="cj-in" type="email" inputMode="email" value={f.email ?? ""} maxLength={200} autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(emailProblem(f.email ?? ""))} onChange={(e) => set("email", e.target.value)} />
          {emailProblem(f.email ?? "") && (
            <small className="cj-ferr" role="alert">
              {emailProblem(f.email ?? "")}
            </small>
          )}
        </label>
        <label className="cj-field">
          <span>
            Phone / WhatsApp<em> *</em>
          </span>
          <input className="cj-in" type="tel" inputMode="tel" value={f.phone ?? ""} maxLength={30} autoComplete="tel" placeholder="+91 …" aria-invalid={Boolean(phoneProblem(f.phone ?? ""))} onChange={(e) => set("phone", e.target.value)} />
          {phoneProblem(f.phone ?? "") && (
            <small className="cj-ferr" role="alert">
              {phoneProblem(f.phone ?? "")}
            </small>
          )}
        </label>
        <label className="cj-field">
          <span>
            The city where you live<em> *</em>
          </span>
          <input className="cj-in" value={f.city ?? ""} maxLength={120} autoComplete="address-level2" placeholder="e.g. Surat" onChange={(e) => set("city", e.target.value)} />
        </label>
        <div className="cj-field">
          <span>Current career status</span>
          <Combo value={f.currentStatus ?? ""} suggestions={CURRENT_STATUS_SUGGESTIONS} placeholder="Fresher, Sr. Project Manager…" label="Current career status" onChange={(v) => set("currentStatus", v)} />
        </div>
        <label className="cj-field">
          <span>Total experience</span>
          <input className="cj-in" value={f.experience ?? ""} maxLength={80} placeholder="e.g. 2 years 6 months, or Fresher" onChange={(e) => set("experience", e.target.value)} />
        </label>
        <div className="cj-field">
          <span>Notice period</span>
          <Dropdown value={f.noticePeriod ?? ""} options={NOTICE} placeholder="How soon can you join?" label="Notice period" onChange={(v) => set("noticePeriod", v)} />
        </div>
        <label className="cj-field">
          <span>LinkedIn or portfolio link</span>
          <input className="cj-in" value={f.linkedin ?? ""} maxLength={300} placeholder="https://…" onChange={(e) => set("linkedin", e.target.value)} />
        </label>
        <div className="cj-field jb-wide">
          <span>
            Your resume<em> *</em> <small className="jb-or">(or a link to your work above)</small>
          </span>
          <ResumeBox file={resume} busy={uploadBusy} error={uploadErr} onFile={(file) => void upload(file)} onClear={() => setResume(null)} />
        </div>
        <label className="cj-field jb-wide">
          <span>Why do you want to join We3vision?</span>
          <textarea className="cj-in" rows={3} value={f.about ?? ""} maxLength={1000} placeholder="A few lines are enough" onChange={(e) => set("about", e.target.value)} />
        </label>
        {questions.map((q) => (
          <div key={q.id} className={`cj-field${q.kind === "textarea" ? " jb-wide" : ""}`}>
            <span>
              {q.label}
              {q.required && <em> *</em>}
            </span>
            {q.kind === "textarea" ? (
              <textarea className="cj-in" rows={3} value={custom[q.id] ?? ""} maxLength={1000} onChange={(e) => setCustom({ ...custom, [q.id]: e.target.value })} />
            ) : q.kind === "select" || q.kind === "yesno" ? (
              <Dropdown
                value={custom[q.id] ?? ""}
                options={(q.kind === "yesno" ? ["Yes", "No"] : q.options).map((o) => ({ value: o, label: o }))}
                placeholder="Choose"
                label={q.label}
                onChange={(v) => setCustom({ ...custom, [q.id]: v })}
              />
            ) : (
              <input className="cj-in" value={custom[q.id] ?? ""} maxLength={300} aria-label={q.label} onChange={(e) => setCustom({ ...custom, [q.id]: e.target.value })} />
            )}
          </div>
        ))}
      </div>
      <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="cj-trap" />
      <div className="jb-send">
        <button type="submit" className="cj-book" disabled={busy}>
          {busy ? "Please wait…" : "Send my application"}
        </button>
        {error ? <p className="cj-err">{error}</p> : <p className="cj-hint">Fields with * are needed. We use your details only to talk to you about this job.</p>}
      </div>
    </form>
  );
}
