"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { bookSeat, completeTicket, takenSlots } from "@/actions/careers";
import { COMMON_FIELDS, CURRENT_STATUS_SUGGESTIONS, NOTICE_PERIODS, DEFAULT_SCHEDULE, cityLabel, interviewDays, type CareerQuestionView, type CareerRoleView, type InterviewSchedule } from "@/lib/careers-shared";
import { fieldProblem, statusProblem } from "@/lib/contact-validation";
import { resumeNameProblem } from "@/lib/resume-check";
import { Dropdown } from "../../../app/dropdown";
import { IcPin } from "../../../app/icons";
import { SlotCalendar } from "./slot-calendar";

// The top of /careers on a phone or tablet: the same booking as the laptop page (career/journey.tsx), in the app's own look and without the railway.
//   1. "Your location": the visitor types the first letters of their city and taps one (the cities of the whole world, public/data/cities.json).
//   2. After the city: current career status, the open position, the day they can join, the notice period, the resume and a call slot with HR.
//      "Book your seat" saves it (bookSeat, only the city is needed).
//   3. The details of the person (the usual questions and the ones that HR adds in the admin panel). "Confirm the ticket" sends them (completeTicket).
// Both actions are the ones of the laptop page, so everything lands in Admin > Careers. CSS: (m)/m/careers/page.css (mp-car-).

const START = ["Surat|IN", "Mumbai|IN", "Ahmedabad|IN", "Delhi|IN", "Bengaluru|IN", "Pune|IN", "London|GB", "New York City|US", "Dubai|AE", "Singapore|SG"];
const MAX = 8;
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]+/g, "").trim();
const pick = (v: string, options: string[]) => (v ? options.indexOf(v) : -1);

type Resume = { url: string; name: string };

export function CareersBooking({
  locationLabel,
  roles,
  questions,
  schedule = DEFAULT_SCHEDULE,
}: {
  locationLabel: string;
  roles: CareerRoleView[];
  questions: CareerQuestionView[];
  schedule?: InterviewSchedule;
}) {
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<string[] | null>(null);
  const loading = useRef(false);
  const [status, setStatus] = useState("");
  const [roleId, setRoleId] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [notice, setNotice] = useState("");
  const [resume, setResume] = useState<Resume | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [slot, setSlot] = useState("");
  const [taken, setTaken] = useState<Set<string>>(() => new Set());
  const [ticketId, setTicketId] = useState("");
  const [view, setView] = useState<"form" | "details">("form");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tried, setTried] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const detailsRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLElement>(null);

  const days = useMemo(() => interviewDays(new Date(), schedule), [schedule]);
  // the slots that other candidates have already booked
  useEffect(() => {
    if (!city) return;
    void takenSlots().then((l) => setTaken(new Set(l))).catch(() => {});
  }, [city]);
  const roleLabels = useMemo(() => roles.map((r) => (r.team ? `${r.title} · ${r.team}` : r.title)), [roles]);
  const roleIdx = roles.findIndex((r) => r.id === roleId);
  const role = roleIdx >= 0 ? roles[roleIdx] : null;
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

  // choosing the city opens the form under the card: bring it into view so the visitor does not have to look for it
  const chooseCity = (label: string) => {
    setCity(label);
    window.setTimeout(() => bookRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 140);
  };
  const step = done ? 4 : !city ? 1 : view === "form" ? 2 : 3;

  const load = () => {
    if (cities || loading.current) return;
    loading.current = true;
    fetch("/data/cities.json")
      .then((r) => r.json())
      .then((list: string[]) => setCities(list))
      .catch(() => {
        loading.current = false;
      });
  };
  const shown = useMemo(() => {
    const q = norm(query);
    if (!q) return START.slice(0, MAX);
    const out: string[] = [];
    for (const l of cities ?? START) {
      if (norm(l.split("|")[0]).startsWith(q)) {
        out.push(l);
        if (out.length >= MAX) break;
      }
    }
    return out;
  }, [query, cities]);

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

  const book = async () => {
    setError("");
    const bad = statusProblem(status);
    if (bad) {
      setError(`Current career status: ${bad}`);
      return;
    }
    setBusy(true);
    const res = await bookSeat({ id: ticketId || undefined, city, currentStatus: status, roleId, joinDate, noticePeriod: notice, callSlot: slot, resume: resume?.url ?? "" }).catch(() => ({ ok: false as const, error: "No connection. Please check your internet and try again." }));
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setTicketId(res.id);
    setView("details");
    window.setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  };

  // every field is valid (the same rules as on the server, lib/contact-validation.ts) and the needed ones are filled in
  const problems = Object.fromEntries(COMMON_FIELDS.map((c) => [c.key, fieldProblem(c.key, fields[c.key] ?? "") || (tried && c.required && !(fields[c.key] ?? "").trim() ? "This field is needed." : "")]));
  const firstProblem = Object.values(problems).find(Boolean) ?? "";
  const passengerOk = COMMON_FIELDS.every((c) => !c.required || (fields[c.key] ?? "").trim().length >= (c.key === "skills" || c.key === "name" ? 2 : 1)) && !firstProblem;
  const customOk = questions.every((q) => !q.required || (custom[q.id] ?? "").trim());

  const confirm = async () => {
    setError("");
    if (!passengerOk || !customOk) {
      setTried(true);
      if (passengerOk) setError("Please answer the questions marked with *.");
      window.setTimeout(() => document.querySelector<HTMLElement>(".mp-car-pd [aria-invalid=true]")?.focus(), 60);
      return;
    }
    setBusy(true);
    const res = await completeTicket({ id: ticketId, fields, custom, website }).catch(() => ({ ok: false as const, error: "No connection. Please check your internet and try again." }));
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDone(true);
    window.setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  };

  const joinShown = joinDate ? new Date(`${joinDate}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
  const ticketNo = ticketId ? ticketId.slice(-6).toUpperCase() : "";
  const summary: [string, string][] = [
    ["From", city],
    ["Position", role?.title ?? ""],
    ["Status", status],
    ["Joins", joinShown],
    ["Notice", notice],
    ["Interview", slot],
    ["Resume", resume?.name ?? ""],
  ];

  return (
    <>
      <section className="mp-car-hero" id="mp-car-start">
        <div className="mp-car-pass">
          <div className="mp-car-prog">
            <p>
              <b>Step {Math.min(step, 3)} of 3</b>
              <span>{["Your city", "Your choice", "Your details"][Math.min(step, 3) - 1]}</span>
            </p>
            <ol className="mp-car-steps" aria-label="Your progress">
              {["Your city", "Your choice", "Your details"].map((t, i) => (
                <li key={t} data-state={step > i + 1 ? "done" : step === i + 1 ? "now" : "next"} aria-current={step === i + 1 ? "step" : undefined}>
                  <span className="ma-sr">{t}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="mp-car-where">
            <h2 className="mp-car-q">Where are you based?</h2>
            {city ? (
              <div className="mp-car-picked">
                <IcPin className="mp-car-ic" />
                <b>{city}</b>
                {view === "form" && !done && (
                  <button type="button" onClick={() => setCity("")} aria-label="Change the location">
                    Change
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="mp-car-sub">Type your city, then tap it in the list. The form opens right below.</p>
                <label className="mp-car-inp">
                <IcPin className="mp-car-ic" />
                <input
                  className="mp-car-cin"
                  value={query}
                  placeholder="Type the name of your city"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label={locationLabel}
                  onFocus={load}
                  onChange={(e) => {
                    load();
                    setQuery(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && shown[0]) {
                      e.preventDefault();
                      chooseCity(cityLabel(shown[0]));
                    }
                  }}
                />
                </label>
                {query && shown.length > 0 && (
                  <ul className="mp-car-cities" aria-label="Cities">
                    {shown.map((l) => (
                      <li key={l}>
                        <button type="button" onClick={() => chooseCity(cityLabel(l))}>
                          {cityLabel(l)}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {query && shown.length === 0 && <p className="mp-car-none">{cities ? `No city starts with “${query}”. Check the spelling.` : "Loading the cities of the world…"}</p>}
              </>
            )}
          </div>
        </div>
      </section>

      {city && view === "form" && (
        <section ref={bookRef} id="book" className="ma-sec mp-car-book" aria-labelledby="mp-car-book-t">
          <header className="ma-sec-head">
            <h2 id="mp-car-book-t" className="ma-h2">
              Start your application
            </h2>
            <p className="ma-intro">Only your city is needed. Every field below is optional, but it helps us to prepare for you.</p>
          </header>
          <div className="mp-car-fm">
            <div className="ma-field">
              <span>Current career status</span>
              <Dropdown options={CURRENT_STATUS_SUGGESTIONS} value={pick(status, CURRENT_STATUS_SUGGESTIONS)} placeholder="Choose your current status" onChange={(i) => setStatus(CURRENT_STATUS_SUGGESTIONS[i])} />
            </div>
            <div className="ma-field">
              <span>The position you want</span>
              {roles.length > 0 ? (
                <Dropdown options={roleLabels} value={roleIdx} placeholder="Choose an open position" onChange={(i) => setRoleId(roles[i].id)} />
              ) : (
                <p className="ma-note">No position is open right now. You can still apply, and we will write to you when one opens.</p>
              )}
            </div>
            <label className="ma-field">
              <span>When can you join?</span>
              <input className="ma-input" type="date" min={tomorrow} value={joinDate} onChange={(e) => setJoinDate(e.target.value)} />
            </label>
            <div className="ma-field">
              <span>Your notice period</span>
              <Dropdown options={NOTICE_PERIODS} value={pick(notice, NOTICE_PERIODS)} placeholder="Choose your notice period" onChange={(i) => setNotice(NOTICE_PERIODS[i])} />
            </div>
            <div className="ma-field">
              <span>Upload your resume (PDF, DOC or DOCX)</span>
              <label className="ma-file">
                <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => void upload(e.target.files?.[0])} />
                <span className="ma-file-b">{uploadBusy ? "Uploading…" : resume ? resume.name : "Choose a file"}</span>
              </label>
              {resume && (
                <button type="button" className="ma-link" onClick={() => setResume(null)}>
                  Remove the file
                </button>
              )}
              {uploadErr && <p className="ma-note ma-note-er">{uploadErr}</p>}
            </div>
            <div className="ma-field">
              <span>Book your interview slot</span>
              <SlotCalendar days={days} taken={taken} value={slot} onChange={setSlot} />
            </div>
            <button type="button" className="ma-btn ma-btn-fill ma-btn-block" disabled={busy} onClick={() => void book()}>
              {busy ? "Please wait…" : "Continue"}
            </button>
            {error && <p className="ma-note ma-note-er">{error}</p>}
          </div>
        </section>
      )}

      {city && view === "details" && (
        <section ref={detailsRef} className="ma-sec mp-car-book mp-car-pd" aria-labelledby="mp-car-pd-t" data-done={done}>
          <header className="ma-sec-head">
            <h2 id="mp-car-pd-t" className="ma-h2">
              {done ? "Application sent" : "Your details"}
            </h2>
            <p className="ma-intro">{done ? "Thank you. Our HR team will read your details and write to you." : `Your answers are saved${ticketNo ? ` (reference ${ticketNo})` : ""}. Tell us about yourself, then send your application.`}</p>
          </header>
          <dl className="mp-car-sum">
            {summary
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
          </dl>
          {!done && (
            <button type="button" className="ma-link mp-car-edit" onClick={() => setView("form")}>
              Change my answers
            </button>
          )}
          {done ? (
            <p className="ma-note ma-note-ok" role="status">
              Application sent. We will write to {fields.email || "you"} soon.
            </p>
          ) : (
            <form
              className="mp-car-fm"
              onSubmit={(e) => {
                e.preventDefault();
                void confirm();
              }}
            >
              {COMMON_FIELDS.map((f) => (
                <label key={f.key} className="ma-field">
                  <span>
                    {f.label}
                    {f.required ? " *" : ""}
                  </span>
                  {f.kind === "textarea" ? (
                    <textarea className="ma-input" rows={3} value={fields[f.key] ?? ""} placeholder={f.placeholder} maxLength={800} aria-invalid={Boolean(problems[f.key])} onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })} />
                  ) : (
                    <input
                      className="ma-input"
                      type={f.kind}
                      inputMode={f.key === "phone" ? "tel" : f.key === "email" ? "email" : f.key === "currentCtc" || f.key === "expectedCtc" ? "decimal" : undefined}
                      autoComplete={f.key === "name" ? "name" : f.key === "email" ? "email" : f.key === "phone" ? "tel" : "off"}
                      value={fields[f.key] ?? ""}
                      placeholder={f.placeholder}
                      maxLength={f.key === "name" ? 50 : f.key === "phone" ? 20 : 200}
                      aria-invalid={Boolean(problems[f.key])}
                      onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
                    />
                  )}
                  {problems[f.key] && (
                    <small className="mp-car-ferr" role="alert">
                      {problems[f.key]}
                    </small>
                  )}
                </label>
              ))}
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
                      <Dropdown options={opts} value={pick(custom[q.id] ?? "", opts)} placeholder="Choose an option" onChange={(i) => setCustom({ ...custom, [q.id]: opts[i] })} />
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
          )}
        </section>
      )}
    </>
  );
}
