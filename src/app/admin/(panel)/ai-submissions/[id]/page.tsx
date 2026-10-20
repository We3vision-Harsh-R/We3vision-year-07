import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteRecord, SubmissionActions } from "@/components/admin/submission-actions";
import { SubmissionFrame } from "@/components/admin/submission-frame";
import { FieldList, SubmissionBadge } from "@/components/admin/submission-parts";
import { card } from "@/components/admin/ui";
import { getContentType, validateDraft } from "@/lib/ai-content/registry";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "AI submission" };

const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
const ACTION: Record<string, string> = { submitted: "Sent by the AI tool", edited: "Edited", approved: "Approved and published", saved_draft: "Saved as a hidden draft", rejected: "Rejected" };

export default async function SubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[a-z0-9]{10,40}$/i.test(id)) notFound();
  const sub = await db.contentSubmission.findUnique({ where: { id }, include: { events: { orderBy: { at: "asc" } } } });
  const def = sub ? getContentType(sub.contentType) : undefined;
  if (!sub || !def) notFound();
  const checked = validateDraft(def, sub.data);
  const waiting = sub.status === "pending_review";
  const liveUrl = sub.entitySlug ? def.livePath(sub.entitySlug) : "";

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/ai-submissions" className="text-sm text-zinc-500 hover:text-brand">
          ← All AI submissions
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{sub.title || "(no title)"}</h1>
          <SubmissionBadge status={sub.status} />
        </div>
        <p className="mt-1 text-sm text-zinc-500">
          {def.label} · sent by <b>{sub.connectionName || "a deleted connection"}</b> · {fmt.format(sub.createdAt)}
        </p>
      </div>

      {!checked.ok && (
        <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800">
          This draft does not pass the checks of the form any more: {checked.errors.map((e) => `${e.field}: ${e.message}`).join(" · ")}. Press Edit to fix it.
        </p>
      )}
      {sub.status === "rejected" && (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800">
          Rejected by {sub.reviewedBy || "an admin"}. Reason: {sub.rejectReason}
        </p>
      )}
      {(sub.status === "approved" || sub.status === "draft") && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {sub.status === "approved" ? "Live: " : "Saved hidden: "}
          {sub.status === "approved" ? (
            <a href={liveUrl} target="_blank" rel="noreferrer" className="font-medium underline">
              {liveUrl} ↗
            </a>
          ) : (
            <Link href={def.key === "blog" ? `/admin/blog/${sub.entityId}` : `/admin/careers/jobs/${sub.entityId}`} className="font-medium underline">
              open it in the normal editor
            </Link>
          )}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          {checked.ok && <SubmissionFrame id={sub.id} />}
          <section className={card}>
            <h2 className="text-lg font-semibold">Field by field</h2>
            <p className="mb-2 text-sm text-zinc-500">The same fields as the admin form.</p>
            <FieldList def={def} data={checked.ok ? checked.data : (sub.data as Record<string, unknown>)} />
          </section>
        </div>
        <aside className="space-y-6">
          {waiting && <SubmissionActions id={sub.id} liveLabel={`"${sub.title}"`} />}
          {!waiting && sub.status !== "publishing" && <DeleteRecord id={sub.id} />}
          <section className={`${card} space-y-3`}>
            <h2 className="text-lg font-semibold">History</h2>
            <ol className="space-y-3">
              {sub.events.map((e) => (
                <li key={e.id} className="text-sm">
                  <p className="font-medium">{ACTION[e.action] ?? e.action}</p>
                  <p className="text-xs text-zinc-500">
                    {e.actor} · {fmt.format(e.at)}
                  </p>
                  {e.note && <p className="mt-0.5 text-xs text-zinc-600">{e.note}</p>}
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}
