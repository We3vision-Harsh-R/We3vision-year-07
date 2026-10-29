"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { SERVICE_GROUPS } from "../../lib/site-menu";
import { SmartLink } from "./smart-link";

// The service wheel of phone + tablet (owner 2026-10-29, after a picker of a phone app): every service on an arc at the right edge. It does not use the
// browser's scroll: a finger drag (up / down only, sideways does nothing), the mouse wheel and the arrow keys move one number, `pos` (which row is in the
// middle), with momentum and a spring that settles on a row; one animation loop places every row on the arc. The row in the middle is lit
// continuously (the nearer to the middle, the more lit), so nothing jumps. Tap the lit row (or the button) to open it, tap another row to bring it to the
// middle. The group buttons at the top jump to a group. It opens from the Services tab. Looks: styles/nav-bar.css (sw-).
const ITEM = 52; // px, the height of one row (the same number is in the CSS)
const R = 420; // px, the radius of the arc
const STIFF = 170; // spring: critically damped (26 * 26 = 4 * 170)
const DAMP = 26;

const GLYPH: Record<string, string> = {
  Development: "M9 8 5 12l4 4M15 8l4 4-4 4M13 6l-2 12",
  Creatives: "M4 20l4-1 11-11-3-3L5 16zM14 7l3 3",
  "E-commerce": "M4 5h2l2 10h9l2-7H7M10 19.5h.01M17 19.5h.01",
  Branding: "M12 4l2.4 5 5.4.7-4 3.8 1 5.4-4.8-2.6-4.8 2.6 1-5.4-4-3.8 5.4-.7z",
  Marketing: "M4 13v-2l12-5v12L4 13zM8 14l1 5h3l-1-4.5M19 9.5v5",
};

type Row = { label: string; href: string; group: string };
type Mode = "idle" | "drag" | "spring" | "free";

export function ServiceWheel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const rows = useMemo<Row[]>(() => {
    const seen = new Set<string>();
    return SERVICE_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label }))).filter((r) => !seen.has(r.href) && !!seen.add(r.href));
  }, []);
  const groups = useMemo(() => SERVICE_GROUPS.map((g) => ({ label: g.label, start: rows.findIndex((r) => r.group === g.label), n: rows.filter((r) => r.group === g.label).length })), [rows]);
  const path = usePathname();
  const [sel, setSel] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLLIElement | null)[]>([]);
  const s = useRef({ pos: 0, vel: 0, target: 0, mode: "idle" as Mode, raf: 0, last: 0, shown: -1, openedAt: 0, down: false, moved: 0, lastY: 0, lastT: 0, wheel: 0, open });
  const last = rows.length - 1;
  const clamp = (v: number, a = 0, b = last) => Math.min(b, Math.max(a, v));

  const render = (now: number) => {
    const st = s.current;
    for (let i = 0; i < rows.length; i++) {
      const li = els.current[i];
      if (!li) continue;
      const d = (i - st.pos) * ITEM;
      const ad = Math.abs(d);
      const a = Math.min(ad, R - 1);
      // entrance: the rows slide in along the arc from the right, the ones nearest the middle first
      const p = Math.min(1, Math.max(0, (now - st.openedAt - Math.abs(i - st.pos) * 38) / 640));
      const e = 1 - (1 - p) * (1 - p) * (1 - p);
      li.style.transform = `translate3d(${(R - Math.sqrt(R * R - a * a) + (1 - e) * 90).toFixed(1)}px,${d.toFixed(1)}px,0) scale(${Math.max(0.88, 1 - ad / 1500).toFixed(3)})`;
      li.style.opacity = String((Math.max(0.42, 1 - ad / (ITEM * 8.5)) * e).toFixed(3));
      li.style.setProperty("--h", Math.max(0, 1 - ad / ITEM).toFixed(3));
    }
    const near = Math.round(clamp(st.pos));
    if (near !== st.shown) {
      st.shown = near;
      setSel(near);
    }
  };

  const tick = (t: number) => {
    const st = s.current;
    const dt = Math.min(0.032, (t - st.last) / 1000 || 0.016);
    st.last = t;
    if (st.mode === "spring") {
      st.vel += ((st.target - st.pos) * STIFF - st.vel * DAMP) * dt;
      st.pos += st.vel * dt;
      if (Math.abs(st.target - st.pos) < 0.0008 && Math.abs(st.vel) < 0.01) {
        st.pos = st.target;
        st.vel = 0;
        st.mode = "idle";
      }
    }
    render(t);
    const entering = t - st.openedAt < 1200;
    st.raf = st.open && (st.mode !== "idle" || entering) ? requestAnimationFrame(tick) : 0;
  };
  const run = () => {
    const st = s.current;
    if (!st.raf) {
      st.last = performance.now();
      st.raf = requestAnimationFrame(tick);
    }
  };
  const springTo = (i: number, v = s.current.vel) => {
    const st = s.current;
    st.target = clamp(Math.round(i));
    st.vel = v;
    st.mode = "spring";
    run();
  };

  // when it opens the row of the page you are on is in the middle (the first one on any other page)
  useEffect(() => {
    const st = s.current;
    st.open = open;
    if (!open) return;
    const i = Math.max(
      0,
      rows.findIndex((r) => r.href === path),
    );
    st.pos = st.target = i;
    st.vel = 0;
    st.mode = "idle";
    st.shown = -1;
    st.openedAt = performance.now();
    run();
    const el = box.current;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      st.pos = clamp(st.pos + (e.deltaY / ITEM) * 0.8, -0.35, last + 0.35);
      st.vel = 0;
      st.mode = "free";
      window.clearTimeout(st.wheel);
      st.wheel = window.setTimeout(() => springTo(st.pos), 110);
      run();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") springTo(Math.round(st.target) + 1, 0);
      if (e.key === "ArrowUp") springTo(Math.round(st.target) - 1, 0);
    };
    el?.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      el?.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(st.wheel);
      cancelAnimationFrame(st.raf);
      st.raf = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // the finger: up / down moves the wheel, sideways does nothing (the box has touch-action: none)
  const down = (e: React.PointerEvent) => {
    const st = s.current;
    st.down = true;
    st.moved = 0;
    st.lastY = e.clientY;
    st.lastT = performance.now();
    st.vel = 0;
    st.mode = "drag";
    run();
  };
  const move = (e: React.PointerEvent) => {
    const st = s.current;
    if (!st.down) return;
    const dy = e.clientY - st.lastY;
    const now = performance.now();
    st.moved += Math.abs(dy);
    if (st.moved > 6 && !e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId);
    const out = st.pos < 0 || st.pos > last; // past the first / last row it pulls back (rubber band)
    st.pos -= (dy / ITEM) * (out ? 0.35 : 1);
    const dt = Math.max(1, now - st.lastT) / 1000;
    st.vel = st.vel * 0.7 + ((-dy / ITEM) / dt) * 0.3;
    st.lastY = e.clientY;
    st.lastT = now;
  };
  const up = () => {
    const st = s.current;
    if (!st.down) return;
    st.down = false;
    if (st.moved <= 6) return springTo(st.pos, 0);
    const v = Math.max(-30, Math.min(30, performance.now() - st.lastT > 90 ? 0 : st.vel));
    springTo(st.pos + v * 0.3, v * 0.25);
  };

  const cur = rows[sel];
  return createPortal(
    <div className="sw" data-open={open}>
      <div className="sw-back" onClick={onClose} aria-hidden />
      <div className="sw-panel" role="dialog" aria-label="Our services" inert={!open} data-lenis-prevent>
        <header className="sw-head">
          <div className="sw-title">
            <h2>Our services</h2>
            <span className="sw-count">
              {sel + 1}/{rows.length}
            </span>
          </div>
          <div className="sw-chips" role="tablist" aria-label="Service groups">
            {groups.map((g) => (
              <button key={g.label} type="button" role="tab" aria-selected={g.label === cur.group} className="sw-chip" onClick={() => springTo(g.start, 0)}>
                {g.label}
                <i>{g.n}</i>
              </button>
            ))}
          </div>
        </header>
        <div className="sw-list" ref={box} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onClickCapture={(e) => s.current.moved > 6 && (e.preventDefault(), e.stopPropagation())}>
          <span className="sw-arc" aria-hidden />
          <span className="sw-mark" aria-hidden />
          <ul>
            {rows.map((r, i) => (
              <li key={r.href} ref={(el) => void (els.current[i] = el)} className="sw-li" data-on={i === sel}>
                <SmartLink
                  href={r.href}
                  draggable={false}
                  tabIndex={i === sel ? 0 : -1}
                  onClick={(e) => {
                    if (i !== sel) {
                      e.preventDefault();
                      springTo(i, 0);
                    } else onClose();
                  }}>
                  <span className="sw-t">{r.label}</span>
                  <span className="sw-ic">
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d={GLYPH[r.group]} />
                    </svg>
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
        <SmartLink href={cur.href} onClick={onClose} className="sw-go">
          Open {cur.label}
        </SmartLink>
      </div>
    </div>,
    document.body,
  );
}
