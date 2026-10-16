"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { bookSeat, completeTicket } from "@/actions/careers";
import { setCareer } from "@/lib/career-store";
import { COMMON_FIELDS, CURRENT_STATUS_SUGGESTIONS, NOTICE_PERIODS, callSlots, type CareerQuestionView, type CareerRoleView } from "@/lib/careers-shared";
import { LocationPicker } from "./location-picker";

// The first screen of the Careers page: the ticket office, all on ONE page. The visitor first says where they are (the city is the only
// thing that is needed to book a seat). Then the ticket opens: FROM (the city) -> TO (an open position), and on the same ticket the optional
// answers (current status, notice period, the day they can join, resume, a call with HR) and the passenger details (the usual questions and
// the ones of HR from the admin panel). "Book your seat" books the seat with whatever is there; as soon as the passenger details are complete
// the ticket is confirmed and the train rides to Surat Junction.
// The railway itself (the platform on the right of this screen, the train, the passenger) is drawn by career/railway.tsx for the whole page.
// The look is in globals.css (.cj-*).

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
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const role = roles.find((r) => r.id === roleId) ?? null;
  const slots = useMemo(() => callSlots(), []);

  // what the railway of the page needs to know
  const answers = [city, status, roleId, joinDate, notice, resume?.url ?? "", slot];
  const step = answers.filter(Boolean).length;
  const summoned = Boolean(city && status && roleId) && !done;
  useEffect(() => {
    setCareer({ city, step, steps: 7, summoned: Boolean(city && status && roleId), passenger: Boolean(city), role: role?.title ?? "", name: fields.name ?? "" });
  }, [city, status, roleId, step, role?.title, fields.name]);
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
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const depart = () => {
    setDone(true);
    // the train rides to Surat Junction and the page rides with it
    window.setTimeout(() => {
      const dest = document.getElementById("surat-junction");
      if (dest) lenisTo(dest, { offset: -10, duration: 9, easing: (t: number) => 1 - Math.pow(1 - t, 2.2) });
    }, 700);
  };

  const confirm = async (id: string) => {
    const res = await completeTicket({ id, fields, custom, website });
    if (!res.ok) {
      setError(res.error);
      return false;
    }
    depart();
    return true;
  };

  const book = async () => {
    setError("");
    if (booked && !done) {
      if (!passengerOk || !customOk) {
        setError(passengerOk ? "Please answer the questions marked with *." : "Please fill in your name, email, phone and skills.");
        return;
      }
      setBusy(true);
      await confirm(ticketId);
      setBusy(false);
      return;
    }
    setBusy(true);
    const res = await bookSeat({ id: ticketId || undefined, city, currentStatus: status, roleId, joinDate, noticePeriod: notice, callSlot: slot, resume: resume?.url ?? "" });
    if (!res.ok) {
      setBusy(false);
      setError(res.error);
      return;
    }
    setTicketId(res.id);
    setBooked(true);
    // the passenger details are complete: the ticket is confirmed with the same press
    if (passengerOk && customOk) await confirm(res.id);
    setBusy(false);
  };

  const ticketNo = ticketId ? ticketId.slice(-6).toUpperCase() : "——————";
  const seatNo = ticketId ? `${(ticketId.charCodeAt(ticketId.length - 1) % 24) + 1}${"ABCD"[ticketId.charCodeAt(ticketId.length - 2) % 4]}` : "—";
  const need = booked && !done && (!passengerOk || !customOk);

  return (
    <section id="top" className="cj">
      <div className="cj-wrap">
        <div className="cj-main">
          <header className="cj-head" data-compact={Boolean(city)}>
            {chip && <span className="cj-chip">{chip}</span>}
            <h1>{heading.replace(/\n/g, " ")}</h1>
            {text && !city && <p>{text}</p>}
          </header>

          {!city ? (
            <div className="cj-window">
              <h2 className="cj-q">{locationLabel}</h2>
              <p className="cj-sub">Type the first letters of your city. The track stays empty until you tell us where you are.</p>
              <LocationPicker value="" onSelect={setCity} onClear={() => setCity("")} />
            </div>
          ) : (
            <div className="cj-pass" data-booked={booked} data-done={done}>
              <div className="cj-pass-main">
                <div className="cj-pass-top">
                  <span>We3vision Railways</span>
                  <span>Career ticket · No. {ticketNo}</span>
                </div>

                <div className="cj-route">
                  <div className="cj-from">
                    <small>From</small>
                    <b>{city}</b>
                    <button type="button" disabled={booked} onClick={() => setCity("")}>
                      Change
                    </button>
                  </div>
                  <span className="cj-arrow" aria-hidden />
                  <label className="cj-to">
                    <small>To · your destination</small>
                    <select value={roleId} disabled={booked} onChange={(e) => setRoleId(e.target.value)}>
                      <option value="">Choose an open position…</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.title}
                          {r.team ? ` · ${r.team}` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="cj-grid cj-grid-3">
                  <label className="cj-field">
                    <span>Current career status</span>
                    <input className="cj-in" list="cj-status" value={status} maxLength={80} placeholder="Fresher, Sr. Project Manager…" disabled={booked} onChange={(e) => setStatus(e.target.value)} />
                    <datalist id="cj-status">
                      {CURRENT_STATUS_SUGGESTIONS.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </label>
                  <label className="cj-field">
                    <span>How soon can you arrive?</span>
                    <select className="cj-in" value={notice} disabled={booked} onChange={(e) => setNotice(e.target.value)}>
                      <option value="">Notice period…</option>
                      {NOTICE_PERIODS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="cj-field">
                    <span>When can you join?</span>
                    <input className="cj-in" type="date" value={joinDate} disabled={booked} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setJoinDate(e.target.value)} />
                  </label>
                  <div className="cj-field">
                    <span>Resume</span>
                    {resume ? (
                      <div className="cj-file">
                        <b>{resume.name}</b>
                        <button type="button" disabled={booked} onClick={() => setResume(null)}>
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button type="button" className="cj-drop" disabled={booked || uploadBusy} onClick={() => fileRef.current?.click()}>
                        {uploadBusy ? "Uploading…" : "Upload PDF, DOC or DOCX"}
                      </button>
                    )}
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,application/pdf" hidden onChange={(e) => void upload(e.target.files?.[0])} />
                    {uploadErr && <em className="cj-err-s">{uploadErr}</em>}
                  </div>
                  <label className="cj-field cj-span2">
                    <span>A call with HR</span>
                    <select className="cj-in" value={slot} disabled={booked} onChange={(e) => setSlot(e.target.value)}>
                      <option value="">Book a call slot (optional)…</option>
                      {slots.map((d) => (
                        <optgroup key={d.label} label={d.label}>
                          {d.times.map((tm) => (
                            <option key={tm} value={`${d.label}, ${tm}`}>
                              {d.label}, {tm}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="cj-sep">
                  <span>Passenger details</span>
                </div>
                <div className="cj-grid cj-grid-3" data-need={need}>
                  {COMMON_FIELDS.map((f) => (
                    <label key={f.key} className={`cj-field${f.kind === "textarea" ? " cj-span2" : ""}${f.key === "about" ? " cj-span3" : ""}`}>
                      <span>
                        {f.label}
                        {f.required && <em> *</em>}
                      </span>
                      {f.kind === "textarea" ? (
                        <textarea className="cj-in" rows={f.key === "about" ? 2 : 2} value={fields[f.key] ?? ""} placeholder={f.placeholder} maxLength={800} disabled={done} onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })} />
                      ) : (
                        <input className="cj-in" type={f.kind} value={fields[f.key] ?? ""} placeholder={f.placeholder} maxLength={200} disabled={done} onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })} />
                      )}
                    </label>
                  ))}
                  {questions.map((q) => (
                    <label key={q.id} className={`cj-field${q.kind === "textarea" ? " cj-span2" : ""}`}>
                      <span>
                        {q.label}
                        {q.required && <em> *</em>}
                      </span>
                      {q.kind === "textarea" ? (
                        <textarea className="cj-in" rows={2} value={custom[q.id] ?? ""} maxLength={1000} disabled={done} onChange={(e) => setCustom({ ...custom, [q.id]: e.target.value })} />
                      ) : q.kind === "select" || q.kind === "yesno" ? (
                        <select className="cj-in" value={custom[q.id] ?? ""} disabled={done} onChange={(e) => setCustom({ ...custom, [q.id]: e.target.value })}>
                          <option value="">Choose…</option>
                          {(q.kind === "yesno" ? ["Yes", "No"] : q.options).map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input className="cj-in" value={custom[q.id] ?? ""} maxLength={300} disabled={done} onChange={(e) => setCustom({ ...custom, [q.id]: e.target.value })} />
                      )}
                    </label>
                  ))}
                </div>
                <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="cj-trap" />
              </div>

              <aside className="cj-stub">
                <div className="cj-stub-seatbox">
                  <p className="cj-stub-k">Seat</p>
                  <p className="cj-stub-seat">{seatNo}</p>
                </div>
                <dl className="cj-stub-sum">
                  <div>
                    <dt>From</dt>
                    <dd>{city}</dd>
                  </div>
                  <div>
                    <dt>To</dt>
                    <dd>{role?.title ?? "—"}</dd>
                  </div>
                  <div>
                    <dt>Arrive</dt>
                    <dd>{notice || "—"}</dd>
                  </div>
                </dl>
                <span className="cj-barcode" aria-hidden />
                <div className="cj-stub-act">
                  {done ? (
                    <p className="cj-stub-ok">Ticket confirmed. The train is leaving for Surat Junction…</p>
                  ) : (
                    <button type="button" className="cj-book" disabled={busy} onClick={() => void book()}>
                      {busy ? "Please wait…" : booked ? "Confirm the ticket" : "Book your seat"}
                    </button>
                  )}
                  {!booked && !done && <p className="cj-stub-hint">Only your city is needed to book a seat.</p>}
                  {booked && !done && !error && <p className="cj-stub-hint">Seat booked. Add the passenger details and confirm: the train leaves.</p>}
                  {error && <p className="cj-err">{error}</p>}
                </div>
              </aside>
            </div>
          )}
          {!summoned && city && !done && <p className="cj-note">Choose your current status and a destination: the train comes to the platform.</p>}
        </div>

        {/* the platform and the train of the railway are drawn here (see career/railway.tsx) */}
        <div className="cj-slot" aria-hidden />
      </div>
    </section>
  );
}
