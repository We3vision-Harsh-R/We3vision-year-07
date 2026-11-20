import { getBlogEntries } from "@/lib/blog";
import { PAGES, type PageSlug } from "@/lib/cms/pages";
import { getPublishedPage, getSiteSettings } from "@/lib/cms/queries";
import { homeFaq } from "@/lib/seo/home-faq";
import { COMPANY_DESCRIPTION, siteBase } from "@/lib/seo/schema";
import { PRODUCT_LINKS, SERVICE_GROUPS, TRAINING_LINKS } from "@/lib/site-menu";

// /llms-full.txt: the long version of /llms.txt for AI assistants and answer engines. Besides the links it carries the text an assistant needs to
// answer "which company can do X": the home page questions and answers, and for every service page its description, its first-screen text and
// its FAQ. Everything is read from the same data as the website (admin panel content, or the built-in content when the database is not
// reachable), so it never says anything the site does not say. Refreshes every hour.
export const revalidate = 3600;

const clean = (s: string) => s.replace(/\*/g, "").replace(/\s+/g, " ").trim();

type Faq = { question: string; answer: string };

// every object anywhere in the page content that has a text `question` and a text `answer` (the FAQ sections of all kinds), first one wins
function collectFaqs(node: unknown, out: Map<string, Faq>, seen = new Set<unknown>()) {
  if (!node || typeof node !== "object" || seen.has(node)) return;
  seen.add(node);
  if (Array.isArray(node)) {
    for (const n of node) collectFaqs(n, out, seen);
    return;
  }
  const o = node as Record<string, unknown>;
  if (typeof o.question === "string" && typeof o.answer === "string") {
    const question = clean(o.question);
    const answer = clean(o.answer);
    if (question && answer && !out.has(question.toLowerCase())) out.set(question.toLowerCase(), { question, answer });
  }
  for (const v of Object.values(o)) collectFaqs(v, out, seen);
}

// the first-screen text of the page: the first section whose type is a hero, its heading and text
function heroText(content: unknown): string {
  const sections = (content as { sections?: unknown } | null)?.sections;
  if (!Array.isArray(sections)) return "";
  const hero = sections.find((s) => typeof (s as { type?: unknown })?.type === "string" && /hero/i.test((s as { type: string }).type)) as
    | { data?: Record<string, unknown> }
    | undefined;
  const data = hero?.data;
  if (!data) return "";
  const parts = [data.heading, data.text].filter((v): v is string => typeof v === "string").map(clean).filter(Boolean);
  return parts.map((p, n) => (n < parts.length - 1 && !/[.!?:]$/.test(p) ? `${p}.` : p)).join(" ");
}

export async function GET() {
  const base = siteBase() || "http://localhost:1010";
  const bySlugPath = new Map<string, PageSlug>(Object.entries(PAGES).map(([slug, p]) => [p.path as string, slug as PageSlug]));
  const pageData = async (slug: PageSlug): Promise<{ description: string; content: unknown }> => {
    try {
      const v = await getPublishedPage(slug);
      return { description: clean(v.description), content: v.content };
    } catch {
      return { description: clean(PAGES[slug].defaultSeo.description), content: PAGES[slug].defaultContent };
    }
  };
  const link = async (label: string, path: string) => {
    const slug = bySlugPath.get(path);
    const d = slug ? (await pageData(slug)).description : "";
    const url = path.startsWith("http") ? path : `${base}${path}`;
    return `- [${label}](${url})${d ? `: ${d}` : ""}`;
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
    `Short version: ${base}/llms.txt`,
    "",
  );

  out.push("## Questions and answers about We3vision", "");
  for (const f of homeFaq(site)) {
    const url = f.href.startsWith("http") ? f.href : `${base}${f.href}`;
    out.push(`### ${clean(f.question)}`, "", clean(f.answer), "", `Source: ${url}`, "");
  }

  const printed = new Set<string>();
  for (const g of SERVICE_GROUPS) {
    for (const i of g.items) {
      if (i.href.startsWith("http") || printed.has(i.href)) continue;
      printed.add(i.href);
      out.push(`## ${i.label}`, "", `URL: ${base}${i.href}`, "");
      const slug = bySlugPath.get(i.href);
      if (!slug) continue;
      const d = await pageData(slug);
      if (d.description) out.push(d.description, "");
      const hero = heroText(d.content);
      if (hero && hero !== d.description) out.push(hero, "");
      const faqs = new Map<string, Faq>();
      collectFaqs(d.content, faqs);
      for (const f of faqs.values()) out.push(`### ${f.question}`, "", f.answer, "");
    }
  }

  out.push("## Products", "");
  for (const p of PRODUCT_LINKS) out.push(p.href.startsWith("http") ? `- [${p.label}](${p.href}): A software product from We3vision.` : await link(p.label + (p.soon ? " (coming soon)" : ""), p.href));
  out.push("");

  out.push("## Industrial training", "");
  for (const t of TRAINING_LINKS) out.push(await link(t.label, t.href));
  out.push("");

  if (posts.length) {
    out.push("## Articles", "");
    for (const p of [...posts].sort((a, b) => b.date.localeCompare(a.date))) out.push(`- [${p.title}](${base}/blog/${p.slug}): ${clean(p.summary)}`);
    out.push("");
  }

  out.push("## Contact", "");
  for (const c of cards) out.push(`- ${c.title}: ${c.lines.join(", ")}`);
  out.push(`- Contact form: ${base}/contact`, "");

  return new Response(out.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" } });
}
