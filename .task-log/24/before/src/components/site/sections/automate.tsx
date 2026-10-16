"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { FlowIcon } from "../flow-icons";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

const SPEED = 170; // walking speed of the little helper, px per second
const HOP_MS = 420; // length of the hop with which it presses a switch
const FLIP_AT = 230; // ... the switch flips this long after the hop starts
const TURN: Record<string, number> = { down: 0, right: -90, up: 180, left: 90 }; // the helper is drawn facing down

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** The text with every letter in its own span, so the letters can turn white one after the other. */
function Letters({ text }: { text: string }) {
  const words = text.split(" ");
  const starts = words.map((_, wi) => words.slice(0, wi).reduce((sum, w) => sum + [...w].length + 1, 0)); // index of the first letter of each word
  return (
    <p aria-label={text}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {wi > 0 && " "}
          <span className="at-w" aria-hidden>
            {[...word].map((ch, k) => (
              <span key={k} className="at-ch" style={{ "--c": starts[wi] + k } as CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </p>
  );
}

/**
 * "By hand -> with AI": every row is a problem on the left, a switch in the middle and the AI solution on the right.
 * A tiny cartoon helper (seen from above: only the top of its head, and its hands and feet when it walks) walks down the
 * column of switches and turns each one ON: the switch glows and the letters of the solution turn white one by one. The page
 * scrolls along with it, up or down. If a visitor turns a switch OFF, the helper walks back to it and turns it ON again.
 * Without JavaScript (or with reduced motion) everything is simply shown as automated.
 */
export const Automate: SectionComponent<"automate"> = ({ data }) => {
  const n = data.items.length;
  const [on, setOn] = useState<boolean[]>(() => Array(n).fill(true));
  const onRef = useRef<boolean[]>(Array(n).fill(true));
  const stageRef = useRef<HTMLDivElement>(null);
  const avRef = useRef<HTMLDivElement>(null);
  const switchRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const queue = useRef<number[]>([]);
  const started = useRef(false);
  const gen = useRef(0); // changes when the show is restarted, so the old walk stops
  const busyGen = useRef(-1);
  const pos = useRef({ x: 0, y: 0 });
  const quietUntil = useRef(0); // the page does not scroll along until this time (after the visitor scrolled)
  const following = useRef(false);

  const setAt = useCallback((i: number, v: boolean) => {
    onRef.current[i] = v;
    setOn([...onRef.current]);
  }, []);

  // where the helper has to stand for a row: on its switch, in the coordinates of the stage
  const spot = useCallback((i: number) => {
    const stage = stageRef.current?.getBoundingClientRect();
    const sw = switchRefs.current[i]?.getBoundingClientRect();
    if (!stage || !sw) return null;
    return { x: sw.left - stage.left + sw.width / 2, y: sw.top - stage.top + sw.height / 2 };
  }, []);

  // the page follows the helper: when it gets near the top or bottom of the screen the page scrolls up or down with it
  const follow = useCallback(() => {
    if (following.current) return;
    following.current = true;
    const tick = () => {
      const av = avRef.current;
      if (!following.current || !av) return;
      const r = av.getBoundingClientRect();
      const cy = r.top + r.height / 2;
      const H = window.innerHeight;
      const near = cy > -H * 0.2 && cy < H * 1.2; // not when the visitor has scrolled far away
      if (near && performance.now() > quietUntil.current) {
        const lo = H * 0.36;
        const hi = H * 0.58;
        const dy = cy > hi ? cy - hi : cy < lo ? cy - lo : 0;
        if (dy) window.scrollBy(0, Math.max(-34, Math.min(34, dy * 0.22)));
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const place = useCallback((x: number, y: number, show = true) => {
    const av = avRef.current;
    if (!av) return;
    av.style.transition = "none";
    av.style.transform = `translate(${x}px, ${y}px)`;
    av.dataset.on = String(show);
    pos.current = { x, y };
  }, []);

  const moveTo = useCallback(
    async (x: number, y: number, g: number) => {
      const av = avRef.current;
      if (!av) return;
      const dx = x - pos.current.x;
      const dy = y - pos.current.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) return;
      const ms = Math.max(260, (dist / SPEED) * 1000);
      av.dataset.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
      av.dataset.state = "walk";
      (av.querySelector(".av-body") as HTMLElement).style.transform = `rotate(${TURN[av.dataset.dir]}deg)`;
      av.style.transition = `transform ${ms}ms cubic-bezier(0.4, 0, 0.6, 1)`;
      av.style.transform = `translate(${x}px, ${y}px)`;
      pos.current = { x, y };
      follow();
      await sleep(ms + 20);
      if (g === gen.current) av.dataset.state = "idle";
    },
    [follow],
  );

  const pump = useCallback(async () => {
    const g = gen.current;
    if (busyGen.current === g) return;
    busyGen.current = g;
    const av = avRef.current;
    try {
      let last = 0;
      while (g === gen.current) {
        if (queue.current.length === 0) {
          // nothing left to do: step off the switch and stand beside it
          const s = spot(last);
          if (s && av) await moveTo(s.x - 58, s.y, g);
          if (queue.current.length === 0) break;
          continue;
        }
        const i = queue.current.shift() as number;
        if (onRef.current[i]) continue;
        const s = spot(i);
        if (!s || !av) continue;
        if (Math.abs(pos.current.x - s.x) > 2) await moveTo(s.x, pos.current.y, g); // first onto the column of switches ...
        if (g !== gen.current) return;
        await moveTo(s.x, s.y, g); // ... then along it to the row
        if (g !== gen.current) return;
        av.dataset.state = "hop";
        await sleep(FLIP_AT);
        if (g !== gen.current) return;
        setAt(i, true);
        await sleep(HOP_MS - FLIP_AT + 160);
        if (g !== gen.current) return;
        av.dataset.state = "idle";
        last = i;
      }
    } finally {
      following.current = false;
      if (busyGen.current === g) busyGen.current = -1;
    }
  }, [moveTo, setAt, spot]);

  const run = useCallback(() => {
    gen.current += 1;
    busyGen.current = -1;
    onRef.current = Array(n).fill(false);
    setOn(Array(n).fill(false));
    const first = spot(0);
    if (first) place(first.x, first.y - 90);
    queue.current = Array.from({ length: n }, (_, i) => i);
    void pump();
  }, [n, place, pump, spot]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    onRef.current = Array(n).fill(false);
    setOn(Array(n).fill(false)); // the list is below the fold: start from "by hand" and wait until it is seen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          started.current = true;
          run();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(stage);
    // the visitor scrolling by hand always wins: the page stops following for a moment
    const quiet = () => (quietUntil.current = performance.now() + 2500);
    window.addEventListener("wheel", quiet, { passive: true });
    window.addEventListener("touchmove", quiet, { passive: true });
    window.addEventListener("keydown", quiet);
    return () => {
      observer.disconnect();
      gen.current += 1;
      following.current = false;
      window.removeEventListener("wheel", quiet);
      window.removeEventListener("touchmove", quiet);
      window.removeEventListener("keydown", quiet);
    };
  }, [n, run]);

  // a visitor flips a switch: OFF -> the helper walks over and turns it ON again; ON (by hand) -> just on
  const flip = (i: number) => {
    if (onRef.current[i] && started.current) {
      setAt(i, false);
      if (!queue.current.includes(i)) queue.current.push(i);
      quietUntil.current = 0;
      void pump();
    } else {
      setAt(i, !onRef.current[i]);
      queue.current = queue.current.filter((q) => q !== i);
    }
  };

  const done = on.filter(Boolean).length;

  return (
    <section id="automate" className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1120px] px-4">
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
        <div className="at">
          <div className="at-head">
            <span>{data.beforeLabel}</span>
            <span aria-hidden />
            <div className="at-head-r">
              <span>{data.afterLabel}</span>
              <button type="button" className="at-count" onClick={run} aria-label="Play again">
                <b>{String(done).padStart(2, "0")}</b> / {String(n).padStart(2, "0")} {data.doneLabel}
                <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 12a8 8 0 108-8H7M7 1l-3 3 3 3" />
                </svg>
              </button>
            </div>
          </div>
          <div ref={stageRef} className="at-stage">
            <ul className="at-list">
              {data.items.map((item, i) => (
                <li key={i} className="at-row" data-on={on[i]}>
                  <div className="at-problem">
                    <FlowIcon name={item.icon} className="size-5 shrink-0" />
                    <span>{item.problem}</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on[i]}
                    aria-label={item.problem}
                    className="at-switch"
                    ref={(el) => {
                      switchRefs.current[i] = el;
                    }}
                    onClick={() => flip(i)}
                  >
                    <i />
                  </button>
                  <div className="at-solution">
                    <em>{data.doneLabel}</em>
                    <Letters text={item.solution} />
                  </div>
                </li>
              ))}
            </ul>
            {/* the helper: seen from above, so only the top of its head shows; hands and feet only when it moves */}
            <div ref={avRef} className="av" data-state="idle" data-dir="down" data-on="false" aria-hidden>
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
        </div>
      </div>
    </section>
  );
};
