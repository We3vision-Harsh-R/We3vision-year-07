// INDUSTRIAL TRAINING COURSES AND FEES (owner, 2026-11-12): managed in Admin > Industrial Training. A course is a technology domain (Web Development, AI / Machine Learning ...)
// with its own fee for the 3, 6 and 9 month training. No server code here: the admin screen (client) and the pages both import it.

export type Fees = { m3: string; m6: string; m9: string };
export type Course = { id: string; name: string; area: string; learn: string; fees: Fees; show: boolean };

export const MAX_COURSES = 60;
export const AREAS = ["Development", "Creatives", "E-commerce", "Marketing", "Other"];

const c = (id: string, name: string, area: string, learn: string): Course => ({ id, name, area, learn, fees: { m3: "", m6: "", m9: "" }, show: true });

/** the starting list: the domains of our services. The fees are empty until they are typed in Admin > Industrial Training. */
export const DEFAULT_COURSES: Course[] = [
  c("web", "Web Development", "Development", "HTML, CSS and JavaScript, then React or Next.js, back-end work with Node.js or PHP, and databases."),
  c("app", "App Development", "Development", "Phone apps for Android and iPhone with Flutter, React Native, Kotlin or Swift."),
  c("software", "Software Development", "Development", "Back-end systems, APIs, databases and testing, the way business software is built."),
  c("ai", "AI / Machine Learning", "Development", "Python, data handling, machine learning models, chatbots and AI tools such as OpenAI and TensorFlow."),
  c("crm", "CRM Development", "Development", "Customer and sales systems: forms, pipelines, automation and connecting them to other software."),
  c("metaverse", "Metaverse, VR and AR", "Development", "3D worlds and VR / AR experiences with Unity and Unreal Engine."),
  c("uiux", "UI/UX Design", "Creatives", "User research, wireframes, clickable prototypes and clean, usable interfaces."),
  c("graphic", "Graphic and Brand Design", "Creatives", "Logos, brand identity, social and print design, with the guidelines that keep a brand consistent."),
  c("model", "2D/3D Modeling and Animation", "Creatives", "3D models, 2D and 3D animation and video editing."),
  c("ecom", "E-commerce (Shopify and WordPress)", "E-commerce", "Online stores, themes, plugins and custom features on Shopify, WordPress and WooCommerce."),
  c("marketing", "Digital Marketing", "Marketing", "SEO, Meta ads, content and how to measure what works."),
];

const text = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

/** makes any saved value safe: unknown fields are dropped, texts are trimmed and cut, at most MAX_COURSES, ids are unique */
export function cleanCourses(input: unknown): Course[] {
  const list = Array.isArray(input) ? input : [];
  const seen = new Set<string>();
  const out: Course[] = [];
  for (const raw of list.slice(0, MAX_COURSES)) {
    const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    const name = text(o.name, 80);
    if (!name) continue;
    let id = text(o.id, 40).replace(/[^a-zA-Z0-9_-]/g, "") || "c" + Math.random().toString(36).slice(2, 8);
    while (seen.has(id)) id += "x";
    seen.add(id);
    const f = (o.fees && typeof o.fees === "object" ? o.fees : {}) as Record<string, unknown>;
    out.push({
      id,
      name,
      area: text(o.area, 40) || "Other",
      learn: text(o.learn, 300),
      fees: { m3: text(f.m3, 60), m6: text(f.m6, 60), m9: text(f.m9, 60) },
      show: o.show !== false,
    });
  }
  return out;
}
