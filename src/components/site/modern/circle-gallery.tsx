"use client";

import { useEffect, useRef, useState } from "react";
import { GlowEdge } from "../glow-edge";
import { IconTile } from "../icons";
import { SmartLink } from "../smart-link";

// "Circle Gallery": a ring of cards that stands on a 3D floor and spins when you drag it (the idea is the Circle Gallery of React Bits Pro,
// built here without any library). Drag (or flick) the ring with the mouse or a finger: it turns with inertia and then settles so that one card
// faces you. A click on a card brings it to the front, the arrows and the arrow keys turn the ring by one card. The card at the front is the
// one that is described under the ring (when to choose it, the problems it solves, what you get). Only the transform of the ring and the
// opacity of the cards change, and only while it moves: nothing runs while it rests or is off the screen. Used for "What we build".

type Card = { title: string; description: string; href?: string; fit?: string; problems?: string; outcomes?: string };

const lines = (s?: string) => (s ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
const plain = (s: string) => s.replace(/\s*\n\s*/g, " ");
const mod = (a: number, n: number) => ((a % n) + n) % n;

export function CircleGallery({ cards }: { cards: Card[] }) {
  const n = cards.length;
  const step = 360 / Math.max(1, n);
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const api = useRef<{ to: (i: number) => void; by: (d: number) => void }>({ to: () => {}, by: () => {} });

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring || n < 1) return;
    let rot = 0; // degrees
    let vel = 0; // degrees per second
    let target: number | null = null; // where the ring settles
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastT = 0;
    let raf = 0;
    let lastIdx = -1;
    let cw = 260;

    const size = () => {
      const w = stage.clientWidth;
      cw = Math.round(Math.min(300, Math.max(190, w * 0.27)));
      const ch = Math.round(cw * 1.22);
      const R = Math.max(cw * 1.6, cw / (2 * Math.tan(Math.PI / Math.max(3, n))) + 140);
      stage.style.setProperty("--cw", `${cw}px`);
      stage.style.setProperty("--ch", `${ch}px`);
      stage.style.setProperty("--R", `${R.toFixed(0)}px`);
    };
    const paint = () => {
      ring.style.transform = `translateZ(calc(var(--R) * -1)) rotateY(${rot.toFixed(2)}deg)`;
      let idx = 0;
      let best = 999;
      for (let i = 0; i < n; i++) {
        let a = mod(i * step + rot, 360);
        if (a > 180) a -= 360; // -180..180: 0 faces us
        const d = Math.abs(a);
        if (d < best) {
          best = d;
          idx = i;
        }
        const el = cardRefs.current[i];
        if (el) el.style.opacity = String(Math.max(0.28, 1 - d / 150).toFixed(3));
      }
      if (idx !== lastIdx) {
        lastIdx = idx;
        setActive(idx);
      }
    };
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000 || 0.016));
      lastT = now;
      if (!dragging) {
        if (target === null && Math.abs(vel) > 14) {
          // inertia: it slows down, then settles on the nearest card
          rot += vel * dt;
          vel *= Math.exp(-dt * 2.6);
          if (Math.abs(vel) <= 14) target = Math.round(rot / step) * step;
        } else {
          if (target === null) target = Math.round(rot / step) * step;
          rot += (target - rot) * (1 - Math.exp(-dt * 7));
          vel = 0;
          if (Math.abs(target - rot) < 0.03) {
            rot = target;
            paint();
            return;
          }
        }
      }
      paint();
      raf = requestAnimationFrame(frame);
    };
    const run = () => {
      if (!raf) {
        lastT = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastT = performance.now();
      vel = 0;
      target = null;
      stage.setPointerCapture(e.pointerId);
      stage.dataset.drag = "true";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      moved += Math.abs(dx);
      const d = dx * (180 / Math.max(240, cw * 1.6)); // a card width of travel turns the ring by about one card
      rot += d;
      const dt = Math.max(1, now - lastT) / 1000;
      vel = vel * 0.6 + (d / dt) * 0.4;
      lastX = e.clientX;
      lastT = now;
      paint();
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      stage.dataset.drag = "false";
      if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
      if (moved < 5) vel = 0; // a click, not a drag
      run();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") api.current.by(-1);
      else if (e.key === "ArrowRight") api.current.by(1);
      else return;
      e.preventDefault();
    };
    api.current = {
      to: (i) => {
        // the shortest way round to card i
        const want = -i * step;
        const k = Math.round((rot - want) / 360);
        target = want + k * 360;
        vel = 0;
        run();
      },
      by: (d) => {
        // turn by one card in the wanted direction (also across the seam)
        target = Math.round(rot / step) * step - d * step;
        vel = 0;
        run();
      },
    };

    size();
    paint();
    const ro = new ResizeObserver(() => {
      size();
      paint();
    });
    ro.observe(stage);
    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    stage.addEventListener("keydown", key);
    return () => {
      ro.disconnect();
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
      stage.removeEventListener("keydown", key);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n, step]);

  if (n === 0) return null;
  const cur = cards[Math.min(active, n - 1)];
  const fit = (cur.fit ?? "").trim();
  const problems = lines(cur.problems);
  const outcomes = lines(cur.outcomes);

  return (
    <div className="md cg">
      <div ref={stageRef} className="cg-stage" tabIndex={0} role="group" aria-roledescription="carousel" aria-label="What we build. Drag to turn the ring, or use the arrow keys">
        <div className="cg-floor" aria-hidden>
          <i className="cg-ring-a" />
          <i className="cg-ring-b" />
          <i className="cg-glow" />
        </div>
        <div className="cg-scene">
          <div ref={ringRef} className="cg-ring">
            {cards.map((c, i) => (
              <article
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="cg-card bglow"
                data-on={i === active}
                style={{ transform: `rotateY(${(i * step).toFixed(3)}deg) translateZ(var(--R))` }}
                onClick={() => i !== active && api.current.to(i)}
                aria-hidden={i !== active}
              >
                <GlowEdge />
                <IconTile index={i + 1} large />
                <span className="cg-no">{String(i + 1).padStart(2, "0")}</span>
                <h3>{plain(c.title)}</h3>
                <p>{c.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="cg-nav">
          <button type="button" onClick={() => api.current.by(-1)} aria-label="Previous">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </button>
          <span className="cg-dots">
            {cards.map((c, i) => (
              <button key={i} type="button" data-on={i === active} aria-label={plain(c.title)} onClick={() => api.current.to(i)} />
            ))}
          </span>
          <button type="button" onClick={() => api.current.by(1)} aria-label="Next">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <p className="cg-hint" aria-hidden>
          Drag the ring
        </p>
      </div>

      <div key={active} className="cg-detail bglow" aria-live="polite">
        <GlowEdge />
        <h3>{plain(cur.title)}</h3>
        {fit && (
          <p className="cg-fit">
            <b>Right for you when</b> {fit}
          </p>
        )}
        <div className="cg-cols">
          {problems.length > 0 && (
            <div>
              <h4>Problems it solves</h4>
              <ul>
                {problems.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          {outcomes.length > 0 && (
            <div>
              <h4>What you get</h4>
              <ul>
                {outcomes.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {cur.href && (
          <SmartLink href={cur.href} className="cg-more">
            Read more →
          </SmartLink>
        )}
      </div>
    </div>
  );
}
