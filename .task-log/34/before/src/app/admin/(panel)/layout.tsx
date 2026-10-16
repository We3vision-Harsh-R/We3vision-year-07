import Link from "next/link";
import { logout } from "@/actions/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const unreadLeads = await db.lead.count({ where: { isRead: false } });

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[250px_1fr]">
      <aside className="bg-ink px-4 py-4 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:px-5 lg:py-6">
        <div className="mb-4 flex items-center justify-between lg:mb-8 lg:block">
          <Link href="/admin" className="flex items-center gap-2.5 font-display text-lg font-bold">
            <span className="bg-brand-gradient grid size-8 place-items-center rounded-lg text-sm">W</span>
            Admin panel
          </Link>
          <form action={logout} className="lg:hidden">
            <button className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70">Log out</button>
          </form>
        </div>
        <AdminNav unreadLeads={unreadLeads} />
        <div className="mt-6 hidden space-y-3 border-t border-white/10 pt-5 text-sm lg:mt-auto lg:block">
          <a href="/" target="_blank" rel="noreferrer" className="block text-white/60 transition hover:text-white">
            View website ↗
          </a>
          <p className="truncate text-xs text-white/40">{admin.email}</p>
          <form action={logout}>
            <button className="w-full rounded-lg border border-white/15 px-3 py-2 text-white/70 transition hover:bg-white/5 hover:text-white">Log out</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">{children}</div>
    </div>
  );
}
