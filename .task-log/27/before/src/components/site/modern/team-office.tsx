"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GlowEdge } from "../glow-edge";
import { PersonTop } from "../timeline-art";

// The team page: the office of We3vision seen from above (the same top-view people, floor and walls as the office of 2027 on the About page).
// Every department has its own room with a long table and the people of that department at it, facing each other. The page is pinned while
// you scroll: first the whole office, then the camera goes from room to room (the name of the department and the number of people stand
// at the side). Above every person there is a round photo (or the initials when there is no photo yet); point at a person (tap on a phone,
// or tab to them) and a card tells who they are: photo, name, role, a few words and a link. On a tablet, a phone and for visitors who prefer
// less motion there is no camera: the same people as cards, department by department. The look is in globals.css (.to-*).

export type Person = { name: string; role: string; dept: string; bio: string; photo: string; linkedin: string; girl: string };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const TONES = [352, 300, 40, 200, 100, 20, 250, 160];
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "W3";

const SEAT = 132; // distance between two people of a row (px of the plan)
const ZH = 420; // height of a room
const GAP = 80;
const MAX_W = 2500;

type Room = { name: string; x: number; y: number; w: number; tone: number; people: { p: Person; x: number; y: number; row: number; tone: number }[] };

/** the plan of the office: the rooms (one per department) in rows, and where every person sits */
function plan(people: Person[]) {
  const order: string[] = [];
  const by = new Map<string, Person[]>();
  for (const p of people) {
    const d = p.dept.trim() || "Team";
    if (!by.has(d)) {
      by.set(d, []);
      order.push(d);
    }
    by.get(d)!.push(p);
  }
  const rooms: Room[] = [];
  let x = 90;
  let y = 150;
  order.forEach((name, ri) => {
    const list = by.get(name)!;
    const top = Math.ceil(list.length / 2);
    const bottom = list.length - top;
    const w = Math.max(460, top * SEAT + 140);
    if (x + w > MAX_W && x > 90) {
      x = 90;
      y += ZH + GAP;
    }
    const tone = TONES[ri % TONES.length];
    const room: Room = { name, x, y, w, tone, people: [] };
    list.forEach((p, j) => {
      const row = j < top ? 0 : 1;
      const count = row === 0 ? top : bottom;
      const idx = row === 0 ? j : j - top;
      const sx = x + (w - count * SEAT) / 2 + SEAT / 2 + idx * SEAT;
      room.people.push({ p, x: sx, y: row === 0 ? y + 118 : y + 308, row, tone });
    });
    rooms.push(room);
    x += w + GAP;
  });
  const W = Math.max(...rooms.map((r) => r.x + r.w)) + 90;
  const H = Math.max(...rooms.map((r) => r.y + ZH)) + 120;
  return { rooms, W, H };
}

export function TeamOffice({ id, chip, heading, intro, members }: { id?: string; chip: string; heading: string; intro: string; members: Person[] }) {
  const layout = useMemo(() => plan(members), [members]);
  const { rooms, W: PW, H: PH } = layout;
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(-1); // -1: the whole office
  const [hot, setHot] = useState<{ p: Person; tone: number; x: number; y: number } | null>(null);
  const closeT = useRef(0);
  const jump = useRef<(k: number) => void>(() => {});
  const nRooms = rooms.length;

  // ---- the camera ----
  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    const stage = stageRef.current;
    const pl = planRef.current;
    if (!track || !sticky || !stage || !pl || nRooms < 1) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    let target = 0;
    let cur = -1;
    let lastT = 0;
    let lastRoom = -2;
    let W = 1;
    let H = 1;
    const keys = () => {
      // 0 = the whole office, k = the room k-1
      const fit = Math.min((W * 0.94) / PW, (H * 0.9) / PH);
      const k = [{ x: PW / 2, y: PH / 2, s: fit }];
      rooms.forEach((r) => {
        const s = Math.min(1.25, Math.min((W * 0.62) / (r.w + 140), (H * 0.8) / (ZH + 120)));
        k.push({ x: r.x + r.w / 2 + (W * 0.1) / s, y: r.y + ZH / 2, s });
      });
      return k;
    };
    let K = keys();
    const place = (f: number) => {
      const i = clamp(Math.floor(f), 0, K.length - 1);
      const j = Math.min(K.length - 1, i + 1);
      const t = f - i;
      const x = lerp(K[i].x, K[j].x, t);
      const y = lerp(K[i].y, K[j].y, t);
      const s = lerp(K[i].s, K[j].s, t);
      pl.style.transform = `translate3d(${(W / 2 - x * s).toFixed(1)}px, ${(H / 2 - y * s).toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
      const r = Math.round(f) - 1;
      if (r !== lastRoom) {
        lastRoom = r;
        setRoom(r);
      }
    };
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000 || 0.016));
      lastT = now;
      if (cur < 0) cur = target;
      cur += (target - cur) * (1 - Math.exp(-dt * 4.5));
      if (Math.abs(target - cur) < 0.0006) cur = target;
      place(cur);
      if (cur !== target) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      if (!mq.matches) return;
      const r = track.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const dist = Math.max(1, r.height - sticky.offsetHeight);
      const p = clamp((top - r.top) / dist);
      const seg = p * nRooms;
      const i = Math.min(nRooms - 1, Math.floor(seg));
      // the camera holds the overview and every room for a while, the move to the next one takes the middle of its part
      target = p >= 1 ? nRooms : i + smooth((seg - i - 0.3) / 0.5);
      if (!raf) {
        lastT = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const measure = () => {
      W = stage.clientWidth;
      H = stage.clientHeight;
      K = keys();
      place(Math.max(0, cur));
      onScroll();
    };
    jump.current = (kk: number) => {
      if (!mq.matches) return;
      const r = track.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const dist = Math.max(1, r.height - sticky.offsetHeight);
      const y = window.scrollY + r.top - top + (clamp(kk, 0, nRooms) / nRooms) * dist + (kk > 0 ? dist * 0.004 : 0);
      const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
      if (lenis) lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    const io = new IntersectionObserver(([e]) => sticky.setAttribute("data-live", String(e.isIntersecting)), { rootMargin: "100px" });
    io.observe(track);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rooms, nRooms, PW, PH]);

  // ---- the card of a person ----
  const open = useCallback((p: Person, tone: number, el: HTMLElement) => {
    window.clearTimeout(closeT.current);
    const r = el.getBoundingClientRect();
    setHot({ p, tone, x: r.left + r.width / 2, y: r.top });
  }, []);
  const closeSoon = useCallback((ms = 160) => {
    window.clearTimeout(closeT.current);
    closeT.current = window.setTimeout(() => setHot(null), ms);
  }, []);
  useEffect(() => () => window.clearTimeout(closeT.current), []);
  useEffect(() => {
    if (!hot) return;
    const y0 = window.scrollY;
    const onScroll = () => Math.abs(window.scrollY - y0) > 40 && setHot(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setHot(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [hot]);
  // the card stays on the screen
  const cardStyle = () => {
    if (!hot) return {};
    const w = 330;
    const left = clamp(hot.x - w / 2, 12, (typeof window !== "undefined" ? window.innerWidth : 1200) - w - 12);
    const below = hot.y < 330;
    return { left, top: below ? hot.y + 96 : hot.y - 12, transform: below ? "none" : "translateY(-100%)", width: w } as React.CSSProperties;
  };

  const flat = rooms.flatMap((r) => r.people);
  const total = flat.length;

  const person = (pp: Room["people"][number], key: string) => (
    <div key={key} className="to-seat" style={{ left: pp.x, top: pp.y }}>
      <button
        type="button"
        className="to-hit"
        data-on={hot?.p === pp.p}
        aria-label={`${pp.p.name}, ${pp.p.role}`}
        onPointerEnter={(e) => e.pointerType === "mouse" && open(pp.p, pp.tone, e.currentTarget)}
        onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
        onFocus={(e) => open(pp.p, pp.tone, e.currentTarget)}
        onBlur={() => closeSoon(120)}
        onClick={(e) => open(pp.p, pp.tone, e.currentTarget)}
      >
        <span className="to-badge" style={{ "--tone": pp.tone } as React.CSSProperties}>
          {pp.p.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pp.p.photo} alt="" loading="lazy" />
          ) : (
            <b>{initials(pp.p.name)}</b>
          )}
        </span>
        <span className="to-av" style={{ "--rot": `${pp.row === 0 ? 0 : 180}deg`, "--tone": pp.tone } as React.CSSProperties}>
          <i className="of-chair" style={{ left: 0, top: pp.row === 0 ? 3 : -3 }} />
          <span className="of-pp" data-role="type" style={{ left: 0, top: 0, "--rot": `${pp.row === 0 ? 0 : 180}deg`, "--tone": pp.tone, "--d": `${((pp.x * 0.013) % 1.6).toFixed(2)}s` } as React.CSSProperties}>
            <PersonTop seated girl={pp.p.girl === "yes"} />
          </span>
        </span>
      </button>
    </div>
  );

  return (
    <section ref={trackRef} id={id || "office"} className="to" style={{ "--n": nRooms } as React.CSSProperties} aria-label={heading}>
      {/* the same people as cards (a tablet, a phone, less motion; read by screen readers on a desktop) */}
      <div className="to-listwrap">
        <header className="to-head">
          <span className="md-chip">{chip}</span>
          <h2 className="text-vfade md-h2">{heading}</h2>
          {intro && <p className="md-intro to-intro">{intro}</p>}
        </header>
        {rooms.map((r) => (
          <div key={r.name} className="to-dept">
            <h3>
              {r.name} <span>{r.people.length}</span>
            </h3>
            <ul>
              {r.people.map((pp, i) => (
                <li key={i} className="to-card bglow">
                  <GlowEdge />
                  <span className="to-badge to-badge-l" style={{ "--tone": pp.tone } as React.CSSProperties}>
                    {pp.p.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pp.p.photo} alt="" loading="lazy" />
                    ) : (
                      <b>{initials(pp.p.name)}</b>
                    )}
                  </span>
                  <div>
                    <h4>{pp.p.name}</h4>
                    <p className="to-role">{pp.p.role}</p>
                    <p className="to-bio">{pp.p.bio}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div ref={stickyRef} className="to-sticky" data-live="false">
        <div ref={stageRef} className="to-stage">
          <div ref={planRef} className="to-plan" style={{ width: PW, height: PH }}>
            <div className="to-floor" />
            <h3 className="to-title" aria-hidden>
              {heading}
            </h3>
            {rooms.map((r) => (
              <div key={r.name} className="to-room" style={{ left: r.x, top: r.y, width: r.w, height: ZH, "--tone": r.tone } as React.CSSProperties}>
                <span className="to-rname">{r.name}</span>
                <i className="to-table" />
                <i className="to-plant to-plant-a" />
                <i className="to-plant to-plant-b" />
              </div>
            ))}
            {flat.length > 0 && rooms.map((r) => r.people.map((pp, i) => person(pp, `${r.name}-${i}`)))}
          </div>

          <div className="to-ui" aria-hidden={false}>
            <div className="to-now" key={room}>
              <span className="to-now-k">{room < 0 ? "The office" : `Room ${room + 1} of ${nRooms}`}</span>
              <b>{room < 0 ? `${total} people` : rooms[room].name}</b>
              <span className="to-now-n">{room < 0 ? `${nRooms} departments` : `${rooms[room].people.length} ${rooms[room].people.length === 1 ? "person" : "people"}`}</span>
            </div>
            <nav className="to-nav" aria-label="Rooms">
              <button type="button" data-on={room < 0} onClick={() => jump.current(0)} tabIndex={-1}>
                <i>All</i>
              </button>
              {rooms.map((r, i) => (
                <button key={r.name} type="button" data-on={room === i} onClick={() => jump.current(i + 1)} tabIndex={-1} title={r.name}>
                  <i>{String(i + 1).padStart(2, "0")}</i>
                  <span>{r.name}</span>
                </button>
              ))}
            </nav>
            <p className="to-hint">Scroll to walk through the office. Point at a person.</p>
          </div>
        </div>
      </div>

      {/* the card of the person that is pointed at */}
      {hot && (
        <div
          ref={cardRef}
          className="to-profile bglow"
          style={cardStyle()}
          role="status"
          onPointerEnter={() => window.clearTimeout(closeT.current)}
          onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
        >
          <GlowEdge />
          <div className="to-pr-top">
            <span className="to-badge to-badge-l" style={{ "--tone": hot.tone } as React.CSSProperties}>
              {hot.p.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={hot.p.photo} alt="" />
              ) : (
                <b>{initials(hot.p.name)}</b>
              )}
            </span>
            <div>
              <h4>{hot.p.name}</h4>
              <p className="to-role">{hot.p.role}</p>
            </div>
          </div>
          <span className="to-pr-dept">{hot.p.dept}</span>
          <p className="to-bio">{hot.p.bio}</p>
          {hot.p.linkedin && (
            <a href={hot.p.linkedin} target="_blank" rel="noopener noreferrer" className="to-link">
              LinkedIn →
            </a>
          )}
        </div>
      )}
    </section>
  );
}
