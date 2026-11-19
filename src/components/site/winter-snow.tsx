"use client";

import { useEffect, useRef } from "react";
import "@/styles/winter.css"; // (the canvas rules: loaded with this chunk, not with every page)

/**
 * WINTER (owner, 2026-11-19, preview): soft snow that falls with real-ish physics and settles on the floating menu bar like snow on a window sill.
 *
 *  - Flakes fall at a terminal speed (gravity against air drag, bigger flake = faster), drift with a slow wind, flutter, and are blown by the mouse.
 *  - The menu bar is a "ground": the top of the pill (a stadium shape) is measured every frame, so the snow follows it while it slides in, hides,
 *    shrinks into the round button or grows back.
 *  - The snow on the bar is a height field (one column per 3px). A landing flake adds snow to the columns around it; heaps that are too steep
 *    slump to their neighbours (angle of repose), snow on the curved ends slides off, a quiet layer grows back, too much is blown away.
 *  - When the pill shrinks, the snow on the part that goes away falls off as clumps (gravity).
 *  - One canvas, pointer-events none, sprites instead of gradients per flake, paused when the tab is hidden, laptop/desktop only (>= 1024px).
 *    prefers-reduced-motion: no falling flakes, only the still cap and the snowman.
 */

const COL = 3; // px of the bar per snow column
const HALF = 280; // columns each side of the bar centre (1680px of bar at most)
const COLS = HALF * 2;
const BASE_H = 8; // the quiet layer that grows back (px)
const MAX_H = 16; // more than this is blown away (px)
const REPOSE = 0.7; // slope the snow keeps (height / width)
// a landing flake spreads its snow over 9 columns like a soft bell
const WTS = (() => {
  const w = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => Math.exp(-(k * k) / 8));
  const s = w.reduce((p, v) => p + v, 0);
  return w.map((v) => v / s);
})();
const GRAV = 900; // px/s2 for a falling clump

type Flake = { x: number; y: number; vx: number; vy: number; r: number; vt: number; ph: number; fq: number; sway: number; a: number };
type Clump = { x: number; y: number; vx: number; vy: number; r: number };

function sprite(size: number, stops: [number, string][]): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  if (g) {
    const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    for (const [o, col] of stops) grd.addColorStop(o, col);
    g.fillStyle = grd;
    g.fillRect(0, 0, size, size);
  }
  return c;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function WinterSnow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const wide = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sharp = sprite(32, [[0, "rgba(255,255,255,1)"], [0.4, "rgba(255,255,255,0.8)"], [1, "rgba(255,255,255,0)"]]);
    const soft = sprite(32, [[0, "rgba(255,255,255,0.85)"], [0.5, "rgba(236,244,255,0.35)"], [1, "rgba(236,244,255,0)"]]);

    let vw = 0;
    let vh = 0;
    let raf = 0;
    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // ---------- the snow on the bar ----------
    const h = new Float32Array(COLS); // snow height per column (px)
    const drop = new Float32Array(COLS); // how far the bar's top edge is below its highest point at that column
    const sm0 = new Float32Array(COLS); // the snow smoothed once / twice, for drawing
    const sm = new Float32Array(COLS);
    const lump = new Float32Array(COLS); // a fixed lumpy pattern so the layer is not flat
    const lump2 = new Float32Array(COLS);
    for (let i = 0; i < COLS; i++) {
      lump[i] = 0.78 + 0.14 * Math.sin(i * 0.085 + 0.7) + 0.1 * Math.sin(i * 0.031 + 2.1);
      lump2[i] = 0.5 + 0.5 * Math.sin(i * 0.43 + 1.3) * Math.sin(i * 0.11);
    }
    let prevA = -1;
    let prevB = -1;
    let navTop = 0;
    let navCx = 0;

    // ---------- flakes + clumps ----------
    const flakes: Flake[] = [];
    const clumps: Clump[] = [];
    const spawn = (f: Flake, anywhere: boolean) => {
      const d = Math.random();
      const r = d < 0.55 ? 1 + Math.random() * 0.8 : d < 0.9 ? 1.9 + Math.random() * 0.9 : 2.8 + Math.random() * 0.9;
      f.r = r;
      f.vt = 26 + r * 15 + Math.random() * 10;
      f.a = r < 1.9 ? 0.38 + Math.random() * 0.17 : r < 2.8 ? 0.5 + Math.random() * 0.15 : 0.3 + Math.random() * 0.12;
      f.x = Math.random() * (vw + 80) - 40;
      f.y = anywhere ? Math.random() * vh : -r * 3 - Math.random() * 60;
      f.vx = 0;
      f.vy = f.vt * 0.5;
      f.ph = Math.random() * 6.283;
      f.fq = 0.7 + Math.random() * 1.3;
      f.sway = 6 + r * 3;
    };
    if (!reduce) {
      const n = Math.round(clamp(vw / 30, 34, 64));
      for (let i = 0; i < n; i++) {
        const f = { x: 0, y: 0, vx: 0, vy: 0, r: 0, vt: 0, ph: 0, fq: 0, sway: 0, a: 0 };
        spawn(f, true);
        flakes.push(f);
      }
    }
    const emit = (x: number, y: number, mass: number, dir: number) => {
      if (clumps.length > 260) return;
      clumps.push({ x, y, vx: dir * (6 + Math.random() * 40), vy: Math.random() * 30, r: clamp(Math.sqrt(mass) * 1.1, 1.4, 6) });
    };

    // ---------- the mouse blows the flakes ----------
    let px = -999;
    let py = -999;
    let pt = 0;
    let pvx = 0;
    let pvy = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      const dtp = Math.max(8, now - pt) / 1000;
      if (pt > 0) {
        pvx = clamp(pvx * 0.6 + ((e.clientX - px) / dtp) * 0.4, -2400, 2400);
        pvy = clamp(pvy * 0.6 + ((e.clientY - py) / dtp) * 0.4, -2400, 2400);
      }
      px = e.clientX;
      py = e.clientY;
      pt = now;
    };

    // ---------- drawing helpers ----------
    const ball = (x: number, y: number, r: number) => {
      const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.7, "#e9f1fd");
      g.addColorStop(1, "#b7cbea");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.2832);
      ctx.fill();
    };
    const snowman = (x: number, y: number) => {
      // arms first (behind the body)
      ctx.strokeStyle = "#6b4a33";
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x - 6, y - 24);
      ctx.lineTo(x - 15, y - 29);
      ctx.moveTo(x - 12, y - 27.5);
      ctx.lineTo(x - 14.5, y - 24.5);
      ctx.moveTo(x + 6, y - 24);
      ctx.lineTo(x + 15, y - 30);
      ctx.stroke();
      ball(x, y - 8, 10);
      ball(x, y - 23.5, 7.5);
      ball(x, y - 35, 5.6);
      // scarf
      ctx.fillStyle = "#d8483f";
      ctx.beginPath();
      ctx.roundRect(x - 6.4, y - 31.6, 12.8, 3.4, 1.6);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + 2.2, y - 30.4, 3.2, 8, 1.4);
      ctx.fill();
      // face + buttons
      ctx.fillStyle = "#2b2f3a";
      for (const [dx, dy, r] of [[-2.1, -36.2, 0.8], [2.1, -36.2, 0.8], [0, -24, 0.9], [0, -20.6, 0.9], [0, -10, 1], [0, -6, 1]]) {
        ctx.beginPath(); // one path per dot (dots in one path get joined by lines)
        ctx.arc(x + dx, y + dy, r, 0, 6.2832);
        ctx.fill();
      }
      ctx.fillStyle = "#f08a2c";
      ctx.beginPath();
      ctx.moveTo(x, y - 35.2);
      ctx.lineTo(x + 5.2, y - 34.4);
      ctx.lineTo(x, y - 33.6);
      ctx.closePath();
      ctx.fill();
    };

    let last = 0;
    let frameNo = 0;
    let opacity = 1;
    let navEl: HTMLElement | null = null;
    let primed = false;
    let calm = 1; // 1 = normal, lower while the big menu is open
    let calmTo = 1;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (reduce && last && now - last < 140) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      frameNo++;
      const t = now / 1000;
      if (frameNo % 10 === 0) calmTo = document.querySelector('.mm[data-open="true"]') ? 0.5 : 1;
      calm += (calmTo - calm) * (1 - Math.exp(-dt * 4));

      ctx.clearRect(0, 0, vw, vh);

      // ----- where is the bar -----
      if (!navEl || !navEl.isConnected) navEl = document.querySelector<HTMLElement>(".fn-root > nav");
      let rect: DOMRect | null = navEl ? navEl.getBoundingClientRect() : null;
      if (rect && rect.width < 20) rect = null;
      if (navEl && rect && frameNo % 3 === 0 && navEl.parentElement) opacity = parseFloat(getComputedStyle(navEl.parentElement).opacity) || 0;
      const barOn = !!rect && opacity > 0.04;

      let a = 0;
      let b = -1;
      let half = 0;
      if (rect) {
        half = rect.width / 2;
        navCx = rect.left + half;
        navTop = rect.top;
        const n = Math.min(HALF - 1, Math.floor((half - 1) / COL));
        a = HALF - n;
        b = HALF + n;
        const R = rect.height / 2;
        const flat = half - R;
        for (let i = a; i <= b; i++) {
          const ac = Math.abs((i - HALF) * COL);
          if (ac <= flat) drop[i] = 0;
          else {
            const dx = ac - flat;
            drop[i] = R - Math.sqrt(Math.max(0, R * R - dx * dx));
          }
        }
        // the part of the bar that went away drops its snow as clumps (the bar shrinks into the round button)
        if (prevA >= 0) {
          for (let i = prevA; i < a; i++) if (i % 2 === 0 && h[i] + h[i + 1] > 0.8) emit(navCx + (i - HALF) * COL, navTop + drop[i] - h[i], h[i] + h[i + 1], -1);
          for (let i = b + 1; i <= prevB; i++) if (i % 2 === 0 && h[i] + h[i + 1] > 0.8) emit(navCx + (i - HALF) * COL, navTop + drop[i] - h[i], h[i] + h[i + 1], 1);
          for (let i = prevA; i < a; i++) h[i] = 0;
          for (let i = b + 1; i <= prevB; i++) h[i] = 0;
        }
        if (!primed) {
          for (let i = a; i <= b; i++) h[i] = drop[i] < 1 ? BASE_H * lump[i] : 0;
          primed = true;
        }
        prevA = a;
        prevB = b;

        // ----- the snow settles: quiet layer grows back, steep heaps slump, ends slide off -----
        const grow = 1 - Math.exp(-dt / 3);
        for (let i = a + 1; i < b; i++) {
          const slope = Math.abs(drop[i + 1] - drop[i - 1]) / (2 * COL);
          const target = BASE_H * lump[i] * clamp(1 - slope / 0.7, 0, 1);
          if (h[i] < target) h[i] += (target - h[i]) * grow;
          if (h[i] > MAX_H) h[i] = MAX_H;
        }
        const M = COL * REPOSE;
        for (let pass = 0; pass < 2; pass++) {
          for (let i = a; i < b; i++) {
            const d = h[i] - drop[i] - (h[i + 1] - drop[i + 1]);
            if (d > M && h[i] > 0) {
              const mv = Math.min(h[i], (d - M) * 0.5);
              h[i] -= mv;
              h[i + 1] += mv;
            } else if (d < -M && h[i + 1] > 0) {
              const mv = Math.min(h[i + 1], (-d - M) * 0.5);
              h[i + 1] -= mv;
              h[i] += mv;
            }
          }
        }
        if (h[a] > 0.8) {
          emit(navCx + (a - HALF) * COL, navTop + drop[a] - h[a], h[a], -1);
          h[a] *= 0.4;
        }
        if (h[b] > 0.8) {
          emit(navCx + (b - HALF) * COL, navTop + drop[b] - h[b], h[b], 1);
          h[b] *= 0.4;
        }
      } else {
        prevA = -1;
        prevB = -1;
      }

      // ----- draw the snow on the bar -----
      if (barOn && rect && b > a) {
        // the shape that is drawn is the snow smoothed twice (soft puffy edge, not spikes)
        for (let pass = 0; pass < 2; pass++) {
          const src = pass === 0 ? h : sm0;
          const dst = pass === 0 ? sm0 : sm;
          for (let i = a; i <= b; i++) dst[i] = (src[i - 1 < a ? i : i - 1] + 2 * src[i] + src[i + 1 > b ? i : i + 1]) / 4;
        }
        // the snow is drawn on the flat top and a little way down the round ends, not all the way round the corner
        let da = a;
        let db = b;
        while (drop[da] > 12 && da < db) da++;
        while (drop[db] > 12 && db > da) db--;
        ctx.globalAlpha = clamp(opacity, 0, 1);
        const top = navTop - MAX_H - 2;
        const g = ctx.createLinearGradient(0, top, 0, navTop + 7);
        g.addColorStop(0, "#ffffff");
        g.addColorStop(0.55, "#eef5ff");
        g.addColorStop(1, "#b4c8e8");
        ctx.fillStyle = g;
        ctx.shadowColor = "rgba(190,214,255,0.55)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        for (let i = da; i <= db; i++) {
          const hs = sm[i];
          const x = navCx + (i - HALF) * COL;
          const y = navTop + drop[i] - hs;
          if (i === da) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        for (let i = db; i >= da; i--) {
          const hs = sm[i];
          const x = navCx + (i - HALF) * COL;
          ctx.lineTo(x, navTop + drop[i] + (2.2 + 2.2 * lump2[i]) * Math.min(1, hs / 2.5));
        }
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        // bright top edge
        ctx.strokeStyle = "rgba(255,255,255,0.95)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = da; i <= db; i++) {
          const hs = sm[i];
          const x = navCx + (i - HALF) * COL;
          const y = navTop + drop[i] - hs - 0.4;
          if (i === da) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        // cool shade where the snow hangs over the glass
        ctx.strokeStyle = "rgba(120,150,205,0.4)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let i = da; i <= db; i++) {
          const hs = sm[i];
          const x = navCx + (i - HALF) * COL;
          const y = navTop + drop[i] + (2.2 + 2.2 * lump2[i]) * Math.min(1, hs / 2.5);
          if (i === da) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // decoration: a snowman and two snowballs, only while the bar is wide (they melt into the cap when it shrinks)
        const deco = clamp((half * 2 - 220) / 80, 0, 1);
        if (deco > 0.02) {
          ctx.globalAlpha = clamp(opacity, 0, 1) * deco;
          const at = (fx: number) => {
            const i = clamp(Math.round((fx * half * 2 - half) / COL) + HALF, a, b);
            return navTop + drop[i] - sm[i] + 2;
          };
          snowman(navCx - half + half * 2 * 0.12, at(0.12));
          ball(navCx - half + half * 2 * 0.8, at(0.8) - 6, 6.5);
          ball(navCx - half + half * 2 * 0.855, at(0.855) - 9, 9.5);
          // glints on the snow
          ctx.globalAlpha = clamp(opacity, 0, 1);
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.lineWidth = 1;
          for (let k = 0; k < 5; k++) {
            const fx = [0.22, 0.38, 0.55, 0.7, 0.9][k];
            const tw = Math.max(0, Math.sin(t * 1.3 + k * 2.1));
            const al = tw * tw * tw * tw;
            if (al < 0.05) continue;
            const gx = navCx - half + half * 2 * fx;
            const gy = at(fx) - 2 - (k % 3);
            ctx.globalAlpha = clamp(opacity, 0, 1) * al * deco;
            ctx.beginPath();
            ctx.moveTo(gx - 2.4, gy);
            ctx.lineTo(gx + 2.4, gy);
            ctx.moveTo(gx, gy - 2.4);
            ctx.lineTo(gx, gy + 2.4);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      // ----- clumps that fell off the bar -----
      for (let i = clumps.length - 1; i >= 0; i--) {
        const c = clumps[i];
        c.vy += GRAV * dt;
        c.vx *= Math.exp(-dt * 0.6);
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        if (c.y > vh + 12) {
          clumps[i] = clumps[clumps.length - 1];
          clumps.pop();
          continue;
        }
        const s = c.r * 2.8;
        ctx.globalAlpha = 0.95;
        ctx.drawImage(sharp, c.x - s / 2, c.y - s / 2, s, s);
      }

      // ----- the falling flakes -----
      if (!reduce) {
        pvx *= Math.exp(-dt * 5);
        pvy *= Math.exp(-dt * 5);
        const R2 = 170 * 170;
        const pushing = Math.abs(pvx) + Math.abs(pvy) > 60;
        for (const f of flakes) {
          const wind = 14 * Math.sin(t * 0.35 + f.x * 0.0032 + f.y * 0.002) + 8 * Math.sin(t * 0.9 + f.y * 0.006) + 10 * Math.sin(t * 0.07);
          const tx = wind + f.sway * Math.cos(t * f.fq + f.ph);
          const ty = f.vt + f.sway * 0.6 * Math.sin(t * f.fq * 1.3 + f.ph);
          f.vx += (tx - f.vx) * (1 - Math.exp(-dt * 1.8));
          f.vy += (ty - f.vy) * (1 - Math.exp(-dt * 2.2));
          if (pushing) {
            const dx = f.x - px;
            const dy = f.y - py;
            const d2 = dx * dx + dy * dy;
            if (d2 < R2) {
              const k = 1 - Math.sqrt(d2) / 170;
              const accel = (k * k * 0.35) / (0.6 + f.r * 0.25);
              f.vx += pvx * accel * dt;
              f.vy += pvy * accel * dt;
            }
          }
          f.x += f.vx * dt;
          f.y += f.vy * dt;

          // lands on the snow of the bar
          if (barOn && rect && f.x > navCx - half + 2 && f.x < navCx + half - 2 && f.y > navTop - MAX_H - 8 && f.y < navTop + 30) {
            const i = clamp(Math.round((f.x - navCx) / COL) + HALF, a, b);
            if (f.y + f.r * 0.4 >= navTop + drop[i] - h[i]) {
              const vol = f.r * f.r * 4.2 * 3.1416; // fewer flakes now, so each one lands a little more snow
              for (let k = -4; k <= 4; k++) {
                const j = i + k;
                if (j >= a && j <= b) h[j] = Math.min(MAX_H, h[j] + (vol * WTS[k + 4]) / COL);
              }
              spawn(f, false);
              continue;
            }
          }
          if (f.y > vh + 10 || f.x < -60 || f.x > vw + 60) {
            spawn(f, false);
            continue;
          }
          const s = f.r * 2.8;
          ctx.globalAlpha = f.a * calm;
          ctx.drawImage(f.r > 2.7 ? soft : sharp, f.x - s / 2, f.y - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (raf || !wide.matches) return;
      canvas.style.display = "";
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ctx.clearRect(0, 0, vw, vh);
    };
    const onWide = () => (wide.matches ? start() : stop());
    const onResize = () => {
      resize();
      for (const f of flakes) if (f.x > vw + 60) f.x = Math.random() * vw;
    };
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else start();
    };

    start();
    wide.addEventListener("change", onWide);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      wide.removeEventListener("change", onWide);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="wn-canvas" aria-hidden />;
}
