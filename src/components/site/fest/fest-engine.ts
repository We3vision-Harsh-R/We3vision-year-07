// The particle engine of the festival layer: three canvases lie over the whole page, one for each distance (far, middle, near). The far one
// is drawn smaller, slower and softly blurred by CSS, the near one sharp and big, so fireworks, embers and petals fill a real 3D space.
// Everything that flies is a particle with a position, a speed, gravity and a life; the loop runs only while something is alive or an
// ambient effect (fireworks, embers, petals, anar fountains) is on, and it stops while the tab is hidden.
// No React in here: the layer (fest-top.tsx) creates the engine, the pointer effects (fest-pointer.tsx) and the places call burst() / rocket().

export type Depth = 0 | 1 | 2; // far, middle, near
/** scale of sizes and speeds, blur (px, applied by CSS) and opacity of the three distances */
export const DEPTHS = [
  { k: 0.42, blur: 3.2, a: 0.55 },
  { k: 0.7, blur: 1.3, a: 0.82 },
  { k: 1, blur: 0, a: 1 },
] as const;

export type BurstType = "peony" | "willow" | "ring" | "chrysanthemum" | "crackle";
export const BURST_TYPES: BurstType[] = ["peony", "willow", "ring", "chrysanthemum", "crackle"];

type Kind = "spark" | "glitter" | "ember" | "petal" | "trail";
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
  /** petals: sway and flip phase; sparks of a chrysanthemum: leaves a trail */
  ph: number;
  trail: boolean;
};
type Flash = { x: number; y: number; r: number; life: number; max: number; h: number };
type Rocket = { x: number; y0: number; y: number; ty: number; t: number; dur: number; h: number; type: BurstType; scale: number; trailT: number };
type Fountain = { x: number; y: number; until: number; acc: number; depth: Depth };
type Layer = { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; w: number; h: number; ps: P[]; flashes: Flash[]; rockets: Rocket[] };

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
const DENSITY = { low: 0.55, normal: 1, rich: 1.6 } as const;
export type EngineDensity = keyof typeof DENSITY;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];

export type Ambient = { fireworks: boolean; embers: boolean; petals: boolean; anar: boolean };

export class FestEngine {
  private layers: Layer[];
  private density = 1;
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

  constructor(canvases: HTMLCanvasElement[], density: EngineDensity = "normal") {
    this.density = DENSITY[density];
    this.layers = canvases.map((canvas) => ({ canvas, ctx: canvas.getContext("2d") as CanvasRenderingContext2D, w: 0, h: 0, ps: [], flashes: [], rockets: [] }));
    this.resize();
    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibility);
    for (const l of this.layers) l.ctx.clearRect(0, 0, l.canvas.width, l.canvas.height);
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
    this.layers.forEach((l, i) => {
      // the blurred far layers do not need the sharp pixels of a retina screen
      const dpr = i === 2 ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
      l.w = w;
      l.h = h;
      l.canvas.width = Math.round(w * dpr);
      l.canvas.height = Math.round(h * dpr);
      l.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
    const cap = 1400;
    if (L.ps.length > cap) L.ps.splice(0, L.ps.length - cap);
    const c = pick(COLORS);
    L.ps.push({ vx: 0, vy: 0, ay: 0, drag: 0, delay: 0, life: 1, max: 1, size: 1.6, h: c[0], s: c[1], l: c[2], rot: 0, vr: 0, ph: Math.random() * 6.28, trail: false, ...p });
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

  /** a warm glow where something burst */
  private flash(depth: Depth, x: number, y: number, r: number, h: number) {
    this.layers[depth]?.flashes.push({ x, y, r: r * DEPTHS[depth].k, life: 0.45, max: 0.45, h });
    this.kick();
  }

  /** a burst of a kind at a place; `scale` 1 = the size of a big firework */
  burst(x: number, y: number, o: { depth?: Depth; type?: BurstType; scale?: number; color?: number } = {}) {
    const depth = o.depth ?? 2;
    const type = o.type ?? pick(BURST_TYPES);
    const k = DEPTHS[depth].k;
    const R = rnd(120, 190) * (o.scale ?? 1) * k; // how far the sparks fly (px)
    const col = COLORS[(o.color ?? Math.floor(Math.random() * COLORS.length)) % COLORS.length];
    const col2 = pick(COLORS);
    const n = Math.round((type === "ring" ? 46 : type === "willow" ? 54 : 74) * this.density * (0.55 + 0.45 * k));
    const drag = type === "willow" ? 1.25 : 1.7;
    this.flash(depth, x, y, R * 1.15, col[0]);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.2832 + rnd(-0.06, 0.06);
      let sp = type === "ring" ? 1 : rnd(0.35, 1);
      if (type === "ring") sp *= 0.95;
      const v = R * drag * sp;
      const tilt = type === "ring" ? 0.45 : 1;
      const life = type === "willow" ? rnd(2.1, 3) : rnd(1, 1.7);
      const c = type === "chrysanthemum" && i % 3 === 0 ? col2 : col;
      this.add(depth, {
        kind: "spark",
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v * tilt,
        ay: (type === "willow" ? 150 : 70) * k,
        drag,
        life,
        max: life,
        size: rnd(1.3, 2.3) * (0.55 + 0.45 * k),
        h: type === "willow" ? 42 : c[0],
        s: c[1],
        l: type === "willow" ? 68 : c[2] + 6,
        trail: type === "chrysanthemum" || type === "willow",
      });
    }
    // the crackle: tiny white glitter that twinkles after the bang
    const g = Math.round((type === "crackle" ? 60 : 22) * this.density * k);
    for (let i = 0; i < g; i++) {
      const a = rnd(0, 6.2832);
      const sp = R * rnd(0.2, 0.75);
      const life = rnd(0.9, 1.9);
      this.add(depth, { kind: "glitter", x, y, vx: Math.cos(a) * sp * 0.9, vy: Math.sin(a) * sp * 0.9, ay: 50 * k, drag: 1.5, delay: rnd(0.35, 0.8), life, max: life, size: rnd(1, 1.8), h: 48, s: 100, l: 92 });
    }
  }

  /** a rocket that climbs from (x, y) to height ty and bursts there. Returns the place of the burst. */
  rocket(x: number, y: number, ty: number, o: { depth?: Depth; type?: BurstType; scale?: number } = {}) {
    const depth = o.depth ?? 2;
    const L = this.layers[depth];
    if (!L) return;
    const dist = Math.max(10, y - ty);
    L.rockets.push({ x, y0: y, y, ty, t: 0, dur: 0.5 + dist / 1100, h: pick(COLORS)[0], type: o.type ?? pick(BURST_TYPES), scale: o.scale ?? 1, trailT: 0 });
    this.kick();
  }

  /** a fountain of sparks (an anar) at the bottom of the window for `seconds` */
  fountain(x: number, y: number, seconds: number, depth: Depth = 2) {
    this.fountains.push({ x, y, until: this.time + seconds, acc: 0, depth });
    this.kick();
  }

  // ------------------------------------------------------------------ the loop

  private frame = (now: number) => {
    this.raf = 0;
    if (document.hidden) return;
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0.016;
    this.last = now;
    this.time += dt;
    this.step(dt);
    this.draw();
    if (this.busy()) this.raf = requestAnimationFrame(this.frame);
  };

  private step(dt: number) {
    const w = this.layers[2]?.w ?? window.innerWidth;
    const h = this.layers[2]?.h ?? window.innerHeight;
    const a = this.ambient;
    const dens = this.density;

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

    for (const L of this.layers) {
      // rockets: they slow down as they climb, trailing sparks, and burst at the top
      for (const r of L.rockets) {
        r.t += dt;
        const p = Math.min(1, r.t / r.dur);
        const e = 1 - Math.pow(1 - p, 2.4);
        const prev = r.y;
        r.y = r.y0 + (r.ty - r.y0) * e;
        r.trailT += dt;
        const depth = this.layers.indexOf(L) as Depth;
        const k = DEPTHS[depth].k;
        const steps = Math.max(1, Math.round(Math.abs(prev - r.y) / 5));
        for (let i = 0; i < steps; i++) {
          if (Math.random() < 0.9) {
            const yy = prev + ((r.y - prev) * i) / steps;
            this.add(depth, { kind: "trail", x: r.x + rnd(-1.5, 1.5), y: yy, vx: rnd(-14, 14), vy: rnd(10, 40) * k, ay: 60, drag: 1, life: rnd(0.35, 0.75), max: 0.75, size: rnd(1.1, 2.2) * (0.6 + 0.4 * k), h: rnd(24, 44), s: 100, l: rnd(60, 80) });
          }
        }
        if (p >= 1) {
          this.burst(r.x, r.y, { depth, type: r.type, scale: r.scale });
          r.dur = -1;
        }
      }
      L.rockets = L.rockets.filter((r) => r.dur > 0);
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
        p.vx *= dr;
        p.vy = p.vy * dr + p.ay * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.trail && p.life > 0.2 && Math.random() < 0.35) {
          L.ps.push({ kind: "trail", x: p.x, y: p.y, vx: 0, vy: 8, ay: 20, drag: 1, delay: 0, life: 0.4, max: 0.4, size: p.size * 0.7, h: p.h, s: p.s, l: p.l, rot: 0, vr: 0, ph: 0, trail: false });
        }
      }
      L.ps = L.ps.filter((p) => p.life > 0 && p.y < L.h + 40 && p.y > -80 && p.x > -60 && p.x < L.w + 60);
    }
  }

  private draw() {
    this.layers.forEach((L, i) => {
      const { ctx, w, h } = L;
      ctx.clearRect(0, 0, w, h);
      const DA = DEPTHS[i].a;
      // warm light where a firework burst
      ctx.globalCompositeOperation = "lighter";
      for (const f of L.flashes) {
        const t = f.life / f.max;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        g.addColorStop(0, `hsla(${f.h},100%,75%,${0.32 * t * DA})`);
        g.addColorStop(1, `hsla(${f.h},100%,60%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, 6.2832);
        ctx.fill();
      }
      for (const r of L.rockets) {
        ctx.fillStyle = `hsla(${r.h},100%,82%,${0.95 * DA})`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.4, 0, 6.2832);
        ctx.fill();
        ctx.fillStyle = `hsla(${r.h},100%,60%,${0.25 * DA})`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 9, 0, 6.2832);
        ctx.fill();
      }
      for (const p of L.ps) {
        if (p.delay > 0 || p.kind === "petal") continue;
        const t = Math.max(0, p.life / p.max);
        if (p.kind === "spark") {
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
          ctx.fillStyle = `hsla(${p.h},${p.s}%,${p.l}%,${t * DA})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, 6.2832);
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
    });
  }
}

// the engine of this page (the layer creates it, the pointer effects and the places use it)
let current: FestEngine | null = null;
export const festEngine = () => current;
export const setFestEngine = (e: FestEngine | null) => {
  current = e;
};
