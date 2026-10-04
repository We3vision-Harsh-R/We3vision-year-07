import Link from "next/link";
import { StatusBadge } from "@/components/admin/status-badge";
import { btnSecondary, card } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { PAGES } from "@/lib/cms/pages";
import { getPageStatuses } from "@/lib/cms/queries";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Pages" };

export default async function PagesList() {
  await requireAdmin();
  const statuses = await getPageStatuses();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pages</h1>
        <p className="mt-1 text-sm text-zinc-500">Every page of the website appears here automatically, with its own editor.</p>
      </div>
      <div className="space-y-3">
        {Object.entries(PAGES).map(([slug, page]) => {
          const { status, publishedAt } = statuses[slug];
          return (
            <div key={slug} className={`${card} flex flex-wrap items-center justify-between gap-4`}>
              <div>
                <p className="font-semibold">{page.title}</p>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {page.path} {publishedAt && <span className="text-zinc-400">· published {formatDate(publishedAt)}</span>}
                </p>
                <div className="mt-2">
                  <StatusBadge status={status} />
                </div>
              </div>
              <div className="flex gap-2">
                <a href={page.path} target="_blank" rel="noreferrer" className={btnSecondary}>
                  View live ↗
                </a>
                <Link href={`/admin/pages/${slug}`} className={`${btnSecondary} !border-brand !text-brand`}>
                  Edit page
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
