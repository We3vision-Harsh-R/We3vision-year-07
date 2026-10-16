"use client";

import { useEffect, useState, useTransition } from "react";
import { saveCareerSetup } from "@/actions/careers";
import type { ActionResult } from "@/actions/types";
import type { QuestionKind } from "@/lib/careers-shared";
import { btnDanger, btnIcon, btnPrimary, btnSecondary, card, inputClass, labelClass } from "./ui";

// Careers in the admin panel, "Positions and questions": the open positions that a visitor can choose as the destination of the ticket, and the
// questions of HR that come after the usual ones in the passenger details.

export type RoleItem = { key: string; title: string; team: string; active: boolean };
export type QuestionItem = { key: string; label: string; kind: QuestionKind; options: string; required: boolean; active: boolean };

const uid = () => Math.random().toString(36).slice(2, 9);
const KINDS: { value: QuestionKind; label: string }[] = [
  { value: "text", label: "Short answer" },
  { value: "textarea", label: "Long answer" },
  { value: "yesno", label: "Yes / No" },
  { value: "select", label: "Choose one (list)" },
];

function move<T>(list: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export function CareersSetup({ initialRoles, initialQuestions }: { initialRoles: RoleItem[]; initialQuestions: QuestionItem[] }) {
  const [roles, setRoles] = useState(initialRoles);
  const [questions, setQuestions] = useState(initialQuestions);
  const [dirty, setDirty] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const touch = () => {
    setDirty(true);
    setResult(null);
  };
  const setRole = (i: number, part: Partial<RoleItem>) => {
    setRoles((l) => l.map((r, k) => (k === i ? { ...r, ...part } : r)));
    touch();
  };
  const setQuestion = (i: number, part: Partial<QuestionItem>) => {
    setQuestions((l) => l.map((q, k) => (k === i ? { ...q, ...part } : q)));
    touch();
  };

  const save = () =>
    start(async () => {
      const res = await saveCareerSetup({
        roles: roles.map((r) => ({ title: r.title, team: r.team, active: r.active })),
        questions: questions.map((q) => ({ label: q.label, kind: q.kind, options: q.options.split("\n").map((s) => s.trim()).filter(Boolean), required: q.required, active: q.active })),
      });
      setResult(res);
      if (res.ok) setDirty(false);
    });

  return (
    <div className="space-y-6">
      <section className={`${card} space-y-4`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Open positions</h2>
            <p className="text-sm text-zinc-500">These are the destinations a visitor can choose on the Careers page. Switch a position off to hide it without losing it.</p>
          </div>
          <button type="button" className={btnSecondary} onClick={() => (setRoles((l) => [...l, { key: uid(), title: "", team: "", active: true }]), touch())}>
            + Position
          </button>
        </div>
        <ul className="space-y-2">
          {roles.map((r, i) => (
            <li key={r.key} className="grid items-center gap-2 rounded-xl border border-zinc-200 p-3 sm:grid-cols-[1fr_200px_auto]">
              <input className={`${inputClass} !mt-0`} placeholder="Position, e.g. Senior Web Developer" value={r.title} maxLength={80} onChange={(e) => setRole(i, { title: e.target.value })} />
              <input className={`${inputClass} !mt-0`} placeholder="Team (optional)" value={r.team} maxLength={40} onChange={(e) => setRole(i, { team: e.target.value })} />
              <div className="flex items-center gap-1">
                <label className="mr-2 flex items-center gap-1.5 text-sm text-zinc-600">
                  <input type="checkbox" checked={r.active} onChange={(e) => setRole(i, { active: e.target.checked })} />
                  Open
                </label>
                <button type="button" className={btnIcon} aria-label="Up" disabled={i === 0} onClick={() => (setRoles((l) => move(l, i, -1)), touch())}>
                  ↑
                </button>
                <button type="button" className={btnIcon} aria-label="Down" disabled={i === roles.length - 1} onClick={() => (setRoles((l) => move(l, i, 1)), touch())}>
                  ↓
                </button>
                <button type="button" className={`${btnDanger} !px-2.5 !py-1.5`} onClick={() => (setRoles((l) => l.filter((_, k) => k !== i)), touch())}>
                  ✕
                </button>
              </div>
            </li>
          ))}
          {roles.length === 0 && <li className="text-sm text-zinc-500">No positions. The visitor can still book a seat with only their city.</li>}
        </ul>
      </section>

      <section className={`${card} space-y-4`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Questions of HR</h2>
            <p className="text-sm text-zinc-500">
              The passenger details always ask for name, email, phone, LinkedIn or portfolio, skills, experience, salary and why they want to join. The questions here
              come after them.
            </p>
          </div>
          <button type="button" className={btnSecondary} onClick={() => (setQuestions((l) => [...l, { key: uid(), label: "", kind: "text", options: "", required: false, active: true }]), touch())}>
            + Question
          </button>
        </div>
        <ul className="space-y-3">
          {questions.map((q, i) => (
            <li key={q.key} className="space-y-3 rounded-xl border border-zinc-200 p-3">
              <div className="grid items-center gap-2 sm:grid-cols-[1fr_190px]">
                <input className={`${inputClass} !mt-0`} placeholder="The question" value={q.label} maxLength={200} onChange={(e) => setQuestion(i, { label: e.target.value })} />
                <select className={`${inputClass} !mt-0`} value={q.kind} onChange={(e) => setQuestion(i, { kind: e.target.value as QuestionKind })}>
                  {KINDS.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </div>
              {q.kind === "select" && (
                <label className={labelClass}>
                  The choices (one per line)
                  <textarea className={`${inputClass} min-h-20`} value={q.options} onChange={(e) => setQuestion(i, { options: e.target.value })} />
                </label>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={q.required} onChange={(e) => setQuestion(i, { required: e.target.checked })} />
                  Must be answered
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={q.active} onChange={(e) => setQuestion(i, { active: e.target.checked })} />
                  Shown
                </label>
                <span className="ml-auto flex gap-1">
                  <button type="button" className={btnIcon} aria-label="Up" disabled={i === 0} onClick={() => (setQuestions((l) => move(l, i, -1)), touch())}>
                    ↑
                  </button>
                  <button type="button" className={btnIcon} aria-label="Down" disabled={i === questions.length - 1} onClick={() => (setQuestions((l) => move(l, i, 1)), touch())}>
                    ↓
                  </button>
                  <button type="button" className={`${btnDanger} !px-2.5 !py-1.5`} onClick={() => (setQuestions((l) => l.filter((_, k) => k !== i)), touch())}>
                    ✕
                  </button>
                </span>
              </div>
            </li>
          ))}
          {questions.length === 0 && <li className="text-sm text-zinc-500">No extra questions.</li>}
        </ul>
      </section>

      <div className={`${card} flex flex-wrap items-center gap-3`}>
        <button type="button" className={btnPrimary} disabled={pending || !dirty} onClick={save}>
          {pending ? "Saving…" : "Save positions and questions"}
        </button>
        <a href="/careers" target="_blank" rel="noreferrer" className={btnSecondary}>
          Open the Careers page ↗
        </a>
        {result && (
          <p role="status" className={`rounded-lg px-3 py-2 text-sm ${result.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
            {result.ok ? result.message : result.error}
          </p>
        )}
      </div>
    </div>
  );
}
