"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { bookSeat, completeTicket } from "@/actions/careers";
import { setCareer } from "@/lib/career-store";
import { COMMON_FIELDS, CURRENT_STATUS_SUGGESTIONS, NOTICE_PERIODS, callSlots, type CareerQuestionView, type CareerRoleView } from "@/lib/careers-shared";
import { Combo, DatePick, Dropdown, ResumeBox, SlotPick } from "./form-controls";
import { LocationPicker } from "./location-picker";

// The first screen of the Careers page: the ticket office, all on ONE page, in three moments:
//   1. "Your location": the visitor types the first letters of their city (the cities that do not match go away as dust, the matching ones
//      come in) and clicks one. The city is the only thing that is needed to book a seat.
//   2. The questions of the booking, nothing else: current career status (typed or picked), the destination (the open positions of We3vision),
//      the day the candidate can join, the arrival time (notice period), the resume and a call slot with HR. "Book your seat" books it.
//   3. The passenger details (the usual questions and the ones of HR from the admin panel) under a summary of the seat. "Confirm the ticket"
//      sends them: the train leaves and the page rides to Surat Junction.
// The railway itself (the platform on the right of this screen, the train, the passenger) is drawn by career/railway.tsx for the whole page.
// The look is in globals.css (.cj-*); the fields are in career/form-controls.tsx.

type Resume = { url: string; name: string };

function lenisTo(target: Element | number, opts: object) {
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element | number, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(target, opts);
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CareerJourney({
  chip,
  heading,
  text,
  locationLabel,
  roles,
  questions,
}: {
  chip: string;
  heading: string;
  text: string;
  locationLabel: string;
  roles: CareerRoleView[];
  questions: CareerQuestionView[];
}) {
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [roleId, setRoleId] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [notice, setNotice] = useState("");
  const [resume, setResume] = useState<Resume | null>(null);
  const [slot, setSlot] = useState("");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [booked, setBooked] = useState(false);
  const [view, setView] = useState<"form" | "details">("form");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const detailsRef = useRef<HTMLDivElement>(null);

  const role = roles.find((r) => r.id === roleId) ?? null;
  const days = useMemo(() => callSlots(), []);
  const roleOptions = useMemo(() => roles.map((r) => ({ value: r.id, label: r.team ? `${r.title} · ${r.team}` : r.title })), [roles]);
  const noticeOptions = useMemo(() => NOTICE_PERIODS.map((n) => ({ value: n, label: n })), []);

  // what the railway of the page needs to know: the train comes when the city, the current status and the destination are chosen (or the seat is booked)
  const answers = [city, status, roleId, joinDate, notice, resume?.url ?? "", slot];
  const step = answers.filter(Boolean).length;
  const called = Boolean(city && ((status && roleId) || booked));
  const summoned = called && !done;
  useEffect(() => {
    setCareer({ city, step, steps: 7, summoned: called, passenger: Boolean(city), role: role?.title ?? "", name: fields.name ?? "" });
  }, [city, step, called, role?.title, fields.name]);
  useEffect(() => {
    setCareer({ stage: done ? "departing" : booked ? "booked" : "idle" });
  }, [booked, done]);

  const passengerOk = (fields.name ?? "").trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((fields.email ?? "").trim()) && (fields.phone ?? "").replace(/\D/g, "").length >= 6 && (fields.skills ?? "").trim().length >= 2;
  const customOk = questions.every((q) => !q.required || (custom[q.id] ?? "").trim());

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

  // the seat: the city is the only thing that has to be there
  const book = async () => {
    setError("");
    setBusy(true);
    const res = await bookSeat({ id: ticketId || undefined, city, currentStatus: status, roleId, joinDate, noticePeriod: notice, callSlot: slot, resume: resume?.url ?? "" });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setTicketId(res.id);
    setBooked(true);
    setView("details");
    // the passenger details open under the seat: the page rides there
    window.setTimeout(() => {
      if (detailsRef.current) lenisTo(detailsRef.current, { offset: -96, duration: 1.2 });
    }, 220);
  };

  // the ticket: the passenger details are in, the train leaves and the page rides with it to Surat Junction
  const confirm = async () => {
    setError("");
    if (!passengerOk || !customOk) {
      setError(passengerOk ? "Please answer the questions marked with *." : "Please fill in your name, email, phone and skills.");
      return;
    }
    setBusy(true);
    const res = await completeTicket({ id: ticketId, fields, custom, website });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDone(true);
    window.setTimeout(() => {
      const dest = document.getElementById("surat-junction");
      if (dest) lenisTo(dest, { offset: -10, duration: 9, easing: (t: number) => 1 - Math.pow(1 - t, 2.2) });
    }, 700);
  };

  const ticketNo = ticketId ? ticketId.slice(-6).toUpperCase() : "——————";
  const seatNo = ticketId ? `${(ticketId.charCodeAt(ticketId.length - 1) % 24) + 1}${"ABCD"[ticketId.charCodeAt(ticketId.length - 2) % 4]}` : "—";
  const need = booked && !done && (!passengerOk || !customOk);
  const joinShown = joinDate ? new Date(`${joinDate}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <section id="top" className="cj">
      <div className="cj-wrap">
        <div className="cj-main">
          <header className="cj-head" data-compact={Boolean(city)}>
            {chip && <span className="cj-chip">{chip}</span>}
            <h1>{heading.replace(/\n/g, " ")}</h1>
            {text && !city && <p>{text}</p>}
          </header>

          <div className="cj-loc-block">
            <h2 className="cj-q">{locationLabel}</h2>
            {!city && <p className="cj-sub">Type the first letters of your city. The track stays empty until you tell us where you are.</p>}
            <LocationPicker value={city} onSelect={setCity} onClear={() => setCity("")} locked={booked} />
          </div>

          {city && view === "form" && (
            <div className="cj-form" key="form">
              <div className="cj-cell">
                <span className="cj-lab">
                  Current career status
                  <small>Type it yourself or pick one, like Fresher or Sr. Project Manager</small>
                </span>
                <Combo value={status} suggestions={CURRENT_STATUS_SUGGESTIONS} placeholder="Your current career status" label="Current career status" onChange={setStatus} />
              </div>
              <div className="cj-cell">
                <span className="cj-lab">
                  Your destination
                  <small>The open positions at We3vision</small>
                </span>
                <Dropdown value={roleId} options={roleOptions} placeholder="Choose an open position" label="Your destination" onChange={setRoleId} />
              </div>
              <div className="cj-cell">
                <span className="cj-lab">
                  When can you join?
                  <small>The day you can join We3vision</small>
                </span>
                <DatePick value={joinDate} placeholder="Choose a date" label="The day you can join" onChange={setJoinDate} />
              </div>
              <div className="cj-cell">
                <span className="cj-lab">
                  Arrival time
                  <small>How soon can you arrive: your notice period</small>
                </span>
                <Dropdown value={notice} options={noticeOptions} placeholder="Choose your notice period" label="Arrival time, your notice period" onChange={setNotice} />
              </div>
              <div className="cj-cell">
                <span className="cj-lab">
                  Upload your resume
                  <small>PDF, DOC or DOCX</small>
                </span>
                <ResumeBox file={resume} busy={uploadBusy} error={uploadErr} onFile={(f) => void upload(f)} onClear={() => setResume(null)} />
              </div>
              <div className="cj-cell">
                <span className="cj-lab">
                  A call with HR
                  <small>Book a call slot with our HR team</small>
                </span>
                <SlotPick value={slot} days={days} label="A call slot with HR" onChange={setSlot} />
              </div>
              <div className="cj-act">
                <button type="button" className="cj-book" disabled={busy} onClick={() => void book()}>
                  {busy ? "Please wait…" : booked ? "Update your seat" : "Book your seat"}
                </button>
                {error ? <p className="cj-err">{error}</p> : <p className="cj-hint">Only your city is needed to book a seat. The rest helps us to prepare for you.</p>}
              </div>
            </div>
          )}

          {city && view === "details" && (
            <div className="cj-after" key="details">
              <dl className="cj-sum">
                <div data-seat>
                  <dt>Seat</dt>
                  <dd>{seatNo}</dd>
                </div>
                <div>
                  <dt>From</dt>
                  <dd>{city}</dd>
                </div>
                <div>
                  <dt>To</dt>
                  <dd>{role?.title ?? "—"}</dd>
                </div>
                {status && (
                  <div>
                    <dt>Status</dt>
                    <dd>{status}</dd>
                  </div>
                )}
                {joinShown && (
                  <div>
                    <dt>Joins</dt>
                    <dd>{joinShown}</dd>
                  </div>
                )}
                {notice && (
                  <div>
                    <dt>Arrives</dt>
                    <dd>{notice}</dd>
                  </div>
                )}
                {slot && (
                  <div>
                    <dt>HR call</dt>
                    <dd>{slot}</dd>
                  </div>
                )}
                {resume && (
                  <div>
                    <dt>Resume</dt>
                    <dd>{resume.name}</dd>
                  </div>
                )}
                {!done && (
                  <button type="button" className="cj-sum-edit" onClick={() => setView("form")}>
                    Change the booking
                  </button>
                )}
              </dl>

              <div ref={detailsRef} className="cj-pd" data-done={done}>
                <div className="cj-pd-top">
                  <span>Passenger details</span>
                  <span>Ticket · No. {ticketNo}</span>
                </div>
                <p className="cj-pd-sub">Your seat is booked. Tell us who is travelling, then confirm the ticket: the train leaves.</p>
                <div className="cj-grid cj-grid-3" data-need={need}>
                  {COMMON_FIELDS.map((f) => (
                    <label key={f.key} className={`cj-field${f.kind === "textarea" ? " cj-span2" : ""}${f.key === "about" ? " cj-span3" : ""}`}>
                      <span>
                        {f.label}
                        {f.required && <em> *</em>}
                      </span>
                      {f.kind === "textarea" ? (
                        <textarea className="cj-in" rows={2} value={fields[f.key] ?? ""} placeholder={f.placeholder} maxLength={800} disabled={done} onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })} />
                      ) : (
                        <input className="cj-in" type={f.kind} value={fields[f.key] ?? ""} placeholder={f.placeholder} maxLength={200} disabled={done} onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })} />
                      )}
                    </label>
                  ))}
                  {questions.map((q) => (
                    <div key={q.id} className={`cj-field${q.kind === "textarea" ? " cj-span2" : ""}`}>
                      <span>
                        {q.label}
                        {q.required && <em> *</em>}
                      </span>
                      {q.kind === "textarea" ? (
                        <textarea className="cj-in" rows={2} value={custom[q.id] ?? ""} maxLength={1000} disabled={done} onChange={(e) => setCustom({ ...custom, [q.id]: e.target.value })} />
                      ) : q.kind === "select" || q.kind === "yesno" ? (
                        <Dropdown
                          value={custom[q.id] ?? ""}
                          options={(q.kind === "yesno" ? ["Yes", "No"] : q.options).map((o) => ({ value: o, label: o }))}
                          placeholder="Choose"
                          label={q.label}
                          disabled={done}
                          onChange={(v) => setCustom({ ...custom, [q.id]: v })}
                        />
                      ) : (
                        <input className="cj-in" value={custom[q.id] ?? ""} maxLength={300} disabled={done} aria-label={q.label} onChange={(e) => setCustom({ ...custom, [q.id]: e.target.value })} />
                      )}
                    </div>
                  ))}
                </div>
                <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="cj-trap" />
                <div className="cj-act">
                  {done ? (
                    <p className="cj-ok">Ticket confirmed. The train is leaving for Surat Junction…</p>
                  ) : (
                    <button type="button" className="cj-book" disabled={busy} onClick={() => void confirm()}>
                      {busy ? "Please wait…" : "Confirm the ticket"}
                    </button>
                  )}
                  {error && <p className="cj-err">{error}</p>}
                </div>
              </div>
            </div>
          )}

          {city && !summoned && !done && view === "form" && <p className="cj-note">Choose your current status and a destination: the train comes to the platform.</p>}
        </div>

        {/* the platform and the train of the railway are drawn here (see career/railway.tsx) */}
        <div className="cj-slot" aria-hidden />
      </div>
    </section>
  );
}
