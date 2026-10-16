"use client";

import "@/styles/careers.css";


import { useEffect, useRef, useState } from "react";

// The fields of the ticket office (career/journey.tsx), drawn by us instead of the ones of the browser, so that they have the look of the page
// everywhere: a list of suggestions that is typed into (current career status), a list to choose from (destination, notice period), a
// calendar (the day the candidate can join), the call slots with HR and the box for the resume. The look is in globals.css (.cj-*).

export type Opt = { value: string; label: string; group?: string };

function useOutside(open: boolean, close: () => void, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open, close, ref]);
}

/** a list to choose from */
export function Dropdown({ value, options, placeholder, onChange, disabled, label }: { value: string; options: Opt[]; placeholder: string; onChange: (v: string) => void; disabled?: boolean; label: string }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  useOutside(open, () => setOpen(false), ref);
  const cur = options.find((o) => o.value === value);

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setHi(Math.max(0, options.findIndex((o) => o.value === value)));
        return;
      }
      const n = options.length;
      setHi((h) => (e.key === "ArrowDown" ? (h + 1) % n : (h - 1 + n) % n));
    } else if (e.key === "Enter" && open && hi >= 0) {
      e.preventDefault();
      choose(options[hi].value);
    }
  };

  return (
    <div ref={ref} className="cj-dd" data-open={open}>
      <button type="button" className="cj-in cj-dd-btn" aria-label={label} aria-haspopup="listbox" aria-expanded={open} data-empty={!cur} disabled={disabled} onClick={() => setOpen(!open)} onKeyDown={onKey}>
        <span>{cur ? cur.label : placeholder}</span>
      </button>
      {open && (
        <ul className="cj-dd-list" role="listbox" aria-label={label}>
          {options.map((o, i) => (
            <li key={o.value} role="presentation" style={{ display: "contents" }}>
              {o.group && o.group !== options[i - 1]?.group && <span className="cj-dd-group">{o.group}</span>}
              <button type="button" role="option" aria-selected={o.value === value} data-hi={i === hi} data-on={o.value === value} onClick={() => choose(o.value)}>
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** a field that is typed into, with suggestions under it */
export function Combo({ value, suggestions, placeholder, onChange, disabled, label }: { value: string; suggestions: string[]; placeholder: string; onChange: (v: string) => void; disabled?: boolean; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutside(open, () => setOpen(false), ref);
  const q = value.trim().toLowerCase();
  const list = suggestions.filter((s) => (!q || s.toLowerCase().includes(q)) && s.toLowerCase() !== q).slice(0, 6);
  return (
    <div ref={ref} className="cj-dd" data-open={open && list.length > 0}>
      <input
        className="cj-in"
        value={value}
        maxLength={80}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        aria-label={label}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && open && list[0]) {
            e.preventDefault();
            onChange(list[0]);
            setOpen(false);
          }
        }}
      />
      {open && list.length > 0 && (
        <ul className="cj-dd-list" role="listbox" aria-label={label}>
          {list.map((s) => (
            <li key={s} role="presentation" style={{ display: "contents" }}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const WEEK = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** a calendar: the day the candidate can join (from today on) */
export function DatePick({ value, onChange, disabled, placeholder, label }: { value: string; onChange: (v: string) => void; disabled?: boolean; placeholder: string; label: string }) {
  const [open, setOpen] = useState(false);
  const base = value ? new Date(`${value}T00:00:00`) : new Date();
  const [view, setView] = useState({ y: base.getFullYear(), m: base.getMonth() });
  const ref = useRef<HTMLDivElement>(null);
  useOutside(open, () => setOpen(false), ref);

  const now = new Date();
  const today = iso(now.getFullYear(), now.getMonth(), now.getDate());
  const first = new Date(view.y, view.m, 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const title = first.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const shown = value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : "";
  const canBack = view.y > now.getFullYear() || view.m > now.getMonth();
  const step = (n: number) => {
    const t = new Date(view.y, view.m + n, 1);
    setView({ y: t.getFullYear(), m: t.getMonth() });
  };

  return (
    <div ref={ref} className="cj-dd" data-open={open}>
      <button
        type="button"
        className="cj-in cj-dd-btn cj-date-btn"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-empty={!value}
        disabled={disabled}
        onClick={() => {
          if (!open) setView({ y: base.getFullYear(), m: base.getMonth() });
          setOpen(!open);
        }}
      >
        <span>{shown || placeholder}</span>
      </button>
      {open && (
        <div className="cj-dd-list cj-cal" role="dialog" aria-label={label}>
          <div className="cj-cal-head">
            <button type="button" disabled={!canBack} onClick={() => step(-1)} aria-label="Previous month">
              ‹
            </button>
            <b>{title}</b>
            <button type="button" onClick={() => step(1)} aria-label="Next month">
              ›
            </button>
          </div>
          <div className="cj-cal-grid">
            {WEEK.map((w) => (
              <span key={w} className="cj-cal-w">
                {w}
              </span>
            ))}
            {Array.from({ length: lead }, (_, i) => (
              <span key={`b${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const id = iso(view.y, view.m, i + 1);
              return (
                <button
                  key={id}
                  type="button"
                  disabled={id < today}
                  data-on={id === value}
                  data-today={id === today}
                  onClick={() => {
                    onChange(id);
                    setOpen(false);
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          {value && (
            <button
              type="button"
              className="cj-pop-clear"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              Clear the date
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** the call with HR: a button that opens the next working days and the three windows of a day */
export function SlotPick({ value, days, onChange, disabled, label }: { value: string; days: { label: string; times: string[] }[]; onChange: (v: string) => void; disabled?: boolean; label: string }) {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useOutside(open, () => setOpen(false), ref);
  const cur = days[day] ?? days[0];
  return (
    <div ref={ref} className="cj-dd" data-open={open}>
      <button type="button" className="cj-in cj-dd-btn cj-call" aria-label={label} aria-haspopup="dialog" aria-expanded={open} data-empty={!value} disabled={disabled} onClick={() => setOpen(!open)}>
        <i aria-hidden />
        <span>{value || "Book a call slot with HR"}</span>
      </button>
      {open && cur && (
        <div className="cj-dd-list cj-slotpop" role="dialog" aria-label={label}>
          <p className="cj-pop-k">Choose a day</p>
          <div className="cj-chips">
            {days.map((d, i) => (
              <button key={d.label} type="button" data-on={i === day} onClick={() => setDay(i)}>
                {d.label}
              </button>
            ))}
          </div>
          <p className="cj-pop-k">Choose a time</p>
          <div className="cj-chips">
            {cur.times.map((t) => {
              const v = `${cur.label}, ${t}`;
              return (
                <button
                  key={t}
                  type="button"
                  data-on={v === value}
                  onClick={() => {
                    onChange(v);
                    setOpen(false);
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {value && (
            <button
              type="button"
              className="cj-pop-clear"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              Remove the call slot
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** the box for the resume: a click or a file dropped on it */
export function ResumeBox({ file, busy, error, onFile, onClear, disabled }: { file: { name: string } | null; busy: boolean; error: string; onFile: (f: File | undefined) => void; onClear: () => void; disabled?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div className="cj-up-wrap">
      <div
        className="cj-up"
        data-over={over}
        data-has={Boolean(file)}
        onDragOver={(e) => {
          if (disabled || file) return;
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (!disabled && !file) onFile(e.dataTransfer.files?.[0]);
        }}
      >
        {file ? (
          <>
            <span className="cj-up-ic" data-ok aria-hidden />
            <b>{file.name}</b>
            <button type="button" disabled={disabled} onClick={onClear}>
              Remove
            </button>
          </>
        ) : (
          <button type="button" className="cj-up-btn" disabled={disabled || busy} onClick={() => input.current?.click()}>
            <span className="cj-up-ic" aria-hidden />
            <b>{busy ? "Uploading…" : "Upload your resume"}</b>
            <small>Drop a PDF, DOC or DOCX here, or click to choose (up to 5 MB)</small>
          </button>
        )}
        <input ref={input} type="file" accept=".pdf,.doc,.docx,application/pdf" hidden onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            onFile(f);
          }}
        />
      </div>
      {error && <em className="cj-err-s">{error}</em>}
    </div>
  );
}
