import { PROJECT_GROUPS } from "@/lib/project-groups";
import { slugify } from "../sanitize";
import type { ContentTypeDef, DraftData } from "../types";

// Registry entry: a portfolio project, which is also how a case study is published (the long description holds the story: goal, what we did,
// result). The fields are the fields of the admin form (Admin > Projects, components/admin/project-form.tsx), the limits are the limits of
// createProject (src/actions/projects.ts; a test checks that they still match).

const str = (v: unknown) => (typeof v === "string" ? v : "");
const list = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

export const portfolioType: ContentTypeDef = {
  key: "portfolio",
  label: "Portfolio project / case study",
  description:
    "A finished project for the We3vision Portfolio page (www.we3vision.com/portfolio). Each project gets its own page with a cover picture, a story and more pictures. Use it for portfolio items and for case studies (the client's goal, what We3vision did, the result).",
  titleField: "title",
  askFirst: [
    "The project name and the client (only if the client allows its name to be shown)",
    "What We3vision did: web, app, brand identity, AI, 3D, UI/UX, SEO ... (the small label)",
    "The client's goal or problem, what the team built, and the real result (only facts and numbers the user gives)",
    "The pictures: the cover and more pictures of the work (uploaded by the user, never invented)",
    "Where it is shown: the Brand Design slider and the Portfolio page, or the Portfolio page only",
  ],
  fields: [
    { name: "title", label: "Name of the project", kind: "text", min: 2, max: 120, required: true, help: "The project name as it is shown, for example the client and what was made. No hype words.", example: "Nirmal Jewellers brand identity" },
    { name: "category", label: "What we did (small label)", kind: "text", max: 60, help: "One short label, for example \"Brand identity\", \"Website\", \"Mobile app\".", example: "Brand identity" },
    { name: "summary", label: "Short description", kind: "text", max: 200, help: "1–2 plain sentences for the card and the search result: what the project is and what We3vision did.", example: "A new logo, colours and stationery for a jewellery brand in Surat." },
    { name: "content", label: "Full description (project page)", kind: "longtext", max: 8000, help: "The story in plain paragraphs separated by an empty line: 1) the client's goal or problem, 2) what We3vision did and how, 3) the result. No headings, bullets, HTML or Markdown. Only real facts: never invent numbers, quotes or results." },
    { name: "cover", label: "Main picture (the cover)", kind: "image", help: "The cover shown on cards and sliders. Upload the user's picture with upload_image and use the returned /media/<id> link. If left out, the first picture below is used." },
    { name: "images", label: "More pictures", kind: "list", maxItems: 30, itemMax: 500, help: "Links of more pictures of the project, in the order they should appear: /media/<id> links from upload_image or https:// addresses. Never invent picture addresses." },
    { name: "group", label: "Where it is shown", kind: "enum", options: PROJECT_GROUPS.map((g) => g.value), default: "brand", help: `"brand" = ${PROJECT_GROUPS[0].label}; "portfolio" = ${PROJECT_GROUPS[1].label}. Use "brand" for brand and identity work, otherwise "portfolio".` },
  ],
  guidelines: [
    "Voice: clear, specific and proud but honest, like a studio showing its work to a possible client. Short sentences, no hype words (\"stunning\", \"revolutionary\").",
    "Never invent facts: no made-up client names, numbers, results, awards or testimonials. Use only what the user told you. If a detail is unknown, leave it out or ask.",
    "Case study shape for `content` (2–5 short paragraphs): the client and their goal or problem; what We3vision did and the main choices; the result. Plain text only, no headings or bullets.",
    "Pictures: only pictures the user uploaded (upload_image) or gave as an https:// address. The cover is the main picture; `images` are the extra ones.",
    "Formatting: plain text only, no HTML or Markdown.",
    "Before sending: check list_existing_content so the same project is not added twice.",
  ],
  example: {
    title: "Nirmal Jewellers brand identity",
    category: "Brand identity",
    summary: "A new logo, colours and stationery for a jewellery brand in Surat.",
    content: "Nirmal Jewellers wanted a look that felt both traditional and fresh for a younger customer.\n\nWe3vision designed a new logo, a colour palette and the stationery set, and wrote a short brand guide for the shop team.",
    group: "brand",
  },
  livePath: (slug) => `/portfolio/${slug}`,
  listPath: "/portfolio",
  toFormValues: (d) => ({ ...portfolioType.toAdminInput(d, true) }),
  fromFormValues: (v) => ({
    title: v.title,
    category: v.category,
    summary: v.summary,
    content: v.content,
    cover: v.cover,
    images: list(v.images),
    group: v.group,
  }),
  slugOf: (d) => slugify(str(d.title), 60) || "project",
  toAdminInput: (d, publish): Record<string, unknown> => ({
    title: d.title,
    category: d.category,
    summary: d.summary,
    content: d.content,
    cover: d.cover,
    images: list(d.images),
    group: d.group,
    published: publish,
  }),
  preview: (d: DraftData) =>
    [
      `# ${str(d.title)}`,
      str(d.category) ? `_${str(d.category)}_` : "",
      str(d.summary) ? `> ${str(d.summary)}` : "",
      str(d.content),
      `_Address after approval: /portfolio/${portfolioType.slugOf(d)}_`,
    ]
      .filter(Boolean)
      .join("\n\n"),
};
