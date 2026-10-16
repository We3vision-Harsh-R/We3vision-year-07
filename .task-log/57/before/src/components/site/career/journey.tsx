"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { bookSeat, completeTicket } from "@/actions/careers";
import { setCareer } from "@/lib/career-store";
import { COMMON_FIELDS, CURRENT_STATUS_SUGGESTIONS, NOTICE_PERIODS, callSlots, type CareerQuestionView, type CareerRoleView } from "@/lib/careers-shared";
import { LocationPicker } from "./location-picker";
import { TrainScene } from "./train-scene";

// The first screen of the Careers page: the ticket office. The visitor books the ticket of a career journey:
//   1. "Your location": the city (the only thing that must be there to book a seat)
//   2. optional: the current career status, the resume, the day they can join, the destination (an open position), how soon they can
//      arrive (the notice period) and a call slot with HR
//   3. "Book your seat": the seat is booked and the passenger details follow (the usual questions and the ones of HR from the admin panel)
//   4. the details are sent: the train leaves and arrives at Surat Junction, the last section of the page (career/destination.tsx)
// The train stands on the right. It only comes when the city, the status and the destination are chosen; "You" walks a step closer to the
// coach with every answer and steps back when an answer is taken away. The look is in globals.css (.cj-*).

type Resume = { url: string; name: string };

function scrollToEl(el: Element | null, offset = -90) {
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.3 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
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
  const [slotOpen, setSlotOpen] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [booked, setBooked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [website, setWebsite] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((x) => window.clearTimeout(x));
  }, []);

  const role = roles.find((r) => r.id === roleId) ?? null;
  const slots = useMemo(() => callSlots(), []);

  // the answers decide how far the passenger has walked, and whether the train is there
  const answers = [city, status, roleId, joinDate, notice, resume?.url ?? "", slot];
  const step = answers.filter(Boolean).length;
  const trainIn = Boolean(city && status && roleId) && !done;

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

  const book = async () => {
    setBusy(true);
    setError("");
    const res = await bookSeat({ id: ticketId || undefined, city, currentStatus: status, roleId, joinDate, noticePeriod: notice, callSlot: slot, resume: resume?.url ?? "" });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setTicketId(res.id);
    setBooked(true);
    // the selection scrolls away and the passenger details come
    later(() => scrollToEl(document.getElementById("cj-passenger"), -110), 650);
  };

  const unbook = () => {
    setBooked(false);
    setError("");
    later(() => scrollToEl(document.getElementById("cj-ticket"), -110), 100);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await completeTicket({ id: ticketId, fields, custom, website });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDone(true);
    setCareer({ stage: "departing", name: fields.name ?? "", role: role?.title ?? "", city });
    // the train leaves, then the page follows it to Surat Junction (the last section), where it arrives
    later(() => scrollToEl(document.getElementById("surat-junction"), -40), 1400);
    later(() => setCareer({ stage: "arriving" }), 3600);
    later(() => setCareer({ stage: "arrived" }), 6800);
  };

  const clearCity = () => {
    setCity("");
    setBooked(false);
  };

  return (
    <section id="top" className="cj">
      <div className="cj-wrap">
        <div className="cj-main">
          <header className="cj-head">
            {chip && <span className="cj-chip">{chip}</span>}
            <h1>{heading.replace(/\n/g, " ")}</h1>
            {text && <p>{text}</p>}
          </header>

          {/* 1. the location */}
          <div className="cj-block" data-step="1">
            <h2 className="cj-q">{locationLabel}</h2>
            <LocationPicker value={city} onSelect={setCity} onClear={clearCity} />
          </div>

          {/* 2. the rest of the ticket (all of it is optional) */}
          {city && (
            <div id="cj-ticket" className="cj-ticket" data-locked={booked}>
              <div className="cj-cols">
                <div className="cj-col">
                  <div className="cj-block">
                    <h3 className="cj-q">Your current career status</h3>
                    <input className="cj-in" value={status} maxLength={80} placeholder="e.g. Fresher, Senior Project Manager" disabled={booked} onChange={(e) => setStatus(e.target.value)} />
                    <div className="cj-opts">
                      {CURRENT_STATUS_SUGGESTIONS.map((s) => (
                        <button key={s} type="button" disabled={booked} data-on={status === s} onClick={() => setStatus(status === s ? "" : s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="cj-block">
                    <h3 className="cj-q">
                      When can you join We3vision? <small>optional</small>
                    </h3>
                    <input className="cj-in" type="date" value={joinDate} disabled={booked} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setJoinDate(e.target.value)} />
                  </div>

                  <div className="cj-block">
                    <h3 className="cj-q">
                      Upload your resume <small>optional · PDF, DOC or DOCX</small>
                    </h3>
                    {resume ? (
                      <div className="cj-file">
                        <span aria-hidden>📄</span>
                        <b>{resume.name}</b>
                        <button type="button" disabled={booked} onClick={() => setResume(null)}>
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button type="button" className="cj-drop" disabled={booked || uploadBusy} onClick={() => fileRef.current?.click()}>
                        {uploadBusy ? "Uploading…" : "Choose a file"}
                      </button>
                    )}
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,application/pdf" hidden onChange={(e) => void upload(e.target.files?.[0])} />
                    {uploadErr && <p className="cj-err">{uploadErr}</p>}
                  </div>
                </div>

                <div className="cj-col">
                  <div className="cj-block">
                    <h3 className="cj-q">Your destination: an open position at We3vision</h3>
                    <div className="cj-roles" role="radiogroup" aria-label="Open positions">
                      {roles.map((r) => (
                        <button key={r.id} type="button" role="radio" aria-checked={roleId === r.id} disabled={booked} data-on={roleId === r.id} onClick={() => setRoleId(roleId === r.id ? "" : r.id)}>
                          <b>{r.title}</b>
                          {r.team && <i>{r.team}</i>}
                        </button>
                      ))}
                      {roles.length === 0 && <p className="cj-none">No open positions are listed at the moment. You can still book a seat.</p>}
                    </div>
                  </div>

                  <div className="cj-block">
                    <h3 className="cj-q">
                      How soon can you arrive? <small>your notice period</small>
                    </h3>
                    <div className="cj-opts">
                      {NOTICE_PERIODS.map((n) => (
                        <button key={n} type="button" disabled={booked} data-on={notice === n} onClick={() => setNotice(notice === n ? "" : n)}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="cj-block">
                    <h3 className="cj-q">
                      A call with HR <small>optional</small>
                    </h3>
                    {slot ? (
                      <div className="cj-file">
                        <span aria-hidden>📞</span>
                        <b>{slot}</b>
                        <button type="button" disabled={booked} onClick={() => setSlot("")}>
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button type="button" className="cj-drop" disabled={booked} onClick={() => setSlotOpen((v) => !v)}>
                        {slotOpen ? "Close the slots" : "Book a call slot with HR"}
                      </button>
                    )}
                    {slotOpen && !slot && (
                      <div className="cj-slots">
                        {slots.map((d) => (
                          <div key={d.label}>
                            <p>{d.label}</p>
                            <div className="cj-opts">
                              {d.times.map((tm) => (
                                <button
                                  key={tm}
                                  type="button"
                                  onClick={() => {
                                    setSlot(`${d.label}, ${tm}`);
                                    setSlotOpen(false);
                                  }}
                                >
                                  {tm}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="cj-bookrow">
                {!booked ? (
                  <button type="button" className="cj-book" disabled={busy} onClick={() => void book()}>
                    {busy ? "Booking…" : "Book your seat"}
                  </button>
                ) : (
                  <p className="cj-ok">
                    Your seat is booked{role ? ` for ${role.title}` : ""}. Now the passenger details.
                    <button type="button" onClick={unbook}>
                      Change the ticket
                    </button>
                  </p>
                )}
                {!booked && <p className="cj-hint">Only your location is needed. Everything else is optional.</p>}
                {error && !booked && <p className="cj-err">{error}</p>}
              </div>
            </div>
          )}

          {/* 3. the passenger details */}
          {booked && (
            <form id="cj-passenger" className="cj-pass" onSubmit={submit} data-done={done}>
              <h2 className="cj-q">Passenger details</h2>
              <p className="cj-sub">Tell us who is travelling. The usual questions first, then the ones of our HR team.</p>
              <div className="cj-grid">
                {COMMON_FIELDS.map((f) => (
                  <label key={f.key} className="cj-field" data-wide={f.kind === "textarea"}>
                    <span>
                      {f.label}
                      {f.required && <em> *</em>}
                    </span>
                    {f.kind === "textarea" ? (
                      <textarea className="cj-in" rows={3} value={fields[f.key] ?? ""} placeholder={f.placeholder} maxLength={800} required={f.required} disabled={done} onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })} />
                    ) : (
                      <input className="cj-in" type={f.kind} value={fields[f.key] ?? ""} placeholder={f.placeholder} maxLength={200} required={f.required} disabled={done} onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })} />
                    )}
                  </label>
                ))}
                {questions.map((q) => (
                  <label key={q.id} className="cj-field" data-wide={q.kind === "textarea"}>
                    <span>
                      {q.label}
                      {q.required && <em> *</em>}
                    </span>
                    {q.kind === "textarea" ? (
                      <textarea className="cj-in" rows={3} value={custom[q.id] ?? ""} maxLength={1000} required={q.required} disabled={done} onChange={(e) => setCustom({ ...custom, [q.id]: e.target.value })} />
                    ) : q.kind === "select" || q.kind === "yesno" ? (
                      <select className="cj-in" value={custom[q.id] ?? ""} required={q.required} disabled={done} onChange={(e) => setCustom({ ...custom, [q.id]: e.target.value })}>
                        <option value="">Choose…</option>
                        {(q.kind === "yesno" ? ["Yes", "No"] : q.options).map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input className="cj-in" value={custom[q.id] ?? ""} maxLength={300} required={q.required} disabled={done} onChange={(e) => setCustom({ ...custom, [q.id]: e.target.value })} />
                    )}
                  </label>
                ))}
              </div>
              <input name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="cj-trap" />
              {error && <p className="cj-err">{error}</p>}
              {!done ? (
                <button type="submit" className="cj-book" disabled={busy}>
                  {busy ? "Sending…" : "Confirm the ticket and start the journey"}
                </button>
              ) : (
                <p className="cj-ok">Your ticket is confirmed. The train is leaving for Surat Junction…</p>
              )}
            </form>
          )}
        </div>

        {/* the station: only the track until the visitor has chosen; then the train comes */}
        <aside className="cj-side">
          <TrainScene mode="origin" trainIn={trainIn} gone={done} passenger={Boolean(city)} step={step} steps={7} seated={booked} sign="Platform 1 · Careers" />
          {!trainIn && <p className="cj-side-note">{city ? "Choose your current status and a destination to call the train." : "The track is empty. Choose your location to start."}</p>}
        </aside>
      </div>
    </section>
  );
}
