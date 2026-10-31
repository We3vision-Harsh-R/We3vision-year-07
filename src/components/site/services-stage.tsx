"use client";

import "@/styles/home-services.css";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ICONS } from "./icons";
import { ACCENTS, oneLine, parseSubs, type ServiceCard } from "./service-data";
import { SmartLink } from "./smart-link";

// THE SERVICES OF THE HOME PAGE ON A LAPTOP (owner 2026-10-31: "the walking on the road is too heavy; redesign the whole section, fully animated, for an
// AI / ML and web development company"). It replaces the pinned scroll track with the walking guide: one calm stage that stays in the normal page flow.
// Redesigned the same day (owner: "redesign it properly"): ONE hairline frame in three flat cells instead of boxes inside boxes, and it fits one laptop screen.
// FIXED SCROLL (owner 2026-10-31: "set it in a fixed scroll"): on a laptop with motion the whole stage is PINNED under the logo (position: sticky inside a
// track that is STEP screens higher per service) and the page SCROLL picks the service, one after the other; the thin line under the chosen name shows how far
// the scroll is inside it. The scroll is compulsory (it settles on the middle of a service when it stops; the edge services leave a free quarter so the page
// can go on), a click, the round buttons and the arrow keys scroll to a service. After the last one the section goes up with the page. Without motion
// (reduce motion) nothing is pinned: it is a plain stage that moves on by itself every SECONDS seconds while it is on the screen.
//   left          the list of the services (number, name); the chosen one gets an accent bar and a thin progress line.
//   top right     the words of the service (icon, name, text, button) and the plate: a bigger animated drawing (pure CSS / SVG, only transform and opacity move)
//   bottom right  the four parts of the service as a spec strip (name + text, 16px), divided by hairlines
// The phone and tablet keep the swipe cards of services-rail.tsx (home-mobile.css shows one or the other). Styles: styles/home-services.css (prefix sv-).
const SECONDS = 7; // only when it is not pinned: the time of one service
const STEP = 0.5; // pinned: screens of scroll for one service
const pad = (n: number) => String(n).padStart(2, "0");

/** which drawing a service gets: found from its title (the texts come from the admin panel) */
function kindOf(title: string) {
  const t = title.toLowerCase();
  if (/\bai\b|\bml\b|machine|intelligen/.test(t)) return "ai";
  if (/metaverse|\bvr\b|\bar\b|3d/.test(t)) return "meta";
  if (/mobile|\bapp\b/.test(t)) return "app";
  if (/\bui\b|\bux\b|ui\/ux/.test(t)) return "ux";
  if (/crm|erp|software/.test(t)) return "crm";
  if (/brand|graphic/.test(t)) return "brand";
  return "web";
}

// the nodes of the small neural network (x, y) in three layers; the lines run between neighbouring layers
const NET: [number, number][][] = [
  [[44, 46], [44, 100], [44, 154]],
  [[150, 28], [150, 78], [150, 128], [150, 172]],
  [[256, 62], [256, 138]],
];

function Scene({ kind }: { kind: string }) {
  if (kind === "ai") {
    const lines: string[] = [];
    for (let l = 0; l < NET.length - 1; l++) for (const a of NET[l]) for (const b of NET[l + 1]) lines.push(`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`);
    const sigs = [lines[1], lines[6], lines[10], lines[13], lines[17], lines[21]].filter(Boolean);
    return (
      <svg className="sv-sc sv-ai" viewBox="0 0 300 200" aria-hidden>
        {lines.map((d, i) => (
          <path key={i} d={d} className="sv-ai-l" />
        ))}
        {NET.flat().map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="7" className="sv-ai-n" style={{ "--k": i } as CSSProperties} />
        ))}
        {sigs.map((d, i) => (
          <circle key={i} r="3.4" className="sv-ai-s" style={{ offsetPath: `path("${d}")`, "--k": i } as CSSProperties} />
        ))}
      </svg>
    );
  }
  if (kind === "web") {
    return (
      <div className="sv-sc sv-web" aria-hidden>
        <div className="sv-w-bar">
          <i />
          <i />
          <i />
        </div>
        <div className="sv-w-body">
          <b className="sv-w-nav" style={{ "--k": 0 } as CSSProperties} />
          <b className="sv-w-hero" style={{ "--k": 1 } as CSSProperties} />
          <b className="sv-w-c" style={{ "--k": 2 } as CSSProperties} />
          <b className="sv-w-c" style={{ "--k": 3 } as CSSProperties} />
          <b className="sv-w-c" style={{ "--k": 4 } as CSSProperties} />
        </div>
        <u className="sv-w-cur" />
      </div>
    );
  }
  if (kind === "app") {
    return (
      <div className="sv-sc sv-app" aria-hidden>
        <div className="sv-ph">
          <b className="sv-ph-top" />
          {[0, 1, 2].map((k) => (
            <i key={k} className="sv-ph-card" style={{ "--k": k } as CSSProperties} />
          ))}
          <b className="sv-ph-tab" />
        </div>
        <span className="sv-ap-chip is-a">Push sent</span>
        <span className="sv-ap-chip is-b">+ 2.4k installs</span>
      </div>
    );
  }
  if (kind === "meta") {
    return (
      <div className="sv-sc sv-meta" aria-hidden>
        <div className="sv-cube">
          {["f", "b", "r", "l", "t", "d"].map((f) => (
            <i key={f} className={`sv-cf is-${f}`} />
          ))}
        </div>
        <i className="sv-ring" />
        <i className="sv-ring is-2" />
      </div>
    );
  }
  if (kind === "ux") {
    return (
      <div className="sv-sc sv-ux" aria-hidden>
        <div className="sv-ux-stack">
          {[0, 1, 2].map((k) => (
            <i key={k} className="sv-ux-l" style={{ "--k": k } as CSSProperties}>
              <b />
              <b />
              <b />
            </i>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "crm") {
    return (
      <div className="sv-sc sv-crm" aria-hidden>
        {["Lead", "Talk", "Offer", "Won"].map((n, i) => (
          <div key={n} className="sv-crm-c">
            <span>{n}</span>
            <i style={{ "--h": `${[78, 62, 44, 30][i]}%` } as CSSProperties} />
          </div>
        ))}
        {[0, 1, 2].map((k) => (
          <b key={k} className="sv-crm-d" style={{ "--k": k } as CSSProperties} />
        ))}
      </div>
    );
  }
  // brand
  return (
    <div className="sv-sc sv-brand" aria-hidden>
      <i className="sv-br-a" />
      <i className="sv-br-b" />
      <i className="sv-br-c" />
      <div className="sv-br-sw">
        {[0, 1, 2, 3, 4].map((k) => (
          <b key={k} style={{ "--k": k } as CSSProperties} />
        ))}
      </div>
    </div>
  );
}

export function ServicesStage({ cards }: { cards: ServiceCard[] }) {
  const n = cards.length;
  const [at, setAt] = useState(0);
  const [seen, setSeen] = useState(false); // the stage is on the screen
  const [held, setHeld] = useState(false); // the pointer is on the frame (only matters when it moves on by itself)
  const [still, setStill] = useState(false); // reduce motion
  const [pinned, setPinned] = useState(false); // the page scroll picks the service
  const root = useRef<HTMLElement>(null); // the track
  const stickyRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);

  // where in the track the stage stands: p = 0 just pinned .. 1 the last service is done (not clamped); dist = the scroll distance of the whole track
  const measure = () => {
    const track = root.current;
    const sticky = stickyRef.current;
    if (!track || !sticky) return { p: 0, dist: 1 };
    const r = track.getBoundingClientRect();
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    const dist = Math.max(1, r.height - sticky.getBoundingClientRect().height);
    return { p: (top - r.top) / dist, dist };
  };
  const moveTo = (y: number) => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 0.8 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };
  // a click, a button or an arrow key: pinned = the page scrolls to the middle of that service (the scroll then opens it), else it opens at once
  const pick = (i: number) => {
    if (!pinned) {
      setAt(i);
      return;
    }
    const { p, dist } = measure();
    moveTo(window.scrollY + ((i + 0.5) / n - p) * dist);
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pin = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const sync = () => {
      setStill(mq.matches);
      setPinned(pin.matches && n > 1);
    };
    sync();
    mq.addEventListener("change", sync);
    pin.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      pin.removeEventListener("change", sync);
    };
  }, [n]);

  // "on the screen" is measured on the pinned part (the track is several screens high)
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // not pinned (reduce motion): it moves on by itself while it is on the screen
  const next = useCallback(() => setAt((a) => (a + 1) % Math.max(1, n)), [n]);
  const auto = seen && !held && !still && !pinned && n > 1;
  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(next, SECONDS * 1000);
    return () => window.clearTimeout(t);
  }, [auto, at, next]);

  // pinned: the scroll opens the services one after the other, and settles on one when it stops
  useEffect(() => {
    if (!pinned) return;
    const track = root.current;
    const sticky = stickyRef.current;
    const fit = fitRef.current;
    if (!track || !sticky || !fit) return;
    // the heading and the frame must be on the screen together: when they are higher than the screen they are made a little smaller
    const size = () => {
      fit.style.zoom = "";
      const natural = fit.getBoundingClientRect().height;
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const room = window.innerHeight - top - 108; // 108 = the floating menu pill at the bottom of the screen must not cover the frame
      fit.style.zoom = natural > room ? String(Math.max(0.7, room / natural)) : "";
      // the track is as high as the stage plus a part of the screen for every service
      track.style.height = `${sticky.getBoundingClientRect().height + n * window.innerHeight * STEP}px`;
    };
    size();
    document.fonts?.ready.then(size);
    window.addEventListener("resize", size);
    let raf = 0;
    let last = -1;
    let snapTimer = 0;
    const tick = () => {
      raf = 0;
      const { p } = measure();
      const c = Math.min(1, Math.max(0, p));
      const idx = Math.min(n - 1, Math.floor(c * n));
      if (idx !== last) {
        last = idx;
        setAt(idx);
        window.setTimeout(schedule, 80); // the new line is drawn after React has swapped the row
      }
      // how far the open service is: the thin line under its name
      const bar = track.querySelector<HTMLElement>(".sv-prog");
      if (bar) bar.style.transform = `scaleX(${Math.min(1, c * n - idx).toFixed(3)})`;
    };
    // compulsory scroll: when the scrolling stops inside the track the page settles on the middle of the nearest service; the first and last quarter
    // of the edge services stay free, so the page can leave the stage upwards and downwards
    const snap = () => {
      const { p, dist } = measure();
      if (p <= 0.25 / n || p >= (n - 0.25) / n) return;
      let to = 0.5 / n;
      let bd = Infinity;
      for (let i = 0; i < n; i++) {
        const pt = (i + 0.5) / n;
        const d = Math.abs(p - pt);
        if (d < bd) {
          bd = d;
          to = pt;
        }
      }
      if (bd * dist < 6) return;
      moveTo(window.scrollY + (to - p) * dist);
    };
    function schedule() {
      if (!raf) raf = requestAnimationFrame(tick);
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(snap, 170);
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("resize", size);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearTimeout(snapTimer);
      if (raf) cancelAnimationFrame(raf);
      track.style.height = "";
      fit.style.zoom = "";
    };
  }, [pinned, n]);

  if (n === 0) return null;
  const card = cards[at] ?? cards[0];
  const title = oneLine(card.title);
  const subs = parseSubs(card.subs);
  const kind = kindOf(title);
  const Icon = ICONS[at % ICONS.length];

  const go = (d: number) => pick((at + d + n) % n);
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const to = (at + d + n) % n;
    pick(to);
    document.getElementById(`sv-tab-${to}`)?.focus({ preventScroll: true });
  };

  return (
    <section ref={root} className="sv" data-pin={pinned} data-play={seen && !still} aria-labelledby="sv-t" style={{ "--ac": ACCENTS[at % ACCENTS.length] } as CSSProperties}>
      <div ref={stickyRef} className="sv-sticky">
        <div ref={fitRef} className="sv-fit">
          <div className="sv-in">
            <header className="sv-head">
              <div>
                <p className="sv-eyebrow">What we build</p>
                <h2 id="sv-t">
                  AI, software and websites, <span>built to ship.</span>
                </h2>
              </div>
              <div className="sv-ctl">
                <button type="button" className="sv-nav" aria-label="Previous service" onClick={() => go(-1)}>
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>
                <span className="sv-count" aria-hidden>
                  <b>{pad(at + 1)}</b> / {pad(n)}
                </span>
                <button type="button" className="sv-nav" aria-label="Next service" onClick={() => go(1)}>
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </header>

            <div className="sv-frame" onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}>
              <div className="sv-list" role="tablist" aria-label="Our services" aria-orientation="vertical" onKeyDown={onKey}>
                {cards.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    id={`sv-tab-${i}`}
                    aria-selected={i === at}
                    aria-controls="sv-stage"
                    tabIndex={i === at ? 0 : -1}
                    className="sv-row"
                    style={{ "--ac": ACCENTS[i % ACCENTS.length] } as CSSProperties}
                    onClick={() => pick(i)}>
                    <i>{pad(i + 1)}</i>
                    <span>{oneLine(c.title)}</span>
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                    {i === at && <u className="sv-prog" key={`${at}-${auto}`} data-run={auto} />}
                  </button>
                ))}
              </div>

              <div id="sv-stage" className="sv-stage" role="tabpanel" aria-labelledby={`sv-tab-${at}`}>
                <div className="sv-top">
                  <div className="sv-body" key={`b${at}`}>
                    <span className="sv-ico" aria-hidden>
                      <Icon className="size-5" />
                    </span>
                    <h3>{title}</h3>
                    {card.summary && <p>{card.summary}</p>}
                    {card.href && (
                      <SmartLink href={card.href} className="sv-go">
                        <span>Explore {title}</span>
                        <svg viewBox="0 0 24 24" aria-hidden>
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </SmartLink>
                    )}
                  </div>
                  <div className="sv-plate" key={`a${at}`} aria-hidden>
                    <i className="sv-cn is-a" />
                    <i className="sv-cn is-b" />
                    <i className="sv-cn is-c" />
                    <i className="sv-cn is-d" />
                    <span className="sv-fig">Fig. {pad(at + 1)}</span>
                    <Scene kind={kind} />
                  </div>
                </div>
                {subs.length > 0 && (
                  <ul className="sv-subs" key={`s${at}`} style={{ "--n": subs.length } as CSSProperties}>
                    {subs.map((s, j) => (
                      <li key={j} style={{ "--k": j } as CSSProperties}>
                        <i>{pad(j + 1)}</i>
                        <b>{s.name}</b>
                        {s.desc && <p>{s.desc}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
