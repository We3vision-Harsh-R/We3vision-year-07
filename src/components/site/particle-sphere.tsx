"use client";

import { useEffect, useRef } from "react";
import { TAU, clamp, easeInOut, easeOut, makeSprite, rgba, rng, smoothstep, type RGB } from "./anim-utils";

// Hero scene canvas: a slowly turning ball of glowing violet dots with a character (default "7") made of particles in
// its centre. Particles fly in when the page loads, ripple when you click the ball and follow the mouse a little.
// Two short lines of text ("Celebrating" above, "Years of We3vision" below) are made of particles in the same way as the
// character, so everything reads: Celebrating (7) Years of We3vision.
// `progress` (0 → 1) is driven by scrolling the pinned hero: the ball, the character and the texts break into tiny
// particles. They obey simple physics: a burst away from the ball, drag, a soft pull to their own resting place, bouncing
// off the edges of the screen and a push away from the pointer. Most of them settle in loose heaps at the LEFT and RIGHT
// edge of the screen, a part keeps drifting around as dust. Scrolling back up pulls them into the ball again.
// Plain 2D canvas, no libraries.

const CORE: RGB = [255, 255, 255];
const MID: RGB = [226, 170, 255];
const DEEP: RGB = [150, 80, 224];
const HALO: RGB = [166, 93, 224];

/** Turns text into a list of points (x, y in -1..1) so it can be drawn with particles. */
function sampleText(text: string, fontFamily: string) {
  const size = 140;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g || !text) return null;
  g.fillStyle = "#fff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `700 ${size * 0.92}px ${fontFamily || "sans-serif"}`;
  g.fillText(text, size / 2, size / 2 + size * 0.04);
  const data = g.getImageData(0, 0, size, size).data;
  const px: number[] = [];
  const py: number[] = [];
  let minX = size, maxX = -1, minY = size, maxY = -1;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[(y * size + x) * 4 + 3] < 128) continue;
      px.push(x);
      py.push(y);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (px.length === 0) return null;
  const half = Math.max(maxX - minX + 1, maxY - minY + 1) / 2;
  const mx = (minX + maxX) / 2;
  const my = (minY + maxY) / 2;
  return { xs: px.map((x) => (x - mx) / half), ys: py.map((y) => (y - my) / half) };
}

/** Same idea for a whole line of text: points in units of the font size, relative to the middle of the line. */
function sampleLine(text: string, fontFamily: string) {
  const S = 72;
  const c = document.createElement("canvas");
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g || !text) return null;
  const font = `600 ${S}px ${fontFamily || "sans-serif"}`;
  g.font = font;
  const w = Math.ceil(g.measureText(text).width) + 16;
  const h = Math.ceil(S * 1.5);
  c.width = w;
  c.height = h;
  g.font = font; // resizing the canvas resets its state
  g.fillStyle = "#fff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, w / 2, h / 2);
  const data = g.getImageData(0, 0, w, h).data;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] < 128) continue;
      xs.push((x - w / 2) / S);
      ys.push((y - h / 2) / S);
    }
  }
  return xs.length ? { xs, ys } : null;
}

type Ripple = { ix: number; iy: number; iz: number; age: number };

// Per-particle random numbers for "what happens when the ball breaks": when it is released, how hard it is thrown, which
// side it goes to and where it comes to rest (turned into screen positions while drawing).
function makeFlight(count: number, seed: number) {
  const rnd = rng(seed);
  const delay = new Float32Array(count);
  const rx = new Float32Array(count);
  const ry = new Float32Array(count);
  const power = new Float32Array(count);
  const side = new Float32Array(count);
  // 0 = settles in the (small) heap at the screen edge, 1 = stays as drifting dust, 2 = flies off and fades away
  const kind = new Uint8Array(count);
  for (let i = 0; i < count; i++) {
    delay[i] = rnd();
    rx[i] = rnd();
    ry[i] = rnd();
    power[i] = rnd();
    side[i] = rnd() < 0.5 ? -1 : 1;
    const k = rnd();
    kind[i] = k < 0.1 ? 0 : 2; // only 10% stay (in the two heaps), all the others fade away
  }
  return { delay, rx, ry, power, side, kind };
}
type Flight = ReturnType<typeof makeFlight>;

// Position and speed of every particle that has been released from the ball (see "physics" in the component).
type Body = { x: Float32Array; y: Float32Array; vx: Float32Array; vy: Float32Array; age: Float32Array; free: Uint8Array };
const makeBody = (n: number): Body => ({
  x: new Float32Array(n),
  y: new Float32Array(n),
  vx: new Float32Array(n),
  vy: new Float32Array(n),
  age: new Float32Array(n),
  free: new Uint8Array(n),
});

export function ParticleSphere({ mark = "7", above = "", below = "", scale = 1 }: { mark?: string; above?: string; below?: string; scale?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const host = canvas.parentElement;
    if (!host) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sprites = { core: makeSprite(CORE, 0.55, 32), mid: makeSprite(MID, 0.55, 32), deep: makeSprite(DEEP, 0.55, 32) };

    // --- layout (set on resize) ---
    let W = 0, H = 0, R = 1, cx = 0, cy = 0, dpr = 1;
    let quality = 1; // goes down on a slow machine (fewer particles, 1x pixels)

    // --- sphere particles ---
    let N = 0;
    let ux = new Float32Array(0), uy = ux, uz = ux, shell = ux, seed = ux, alpha = ux, size = ux, sx = ux, sy = ux, sz = ux;
    let cls = new Uint8Array(0);
    let fl = makeFlight(0, 1);
    let bodyS = makeBody(0);

    const buildSphere = (count: number) => {
      N = count;
      bodyS = makeBody(count);
      const mk = () => new Float32Array(count);
      ux = mk(); uy = mk(); uz = mk(); shell = mk(); seed = mk(); alpha = mk(); size = mk(); sx = mk(); sy = mk(); sz = mk();
      cls = new Uint8Array(count);
      fl = makeFlight(count, 31);
      const rnd = rng(7);
      for (let i = 0; i < count; i++) {
        const y = rnd() * 2 - 1;
        const a = rnd() * TAU;
        const r = Math.sqrt(1 - y * y);
        ux[i] = Math.cos(a) * r;
        uy[i] = y;
        uz[i] = Math.sin(a) * r;
        shell[i] = 1 + (rnd() - 0.5) * 0.1; // slightly thick shell: reads as a cloud, not a surface
        seed[i] = rnd();
        alpha[i] = 0.35 + rnd() * 0.65;
        size[i] = 1 - 0.55 * 0.5 + rnd() * 0.55;
        cls[i] = rnd() < 0.16 ? 0 : rnd() < 0.62 ? 1 : 2; // 0 = bright core, 1 = light violet, 2 = deep violet
        // where the particle starts before it flies into place
        sx[i] = (rnd() - 0.5) * 2;
        sy[i] = (rnd() - 0.5) * 2;
        sz[i] = (rnd() - 0.5) * 2;
      }
    };

    // --- mark particles (the "7") ---
    let M = 0;
    let mtx = new Float32Array(0), mty = mtx, mhx = mtx, mhy = mtx, mhz = mtx, mseed = mtx, msize = mtx;
    let mcls = new Uint8Array(0);
    let mfl = makeFlight(0, 1);
    let bodyM = makeBody(0);

    const buildMark = (count: number) => {
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-dm-sans").trim();
      const pts = sampleText(mark, family);
      if (!pts) {
        M = 0;
        return;
      }
      M = count;
      bodyM = makeBody(count);
      const mk = () => new Float32Array(count);
      mtx = mk(); mty = mk(); mhx = mk(); mhy = mk(); mhz = mk(); mseed = mk(); msize = mk();
      mcls = new Uint8Array(count);
      mfl = makeFlight(count, 57);
      const rnd = rng(991);
      for (let i = 0; i < count; i++) {
        const p = Math.floor(rnd() * pts.xs.length);
        mtx[i] = pts.xs[p] + (rnd() - 0.5) * 0.03;
        mty[i] = pts.ys[p] + (rnd() - 0.5) * 0.03;
        const y = rnd() * 2 - 1;
        const a = rnd() * TAU;
        const r = Math.sqrt(1 - y * y);
        const k = 0.35 + Math.pow(rnd(), 1.5) * 0.65;
        mhx[i] = Math.cos(a) * r * k;
        mhy[i] = y * k;
        mhz[i] = Math.sin(a) * r * k;
        mseed[i] = rnd();
        msize[i] = 0.7 + rnd() * 0.5;
        mcls[i] = rnd() < 0.55 ? 0 : 1;
      }
    };

    // --- text particles (the line above and the line below the ball) ---
    let T = 0;
    let ttx = new Float32Array(0), tty = ttx, thx = ttx, thy = ttx, thz = ttx, tseed = ttx, tsize = ttx;
    let tcls = new Uint8Array(0);
    let tfl = makeFlight(0, 1);
    let bodyT = makeBody(0);
    let lines: { xs: number[]; ys: number[]; y: number }[] = [];
    const samples = new Map<string, ReturnType<typeof sampleLine>>();

    // Lays the two lines out for the current screen size. Each line gets as many particles as its letters need.
    const buildTexts = () => {
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-dm-sans").trim();
      const F = W < 768 ? clamp(W * 0.092, 30, 40) : clamp(W * 0.04, 30, 56); // font size on screen, px
      const place = [
        { text: above, y: Math.max(98, cy - R * 1.22) },
        { text: below, y: Math.min(H - 160, cy + R * 1.4) },
      ];
      lines = [];
      let total = 0;
      for (const p of place) {
        if (!p.text) continue;
        if (!samples.has(p.text)) samples.set(p.text, sampleLine(p.text, family));
        const s = samples.get(p.text);
        if (!s) continue;
        lines.push({ xs: s.xs, ys: s.ys, y: p.y - cy });
        total += Math.round(clamp((s.xs.length * (F / 72) * (F / 72)) / 3.6, 300, 1200));
      }
      T = lines.length ? total : 0;
      bodyT = makeBody(T);
      if (T === 0) return;
      const mk = () => new Float32Array(T);
      ttx = mk(); tty = mk(); thx = mk(); thy = mk(); thz = mk(); tseed = mk(); tsize = mk();
      tcls = new Uint8Array(T);
      tfl = makeFlight(T, 83);
      const rnd = rng(313);
      let at = 0;
      for (const ln of lines) {
        const count = Math.round(clamp((ln.xs.length * (F / 72) * (F / 72)) / 3.6, 300, 1200));
        for (let k = 0; k < count && at < T; k++, at++) {
          const p = Math.floor(rnd() * ln.xs.length);
          ttx[at] = (ln.xs[p] + (rnd() - 0.5) * 0.005) * F;
          tty[at] = ln.y + (ln.ys[p] + (rnd() - 0.5) * 0.005) * F;
          const y = rnd() * 2 - 1;
          const a = rnd() * TAU;
          const r = Math.sqrt(1 - y * y);
          const kk = 0.35 + Math.pow(rnd(), 1.5) * 0.65;
          thx[at] = Math.cos(a) * r * kk;
          thy[at] = y * kk;
          thz[at] = Math.sin(a) * r * kk;
          tseed[at] = rnd();
          tsize[at] = clamp(F * 0.085, 2.6, 4.6) * (0.85 + rnd() * 0.3);
          tcls[at] = rnd() < 0.6 ? 0 : 1;
        }
      }
    };

    const setup = () => {
      const rect = host.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, quality < 1 ? 1 : 1.5);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      R = Math.min(W * 0.3, H * 0.34, 330) * scale;
      cx = W / 2;
      cy = H * 0.46;
      const small = W < 768;
      const want = Math.round((small ? 800 : 1700) * Math.min(1, scale * 1.4) * quality);
      if (N !== want) buildSphere(want);
    };

    // --- animation state ---
    let time = reduceMotion ? 10 : 0;
    let yaw = 0, spinVel = 0, flash = 0, ox = 0, oy = 0, tx = 0, ty = 0;
    let sceneP = 0; // 0 = ball whole, 1 = everything flown apart (sent by the pinned hero scene while you scroll)
    let rawP = 0, lastRaw = 0; // scroll progress of the whole hero (0..1), to feel how fast it is scrolled
    const ripples: Ripple[] = [];
    let raf = 0, last = 0, visible = true, alive = true;
    let emptied = false;
    let slow = 0; // frames in a row that took too long

    // latest ball rotation + centre, so a click can be mapped onto the ball
    const cur = { cosA: 1, sinA: 0, cosB: 1, sinB: 0, px: 0, py: 0 };

    // --- physics of the particles that have left the ball ---
    // When a particle is released it gets a burst away from the ball (towards its side of the screen). After that it is
    // pulled to its own resting place by a soft spring, slowed by drag, pushed away by the pointer and it bounces off the
    // edges of the screen. Most resting places form loose heaps along the left and right edge (dense at the edge, a few
    // strays further in); the rest are spread over the whole screen as dust. All numbers are per second / in pixels.
    const SPRING = 14;
    const DRAG = 3.4;
    const BOUNCE = 0.45;
    let ptrX = -1e4, ptrY = -1e4; // pointer, in screen pixels
    let mpx = -1e4, mpy = -1e4; // pointer, in canvas pixels
    let scrollV = 0; // how fast the page is being scrolled (progress per second); every scroll shakes the loose particles
    const WIND = 4500;
    let rX = 0, rY = 0; // resting place (result of restOf)
    const restOf = (f: Flight, i: number) => {
      if (f.kind[i] !== 1) {
        // dense at the edge, thinning out towards the middle; the inner border of the heap is wavy, not a straight line
        const wave = 0.6 + 0.4 * Math.sin(f.ry[i] * 11 + (f.side[i] < 0 ? 0 : 2));
        const d = W * 0.1 * wave * Math.pow(f.rx[i], 2.2);
        rX = f.side[i] < 0 ? 12 + d : W - 12 - d;
        rY = H * (0.1 + 0.8 * Math.pow(f.ry[i], 0.9));
      } else {
        rX = f.rx[i] * W;
        rY = f.ry[i] * H;
      }
    };
    // Result goes into fx / fy (kept outside to avoid creating objects 5000 times per frame).
    let fx = 0, fy = 0;
    // Returns -1 while the particle is still part of the ball (draw it where attX / attY say), otherwise how far its
    // release is (0..1, used for its size) and puts its position into fx / fy.
    const body = (b: Body, f: Flight, i: number, dt: number, sp: number, release: number, attX: number, attY: number) => {
      if (sp > release) {
        if (!b.free[i]) {
          b.free[i] = 1;
          b.age[i] = 0;
          b.x[i] = attX;
          b.y[i] = attY;
          let dx = attX - cx, dy = attY - cy;
          const l = Math.hypot(dx, dy) || 1;
          dx /= l;
          dy /= l;
          const v = W * (0.45 + f.power[i] * 0.8);
          b.vx[i] = (dx * 0.55 + f.side[i] * 0.85) * v;
          b.vy[i] = dy * 0.55 * v;
          if (reduceMotion) {
            restOf(f, i);
            b.x[i] = rX;
            b.y[i] = rY;
            b.vx[i] = b.vy[i] = 0;
            b.age[i] = 2;
          }
        } else if (dt > 0) {
          restOf(f, i);
          const dust = f.kind[i] === 1;
          const k = dust ? 1.2 : SPRING;
          const c = dust ? 1.6 : DRAG;
          let x = b.x[i], y = b.y[i], vx = b.vx[i], vy = b.vy[i];
          let ax = -k * (x - rX) - c * vx;
          let ay = -k * (y - rY) - c * vy;
          // scrolling shakes the particles: pushed up / down with the page and a little sideways, each in its own way
          ay -= scrollV * WIND * (0.4 + f.power[i]);
          ax += scrollV * WIND * 0.6 * (f.rx[i] - 0.5);
          const mx = x - mpx, my = y - mpy;
          const d2 = mx * mx + my * my;
          if (d2 < 12100) {
            const d = Math.sqrt(d2) || 1;
            const push = (1 - d / 110) * (1 - d / 110) * 2600;
            ax += (mx / d) * push;
            ay += (my / d) * push;
          }
          vx += ax * dt;
          vy += ay * dt;
          x += vx * dt;
          y += vy * dt;
          if (x < 0) { x = 0; vx = -vx * BOUNCE; } else if (x > W) { x = W; vx = -vx * BOUNCE; }
          if (y < 0) { y = 0; vy = -vy * BOUNCE; } else if (y > H) { y = H; vy = -vy * BOUNCE; }
          b.x[i] = x; b.y[i] = y; b.vx[i] = vx; b.vy[i] = vy;
          b.age[i] += dt;
        }
      } else if (b.free[i]) {
        // scrolled back up: the particle is pulled back into the ball
        const k = 1 - Math.exp(-dt * 8);
        b.x[i] += (attX - b.x[i]) * k;
        b.y[i] += (attY - b.y[i]) * k;
        b.age[i] = Math.max(0, b.age[i] - dt * 1.5);
        if (Math.hypot(attX - b.x[i], attY - b.y[i]) < 3) {
          b.free[i] = 0;
          return -1;
        }
      } else return -1;
      fx = b.x[i];
      fy = b.y[i];
      if (f.kind[i] === 1) {
        fx += Math.sin(time * 0.25 + f.rx[i] * TAU) * 6; // dust keeps drifting a little
        fy += Math.cos(time * 0.21 + f.ry[i] * TAU) * 5;
      }
      return clamp(b.age[i] / 0.9);
    };

    const draw = (dt: number) => {
      time += dt;
      const sp = clamp(sceneP);
      // the particles that settled in the heaps at the sides do not stay: while the services open, they go out of focus and fade away
      const hf = easeInOut(clamp((rawP - 0.4) / 0.24));
      if (hf >= 1 && sp >= 1) {
        // every dot has faded away: clear the canvas once and do no more work until you scroll back
        if (!emptied) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, W, H);
          emptied = true;
        }
        lastRaw = rawP;
        return;
      }
      emptied = false;
      const sdt = reduceMotion ? 0 : Math.min(dt, 0.04); // physics step
      scrollV = sdt > 0 ? clamp((rawP - lastRaw) / sdt, -0.6, 0.6) : 0;
      lastRaw = rawP;
      const hr = host.getBoundingClientRect();
      mpx = ptrX - hr.left;
      mpy = ptrY - hr.top;
      ox += (tx * 6 - ox) * (1 - Math.exp(-dt / 0.12));
      oy += (ty * 6 - oy) * (1 - Math.exp(-dt / 0.12));
      if (!reduceMotion) {
        const speed = (6 * Math.PI) / 180;
        yaw -= (speed * (1 + 2 * sp) + spinVel) * dt; // turns leftward, faster while it breaks
        spinVel *= Math.exp(-dt * 1.8);
      }
      flash *= Math.exp(-dt * 3);
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].age += dt;
        if (ripples[i].age > 3.2) ripples.splice(i, 1);
      }

      const tilt = (-8 * Math.PI) / 180 + (reduceMotion ? 0 : Math.sin(time * 0.15 * TAU) * (2 * Math.PI) / 180);
      const A = yaw + ox * 0.012;
      const B = tilt + oy * 0.008;
      const cosA = Math.cos(A), sinA = Math.sin(A), cosB = Math.cos(B), sinB = Math.sin(B);
      const px = cx + ox, py = cy + oy + (reduceMotion ? 0 : Math.sin(time * 0.4) * 4); // gentle floating motion
      const P = 2.6;
      const dot = (6.8 * R) / 198; // dot size scales with the ball
      const lx = 0.15, ly = 0.7, lz = 0.7;
      const ll = Math.hypot(lx, ly, lz);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      // halo
      const haloFade = clamp(1 - sp * 2.2);
      if (haloFade > 0.01) {
        const hr = R * 1.5;
        const g = ctx.createRadialGradient(px, py, 0, px, py, hr);
        g.addColorStop(0, rgba(HALO, 0.3 * haloFade));
        g.addColorStop(0.55, rgba(HALO, 0.08 * haloFade));
        g.addColorStop(1, rgba(HALO, 0));
        ctx.fillStyle = g;
        ctx.fillRect(px - hr, py - hr, hr * 2, hr * 2);
      }

      const markProgress = M > 0 ? easeInOut(clamp((time - 1.1) / 1.7)) : 0;
      const twinkleT = time * 0.6 * TAU;

      for (let i = 0; i < N; i++) {
        const sd = seed[i];
        // fly in when the page loads
        const e = easeOut(clamp((time - 0.15 - sd * 0.8) / 1.4));
        const scatterIn = (1 - e) * 1.25;

        let x = ux[i] * shell[i], y = uy[i] * shell[i], z = uz[i] * shell[i];
        const nx = ux[i], ny = uy[i], nz = uz[i];

        // click ripples: a wave of outward push travelling over the ball
        for (let k = 0; k < ripples.length; k++) {
          const rp = ripples[k];
          const theta = Math.acos(clamp(nx * rp.ix + ny * rp.iy + nz * rp.iz, -1, 1));
          const front = rp.age * 2.2 * 0.7;
          const d = (theta - front) / 0.45;
          const push = 0.45 * 0.4 * Math.exp(-d * d) * Math.exp(-1.1 * rp.age);
          x += nx * push; y += ny * push; z += nz * push;
        }

        x += sx[i] * scatterIn;
        y += sy[i] * scatterIn;
        z += sz[i] * scatterIn;

        // rotate: yaw then pitch
        const x1 = x * cosA + z * sinA;
        const z1 = -x * sinA + z * cosA;
        const y2 = y * cosB - z1 * sinB;
        const z2 = y * sinB + z1 * cosB;
        const f = P / (P - clamp(z2, -1.2, 1.5));
        let scrX = px + x1 * R * f;
        let scrY = py + y2 * R * f;

        // light on the (rotated) surface normal
        const n1 = nx * cosA + nz * sinA;
        const nz1 = -nx * sinA + nz * cosA;
        const ny2 = ny * cosB - nz1 * sinB;
        const nz2 = ny * sinB + nz1 * cosB;
        const lit = clamp((n1 * lx + ny2 * ly + nz2 * lz) / ll);
        const depth = 0.45 + 0.55 * clamp((z2 + 1) / 2);
        const rim = 1 + 0.9 * (1 - Math.abs(nz2)) * 0.5;
        const twinkle = 1 - 0.18 + 0.18 * (0.5 + 0.5 * Math.sin(twinkleT + sd * TAU));

        let a = alpha[i] * (0.35 + 0.65 * lit) * depth * rim * twinkle * e;
        if (markProgress > 0 && z2 > 0 && sp < 0.3) {
          // keep the middle clear so the character reads
          const dd = Math.hypot(scrX - px, scrY - py) / R;
          a *= 1 - markProgress * (1 - smoothstep(0.45 * 0.55, 0.45 * 1.2, dd)) * (1 - sp / 0.3);
        }

        // scrolling: this particle leaves the ball and the physics takes over
        let sizeK = 1;
        const fe = body(bodyS, fl, i, sdt, sp, 0.02 + fl.delay[i] * 0.62, scrX, scrY);
        if (fe >= 0) {
          scrX = fx;
          scrY = fy;
          sizeK = 1 - 0.4 * fe;
          a *= fl.kind[i] === 1 ? 1 - 0.45 * fe : fl.kind[i] === 2 ? 1 - fe : 1;
          if (fl.kind[i] !== 2) {
            a *= 1 - hf;
            sizeK *= 1 + 1.7 * hf;
          }
        }

        if (a < 0.01) continue;
        const s = dot * size[i] * f * 1.9 * sizeK;
        ctx.globalAlpha = a > 1 ? 1 : a;
        ctx.drawImage(cls[i] === 0 ? sprites.core : cls[i] === 1 ? sprites.mid : sprites.deep, scrX - s / 2, scrY - s / 2, s, s);
      }

      // the character: particles leave the ball and settle into its shape (later they break apart again on scroll)
      if (M > 0) {
        const markR = 0.46 * R * (1 + 0.03 * Math.sin(time * 1.6));
        if (markProgress > 0.02 && haloFade > 0.01) {
          const g = ctx.createRadialGradient(px, py, 0, px, py, markR * 1.8);
          const ga = 0.35 * markProgress * haloFade;
          g.addColorStop(0, rgba(HALO, ga));
          g.addColorStop(1, rgba(HALO, 0));
          ctx.fillStyle = g;
          ctx.globalAlpha = 1;
          ctx.fillRect(px - markR * 1.8, py - markR * 1.8, markR * 3.6, markR * 3.6);
        }
        const bright = Math.min(1, 0.9 + flash * 0.3);
        for (let i = 0; i < M; i++) {
          const pi = easeOut(clamp((time - 1.1 - mseed[i] * 0.6) / 1.1));
          // start: somewhere inside the turning ball
          const x1 = mhx[i] * cosA + mhz[i] * sinA;
          const z1 = -mhx[i] * sinA + mhz[i] * cosA;
          const y2 = mhy[i] * cosB - z1 * sinB;
          const z2 = mhy[i] * sinB + z1 * cosB;
          const f0 = P / (P - z2);
          const startX = px + x1 * R * f0;
          const startY = py + y2 * R * f0;
          const endX = px + mtx[i] * markR;
          const endY = py + mty[i] * markR;
          let scrX = startX + (endX - startX) * pi;
          let scrY = startY + (endY - startY) * pi;
          let a = bright * (0.35 + 0.65 * pi);
          let sizeK = 1;
          const fe = body(bodyM, mfl, i, sdt, sp, mfl.delay[i] * 0.5, scrX, scrY); // the character starts breaking first
          if (fe >= 0) {
            scrX = fx;
            scrY = fy;
            sizeK = 1 - 0.4 * fe;
            a *= mfl.kind[i] === 1 ? 1 - 0.45 * fe : mfl.kind[i] === 2 ? 1 - fe : 1;
            if (mfl.kind[i] !== 2) {
              a *= 1 - hf;
              sizeK *= 1 + 1.7 * hf;
            }
          }
          if (a < 0.01) continue;
          const s = dot * 1.15 * 0.55 * msize[i] * 1.9 * (1 + flash * 0.5) * sizeK;
          ctx.globalAlpha = a > 1 ? 1 : a;
          ctx.drawImage(mcls[i] === 0 ? sprites.core : sprites.mid, scrX - s / 2, scrY - s / 2, s, s);
        }
      }

      // the two lines of text: they come out of the ball and settle into letters, and break apart like the character
      if (T > 0) {
        for (let i = 0; i < T; i++) {
          const pi = easeOut(clamp((time - 1.7 - tseed[i] * 0.8) / 1.2));
          const x1 = thx[i] * cosA + thz[i] * sinA;
          const z1 = -thx[i] * sinA + thz[i] * cosA;
          const y2 = thy[i] * cosB - z1 * sinB;
          const z2 = thy[i] * sinB + z1 * cosB;
          const f0 = P / (P - z2);
          const startX = px + x1 * R * f0;
          const startY = py + y2 * R * f0;
          let scrX = startX + (px + ttx[i] - startX) * pi;
          let scrY = startY + (py + tty[i] - startY) * pi;
          let a = 0.35 + 0.65 * pi;
          let sizeK = 1;
          const fe = body(bodyT, tfl, i, sdt, sp, tfl.delay[i] * 0.5, scrX, scrY);
          if (fe >= 0) {
            scrX = fx;
            scrY = fy;
            sizeK = 1 - 0.4 * fe;
            a *= tfl.kind[i] === 1 ? 1 - 0.45 * fe : tfl.kind[i] === 2 ? 1 - fe : 1;
            if (tfl.kind[i] !== 2) {
              a *= 1 - hf;
              sizeK *= 1 + 1.7 * hf;
            }
          }
          if (a < 0.01) continue;
          const s = tsize[i] * (1 + flash * 0.3) * sizeK * 1.9;
          ctx.globalAlpha = a > 1 ? 1 : a;
          ctx.drawImage(tcls[i] === 0 ? sprites.core : sprites.mid, scrX - s / 2, scrY - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      // keep the pointer-to-ball mapping current for clicks
      cur.cosA = cosA; cur.sinA = sinA; cur.cosB = cosB; cur.sinB = sinB; cur.px = px; cur.py = py;
    };

    const frame = (now: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = 0;
        return;
      }
      const dt = last ? Math.min((now - last) / 1000, 0.2) : 0;
      if (sceneP < 0.01 && dt > 0 && dt < 0.03) return; // the ball only turns slowly: about 33 frames a second are plenty
      last = now;
      draw(dt);
      // a machine that cannot keep up gets fewer particles and 1x pixels (once)
      if (quality === 1 && !emptied && sceneP < 0.02) {
        slow = dt > 0.03 ? slow + 1 : Math.max(0, slow - 2);
        if (slow > 40) {
          quality = 0.6;
          setup();
          buildTexts();
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      ptrX = e.clientX;
      ptrY = e.clientY;
      tx = clamp((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2), -1, 1);
      ty = clamp((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2), -1, 1);
    };
    const onDown = (e: PointerEvent) => {
      if (reduceMotion || !visible || sceneP > 0.05) return;
      const rect = canvas.getBoundingClientRect();
      const dx = (e.clientX - rect.left - cur.px) / R;
      const dy = (e.clientY - rect.top - cur.py) / R;
      const l = dx * dx + dy * dy;
      if (l > 1) return;
      const z = Math.sqrt(1 - l);
      // screen point -> ball space (undo pitch, then yaw)
      const y = dy * cur.cosB + z * cur.sinB;
      const z1 = -dy * cur.sinB + z * cur.cosB;
      const x = dx * cur.cosA - z1 * cur.sinA;
      const zz = dx * cur.sinA + z1 * cur.cosA;
      ripples.push({ ix: x, iy: y, iz: zz, age: 0 });
      if (ripples.length > 3) ripples.shift();
      spinVel += 0.8 * 0.5;
      flash = 0.7;
    };

    let started = false;
    const start = () => {
      if (started || !alive) return;
      started = true;
      setup();
      buildMark(Math.round((W < 768 ? 320 : 600) * Math.min(1, scale * 1.5)));
      buildTexts();
      draw(0);
      if (!reduceMotion) raf = requestAnimationFrame(frame);
    };

    if (process.env.NODE_ENV !== "production") {
      // development helper: jump to a moment of the animation (hidden browser panes do not run animation frames)
      (window as unknown as { __sphereSeek?: (t: number) => void }).__sphereSeek = (t) => {
        time = t;
        draw(0);
      };
      // ... and let the physics run for a number of seconds
      (window as unknown as { __sphereSim?: (s: number) => void }).__sphereSim = (s) => {
        for (let k = 0; k < Math.round(s * 60); k++) draw(1 / 60);
      };
    }

    // wait for the site font so the character is drawn in it
    document.fonts.ready.then(start, start);

    const resizeObserver = new ResizeObserver(() => {
      if (!started) return;
      setup();
      buildTexts();
      if (reduceMotion) draw(0);
    });
    resizeObserver.observe(host);
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "200px" });
    observer.observe(host);
    const onProgress = (e: Event) => {
      sceneP = (e as CustomEvent<number>).detail;
      if (reduceMotion && started) draw(0);
    };
    const onRaw = (e: Event) => {
      rawP = (e as CustomEvent<number>).detail;
    };
    window.addEventListener("hero-progress", onProgress);
    window.addEventListener("hero-raw", onRaw);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("hero-progress", onProgress);
      window.removeEventListener("hero-raw", onRaw);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [mark, above, below, scale]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />;
}
