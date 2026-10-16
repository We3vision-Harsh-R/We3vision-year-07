"use client";

import { useState, useTransition } from "react";
import { createAdminUser, deleteAdminUser, saveLoginImage, setAdminPassword } from "@/actions/admin-access";
import type { ActionResult } from "@/actions/types";
import { ADMIN_DOMAIN } from "@/lib/admin-access";
import { ImageField } from "./image-field";
import { btnDanger, btnPrimary, btnSecondary, card, inputClass, labelClass } from "./ui";

export type AdminRow = { id: string; name: string; email: string; lastLogin: string; isMe: boolean };

function Notice({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return (
    <p role="status" className={`rounded-lg px-3 py-2 text-sm ${result.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
      {result.ok ? result.message : result.error}
    </p>
  );
}

/** The picture on the right of the login page. */
export function LoginPictureCard({ current, isDefault }: { current: string; isDefault: boolean }) {
  const [value, setValue] = useState(isDefault ? "" : current);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const save = (next: string) =>
    start(async () => {
      setResult(await saveLoginImage(next));
    });

  return (
    <section className={`${card} space-y-4`}>
      <div>
        <h2 className="text-lg font-semibold">Login page picture</h2>
        <p className="mt-1 text-sm text-zinc-500">
          The picture on the right side of the admin login page. A tall picture (about 4:5, 1200 × 1500 px or more) looks best. Leave it empty to use the original picture.
        </p>
      </div>
      <ImageField
        label="Picture"
        value={value}
        onChange={(v) => {
          setValue(v);
          setResult(null);
        }}
      />
      <Notice result={result} />
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btnPrimary} disabled={pending} onClick={() => save(value)}>
          {pending ? "Saving…" : "Save picture"}
        </button>
        <a href="/admin/login" target="_blank" rel="noreferrer" className={btnSecondary}>
          Open the login page ↗
        </a>
      </div>
    </section>
  );
}

/** The admin users: who can sign in. Only addresses of the company domain are accepted. */
export function UsersCard({ rows }: { rows: AdminRow[] }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [result, setResult] = useState<ActionResult | null>(null);
  const [rowResult, setRowResult] = useState<Record<string, ActionResult>>({});
  const [pending, start] = useTransition();

  const add = () =>
    start(async () => {
      const res = await createAdminUser(form);
      setResult(res);
      if (res.ok) setForm({ name: "", email: "", password: "" });
    });
  const remove = (row: AdminRow) => {
    if (!window.confirm(`Remove ${row.email}? They will not be able to sign in any more.`)) return;
    start(async () => {
      const res = await deleteAdminUser(row.id);
      setRowResult((r) => ({ ...r, [row.id]: res }));
    });
  };
  const change = (row: AdminRow) => {
    const next = window.prompt(`New password for ${row.email} (at least 12 characters):`);
    if (!next) return;
    start(async () => {
      const res = await setAdminPassword(row.id, next);
      setRowResult((r) => ({ ...r, [row.id]: res }));
    });
  };

  return (
    <section className={`${card} space-y-5`}>
      <div>
        <h2 className="text-lg font-semibold">Admin users</h2>
        <p className="mt-1 text-sm text-zinc-500">
          People who can sign in to this admin panel. Only e-mail addresses ending in <strong>@{ADMIN_DOMAIN}</strong> are accepted.
        </p>
      </div>

      <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {row.name} {row.isMe && <span className="ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">you</span>}
              </p>
              <p className="truncate text-sm text-zinc-500">{row.email}</p>
              <p className="text-xs text-zinc-400">Last sign-in: {row.lastLogin}</p>
              {rowResult[row.id] && <Notice result={rowResult[row.id]} />}
            </div>
            <div className="flex gap-2">
              <button type="button" className={btnSecondary} disabled={pending} onClick={() => change(row)}>
                New password
              </button>
              {!row.isMe && (
                <button type="button" className={btnDanger} disabled={pending} onClick={() => remove(row)}>
                  Remove
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <h3 className="text-sm font-semibold">Add a user</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Name
            <input className={inputClass} value={form.name} maxLength={80} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className={labelClass}>
            E-mail
            <input
              className={inputClass}
              type="email"
              value={form.email}
              placeholder={`name@${ADMIN_DOMAIN}`}
              autoComplete="off"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
        </div>
        <label className={`${labelClass} block`}>
          Password (at least 12 characters)
          <input className={inputClass} type="password" value={form.password} autoComplete="new-password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <Notice result={result} />
        <button type="button" className={btnPrimary} disabled={pending || !form.email || !form.name || !form.password} onClick={add}>
          {pending ? "Saving…" : "Add user"}
        </button>
      </div>
    </section>
  );
}
