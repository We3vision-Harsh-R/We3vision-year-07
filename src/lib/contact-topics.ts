// The topics of the Contact page (owner, 2026-11-27): Project, Partner, Internship and job, Industry training. One list shared by the page, the form and
// the server action (actions/leads.ts), so the form and the check on the server always agree. No database change: the topic and the extra answers are
// written at the top of the lead's message, so they show in Admin > Leads and in the new-lead mail.

export type TopicId = "project" | "partner" | "career" | "training";

export type Extra = {
  key: string;
  label: string;
  kind: "select" | "text" | "checks";
  /** the choices of a select / checks (the "domain" select is filled from Admin > Industrial Training) */
  options?: string[];
  placeholder?: string;
};

export type Topic = {
  id: TopicId;
  label: string;
  /** one short line under the label on the topic card */
  short: string;
  /** the heading and the paragraph of the panel */
  title: string;
  text: string;
  messageLabel: string;
  placeholder: string;
  button: string;
  extras: Extra[];
  links: { label: string; href: string }[];
  /** svg path (24x24, stroke) */
  icon: string;
};

/** the ways a company can partner with We3vision (the Partner program section; the same list is the "ways" choice of the Partner form) */
export const PARTNER_WAYS: { id: string; title: string; text: string }[] = [
  { id: "referral", title: "Referral partner", text: "You introduce a business that needs a website, an app, AI or branding, and we look after the project." },
  { id: "agency", title: "Agency and delivery partner", text: "You bring the client and the idea, our team designs, builds and ships the work for you." },
  { id: "white-label", title: "White-label partner", text: "We build under your brand name, so you can offer web, app, AI and design services without a big team." },
  { id: "technology", title: "Technology partner", text: "Your product, platform or tool works together with what we build, and both of us can offer more to a client." },
  { id: "training", title: "College and training partner", text: "Colleges and institutes send students to our industry training and internships, and learn with real projects." },
  { id: "marketing", title: "Marketing and co-brand partner", text: "Joint campaigns, events, content and offers that bring both brands in front of new customers." },
  { id: "other", title: "Another way", text: "Have a different idea? Tell us and we will find out together if it can work." },
];

export const TOPICS: Topic[] = [
  {
    id: "project",
    label: "Project",
    short: "Websites, apps, AI, VR, brands",
    title: "Contact us for a project",
    text: "Tell us what you want to build. The We3vision team reads every message and writes back with the next step.",
    messageLabel: "Your message",
    placeholder: "Tell us about your idea",
    button: "Send message",
    extras: [
      { key: "service", label: "What do you need?", kind: "select", options: ["Website", "App", "AI solution", "Metaverse / VR", "Brand and design", "Marketing", "Something else"] },
      { key: "company", label: "Company (optional)", kind: "text", placeholder: "Your company name" },
    ],
    links: [{ label: "See our services", href: "/#services" }],
    icon: "M12 3l2.4 5.2 5.6.7-4.1 3.9 1.1 5.6L12 15.6 7 18.4l1.1-5.6L4 8.9l5.6-.7z",
  },
  {
    id: "partner",
    label: "Partner",
    short: "Work with us, grow together",
    title: "Contact us to become a partner",
    text: "Choose the ways you would like to work with We3vision and tell us about your company. Our team will write back to talk about how it can work.",
    messageLabel: "Your message",
    placeholder: "Who are you, and how would you like to work with us?",
    button: "Send partner request",
    extras: [
      { key: "ways", label: "How would you like to partner?", kind: "checks", options: PARTNER_WAYS.map((w) => w.title) },
      { key: "company", label: "Company or college (optional)", kind: "text", placeholder: "Name of your company or college" },
    ],
    links: [{ label: "See the partner program", href: "#partner-program" }],
    icon: "M8 12l3 3 5-6M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0",
  },
  {
    id: "career",
    label: "Internship and job",
    short: "Join the We3vision team",
    title: "Contact us for an internship or a job",
    text: "Look at the open positions first. If you do not see your role, or you have a question, write to our HR team here.",
    messageLabel: "Your message",
    placeholder: "Tell us about your skills and the work you want to do",
    button: "Send to HR",
    extras: [
      { key: "looking", label: "I am looking for", kind: "select", options: ["An internship", "A job", "Not sure yet"] },
      { key: "role", label: "Role or domain (optional)", kind: "text", placeholder: "For example Web development, Graphic design" },
    ],
    links: [{ label: "See open positions", href: "/careers" }],
    icon: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  },
  {
    id: "training",
    label: "Industry training",
    short: "3, 6 and 9 month training",
    title: "Contact us for industry training",
    text: "Pick the domain and the length you are interested in. We will send the details and the fee, and answer your questions.",
    messageLabel: "Your message",
    placeholder: "Your college or work, and what you want to learn",
    button: "Ask about training",
    extras: [
      { key: "domain", label: "Domain", kind: "select", options: [] },
      { key: "months", label: "Length", kind: "select", options: ["3 months", "6 months", "9 months", "Not sure yet"] },
    ],
    links: [{ label: "See domains and fees", href: "/industrial-training/6-month#fees" }],
    icon: "M3 9l9-5 9 5-9 5zM7 11.5V16c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4.5",
  },
];

export const TOPIC_IDS = TOPICS.map((t) => t.id) as TopicId[];

/** what the server writes at the top of the message: "Topic: ..." plus one "Label: value" line for each extra answer (only the keys of that topic) */
export function topicHeader(topicId: string, get: (key: string) => string[]): string {
  const t = TOPICS.find((x) => x.id === topicId);
  if (!t) return "";
  const clean = (s: string) => s.replace(/[<>{}\[\]\\|^~`]/g, "").replace(/\s+/g, " ").trim().slice(0, 120);
  const lines = [`Topic: ${t.label}`];
  for (const e of t.extras) {
    const v = get(e.key)
      .map(clean)
      .filter(Boolean)
      .slice(0, 8)
      .join(", ");
    if (v) lines.push(`${e.label.replace(/ \(optional\)$/, "")}: ${v}`);
  }
  return lines.join("\n").slice(0, 700);
}
