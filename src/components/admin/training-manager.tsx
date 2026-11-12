"use client";

import { useState, useTransition } from "react";
import { saveTraining } from "@/actions/training";
import type { ActionResult } from "@/actions/types";
import { AREAS, MAX_COURSES, type Course } from "@/lib/training-shared";
import { btnDanger, btnIcon, btnPrimary, btnSecondary, card, inputClass, labelClass } from "./ui";

// Admin > Industrial Training: the list of courses (technology domains) with the fee of each for the 3, 6 and 9 month training.
// Nothing is saved until "Save" is pressed.

const newCourse = (): Course => ({ id: "c" + Math.random().toString(36).slice(2, 8), name: "", area: "Development", learn: "", fees: { m3: "", m6: "", m9: "" }, show: true });

export function TrainingManager({ initial }: { initial: Course[] }) {
  const [list, setList] = useState<Course[]>(initial);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const [dirty, setDirty] = useState(false);

  const change = (next: Course[]) => {
    setList(next);
    setDirty(true);
    setResult(null);
  };
  const patch = (i: number, p: Partial<Course>) => change(list.map((c, k) => (k === i ? { ...c, ...p } : c)));
  const fee = (i: number, key: "m3" | "m6" | "m9", v: string) => change(list.map((c, k) => (k === i ? { ...c, fees: { ...c.fees, [key]: v } } : c)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    change(next);
  };
  const remove = (i: number) => {
    if (window.confirm(`Delete "${list[i].name || "this course"}"? This cannot be undone after you save.`)) change(list.filter((_, k) => k !== i));
  };
  const save = () =>
    start(async () => {
      const res = await saveTraining(list.filter((c) => c.name.trim()));
      setResult(res);
      if (res.ok) setDirty(false);
    });

  return (
    <div className="space-y-5">
      <div className="sticky top-2 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-white/95 px-5 py-3 shadow-sm backdrop-blur">
        <button type="button" className={btnPrimary} disabled={pending || !dirty} onClick={save}>
          {pending ? "Saving..." : "Save"}
        </button>
        <button type="button" className={btnSecondary} disabled={list.length >= MAX_COURSES} onClick={() => change([...list, newCourse()])}>
          + Add a course
        </button>
        <span className="text-sm text-zinc-500">{list.length} course{list.length === 1 ? "" : "s"}{dirty ? " · not saved yet" : ""}</span>
        {result && <p className={`text-sm ${result.ok ? "text-emerald-600" : "text-rose-600"}`}>{result.ok ? result.message : result.error}</p>}
      </div>

      <datalist id="training-areas">
        {AREAS.map((a) => (
          <option key={a} value={a} />
        ))}
      </datalist>

      {list.length === 0 && <p className={`${card} text-sm text-zinc-500`}>No courses yet. Press &quot;Add a course&quot;.</p>}

      {list.map((c, i) => (
        <section key={c.id} className={`${card} space-y-4 ${c.show ? "" : "opacity-60"}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-zinc-500">Course {i + 1}</p>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" checked={c.show} onChange={(e) => patch(i, { show: e.target.checked })} />
                Show on the website
              </label>
              <button type="button" className={btnIcon} aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                ↑
              </button>
              <button type="button" className={btnIcon} aria-label="Move down" disabled={i === list.length - 1} onClick={() => move(i, 1)}>
                ↓
              </button>
              <button type="button" className={btnDanger} onClick={() => remove(i)}>
                Delete
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
            <label className={labelClass}>
              Course name
              <input className={inputClass} value={c.name} maxLength={80} placeholder="For example: Web Development" onChange={(e) => patch(i, { name: e.target.value })} />
            </label>
            <label className={labelClass}>
              Group
              <input className={inputClass} list="training-areas" value={c.area} maxLength={40} onChange={(e) => patch(i, { area: e.target.value })} />
            </label>
          </div>

          <label className={`${labelClass} block`}>
            What the trainee learns (one or two sentences)
            <textarea className={inputClass} rows={2} value={c.learn} maxLength={300} onChange={(e) => patch(i, { learn: e.target.value })} />
          </label>

          <div>
            <p className={labelClass}>Fee for each length (leave empty to show &quot;Contact us for the fee&quot;)</p>
            <div className="mt-1 grid gap-3 sm:grid-cols-3">
              {(
                [
                  ["m3", "3 months"],
                  ["m6", "6 months"],
                  ["m9", "9 months"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block text-xs font-medium text-zinc-500">
                  {label}
                  <input className={inputClass} value={c.fees[key]} maxLength={60} placeholder="For example: Rs. 15,000" onChange={(e) => fee(i, key, e.target.value)} />
                </label>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
