"use client";

import { useMemo, useState } from "react";
import type { InterviewDay } from "@/lib/careers-shared";

// "Book your interview slot": a small calendar of the next three weeks (Sunday is free), then the time windows of the chosen day.
// A window that another candidate has already taken is shown as full. The value is the text that is saved: "Wed, 26 Nov, 11:00 – 12:00".

const HEAD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function SlotCalendar({ days, taken, value, onChange }: { days: InterviewDay[]; taken: Set<string>; value: string; onChange: (slot: string) => void }) {
  const byIso = useMemo(() => new Map(days.map((d) => [d.iso, d])), [days]);
  const full = (d: InterviewDay) => d.times.every((t) => taken.has(`${d.label}, ${t}`));
  const picked = days.find((d) => value.startsWith(`${d.label}, `)) ?? null;
  const [open, setOpen] = useState<string>(() => picked?.iso ?? days.find((d) => !full(d))?.iso ?? days[0]?.iso ?? "");
  const cells = useMemo(() => {
    if (!days.length) return [];
    const first = new Date(`${days[0].iso}T00:00:00Z`);
    const last = new Date(`${days[days.length - 1].iso}T00:00:00Z`);
    first.setUTCDate(first.getUTCDate() - ((first.getUTCDay() + 6) % 7));
    last.setUTCDate(last.getUTCDate() + ((7 - last.getUTCDay()) % 7));
    const out: { iso: string; n: number; m: number; first: boolean }[] = [];
    for (const d = new Date(first); d <= last; d.setUTCDate(d.getUTCDate() + 1)) out.push({ iso: d.toISOString().slice(0, 10), n: d.getUTCDate(), m: d.getUTCMonth(), first: d.getUTCDate() === 1 });
    return out;
  }, [days]);
  const active = byIso.get(open) ?? null;
  const m0 = days.length ? new Date(`${days[0].iso}T00:00:00Z`) : null;
  const m1 = days.length ? new Date(`${days[days.length - 1].iso}T00:00:00Z`) : null;
  const title = m0 && m1 ? (m0.getUTCMonth() === m1.getUTCMonth() ? `${MONTHS[m0.getUTCMonth()]} ${m0.getUTCFullYear()}` : `${MONTHS[m0.getUTCMonth()]} – ${MONTHS[m1.getUTCMonth()]} ${m1.getUTCFullYear()}`) : "";

  return (
    <div className="mp-car-cal">
      <p className="mp-car-cal-t">{title}</p>
      <div className="mp-car-cal-g" aria-label="Choose a day for your interview">
        {HEAD.map((h) => (
          <span key={h} className="mp-car-cal-h">
            {h}
          </span>
        ))}
        {cells.map((c) => {
          const d = byIso.get(c.iso);
          if (!d) return <span key={c.iso} className="mp-car-cal-x" aria-hidden="true" />;
          const isFull = full(d);
          return (
            <button
              key={c.iso}
              type="button"
              disabled={isFull}
              data-on={open === c.iso}
              data-pick={picked?.iso === c.iso}
              aria-pressed={open === c.iso}
              aria-label={`${d.label}${isFull ? ", fully booked" : ""}`}
              className="mp-car-cal-d"
              onClick={() => setOpen(c.iso)}
            >
              {c.first && <small>{MONTHS[c.m].slice(0, 3)}</small>}
              {c.n}
            </button>
          );
        })}
      </div>
      {active && (
        <div className="mp-car-cal-times" role="group" aria-label={`Times on ${active.label}`}>
          <p>{active.label}</p>
          <div>
            {active.times.map((t) => {
              const slot = `${active.label}, ${t}`;
              const isTaken = taken.has(slot) && slot !== value;
              return (
                <button key={t} type="button" disabled={isTaken} data-on={slot === value} aria-pressed={slot === value} onClick={() => onChange(slot === value ? "" : slot)}>
                  {t}
                  {isTaken && <small>Booked</small>}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <p className="mp-car-cal-v" aria-live="polite">
        {value ? `Your interview: ${value}` : "Pick a day, then a time. You can also skip this and we will call you."}
      </p>
    </div>
  );
}
