import { TILES, DEFAULT_TILE, parseFaq, parseTags } from "@/lib/blog-shared";
import { slugify } from "../sanitize";
import type { ContentTypeDef, DraftData } from "../types";

// Registry entry: a blog article. The fields are the fields of the admin form (Admin > Blog > New article, components/admin/blog-form.tsx),
// the limits are the limits of createBlogPost (src/actions/blog.ts; a test checks that they still match).

const str = (v: unknown) => (typeof v === "string" ? v : "");
const list = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

export const blogType: ContentTypeDef = {
  key: "blog",
  label: "Blog article",
  description:
    "An article for the We3vision blog (www.we3vision.com/blog). Use it for thought-leadership, how-to and industry articles about web, app, AI, metaverse, UI/UX, SEO, CRM, animation and brand design.",
  titleField: "title",
  askFirst: [
    "The topic and the angle: what should the reader learn or decide?",
    "Who the article is for (for example business owners, startups, one industry)",
    "The main keyword or phrase to rank for, and related keywords",
    "The tone and the length wanted (default: practical and clear, 800–1500 words)",
    "Facts, numbers, links or examples the article must include (nothing is invented)",
    "Which We3vision service the article should lead to, if any",
    "The cover picture: the user's own picture, or let a branded cover be drawn",
  ],
  autoCover: { field: "cover", input: (d) => ({ title: str(d.title), category: str(d.category), tile: str(d.tile) }) },
  fields: [
    { name: "title", label: "Title", kind: "text", max: 140, min: 10, required: true, help: "The headline (the page H1). Include the main keyword near the start, make it specific and honest.", example: "7 Trends Shaping 3D Web Design in 2026" },
    { name: "category", label: "Topic (small label)", kind: "text", max: 40, help: "One short topic label shown on the Blog page. Reuse an existing one (see list_blog_posts) such as \"Design\" or \"AI/ML\" when it fits.", example: "Design" },
    { name: "summary", label: "Summary", kind: "text", max: 300, help: "1–2 sentences shown on the card and used as the description in search results. Aim for 140–160 characters, plain words, no clickbait.", example: "How WebGL, scroll-driven scenes and lighter 3D models are changing what a business website can feel like." },
    { name: "cover", label: "Cover picture", kind: "image", help: "Optional. Leave it out and a branded cover (title and topic on a dark violet drawing, in the picture shape you chose) is drawn automatically when the draft is sent; call generate_cover_image first to see it. To use the user's own picture, upload it with upload_image and use the returned /media/<id> link." },
    { name: "tile", label: "Shape of the picture on the Blog page", kind: "enum", options: TILES.map((t) => t.value), default: DEFAULT_TILE, help: `The crop of the cover on the Blog page: ${TILES.map((t) => `${t.value} (${t.size})`).join(", ")}. Use "portrait" unless the picture needs another shape.` },
    {
      name: "content",
      label: "Article",
      kind: "markup",
      max: 60000,
      required: true,
      syntax: "Light markup only, no HTML and no #-title: start a section with `## Heading`, a bullet with `- point`, and separate paragraphs with an empty line.",
      help: "The full article body. Use `## ` for section headings (the title is already the H1), short paragraphs, and bullets where they help. Typical length 800–1500 words.",
    },
    { name: "tags", label: "Tags", kind: "list", maxItems: 12, itemMax: 40, help: "3–8 short keywords (no #). Example: [\"3D web\", \"WebGL\", \"UI/UX\"]." },
    { name: "faq", label: "FAQ", kind: "qa", maxItems: 10, questionMax: 150, answerMax: 400, help: "3–6 questions readers really ask, with direct 1–3 sentence answers. They also become FAQ structured data for search." },
    { name: "date", label: "Date", kind: "date", default: "today", help: "Publish date shown on the article. Leave out to use today." },
  ],
  guidelines: [
    "Voice: clear, confident and practical, like a studio explaining its craft to a business owner. Short sentences. No hype words (\"revolutionary\", \"game-changing\"), no filler openings.",
    "Never invent facts: no made-up statistics, client names, case-study results, quotes or testimonials about We3vision. Mention We3vision services only as they really are (web, app, AI/ML, metaverse, UI/UX, SEO, CRM, animation, 3D, brand design). When a number is needed, say where it comes from or leave it out.",
    "SEO: main keyword in the title (near the start), the summary and the first paragraph. One idea per `## ` section, descriptive headings. Do not stuff keywords.",
    "Structure: 1 short intro paragraph, 4–8 `## ` sections, a short conclusion with a gentle next step (for example talking to the We3vision team). Add 3–6 FAQ items that are not repeated in the body.",
    "Formatting: no HTML, no Markdown links, images or tables (they are not rendered). Only `## ` headings, `- ` bullets and paragraphs. Do not start the body with the title.",
    "Cover picture: on the Blog page the cover is the only thing seen, so every article needs one. If the user gave a picture, upload it with upload_image. If not, do nothing or call generate_cover_image (it shows you the cover): a branded cover is drawn by code, and one is also drawn automatically when you send. Never invent picture addresses and never use pictures from the internet.",
    "Language: English (Indian business audience). Use US or UK spelling consistently.",
    "Before sending: check list_blog_posts so the topic and title are not a duplicate, and mention related existing articles if they fit.",
  ],
  example: {
    title: "How AI Can Speed Up Your Customer Support",
    category: "AI/ML",
    summary: "A practical look at where AI chat and automation help a support team, and where a human should still answer.",
    tile: "portrait",
    content:
      "Support teams answer the same ten questions all day. AI can take that load, if it is set up with care.\n\n## Start with the repeat questions\n\nList the questions your team answers most often. These are the best first candidates for automation.\n\n## Keep a human in the loop\n\n- Hand over to a person when the customer is upset\n- Let the team review the answers every week\n\n## What to do next\n\nStart small, measure the results, and grow from there.",
    tags: ["AI", "customer support", "automation"],
    faq: [{ question: "Can AI replace a support team?", answer: "No. It handles repeat questions well, while people handle special cases and sensitive conversations." }],
  },
  livePath: (slug) => `/blog/${slug}`,
  listPath: "/blog",
  toFormValues: (d) => {
    const { published: _published, ...form } = blogType.toAdminInput(d, true);
    void _published;
    return form;
  },
  fromFormValues: (v) => ({
    title: v.title,
    category: v.category,
    summary: v.summary,
    cover: v.cover,
    tile: v.tile,
    content: v.content,
    tags: parseTags(str(v.tags)),
    faq: parseFaq(str(v.faq)),
    date: v.date,
  }),
  slugOf: (d) => slugify(str(d.title), 80) || "article",
  toAdminInput: (d, publish): Record<string, unknown> => ({
    title: d.title,
    category: d.category,
    summary: d.summary,
    cover: d.cover,
    tile: d.tile,
    content: d.content,
    // the admin form keeps these two as text: tags "a, b", FAQ "Question | Answer" per line (a "|" or a line break cannot be inside)
    tags: list(d.tags).map((t) => t.replace(/[,\n]/g, " ")).join(", "),
    faq: (Array.isArray(d.faq) ? (d.faq as { question: string; answer: string }[]) : []).map((q) => `${q.question.replace(/\|/g, "/")} | ${q.answer}`).join("\n"),
    date: d.date,
    published: publish,
  }),
  preview: (d: DraftData) => {
    const tags = list(d.tags);
    const faq = (Array.isArray(d.faq) ? d.faq : []) as { question: string; answer: string }[];
    return [
      `# ${str(d.title)}`,
      `_${str(d.category) || "No topic"} · ${str(d.date)} · picture shape: ${str(d.tile)}${d.cover ? ` · cover: ${str(d.cover)}` : " · no cover yet (a branded one is drawn automatically when you send)"}_`,
      str(d.summary) ? `> ${str(d.summary)}` : "",
      str(d.content),
      tags.length ? `**Tags:** ${tags.join(", ")}` : "",
      faq.length ? `## FAQ\n\n${faq.map((q) => `**${q.question}**\n${q.answer}`).join("\n\n")}` : "",
      `_Address after approval: /blog/${blogType.slugOf(d)}_`,
    ]
      .filter(Boolean)
      .join("\n\n");
  },
};
