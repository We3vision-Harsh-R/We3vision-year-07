import Link from "next/link";
import { SubmissionBadge } from "@/components/admin/submission-parts";
import { card } from "@/components/admin/ui";
import { getContentType } from "@/lib/ai-content/registry";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "AI Submissions" };

const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
const TABS = [
  { key: "pending_review", label: "Pending approval" },
  { key: "approved", label: "Approved" },
  { key: "draft", label: "Saved as draft" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
] as const;

export default async function AiSubmissionsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const wanted = (await searchParams).status;
  const tab = TABS.find((t) => t.key === wanted)?.key ?? "pending_review";
  const [rows, counts] = await Promise.all([
    db.contentSubmission.findMany({ where: tab === "all" ? {} : { status: tab }, orderBy: { createdAt: "desc" }, take: 100, select: { id: true, contentType: true, title: true, status: true, connectionName: true, createdAt: true } }),
    Promise.all(TABS.filter((t) => t.key !== "all").map((t) => db.contentSubmission.count({ where: { status: t.key } }))),
  ]);
  const count: Record<string, number> = Object.fromEntries(TABS.filter((t) => t.key !== "all").map((t, i) => [t.key, counts[i]]));

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Submissions</h1>
        <p className="mt-1 text-sm text-zinc-500">
          What AI tools sent to the website. Nothing here is live: open one, check the preview, edit it if you like, then approve or reject it. Connections are managed in{" "}
          <Link href="/admin/ai-integrations" className="text-brand hover:underline">
            AI Integrations
          </Link>
          .
        </p>
      </div>
      <nav className="flex flex-wrap gap-2" aria-label="Status">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === "pending_review" ? "/admin/ai-submissions" : `/admin/ai-submissions?status=${t.key}`}
            aria-current={tab === t.key ? "page" : undefined}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${tab === t.key ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"}`}
          >
            {t.label}
            {t.key !== "all" && count[t.key] > 0 ? ` (${count[t.key]})` : ""}
          </Link>
        ))}
      </nav>
      <section className={card}>
        {rows.length === 0 ? (
          <p className="text-sm text-zinc-500">{tab === "pending_review" ? "Nothing is waiting for approval." : "Nothing here yet."}</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/ai-submissions/${r.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 hover:text-brand">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{r.title || "(no title)"}</span>
                    <span className="block text-xs text-zinc-500">
                      {getContentType(r.contentType)?.label ?? r.contentType} · from {r.connectionName || "a deleted connection"} · {fmt.format(r.createdAt)}
                    </span>
                  </span>
                  <SubmissionBadge status={r.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
