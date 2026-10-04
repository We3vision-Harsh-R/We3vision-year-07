import Link from "next/link";
import { StatusBadge } from "@/components/admin/status-badge";
import { card } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { PAGES } from "@/lib/cms/pages";
import { getPageStatuses } from "@/lib/cms/queries";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const [statuses, totalLeads, unreadLeads, latest] = await Promise.all([
    getPageStatuses(),
    db.lead.count(),
    db.lead.count({ where: { isRead: false } }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {admin.name}</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage everything on the website from here.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/leads" className={`${card} transition hover:border-brand/40`}>
          <p className="text-sm text-zinc-500">New enquiries</p>
          <p className="mt-2 font-display text-4xl font-bold text-brand">{unreadLeads}</p>
          <p className="mt-1 text-xs text-zinc-400">{totalLeads} total</p>
        </Link>
        <Link href="/admin/pages" className={`${card} transition hover:border-brand/40`}>
          <p className="text-sm text-zinc-500">Pages</p>
          <p className="mt-2 font-display text-4xl font-bold">{Object.keys(PAGES).length}</p>
          <p className="mt-1 text-xs text-zinc-400">editable pages</p>
        </Link>
        <Link href="/admin/settings" className={`${card} transition hover:border-brand/40`}>
          <p className="text-sm text-zinc-500">Site settings</p>
          <p className="mt-2 text-lg font-semibold">Menu, contact, footer</p>
          <p className="mt-1 text-xs text-zinc-400">Edit what appears on every page</p>
        </Link>
      </div>

      <section className={card}>
        <h2 className="font-semibold">Pages</h2>
        <ul className="mt-3 divide-y divide-zinc-100">
          {Object.entries(PAGES).map(([slug, page]) => (
            <li key={slug} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <Link href={`/admin/pages/${slug}`} className="font-medium hover:text-brand">
                  {page.title}
                </Link>
                <span className="ml-2 text-xs text-zinc-400">{page.path}</span>
              </div>
              <StatusBadge status={statuses[slug].status} />
            </li>
          ))}
        </ul>
      </section>

      <section className={card}>
        <h2 className="font-semibold">Latest enquiries</h2>
        {latest.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">No enquiries yet. Messages sent from the website contact form appear here.</p>
        ) : (
          <ul className="mt-3 divide-y divide-zinc-100">
            {latest.map((lead) => (
              <li key={lead.id} className="py-3 text-sm">
                <p className="font-medium">
                  {lead.name} {!lead.isRead && <span className="ml-1 rounded-full bg-brand px-2 py-0.5 text-xs text-white">new</span>}
                </p>
                <p className="mt-0.5 line-clamp-1 text-zinc-500">{lead.message}</p>
                <p className="mt-0.5 text-xs text-zinc-400">{formatDate(lead.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
