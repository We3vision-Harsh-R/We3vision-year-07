// The particle engine of the festival layer. Particles live at three distances (far, middle, near) but are drawn on only TWO canvases over the
// whole page: the far and the middle ones on a "back" canvas that has half the pixels (stretched by CSS, so it is naturally soft = the blur of the
// distance, without a CSS filter and at a quarter of the cost), the near ones sharp on the "front" canvas. The far ones are also smaller, slower
// and dimmer, so fireworks, embers and petals still fill a 3D space.
// Everything that flies is a particle with a position, a speed, gravity and a life; the loop runs only while something is alive or an
// ambient effect (fireworks, embers, petals, anar fountains) is on, and it stops while the tab is hidden. A canvas that has nothing on it is
// not cleared again (no work for the graphics card), and the engine watches its own frame time: on a slow computer it lowers the amount
// of particles by itself (and raises it again when there is room), so the page stays smooth with every effect on.
// Fireworks follow real physics (fest-physics.ts): a rocket is a ballistic body that stops at the top and bursts there, the stars of a burst fly
// out over a SPHERE, are stopped by the air and then drift down, burn white-hot -> colour -> ember and leave a streak of where they were.
// No React in here: the layer (fest-top.tsx) creates the engine, the pointer effects (fest-pointer.tsx) and the places call burst() / rocket().

import { ROCKET_G, launchSpeed, ringDir, sphereDir, starAlpha, starColour, starSpeed } from "./fest-physics";

export type Depth = 0 | 1 | 2; // far, middle, near
/** scale of sizes and speeds, opacity, and the canvas of the three distances (0 = the soft back canvas, 1 = the sharp front canvas) */
export const DEPTHS = [
  { k: 0.42, a: 0.6, cv: 0 },
  { k: 0.7, a: 0.85, cv: 0 },
  { k: 1, a: 1, cv: 1 },
] as const;
/** the resolution of the back canvas (a fraction of a CSS pixel): fewer pixels = softer and cheaper */
const BACK_RES = 0.5;
/** the most particles one distance may hold at full quality */
const CAP = 700;

export type BurstType = "peony" | "willow" | "ring" | "chrysanthemum" | "crackle";
export const BURST_TYPES: BurstType[] = ["peony", "willow", "ring", "chrysanthemum", "crackle"];

type Kind = "spark" | "star" | "glitter" | "ember" | "petal" | "trail";
type P = {
  kind: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ay: number;
  drag: number;
  delay: number;
  life: number;
  max: number;
  size: number;
  h: number;
  s: number;
  l: number;
  rot: number;
  vr: number;
  /** petals: sway and flip phase; stars: flicker phase */
  ph: number;
  /** stars: the second colour (hue) they burn towards, the depth into the screen and its speed */
  h2: number;
  z: number;
  vz: number;
  /** stars: seconds between two samples of the streak (a longer time = a longer tail), the clock of that, and the three last places */
  tr: number;
  tt: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  /** stars of a crackle: pop into glitter when they burn out */
  crk: boolean;
};
type Flash = { x: number; y: number; r: number; life: number; max: number; h: number; l: number; a: number };
type Rocket = { x: number; y: number; vx: number; vy: number; ty: number; t: number; h: number; type: BurstType; scale: number; ph: number };
type Fountain = { x: number; y: number; until: number; acc: number; depth: Depth };
type Layer = { ps: P[]; flashes: Flash[]; rockets: Rocket[] };
type Surface = { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; w: number; h: number; drawn: boolean };

/** festival colours as [hue, saturation %, lightness %] */
const COLORS: [number, number, number][] = [
  [45, 100, 62],
  [30, 100, 58],
  [8, 95, 60],
  [140, 70, 55],
  [330, 85, 66],
  [195, 90, 62],
  [50, 100, 88],
  [282, 80, 70],
];
/** the kinds of burst: how many stars, their air drag (1/s), life (s), gravity (px/s^2, small: a star is light), streak sampling (s) and size (px) */
const SHELLS: Record<BurstType, { n: number; drag: number; life: [number, number]; g: number; tr: number; size: [number, number] }> = {
  peony: { n: 124, drag: 2.1, life: [1.6, 2.2], g: 95, tr: 0.026, size: [1.9, 2.9] },
  chrysanthemum: { n: 104, drag: 2, life: [2.1, 2.8], g: 120, tr: 0.045, size: [1.8, 2.7] },
  willow: { n: 84, drag: 1.55, life: [2.8, 3.6], g: 175, tr: 0.08, size: [1.9, 2.8] },
  ring: { n: 66, drag: 2.3, life: [1.5, 2], g: 80, tr: 0.03, size: [2, 2.9] },
  crackle: { n: 84, drag: 2.1, life: [1.5, 2.1], g: 100, tr: 0.022, size: [1.7, 2.5] },
};
/** a particle with every field filled in (its streak starts where it is) */
const mk = (p: Partial<P> & Pick<P, "kind" | "x" | "y">): P => {
  const c = pick(COLORS);
  return { vx: 0, vy: 0, ay: 0, drag: 0, delay: 0, life: 1, max: 1, size: 1.6, h: c[0], s: c[1], l: c[2], rot: 0, vr: 0, ph: Math.random() * 6.28, h2: p.h ?? c[0], z: 0, vz: 0, tr: 0, tt: 0, x1: p.x, y1: p.y, x2: p.x, y2: p.y, x3: p.x, y3: p.y, crk: false, ...p };
};
const DENSITY = { low: 0.55, normal: 1, rich: 1.6 } as const;
export type EngineDensity = keyof typeof DENSITY;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];

export type Ambient = { fireworks: boolean; embers: boolean; petals: boolean; anar: boolean };

export class FestEngine {
  private layers: Layer[];
  private surfaces: Surface[];
  private w = 0;
  private h = 0;
  private density = 1;
  /** 0.3 .. 1: lowered by itself when the frames get slow */
  private quality = 1;
  private slow = 0;
  private raf = 0;
  private last = 0;
  private time = 0;
  private ambient: Ambient = { fireworks: false, embers: false, petals: false, anar: false };
  private nextFirework = 0.8;
  private emberAcc = 0;
  private petalAcc = 0;
  private nextAnar = 3;
  private fountains: Fountain[] = [];
  private onVisibility = () => {
    if (!document.hidden) this.kick();
  };
  private onResize = () => this.resize();

  /** canvases: [back, front] */
  constructor(canvases: HTMLCanvasElement[], density: EngineDensity = "normal") {
    this.density = DENSITY[density];
    this.layers = [0, 1, 2].map(() => ({ ps: [], flashes: [], rockets: [] }));
    this.surfaces = canvases.map((canvas) => ({ canvas, ctx: canvas.getContext("2d") as CanvasRenderingContext2D, w: 0, h: 0, drawn: false }));
    this.resize();
    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  destroy() {
    if (this.raf > 0) cancelAnimationFrame(this.raf);
    this.raf = 0;
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibility);
    for (const sf of this.surfaces) sf.ctx.clearRect(0, 0, sf.w, sf.h);
  }

  setDensity(d: EngineDensity) {
    this.density = DENSITY[d];
  }

  setAmbient(a: Ambient) {
    this.ambient = a;
    if (a.fireworks || a.embers || a.petals || a.anar) this.kick();
  }

  private resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.w = w;
    this.h = h;
    this.surfaces.forEach((sf, i) => {
      // the back canvas is soft on purpose (half the pixels); the front one is sharp, but a retina screen gets at most 1.25x
      const res = i === 0 ? BACK_RES : Math.min(window.devicePixelRatio || 1, 1.25);
      sf.w = w;
      sf.h = h;
      sf.canvas.width = Math.max(1, Math.round(w * res));
      sf.canvas.height = Math.max(1, Math.round(h * res));
      sf.ctx.setTransform(res, 0, 0, res, 0, 0);
      sf.drawn = true; // cleared once on the next frame
    });
  }

  /** (re)starts the loop */
  private kick() {
    if (this.raf || document.hidden) return;
    this.last = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  private busy() {
    const a = this.ambient;
    return a.fireworks || a.embers || a.petals || a.anar || this.fountains.length > 0 || this.layers.some((l) => l.ps.length || l.flashes.length || l.rockets.length);
  }

  // ------------------------------------------------------------------ making things fly

  private add(depth: Depth, p: Partial<P> & Pick<P, "kind" | "x" | "y">) {
    const L = this.layers[depth];
    if (!L) return;
    const cap = Math.round(CAP * this.quality);
    if (L.ps.length > cap) L.ps.splice(0, L.ps.length - cap);
    L.ps.push(mk(p));
    this.kick();
  }

  /** one spark (the sparkler of the pointer, the tail of a rocket ...) */
  spark(x: number, y: number, o: { depth?: Depth; vx?: number; vy?: number; ay?: number; life?: number; size?: number; hue?: number; sat?: number; light?: number; glitter?: boolean } = {}) {
    const d = o.depth ?? 2;
    const k = DEPTHS[d].k;
    const c = pick(COLORS.slice(0, 3));
    const life = o.life ?? rnd(0.45, 0.9);
    this.add(d, {
      kind: o.glitter ? "glitter" : "spark",
      x,
      y,
      vx: (o.vx ?? rnd(-40, 40)) * k,
      vy: (o.vy ?? rnd(-60, 10)) * k,
      ay: (o.ay ?? 220) * k,
      drag: 1.4,
      life,
      max: life,
      size: (o.size ?? rnd(1.2, 2.2)) * (0.6 + 0.4 * k),
      h: o.hue ?? c[0],
      s: o.sat ?? c[1],
      l: o.light ?? c[2] + 8,
    });
  }

  /** one marigold petal that falls with a sway */
  petal(x: number, y: number, o: { depth?: Depth; vx?: number; vy?: number; size?: number } = {}) {
    const d = o.depth ?? 2;
    const k = DEPTHS[d].k;
    const orange = Math.random() < 0.7;
    const life = rnd(5, 9) / (0.6 + 0.4 * k);
    this.add(d, {
      kind: "petal",
      x,
      y,
      vx: (o.vx ?? rnd(-16, 16)) * k,
      vy: (o.vy ?? rnd(34, 70)) * k,
      life,
      max: life,
      size: (o.size ?? rnd(6, 11)) * k,
      h: orange ? rnd(26, 42) : rnd(330, 350),
      s: 95,
      l: orange ? rnd(50, 60) : rnd(60, 70),
      rot: rnd(0, 6.28),
      vr: rnd(-1.6, 1.6),
    });
  }

  /** a glow where something burst: a short white one at the bang and a longer warm one of the colour of the stars */
  private flash(depth: Depth, x: number, y: number, r: number, h: number, life = 0.9, l = 72, a = 0.3) {
    this.layers[depth]?.flashes.push({ x, y, r: r * DEPTHS[depth].k, life, max: life, h, l, a });
    this.kick();
  }

  /** a burst of a kind at a place; `scale` 1 = the size of a big firework. The stars start on a sphere (a ring: in a tilted plane), so a burst is
   *  round from every side; the air stops them (drag), gravity lets them sink, and each one burns white-hot -> its colour -> an ember. */
  burst(x: number, y: number, o: { depth?: Depth; type?: BurstType; scale?: number; color?: number } = {}) {
    const depth = o.depth ?? 2;
    const type = o.type ?? pick(BURST_TYPES);
    const sh = SHELLS[type];
    const k = DEPTHS[depth].k;
    const R = rnd(130, 200) * (o.scale ?? 1) * k; // how far the stars reach (px)
    const col = type === "willow" ? ([42, 100, 62] as [number, number, number]) : COLORS[(o.color ?? Math.floor(Math.random() * COLORS.length)) % COLORS.length];
    const col2 = pick(COLORS);
    const q = this.density * this.quality;
    const n = Math.round(sh.n * q * (0.55 + 0.45 * k));
    const spin = rnd(0, 6.2832);
    const tilt = rnd(0.25, 1.15);
    this.flash(depth, x, y, R * 0.55, 48, 0.16, 96, 0.55);
    this.flash(depth, x, y, R * 1.3, col[0], 0.9, 70, 0.3);
    for (let i = 0; i < n; i++) {
      const [dx, dy, dz] = type === "ring" ? ringDir(i, n, tilt, spin) : sphereDir(i, n, spin);
      const life = rnd(sh.life[0], sh.life[1]);
      const kd = sh.drag * rnd(0.93, 1.07);
      const v = starSpeed(R * rnd(0.9, 1), kd, life);
      const c = type === "crackle" ? ([i % 2 ? 46 : 38, 100, 66] as [number, number, number]) : col;
      this.add(depth, {
        kind: "star",
        x,
        y,
        vx: dx * v,
        vy: dy * v,
        vz: dz * v,
        ay: sh.g * k,
        drag: kd,
        life,
        max: life,
        size: rnd(sh.size[0], sh.size[1]) * (0.55 + 0.45 * k),
        h: c[0] + rnd(-4, 4),
        h2: type === "willow" ? 28 : type === "chrysanthemum" ? c[0] - 22 : c[0],
        s: c[1],
        l: c[2],
        tr: sh.tr,
        crk: type === "crackle",
      });
    }
    // a pistil: a smaller second sphere of another colour inside (many real shells have one)
    if ((type === "peony" || type === "chrysanthemum") && Math.random() < 0.55) {
      const m = Math.round(n * 0.34);
      for (let i = 0; i < m; i++) {
        const [dx, dy, dz] = sphereDir(i, m, spin + 1);
        const life = rnd(1, 1.5);
        const v = starSpeed(R * 0.42, 2.2, life);
        this.add(depth, { kind: "star", x, y, vx: dx * v, vy: dy * v, vz: dz * v, ay: sh.g * k, drag: 2.2, life, max: life, size: rnd(1.3, 2) * (0.55 + 0.45 * k), h: col2[0], h2: col2[0], s: col2[1], l: col2[2], tr: 0.02 });
      }
    }
    // the crackle: tiny white glitter that twinkles after the bang
    const g = Math.round((type === "crackle" ? 40 : 18) * q * k);
    for (let i = 0; i < g; i++) {
      const a = rnd(0, 6.2832);
      const sp = R * rnd(0.2, 0.75);
      const life = rnd(0.9, 1.9);
      this.add(depth, { kind: "glitter", x, y, vx: Math.cos(a) * sp * 0.9, vy: Math.sin(a) * sp * 0.9, ay: 50 * k, drag: 1.5, delay: rnd(0.3, 0.8), life, max: life, size: rnd(1, 1.8), h: 48, s: 100, l: 92 });
    }
  }

  /** a rocket from (x, y) that is thrown up with exactly the speed that lets gravity stop it at height ty (v^2 = 2 g h); it is fast at the start and
   *  nearly still at the top, where it bursts. */
  rocket(x: number, y: number, ty: number, o: { depth?: Depth; type?: BurstType; scale?: number } = {}) {
    const depth = o.depth ?? 2;
    const L = this.layers[depth];
    if (!L) return;
    L.rockets.push({ x, y, vx: rnd(-14, 14), vy: -launchSpeed(Math.max(10, y - ty)), ty, t: 0, h: pick(COLORS)[0], type: o.type ?? pick(BURST_TYPES), scale: o.scale ?? 1, ph: rnd(0, 6.28) });
    this.kick();
  }

  /** a fountain of sparks (an anar) at the bottom of the window for `seconds` */
  fountain(x: number, y: number, seconds: number, depth: Depth = 2) {
    this.fountains.push({ x, y, until: this.time + seconds, acc: 0, depth });
    this.kick();
  }

  // ------------------------------------------------------------------ the loop

  private frame = (now: number) => {
    // -1 = "inside a frame": the particles added while this frame runs call kick(), which must NOT ask for another frame (only the line at the
    // end does). Without this every frame asked for two, the loops doubled every frame and the page stopped.
    this.raf = -1;
    if (document.hidden) {
      this.raf = 0;
      return;
    }
    const raw = this.last ? (now - this.last) / 1000 : 0.016;
    const dt = Math.min(0.05, raw);
    this.last = now;
    this.tune(raw);
    this.time += dt;
    this.step(dt);
    this.draw();
    this.raf = this.busy() ? requestAnimationFrame(this.frame) : 0;
  };

  /** the self-tuning: frames slower than ~24 ms (under ~40 fps) for a while lower the quality, quick frames raise it again */
  private tune(raw: number) {
    if (raw > 0.2) return; // the tab came back, or a one-off stall: not the effects
    this.slow = this.slow * 0.94 + raw * 0.06;
    if (this.slow > 0.024) this.quality = Math.max(0.3, this.quality - 0.01);
    else if (this.slow < 0.0185) this.quality = Math.min(1, this.quality + 0.002);
  }

  private step(dt: number) {
    const w = this.w || window.innerWidth;
    const h = this.h || window.innerHeight;
    const a = this.ambient;
    const dens = this.density * this.quality;

    // ambient fireworks: a rocket rises from the bottom to a place in the sky and bursts, at a random distance
    if (a.fireworks && this.time >= this.nextFirework) {
      this.nextFirework = this.time + rnd(1.2, 2.8) / dens;
      const depth = pick([0, 0, 1, 1, 2] as Depth[]);
      const x = rnd(0.08, 0.92) * w;
      const ty = rnd(0.1, 0.45) * h;
      this.rocket(x + rnd(-40, 40), h + 10, ty, { depth, scale: rnd(0.8, 1.15) });
    }
    if (a.embers) {
      this.emberAcc += dt * 20 * dens;
      while (this.emberAcc >= 1) {
        this.emberAcc -= 1;
        const depth = pick([0, 1, 1, 2, 2] as Depth[]);
        const k = DEPTHS[depth].k;
        const life = rnd(3.5, 7);
        this.add(depth, { kind: "ember", x: rnd(0, w), y: h + 8, vx: rnd(-14, 14) * k, vy: -rnd(30, 90) * k, ay: -6, drag: 0.05, life, max: life, size: rnd(1.4, 3.2) * (0.6 + 0.4 * k), h: rnd(26, 46), s: 100, l: rnd(55, 70), ph: rnd(0, 6.28) });
      }
    }
    if (a.petals) {
      this.petalAcc += dt * 3.4 * dens;
      while (this.petalAcc >= 1) {
        this.petalAcc -= 1;
        this.petal(rnd(-0.05, 1.05) * w, -14, { depth: pick([0, 1, 1, 2, 2] as Depth[]) });
      }
    }
    if (a.anar && this.time >= this.nextAnar) {
      this.nextAnar = this.time + rnd(9, 16);
      this.fountain(rnd(0.04, 0.12) * w, h + 6, 2.6, 2);
      this.fountain(rnd(0.88, 0.96) * w, h + 6, 2.6, 2);
    }

    // anar fountains
    for (const f of this.fountains) {
      f.acc += dt * 90 * dens;
      while (f.acc >= 1) {
        f.acc -= 1;
        const k = DEPTHS[f.depth].k;
        const ang = -Math.PI / 2 + rnd(-0.38, 0.38);
        const v = rnd(300, 560) * k;
        const life = rnd(0.9, 1.6);
        const c = pick(COLORS.slice(0, 3));
        this.add(f.depth, { kind: "spark", x: f.x + rnd(-6, 6), y: f.y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, ay: 520 * k, drag: 0.4, life, max: life, size: rnd(1.3, 2.4), h: c[0], s: c[1], l: c[2] + 10 });
      }
    }
    this.fountains = this.fountains.filter((f) => f.until > this.time);

    for (const [depth, L] of this.layers.entries()) {
      // rockets: gravity slows them down (v = v0 - g t), they sway a little and throw sparks backwards; at the top (they stop) they burst
      const k = DEPTHS[depth].k;
      for (const r of L.rockets) {
        r.t += dt;
        r.vy += ROCKET_G * dt;
        const px = r.x;
        const py = r.y;
        r.x += (r.vx + Math.sin(r.t * 22 + r.ph) * 9) * dt;
        r.y += r.vy * dt;
        const steps = Math.max(1, Math.round(Math.hypot(r.x - px, r.y - py) / 4));
        for (let i = 0; i < steps; i++) {
          if (Math.random() < 0.9 * this.quality) {
            const f = i / steps;
            this.add(depth as Depth, { kind: "trail", x: px + (r.x - px) * f + rnd(-1.2, 1.2), y: py + (r.y - py) * f, vx: -r.vx * 0.1 + rnd(-22, 22), vy: -r.vy * 0.06 + rnd(-10, 30), ay: 140 * k, drag: 1.6, life: rnd(0.45, 0.9), max: 0.9, size: rnd(1.1, 2.2) * (0.6 + 0.4 * k), h: rnd(28, 46), s: 100, l: rnd(68, 88) });
          }
        }
        if (r.vy >= -12 || r.y <= r.ty) {
          this.burst(r.x, r.y, { depth: depth as Depth, type: r.type, scale: r.scale });
          r.t = -1;
        }
      }
      L.rockets = L.rockets.filter((r) => r.t >= 0);
      L.flashes = L.flashes.filter((f) => (f.life -= dt) > 0);
      for (const p of L.ps) {
        if (p.delay > 0) {
          p.delay -= dt;
          continue;
        }
        p.life -= dt;
        if (p.kind === "petal") {
          p.ph += dt * 2.2;
          p.vx += Math.cos(p.ph) * 26 * dt;
          p.rot += p.vr * dt;
        } else if (p.kind === "ember") {
          p.ph += dt * 3;
          p.vx += Math.sin(p.ph) * 18 * dt;
        }
        const dr = Math.exp(-p.drag * dt);
        if (p.kind === "star") {
          // the streak: the three last places, sampled every p.tr seconds
          p.tt += dt;
          if (p.tt >= p.tr) {
            p.tt = 0;
            p.x3 = p.x2;
            p.y3 = p.y2;
            p.x2 = p.x1;
            p.y2 = p.y1;
            p.x1 = p.x;
            p.y1 = p.y;
          }
          p.vz *= dr;
          p.z += p.vz * dt;
          if (p.life <= 0 && p.crk) {
            p.crk = false;
            for (let i = 0; i < 3; i++) L.ps.push(mk({ kind: "glitter", x: p.x, y: p.y, vx: rnd(-70, 70), vy: rnd(-70, 40), ay: 60, drag: 2, delay: rnd(0, 0.14), life: rnd(0.25, 0.5), max: 0.5, size: rnd(1.1, 2), h: 48, s: 100, l: 94 }));
          }
        }
        p.vx *= dr;
        p.vy = p.vy * dr + p.ay * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      L.ps = L.ps.filter((p) => p.life > 0 && p.y < h + 40 && p.y > -80 && p.x > -60 && p.x < w + 60);
    }
  }

  private draw() {
    this.surfaces.forEach((sf, si) => {
      const depths = ([0, 1, 2] as Depth[]).filter((d) => DEPTHS[d].cv === si);
      const busy = depths.some((d) => this.layers[d].ps.length || this.layers[d].flashes.length || this.layers[d].rockets.length);
      // an empty canvas that is already clear costs nothing: do not touch it
      if (!busy && !sf.drawn) return;
      sf.ctx.clearRect(0, 0, sf.w, sf.h);
      sf.drawn = busy;
      for (const d of depths) this.drawLayer(sf.ctx, d);
    });
  }

  private drawLayer(ctx: CanvasRenderingContext2D, i: Depth) {
    {
      const L = this.layers[i];
      const DA = DEPTHS[i].a;
      // warm light where a firework burst
      ctx.globalCompositeOperation = "lighter";
      for (const f of L.flashes) {
        const t = f.life / f.max;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        g.addColorStop(0, `hsla(${f.h},100%,${f.l}%,${f.a * t * DA})`);
        g.addColorStop(1, `hsla(${f.h},100%,60%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, 6.2832);
        ctx.fill();
      }
      for (const r of L.rockets) {
        // a short bright streak behind the head (where it was a moment ago), the head and its glow
        ctx.strokeStyle = `hsla(${r.h},100%,72%,${0.55 * DA})`;
        ctx.lineWidth = 2.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(r.x - r.vx * 0.03, r.y - r.vy * 0.03);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();
        ctx.fillStyle = `hsla(${r.h},100%,86%,${0.95 * DA})`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.2, 0, 6.2832);
        ctx.fill();
        ctx.fillStyle = `hsla(${r.h},100%,60%,${0.22 * DA})`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 9, 0, 6.2832);
        ctx.fill();
      }
      for (const p of L.ps) {
        if (p.delay > 0 || p.kind === "petal") continue;
        const t = Math.max(0, p.life / p.max);
        if (p.kind === "star") {
          const age = 1 - t;
          const [hh, ss, ll] = starColour(age, p.h, p.h2, p.s, p.l);
          const a = starAlpha(age, Math.abs(Math.sin(p.life * 47 + p.ph))) * DA * Math.min(1.1, Math.max(0.6, 0.85 + p.z * 0.0007));
          if (a < 0.01) continue;
          const w = p.size * (1 + p.z * 0.0008); // a star nearer to the viewer is a little bigger and brighter
          const c = `hsla(${hh.toFixed(0)},${ss.toFixed(0)}%,${ll.toFixed(0)}%,`;
          ctx.lineCap = "round";
          ctx.lineWidth = w;
          ctx.strokeStyle = c + a * 0.9 + ")";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x1, p.y1);
          ctx.stroke();
          ctx.lineWidth = w * 0.72;
          ctx.strokeStyle = c + a * 0.55 + ")";
          ctx.beginPath();
          ctx.moveTo(p.x1, p.y1);
          ctx.lineTo(p.x2, p.y2);
          ctx.stroke();
          ctx.lineWidth = w * 0.45;
          ctx.strokeStyle = c + a * 0.26 + ")";
          ctx.beginPath();
          ctx.moveTo(p.x2, p.y2);
          ctx.lineTo(p.x3, p.y3);
          ctx.stroke();
          ctx.fillStyle = c + a * 0.14 + ")";
          ctx.beginPath();
          ctx.arc(p.x, p.y, w * 2.6, 0, 6.2832);
          ctx.fill();
          ctx.fillStyle = c + a + ")";
          ctx.beginPath();
          ctx.arc(p.x, p.y, w * 0.8, 0, 6.2832);
          ctx.fill();
        } else if (p.kind === "spark") {
          const a = Math.pow(t, 0.75) * DA;
          ctx.strokeStyle = `hsla(${p.h},${p.s}%,${p.l}%,${a})`;
          ctx.lineWidth = p.size;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else if (p.kind === "glitter") {
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(p.life * 38 + p.ph));
          ctx.fillStyle = `hsla(${p.h},${p.s}%,${p.l}%,${t * tw * DA})`;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else if (p.kind === "ember") {
          const a = Math.sin(Math.min(1, (1 - t) * 6) * 1.57) * Math.min(1, t * 3) * DA;
          ctx.fillStyle = `hsla(${p.h},${p.s}%,${p.l}%,${a * 0.22})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, 6.2832);
          ctx.fill();
          ctx.fillStyle = `hsla(${p.h},${p.s}%,${Math.min(95, p.l + 20)}%,${a * 0.9})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, 6.2832);
          ctx.fill();
        } else {
          ctx.fillStyle = `hsla(${p.h - (1 - t) * 14},${p.s}%,${p.l - (1 - t) * 18}%,${t * DA})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (0.5 + 0.5 * t), 0, 6.2832);
          ctx.fill();
        }
      }
      // petals are solid, not light: drawn normally
      ctx.globalCompositeOperation = "source-over";
      for (const p of L.ps) {
        if (p.kind !== "petal") continue;
        const t = p.life / p.max;
        const a = Math.min(1, t * 5, (1 - t) * 6 + 0.25) * DA;
        const flip = Math.abs(Math.cos(p.ph * 1.7));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `hsla(${p.h},${p.s}%,${p.l}%,${a})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, Math.max(0.6, p.size * 0.52 * flip), 0, 0, 6.2832);
        ctx.fill();
        ctx.fillStyle = `hsla(${p.h},${p.s}%,${Math.max(30, p.l - 14)}%,${a * 0.55})`;
        ctx.beginPath();
        ctx.ellipse(-p.size * 0.15, 0, p.size * 0.5, Math.max(0.4, p.size * 0.2 * flip), 0, 0, 6.2832);
        ctx.fill();
        ctx.restore();
      }
    }
  }
}

// the engine of this page (the layer creates it, the pointer effects and the places use it)
let current: FestEngine | null = null;
export const festEngine = () => current;
export const setFestEngine = (e: FestEngine | null) => {
  current = e;
};
