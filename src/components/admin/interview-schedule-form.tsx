"use client";

import { useState, useTransition } from "react";
import { saveInterviewSchedule } from "@/actions/careers";
import type { ActionResult } from "@/actions/types";
import type { InterviewSchedule } from "@/lib/careers-shared";
import { btnIcon, btnPrimary, btnSecondary, card, inputClass, labelClass } from "./ui";

// Admin > Careers > Interview schedule: when the candidates can book an interview on the Careers page (phone, tablet and laptop).

const DAYS = [
  { n: 1, label: "Mon" },
  { n: 2, label: "Tue" },
  { n: 3, label: "Wed" },
  { n: 4, label: "Thu" },
  { n: 5, label: "Fri" },
  { n: 6, label: "Sat" },
  { n: 0, label: "Sun" },
];
const AHEAD = [7, 14, 21, 28, 42, 60];

type Win = { start: string; end: string };
const split = (t: string): Win => {
  const [start, end] = t.split(" – ");
  return { start: start ?? "10:00", end: end ?? "11:00" };
};
const hh = (t: string) => Number(t.slice(0, 2));
const ymd = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function InterviewScheduleForm({ initial }: { initial: InterviewSchedule }) {
  const [days, setDays] = useState<number[]>(initial.days);
  const [wins, setWins] = useState<Win[]>(initial.times.map(split));
  const [ahead, setAhead] = useState(initial.daysAhead);
  const [after, setAfter] = useState(initial.startAfter);
  const [closed, setClosed] = useState<string[]>(initial.closed);
  const [newClosed, setNewClosed] = useState("");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  const touch = () => setResult(null);
  const setWin = (i: number, part: Partial<Win>) => {
    setWins((l) => l.map((w, k) => (k === i ? { ...w, ...part } : w)));
    touch();
  };
  const bad = wins.some((w) => !w.start || !w.end || w.end <= w.start);
  const invalid = bad ? "Every window needs an end time after its start time." : days.length === 0 ? "Choose at least one open day." : wins.length === 0 ? "Add at least one time window." : "";

  const save = () =>
    start(async () => {
      const res = await saveInterviewSchedule({
        days,
        times: wins.map((w) => `${w.start} – ${w.end}`),
        daysAhead: ahead,
        startAfter: after,
        closed,
      });
      setResult(res);
    });

  return (
    <section className={`${card} space-y-6`}>
      <div>
        <h2 className="text-lg font-semibold">Set the schedule</h2>
        <p className="mt-1 text-sm text-zinc-500">The days and time windows that candidates can choose on the Careers page. Windows that are already booked stay as they are, even when you change the times.</p>
      </div>

      <div>
        <span className={labelClass}>Open days</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {DAYS.map((d) => {
            const on = days.includes(d.n);
            return (
              <button
                key={d.n}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setDays((l) => (on ? l.filter((x) => x !== d.n) : [...l, d.n]));
                  touch();
                }}
                className={`min-w-14 rounded-lg border px-3 py-2 text-sm font-semibold transition ${on ? "border-brand bg-brand text-white" : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"}`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <span className={labelClass}>Time windows of a day (India time)</span>
        <ul className="mt-2 space-y-2">
          {wins.map((w, i) => (
            <li key={i} className="flex flex-wrap items-center gap-2">
              <input type="time" className={`${inputClass} !mt-0 w-36`} value={w.start} onChange={(e) => setWin(i, { start: e.target.value })} aria-label={`Window ${i + 1}: start`} />
              <span className="text-zinc-400">to</span>
              <input type="time" className={`${inputClass} !mt-0 w-36`} value={w.end} onChange={(e) => setWin(i, { end: e.target.value })} aria-label={`Window ${i + 1}: end`} />
              <button
                type="button"
                className={btnIcon}
                aria-label={`Remove window ${i + 1}`}
                onClick={() => {
                  setWins((l) => l.filter((_, k) => k !== i));
                  touch();
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`${btnSecondary} mt-3`}
          disabled={wins.length >= 16}
          onClick={() => {
            const last = wins[wins.length - 1];
            const h = last ? Math.min(22, hh(last.end || "10:00")) : 10;
            const p = (n: number) => String(n).padStart(2, "0");
            setWins((l) => [...l, { start: `${p(h)}:00`, end: `${p(h + 1)}:00` }]);
            touch();
          }}
        >
          + Add a window
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          How far ahead can candidates book?
          <select className={inputClass} value={ahead} onChange={(e) => (setAhead(Number(e.target.value)), touch())}>
            {AHEAD.map((n) => (
              <option key={n} value={n}>
                {n} days ({n / 7} {n === 7 ? "week" : "weeks"})
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          First day that can be booked
          <select className={inputClass} value={after} onChange={(e) => (setAfter(Number(e.target.value)), touch())}>
            {[1, 2, 3, 4, 5, 7, 10, 14].map((n) => (
              <option key={n} value={n}>
                {n === 1 ? "Tomorrow" : `${n} days after today`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <span className={labelClass}>Closed days (holidays, no interviews)</span>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input type="date" className={`${inputClass} !mt-0 w-48`} value={newClosed} onChange={(e) => setNewClosed(e.target.value)} aria-label="A closed day" />
          <button
            type="button"
            className={btnSecondary}
            disabled={!newClosed || closed.includes(newClosed)}
            onClick={() => {
              setClosed((l) => [...l, newClosed].sort());
              setNewClosed("");
              touch();
            }}
          >
            Close this day
          </button>
        </div>
        {closed.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {closed.map((c) => (
              <li key={c} className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-sm text-rose-700">
                {ymd(c)}
                <button
                  type="button"
                  aria-label={`Open ${ymd(c)} again`}
                  className="font-bold"
                  onClick={() => {
                    setClosed((l) => l.filter((x) => x !== c));
                    touch();
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={btnPrimary} disabled={pending || Boolean(invalid)} onClick={save}>
          {pending ? "Saving…" : "Save the schedule"}
        </button>
        {invalid && <p className="text-sm text-rose-600">{invalid}</p>}
        {result && <p className={`text-sm ${result.ok ? "text-emerald-700" : "text-rose-600"}`}>{result.ok ? result.message : result.error}</p>}
      </div>
    </section>
  );
}
