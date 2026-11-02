"use client";

import { useMemo, useState, useTransition } from "react";
import { savePresence } from "@/actions/presence";
import type { ActionResult } from "@/actions/types";
import { MAX_CURSORS, type PresenceConfig, type VisitorRow } from "@/lib/presence";
import { btnPrimary, card, inputClass } from "./ui";

// Admin > Visitors: the settings of the live cursors (on / off, the largest number shown, ask a first-time visitor for a name) and the list of
// the visitors (name, first and last visit, number of visits, device, last page).

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 ${on ? "bg-brand" : "bg-zinc-300"}`}
    >
      <span className={`inline-block size-6 rounded-full bg-white shadow transition-transform duration-300 ${on ? "translate-x-[22px]" : "translate-x-0.5"}`} />
    </button>
  );
}

const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export function VisitorsManager({ initial, rows, live }: { initial: PresenceConfig; rows: VisitorRow[]; live: number }) {
  const [cfg, setCfg] = useState(initial);
  const [q, setQ] = useState("");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const set = (patch: Partial<PresenceConfig>) => {
    setCfg((c) => ({ ...c, ...patch }));
    setResult(null);
  };
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? rows.filter((r) => `${r.name} ${r.device} ${r.path}`.toLowerCase().includes(t)) : rows;
  }, [rows, q]);
  const save = () =>
    start(async () => {
      setResult(await savePresence(cfg));
    });

  return (
    <div className="space-y-6">
      <section className={`${card} space-y-5`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Live cursors</h2>
            <p className="text-sm text-zinc-500">Visitors on the same page see each other&apos;s pointer with the name. Nobody sees more than the number below.</p>
          </div>
          <Switch on={cfg.cursors} onChange={(v) => set({ cursors: v })} label="Live cursors" />
        </div>
        <label className="block max-w-xs text-sm font-medium text-zinc-700">
          Largest number of cursors one visitor sees (0 to {MAX_CURSORS})
          <input
            type="number"
            min={0}
            max={MAX_CURSORS}
            value={cfg.max}
            disabled={!cfg.cursors}
            onChange={(e) => set({ max: Math.min(MAX_CURSORS, Math.max(0, Math.round(Number(e.target.value) || 0))) })}
            className={inputClass}
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-5">
          <div>
            <h2 className="font-semibold">Ask a first-time visitor for a name</h2>
            <p className="text-sm text-zinc-500">One question after the welcome message: the name. It is the label of the visitor&apos;s cursor.</p>
          </div>
          <Switch on={cfg.askName} onChange={(v) => set({ askName: v })} label="Ask for a name" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" className={btnPrimary} disabled={pending} onClick={save}>
            {pending ? "Saving..." : "Save"}
          </button>
          {result && <p className={`text-sm ${result.ok ? "text-emerald-600" : "text-rose-600"}`}>{result.ok ? result.message : result.error}</p>}
          <p className="ml-auto text-sm text-zinc-500">On the website now: {live}</p>
        </div>
      </section>

      <section className={`${card} space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Visitors ({rows.length})</h2>
          <input className={`${inputClass} !mt-0 max-w-xs`} placeholder="Search name, device or page" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {shown.length === 0 ? (
          <p className="text-sm text-zinc-500">No visitors yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-500">
                <tr>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">First visit</th>
                  <th className="py-2 pr-4 font-medium">Last seen</th>
                  <th className="py-2 pr-4 font-medium">Visits</th>
                  <th className="py-2 pr-4 font-medium">Device</th>
                  <th className="py-2 font-medium">Last page</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.id} className="border-t border-zinc-100">
                    <td className="py-2 pr-4 font-medium">{r.name || <span className="text-zinc-400">No name</span>}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{when(r.first)}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{when(r.last)}</td>
                    <td className="py-2 pr-4">{r.visits}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{r.device}</td>
                    <td className="py-2">{r.path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
