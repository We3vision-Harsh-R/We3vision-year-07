import { WORK_MODES, WORK_TYPES } from "@/lib/careers-shared";
import { slugify } from "../sanitize";
import type { ContentTypeDef, DraftData } from "../types";

// Registry entry: a job opening. The fields are the fields of the admin form (Admin > Careers > Jobs, components/admin/job-form.tsx),
// the limits are the limits of saveJob (src/actions/jobs.ts; a test checks that they still match).

const str = (v: unknown) => (typeof v === "string" ? v : "");
const list = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

export const careerType: ContentTypeDef = {
  key: "career",
  label: "Job opening",
  description: "A job opening for the Careers page (www.we3vision.com/careers). Each opening gets its own page with an apply form and Google JobPosting data.",
  titleField: "title",
  askFirst: [
    "The job title and the team",
    "Years of experience wanted, and the must-have skills and tools",
    "Location, job type (full-time, part-time, internship, contract) and work mode (on-site, hybrid, remote)",
    "The main responsibilities (5–8 points)",
    "Number of openings and the last day to apply, if there is one",
    "Salary and perks: only if the user says them, never guess",
  ],
  fields: [
    { name: "title", label: "Name of the position", kind: "text", min: 2, max: 100, required: true, help: "The job title only, as candidates search for it. No location, salary or \"urgent\".", example: "Senior UI/UX Designer" },
    { name: "team", label: "Team", kind: "text", max: 40, help: "The team or department, for example \"Design\", \"Development\", \"Marketing\".", example: "Design" },
    { name: "summary", label: "Short summary", kind: "text", max: 240, help: "One or two lines for the card in the jobs list. What the person will do and why it matters.", example: "Design clear, beautiful interfaces for web and app products used by our clients." },
    { name: "description", label: "About the role", kind: "longtext", max: 6000, required: true, help: "The role in plain paragraphs, separated by an empty line: what the team does, what the person owns, who they work with. No bullet lists here (use the lists below)." },
    { name: "responsibilities", label: "Responsibilities", kind: "list", maxItems: 20, itemMax: 240, help: "5–8 concrete things the person will do, one short sentence each, starting with a verb." },
    { name: "requirements", label: "Requirements", kind: "list", maxItems: 20, itemMax: 240, help: "4–8 must-have skills and experience, one per item. Separate must-haves from nice-to-haves by wording." },
    { name: "perks", label: "Perks and benefits", kind: "list", maxItems: 20, itemMax: 160, help: "Only perks We3vision really offers and the user confirmed. Do not invent benefits. Leave empty if unknown." },
    { name: "location", label: "Location", kind: "text", max: 80, help: "City and country. Default \"Surat, India\".", example: "Surat, India" },
    { name: "workType", label: "Job type", kind: "enum", options: WORK_TYPES, default: "Full-time", help: "Type of employment." },
    { name: "workMode", label: "Work mode", kind: "enum", options: WORK_MODES, default: "On-site", help: "Where the work is done." },
    { name: "experience", label: "Experience", kind: "text", max: 40, help: "Years of experience wanted, for example \"3–5 years\" or \"Fresher\".", example: "3–5 years" },
    { name: "openings", label: "Number of openings", kind: "int", min: 1, max: 99, default: 1, help: "How many people are wanted." },
    { name: "salary", label: "Salary", kind: "text", max: 60, help: "Only if the user gave it, for example \"₹6–9 LPA\". Never guess a salary. Leave out if not given." },
    { name: "closesAt", label: "Last day to apply", kind: "date", default: "", help: "yyyy-mm-dd, or leave out when the job has no closing day." },
  ],
  guidelines: [
    "Voice: direct, warm and specific. Speak to the candidate (\"you will\"). Short sentences, no corporate jargon, no \"rockstar/ninja\" words.",
    "Never invent facts about We3vision or the job: no salary, perks, team size, tools, awards or client names that the user did not give. If a detail is unknown, leave the field out or ask the user.",
    "Be inclusive: do not ask for a gender, age or marital status. Requirements must be about skills and experience.",
    "SEO: the title is the job title only (this is what candidates search, for example \"Senior UI/UX Designer\"). Mention the city in location, not in the title.",
    "Structure: `description` = 2–3 short paragraphs about the role. Put tasks in `responsibilities` and skills in `requirements`, one sentence per item, no numbering and no bullet characters (the site draws the bullets).",
    "Formatting: plain text only, no HTML or Markdown.",
    "Before sending: check list_job_openings so the same position is not posted twice.",
  ],
  example: {
    title: "Senior UI/UX Designer",
    team: "Design",
    summary: "Design clear, beautiful interfaces for web and app products used by our clients.",
    description: "You will lead the design of web and app products from the first sketch to the final screens.\n\nYou will work closely with developers and the client team in Surat.",
    responsibilities: ["Turn briefs into wireframes, flows and polished screens", "Build and maintain design systems in Figma", "Review the finished product with developers before launch"],
    requirements: ["3–5 years of UI/UX design experience", "Strong portfolio of web and app work", "Good command of Figma and prototyping"],
    perks: [],
    location: "Surat, India",
    workType: "Full-time",
    workMode: "On-site",
    experience: "3–5 years",
    openings: 1,
  },
  livePath: (slug) => `/careers/${slug}`,
  listPath: "/careers",
  toFormValues: (d) => ({ id: "", slug: "", ...careerType.toAdminInput(d, true) }),
  fromFormValues: (v) => {
    const lines = (x: unknown) => str(x).split("\n");
    return {
      title: v.title,
      team: v.team,
      summary: v.summary,
      description: v.description,
      responsibilities: lines(v.responsibilities),
      requirements: lines(v.requirements),
      perks: lines(v.perks),
      location: v.location,
      workType: v.workType,
      workMode: v.workMode,
      experience: v.experience,
      openings: Number(v.openings) || 1,
      salary: v.salary,
      closesAt: v.closesAt,
    };
  },
  slugOf: (d) => slugify(str(d.title), 70) || "position",
  toAdminInput: (d, publish): Record<string, unknown> => ({
    title: d.title,
    team: d.team,
    summary: d.summary,
    description: d.description,
    // the admin form keeps the three lists as text with one item on every line
    responsibilities: list(d.responsibilities).join("\n"),
    requirements: list(d.requirements).join("\n"),
    perks: list(d.perks).join("\n"),
    location: d.location,
    workType: d.workType,
    workMode: d.workMode,
    experience: d.experience,
    openings: d.openings,
    salary: d.salary,
    closesAt: d.closesAt,
    active: publish,
  }),
  preview: (d: DraftData) => {
    const bullets = (label: string, items: string[]) => (items.length ? `## ${label}\n\n${items.map((i) => `- ${i}`).join("\n")}` : "");
    const meta = [str(d.team), str(d.location), str(d.workType), str(d.workMode), str(d.experience), `${String(d.openings)} opening(s)`, str(d.salary), d.closesAt ? `apply by ${str(d.closesAt)}` : ""].filter(Boolean);
    return [
      `# ${str(d.title)}`,
      `_${meta.join(" · ")}_`,
      str(d.summary) ? `> ${str(d.summary)}` : "",
      `## About the role\n\n${str(d.description)}`,
      bullets("What you will do", list(d.responsibilities)),
      bullets("What we look for", list(d.requirements)),
      bullets("What we offer", list(d.perks)),
      `_Address after approval: /careers/${careerType.slugOf(d)}_`,
    ]
      .filter(Boolean)
      .join("\n\n");
  },
};
