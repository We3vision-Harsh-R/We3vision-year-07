"use client";

import { useState, useTransition } from "react";
import { decideAuthorization } from "@/actions/ai-integrations";
import type { AuthorizeParams } from "@/lib/ai-content/server/oauth";
import { btnPrimary, btnSecondary, card } from "./ui";

const SCOPE_TEXT: Record<string, string> = {
  "content:submit": "Send blog articles and job openings to you for approval (nothing goes live by itself)",
  "content:read": "See the list of existing articles and jobs, and the status of what it sent",
};

/** The consent screen. The browser is sent on with a script (not a form post), because the site's security rule `form-action 'self'` would stop a form from returning to the tool. */
export function ConsentCard({
  adminName,
  adminEmail,
  error,
  client,
  returnHost,
  scopes,
  params,
}: {
  adminName: string;
  adminEmail: string;
  error: string | null;
  client: string;
  returnHost: string;
  scopes: string[];
  params: AuthorizeParams;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  const decide = (approve: boolean) =>
    start(async () => {
      const res = await decideAuthorization({ ...params, approve });
      if (!res.ok) return setMessage(res.error);
      setDone(true);
      window.location.assign(res.url);
    });

  if (error) {
    return (
      <section className={`${card} w-full space-y-3`}>
        <h1 className="text-xl font-bold">This link cannot be used</h1>
        <p className="text-sm text-rose-700">{error}</p>
        <p className="text-sm text-zinc-500">Go back to the AI tool and start the connection again.</p>
      </section>
    );
  }

  return (
    <section className={`${card} w-full space-y-5`}>
      <div>
        <p className="text-sm text-zinc-500">Connect an AI tool</p>
        <h1 className="mt-1 text-xl font-bold">Allow “{client}” to use your We3vision account?</h1>
        <p className="mt-2 text-sm text-zinc-600">
          You are signed in as <b>{adminName}</b> ({adminEmail}).
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-700">This tool will be able to:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
          {scopes.map((s) => (
            <li key={s}>{SCOPE_TEXT[s] ?? s}</li>
          ))}
        </ul>
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          It can <b>never</b> publish, edit or delete anything on the website. Everything it sends waits in <b>Admin → AI Submissions</b> until you approve it.
        </p>
      </div>
      <p className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
        After you allow, your browser goes back to <b className="break-all text-zinc-900">{returnHost}</b>. Only continue if you started this connection yourself and you trust that address.
      </p>
      {message && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {message}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btnPrimary} disabled={pending || done} onClick={() => decide(true)}>
          {done ? "Going back to the tool…" : pending ? "Please wait…" : "Allow"}
        </button>
        <button type="button" className={btnSecondary} disabled={pending || done} onClick={() => decide(false)}>
          Deny
        </button>
      </div>
      <p className="text-xs text-zinc-400">You can stop this access at any time in Admin → AI Integrations.</p>
    </section>
  );
}
