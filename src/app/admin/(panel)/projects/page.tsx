import Link from "next/link";
import { ProjectsList, type ProjectRow } from "@/components/admin/projects-list";
import { btnPrimary } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  await requireAdmin();
  const projects = await db.project.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  const rows: ProjectRow[] = projects.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    cover: p.cover || (Array.isArray(p.images) && typeof p.images[0] === "string" ? p.images[0] : ""),
    group: p.group,
    published: p.published,
    pictures: Array.isArray(p.images) ? p.images.length : 0,
  }));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="mt-1 max-w-xl text-sm text-zinc-500">
            Your portfolio. Every project shows on the Portfolio page; the ones in the Brand Design group are also the sliding photos of the Brand Design page. The order here is
            the order on the website.
          </p>
        </div>
        <Link href="/admin/projects/new" className={btnPrimary}>
          + Add project
        </Link>
      </div>
      <ProjectsList rows={rows} />
    </div>
  );
}
