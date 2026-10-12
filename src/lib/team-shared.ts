// What the Team page and the admin panel (Team) both need: the shape of a person of the office and how the input of the admin panel is cleaned.
// No server-only imports here: the preview of the admin panel draws the office from the same data in the browser.

export type TeamPerson = {
  id: string;
  name: string;
  role: string;
  /** the department: the people of one department sit in the same corner of the office */
  dept: string;
  bio: string;
  /** a link (/media/<id> for an uploaded picture); without it the initials are shown */
  photo: string;
  linkedin: string;
  /** the avatar is drawn as a woman */
  girl: boolean;
  /** the seat in the office (see lib/team-seats.ts); -1 = automatic: in the order of the list */
  seat: number;
};

/** How many people one corner of the office holds (4 at the long table, 4 at the meeting table, 1 at the board). More people get a second corner. */
export const CORNER_CAPACITY = 9;
export const MAX_PEOPLE = 80;

const text = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "");
const safeLink = (v: unknown) => {
  const s = text(v, 500);
  return s === "" || /^(\/(?!\/)|https?:\/\/)/i.test(s) ? s : "";
};

/** Untrusted input -> a clean list (a person without a name is dropped). */
export function cleanPeople(input: unknown): Omit<TeamPerson, "id">[] {
  if (!Array.isArray(input)) return [];
  const out: Omit<TeamPerson, "id">[] = [];
  for (const raw of input.slice(0, MAX_PEOPLE)) {
    const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    const name = text(r.name, 60);
    if (!name) continue;
    out.push({
      name,
      role: text(r.role, 70),
      dept: text(r.dept, 30) || "Team",
      bio: typeof r.bio === "string" ? r.bio.trim().slice(0, 260) : "",
      photo: safeLink(r.photo),
      linkedin: safeLink(r.linkedin),
      girl: r.girl === true || r.girl === "yes",
      seat: typeof r.seat === "number" && Number.isInteger(r.seat) && r.seat >= 0 && r.seat < 100 ? r.seat : -1,
    });
  }
  return out;
}

/** The departments in the order of their first person, each with its people. */
export function byDepartment<T extends { dept: string }>(people: T[]): { name: string; people: T[] }[] {
  const out: { name: string; people: T[] }[] = [];
  const idx = new Map<string, number>();
  for (const p of people) {
    const name = p.dept.trim() || "Team";
    let i = idx.get(name);
    if (i === undefined) {
      i = out.length;
      idx.set(name, i);
      out.push({ name, people: [] });
    }
    out[i].people.push(p);
  }
  return out;
}

/**
 * The place of a department in the hierarchy of the office: the department called Leadership (or CXO) sits in the middle at the top, the department
 * called Managers is the table under it, and every other department is a team in a row under the managers.
 */
export function tierOf(dept: string): "cxo" | "mgr" | "team" {
  const d = dept.trim();
  if (/^(leadership|cxo|cxos|management)$/i.test(d)) return "cxo";
  if (/^managers?$/i.test(d)) return "mgr";
  return "team";
}
