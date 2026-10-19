import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost } from "@/components/site/blog-post";
import { JobPage } from "@/components/site/career/job-page";
import { draftToBlogEntry, draftToJobView } from "@/lib/ai-content/preview-data";
import { CONTENT_TYPE_KEYS, getContentType, validateDraft, type ContentTypeKey } from "@/lib/ai-content/registry";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCareerSetup } from "@/lib/careers";

export const metadata: Metadata = { title: "Submission preview", robots: { index: false, follow: false } };

// Shows an AI submission inside the real site layout, with the SAME components as the live pages (BlogPost, JobPage). Admin only; never indexed
// (the headers of /preview/* in next.config.ts also say no-store). One renderer per registry entry: TypeScript forces a new type to add one.
const RENDER: Record<ContentTypeKey, (data: Record<string, unknown>, slug: string) => Promise<React.ReactNode>> = {
  async blog(data, slug) {
    const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
    return <BlogPost post={draftToBlogEntry(data, slug)} base={base} />;
  },
  async career(data, slug) {
    const { questions } = await getCareerSetup();
    return <JobPage job={draftToJobView(data, slug)} questions={questions} />;
  },
};

export default async function SubmissionPreview({ searchParams }: { searchParams: Promise<{ id?: string; embed?: string }> }) {
  await requireAdmin();
  const { id, embed } = await searchParams;
  const sub = id && /^[a-z0-9]{10,40}$/i.test(id) ? await db.contentSubmission.findUnique({ where: { id } }) : null;
  const def = sub ? getContentType(sub.contentType) : undefined;
  if (!sub || !def || !CONTENT_TYPE_KEYS.includes(def.key as ContentTypeKey)) notFound();
  const checked = validateDraft(def, sub.data);
  if (!checked.ok) notFound();
  return (
    <>
      {embed !== "1" && (
        <div className="fixed left-4 top-4 z-[60] rounded-full bg-amber-400 px-5 py-2 text-center text-sm font-semibold text-black shadow-xl">
          AI submission preview, this is not on the website.
        </div>
      )}
      {await RENDER[def.key as ContentTypeKey](checked.data, def.slugOf(checked.data))}
    </>
  );
}
