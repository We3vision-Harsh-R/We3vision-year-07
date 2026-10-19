import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost } from "@/components/site/blog-post";
import { PageSections } from "@/components/site/sections";
import { getBlogEntries, getBlogEntry } from "@/lib/blog";
import { getSiteSettings } from "@/lib/cms/queries";
import { SHARE_IMAGE } from "@/lib/share-image";

// One article of the blog. The articles are written in the admin panel (Blog). Served from cache; saving an article refreshes it.
export const revalidate = 600;

export const generateStaticParams = async () => {
  try {
    return (await getBlogEntries()).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getBlogEntry((await params).slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  return {
    // search results cut a title at about 60 characters: the brand name is added only when it still fits
    title: `${post.title} | We3vision`.length <= 60 ? `${post.title} | We3vision` : post.title,
    description: post.summary,
    alternates: { canonical: path },
    openGraph: { type: "article", url: path, siteName: "We3vision Private Limited", title: post.title, description: post.summary, publishedTime: post.date, images: [post.image || SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary, images: [post.image || SHARE_IMAGE.url] },
  };
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getBlogEntry((await params).slug);
  if (!post) notFound();
  const site = await getSiteSettings();
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  return (
    <>
      <BlogPost post={post} base={base} />
      <PageSections
        sections={[{ id: "contact", type: "contact", data: { chip: "Let's talk", heading: "Want To Build\nSomething?", text: "Tell us about your project and the We3vision team will get back to you.", buttonLabel: "Send a message" } }]}
        site={site}
        skin="modern"
        page="blog"
      />
    </>
  );
}
