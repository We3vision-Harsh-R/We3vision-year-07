"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { approveSubmission, rejectSubmission } from "@/actions/ai-submissions";
import type { ActionResult } from "@/actions/types";
import { btnDanger, btnPrimary, btnSecondary, card, inputClass, labelClass } from "./ui";

/** Edit, Approve & Publish, Save as normal draft, Reject (with a reason). Shown while the submission waits. */
export function SubmissionActions({ id, liveLabel }: { id: string; liveLabel: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  const run = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      const res = await fn();
      setResult(res);
      if (res.ok) router.refresh();
    });

  return (
    <section className={`${card} space-y-3`}>
      <h2 className="text-lg font-semibold">Decide</h2>
      <Link href={`/admin/ai-submissions/${id}/edit`} className={`${btnSecondary} w-full`}>
        Edit in the normal form
      </Link>
      <button
        type="button"
        className={`${btnPrimary} w-full`}
        disabled={pending}
        onClick={() => window.confirm(`Approve and publish? ${liveLabel} goes live on the website now.`) && run(() => approveSubmission(id, "publish"))}
      >
        {pending ? "Please wait…" : "Approve & Publish"}
      </button>
      <button type="button" className={`${btnSecondary} w-full`} disabled={pending} onClick={() => run(() => approveSubmission(id, "draft"))}>
        Save as a normal draft (hidden)
      </button>
      {!asking ? (
        <button type="button" className={`${btnDanger} w-full`} disabled={pending} onClick={() => setAsking(true)}>
          Reject…
        </button>
      ) : (
        <div className="space-y-2 rounded-xl border border-rose-200 bg-rose-50/40 p-3">
          <label className={labelClass}>
            Reason (the AI tool can read it)
            <textarea className={`${inputClass} min-h-24`} value={reason} maxLength={500} onChange={(e) => setReason(e.target.value)} placeholder="e.g. The tone is too salesy. Remove the numbers that have no source." />
          </label>
          <div className="flex gap-2">
            <button type="button" className={btnDanger} disabled={pending || reason.trim().length < 3} onClick={() => run(() => rejectSubmission(id, reason))}>
              Reject
            </button>
            <button type="button" className={btnSecondary} disabled={pending} onClick={() => setAsking(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {result && (
        <p role="status" className={`rounded-lg px-3 py-2 text-sm ${result.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
          {result.ok ? result.message : result.error}
        </p>
      )}
    </section>
  );
}
