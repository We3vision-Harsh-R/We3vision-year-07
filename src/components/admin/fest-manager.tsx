"use client";

import { useMemo, useState, useTransition } from "react";
import { saveFest } from "@/actions/fest";
import type { ActionResult } from "@/actions/types";
import { DENSITIES, FEST_EFFECTS, FEST_GROUPS, FESTIVALS, type FestConfig, type FestId } from "@/lib/fest";
import { btnPrimary, btnSecondary, card, inputClass } from "./ui";

// Admin > Fest: the festival themes. Per festival: one switch for the whole website, how much is drawn (light / normal / rich), the 30 effects in
// four groups (whole website, industries road, pointer, places) each with its own switch and an all on / all off, and a switch for every page (or a
// group of pages such as all blog articles). Nothing is on = the normal theme of the website, exactly as it is. Laptop / desktop site only.

export type FestPage = { path: string; title: string; group: string };

function Switch({ on, onChange, label, disabled }: { on: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${on ? "bg-amber-500" : "bg-zinc-300"}`}
    >
      <span className={`inline-block size-6 rounded-full bg-white shadow transition-transform duration-300 ${on ? "translate-x-[22px]" : "translate-x-0.5"}`} />
    </button>
  );
}

/** a small diya for the card of Diwali */
function DiyaArt() {
  return (
    <span className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 shadow-inner">
      <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
        <path d="M20 8c4 5 4 9 0 12-4-3-4-7 0-12z" fill="#fff7cc" />
        <path d="M6 24h28c-2 6-8 9-14 9S8 30 6 24z" fill="#7c2d12" />
        <path d="M6 24h28" stroke="#fde68a" strokeWidth="2" />
      </svg>
    </span>
  );
}

export function FestManager({ initial, pages }: { initial: FestConfig; pages: FestPage[] }) {
  const [cfg, setCfg] = useState(initial);
  const [q, setQ] = useState("");
  const [dirty, setDirty] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  const groups = useMemo(() => {
    const words = q.trim().toLowerCase();
    const list = pages.filter((p) => !words || p.title.toLowerCase().includes(words) || p.path.toLowerCase().includes(words));
    const out = new Map<string, FestPage[]>();
    for (const p of list) out.set(p.group, [...(out.get(p.group) ?? []), p]);
    return [...out.entries()];
  }, [pages, q]);

  const change = (id: FestId, fn: (r: FestConfig[FestId]) => FestConfig[FestId]) => {
    setCfg((c) => ({ ...c, [id]: fn(c[id]) }));
    setDirty(true);
    setResult(null);
  };
  const setPage = (id: FestId, path: string, on: boolean) => change(id, (r) => ({ ...r, pages: on ? [...new Set([...r.pages, path])] : r.pages.filter((p) => p !== path) }));
  const save = () =>
    start(async () => {
      const res = await saveFest(cfg);
      setResult(res);
      if (res.ok) {
        setDirty(false);
        // the open pages of the website in this browser change at once (components/site/fest/fest-live.tsx); other browsers within ~10 s
        try {
          const ch = new BroadcastChannel("we3-fest");
          ch.postMessage(cfg);
          ch.close();
        } catch {
          // an old browser: the pages still pick it up by themselves
        }
      }
    });

  return (
    <div className="space-y-6">
      {FESTIVALS.map((f) => {
        const r = cfg[f.id];
        const count = r.site ? pages.length : r.pages.length;
        return (
          <section key={f.id} className={`${card} space-y-6 ${r.site || r.pages.length ? "border-amber-300 ring-2 ring-amber-100" : ""}`}>
            <div className="flex flex-wrap items-start gap-4">
              <DiyaArt />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold">{f.name}</h2>
                <p className="mt-0.5 text-sm text-zinc-500">{f.blurb}</p>
                <p className="mt-2 text-xs font-medium text-amber-700">
                  {r.site ? "On for the whole website" : r.pages.length ? `On for ${count} page${count === 1 ? "" : "s"}` : "Off: the website shows its normal theme"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
              <div>
                <p className="font-medium text-zinc-900">The whole website</p>
                <p className="text-sm text-zinc-500">Every page of the laptop and desktop website gets the {f.name} theme.</p>
              </div>
              <Switch on={r.site} label={`${f.name} on the whole website`} onChange={(v) => change(f.id, (x) => ({ ...x, site: v }))} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 px-4 py-3">
              <div>
                <p className="font-medium text-zinc-900">How much is drawn</p>
                <p className="text-sm text-zinc-500">{DENSITIES.find((d) => d.id === r.density)?.hint}</p>
              </div>
              <div className="inline-flex rounded-lg bg-zinc-100 p-1" role="radiogroup" aria-label={`${f.name}: how much is drawn`}>
                {DENSITIES.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    role="radio"
                    aria-checked={r.density === d.id}
                    onClick={() => change(f.id, (x) => ({ ...x, density: d.id }))}
                    className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${r.density === d.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {FEST_GROUPS.map((g) => {
              const list = FEST_EFFECTS.filter((e) => e.group === g.id);
              const onCount = list.filter((e) => r.effects[e.key]).length;
              const setAll = (v: boolean) => change(f.id, (x) => ({ ...x, effects: { ...x.effects, ...Object.fromEntries(list.map((e) => [e.key, v])) } }));
              return (
                <div key={g.id}>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-zinc-800">
                        {g.title} <span className="font-normal text-zinc-400">· {onCount} of {list.length} on</span>
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-500">{g.blurb}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="rounded-lg border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40" disabled={onCount === list.length} onClick={() => setAll(true)}>
                        All on
                      </button>
                      <button type="button" className="rounded-lg border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40" disabled={onCount === 0} onClick={() => setAll(false)}>
                        All off
                      </button>
                    </div>
                  </div>
                  <ul className="mt-2 divide-y divide-zinc-100 rounded-xl border border-zinc-200">
                    {list.map((e) => (
                      <li key={e.key} className="flex items-center justify-between gap-4 px-4 py-3">
                        <span>
                          <span className="block text-sm font-medium text-zinc-900">{e.label}</span>
                          <span className="block text-xs text-zinc-500">{e.hint}</span>
                        </span>
                        <Switch on={r.effects[e.key]} label={e.label} onChange={(v) => change(f.id, (x) => ({ ...x, effects: { ...x.effects, [e.key]: v } }))} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <p className="-mt-2 text-xs text-zinc-400">
              The street of the home page and the diyas of the footer always come with the festival. The effects only show on the pages where the festival is on (below).
            </p>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-zinc-800">Single pages {r.site && <span className="font-normal text-zinc-400">(all on through the whole website)</span>}</h3>
                <input className={`${inputClass} !mt-0 !w-64`} type="search" placeholder="Find a page…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find a page" />
              </div>
              <div className="mt-3 space-y-4">
                {groups.map(([group, list]) => (
                  <div key={group}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{group}</p>
                    <ul className="mt-1.5 grid gap-x-6 gap-y-1 sm:grid-cols-2">
                      {list.map((p) => {
                        const on = r.site || r.pages.includes(p.path);
                        return (
                          <li key={p.path} className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-zinc-50">
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium text-zinc-900">{p.title}</span>
                              <a href={p.path.replace(/\/\*$/, "")} target="_blank" rel="noreferrer" className="block truncate text-xs text-zinc-400 hover:text-brand">
                                {p.path}
                              </a>
                            </span>
                            <Switch on={on} disabled={r.site} label={`${f.name} on ${p.title}`} onChange={(v) => setPage(f.id, p.path, v)} />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                {groups.length === 0 && <p className="text-sm text-zinc-400">No page with that name.</p>}
              </div>
            </div>
          </section>
        );
      })}

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        <button type="button" className={btnPrimary} disabled={pending || !dirty} onClick={save}>
          {pending ? "Saving…" : "Save and show on the website"}
        </button>
        <button
          type="button"
          className={btnSecondary}
          disabled={pending}
          onClick={() => {
            setCfg(initial);
            setDirty(false);
          }}
        >
          Undo changes
        </button>
        {dirty && <span className="text-sm text-amber-700">You have unsaved changes</span>}
        {result && <span className={`text-sm ${result.ok ? "text-emerald-700" : "text-rose-600"}`}>{result.ok ? result.message : result.error}</span>}
      </div>
    </div>
  );
}
