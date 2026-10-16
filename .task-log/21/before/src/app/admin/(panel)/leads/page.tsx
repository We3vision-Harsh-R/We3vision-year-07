import { deleteLead, markLeadRead } from "@/actions/leads";
import { btnDanger, btnSecondary, card } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Leads" };

export default async function LeadsPage() {
  await requireAdmin();
  const leads = await db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="mt-1 text-sm text-zinc-500">Messages sent through the website contact form (latest 100).</p>
      </div>
      {leads.length === 0 && <p className={`${card} text-sm text-zinc-400`}>No enquiries yet.</p>}
      <div className="space-y-3">
        {leads.map((lead) => (
          <article key={lead.id} className={`${card} ${lead.isRead ? "" : "border-brand/50"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {lead.name} {!lead.isRead && <span className="ml-1 rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-white">new</span>}
                </p>
                <p className="mt-0.5 text-sm text-zinc-500">
                  <a className="hover:text-brand" href={`mailto:${lead.email}`}>
                    {lead.email}
                  </a>
                  {lead.phone && (
                    <>
                      {" · "}
                      <a className="hover:text-brand" href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>
                        {lead.phone}
                      </a>
                    </>
                  )}
                </p>
              </div>
              <time className="text-xs text-zinc-400">{formatDate(lead.createdAt)}</time>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-700">{lead.message}</p>
            <div className="mt-4 flex gap-2">
              {!lead.isRead && (
                <form action={markLeadRead}>
                  <input type="hidden" name="id" value={lead.id} />
                  <button className={btnSecondary}>Mark as read</button>
                </form>
              )}
              <form action={deleteLead}>
                <input type="hidden" name="id" value={lead.id} />
                <button className={btnDanger}>Delete</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
