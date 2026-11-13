import { getBlogEntries } from "@/lib/blog";
import { PAGES, type PageSlug } from "@/lib/cms/pages";
import { getPublishedPage, getSiteSettings } from "@/lib/cms/queries";
import { COMPANY_DESCRIPTION, siteBase } from "@/lib/seo/schema";
import { PRODUCT_LINKS, SERVICE_GROUPS, TRAINING_LINKS } from "@/lib/site-menu";

// /llms.txt: a plain-text guide to the website for AI assistants and answer engines (the llms.txt convention: a title, a one-paragraph summary and
// sections of links with a short note each). It is built from the same data as the website (menu, page descriptions, articles, contact cards), so it
// never says anything the site does not say. It is only a guide: no file can promise that an AI product will read, index or recommend a site.
// Refreshes every hour.
export const revalidate = 3600;

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

export async function GET() {
  const base = siteBase() || "http://localhost:1010";
  const bySlugPath = new Map<string, PageSlug>(Object.entries(PAGES).map(([slug, p]) => [p.path as string, slug as PageSlug]));
  // the page descriptions as published in the admin panel; if the database is not reachable the built-in ones
  const describe = async (path: string): Promise<{ title: string; description: string } | null> => {
    const slug = bySlugPath.get(path);
    if (!slug) return null;
    try {
      const v = await getPublishedPage(slug);
      return { title: PAGES[slug].title, description: clean(v.description) };
    } catch {
      return { title: PAGES[slug].title, description: clean(PAGES[slug].defaultSeo.description) };
    }
  };
  const link = async (label: string, path: string) => {
    const d = await describe(path);
    const url = path.startsWith("http") ? path : `${base}${path}`;
    return `- [${label}](${url})${d?.description ? `: ${d.description}` : ""}`;
  };

  const [site, posts] = await Promise.all([getSiteSettings(), getBlogEntries().catch(() => [])]);
  const cards = site.contactCards.map((c) => ({ title: c.title, lines: c.lines.split("\n").map((l) => l.trim()).filter(Boolean) }));

  const out: string[] = [];
  out.push(`# ${site.legalName || "We3vision Private Limited"}`, "", `> ${COMPANY_DESCRIPTION}`, "");
  out.push(
    "- Website: " + `${base}/`,
    "- Founded: 2019, Surat, Gujarat, India",
    "- Offices: Surat (head office), India; Marburg, Germany",
    "- Languages of the website: English",
    "",
  );

  out.push("## Company", "");
  for (const [label, path] of [["About We3vision", "/about"], ["Our team", "/team"], ["Portfolio", "/portfolio"], ["Blog", "/blog"], ["Careers", "/careers"], ["Contact", "/contact"]] as const) out.push(await link(label, path));
  out.push(`- [All services](${base}/services): The seven main services of We3vision, with what is built and who it is for.`, "");

  for (const g of SERVICE_GROUPS) {
    out.push(`## Services: ${g.label}`, "");
    for (const i of g.items) out.push(await link(i.label, i.href));
    out.push("");
  }

  out.push("## Products", "");
  for (const p of PRODUCT_LINKS) out.push(p.href.startsWith("http") ? `- [${p.label}](${p.href}): A software product from We3vision.` : await link(p.label + (p.soon ? " (coming soon)" : ""), p.href));
  out.push("");

  out.push("## Industrial training", "");
  for (const t of TRAINING_LINKS) out.push(await link(t.label, t.href));
  out.push("");

  if (posts.length) {
    out.push("## Articles", "");
    for (const p of posts.slice(0, 20)) out.push(`- [${p.title}](${base}/blog/${p.slug}): ${clean(p.summary)}`);
    out.push(`- [All articles](${base}/blog)`, "");
  }

  out.push("## Contact", "");
  for (const c of cards) out.push(`- ${c.title}: ${c.lines.join(", ")}`);
  out.push(`- Contact form: ${base}/contact`, "");

  out.push("## Optional", "", `- [XML sitemap](${base}/sitemap.xml)`, `- [Sitemap for people](${base}/sitemap)`, "");

  return new Response(out.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" } });
}
