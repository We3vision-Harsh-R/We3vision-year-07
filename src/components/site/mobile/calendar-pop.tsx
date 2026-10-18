"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

/**
 * The month popover of iOS (Figma "Date Picker" 5442:5088 / 5442:5530): "April 2026 >" with the two arrows, the weekday letters, a grid of days,
 * today in the tint colour, the picked day as a solid disc, and a "Time" row with the time in a pill. It opens from the Calendar widget of the home
 * screen (event `ma:calendar`), floats in the middle on a dimmed, blurred page and springs in and out. Arrows and Escape work from the keyboard.
 */
export const openCalendar = () => window.dispatchEvent(new CustomEvent("ma:calendar"));

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function CalendarHost() {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [today, setToday] = useState(() => new Date(2026, 9, 16));
  const [view, setView] = useState({ y: 2026, m: 9 });
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    const on = () => {
      const d = new Date();
      setToday(d);
      setView({ y: d.getFullYear(), m: d.getMonth() });
      setPicked(d.getDate());
      setHost(document.querySelector<HTMLElement>(".lnc"));
      setLeaving(false);
      setOpen(true);
    };
    window.addEventListener("ma:calendar", on);
    return () => window.removeEventListener("ma:calendar", on);
  }, []);

  const close = () => {
    setLeaving(true);
    window.setTimeout(() => { setOpen(false); setLeaving(false); }, 260);
  };
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1).getDay();
    const n = new Date(view.y, view.m + 1, 0).getDate();
    return [...Array.from({ length: first }, () => 0), ...Array.from({ length: n }, (_, i) => i + 1)];
  }, [view]);
  const step = (by: number) => { setPicked(null); setView((v) => { const d = new Date(v.y, v.m + by, 1); return { y: d.getFullYear(), m: d.getMonth() }; }); };
  const isToday = (d: number) => d === today.getDate() && view.m === today.getMonth() && view.y === today.getFullYear();
  const title = new Date(view.y, view.m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const time = today.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (!open || !host) return null;
  return createPortal(
    <div className={`lnc-cp${leaving ? " is-out" : ""}`} role="dialog" aria-modal="true" aria-label="Calendar">
      <button type="button" className="lnc-cp-back" aria-label="Close" onClick={close} />
      <div className="lnc-cp-card">
        <div className="lnc-cp-head">
          <b>
            {title}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
          </b>
          <button type="button" onClick={() => step(-1)} aria-label="Previous month">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next month">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
          </button>
        </div>
        <div className="lnc-cp-week" aria-hidden="true">
          {DAYS.map((d) => <i key={d}>{d}</i>)}
        </div>
        <div key={`${view.y}-${view.m}`} className="lnc-cp-grid">
          {cells.map((d, i) =>
            d === 0 ? (
              <span key={i} />
            ) : (
              <button key={i} type="button" className={`${isToday(d) ? "is-today" : ""}${picked === d ? " is-picked" : ""}`} aria-pressed={picked === d} onClick={() => setPicked(d)}>
                {d}
              </button>
            ),
          )}
        </div>
        <div className="lnc-cp-time">
          <span>Time</span>
          <b>{time}</b>
        </div>
      </div>
    </div>,
    host,
  );
}
