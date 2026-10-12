"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { saveTeam } from "@/actions/team";
import type { ActionResult } from "@/actions/types";
import { byDepartment, CORNER_CAPACITY, MAX_PEOPLE, tierOf, type TeamPerson } from "@/lib/team-shared";
import { TeamOffice } from "../site/modern/team-office";
import { ImageField } from "./image-field";
import { SeatPicker } from "./seat-picker";
import { btnDanger, btnIcon, btnPrimary, btnSecondary, card, inputClass, labelClass } from "./ui";

// Team in the admin panel: the people of the office. Every change is drawn at once in the preview (the real office of the Team page);
// nothing is on the live website until "Save team" is pressed.

const uid = () => `new-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export function TeamManager({ initial }: { initial: TeamPerson[] }) {
  const [people, setPeople] = useState<TeamPerson[]>(initial);
  const [sel, setSel] = useState<string>(initial[0]?.id ?? "");
  const [dirty, setDirty] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const groups = useMemo(() => byDepartment(people), [people]);
  const depts = groups.map((g) => g.name);
  const current = people.find((p) => p.id === sel) ?? null;

  const change = (next: TeamPerson[]) => {
    setPeople(next);
    setDirty(true);
    setResult(null);
  };
  const patch = (id: string, part: Partial<TeamPerson>) => change(people.map((p) => (p.id === id ? { ...p, ...part } : p)));
  // gives a person a seat; the person who had that chosen seat in the same group sits on an automatic seat again
  const assignSeat = (id: string, seat: number) => {
    const me = people.find((p) => p.id === id);
    if (!me) return;
    const same = (p: TeamPerson) => (tierOf(me.dept) === "team" ? p.dept.trim() === me.dept.trim() : tierOf(p.dept) === tierOf(me.dept));
    change(people.map((p) => (p.id === id ? { ...p, seat } : seat >= 0 && p.seat === seat && same(p) ? { ...p, seat: -1 } : p)));
  };
  const add = (dept: string) => {
    if (people.length >= MAX_PEOPLE) return;
    const p: TeamPerson = { id: uid(), name: "New person", role: "", dept: dept || "Team", bio: "", photo: "", linkedin: "", girl: false, seat: -1 };
    // right after the last person of that department (or at the end)
    const last = people.map((x) => x.dept).lastIndexOf(p.dept);
    const next = [...people];
    next.splice(last < 0 ? next.length : last + 1, 0, p);
    change(next);
    setSel(p.id);
  };
  const remove = (id: string) => {
    const i = people.findIndex((p) => p.id === id);
    const next = people.filter((p) => p.id !== id);
    change(next);
    setSel(next[Math.min(i, next.length - 1)]?.id ?? "");
  };
  // moves a person one place within the department (the order at the tables)
  const nudge = (id: string, dir: -1 | 1) => {
    const p = people.find((x) => x.id === id);
    if (!p) return;
    const idx = people.indexOf(p);
    let j = idx + dir;
    while (j >= 0 && j < people.length && people[j].dept !== p.dept) j += dir;
    if (j < 0 || j >= people.length) return;
    const next = [...people];
    [next[idx], next[j]] = [next[j], next[idx]];
    change(next);
  };
  // moves a whole department up or down
  const moveDept = (name: string, dir: -1 | 1) => {
    const g = byDepartment(people);
    const i = g.findIndex((x) => x.name === name);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= g.length) return;
    [g[i], g[j]] = [g[j], g[i]];
    change(g.flatMap((x) => x.people));
  };
  const renameDept = (from: string) => {
    const to = window.prompt("New name of the department:", from)?.trim().slice(0, 30);
    if (!to || to === from) return;
    change(people.map((p) => (p.dept === from ? { ...p, dept: to } : p)));
  };

  const save = () =>
    start(async () => {
      const res = await saveTeam(people.map((p) => ({ name: p.name, role: p.role, dept: p.dept, bio: p.bio, photo: p.photo, linkedin: p.linkedin, girl: p.girl, seat: p.seat })));
      setResult(res);
      if (res.ok) setDirty(false);
    });

  return (
    <div className="space-y-6">
      <section className={`${card} space-y-3`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Preview of the office</h2>
            <p className="text-sm text-zinc-500">This is the office of the Team page. Point at a person to see their card. It changes as you edit; the live website changes when you save.</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${dirty ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{dirty ? "Not saved yet" : "Saved"}</span>
        </div>
        <TeamOffice people={people} preview highlightId={sel} chip="The office" heading="Meet The Team" id="admin-preview" />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className={`${card} space-y-5`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              People <span className="text-sm font-normal text-zinc-400">({people.length})</span>
            </h2>
            <button type="button" className={btnSecondary} onClick={() => add(current?.dept ?? depts[0] ?? "Team")} disabled={people.length >= MAX_PEOPLE}>
              + Add person
            </button>
          </div>
          {groups.length === 0 && <p className="text-sm text-zinc-500">Nobody yet. Add the first person.</p>}
          {groups.map((g, gi) => (
            <div key={g.name} className="rounded-xl border border-zinc-200">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 bg-zinc-50 px-3 py-2">
                <p className="text-sm font-semibold">
                  {g.name} <span className="font-normal text-zinc-400">· {g.people.length}</span>
                  {g.people.length > CORNER_CAPACITY && <span className="ml-2 text-xs font-normal text-amber-700">more than {CORNER_CAPACITY}: a wider corner</span>}
                </p>
                <div className="flex gap-1">
                  <button type="button" className={btnIcon} aria-label={`Move ${g.name} up`} disabled={gi === 0} onClick={() => moveDept(g.name, -1)}>
                    ↑
                  </button>
                  <button type="button" className={btnIcon} aria-label={`Move ${g.name} down`} disabled={gi === groups.length - 1} onClick={() => moveDept(g.name, 1)}>
                    ↓
                  </button>
                  <button type="button" className={`${btnIcon} w-auto px-2 text-xs`} onClick={() => renameDept(g.name)}>
                    Rename
                  </button>
                  <button type="button" className={`${btnIcon} w-auto px-2 text-xs`} onClick={() => add(g.name)} disabled={people.length >= MAX_PEOPLE}>
                    + Person
                  </button>
                </div>
              </div>
              <ul className="divide-y divide-zinc-100">
                {g.people.map((p, pi) => (
                  <li key={p.id} className={`flex items-center gap-2 px-3 py-2 ${p.id === sel ? "bg-brand/5" : ""}`}>
                    <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setSel(p.id)}>
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <span className="block truncate text-xs text-zinc-500">{p.role || "no role yet"}</span>
                    </button>
                    <button type="button" className={btnIcon} aria-label="Up" disabled={pi === 0} onClick={() => nudge(p.id, -1)}>
                      ↑
                    </button>
                    <button type="button" className={btnIcon} aria-label="Down" disabled={pi === g.people.length - 1} onClick={() => nudge(p.id, 1)}>
                      ↓
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className={`${card} space-y-4`}>
          {current ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Edit person</h2>
                <button type="button" className={btnDanger} onClick={() => remove(current.id)}>
                  Remove
                </button>
              </div>
              <label className={labelClass}>
                Name
                <input className={inputClass} value={current.name} maxLength={60} onChange={(e) => patch(current.id, { name: e.target.value })} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Role
                  <input className={inputClass} value={current.role} maxLength={70} placeholder="e.g. UI/UX Designer" onChange={(e) => patch(current.id, { role: e.target.value })} />
                </label>
                <label className={labelClass}>
                  Department
                  <input className={inputClass} list="team-depts" value={current.dept} maxLength={30} onChange={(e) => patch(current.id, { dept: e.target.value, seat: -1 })} />
                  <datalist id="team-depts">
                    {depts.map((d) => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </label>
              </div>
              <p className="-mt-2 text-xs leading-relaxed text-zinc-400">People with the same department sit together. The department called Leadership sits in the middle at the top, Managers at the long table under it, and every other department is a team under the managers. The first person of a department is its first seat.</p>
              <label className={labelClass}>
                A few words about the person
                <textarea className={`${inputClass} min-h-24`} value={current.bio} maxLength={260} onChange={(e) => patch(current.id, { bio: e.target.value })} />
              </label>
              <ImageField label="Photo (optional)" value={current.photo} onChange={(v) => patch(current.id, { photo: v })} hint="A square photo of the face works best. Without a photo the initials are shown." />
              <label className={labelClass}>
                LinkedIn link (optional)
                <input className={inputClass} value={current.linkedin} maxLength={300} placeholder="https://www.linkedin.com/in/…" onChange={(e) => patch(current.id, { linkedin: e.target.value })} />
              </label>
              <SeatPicker people={people} current={current} onAssign={(seat) => assignSeat(current.id, seat)} />
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" checked={current.girl} onChange={(e) => patch(current.id, { girl: e.target.checked })} />
                Draw the avatar as a woman
              </label>
            </>
          ) : (
            <p className="text-sm text-zinc-500">Choose a person in the list to edit, or add one.</p>
          )}
        </section>
      </div>

      <div className={`${card} flex flex-wrap items-center gap-3`}>
        <button type="button" className={btnPrimary} disabled={pending || !dirty} onClick={save}>
          {pending ? "Saving…" : "Save team"}
        </button>
        <a href="/team" target="_blank" rel="noreferrer" className={btnSecondary}>
          Open the Team page ↗
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
