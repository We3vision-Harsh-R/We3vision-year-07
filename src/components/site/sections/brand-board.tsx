"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BrandTile } from "../brand-mark";
import { SmartLink } from "../smart-link";
import { Chip } from "../ui";
import type { SectionComponent } from "./shared";

const PHONE = 700; // up to this width the layout is the phone one
const STICK = 78; // phones: how far from the top of the screen the board stays pinned
const SWATCHES =["hsl(calc(var(--th) + 354) calc(100% * var(--ts)) 76.47%)", "hsl(calc(var(--th) + 358) calc(100% * var(--ts)) 92.16%)", "hsl(calc(var(--th) + 339.48) calc(100% * var(--ts)) 77.45%)", "hsl(calc(var(--th) + 76) calc(81.25% * var(--ts)) 87.45%)"];

// The board (436 x 572 px) is five boxes with a 20 px street between them. The main street runs down the middle (x = 218),
// side streets run through the gaps between the boxes of one column. The little guide (seen from above) sits in the first box
// (the starting point of a brand) and, while you scroll, walks the main street to the gate of every box in turn.
const ROAD_X = 218;
const BOXES = [
  { x: 0, y: 0, h: 128 }, // 0 strategy (the start)
  { x: 228, y: 0, h: 276 }, // 1 logo
  { x: 0, y: 148, h: 276 }, // 2 identity
  { x: 228, y: 296, h: 276 }, // 3 guidelines
  { x: 0, y: 444, h: 128 }, // 4 collateral
];
const BOX_W = 208;
const LAST = BOXES.length - 1;
const ST = BOXES.map((b) => b.y + b.h / 2); // the gate of every box on the main street
const SEAT = { x: BOX_W / 2, y: ST[0] }; // where the guide sits at the start
const TURN: Record<string, number> = { down: 0, right: -90, up: 180, left: 90 }; // the guide is drawn facing down

// The scroll of the pinned screen (0..1) runs: a short rest (the guide sits in the first box), then five equal parts. In each
// part the guide first walks to its next stop and then waits there while the street lights up towards the stop after it.
const REST_START = 0.05;
const REST_END = 0.04;
const WALK = 0.5; // share of a part used for walking
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => t * t * (3 - 2 * t);
/** Splits "text with *starred* words" into words, remembering which ones are highlighted. */
const words = (text: string) =>
  text.split("*").flatMap((part, i) => part.split(/\s+/).filter(Boolean).map((w) => ({ w, hi: i % 2 === 1 })));

/**
 * "About" section: the tag, the heading and the text on top; under them the way a brand is built, as five boxes with streets
 * in the gaps between them (left), and the list of services (right), every item standing at the height of its box. The screen
 * is pinned while the page scrolls: the guide walks the main street from the first box to the last (and back when you scroll
 * up), the street lights up ahead of it while it waits at a gate, and the list item next to the box it reached lights up.
 * Click a box or a list item and the page scrolls to that moment.
 */
export const BrandBoard: SectionComponent<"brandBoard"> = ({ data }) => {
  const [active, setActive] = useState(0); // the box the guide has reached
  const lead = useMemo(() => words(data.lead), [data.lead]);
  // one service per line: "Name | short description"
  const points = useMemo(
    () =>
      data.points
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean)
        .slice(0, BOXES.length)
        .map((p) => {
          const [title, ...rest] = p.split("|");
          return { title: title.trim(), text: rest.join("|").trim() };
        }),
    [data.points],
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const avRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);

  // everything that moves with the scroll
  useEffect(() => {
    const track = trackRef.current;
    const wrap = wrapRef.current;
    const av = avRef.current;
    const road = roadRef.current;
    const list = listRef.current;
    const el = leadRef.current;
    const pin = pinRef.current;
    const row = rowRef.current;
    if (!track || !wrap || !av || !road || !list || !el || !pin || !row) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    const body = av.querySelector<HTMLElement>(".av-body")!;
    let raf = 0;
    let shown = -1;
    let last = { x: SEAT.x, y: SEAT.y };
    let dir = "down";
    let idleT = 0;

    // Laptops and tablets: the whole pinned screen is scaled down to fit the window, never up.
    // Phones: the heading scrolls away normally and only the board (with the step it shows) is pinned, scaled to the width.
    const measure = () => {
      wrap.style.setProperty("--fit", "1");
      row.style.setProperty("--fit", "1");
      if (window.innerWidth <= PHONE) {
        const fit = Math.min(1, (window.innerWidth - 32) / 436, (window.innerHeight - STICK - 24) / Math.max(1, row.offsetHeight));
        row.style.setProperty("--fit", fit.toFixed(3));
        return;
      }
      const natural = wrap.offsetHeight;
      const room = window.innerHeight - 124 - 20; // a little room on top, the menu pill at the bottom
      const fit = Math.min(1, room / natural, (window.innerWidth - 32) / 1160);
      wrap.style.setProperty("--fit", fit.toFixed(3));
    };

    const update = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;

      // the heading fills with light word by word while the section comes into view
      const fillP = clamp((vh * 0.92 - r.top) / (vh * 0.6));
      spans.forEach((s, i) => s.style.setProperty("--k", String(clamp(fillP * (spans.length + 3) - i))));

      let p: number;
      if (window.innerWidth <= PHONE) {
        const pr = pin.getBoundingClientRect();
        const rowH = row.offsetHeight * (parseFloat(row.style.getPropertyValue("--fit")) || 1);
        p = clamp((STICK - pr.top) / Math.max(1, pin.offsetHeight - rowH));
      } else {
        p = clamp(-r.top / Math.max(1, r.height - vh));
      }
      const q = clamp((p - REST_START) / (1 - REST_START - REST_END));
      const part = q * (LAST + 1);
      const j = Math.min(LAST, Math.floor(part));
      const f = part - j;
      const walk = ease(clamp(f / WALK));
      const ext = ease(clamp((f - WALK) / (1 - WALK)));

      let x: number;
      let y: number;
      if (j === 0) {
        x = SEAT.x + (ROAD_X - SEAT.x) * walk; // up from the seat to the gate of the first box
        y = SEAT.y;
      } else {
        x = ROAD_X;
        y = ST[j - 1] + (ST[j] - ST[j - 1]) * walk;
      }
      const base = ST[j] - ST[0];
      const fillPx = base + (j < LAST ? (ST[j + 1] - ST[j]) * ext : 0);
      road.style.setProperty("--fill", `${fillPx.toFixed(1)}px`);

      const dx = x - last.x;
      const dy = y - last.y;
      const moving = Math.hypot(dx, dy) > 0.12;
      if (moving) dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
      const reached = j === 0 ? 0 : walk >= 0.98 ? j : j - 1;
      if (!moving) dir = reached === 0 && p < REST_START * 0.6 ? "down" : BOXES[reached].x === 0 ? "left" : "right";
      last = { x, y };
      av.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      const resting = p < REST_START * 0.6 ? "sit" : "idle";
      av.dataset.state = moving ? "walk" : resting;
      // when the scroll stops, the guide stops walking too
      window.clearTimeout(idleT);
      idleT = window.setTimeout(() => (av.dataset.state = resting), 140);
      if (av.dataset.dir !== dir) {
        av.dataset.dir = dir;
        body.style.transform = `rotate(${TURN[dir]}deg)`;
      }

      // the rail beside the list fills as the street reaches the boxes (one stop of the rail per box)
      let rail = 1;
      for (let k = 0; k < LAST; k++) {
        if (fillPx <= ST[k + 1] - ST[0]) {
          rail = (k + clamp((fillPx - (ST[k] - ST[0])) / (ST[k + 1] - ST[k]))) / LAST;
          break;
        }
      }
      list.style.setProperty("--rail", rail.toFixed(3));
      list.dataset.done = reached === LAST ? "true" : "false";
      if (reached !== shown) {
        shown = reached;
        setActive(reached);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    av.style.transition = "none";
    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(idleT);
    };
  }, [lead, points.length]);

  // clicking a box or a list item scrolls the page to the moment the guide arrives at that box
  const goTo = (k: number) => {
    const track = trackRef.current;
    const pin = pinRef.current;
    const row = rowRef.current;
    if (!track || !pin || !row) return;
    const part = (k + (k === 0 ? 0 : WALK)) / (LAST + 1);
    const p = k === 0 ? 0 : REST_START + (1 - REST_START - REST_END) * part;
    if (window.innerWidth <= PHONE) {
      const rowH = row.offsetHeight * (parseFloat(row.style.getPropertyValue("--fit")) || 1);
      const travel = pin.offsetHeight - rowH;
      const start = pin.getBoundingClientRect().top + window.scrollY - STICK;
      window.scrollTo({ top: start + p * travel + 2, behavior: "smooth" });
      return;
    }
    const travel = track.offsetHeight - window.innerHeight;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + p * travel + 2, behavior: "smooth" });
  };

  const tile = (k: number, content: React.ReactNode) => (
    <div
      className="bb-tile"
      data-side={BOXES[k].x === 0 ? "l" : "r"}
      data-on={active === k ? "true" : "false"}
      data-k={k}
      style={{ left: BOXES[k].x, top: BOXES[k].y, height: BOXES[k].h }}
      onClick={() => goTo(k)}
    >
      <div className="bb-in">{content}</div>
      <span className="bb-gate" />
    </div>
  );

  return (
    <section id="about" ref={trackRef} className="bb-track">
      <div className="bb-stage">
        <div className="bb" ref={wrapRef}>
          {/* red box: the tag */}
          <div className="bb-top">
            <Chip>{data.chip}</Chip>
          </div>

          {/* blue box: the heading and the text */}
          <div className="bb-head">
            <p ref={leadRef} className="bb-lead">
              {lead.map((x, i) => (
                <span key={i} data-w className={x.hi ? "hi" : undefined}>
                  {x.w}{" "}
                </span>
              ))}
            </p>
            <p className="bb-body">
              {data.body.split("*").map((part, i) =>
                i % 2 === 1 ? (
                  <span key={i} className="text-violet">
                    {part}
                  </span>
                ) : (
                  part
                ),
              )}
            </p>
          </div>

          <div className="bb-pin" ref={pinRef}>
          <div className="bb-row" ref={rowRef}>
            {/* white box: the board */}
            <div className="bb-board" aria-hidden>
              {/* the streets: the main one down the middle, side streets through the gaps between the boxes of a column */}
              <span className="bb-side" style={{ left: 0, top: 128 }} />
              <span className="bb-side" style={{ left: 228, top: 276 }} />
              <span className="bb-side" style={{ left: 0, top: 424 }} />
              <div className="bb-road" ref={roadRef} style={{ "--top": `${ST[0]}px` } as React.CSSProperties}>
                <span className="bb-road-fill" />
              </div>

              {tile(
                0,
                <>
                  <span className="bb-ring r1" />
                  <span className="bb-ring r2" />
                  <span className="bb-ring r3" />
                  <span className="bb-flag">
                    <i />
                    <b />
                  </span>
                  <span className="bb-cap">Start</span>
                </>,
              )}
              {tile(
                1,
                <>
                  <BrandTile className="bb-logo-mark" />
                  <span className="bb-cap">Logo</span>
                </>,
              )}
              {tile(
                2,
                <>
                  <span className="bb-aa">Aa</span>
                  <span className="bb-swatches">
                    {SWATCHES.map((c) => (
                      <i key={c} style={{ background: c }} />
                    ))}
                  </span>
                </>,
              )}
              {tile(
                3,
                <>
                  <span className="bb-grid" />
                  <span className="bb-line l1" />
                  <span className="bb-line l2" />
                  <span className="bb-line l3" />
                  <span className="bb-line l4" />
                </>,
              )}
              {tile(
                4,
                <>
                  <span className="bb-card c1">
                    <i />
                    <b />
                  </span>
                  <span className="bb-card c2">
                    <i />
                    <b />
                  </span>
                  <span className="bb-tag" />
                </>,
              )}

              {/* the guide: the same little character as everywhere on the site, seen from above (only the top of its head
                  shows; hands and feet show while it walks) */}
              <div ref={avRef} className="av" data-state="sit" data-dir="down" data-on="true">
                <div className="av-body">
                  <span className="av-shadow" />
                  <div className="av-hop">
                    <span className="av-foot l" />
                    <span className="av-foot r" />
                    <span className="av-hand l" />
                    <span className="av-hand r" />
                    <span className="av-ear l" />
                    <span className="av-ear r" />
                    <span className="av-head" />
                  </div>
                </div>
              </div>
            </div>

            {/* green box: the services, evenly spaced, with a rail that fills like the street, and the button at the end */}
            <div className="bb-list" ref={listRef} data-done="false">
              {data.listIntro && <p className="bb-list-intro">{data.listIntro}</p>}
              <div className="bb-items" style={{ "--n": points.length } as React.CSSProperties}>
                <span className="bb-rail" aria-hidden>
                  <i />
                </span>
                {points.map((p, i) => (
                  <div key={p.title} className="bb-item" data-on={active === i ? "true" : "false"} data-lit={active >= i ? "true" : "false"}>
                    <span className="bb-node" aria-hidden />
                    <button type="button" onClick={() => goTo(i)}>
                      <span className="bb-n">{String(i + 1).padStart(2, "0")}</span>
                      <span className="bb-t">
                        <span className="bb-p">{p.title}</span>
                        {p.text && <span className="bb-x">{p.text}</span>}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="bb-end">
                {data.ctaLabel && (
                  <SmartLink href={data.ctaHref || "#contact"} className="bb-cta btn-primary text-void">
                    {data.ctaLabel}
                  </SmartLink>
                )}
                {data.note && <p className="bb-note">{data.note}</p>}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};
