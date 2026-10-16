"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { saveJob } from "@/actions/jobs";
import type { ActionResult } from "@/actions/types";
import { WORK_MODES, WORK_TYPES } from "@/lib/careers-shared";
import { btnPrimary, btnSecondary, card, inputClass, labelClass } from "./ui";

// Careers > Jobs: one job. Everything that is on the card of the Careers page and on the page of the job (/careers/<address>) is written here.

export type JobFormValue = {
  id: string;
  title: string;
  slug: string;
  team: string;
  summary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  perks: string;
  location: string;
  workType: string;
  workMode: string;
  experience: string;
  openings: number;
  salary: string;
  closesAt: string;
  active: boolean;
};

export const EMPTY_JOB: JobFormValue = {
  id: "",
  title: "",
  slug: "",
  team: "",
  summary: "",
  description: "",
  responsibilities: "",
  requirements: "",
  perks: "",
  location: "Surat, India",
  workType: "Full-time",
  workMode: "On-site",
  experience: "",
  openings: 1,
  salary: "",
  closesAt: "",
  active: true,
};

export function JobForm({ initial }: { initial: JobFormValue }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof JobFormValue>(k: K, value: JobFormValue[K]) => {
    setV((x) => ({ ...x, [k]: value }));
    setDirty(true);
    setResult(null);
  };

  const save = () =>
    start(async () => {
      const res = await saveJob(v);
      setResult(res);
      if (res.ok) {
        setDirty(false);
        if (!v.id && res.id) router.replace(`/admin/careers/jobs/${res.id}`);
        else router.refresh();
      }
    });

  return (
    <div className="space-y-6">
      <section className={`${card} space-y-4`}>
        <h2 className="text-lg font-semibold">The position</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Name of the position *
            <input className={inputClass} value={v.title} maxLength={100} placeholder="e.g. Senior Web Developer" onChange={(e) => set("title", e.target.value)} />
          </label>
          <label className={labelClass}>
            Team
            <input className={inputClass} value={v.team} maxLength={40} placeholder="e.g. Web & Mobile" onChange={(e) => set("team", e.target.value)} />
          </label>
          <label className={labelClass}>
            Address of the page
            <input className={inputClass} value={v.slug} maxLength={80} placeholder="made from the name when it is empty" onChange={(e) => set("slug", e.target.value)} />
            <span className="mt-1 block text-xs text-zinc-500">The page is /careers/{v.slug || "…"}</span>
          </label>
          <label className={labelClass}>
            Short text for the card on the Careers page
            <input className={inputClass} value={v.summary} maxLength={240} placeholder="One or two lines" onChange={(e) => set("summary", e.target.value)} />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className={labelClass}>
            Type
            <select className={inputClass} value={v.workType} onChange={(e) => set("workType", e.target.value)}>
              {WORK_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Work mode
            <select className={inputClass} value={v.workMode} onChange={(e) => set("workMode", e.target.value)}>
              {WORK_MODES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Location
            <input className={inputClass} value={v.location} maxLength={80} onChange={(e) => set("location", e.target.value)} />
          </label>
          <label className={labelClass}>
            Experience
            <input className={inputClass} value={v.experience} maxLength={40} placeholder="e.g. 1–3 years, or Fresher" onChange={(e) => set("experience", e.target.value)} />
          </label>
          <label className={labelClass}>
            Number of openings
            <input className={inputClass} type="number" min={1} max={99} value={v.openings} onChange={(e) => set("openings", Number(e.target.value) || 1)} />
          </label>
          <label className={labelClass}>
            Salary (optional, shown as it is written)
            <input className={inputClass} value={v.salary} maxLength={60} placeholder="e.g. Based on experience" onChange={(e) => set("salary", e.target.value)} />
          </label>
        </div>
      </section>

      <section className={`${card} space-y-4`}>
        <h2 className="text-lg font-semibold">The page of the job</h2>
        <label className={labelClass}>
          About the role (an empty line starts a new paragraph)
          <textarea className={`${inputClass} min-h-40`} value={v.description} maxLength={6000} onChange={(e) => set("description", e.target.value)} />
        </label>
        <div className="grid gap-4 lg:grid-cols-3">
          <label className={labelClass}>
            What you will do (one point per line)
            <textarea className={`${inputClass} min-h-40`} value={v.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} />
          </label>
          <label className={labelClass}>
            What we look for (one point per line)
            <textarea className={`${inputClass} min-h-40`} value={v.requirements} onChange={(e) => set("requirements", e.target.value)} />
          </label>
          <label className={labelClass}>
            What you get (one point per line)
            <textarea className={`${inputClass} min-h-40`} value={v.perks} onChange={(e) => set("perks", e.target.value)} />
          </label>
        </div>
      </section>

      <section className={`${card} space-y-4`}>
        <h2 className="text-lg font-semibold">Open or closed</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <input type="checkbox" checked={v.active} onChange={(e) => set("active", e.target.checked)} />
            Open: shown on the Careers page and open for applications
          </label>
          <label className={labelClass}>
            Last day to apply (optional: the job closes by itself after it)
            <input className={inputClass} type="date" value={v.closesAt} onChange={(e) => set("closesAt", e.target.value)} />
          </label>
        </div>
      </section>

      <div className={`${card} flex flex-wrap items-center gap-3`}>
        <button type="button" className={btnPrimary} disabled={pending || !v.title.trim() || (!dirty && Boolean(v.id))} onClick={save}>
          {pending ? "Saving…" : v.id ? "Save the job" : "Create the job"}
        </button>
        {v.slug && v.id && (
          <a href={`/careers/${v.slug}`} target="_blank" rel="noreferrer" className={btnSecondary}>
            Open the page of the job ↗
          </a>
        )}
        {result && (
          <p role="status" className={`rounded-lg px-3 py-2 text-sm ${result.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
            {result.ok ? result.message : result.error}
          </p>
        )}
      </div>
    </div>
  );
}
