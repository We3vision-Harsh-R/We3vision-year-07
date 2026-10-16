"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { byDepartment, CORNER_CAPACITY, type TeamPerson } from "@/lib/team-shared";
import { GlowEdge } from "../glow-edge";
import { PersonTop } from "../timeline-art";
import { BOARDS } from "../timeline-boards";

// The office of We3vision on the Team page: the same office as the end of the About timeline (floor, walls, plants, a corner for every
// department with its wall board, the long table with laptops, the small meeting table, chairs and colleagues who walk about), but with the
// real people of the company in it. Everything is on one screen: there is no camera and no zoom. Every department has a corner, the people of
// the department sit in it (4 at the long table, 4 at the meeting table, 1 at the board; a bigger department gets a second corner).
// Point at a person (tap, or tab to the person) and a card opens next to them: photo, name, role, a few words and a link.
// The people come from the admin panel (Team). The same component draws the preview there (`preview`, with the person that is being edited
// marked). The look is the .of-* rules of the About office and the .to2-* rules in globals.css.

const HUES = [300, 340, 20, 60, 100, 200, 250];
const WALKER_TONES = [40, 300, 100, 200, 340];
const ZW = 300; // a corner is drawn on a 300 x 226 canvas and scaled with --zs
const ZH = 226;

type Seat = { kind: "w" | "m" | "p"; i: number; x: number; y: number; rot: number };
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
const ORDER: Seat[] = [
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

// which wall board suits which department (the boards of timeline-boards.tsx: brand, web, mobile, AI, metaverse, UI/UX, CRM)
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

type Corner = { key: string; name: string; people: TeamPerson[]; tone: number; board: number };

/** the corners of the office: one per department (a department with more than 9 people gets more than one) */
function corners(people: TeamPerson[]): Corner[] {
  const out: Corner[] = [];
  const used = new Set<number>();
  byDepartment(people).forEach((d, di) => {
    for (let c = 0; c * CORNER_CAPACITY < d.people.length; c++) {
      const chunk = d.people.slice(c * CORNER_CAPACITY, (c + 1) * CORNER_CAPACITY);
      let board = BOARD_RULES.find(([re]) => re.test(d.name))?.[1] ?? -1;
      if (board < 0 || used.has(board)) {
        board = [0, 1, 2, 3, 4, 5, 6].find((b) => !used.has(b)) ?? (out.length % 7);
      }
      used.add(board);
      out.push({ key: `${d.name}-${c}`, name: d.name, people: chunk, tone: HUES[di % HUES.length], board });
    }
  });
  return out;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

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
  const closeT = useRef(0);
  const [hot, setHot] = useState<{ p: TeamPerson; tone: number; left: number; top: number } | null>(null);
  const list = useMemo(() => corners(people), [people]);
  const rows = Math.ceil(list.length / 2);
  const split = rows; // the left column gets the first half

  // the size of the drawing follows the width of the box; the box is as high as its rows of corners need
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const W = root.clientWidth;
      if (W < 2) return;
      const zs = clamp((0.225 * W) / ZW, 0.4, 1.6);
      const u = clamp(W / 1440, 0.55, 3);
      const pitch = (ZH + 64) * zs;
      const topPad = 16 * u + 34 * zs;
      const need = topPad + Math.max(1, rows) * pitch - 40 * zs + 12 * u + 40 * zs;
      const min = preview ? 520 : 700;
      root.style.setProperty("--zs", zs.toFixed(3));
      root.style.setProperty("--u", u.toFixed(3));
      root.style.setProperty("--pitch", `${pitch.toFixed(1)}px`);
      root.style.setProperty("--toppad", `${topPad.toFixed(1)}px`);
      root.style.height = `${Math.round(Math.max(min, need))}px`;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [rows, preview]);

  // colleagues who get up and walk about the aisles (nothing here depends on the scroll)
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const walkers = Array.from(root.querySelectorAll<HTMLElement>("[data-walker]"));
    const st = walkers.map(() => ({ init: false, x: 0, y: 0, tx: 0, ty: 0, wait: 0, cur: 0, tgt: 0, speed: 60 }));
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    let raf = 0;
    let last = 0;
    let visible = true;
    const aisles = [0.3, 0.5, 0.7, 0.275, 0.725];
    const pick = (s: (typeof st)[number], W: number, H: number) => {
      s.tx = aisles[Math.floor(Math.random() * aisles.length)] * W;
      s.ty = rnd(0.07, 0.93) * H;
      s.speed = rnd(46, 64) * clamp(W / 1440, 0.6, 3);
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (!visible) return;
      const W = root.clientWidth;
      const H = root.clientHeight;
      walkers.forEach((el, i) => {
        const s = st[i];
        if (!s.init) {
          s.x = aisles[i % aisles.length] * W;
          s.y = rnd(0.1, 0.9) * H;
          s.wait = rnd(0, 3);
          s.init = true;
          pick(s, W, H);
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
            pick(s, W, H);
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

  const seatPerson = (c: Corner, p: TeamPerson, seat: Seat, k: number) => {
    const role = seat.kind === "p" ? "pres" : seat.kind === "w" ? "type" : seat.i === 1 ? "talk" : "meet";
    // the round badge sits behind the person (away from the table)
    const a = (seat.rot * Math.PI) / 180;
    const bx = Math.sin(a) * 27;
    const by = -Math.cos(a) * 27;
    const on = hot?.p.id === p.id;
    return (
      <button
        key={p.id}
        type="button"
        className="to2-p"
        data-on={on}
        data-hl={highlightId === p.id}
        style={{ left: seat.x, top: seat.y, "--tone": c.tone } as React.CSSProperties}
        aria-label={`${p.name}${p.role ? ", " + p.role : ""}`}
        onPointerEnter={(e) => e.pointerType === "mouse" && open(p, c.tone, e.currentTarget)}
        onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
        onFocus={(e) => open(p, c.tone, e.currentTarget)}
        onBlur={() => closeSoon(120)}
        onClick={(e) => open(p, c.tone, e.currentTarget)}
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
          style={{ left: 0, top: 0, "--rot": `${seat.rot}deg`, "--tone": c.tone + ((k * 17) % 40) - 20, "--d": `${((k * 0.37) % 1.6).toFixed(2)}s` } as React.CSSProperties}
        >
          <PersonTop seated={role !== "pres"} girl={p.girl} />
        </span>
      </button>
    );
  };

  const corner = (c: Corner, order: number, style: React.CSSProperties) => {
    const seated = c.people.map((p, i) => ({ p, seat: ORDER[i] }));
    const workTaken = new Set(seated.filter((s) => s.seat.kind === "w").map((s) => s.seat.i));
    const meetCount = seated.filter((s) => s.seat.kind === "m").length;
    const Board = BOARDS[c.board % BOARDS.length];
    return (
      <div key={c.key} className="of-zone to2-zone" style={{ ...style, "--zt": c.tone, "--zi": order } as React.CSSProperties}>
        <span className="of-carpet" />
        <span className="of-label to2-label">{c.name}</span>
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
        {seated.map(({ p, seat }, i) => seatPerson(c, p, seat, order * 9 + i))}
      </div>
    );
  };

  const SCALE = "scale(var(--zs))";
  const leftX = "3.5%";
  const rightX = "calc(96.5% - 300px * var(--zs))";

  return (
    <section id={id || "office"} className="to2-wrap" aria-label={heading}>
      <div ref={rootRef} className="of to2" data-preview={preview}>
        <div className="of-walls" aria-hidden>
          <span className="of-wall of-wall-t of-wall-t1" />
          <span className="of-wall of-wall-t of-wall-t2" />
          <span className="of-wall of-wall-l" />
          <span className="of-wall of-wall-r" />
          <span className="of-wall of-wall-b" />
          <span className="of-door" />
        </div>
        <div className="of-decor" aria-hidden>
          <span className="of-plant" style={{ left: "24%", top: "6%" }} />
          <span className="of-plant" style={{ left: "76%", top: "6%" }} />
          <span className="of-plant" style={{ left: "24%", top: "50%" }} />
          <span className="of-plant" style={{ left: "76%", top: "50%" }} />
          <span className="of-plant" style={{ left: "24%", top: "95%" }} />
          <span className="of-plant" style={{ left: "76%", top: "95%" }} />
        </div>

        {list.map((c, i) => {
          const left = i < split;
          const r = left ? i : i - split;
          return corner(c, i, {
            top: `calc(var(--toppad) + ${r} * var(--pitch))`,
            left: left ? leftX : rightX,
            transform: SCALE,
          });
        })}

        {WALKER_TONES.map((tone, i) => (
          <div key={i} data-walker="" className="of-walker" style={{ "--tone": tone } as React.CSSProperties}>
            <div className="of-walker-in">
              <PersonTop />
            </div>
          </div>
        ))}

        <div className="to2-center">
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
          {hasPeople && <p className="to2-hint">Point at a person to meet them.</p>}
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
