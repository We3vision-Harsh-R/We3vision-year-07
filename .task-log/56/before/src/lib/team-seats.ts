// The seats of the office on the Team page: where the chairs are in a team corner, at the managers' table and at the desk of the leaders, and
// how the people are put on them. A person can be given a seat in the admin panel (Team, "Seat"); everybody without a seat sits down in the
// order of the list, on the chairs that are still free. No server-only imports: the office and the seat picker of the admin panel both use it.

export type SeatKind = "w" | "m" | "p" | "b" | "h" | "s";
export type Seat = { x: number; y: number; rot: number; kind: SeatKind; i: number; label: string };

// ---- a team corner (the canvas of the About office, 300 x 226): one island = the long table, the meeting table and the board ----
export const TZW = 300;
export const TZH = 226;
export const WORK = [
  { x: 48, y: 150, rot: 0, lx: 14, ly: 7 },
  { x: 130, y: 150, rot: 0, lx: 88, ly: 7 },
  { x: 48, y: 210, rot: 180, lx: 14, ly: 23 },
  { x: 130, y: 210, rot: 180, lx: 88, ly: 23 },
];
export const MEET = [
  { x: 232, y: 108, rot: 0 },
  { x: 274, y: 150, rot: 90 },
  { x: 232, y: 192, rot: 180 },
  { x: 190, y: 150, rot: -90 },
];
/** the 9 seats of one island, in the order in which people sit down when nobody has chosen a seat */
export const TEAM_SEATS: Seat[] = [
  { kind: "w", i: 0, ...WORK[0], label: "Long table, top left" },
  { kind: "w", i: 1, ...WORK[1], label: "Long table, top right" },
  { kind: "w", i: 2, ...WORK[2], label: "Long table, bottom left" },
  { kind: "w", i: 3, ...WORK[3], label: "Long table, bottom right" },
  { kind: "m", i: 1, ...MEET[1], label: "Meeting table, right" },
  { kind: "m", i: 3, ...MEET[3], label: "Meeting table, left" },
  { kind: "m", i: 0, ...MEET[0], label: "Meeting table, top" },
  { kind: "m", i: 2, ...MEET[2], label: "Meeting table, bottom" },
  { kind: "p", i: 0, x: 90, y: 122, rot: 180, label: "At the wall board" },
];
export const POD_SEATS = 9;
/** islands in one corner (a bigger team continues in a second corner of the same name) */
export const MAX_PODS = 6;

// ---- the managers' table (340 x 176): three chairs on each long side and the main chair at the end ----
export const MZW = 340;
export const MZH = 176;
export const MGR_SEATS: Seat[] = [
  { kind: "s", i: 0, x: 80, y: 50, rot: 0, label: "Table, top 1" },
  { kind: "s", i: 1, x: 80, y: 126, rot: 180, label: "Table, bottom 1" },
  { kind: "s", i: 2, x: 140, y: 50, rot: 0, label: "Table, top 2" },
  { kind: "s", i: 3, x: 140, y: 126, rot: 180, label: "Table, bottom 2" },
  { kind: "s", i: 4, x: 200, y: 50, rot: 0, label: "Table, top 3" },
  { kind: "s", i: 5, x: 200, y: 126, rot: 180, label: "Table, bottom 3" },
  { kind: "h", i: 6, x: 304, y: 88, rot: -90, label: "Main chair (the end of the table)" },
];
export const MGR_CAP = MGR_SEATS.length;

// ---- the desk of the leaders: boss chairs in a row ----
export const CXO_CAP = 5;
export const CXO_MIN = 3;
export const CSEAT = 150;
export const CZH = 116;

/**
 * Puts people on `slots` seats: the people who have a seat of their own (seat >= 0) first, then everybody else on the free seats in the
 * order of the list. Two people with the same seat: the second one is seated like a person without a seat.
 */
export function placeInSeats<T extends { seat: number }>(people: T[], slots: number): (T | null)[] {
  const out: (T | null)[] = Array.from({ length: slots }, () => null);
  const rest: T[] = [];
  for (const p of people) {
    if (p.seat >= 0 && p.seat < slots && out[p.seat] === null) out[p.seat] = p;
    else rest.push(p);
  }
  for (const p of rest) {
    const i = out.indexOf(null);
    if (i >= 0) out[i] = p;
  }
  return out;
}

/** how many islands a team needs: one for every 9 people, and enough for the highest seat that was chosen */
export function podCount(people: { seat: number }[]): number {
  const top = people.reduce((m, p) => (p.seat >= 0 && p.seat < MAX_PODS * POD_SEATS ? Math.max(m, p.seat) : m), -1);
  return Math.min(MAX_PODS, Math.max(1, Math.ceil(people.length / POD_SEATS), Math.floor(top / POD_SEATS) + 1));
}

/** how many boss chairs the desk of the leaders has: the people, the highest chosen chair, at least three */
export function cxoSlots(people: { seat: number }[]): number {
  const top = people.reduce((m, p) => (p.seat >= 0 && p.seat < CXO_CAP ? Math.max(m, p.seat) : m), -1);
  return Math.min(CXO_CAP, Math.max(CXO_MIN, people.length, top + 1));
}
