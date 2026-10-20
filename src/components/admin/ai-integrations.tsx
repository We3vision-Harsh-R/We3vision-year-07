"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  createConnection,
  removeConnection,
  removeTool,
  revokeAllConnections,
  revokeConnection,
  saveAiSwitches,
  type CreateConnectionResult,
} from "@/actions/ai-integrations";
import type { ActionResult } from "@/actions/types";
import { btnDanger, btnPrimary, btnSecondary, card, inputClass, labelClass } from "./ui";

export type ConnectionRow = {
  id: string;
  name: string;
  kind: "token" | "oauth";
  owner: string;
  mine: boolean;
  scopes: string[];
  hint: string;
  created: string;
  lastUsed: string;
  expires: string;
  status: "active" | "revoked" | "expired";
  submissions: number;
};

export type ToolRow = { id: string; name: string; hosts: string; registered: string; active: number };
export type SwitchState = { enabled: boolean; alerts: boolean; forcedOff: boolean; forcedAlertsOff: boolean };

const SCOPE_LABEL: Record<string, string> = { "content:submit": "Send for approval", "content:read": "Read lists and status" };

/** A read-only box with a Copy button. */
export function CopyBox({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // the box can still be selected by hand
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className={labelClass}>{label}</span>
        <button type="button" className={`${btnSecondary} !px-3 !py-1.5`} onClick={copy}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      {multiline ? (
        <textarea readOnly rows={Math.min(8, value.split("\n").length + 1)} value={value} className={`${inputClass} font-mono text-xs`} onFocus={(e) => e.currentTarget.select()} />
      ) : (
        <input readOnly value={value} className={`${inputClass} font-mono text-xs`} onFocus={(e) => e.currentTarget.select()} />
      )}
    </div>
  );
}

function Notice({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return (
    <p role="status" className={`rounded-lg px-3 py-2 text-sm ${result.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
      {result.ok ? result.message : result.error}
    </p>
  );
}

export function AiIntegrations({ mcpUrl, connections, tools, switches }: { mcpUrl: string; connections: ConnectionRow[]; tools: ToolRow[]; switches: SwitchState }) {
  const [on, setOn] = useState(switches.enabled);
  const [alerts, setAlerts] = useState(switches.alerts);
  const [name, setName] = useState("");
  const [submit, setSubmit] = useState(true);
  const [read, setRead] = useState(true);
  const [days, setDays] = useState("90");
  const [created, setCreated] = useState<CreateConnectionResult | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  const make = () =>
    start(async () => {
      const res = await createConnection({ name, scopes: [submit && "content:submit", read && "content:read"].filter(Boolean), days: Number(days) });
      setCreated(res.ok ? res : null);
      setResult(res);
      if (res.ok) setName("");
    });

  const act = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      setResult(await fn());
    });

  const saveSwitches = (enabled: boolean, alertsOn: boolean) =>
    start(async () => {
      const res = await saveAiSwitches({ enabled, alerts: alertsOn });
      setResult(res);
      if (res.ok) {
        setOn(enabled);
        setAlerts(alertsOn);
      }
    });

  const activeCount = connections.filter((c) => c.status === "active").length;
  const token = created?.token ?? "";
  const url = created?.mcpUrl ?? mcpUrl;

  return (
    <>
      <section className={`${card} space-y-4`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              AI tools are {on ? <span className="text-emerald-700">allowed</span> : <span className="text-rose-600">blocked</span>}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {on ? "Connected tools can send drafts for your approval." : "Nothing can connect, sign in or send while this is blocked. Your connections stay in the list."}
            </p>
          </div>
          <button type="button" className={on ? btnDanger : btnPrimary} disabled={pending || (!on && switches.forcedOff)} onClick={() => saveSwitches(!on, alerts)}>
            {on ? "Block all AI tools" : "Allow AI tools"}
          </button>
        </div>
        {switches.forcedOff && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            The server has AI_INTEGRATION=off, so the tools are blocked whatever this page says. Remove that variable on the hosting to allow them.
          </p>
        )}
        <label className="flex items-center gap-2.5 text-sm text-zinc-700">
          <input type="checkbox" checked={alerts && !switches.forcedAlertsOff} disabled={pending || switches.forcedAlertsOff} onChange={(e) => saveSwitches(on, e.target.checked)} />
          Send me a WhatsApp alert when an AI tool sends a new draft{switches.forcedAlertsOff ? " (switched off on the server by ALERT_AI=off)" : ""}
        </label>
        <Notice result={result} />
        <p className="text-sm text-zinc-500">
          New to this? Read the{" "}
          <Link href="/admin/ai-guide" className="font-medium text-brand hover:underline">
            AI Guide
          </Link>
          : where to do what, how to connect Claude, Claude Code or Cursor, and example prompts.
        </p>
      </section>

      <section className={`${card} space-y-4`}>
        <div>
          <h2 className="text-lg font-semibold">The MCP address of your website</h2>
          <p className="mt-1 text-sm text-zinc-500">
            In <b>Claude</b> (web or desktop) add it as a custom connector, then sign in with your admin account when asked: no token needed. For tools that use a header (Claude Code, Cursor …) create a connection below to get a token.
          </p>
        </div>
        <CopyBox label="MCP URL" value={mcpUrl} />
      </section>

      <section className={`${card} space-y-4`}>
        <h2 className="text-lg font-semibold">Create a connection</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Name
            <input className={inputClass} value={name} maxLength={60} placeholder="e.g. Claude laptop" onChange={(e) => setName(e.target.value)} />
          </label>
          <label className={labelClass}>
            Ends after
            <select className={inputClass} value={days} onChange={(e) => setDays(e.target.value)}>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
              <option value="0">Never (until I revoke it)</option>
            </select>
          </label>
        </div>
        <fieldset className="space-y-2">
          <legend className={labelClass}>Permissions</legend>
          <label className="flex items-center gap-2.5 text-sm text-zinc-700">
            <input type="checkbox" checked={submit} onChange={(e) => setSubmit(e.target.checked)} /> Send drafts for approval (content:submit)
          </label>
          <label className="flex items-center gap-2.5 text-sm text-zinc-700">
            <input type="checkbox" checked={read} onChange={(e) => setRead(e.target.checked)} /> Read existing articles, jobs and the status of its submissions (content:read)
          </label>
        </fieldset>
        <button type="button" className={btnPrimary} disabled={pending || name.trim().length < 2} onClick={make}>
          {pending ? "Please wait…" : "Create connection"}
        </button>

        {token && (
          <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <p className="text-sm font-medium text-amber-900">Copy these now. The token is shown only once; if you lose it, revoke this connection and make a new one.</p>
            <CopyBox label="MCP URL" value={url} />
            <CopyBox label="Token" value={token} />
            <CopyBox label="Claude Code (terminal)" multiline value={`claude mcp add --transport http we3vision ${url} --header "Authorization: Bearer ${token}"`} />
            <CopyBox
              label="Cursor (.cursor/mcp.json) and other clients that use headers"
              multiline
              value={JSON.stringify({ mcpServers: { we3vision: { url, headers: { Authorization: `Bearer ${token}` } } } }, null, 2)}
            />
          </div>
        )}
      </section>

      <section className={`${card} space-y-3`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Connections</h2>
          {activeCount > 0 && (
            <button
              type="button"
              className={btnDanger}
              disabled={pending}
              onClick={() => window.confirm(`Revoke all ${activeCount} active connection(s)? Every AI tool is signed out at once.`) && act(() => revokeAllConnections())}
            >
              Revoke all
            </button>
          )}
        </div>
        {connections.length === 0 ? (
          <p className="text-sm text-zinc-500">No connection yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {connections.map((c) => (
              <li key={c.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                <div className="min-w-0 space-y-1">
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {c.name}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-600"}`}>{c.status}</span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{c.kind === "oauth" ? "signed in (OAuth)" : "token"}</span>
                  </p>
                  <p className="text-xs text-zinc-500">
                    {c.scopes.map((s) => SCOPE_LABEL[s] ?? s).join(" · ")} · {c.owner}
                    {c.hint && c.kind === "token" ? ` · ${c.hint}` : ""}
                  </p>
                  <p className="text-xs text-zinc-400">
                    Created {c.created} · last used {c.lastUsed}
                    {c.expires ? ` · ends ${c.expires}` : ""} · {c.submissions} submission(s)
                  </p>
                </div>
                <div className="flex gap-2">
                  {c.status !== "revoked" ? (
                    <button
                      type="button"
                      className={btnDanger}
                      disabled={pending}
                      onClick={() => window.confirm(`Revoke "${c.name}"? The AI tool stops working at once.`) && act(() => revokeConnection(c.id))}
                    >
                      Revoke
                    </button>
                  ) : (
                    <button type="button" className={btnSecondary} disabled={pending} onClick={() => act(() => removeConnection(c.id))}>
                      Remove from list
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={`${card} space-y-3`}>
        <div>
          <h2 className="text-lg font-semibold">Tools that signed in</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Claude, Cursor and similar tools register themselves the first time you connect them with the address above. Remove one to forget it and sign it out; it must be added and allowed again.
          </p>
        </div>
        {tools.length === 0 ? (
          <p className="text-sm text-zinc-500">No tool has registered yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {tools.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium">{t.name}</p>
                  <p className="break-all text-xs text-zinc-500">
                    Returns to {t.hosts} · registered {t.registered} · {t.active} active connection(s)
                  </p>
                </div>
                <button
                  type="button"
                  className={btnDanger}
                  disabled={pending}
                  onClick={() => window.confirm(`Remove "${t.name}"? Its connections are revoked.`) && act(() => removeTool(t.id))}
                >
                  Remove tool
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
