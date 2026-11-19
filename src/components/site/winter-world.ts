/**
 * THE PHYSICS OF THE WINTER WORLD (tasks 153 + 154, owner 2026-11-19). One small engine, used by the big menu (winter-menu.tsx) and by the products grid of
 * the home page (home-winter-world.tsx). Each place only says WHERE the floors are (`measure`); everything else is here:
 *
 *  - a snowman or a snowball can be picked up with the mouse and dropped anywhere: it falls (gravity), lands on the first floor below it, squashes a
 *    little, a ball bounces and rolls (a flick keeps rolling) and falls off the end of a floor onto the next one;
 *  - a click on a snowman makes it hop and wave, its eyes follow the mouse, a tap on a ball pushes it away;
 *  - `solids` (the cards of the home grid) are walls: nothing flies through them; something dropped inside one pops up onto its top;
 *  - each item remembers its floor + the place along it, so it stays put when the window is resized or the menu is closed and opened again;
 *  - the loop sleeps when nothing moves.
 */

const GRAV = 2100; // px/s2
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export type Floor = { keys: string[]; x0: number; x1: number; y: number };
export type Solid = { x0: number; y0: number; x1: number; y1: number };
export type Spec = { id: string; kind: "ball" | "man"; w: number; h: number; floor: string; f: number };
export type Measured = {
  W: number;
  H: number;
  /** the floors, from the top to the bottom */
  floors: Floor[];
  /** where something lands that fell out of the world */
  safety: Floor;
  /** walls (the cards of the home grid) */
  solids?: Solid[];
  /** where a new item of this spec starts: the floor and the x on it */
  home: (s: Spec) => { fl: Floor; x: number } | null;
  /** called after every layout: the place for the things that do not move (the house, the snow on the floors) */
  after?: () => void;
};
export type World = { layout: () => void; cancel: () => void; drop: () => void; destroy: () => void };

type Item = Spec & {
  el: HTMLElement;
  roll: SVGGElement | null;
  r: number;
  x: number; // centre
  y: number; // bottom (where it touches the floor)
  vx: number;
  vy: number;
  mode: "new" | "rest" | "air" | "drag";
  key: string; // the floor it rests on
  fr: number; // where along that floor (0..1)
  sq: number; // squash
  sqv: number;
  rot: number;
  gx: number;
  gy: number;
  moved: number;
  px: number;
  py: number;
  pt: number;
  lx: number; // where it was in the last frame (the speed of a held item)
  ly: number;
  ang: number; // wobble of a snowman that was hit (degrees)
  angv: number;
};

export function createWorld(o: {
  layer: HTMLElement;
  /** the element (or the window) whose mouse moves turn the eyes of the snowmen */
  host: HTMLElement | Window;
  specs: Spec[];
  measure: () => Measured | null;
  /** true: the caller shows the layer itself (data-ready) */
  holdReady?: boolean;
}): World {
  const { layer } = o;
  const items: Item[] = [];
  layer.querySelectorAll<HTMLElement>("[data-wm]").forEach((el) => {
    const spec = o.specs.find((s) => s.id === el.dataset.wm);
    if (spec) items.push({ ...spec, el, roll: el.querySelector<SVGGElement>(".wm-roll"), r: spec.w / 2, x: 0, y: 0, vx: 0, vy: 0, mode: "new", key: "", fr: 0.5, sq: 0, sqv: 0, rot: 0, gx: 0, gy: 0, moved: 0, px: 0, py: 0, pt: 0, lx: 0, ly: 0, ang: 0, angv: 0 });
  });

  let M: Measured | null = null;
  let floors: Floor[] = [];
  let solids: Solid[] = [];
  let W = 0;
  let H = 0;
  let raf = 0;
  let last = 0;
  let zTop = 10;

  const toLocal = (e: { clientX: number; clientY: number }) => {
    const lr = layer.getBoundingClientRect();
    const s = lr.width / (layer.offsetWidth || 1) || 1;
    return { x: (e.clientX - lr.left) / s, y: (e.clientY - lr.top) / s };
  };
  const floorFor = (key: string) => floors.find((f) => f.keys.includes(key)) ?? (M?.safety.keys.includes(key) ? M.safety : undefined);
  // the lowest a held item can be: on the lowest floor line (below it, it would fall out of the world)
  const lowest = () => (M ? Math.min(H, M.safety.y) : H);

  const write = (it: Item) => {
    const air = it.mode === "drag" || it.mode === "air";
    const tilt = it.kind === "man" && air ? clamp(it.vx * 0.012, -12, 12) : 0;
    const lift = it.mode === "drag" ? 1.08 : 1;
    it.el.style.transform = `translate(${(it.x - it.w / 2).toFixed(1)}px,${(it.y - it.h).toFixed(1)}px) rotate(${(tilt + it.ang).toFixed(1)}deg) scale(${((1 + it.sq) * lift).toFixed(3)},${((1 - it.sq) * lift).toFixed(3)})`;
    if (it.roll) it.roll.setAttribute("transform", `rotate(${it.rot.toFixed(1)} ${it.r} ${it.r})`);
  };

  const puff = (x: number, y: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.className = "wm-puff";
      const a = -Math.PI * (0.12 + 0.76 * Math.random());
      const d = 9 + Math.random() * 14;
      p.style.cssText = `left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;--dx:${(Math.cos(a) * d).toFixed(1)}px;--dy:${(Math.sin(a) * d * 0.8).toFixed(1)}px`;
      layer.appendChild(p);
      window.setTimeout(() => p.remove(), 700);
    }
  };

  // ----- snowballs and snowmen push each other (a rebound) -----
  const BALL_E = 0.72; // how lively two balls rebound
  const MAN_E = 0.5; // a ball against a snowman
  const sign = (v: number) => (v < 0 ? -1 : 1);
  // the speed of an item as the others feel it (a held one: how fast the mouse moves it)
  const kin = (it: Item, dt: number) => {
    if (it.mode === "drag") return { x: clamp((it.x - it.lx) / dt, -1400, 1400), y: clamp((it.y - it.ly) / dt, -1400, 1400) };
    if (it.mode === "air") return { x: it.vx, y: it.vy };
    return { x: it.kind === "ball" ? it.vx : 0, y: 0 };
  };
  const settle = (it: Item) => {
    // a ball that stands on a floor was moved along it: remember where
    if (it.mode !== "rest") return;
    const fl = floorFor(it.key);
    if (fl) {
      it.x = clamp(it.x, fl.x0, fl.x1);
      it.fr = (it.x - fl.x0) / Math.max(1, fl.x1 - fl.x0);
    }
  };
  const ballBall = (a: Item, b: Item, dt: number): boolean => {
    let dx = b.x - a.x;
    let dy = b.y - b.r - (a.y - a.r);
    let d = Math.hypot(dx, dy);
    const min = a.r + b.r;
    if (d >= min) return false;
    if (d < 0.001) {
      dx = 1;
      dy = 0;
      d = 1;
    }
    const nx = dx / d;
    const ny = dy / d;
    const ka = a.mode === "drag";
    const kb = b.mode === "drag";
    if (ka && kb) return false;
    const ma = a.r * a.r;
    const mb = b.r * b.r;
    const ia = ka ? 0 : 1 / ma;
    const ib = kb ? 0 : 1 / mb;
    const over = min - d;
    const wa = ia / (ia + ib);
    const wb = ib / (ia + ib);
    // pull them apart (a ball that stands on a floor can only slide along it)
    a.x -= nx * over * wa;
    b.x += nx * over * wb;
    if (a.mode !== "rest") a.y -= ny * over * wa;
    if (b.mode !== "rest") b.y += ny * over * wb;
    // the rebound along the line between the two centres
    const va = kin(a, dt);
    const vb = kin(b, dt);
    const vn = (vb.x - va.x) * nx + (vb.y - va.y) * ny;
    if (vn < 0) {
      const j = (-(1 + BALL_E) * vn) / (ia + ib);
      if (!ka) {
        a.vx -= j * ia * nx;
        if (a.mode !== "rest") a.vy -= j * ia * ny;
      }
      if (!kb) {
        b.vx += j * ib * nx;
        if (b.mode !== "rest") b.vy += j * ib * ny;
      }
    }
    // one right on top of the other would balance there: it rolls off to a side
    if (Math.abs(nx) < 0.25) {
      const top = ny < 0 ? b : a;
      const bot = top === b ? a : b;
      if (top.mode === "air") top.vx += (top.x >= bot.x ? 1 : -1) * 70;
    }
    for (const it of [a, b]) {
      if (it.mode === "rest") {
        it.vy = 0;
        settle(it);
        if (Math.abs(it.vx) > 3) wake();
      }
    }
    return true;
  };
  // a snowman is drawn as three circles (the same as the drawing): belly, chest, head
  const MAN_BALLS: [number, number, number][] = [
    [22, 44.5, 12.5],
    [22, 27, 9.3],
    [22, 13, 6.9],
  ];
  const ballMan = (ball: Item, man: Item, dt: number): boolean => {
    if (ball.mode === "drag") return false; // a held ball goes through (it is the owner's hand)
    const sx = man.w / 44;
    const sy = man.h / 58;
    const vm = kin(man, dt);
    let hit = false;
    for (const [cx, cy, cr] of MAN_BALLS) {
      const X = man.x + (cx - 22) * sx;
      const Y = man.y - man.h + cy * sy;
      const R = cr * sx;
      let dx = ball.x - X;
      let dy = ball.y - ball.r - Y;
      let d = Math.hypot(dx, dy);
      const min = R + ball.r;
      if (d >= min) continue;
      if (d < 0.001) {
        dx = sign(ball.x - man.x);
        dy = 0;
        d = 1;
      }
      hit = true;
      const nx = dx / d;
      const ny = dy / d;
      const over = min - d;
      ball.x += nx * over;
      if (ball.mode !== "rest") ball.y += ny * over;
      const vn = (ball.vx - vm.x) * nx + ((ball.mode === "rest" ? 0 : ball.vy) - vm.y) * ny;
      if (vn < 0) {
        ball.vx -= (1 + MAN_E) * vn * nx;
        if (ball.mode !== "rest") ball.vy -= (1 + MAN_E) * vn * ny;
        // the snowman rocks like a toy that was hit
        if (man.mode === "rest") man.angv = clamp(man.angv + vn * nx * 0.25, -130, 130);
      }
      if (ball.mode === "air" && ny < -0.7 && Math.abs(nx) < 0.25) ball.vx += (ball.x >= man.x ? 1 : -1) * 60; // it does not balance on a head
      if (ball.mode === "rest") {
        ball.vy = 0;
        settle(ball);
        if (Math.abs(ball.vx) > 3) wake();
      }
    }
    return hit;
  };
  const collide = (dt: number): boolean => {
    let any = false;
    for (let i = 0; i < items.length; i++) {
      const a = items[i];
      if (a.mode === "new") continue;
      for (let j = i + 1; j < items.length; j++) {
        const b = items[j];
        if (b.mode === "new") continue;
        if (a.kind === "ball" && b.kind === "ball") any = ballBall(a, b, dt) || any;
        else if (a.kind === "ball" && b.kind === "man") any = ballMan(a, b, dt) || any;
        else if (a.kind === "man" && b.kind === "ball") any = ballMan(b, a, dt) || any;
      }
    }
    return any;
  };

  // ----- the walls (home grid cards): something inside one is pushed out -----
  // (it is inside when its FEET are inside: a head that reaches into the card above, while the feet stand below it, is fine)
  const inside = (it: Item, s: Solid) => it.x + it.w * 0.4 > s.x0 && it.x - it.w * 0.4 < s.x1 && it.y > s.y0 + 3 && it.y < s.y1 - 1;
  const wallAt = (x: number, y: number) => solids.some((s) => x > s.x0 && x < s.x1 && y > s.y0 && y < s.y1);
  const eject = (it: Item) => {
    for (const s of solids) {
      if (!inside(it, s)) continue;
      if (s.y0 >= it.h + 8) {
        // there is room above it: pop up onto the top of the card (it falls onto the snow there)
        it.y = s.y0 - 14;
        it.vy = -240;
        it.vx *= 0.3;
      } else {
        const hw = it.w * 0.4;
        if (it.x - s.x0 < s.x1 - it.x) {
          it.x = s.x0 - hw - 1;
          it.vx = -Math.abs(it.vx) * 0.4;
        } else {
          it.x = s.x1 + hw + 1;
          it.vx = Math.abs(it.vx) * 0.4;
        }
      }
      it.mode = "air";
    }
  };

  // (re)place everything: the first time at the marks, later where each item rests (or keep it flying)
  const layout = () => {
    const m = o.measure();
    if (!m) return;
    M = m;
    floors = m.floors;
    solids = m.solids ?? [];
    W = m.W;
    H = m.H;
    for (const it of items) {
      if (it.mode === "new") {
        const h = m.home(it);
        if (!h) continue;
        it.x = clamp(h.x, h.fl.x0 + 4, h.fl.x1 - 4);
        it.y = h.fl.y;
        it.key = h.fl.keys[0];
        it.fr = (it.x - h.fl.x0) / Math.max(1, h.fl.x1 - h.fl.x0);
        it.mode = "rest";
      } else if (it.mode === "rest") {
        const fl = floorFor(it.key) ?? m.safety;
        it.key = fl.keys[0];
        it.x = fl.x0 + it.fr * (fl.x1 - fl.x0);
        it.y = fl.y;
      } else {
        it.x = clamp(it.x, it.w / 2, W - it.w / 2);
        it.y = clamp(it.y, it.h, lowest());
      }
      write(it);
    }
    m.after?.();
    if (!o.holdReady) layer.dataset.ready = "true";
    wake();
  };

  const land = (it: Item, fl: Floor) => {
    const v = it.vy;
    it.y = fl.y;
    it.key = fl.keys[0];
    if (v > 140) {
      it.sq = clamp(v / 3400, 0, 0.26);
      it.sqv = 0;
      if (v > 380) puff(it.x, fl.y, 4);
    }
    if (it.kind === "ball" && v > 240) {
      // a ball bounces: still in the air, a little lower each time
      it.vy = -v * 0.3;
      it.vx *= 0.85;
      it.y = fl.y - 0.5;
      return;
    }
    it.vy = 0;
    it.mode = "rest";
    if (it.kind === "man") it.vx = 0;
    else it.vx *= 0.8;
    it.fr = (it.x - fl.x0) / Math.max(1, fl.x1 - fl.x0);
  };

  const hop = (it: Item) => {
    it.mode = "air";
    it.vy = -470;
    it.vx = (Math.random() - 0.5) * 50;
    it.sq = -0.1;
    it.sqv = 0;
    puff(it.x, it.y, 5);
    it.el.classList.remove("wm-wave");
    void it.el.offsetWidth;
    it.el.classList.add("wm-wave");
    window.setTimeout(() => it.el.classList.remove("wm-wave"), 800);
  };

  const tick = (now: number) => {
    const dt = Math.min(0.04, (now - last) / 1000 || 0.016);
    last = now;
    let awake = false;
    for (const it of items) {
      if (it.mode === "new") continue;
      if (it.mode === "drag") awake = true;
      else if (it.mode === "air") {
        awake = true;
        const py = it.y;
        it.vy += GRAV * dt;
        it.x += it.vx * dt;
        it.y += it.vy * dt;
        if (it.kind === "ball") it.rot += ((it.vx * dt) / it.r) * 57.3;
        const hw = it.w / 2;
        if (it.x < hw) {
          it.x = hw;
          it.vx = Math.abs(it.vx) * 0.4;
        } else if (it.x > W - hw) {
          it.x = W - hw;
          it.vx = -Math.abs(it.vx) * 0.4;
        }
        if (it.y - it.h < 0) {
          it.y = it.h;
          it.vy = Math.abs(it.vy) * 0.3;
        }
        if (M && it.y > H + 30) {
          land(it, M.safety);
          it.vy = 0;
        } else if (it.vy >= 0) {
          const hit = floors.find((f) => it.x >= f.x0 - 1 && it.x <= f.x1 + 1 && py <= f.y + 1 && it.y >= f.y);
          if (hit) land(it, hit);
        }
        if (it.mode === "air" && solids.length) {
          for (const s of solids) {
            if (!inside(it, s)) continue;
            const hw4 = it.w * 0.4;
            const prevX = it.x - it.vx * dt;
            if (prevX + hw4 <= s.x0 + 1) {
              it.x = s.x0 - hw4;
              it.vx = -Math.abs(it.vx) * 0.4;
            } else if (prevX - hw4 >= s.x1 - 1) {
              it.x = s.x1 + hw4;
              it.vx = Math.abs(it.vx) * 0.4;
            } else eject(it);
          }
        }
      } else if (it.mode === "rest" && it.kind === "ball" && Math.abs(it.vx) > 3) {
        awake = true;
        it.x += it.vx * dt;
        it.rot += ((it.vx * dt) / it.r) * 57.3;
        it.vx *= Math.exp(-dt * 1.8);
        const fl = floorFor(it.key);
        if (!fl || it.x < fl.x0 || it.x > fl.x1) {
          if (fl && wallAt(it.x > fl.x1 ? fl.x1 + 3 : fl.x0 - 3, fl.y - 6)) {
            // the end of the floor is a card: the ball bounces back
            it.x = clamp(it.x, fl.x0, fl.x1);
            it.vx = -it.vx * 0.5;
          } else {
            it.mode = "air"; // it rolled off the end of the floor
            it.vy = 0;
          }
        } else it.fr = (it.x - fl.x0) / Math.max(1, fl.x1 - fl.x0);
        if (Math.abs(it.vx) <= 3) it.vx = 0;
      }
      // the squash springs back
      if (Math.abs(it.sq) > 0.002 || Math.abs(it.sqv) > 0.02) {
        awake = true;
        it.sqv += (-260 * it.sq - 14 * it.sqv) * dt;
        it.sq += it.sqv * dt;
      } else {
        it.sq = 0;
        it.sqv = 0;
      }
      // a snowman that was hit rocks back and forth
      if (it.kind === "man" && (Math.abs(it.ang) > 0.05 || Math.abs(it.angv) > 0.5)) {
        awake = true;
        it.angv += (-110 * it.ang - 6.5 * it.angv) * dt;
        it.ang = clamp(it.ang + it.angv * dt, -14, 14);
      } else {
        it.ang = 0;
        it.angv = 0;
      }
      write(it);
    }
    if (collide(dt)) {
      awake = true;
      for (const it of items) if (it.mode !== "new") write(it);
    }
    for (const it of items) {
      it.lx = it.x;
      it.ly = it.y;
    }
    raf = awake ? requestAnimationFrame(tick) : 0;
  };
  function wake() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  // everything falls into place from a little above (the home grid does it when the section first comes into view)
  const drop = () => {
    let n = 0;
    for (const it of items) {
      if (it.mode !== "rest") continue;
      // up to the floor (or card) above it, so that it does not fall through that one or start inside it
      let ceil = 0;
      for (const f of floors) if (f.y < it.y - 2 && it.x >= f.x0 && it.x <= f.x1 && f.y + it.h * 0.6 > ceil) ceil = f.y + it.h * 0.6;
      for (const s of solids) if (it.x + it.w * 0.4 > s.x0 && it.x - it.w * 0.4 < s.x1 && s.y1 <= it.y && s.y1 + it.h + 2 > ceil) ceil = s.y1 + it.h + 2;
      const room = it.y - ceil - 8;
      const d = Math.min(room, 90 + n * 45);
      if (d < 24 || it.y - d < it.h + 2) continue;
      n++;
      it.mode = "air";
      it.y -= d;
      it.vy = 0;
      it.vx = 0;
      write(it);
    }
    wake();
  };

  // ----- the mouse: pick up, drop, flick; a click on a snowman makes it hop -----
  const cleanups: (() => void)[] = [];
  for (const it of items) {
    const down = (e: PointerEvent) => {
      if (e.button !== 0 || it.mode === "new") return;
      e.preventDefault();
      it.el.setPointerCapture(e.pointerId);
      const p = toLocal(e);
      it.mode = "drag";
      it.lx = it.x;
      it.ly = it.y;
      it.gx = p.x - it.x;
      it.gy = p.y - it.y;
      it.vx = 0;
      it.vy = 0;
      it.moved = 0;
      it.px = p.x;
      it.py = p.y;
      it.pt = e.timeStamp;
      it.el.style.zIndex = String(++zTop);
      it.el.classList.add("wm-drag");
      wake();
    };
    const move = (e: PointerEvent) => {
      if (it.mode !== "drag") return;
      const p = toLocal(e);
      const dtp = Math.max(1, e.timeStamp - it.pt) / 1000;
      it.vx = clamp(it.vx * 0.5 + ((p.x - it.px) / dtp) * 0.5, -1600, 1600);
      it.vy = clamp(it.vy * 0.5 + ((p.y - it.py) / dtp) * 0.5, -1600, 1600);
      it.moved += Math.abs(p.x - it.px) + Math.abs(p.y - it.py);
      it.px = p.x;
      it.py = p.y;
      it.pt = e.timeStamp;
      it.x = clamp(p.x - it.gx, it.w / 2, W - it.w / 2);
      it.y = clamp(p.y - it.gy, it.h + 2, lowest());
      write(it);
    };
    const up = (e: PointerEvent) => {
      if (it.mode !== "drag") return;
      try {
        it.el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      it.el.classList.remove("wm-drag");
      if (it.moved < 5) {
        if (it.kind === "man") hop(it);
        else {
          // a tap on a ball pushes it away from the finger
          const p = toLocal(e);
          it.mode = "air";
          it.vx = clamp((it.x - p.x) * 14, -160, 160) || 90;
          it.vy = -140;
        }
      } else {
        if (e.timeStamp - it.pt > 90) {
          it.vx = 0;
          it.vy = 0;
        }
        it.mode = "air"; // let go: it falls
      }
      eject(it);
      wake();
    };
    it.el.addEventListener("pointerdown", down);
    it.el.addEventListener("pointermove", move);
    it.el.addEventListener("pointerup", up);
    it.el.addEventListener("pointercancel", up);
    cleanups.push(() => {
      it.el.removeEventListener("pointerdown", down);
      it.el.removeEventListener("pointermove", move);
      it.el.removeEventListener("pointerup", up);
      it.el.removeEventListener("pointercancel", up);
    });
  }

  // the eyes of a snowman follow the mouse
  let eyeRaf = 0;
  let ev: PointerEvent | null = null;
  const onHost = (e: Event) => {
    ev = e as PointerEvent;
    if (eyeRaf) return;
    eyeRaf = requestAnimationFrame(() => {
      eyeRaf = 0;
      if (!ev) return;
      const lr = layer.getBoundingClientRect();
      if (lr.bottom < 0 || lr.top > window.innerHeight) return; // not on the screen: nothing to look at
      const p = toLocal(ev);
      for (const it of items) {
        if (it.kind !== "man" || it.mode === "new") continue;
        const dx = p.x - it.x;
        const dy = p.y - (it.y - it.h * 0.78);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 70);
        it.el.style.setProperty("--ex", ((dx / d) * 1.5 * k).toFixed(2));
        it.el.style.setProperty("--ey", ((dy / d) * 1.1 * k).toFixed(2));
      }
    });
  };
  o.host.addEventListener("pointermove", onHost, { passive: true });

  return {
    layout,
    drop,
    cancel: () => {
      // the place closed while something was held: let it fall
      for (const it of items) {
        if (it.mode === "drag") {
          it.el.classList.remove("wm-drag");
          it.mode = "air";
        }
      }
    },
    destroy: () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(eyeRaf);
      o.host.removeEventListener("pointermove", onHost);
      cleanups.forEach((c) => c());
    },
  };
}

/**
 * A thin, still layer of snow along each line (svg markup for the inside of an svg): a lumpy top that thins out at both ends. It is only a drawing: nothing
 * that falls from above adds to it. `gid` is the id of its own gradient; `amp` makes the lumps higher or lower.
 */
export function snowStrips(strips: { x0: number; x1: number; y: number }[], gid: string, amp = 1): string {
  let svg = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.55" stop-color="#e8f0ff"/><stop offset="1" stop-color="#b4c8e8"/></linearGradient></defs>`;
  for (const s of strips) {
    if (s.x1 - s.x0 < 30) continue;
    const pts: string[] = [];
    for (let x = s.x0; x <= s.x1 + 0.1; x += 4) {
      const e0 = Math.min(1, Math.min(x - s.x0, s.x1 - x) / 26);
      const e = e0 * e0 * (3 - 2 * e0);
      const h = (4.3 + 1.6 * Math.sin(x * 0.07) + 1.1 * Math.sin(x * 0.19 + 1.3) + 0.7 * Math.sin(x * 0.43)) * e * amp;
      pts.push(`${x.toFixed(1)} ${(s.y - h).toFixed(2)}`);
    }
    const top = pts.join(" L");
    svg += `<path d="M${s.x0.toFixed(1)} ${(s.y + 1.5).toFixed(1)} L${top} L${s.x1.toFixed(1)} ${(s.y + 1.5).toFixed(1)} Z" fill="url(#${gid})"/><path d="M${top}" fill="none" stroke="rgba(255,255,255,0.95)" stroke-width="1"/>`;
  }
  return svg;
}
