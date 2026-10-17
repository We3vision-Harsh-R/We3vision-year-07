"use client";

import { useState } from "react";
import { applyForJob } from "@/actions/jobs";
import { CURRENT_STATUS_SUGGESTIONS, NOTICE_PERIODS, type CareerQuestionView } from "@/lib/careers-shared";
import { Dropdown } from "./dropdown";

/**
 * The apply form on the mobile page of a job: the same fields, the same action (applyForJob) and the same resume upload as the laptop page, so an
 * application lands in Admin > Careers either way. Choices use the iOS-style dropdown.
 */
type Resume = { url: string; name: string };

export function JobApplyForm({ roleId, roleTitle, questions }: { roleId: string; roleTitle: string; questions: CareerQuestionView[] }) {
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
    setBusy(true);
    const res = await applyForJob({ roleId, fields: f, resume: resume?.url ?? "", custom, website });
    setBusy(false);
    if (res.ok) setSent(true);
    else setError(res.error);
  };

  if (sent) {
    return (
      <p className="ma-note ma-note-ok" role="status">
        Your application is on its way! Thank you{f.name ? `, ${f.name.split(" ")[0]}` : ""}. Our HR team will read your application for {roleTitle} and write to you on {f.email || "your email"}.
      </p>
    );
  }

  const pick = (v: string | undefined, options: string[]) => (v ? options.indexOf(v) : -1);

  return (
    <form
      className="ma-form ma-card"
      onSubmit={(e) => {
        e.preventDefault();
        void send();
      }}
    >
      <label className="ma-field">
        <span>Full name *</span>
        <input className="ma-input" value={f.name ?? ""} maxLength={100} autoComplete="name" onChange={(e) => set("name", e.target.value)} />
      </label>
      <label className="ma-field">
        <span>Email *</span>
        <input className="ma-input" type="email" inputMode="email" value={f.email ?? ""} maxLength={200} autoComplete="email" placeholder="you@example.com" onChange={(e) => set("email", e.target.value)} />
      </label>
      <label className="ma-field">
        <span>Phone / WhatsApp *</span>
        <input className="ma-input" type="tel" inputMode="tel" value={f.phone ?? ""} maxLength={30} autoComplete="tel" placeholder="+91 …" onChange={(e) => set("phone", e.target.value)} />
      </label>
      <label className="ma-field">
        <span>The city where you live *</span>
        <input className="ma-input" value={f.city ?? ""} maxLength={120} autoComplete="address-level2" placeholder="e.g. Surat" onChange={(e) => set("city", e.target.value)} />
      </label>
      <div className="ma-field">
        <span>Current career status</span>
        <Dropdown options={CURRENT_STATUS_SUGGESTIONS} value={pick(f.currentStatus, CURRENT_STATUS_SUGGESTIONS)} placeholder="Choose" onChange={(i) => set("currentStatus", CURRENT_STATUS_SUGGESTIONS[i])} />
      </div>
      <label className="ma-field">
        <span>Total experience</span>
        <input className="ma-input" value={f.experience ?? ""} maxLength={80} placeholder="e.g. 2 years 6 months, or Fresher" onChange={(e) => set("experience", e.target.value)} />
      </label>
      <div className="ma-field">
        <span>Notice period</span>
        <Dropdown options={NOTICE_PERIODS} value={pick(f.noticePeriod, NOTICE_PERIODS)} placeholder="How soon can you join?" onChange={(i) => set("noticePeriod", NOTICE_PERIODS[i])} />
      </div>
      <label className="ma-field">
        <span>LinkedIn or portfolio link</span>
        <input className="ma-input" value={f.linkedin ?? ""} maxLength={300} placeholder="https://…" onChange={(e) => set("linkedin", e.target.value)} />
      </label>
      <div className="ma-field">
        <span>Your resume * (or a link to your work above)</span>
        <label className="ma-file">
          <input type="file" accept=".pdf,.doc,.docx,application/pdf" onChange={(e) => void upload(e.target.files?.[0])} />
          <span className="ma-file-b">{uploadBusy ? "Uploading…" : resume ? resume.name : "Choose a file"}</span>
        </label>
        {resume && (
          <button type="button" className="ma-link" onClick={() => setResume(null)}>
            Remove the file
          </button>
        )}
        {uploadErr && <p className="ma-note ma-note-er">{uploadErr}</p>}
      </div>
      <label className="ma-field">
        <span>Why do you want to join We3vision?</span>
        <textarea className="ma-input" rows={3} value={f.about ?? ""} maxLength={1000} placeholder="A few lines are enough" onChange={(e) => set("about", e.target.value)} />
      </label>
      {questions.map((q) => {
        const opts = q.kind === "yesno" ? ["Yes", "No"] : q.options;
        return (
          <div key={q.id} className="ma-field">
            <span>
              {q.label}
              {q.required ? " *" : ""}
            </span>
            {q.kind === "textarea" ? (
              <textarea className="ma-input" rows={3} value={custom[q.id] ?? ""} maxLength={1000} onChange={(e) => setCustom({ ...custom, [q.id]: e.target.value })} />
            ) : q.kind === "select" || q.kind === "yesno" ? (
              <Dropdown options={opts} value={pick(custom[q.id], opts)} placeholder="Choose" onChange={(i) => setCustom({ ...custom, [q.id]: opts[i] })} />
            ) : (
              <input className="ma-input" value={custom[q.id] ?? ""} maxLength={300} aria-label={q.label} onChange={(e) => setCustom({ ...custom, [q.id]: e.target.value })} />
            )}
          </div>
        );
      })}
      <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="ma-hp" />
      <button type="submit" className="ma-btn ma-btn-fill ma-btn-block" disabled={busy}>
        {busy ? "Please wait…" : "Send my application"}
      </button>
      {error && <p className="ma-note ma-note-er">{error}</p>}
    </form>
  );
}
