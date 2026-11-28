"use client";

import "@/styles/careers.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { bookSeat, completeTicket } from "@/actions/careers";
import { setCareer } from "@/lib/career-store";
import { cleanStatus, emailProblem, isValidEmail, isValidPhone, limitPhone, phoneProblem, statusProblem } from "@/lib/contact-validation";
import { resumeNameProblem } from "@/lib/resume-check";
import { commitName, knownName, setLiveName } from "@/lib/visitor-name";
import { ToastView, useToast } from "./cj-toast";
import { CURRENT_STATUS_SUGGESTIONS, NOTICE_PERIODS, callSlots, type CareerQuestionView, type CareerRoleView, type InterviewSchedule } from "@/lib/careers-shared";
import { Combo, DatePick, Dropdown, ResumeBox, SlotPick } from "./form-controls";
import { LocationPicker } from "./location-picker";

// The first screen of the Careers page: the ticket office, all on ONE page, one small step at a time (nothing is asked before its turn):
//   1. "Your first name": the only question at the start. While it is typed it is the label ("You") on the visitor's own pointer (lib/visitor-name.ts).
//   2. "Your location": the visitor types the first letters of their city (the cities that do not match go away as dust, the matching ones come in)
//      and clicks one. The train comes to the platform, ONCE, and the page opens. If the visitor goes on down the page without a seat, the train
//      leaves without them and a notice says "You are missing your train".
//   3. "How can we reach you?": the e-mail and the phone number, nothing else. (The name is not asked again anywhere.)
//   4. The journey: current career status (typed or picked) and the destination (the open positions of We3vision) are needed; the day the candidate
//      can join, the arrival time (notice period), the resume and a call slot with HR help us to prepare. "Apply now" sends the application.
//   5. The boarding pass: the seat, From (the career status) and To (the position), and nothing else. The train leaves and the page rides to
//      Surat Junction (career/destination.tsx), where the chosen position is lit and the others are soft.
// The railway itself (the platform on the right of this screen, the train, the passenger) is drawn by career/railway.tsx for the whole page.
// The look is in styles/careers.css (.cj-*) and styles/careers-flow.css (.cj-f-*); the fields are in career/form-controls.tsx.

type Resume = { url: string; name: string };

const PASS_MS = 3400; // the boarding pass is on the screen this long before the train leaves

function lenisTo(target: Element | number, opts: object) {
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element | number, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(target, opts);
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** a first name while it is typed: letters (and marks) and single spaces, nothing else (the same letters as the server accepts for a name) */
const cleanFirst = (v: string) => v.replace(/[^\p{L}\p{M}\s]/gu, "").replace(/^\s+/, "").replace(/\s{2,}/g, " ").slice(0, 30);
const letters = (v: string) => (v.match(/\p{L}/gu) ?? []).length;

export function CareerJourney({
  chip,
  heading,
  text,
  locationLabel,
  roles,
  schedule,
}: {
  chip: string;
  heading: string;
  text: string;
  locationLabel: string;
  roles: CareerRoleView[];
  questions: CareerQuestionView[];
  schedule?: InterviewSchedule;
}) {
  const [firstName, setFirstName] = useState("");
  const [nameDone, setNameDone] = useState(false);
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactDone, setContactDone] = useState(false);
  const [edit, setEdit] = useState<"" | "name" | "contact">("");
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
  const [tried, setTried] = useState(false);
  const { toast, notify, close: closeToast } = useToast();
  const [website, setWebsite] = useState("");
  const [missed, setMissed] = useState(false);
  const passRef = useRef<HTMLDivElement>(null);
  const warned = useRef(false);
  const timers = useRef<number[]>([]);

  const role = roles.find((r) => r.id === roleId) ?? null;
  const days = useMemo(() => callSlots(new Date(), schedule), [schedule]);
  const roleOptions = useMemo(() => roles.map((r) => ({ value: r.id, label: r.team ? `${r.title} · ${r.team}` : r.title })), [roles]);
  const noticeOptions = useMemo(() => NOTICE_PERIODS.map((n) => ({ value: n, label: n })), []);

  // the name of a visitor who gave it before (the first visit or the colour picker) is already in the field
  useEffect(() => {
    const known = knownName().split(" ")[0] ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one time, once the page is in the browser (the saved name is not there on the server)
    if (known) setFirstName((cur) => cur || cleanFirst(known));
  }, []);
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((x) => window.clearTimeout(x));
  }, []);

  // the steps
  const nameValid = letters(firstName) >= 2;
  const nameActive = !nameDone || edit === "name";
  const contactValid = isValidEmail(email) && isValidPhone(phone);
  const contactActive = !contactDone || edit === "contact";
  const showDetails = Boolean(city) && contactDone && !booked && edit === "";

  // what the railway of the page needs to know: the train comes as soon as the city is chosen (and only then)
  const answers = [nameDone ? firstName.trim() : "", city, contactDone ? "contact" : "", status.trim(), roleId, joinDate, notice, resume?.url ?? "", slot];
  const step = answers.filter(Boolean).length;
  useEffect(() => {
    setCareer({ city, step, steps: 9, summoned: Boolean(city), passenger: Boolean(city), role: role?.title ?? "", roleId, name: firstName.trim() });
  }, [city, step, role?.title, roleId, firstName]);

  // (until 2026-10-26 the page was locked here until the visitor chose a city: the scroll was blocked and sent back to the top. The team found it broken, so the page now scrolls freely; the form opens step by step.)

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

  const submitName = () => {
    if (!nameValid) return;
    const n = firstName.trim();
    setFirstName(n);
    commitName(n);
    setNameDone(true);
    setEdit("");
  };
  const submitContact = () => {
    if (!contactValid) return;
    setContactDone(true);
    setEdit("");
  };

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

  // the application: the seat is booked, the contact details are saved with it, and the boarding pass opens
  const statusMsg = statusProblem(status) || (tried && !status.trim() ? "Please tell us your current career status." : "");
  const roleMsg = tried && roles.length > 0 && !roleId ? "Please choose the position you want." : "";
  const apply = async () => {
    setError("");
    setTried(true);
    if (statusProblem(status) || !status.trim() || (roles.length > 0 && !roleId)) return;
    setBusy(true);
    const res = await bookSeat({ id: ticketId || undefined, city, currentStatus: status, roleId, joinDate, noticePeriod: notice, callSlot: slot, resume: resume?.url ?? "" });
    if (!res.ok) {
      setBusy(false);
      setError(res.error);
      return;
    }
    setTicketId(res.id);
    // (the name was asked once, at the start; here only the contact details go with it)
    const fin = await completeTicket({ id: res.id, fields: { name: firstName.trim(), email: email.trim(), phone: phone.trim() }, custom: {}, website, lean: true }).catch(() => ({ ok: false as const, error: "No connection. Please check your internet and try again." }));
    setBusy(false);
    if (!fin.ok) {
      setError(fin.error);
      return;
    }
    setBooked(true);
    // the pass opens where the form was; after a moment the train leaves and the page rides with it to Surat Junction
    timers.current.push(window.setTimeout(() => passRef.current && lenisTo(passRef.current, { offset: -140, duration: 0.9 }), 160));
    timers.current.push(
      window.setTimeout(() => {
        notify("ok", "Your seat is booked. The train is leaving for Surat Junction.");
        setDone(true);
        timers.current.push(
          window.setTimeout(() => {
            // (to the platform, which is at the end of the station: the list of the jobs is beside it. Slow and soft: it starts gently and ends gently.)
            const dest = document.getElementById("surat-station") ?? document.getElementById("surat-junction");
            if (dest) lenisTo(dest, { offset: 0, duration: 12, easing: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2 });
          }, 700),
        );
      }, PASS_MS),
    );
  };

  const seatNo = ticketId ? `${(ticketId.charCodeAt(ticketId.length - 1) % 24) + 1}${"ABCD"[ticketId.charCodeAt(ticketId.length - 2) % 4]}` : "—";

  return (
    <section id="top" className="cj">
      <div className="cj-wrap">
        <div className="cj-main">
          <header className="cj-head" data-compact={Boolean(city)}>
            {chip && <span className="cj-chip">{chip}</span>}
            <h1>{heading.replace(/\n/g, " ")}</h1>
            {text && !city && <p>{text}</p>}
          </header>

          {!booked && (
            <div className="cj-f-step cj-f-name" key="name">
              {nameActive ? (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitName();
                  }}
                >
                  <h2 className="cj-q">Your first name</h2>
                  <p className="cj-sub">Only your first name to start with. It is the label on your pointer while you are here.</p>
                  <div className="cj-f-row">
                    <input
                      className="cj-in cj-f-in"
                      value={firstName}
                      placeholder="Your first name"
                      autoComplete="given-name"
                      maxLength={30}
                      spellCheck={false}
                      aria-label="Your first name"
                      autoFocus={!nameDone}
                      onChange={(e) => {
                        const v = cleanFirst(e.target.value);
                        setFirstName(v);
                        setLiveName(v);
                      }}
                    />
                    <button type="submit" className="cj-book cj-f-next" disabled={!nameValid}>
                      Continue
                    </button>
                  </div>
                  {firstName.trim() && !nameValid && <small className="cj-ferr cj-f-note">Please write at least 2 letters.</small>}
                </form>
              ) : (
                <div className="cj-picked cj-f-picked">
                  <span className="cj-f-ic" aria-hidden>
                    {firstName.trim().charAt(0).toUpperCase()}
                  </span>
                  <b>{firstName}</b>
                  <button type="button" onClick={() => setEdit("name")} aria-label="Change your first name">
                    Change
                  </button>
                </div>
              )}
            </div>
          )}

          {nameDone && !booked && (
            <div className="cj-loc-block cj-f-step" key="loc">
              <h2 className="cj-q">{locationLabel}</h2>
              {!city && <p className="cj-sub">Type the first letters of your city. The train comes as soon as you tell us where you are.</p>}
              <LocationPicker value={city} onSelect={setCity} onClear={() => setCity("")} locked={booked} />
            </div>
          )}

          {city && nameDone && !booked && (
            <div className="cj-f-step cj-f-contact" key="contact">
              {contactActive ? (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitContact();
                  }}
                >
                  <h2 className="cj-q">How can we reach you?</h2>
                  <p className="cj-sub">Your e-mail and your phone number. Nothing else is asked yet.</p>
                  <div className="cj-f-two">
                    <label className="cj-cell">
                      <span className="cj-lab">E-mail</span>
                      <input
                        className="cj-in cj-f-in"
                        type="email"
                        inputMode="email"
                        value={email}
                        maxLength={200}
                        placeholder="you@example.com"
                        autoComplete="email"
                        autoFocus
                        aria-invalid={Boolean(email && emailProblem(email))}
                        onChange={(e) => setEmail(e.target.value.replace(/\s/g, ""))}
                      />
                      {email && emailProblem(email) && <small className="cj-ferr">{emailProblem(email)}</small>}
                    </label>
                    <label className="cj-cell">
                      <span className="cj-lab">Phone / WhatsApp</span>
                      <input
                        className="cj-in cj-f-in"
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        maxLength={20}
                        placeholder="+91 …"
                        autoComplete="tel"
                        aria-invalid={Boolean(phone && phoneProblem(phone))}
                        onChange={(e) => setPhone(limitPhone(e.target.value))}
                      />
                      {phone && phoneProblem(phone) && <small className="cj-ferr">{phoneProblem(phone)}</small>}
                    </label>
                  </div>
                  <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="cj-trap" />
                  <div className="cj-f-row cj-f-row-end">
                    <button type="submit" className="cj-book cj-f-next" disabled={!contactValid}>
                      Continue
                    </button>
                  </div>
                </form>
              ) : (
                <div className="cj-picked cj-f-picked">
                  <span className="cj-f-ic" aria-hidden>
                    @
                  </span>
                  <b>
                    {email} · {phone}
                  </b>
                  <button type="button" onClick={() => setEdit("contact")} aria-label="Change your contact details">
                    Change
                  </button>
                </div>
              )}
            </div>
          )}

          {showDetails && (
            <div className="cj-form" key="form">
              <div className="cj-cell">
                <span className="cj-lab">
                  Current career status
                  <small>Type it yourself or pick one, like Fresher or Sr. Project Manager</small>
                </span>
                <Combo value={status} suggestions={CURRENT_STATUS_SUGGESTIONS} placeholder="Your current career status" label="Current career status" onChange={(v) => setStatus(cleanStatus(v))} />
                {statusMsg && (
                  <small id="cj-status-err" className="cj-ferr" role="alert">
                    {statusMsg}
                  </small>
                )}
              </div>
              <div className="cj-cell">
                <span className="cj-lab">
                  Your destination
                  <small>The open positions at We3vision</small>
                </span>
                <Dropdown value={roleId} options={roleOptions} placeholder="Choose an open position" label="Your destination" onChange={setRoleId} />
                {roleMsg && (
                  <small className="cj-ferr" role="alert">
                    {roleMsg}
                  </small>
                )}
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
                  Book your interview slot
                  <small>Choose a day and a time for your interview</small>
                </span>
                <SlotPick value={slot} days={days} label="Your interview slot" onChange={setSlot} />
              </div>
              <div className="cj-act">
                <button type="button" className="cj-book" disabled={busy} onClick={() => void apply()}>
                  {busy ? "Please wait…" : "Apply now"}
                </button>
                {error ? <p className="cj-err">{error}</p> : <p className="cj-hint">Your career status and your destination are needed. The rest helps us to prepare for you.</p>}
              </div>
            </div>
          )}

          {booked && (
            <div ref={passRef} className="cj-f-pass-wrap" key="pass">
              <dl className="cj-f-pass" data-done={done} aria-label="Your boarding pass">
                <div className="cj-f-pass-main">
                  <div className="cj-f-pass-end">
                    <dt>From</dt>
                    <dd>{status.trim()}</dd>
                  </div>
                  <span className="cj-f-pass-way" aria-hidden>
                    <i />
                  </span>
                  <div className="cj-f-pass-end">
                    <dt>To</dt>
                    <dd>{role?.title ?? "Surat Junction"}</dd>
                  </div>
                </div>
                <div className="cj-f-pass-seat">
                  <dt>Seat</dt>
                  <dd>{seatNo}</dd>
                </div>
              </dl>
              <p className="cj-f-pass-note" role="status">
                {done ? "The train is leaving for Surat Junction…" : "Your seat is booked."}
              </p>
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
            <p>The train is leaving the platform without you. Go back and apply to board it.</p>
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
