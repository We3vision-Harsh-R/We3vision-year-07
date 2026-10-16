import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ added?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { added } = await searchParams;
  const p = await db.project.findUnique({ where: { id } });
  if (!p) notFound();
  const images = Array.isArray(p.images) ? p.images.filter((x): x is string => typeof x === "string") : [];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{p.title}</h1>
        {added && <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Project added. It is on the website now.</p>}
      </div>
      <ProjectForm
        key={p.updatedAt.toISOString()}
        id={p.id}
        slug={p.slug}
        initial={{ title: p.title, category: p.category, summary: p.summary, content: p.content, cover: p.cover, images, group: p.group, published: p.published }}
      />
    </div>
  );
}
