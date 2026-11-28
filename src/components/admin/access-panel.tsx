"use client";

import { useState, useTransition } from "react";
import { createAdminUser, deleteAdminUser, saveAdminAccess, saveLoginImage, setAdminPassword } from "@/actions/admin-access";
import type { ActionResult } from "@/actions/types";
import { ADMIN_AREAS } from "@/components/admin/admin-menu";
import { ImageField } from "./image-field";
import { btnDanger, btnPrimary, btnSecondary, card, inputClass } from "./ui";
import { IconBtn } from "./icon-btn";

/** A master admin (fixed in the code), as the page found it in the database. `id` is null while the login does not exist yet. */
export type MasterRow = { email: string; name: string; id: string | null; lastLogin: string; isMe: boolean };
/** A team member: a login made in this screen. */
export type MemberRow = { id: string; email: string; name: string; lastLogin: string };
/** A leftover login of an e-mail that is not of the company: it cannot sign in. */
export type BlockedRow = { id: string; email: string };

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
        <IconBtn icon="external" label="Open the login page" href="/admin/login" external />
      </div>
    </section>
  );
}

/** A random password of 16 letters and digits (no look-alike characters), made in the browser, to hand over to the new user. */
function makePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"; // 55 characters
  let out = "";
  while (out.length < 16) {
    for (const b of crypto.getRandomValues(new Uint8Array(32))) {
      if (b < 220 && out.length < 16) out += chars[b % chars.length]; // 220 = 4 x 55: no character is more likely than another
    }
  }
  return out;
}

/** The logins: the master admins (fixed), the team members (add a new user, new password, remove) and leftover rows that cannot sign in. */
export function AccountsCard({ masters, members, blocked, domain }: { masters: MasterRow[]; members: MemberRow[]; blocked: BlockedRow[]; domain: string }) {
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, ActionResult>>({});
  const [fresh, setFresh] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [pending, start] = useTransition();

  const say = (key: string, res: ActionResult) => setResults((r) => ({ ...r, [key]: res }));
  const createMaster = (row: MasterRow) =>
    start(async () => {
      const res = await createAdminUser({ email: row.email, password: passwords[row.email] ?? "" });
      say(row.email, res);
      if (res.ok) setPasswords((p) => ({ ...p, [row.email]: "" }));
    });
  const addUser = () =>
    start(async () => {
      const res = await createAdminUser(fresh);
      say("new", res);
      if (res.ok) {
        setFresh({ name: "", email: "", password: "" });
        setShowPassword(false);
      }
    });
  const change = (key: string, id: string, email: string) => {
    const next = window.prompt(`New password for ${email} (at least 12 characters):`);
    if (!next) return;
    start(async () => say(key, await setAdminPassword(id, next)));
  };
  const remove = (key: string, id: string, email: string) => {
    if (!window.confirm(`Remove the login ${email}? It will not be able to sign in any more.`)) return;
    start(async () => say(key, await deleteAdminUser(id)));
  };
  const canAdd = fresh.name.trim().length > 0 && fresh.email.includes("@") && fresh.password.length >= 12;

  return (
    <section className={`${card} space-y-6`}>
      <div>
        <h2 className="text-lg font-semibold">Logins</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Only @{domain} e-mail addresses can get a login. The master admins are fixed. Every other login is a team member that you add here.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-semibold">Master admins</h3>
        <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200">
          {masters.map((row) => (
            <li key={row.email} className="space-y-3 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-base font-semibold">
                    {row.name}
                    <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-sm font-medium text-brand">Master admin</span>
                    {row.isMe && <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-sm text-zinc-500">you</span>}
                  </p>
                  <p className="truncate text-sm text-zinc-500">{row.email}</p>
                  <p className="text-sm text-zinc-400">{row.id ? `Last sign-in: ${row.lastLogin}` : "No login created yet"}</p>
                  <p className="text-sm text-zinc-400">Every screen, always. Nobody can remove this account.</p>
                </div>
                {row.id && (
                  <button type="button" className={btnSecondary} disabled={pending} onClick={() => change(row.email, row.id!, row.email)}>
                    New password
                  </button>
                )}
              </div>
              {!row.id && (
                <div className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <label className="min-w-64 flex-1 text-sm font-medium text-zinc-700">
                    Password for this login (at least 12 characters)
                    <input
                      className={inputClass}
                      type="password"
                      autoComplete="new-password"
                      value={passwords[row.email] ?? ""}
                      onChange={(e) => setPasswords((p) => ({ ...p, [row.email]: e.target.value }))}
                    />
                  </label>
                  <button type="button" className={btnPrimary} disabled={pending || (passwords[row.email] ?? "").length < 12} onClick={() => createMaster(row)}>
                    {pending ? "Saving…" : "Create login"}
                  </button>
                </div>
              )}
              <Notice result={results[row.email] ?? null} />
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-semibold">Team members</h3>
        {members.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-4 text-sm text-zinc-500">No team members yet. Add the first one below.</p>
        ) : (
          <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200">
            {members.map((row) => (
              <li key={row.id} className="space-y-3 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-base font-semibold">
                      {row.name}
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-sm font-medium text-zinc-500">Team member</span>
                    </p>
                    <p className="truncate text-sm text-zinc-500">{row.email}</p>
                    <p className="text-sm text-zinc-400">Last sign-in: {row.lastLogin}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className={btnSecondary} disabled={pending} onClick={() => change(row.id, row.id, row.email)}>
                      New password
                    </button>
                    <button type="button" className={btnDanger} disabled={pending} onClick={() => remove(row.id, row.id, row.email)}>
                      Remove
                    </button>
                  </div>
                </div>
                <Notice result={results[row.id] ?? null} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <div>
          <h3 className="text-base font-semibold">Add a new user</h3>
          <p className="mt-1 text-sm text-zinc-500">
            The new user is a team member: they see only the dashboard until you tick screens for them in &quot;Who can open what&quot; below. Give them the e-mail and the password.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label className="text-sm font-medium text-zinc-700">
            Name
            <input className={inputClass} type="text" autoComplete="off" maxLength={60} value={fresh.name} onChange={(e) => setFresh((f) => ({ ...f, name: e.target.value }))} />
          </label>
          <label className="text-sm font-medium text-zinc-700">
            E-mail
            <input
              className={inputClass}
              type="email"
              autoComplete="off"
              placeholder={`name@${domain}`}
              value={fresh.email}
              onChange={(e) => setFresh((f) => ({ ...f, email: e.target.value }))}
            />
          </label>
          <label className="text-sm font-medium text-zinc-700">
            Password (at least 12 characters)
            <input
              className={inputClass}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={fresh.password}
              onChange={(e) => setFresh((f) => ({ ...f, password: e.target.value }))}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btnPrimary} disabled={pending || !canAdd} onClick={addUser}>
            {pending ? "Saving…" : "Create user"}
          </button>
          <button
            type="button"
            className={btnSecondary}
            disabled={pending}
            onClick={() => {
              setFresh((f) => ({ ...f, password: makePassword() }));
              setShowPassword(true);
            }}
          >
            Make a password
          </button>
          <button type="button" className={btnSecondary} disabled={pending} onClick={() => setShowPassword((s) => !s)}>
            {showPassword ? "Hide password" : "Show password"}
          </button>
        </div>
        <Notice result={results.new ?? null} />
      </div>

      {blocked.length > 0 && (
        <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">Other logins found in the database (their e-mail is not @{domain}, so they cannot sign in)</p>
          <ul className="space-y-2">
            {blocked.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 text-sm text-amber-800">
                <span className="truncate">{b.email}</span>
                <button type="button" className={btnDanger} disabled={pending} onClick={() => remove(b.id, b.id, b.email)}>
                  Remove
                </button>
                <span className="w-full empty:hidden">{results[b.id] && <Notice result={results[b.id]} />}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** The table of rights: one row per screen, one column per team member. The master admins always have every screen. */
export function AccessMatrix({ members, initial }: { members: { email: string; name: string }[]; initial: Record<string, string[]> }) {
  const [grants, setGrants] = useState<Record<string, string[]>>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  const has = (email: string, key: string) => (grants[email] ?? []).includes(key);
  const toggle = (email: string, key: string) => {
    setResult(null);
    setGrants((g) => {
      const list = g[email] ?? [];
      return { ...g, [email]: list.includes(key) ? list.filter((k) => k !== key) : [...list, key] };
    });
  };
  const setAll = (email: string, on: boolean) => {
    setResult(null);
    setGrants((g) => ({ ...g, [email]: on ? ADMIN_AREAS.map((a) => a.key) : [] }));
  };
  const dirty = JSON.stringify(grants) !== saved;
  const groups = [...new Set(ADMIN_AREAS.map((a) => a.group))];

  const save = () =>
    start(async () => {
      const res = await saveAdminAccess({ grants });
      setResult(res);
      if (res.ok) setSaved(JSON.stringify(grants));
    });

  return (
    <section className={`${card} space-y-5`}>
      <div>
        <h2 className="text-lg font-semibold">Who can open what</h2>
        <p className="mt-1 text-sm text-zinc-500">
          The master admins (Admin, Harsh and Parth) open every screen and need nobody&apos;s permission. Tick the screens each team member may open: they see only those in the
          menu and on the dashboard, and the server refuses the others even if they type the address. The dashboard is open to everybody.
        </p>
      </div>

      {members.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-4 text-sm text-zinc-500">No team members yet. Add a new user above, then come back here to give them screens.</p>
      ) : (
      <div className="overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 text-sm text-zinc-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Screen
              </th>
              <th scope="col" className="w-36 px-3 py-3 text-center font-medium">
                Master admins
              </th>
              {members.map((m) => (
                <th key={m.email} scope="col" className="w-40 px-3 py-3 text-center font-medium">
                  <span className="block text-zinc-800">{m.name}</span>
                  <span className="mt-1 flex justify-center gap-2 text-sm font-normal">
                    <button type="button" className="text-brand hover:underline" onClick={() => setAll(m.email, true)}>
                      All
                    </button>
                    <span aria-hidden="true">·</span>
                    <button type="button" className="text-brand hover:underline" onClick={() => setAll(m.email, false)}>
                      None
                    </button>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <GroupRows key={group} group={group} members={members} has={has} toggle={toggle} />
            ))}
          </tbody>
        </table>
      </div>
      )}

      <Notice result={result} />
      {members.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btnPrimary} disabled={pending || !dirty} onClick={save}>
            {pending ? "Saving…" : "Save access"}
          </button>
          {dirty && !pending && <span className="text-sm text-amber-600">You have changes that are not saved yet.</span>}
        </div>
      )}
    </section>
  );
}

function GroupRows({ group, members, has, toggle }: { group: string; members: { email: string; name: string }[]; has: (email: string, key: string) => boolean; toggle: (email: string, key: string) => void }) {
  return (
    <>
      <tr className="border-t border-zinc-200 bg-zinc-50/60">
        <th scope="rowgroup" colSpan={2 + members.length} className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {group}
        </th>
      </tr>
      {ADMIN_AREAS.filter((a) => a.group === group).map((area) => (
        <tr key={area.key} className="border-t border-zinc-100">
          <th scope="row" className="px-4 py-3 text-left font-normal">
            <span className="block text-base font-medium text-zinc-900">{area.label}</span>
            <span className="block text-sm text-zinc-500">{area.hint}</span>
          </th>
          <td className="px-3 py-3 text-center text-emerald-600" title="The master admins always have every screen">
            <span aria-label="Master admins always have access">✓</span>
          </td>
          {members.map((m) => (
            <td key={m.email} className="px-3 py-3 text-center">
              <input
                type="checkbox"
                className="size-5 cursor-pointer accent-[var(--ads-accent-deep)]"
                checked={has(m.email, area.key)}
                onChange={() => toggle(m.email, area.key)}
                aria-label={`${m.name} may open ${area.label}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
