"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { byDepartment, CORNER_CAPACITY, tierOf, type TeamPerson } from "@/lib/team-shared";
import { GlowEdge } from "../glow-edge";
import { PersonTop } from "../timeline-art";
import { BOARDS } from "../timeline-boards";

// The office of We3vision on the Team page, in the look of the office at the end of the About timeline (floor, walls, plants, tables with
// laptops, chairs, colleagues who walk about), with the real people of the company in it, arranged as the company is built:
//   top      the leaders (the department "Leadership"), at a long desk in the middle of the office, with their title under them
//   middle   the managers (the department "Managers") at a long table (the chair at the end of the table stays empty)
//   bottom   the teams (every other department), a corner each, hanging from a line that comes down from the managers; a big team gets a
//            wider corner (one more table island for every 9 people), so the biggest team is also the widest corner of the office
// Everything is on one screen: there is no camera and no zoom. Point at a person (tap, or tab to the person) and a card opens next to them:
// photo, name, role, a few words and a link. The people come from the admin panel (Team). The same component draws the preview there
// (`preview`, with the person that is being edited marked). The look is the .of-* rules of the About office and the .to2-* rules in globals.css.

const HUES = [300, 340, 20, 60, 100, 200, 250];
const WALKER_TONES = [40, 300, 100, 200, 340];

type Seat = { x: number; y: number; rot: number; kind: "w" | "m" | "p" | "b" | "h" | "s"; i: number };

// ---- a team corner: the canvas of the About office (300 x 226) ----
const TZW = 300;
const TZH = 226;
const WORK = [
  { x: 48, y: 150, rot: 0, lx: 14, ly: 7 },
  { x: 130, y: 150, rot: 0, lx: 88, ly: 7 },
  { x: 48, y: 210, rot: 180, lx: 14, ly: 23 },
  { x: 130, y: 210, rot: 180, lx: 88, ly: 23 },
];
const MEET = [
  { x: 232, y: 108, rot: 0 },
  { x: 274, y: 150, rot: 90 },
  { x: 232, y: 192, rot: 180 },
  { x: 190, y: 150, rot: -90 },
];
// who sits down first: the long table, then the meeting table, the last one stands at the board
const TEAM_SEATS: Seat[] = [
  { kind: "w", i: 0, ...WORK[0] },
  { kind: "w", i: 1, ...WORK[1] },
  { kind: "w", i: 2, ...WORK[2] },
  { kind: "w", i: 3, ...WORK[3] },
  { kind: "m", i: 1, ...MEET[1] },
  { kind: "m", i: 3, ...MEET[3] },
  { kind: "m", i: 0, ...MEET[0] },
  { kind: "m", i: 2, ...MEET[2] },
  { kind: "p", i: 0, x: 90, y: 122, rot: 180 },
];

// ---- the managers' table: a long table with three chairs on each long side; the chair at the right end stays empty (340 x 176) ----
const MZW = 340;
const MZH = 176;
const MGR_CAP = 6;
const MAX_PODS = 6; // islands of tables in one row of the teams
const MGR_SEATS: Seat[] = [
  { kind: "s", i: 0, x: 80, y: 50, rot: 0 },
  { kind: "s", i: 1, x: 80, y: 126, rot: 180 },
  { kind: "s", i: 2, x: 140, y: 50, rot: 0 },
  { kind: "s", i: 3, x: 140, y: 126, rot: 180 },
  { kind: "s", i: 4, x: 200, y: 50, rot: 0 },
  { kind: "s", i: 5, x: 200, y: 126, rot: 180 },
];

// ---- the leaders' desk: boss chairs in a row behind a long desk ----
const CXO_CAP = 5;
const CSEAT = 150; // distance between two leaders (canvas px; the title of a leader stands under him, so it must be wide)
const CZH = 116;

// which wall board suits which team (the boards of timeline-boards.tsx: brand, web, mobile, AI, metaverse, UI/UX, CRM)
const BOARD_RULES: [RegExp, number][] = [
  [/metaverse|vr|xr|unity|3d/i, 4],
  [/ai|crm|erp|software/i, 3],
  [/web|mobile|app/i, 1],
  [/ui|ux|design|brand|graphic/i, 5],
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "W3";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const chunk = <T,>(list: T[], n: number) => Array.from({ length: Math.ceil(list.length / n) }, (_, i) => list.slice(i * n, (i + 1) * n));

type Block = {
  key: string;
  tier: "cxo" | "mgr" | "team";
  name: string;
  people: TeamPerson[];
  tone: number;
  board: number;
  /** a team corner is made of islands of 9 people side by side (a big team has several) */
  pods?: TeamPerson[][];
  boards?: number[];
  cw: number; // canvas size
  ch: number;
  s: number; // scale
  x: number;
  y: number;
};
type Layout = { blocks: Block[]; lines: { x: number; y: number; w: number; h: number }[]; aisles: number[]; height: number };

/** where everything stands: the three tiers one under the other, the teams in one row (or a few) */
function layout(people: TeamPerson[], W: number, headH: number, minH: number): Layout {
  const groups = byDepartment(people);
  const cxoPeople = groups.filter((g) => tierOf(g.name) === "cxo").flatMap((g) => g.people);
  const mgrPeople = groups.filter((g) => tierOf(g.name) === "mgr").flatMap((g) => g.people);
  const teamGroups = groups.filter((g) => tierOf(g.name) === "team");

  // the teams: one corner per department, one island of tables for every 9 people (a big team is a wide corner)
  const used = new Set<number>();
  const nextBoard = () => [0, 1, 2, 3, 4, 5, 6].find((x) => !used.has(x)) ?? used.size % 7;
  const teams: Block[] = [];
  teamGroups.forEach((g, gi) => {
    // a team of more than MAX_PODS islands continues in a second corner of the same name
    chunk(g.people, CORNER_CAPACITY * MAX_PODS).forEach((part, c) => {
      const pods = chunk(part, CORNER_CAPACITY);
      const first = BOARD_RULES.find(([re]) => re.test(g.name))?.[1] ?? -1;
      const boards = pods.map((_, k) => {
        const want = k === 0 ? first : -1;
        const board = want >= 0 && !used.has(want) ? want : nextBoard();
        used.add(board);
        return board;
      });
      teams.push({ key: `${g.name}-${c}`, tier: "team", name: g.name, people: part, pods, boards, tone: HUES[(gi + 2) % HUES.length], board: boards[0], cw: pods.length * TZW, ch: TZH, s: 1, x: 0, y: 0 });
    });
  });

  // the rows of the teams: as few rows as possible, not more than MAX_PODS islands in a row
  const totalPods = teams.reduce((n, t) => n + (t.pods?.length ?? 1), 0);
  const rowsCount = Math.max(1, Math.ceil(totalPods / MAX_PODS));
  const perRowPods = Math.max(1, Math.ceil(totalPods / rowsCount));
  const rows: Block[][] = [];
  let curPods = 0;
  teams.forEach((t) => {
    const n = t.pods?.length ?? 1;
    if (rows.length === 0 || (curPods + n > perRowPods && curPods > 0 && rows.length < rowsCount)) {
      rows.push([]);
      curPods = 0;
    }
    rows[rows.length - 1].push(t);
    curPods += n;
  });
  // one scale for all teams: the widest row decides
  const widest = Math.max(1, ...rows.map((r) => r.reduce((n, t) => n + t.cw, 0) + r.length * 40));
  const sT = clamp((0.92 * W) / widest, 0.42, 1.2);
  const sM = Math.min(sT * 1.12, (0.6 * W) / MZW);
  const sC = Math.min(sT * 1.22, (0.7 * W) / (CXO_CAP * CSEAT));

  const blocks: Block[] = [];
  const lines: Layout["lines"] = [];
  const aisles: number[] = [];
  const LABEL = 26; // room for the name of a team above its corner
  let y = headH + 24;

  // the leaders
  let cxoLineFrom = 0;
  chunk(cxoPeople, CXO_CAP).forEach((part, c) => {
    const cw = Math.max(3, part.length) * CSEAT;
    const b: Block = { key: `cxo-${c}`, tier: "cxo", name: "Leadership", people: part, tone: HUES[0], board: 0, cw, ch: CZH, s: sC, x: (W - cw * sC) / 2, y };
    blocks.push(b);
    cxoLineFrom = y + CZH * sC + 52; // (the titles of the leaders stand under the desk)
    y = cxoLineFrom + 24;
  });
  const hasCxo = cxoPeople.length > 0;

  // the managers
  let mgrBottom = 0;
  chunk(mgrPeople, MGR_CAP).forEach((part, c) => {
    const b: Block = { key: `mgr-${c}`, tier: "mgr", name: "Managers", people: part, tone: HUES[1], board: 0, cw: MZW, ch: MZH, s: sM, x: (W - MZW * sM) / 2, y: y + LABEL };
    blocks.push(b);
    if (hasCxo && c === 0) lines.push({ x: W / 2 - 1, y: cxoLineFrom, w: 2, h: b.y - cxoLineFrom });
    mgrBottom = b.y + MZH * sM;
    y = mgrBottom + 30;
  });
  const hasMgr = mgrPeople.length > 0;
  aisles.push(Math.max(40, headH + 6));

  // the teams, row by row; a line comes down from the tier above to a bus, and from the bus to every team
  const parentBottom = hasMgr ? mgrBottom : hasCxo ? cxoLineFrom : 0;
  let prevBus = 0;
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (row.length === 0) continue;
    const busY = y + 24;
    const topY = busY + 34 + LABEL;
    // the corners share the width of the row in proportion to their size
    const totalW = row.reduce((n, t) => n + t.cw * sT, 0);
    const gap = Math.max(12, Math.min(60, (0.92 * W - totalW) / Math.max(1, row.length - 1)));
    const used0 = totalW + gap * (row.length - 1);
    let x = (W - used0) / 2;
    row.forEach((b) => {
      b.s = sT;
      b.x = x;
      b.y = topY;
      x += b.cw * sT + gap;
      blocks.push(b);
    });
    // the line comes down from the tier above (for the next rows: from the bus of the row above)
    if (r === 0 && parentBottom > 0) lines.push({ x: W / 2 - 1, y: parentBottom, w: 2, h: busY - parentBottom });
    if (r > 0) lines.push({ x: W / 2 - 1, y: prevBus, w: 2, h: busY - prevBus });
    prevBus = busY;
    const xs = row.map((b) => b.x + (b.cw * b.s) / 2);
    const x0 = Math.min(...xs, W / 2);
    const x1 = Math.max(...xs, W / 2);
    lines.push({ x: x0, y: busY - 1, w: x1 - x0, h: 2 });
    xs.forEach((cx) => lines.push({ x: cx - 1, y: busY, w: 2, h: topY - busY }));
    aisles.push(busY + 10);
    y = topY + TZH * sT + 34;
  }

  return { blocks, lines, aisles, height: Math.max(minH, Math.round(y + 20)) };
}

type Props = {
  people: TeamPerson[];
  chip?: string;
  heading?: string;
  intro?: string;
  id?: string;
  /** the preview of the admin panel: a smaller heading, and the person that is being edited is marked */
  preview?: boolean;
  highlightId?: string;
};

export function TeamOffice({ people, chip = "The office", heading = "Meet The Team", intro = "", id, preview = false, highlightId }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const closeT = useRef(0);
  const aisleRef = useRef<number[]>([]);
  const [dim, setDim] = useState({ W: 1200, headH: preview ? 170 : 250 });
  const [hot, setHot] = useState<{ p: TeamPerson; tone: number; left: number; top: number } | null>(null);

  const lay = useMemo(() => layout(people, dim.W, dim.headH, preview ? 480 : 640), [people, dim, preview]);
  useEffect(() => {
    aisleRef.current = lay.aisles;
  }, [lay.aisles]);

  // the width of the box and the height of the heading decide the layout
  useEffect(() => {
    const root = rootRef.current;
    const head = headRef.current;
    if (!root) return;
    const measure = () => {
      const W = root.clientWidth;
      const headH = (head?.offsetHeight ?? 0) + (preview ? 40 : 92);
      if (W < 2) return;
      setDim((d) => (Math.abs(d.W - W) < 1 && Math.abs(d.headH - headH) < 1 ? d : { W, headH }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    if (head) ro.observe(head);
    return () => ro.disconnect();
  }, [preview]);

  // colleagues who get up and walk about the aisles between the tiers
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const walkers = Array.from(root.querySelectorAll<HTMLElement>("[data-walker]"));
    const st = walkers.map(() => ({ init: false, x: 0, y: 0, tx: 0, ty: 0, wait: 0, cur: 0, tgt: 0, speed: 60 }));
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    let raf = 0;
    let last = 0;
    let visible = true;
    const pick = (s: (typeof st)[number], W: number) => {
      const ys = aisleRef.current;
      s.tx = rnd(0.1, 0.9) * W;
      s.ty = ys.length ? ys[Math.floor(Math.random() * ys.length)] : 60;
      s.speed = rnd(46, 64) * clamp(W / 1440, 0.6, 3);
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (!visible) return;
      const W = root.clientWidth;
      walkers.forEach((el, i) => {
        const s = st[i];
        if (!s.init) {
          s.x = rnd(0.1, 0.9) * W;
          const ys = aisleRef.current;
          s.y = ys.length ? ys[i % ys.length] : 60;
          s.wait = rnd(0, 3);
          s.init = true;
          pick(s, W);
        }
        let moving = false;
        if (s.wait > 0) s.wait -= dt;
        else {
          const dx = s.tx - s.x;
          const dy = s.ty - s.y;
          const dist = Math.hypot(dx, dy);
          const step = s.speed * dt;
          if (dist <= step) {
            s.x = s.tx;
            s.y = s.ty;
            s.wait = rnd(1.5, 6);
            pick(s, W);
          } else {
            s.x += (dx / dist) * step;
            s.y += (dy / dist) * step;
            s.tgt = (Math.atan2(dy, dx) * 180) / Math.PI - 90;
            moving = true;
          }
        }
        const diff = ((s.tgt - s.cur + 540) % 360) - 180;
        s.cur += diff * Math.min(1, dt * 5);
        el.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px)`;
        el.dataset.pose = moving ? "walk" : "idle";
        (el.firstElementChild as HTMLElement).style.transform = `rotate(${s.cur.toFixed(1)}deg)`;
      });
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(root);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  // ---- the card of a person ----
  const open = useCallback((p: TeamPerson, tone: number, el: HTMLElement) => {
    window.clearTimeout(closeT.current);
    const root = rootRef.current;
    if (!root) return;
    const r = el.getBoundingClientRect();
    const b = root.getBoundingClientRect();
    // the card stands to the right of the person (to the left when there is no room), and stays inside the office
    const x = r.left + r.width / 2 - b.left;
    const y = r.top + r.height / 2 - b.top;
    const w = 330;
    const right = x + 34 + w <= root.clientWidth - 12;
    setHot({ p, tone, left: right ? x + 34 : Math.max(12, x - 34 - w), top: clamp(y, 120, Math.max(120, root.clientHeight - 120)) });
  }, []);
  const closeSoon = useCallback((ms = 160) => {
    window.clearTimeout(closeT.current);
    closeT.current = window.setTimeout(() => setHot(null), ms);
  }, []);
  useEffect(() => () => window.clearTimeout(closeT.current), []);
  useEffect(() => {
    if (!hot) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setHot(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hot]);

  const hasPeople = people.length > 0;
  const nDepts = byDepartment(people).length;

  const person = (b: Block, p: TeamPerson, seat: Seat, k: number) => {
    const role = seat.kind === "p" ? "pres" : seat.kind === "w" || seat.kind === "b" ? "type" : seat.kind === "m" ? (seat.i === 1 ? "talk" : "meet") : seat.kind === "h" ? "talk" : "meet";
    // the round badge sits behind the person (away from the table)
    const a = (seat.rot * Math.PI) / 180;
    const bx = Math.sin(a) * 27;
    const by = -Math.cos(a) * 27;
    return (
      <button
        key={p.id}
        type="button"
        className="to2-p"
        data-on={hot?.p.id === p.id}
        data-hl={highlightId === p.id}
        style={{ left: seat.x, top: seat.y, "--tone": b.tone } as React.CSSProperties}
        aria-label={`${p.name}${p.role ? ", " + p.role : ""}`}
        onPointerEnter={(e) => e.pointerType === "mouse" && open(p, b.tone, e.currentTarget)}
        onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
        onFocus={(e) => open(p, b.tone, e.currentTarget)}
        onBlur={() => closeSoon(120)}
        onClick={(e) => open(p, b.tone, e.currentTarget)}
      >
        <i className="to2-hit" />
        <span className="to2-badge" style={{ left: bx, top: by }}>
          {p.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.photo} alt="" loading="lazy" />
          ) : (
            <b>{initials(p.name)}</b>
          )}
        </span>
        <span
          className="of-pp"
          data-role={role}
          style={{ left: 0, top: 0, "--rot": `${seat.rot}deg`, "--tone": b.tone + ((k * 17) % 40) - 20, "--d": `${((k * 0.37) % 1.6).toFixed(2)}s` } as React.CSSProperties}
        >
          <PersonTop seated={role !== "pres"} girl={p.girl} />
        </span>
      </button>
    );
  };

  const zoneStyle = (b: Block, z: number): React.CSSProperties => ({ left: b.x, top: b.y, width: b.cw, height: b.ch, transform: `scale(${b.s.toFixed(3)})`, "--zt": b.tone, "--zi": z }) as React.CSSProperties;

  const renderBlock = (b: Block, z: number) => {
    if (b.tier === "cxo") {
      const n = b.people.length;
      const x0 = b.cw / 2 - ((n - 1) * CSEAT) / 2;
      return (
        <div key={b.key} className="of-zone to2-zone to2-cxo" style={zoneStyle(b, z)}>
          <span className="to2-desk" style={{ left: x0 - CSEAT / 2 + 10, width: n * CSEAT - 20 }}>
            {b.people.map((p, i) => (
              <i key={p.id} className="to2-mon" style={{ left: CSEAT / 2 - 10 + i * CSEAT - 19 }} />
            ))}
          </span>
          {b.people.map((p, i) => (
            <i key={"c" + p.id} className="to2-bosschair" style={{ left: x0 + i * CSEAT, top: 42 }} />
          ))}
          {b.people.map((p, i) => person(b, p, { kind: "b", i, x: x0 + i * CSEAT, y: 44, rot: 0 }, 10 + i))}
        </div>
      );
    }
    if (b.tier === "mgr") {
      const seats = MGR_SEATS.slice(0, b.people.length);
      const END = { x: 304, y: 88 }; // the chair at the end of the table
      return (
        <div key={b.key} className="of-zone to2-zone to2-mgr" style={zoneStyle(b, z)}>
          <span className="to2-longtable" />
          {MGR_SEATS.map((s, i) => (
            <i key={"mc" + i} className="of-chair" style={{ left: s.x, top: s.y + (s.rot ? -2 : 2) }} />
          ))}
          <i className="to2-mainchair" style={{ left: END.x + 6, top: END.y }} />
          {b.people.map((p, i) => person(b, p, seats[i], 30 + i))}
        </div>
      );
    }
    const pods = b.pods ?? [b.people];
    return (
      <div key={b.key} className="to2-pods">
        {pods.map((podPeople, k) => {
          const seated = podPeople.map((p, i) => ({ p, seat: TEAM_SEATS[i] }));
          const workTaken = new Set(seated.filter((s) => s.seat.kind === "w").map((s) => s.seat.i));
          const meetCount = seated.filter((s) => s.seat.kind === "m").length;
          const Board = BOARDS[(b.boards?.[k] ?? b.board) % BOARDS.length];
          const style = { ...zoneStyle(b, z), left: b.x + k * TZW * b.s, width: TZW } as React.CSSProperties;
          return (
            <div key={k} className="of-zone to2-zone" style={style}>
              <span className="of-carpet" />
              <span className="of-board">
                <Board />
              </span>
              {WORK.map((w, i) => (
                <i key={"wc" + i} className="of-chair" style={{ left: w.x, top: w.y + (w.rot ? -2 : 2) }} />
              ))}
              <span className="of-wt">
                {WORK.map((w, i) => (workTaken.has(i) ? <i key={i} className="of-lap" style={{ left: w.lx, top: w.ly }} /> : null))}
                <i className="of-mug" style={{ left: 66, top: 16 }} />
              </span>
              {MEET.map((m, i) => (
                <i key={"mc" + i} className="of-chair" style={{ left: m.x, top: m.y }} />
              ))}
              <span className="of-mt">
                <i className="of-paper" />
                <i className="of-paper of-paper-b" />
              </span>
              {meetCount > 1 && (
                <span className="of-say" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
              )}
              <span className="of-zplant" aria-hidden />
              {seated.map(({ p, seat }, i) => person(b, p, seat, z * 9 + k * 31 + i))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section id={id || "office"} className="to2-wrap" aria-label={heading}>
      <div ref={rootRef} className="of to2" data-preview={preview} style={{ height: lay.height }}>
        <div className="of-walls" aria-hidden>
          <span className="of-wall of-wall-t of-wall-t1" />
          <span className="of-wall of-wall-t of-wall-t2" />
          <span className="of-wall of-wall-l" />
          <span className="of-wall of-wall-r" />
          <span className="of-door" />
        </div>
        <div className="of-decor" aria-hidden>
          <span className="of-plant" style={{ left: "5.5%", top: "5%" }} />
          <span className="of-plant" style={{ left: "94.5%", top: "5%" }} />
          <span className="of-plant" style={{ left: "5.5%", top: "50%" }} />
          <span className="of-plant" style={{ left: "94.5%", top: "50%" }} />
          <span className="of-plant" style={{ left: "5.5%", top: "96%" }} />
          <span className="of-plant" style={{ left: "94.5%", top: "96%" }} />
        </div>

        {/* the lines of the hierarchy: leaders -> managers -> teams */}
        {lay.lines.map((l, i) => (
          <span key={i} className="to2-line" aria-hidden style={{ left: l.x, top: l.y, width: l.w, height: l.h }} />
        ))}

        {lay.blocks.map((b, i) => renderBlock(b, i))}

        {/* the names of the corners and the titles of the leaders: not scaled with the drawing, so that they stay easy to read */}
        {lay.blocks.map((b) =>
          b.tier === "cxo" ? (
            b.people.map((p, i) => {
              const n = b.people.length;
              const cx = b.x + (b.cw / 2 + (i - (n - 1) / 2) * CSEAT) * b.s;
              return (
                <span key={p.id} className="to2-tag" style={{ left: cx, top: b.y + CZH * b.s + 6 }}>
                  <b>{p.name}</b>
                  <i>{p.role}</i>
                </span>
              );
            })
          ) : (
            <span key={"l" + b.key} className="to2-name" style={{ left: b.x + 6, top: b.y - 24, "--zt": b.tone } as React.CSSProperties}>
              {b.name}
              {b.tier === "team" && <i className="to2-n"> · {b.people.length}</i>}
            </span>
          ),
        )}

        {WALKER_TONES.map((tone, i) => (
          <div key={i} data-walker="" className="of-walker" style={{ "--tone": tone } as React.CSSProperties}>
            <div className="of-walker-in">
              <PersonTop />
            </div>
          </div>
        ))}

        <div ref={headRef} className="to2-head">
          {chip && <span className="to2-chip">{chip}</span>}
          <h2 className="to2-h">{heading}</h2>
          {intro && !preview && <p className="to2-intro">{intro}</p>}
          <p className="to2-count">
            {hasPeople ? (
              <>
                <b>{people.length}</b> {people.length === 1 ? "person" : "people"} · <b>{nDepts}</b> {nDepts === 1 ? "department" : "departments"}
              </>
            ) : (
              "Nobody is in the office yet."
            )}
          </p>
        </div>

        {hot && (
          <div
            className="to2-card bglow"
            style={{ left: hot.left, top: hot.top, width: 330 }}
            role="status"
            onPointerEnter={() => window.clearTimeout(closeT.current)}
            onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
          >
            <GlowEdge />
            <div className="to2-card-top">
              <span className="to2-badge to2-badge-l" style={{ "--tone": hot.tone } as React.CSSProperties}>
                {hot.p.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hot.p.photo} alt="" />
                ) : (
                  <b>{initials(hot.p.name)}</b>
                )}
              </span>
              <div>
                <h3>{hot.p.name}</h3>
                {hot.p.role && <p className="to2-role">{hot.p.role}</p>}
              </div>
            </div>
            <span className="to2-dept">{hot.p.dept}</span>
            {hot.p.bio && <p className="to2-bio">{hot.p.bio}</p>}
            {hot.p.linkedin && (
              <a href={hot.p.linkedin} target="_blank" rel="noopener noreferrer" className="to2-link">
                LinkedIn →
              </a>
            )}
          </div>
        )}
      </div>

      {/* the same people as a plain list (for screen readers and search engines) */}
      <ul className="to2-sr">
        {people.map((p) => (
          <li key={p.id}>
            {p.name}, {p.role}, {p.dept}. {p.bio}
          </li>
        ))}
      </ul>
    </section>
  );
}
