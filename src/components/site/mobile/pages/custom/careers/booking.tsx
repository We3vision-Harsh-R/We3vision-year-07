"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { bookSeat, completeTicket } from "@/actions/careers";
import { COMMON_FIELDS, CURRENT_STATUS_SUGGESTIONS, NOTICE_PERIODS, callSlots, cityLabel, type CareerQuestionView, type CareerRoleView } from "@/lib/careers-shared";
import { fieldProblem, statusProblem } from "@/lib/contact-validation";
import { resumeNameProblem } from "@/lib/resume-check";
import { Dropdown } from "../../../app/dropdown";
import { IcPin } from "../../../app/icons";

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
  top,
  locationLabel,
  roles,
  questions,
}: {
  /** the pass at the top: chip, heading and text (built on the server) */
  top: ReactNode;
  locationLabel: string;
  roles: CareerRoleView[];
  questions: CareerQuestionView[];
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
  const [slotDay, setSlotDay] = useState(-1);
  const [slotTime, setSlotTime] = useState(-1);
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

  const days = useMemo(() => callSlots(), []);
  const roleLabels = useMemo(() => roles.map((r) => (r.team ? `${r.title} · ${r.team}` : r.title)), [roles]);
  const roleIdx = roles.findIndex((r) => r.id === roleId);
  const role = roleIdx >= 0 ? roles[roleIdx] : null;
  const slot = slotDay >= 0 && slotTime >= 0 ? `${days[slotDay].label}, ${days[slotDay].times[slotTime]}` : "";
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

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
    ["HR call", slot],
    ["Resume", resume?.name ?? ""],
  ];

  return (
    <>
      <section className="mp-car-hero">
        <div className="mp-car-pass">
          {top}
          <div className="mp-car-perf" aria-hidden="true" />
          <div className="mp-car-where">
            <h2 className="mp-car-q">{locationLabel}</h2>
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
                <p className="mp-car-sub">Type the first letters of your city, then tap it. The booking form opens under this card.</p>
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
                      setCity(cityLabel(shown[0]));
                    }
                  }}
                />
                <ul className="mp-car-cities" aria-label="Cities">
                  {shown.map((l) => (
                    <li key={l}>
                      <button type="button" onClick={() => setCity(cityLabel(l))}>
                        {cityLabel(l)}
                      </button>
                    </li>
                  ))}
                </ul>
                {query && shown.length === 0 && <p className="mp-car-none">{cities ? `No city starts with “${query}”. Check the spelling.` : "Loading the cities of the world…"}</p>}
              </>
            )}
          </div>
        </div>
      </section>

      {city && view === "form" && (
        <section className="ma-sec mp-car-book" aria-labelledby="mp-car-book-t">
          <header className="ma-sec-head">
            <h2 id="mp-car-book-t" className="ma-h2">
              Book your seat
            </h2>
            <p className="ma-intro">Only your city is needed. The rest helps us to prepare for you.</p>
          </header>
          <div className="mp-car-fm">
            <div className="ma-field">
              <span>Current career status</span>
              <Dropdown options={CURRENT_STATUS_SUGGESTIONS} value={pick(status, CURRENT_STATUS_SUGGESTIONS)} placeholder="Choose your current status" onChange={(i) => setStatus(CURRENT_STATUS_SUGGESTIONS[i])} />
            </div>
            <div className="ma-field">
              <span>Your destination (the open position)</span>
              {roles.length > 0 ? (
                <Dropdown options={roleLabels} value={roleIdx} placeholder="Choose an open position" onChange={(i) => setRoleId(roles[i].id)} />
              ) : (
                <p className="ma-note">No position is listed right now. You can still book a seat.</p>
              )}
            </div>
            <label className="ma-field">
              <span>When can you join?</span>
              <input className="ma-input" type="date" min={tomorrow} value={joinDate} onChange={(e) => setJoinDate(e.target.value)} />
            </label>
            <div className="ma-field">
              <span>Arrival time (your notice period)</span>
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
              <span>A call with HR</span>
              <div className="mp-car-slot">
                <Dropdown
                  options={days.map((d) => d.label)}
                  value={slotDay}
                  placeholder="Choose a day"
                  onChange={(i) => {
                    setSlotDay(i);
                    setSlotTime(-1);
                  }}
                />
                {slotDay >= 0 && <Dropdown options={days[slotDay].times} value={slotTime} placeholder="Choose a time" onChange={setSlotTime} />}
              </div>
            </div>
            <button type="button" className="ma-btn ma-btn-fill ma-btn-block" disabled={busy} onClick={() => void book()}>
              {busy ? "Please wait…" : "Book your seat"}
            </button>
            {error && <p className="ma-note ma-note-er">{error}</p>}
          </div>
        </section>
      )}

      {city && view === "details" && (
        <section ref={detailsRef} className="ma-sec mp-car-book mp-car-pd" aria-labelledby="mp-car-pd-t" data-done={done}>
          <header className="ma-sec-head">
            <h2 id="mp-car-pd-t" className="ma-h2">
              {done ? "Ticket confirmed" : "Your details"}
            </h2>
            <p className="ma-intro">{done ? "Thank you. Our HR team will read your details and write to you." : `Your seat is booked${ticketNo ? ` (ticket ${ticketNo})` : ""}. Tell us about yourself, then confirm the ticket.`}</p>
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
              Change the booking
            </button>
          )}
          {done ? (
            <p className="ma-note ma-note-ok" role="status">
              Ticket confirmed. We will write to {fields.email || "you"} soon.
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
                {busy ? "Please wait…" : "Confirm the ticket"}
              </button>
              {error && <p className="ma-note ma-note-er">{error}</p>}
            </form>
          )}
        </section>
      )}
    </>
  );
}
