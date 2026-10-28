"use client";

import "@/styles/careers.css";



import { useEffect, useMemo, useRef, useState } from "react";
import { bookSeat, completeTicket } from "@/actions/careers";
import { setCareer } from "@/lib/career-store";
import { cleanStatus, fieldProblem, statusProblem } from "@/lib/contact-validation";
import { resumeNameProblem } from "@/lib/resume-check";
import { ToastView, useToast } from "./cj-toast";
import { COMMON_FIELDS, CURRENT_STATUS_SUGGESTIONS, NOTICE_PERIODS, callSlots, type CareerQuestionView, type CareerRoleView } from "@/lib/careers-shared";
import { Combo, DatePick, Dropdown, ResumeBox, SlotPick } from "./form-controls";
import { LocationPicker } from "./location-picker";

// The first screen of the Careers page: the ticket office, all on ONE page, in three moments:
//   1. "Your location": the visitor types the first letters of their city (the cities that do not match go away as dust, the matching ones
//      come in) and clicks one. The city is the only thing that is needed to book a seat. Until then the page cannot be scrolled (a line says
//      so); as soon as the city is chosen the train comes to the platform and the page opens. If the visitor goes on down the page without a
//      booked seat, the train leaves without them and a notice says "You are missing your train".
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
  const { toast, notify, close: closeToast } = useToast();
  const [tried, setTried] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const [nudge] = useState(0); // how many times the visitor tried to scroll before the city was chosen
  const [missed, setMissed] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const warned = useRef(false);

  const role = roles.find((r) => r.id === roleId) ?? null;
  const days = useMemo(() => callSlots(), []);
  const roleOptions = useMemo(() => roles.map((r) => ({ value: r.id, label: r.team ? `${r.title} · ${r.team}` : r.title })), [roles]);
  const noticeOptions = useMemo(() => NOTICE_PERIODS.map((n) => ({ value: n, label: n })), []);

  // what the railway of the page needs to know: the train comes as soon as the city is chosen
  const answers = [city, status, roleId, joinDate, notice, resume?.url ?? "", slot];
  const step = answers.filter(Boolean).length;
  useEffect(() => {
    setCareer({ city, step, steps: 7, summoned: Boolean(city), passenger: Boolean(city), role: role?.title ?? "", name: fields.name ?? "" });
  }, [city, step, role?.title, fields.name]);

  // (until 2026-10-26 the page was locked here until the visitor chose a city: the scroll was blocked and sent back to the top. The team found it broken, so the page now scrolls freely; the booking form still opens only after a city is chosen.)

  // the page is open, but the seat is not booked: when the visitor goes on down the page the train leaves without them
  useEffect(() => {
    if (!city || booked) return;
    const check = () => {
      const away = window.scrollY > window.innerHeight * 0.55;
      setCareer({ away });
      if (away && !warned.current) {
        warned.current = true;
        setMissed(true);
      }
      if (!away) warned.current = false;
    };
    window.addEventListener("scroll", check, { passive: true });
    const first = requestAnimationFrame(check);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", check);
      setCareer({ away: false });
    };
  }, [city, booked]);
  useEffect(() => {
    setCareer({ stage: done ? "departing" : booked ? "booked" : "idle" });
  }, [booked, done]);

  // every field of the passenger form is valid (the same rules as on the server, lib/contact-validation.ts) and the needed ones are filled in
  const problems = Object.fromEntries(COMMON_FIELDS.map((c) => [c.key, fieldProblem(c.key, fields[c.key] ?? "") || (tried && c.required && !(fields[c.key] ?? "").trim() ? "This field is needed." : "")]));
  const firstProblem = Object.values(problems).find(Boolean) ?? "";
  const passengerOk = COMMON_FIELDS.every((c) => !c.required || (fields[c.key] ?? "").trim().length >= (c.key === "skills" || c.key === "name" ? 2 : 1)) && !firstProblem;
  const customOk = questions.every((q) => !q.required || (custom[q.id] ?? "").trim());

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

  // the seat: the city is the only thing that has to be there
  const book = async () => {
    setError("");
    const bad = statusProblem(status);
    if (bad) {
      setError(`Current career status: ${bad}`);
      return;
    }
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
      // every field that is wrong shows its own message and a red border (no box at the bottom)
      setTried(true);
      if (passengerOk) setError("Please answer the questions marked with *.");
      window.setTimeout(() => document.querySelector<HTMLElement>(".cj-pd [aria-invalid=true]")?.focus(), 60);
      return;
    }
    setBusy(true);
    const res = await completeTicket({ id: ticketId, fields, custom, website }).catch(() => ({ ok: false as const, error: "No connection. Please check your internet and try again." }));
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    notify("ok", "Your ticket is confirmed. The train is leaving for Surat Junction.");
    setDone(true);
    window.setTimeout(() => {
      // (to the platform, which is at the end of the station: the list of the jobs is beside it)
      const dest = document.getElementById("surat-station") ?? document.getElementById("surat-junction");
      if (dest) lenisTo(dest, { offset: 0, duration: 11, easing: (t: number) => 1 - Math.pow(1 - t, 2.2) });
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
            {!city && <p className="cj-sub">Type the first letters of your city. The page opens, and the train comes, as soon as you tell us where you are.</p>}
            <LocationPicker value={city} onSelect={setCity} onClear={() => setCity("")} locked={booked} />
            {!city && nudge > 0 && (
              <p key={nudge} className="cj-lock" role="status">
                Select your location once, then the train comes and the rest of the page opens.
              </p>
            )}
          </div>

          {city && view === "form" && (
            <div className="cj-form" key="form">
              <div className="cj-cell">
                <span className="cj-lab">
                  Current career status
                  <small>Type it yourself or pick one, like Fresher or Sr. Project Manager</small>
                </span>
                <Combo value={status} suggestions={CURRENT_STATUS_SUGGESTIONS} placeholder="Your current career status" label="Current career status" onChange={(v) => setStatus(cleanStatus(v))} />
                {statusProblem(status) && (
                  <small id="cj-status-err" className="cj-ferr" role="alert">
                    {statusProblem(status)}
                  </small>
                )}
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
                        <textarea
                          className="cj-in"
                          rows={2}
                          value={fields[f.key] ?? ""}
                          placeholder={f.placeholder}
                          maxLength={800}
                          disabled={done}
                          aria-invalid={Boolean(problems[f.key])}
                          onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
                        />
                      ) : (
                        <input
                          className="cj-in"
                          type={f.kind}
                          inputMode={f.key === "phone" ? "tel" : f.key === "email" ? "email" : f.key === "currentCtc" || f.key === "expectedCtc" ? "decimal" : undefined}
                          autoComplete={f.key === "name" ? "name" : f.key === "email" ? "email" : f.key === "phone" ? "tel" : "off"}
                          value={fields[f.key] ?? ""}
                          placeholder={f.placeholder}
                          maxLength={f.key === "name" ? 50 : f.key === "phone" ? 20 : 200}
                          disabled={done}
                          aria-invalid={Boolean(problems[f.key])}
                          onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
                        />
                      )}
                      {problems[f.key] && (
                        <small className="cj-ferr" role="alert">
                          {problems[f.key]}
                        </small>
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

        </div>

        {/* the platform and the train of the railway are drawn here (see career/railway.tsx) */}
        <div className="cj-slot" aria-hidden />
      </div>

      {missed && !booked && !done && (
        <div className="cj-miss" role="alertdialog" aria-labelledby="cj-miss-t">
          <span className="cj-miss-ic" aria-hidden />
          <div>
            <b id="cj-miss-t">You are missing your train!</b>
            <p>The train is leaving the platform without you. Go back and book your seat to board it.</p>
            <div className="cj-miss-act">
              <button
                type="button"
                className="cj-miss-go"
                onClick={() => {
                  setMissed(false);
                  lenisTo(0, { duration: 1.1 });
                }}
              >
                Back to the platform
              </button>
              <button type="button" className="cj-miss-no" onClick={() => setMissed(false)}>
                Keep reading
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastView toast={toast} onClose={closeToast} />
    </section>
  );
}
