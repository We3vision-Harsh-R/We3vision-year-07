import * as THREE from "three";

// Canvas drawn textures of the office (no image files): floor, windows with a night skyline, the glowing wall mark and the screens.
// Colours follow the theme hue (hue = th + 354, as the rest of the site), so a recoloured site recolours the office.

export type Tint = { h: number; s: number };

const mk = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return { c, g: c.getContext("2d") as CanvasRenderingContext2D };
};
const col = (t: Tint, dh: number, s: number, l: number, a = 1) => `hsl(${(t.h + dh + 360) % 360} ${s * t.s}% ${l}% / ${a})`;

// a small deterministic random generator, so the office looks the same on every visit
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const finish = (c: HTMLCanvasElement, srgb = true, aniso = 8) => {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  t.needsUpdate = true;
  return t;
};

/** polished dark concrete with big square tiles */
export function floorTexture(t: Tint, aniso: number) {
  const { c, g } = mk(1024, 1024);
  const r = rng(11);
  g.fillStyle = col(t, -8, 35, 8);
  g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = `rgba(255,255,255,${r() * 0.035})`;
    g.fillRect(r() * 1024, r() * 1024, 1 + r() * 2, 1 + r() * 2);
  }
  for (let i = 0; i < 30; i++) {
    const x = r() * 1024;
    const y = r() * 1024;
    const rad = 60 + r() * 160;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, `rgba(255,255,255,${0.018 + r() * 0.02})`);
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  g.strokeStyle = col(t, 0, 60, 3, 0.9);
  g.lineWidth = 5;
  g.strokeRect(0, 0, 1024, 1024);
  g.strokeStyle = col(t, 0, 90, 55, 0.07);
  g.lineWidth = 1.5;
  g.strokeRect(4, 4, 1016, 1016);
  const tex = finish(c, true, aniso);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** a window wall: night city behind floor-to-ceiling glass */
export function windowTexture(t: Tint, seed: number, aniso: number) {
  const W = 2048;
  const H = 400;
  const { c, g } = mk(W, H);
  const r = rng(seed);
  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, col(t, -12, 70, 7));
  sky.addColorStop(0.55, col(t, -4, 65, 15));
  sky.addColorStop(1, col(t, 10, 70, 26));
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);
  // a glow at the horizon
  const hg = g.createLinearGradient(0, H * 0.45, 0, H);
  hg.addColorStop(0, "rgba(0,0,0,0)");
  hg.addColorStop(1, col(t, 20, 100, 55, 0.35));
  g.fillStyle = hg;
  g.fillRect(0, H * 0.45, W, H * 0.55);
  // stars
  for (let i = 0; i < 90; i++) {
    g.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.5})`;
    g.fillRect(r() * W, r() * H * 0.45, 1.2, 1.2);
  }
  // far and near buildings
  for (const layer of [0, 1, 2]) {
    let x = -20;
    const base = H * (0.9 - layer * 0.0);
    while (x < W) {
      const w = 40 + r() * (70 - layer * 10);
      const h = H * (0.18 + r() * (0.34 - layer * 0.06)) * (1 - layer * 0.12);
      g.fillStyle = col(t, -6 + layer * 3, 55 - layer * 8, 5 + layer * 2.5);
      g.fillRect(x, base - h, w, h + 40);
      // lit windows
      const cols = Math.floor(w / 9);
      const rows = Math.floor(h / 12);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (r() < 0.32 - layer * 0.04) {
            g.fillStyle = r() < 0.7 ? col(t, 40, 90, 78, 0.55 + r() * 0.4) : col(t, 0, 100, 76, 0.5 + r() * 0.4);
            g.fillRect(x + 4 + i * 9, base - h + 6 + j * 12, 4, 6);
          }
        }
      }
      x += w + 2 + r() * 8;
    }
  }
  // soft out-of-focus lights on the street
  for (let i = 0; i < 70; i++) {
    const x = r() * W;
    const y = H * (0.8 + r() * 0.2);
    const rad = 3 + r() * 9;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, col(t, r() * 60, 90, 75, 0.6));
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  // the frame of the glass wall: thin vertical mullions, a dark sill and header
  g.fillStyle = col(t, 0, 40, 4);
  for (let i = 0; i <= 10; i++) g.fillRect((i * W) / 10 - 4, 0, 8, H);
  g.fillRect(0, 0, W, 14);
  g.fillRect(0, H - 22, W, 22);
  g.fillStyle = col(t, 0, 80, 55, 0.35);
  g.fillRect(0, H - 22, W, 2);
  return finish(c, true, aniso);
}

/** the back wall: dark slats */
export function slatTexture(t: Tint, aniso: number) {
  const { c, g } = mk(1024, 256);
  g.fillStyle = col(t, -6, 45, 6);
  g.fillRect(0, 0, 1024, 256);
  for (let i = 0; i < 64; i++) {
    g.fillStyle = col(t, -4, 40, 9 + (i % 2) * 3);
    g.fillRect(i * 16 + 1, 0, 13, 256);
    g.fillStyle = "rgba(0,0,0,0.5)";
    g.fillRect(i * 16 + 14, 0, 2, 256);
  }
  const tex = finish(c, true, aniso);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** the glowing mark of the studio on the back wall (transparent, drawn with light) */
export function wallMarkTexture(t: Tint, aniso: number) {
  const { c, g } = mk(2048, 512);
  g.clearRect(0, 0, 2048, 512);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = '600 190px Poppins, "Segoe UI", Arial, sans-serif';
  const grad = g.createLinearGradient(520, 0, 1560, 0);
  grad.addColorStop(0, col(t, 40, 100, 86));
  grad.addColorStop(0.5, col(t, 0, 100, 80));
  grad.addColorStop(1, col(t, -40, 100, 76));
  g.shadowColor = col(t, 0, 100, 65, 0.95);
  g.shadowBlur = 38;
  g.fillStyle = grad;
  g.fillText("We3vision", 1130, 240);
  g.shadowBlur = 0;
  g.fillStyle = grad;
  g.fillText("We3vision", 1130, 240);
  // the mark: a rounded square with a W
  g.save();
  g.translate(500, 240);
  g.strokeStyle = col(t, 0, 100, 82);
  g.lineWidth = 12;
  g.shadowColor = col(t, 0, 100, 65, 0.95);
  g.shadowBlur = 30;
  g.beginPath();
  g.roundRect(-92, -92, 184, 184, 44);
  g.stroke();
  g.beginPath();
  g.moveTo(-52, -42);
  g.lineTo(-26, 46);
  g.lineTo(0, -8);
  g.lineTo(26, 46);
  g.lineTo(52, -42);
  g.stroke();
  g.restore();
  return finish(c, true, aniso);
}

/** screens of the desks: code, a design tool or a chart */
export function screenTexture(t: Tint, kind: number, aniso: number) {
  const { c, g } = mk(320, 180);
  const r = rng(100 + kind * 7);
  g.fillStyle = col(t, -8, 60, 6);
  g.fillRect(0, 0, 320, 180);
  g.fillStyle = col(t, -4, 50, 11);
  g.fillRect(0, 0, 320, 14);
  for (let i = 0; i < 3; i++) {
    g.fillStyle = col(t, i * 50, 90, 70, 0.8);
    g.beginPath();
    g.arc(10 + i * 11, 7, 3, 0, 7);
    g.fill();
  }
  if (kind === 0) {
    // code
    for (let i = 0; i < 17; i++) {
      let x = 18 + (r() < 0.4 ? 14 : 0) + (r() < 0.2 ? 14 : 0);
      for (let k = 0; k < 1 + Math.floor(r() * 4); k++) {
        const w = 14 + r() * 50;
        g.fillStyle = col(t, [0, 50, -50, 120][Math.floor(r() * 4)], 80, 72, 0.85);
        g.fillRect(x, 24 + i * 9, w, 4);
        x += w + 6;
      }
    }
    g.fillStyle = col(t, 0, 40, 9);
    g.fillRect(0, 14, 12, 166);
  } else if (kind === 1) {
    // a design tool: panels and a canvas with shapes
    g.fillStyle = col(t, -4, 45, 9);
    g.fillRect(0, 14, 56, 166);
    g.fillRect(264, 14, 56, 166);
    for (let i = 0; i < 7; i++) {
      g.fillStyle = col(t, 0, 60, 30, 0.8);
      g.fillRect(8, 24 + i * 20, 40, 10);
      g.fillRect(272, 24 + i * 20, 40, 10);
    }
    g.fillStyle = col(t, 0, 100, 74);
    g.beginPath();
    g.roundRect(96, 44, 120, 90, 14);
    g.fill();
    g.fillStyle = col(t, 60, 100, 70);
    g.beginPath();
    g.arc(160, 90, 28, 0, 7);
    g.fill();
    g.fillStyle = col(t, -40, 100, 72);
    g.fillRect(100, 146, 112, 8);
  } else {
    // a chart
    for (let i = 0; i < 9; i++) {
      const h = 20 + r() * 90;
      g.fillStyle = col(t, i * 12, 90, 68, 0.9);
      g.fillRect(34 + i * 28, 160 - h, 18, h);
    }
    g.strokeStyle = col(t, 40, 100, 80);
    g.lineWidth = 2;
    g.beginPath();
    for (let i = 0; i < 9; i++) g.lineTo(43 + i * 28, 120 - r() * 70);
    g.stroke();
  }
  return finish(c, true, aniso);
}

/** the big screen on the hero table: a small virtual world */
export function heroScreenTexture(t: Tint, aniso: number) {
  const W = 1280;
  const H = 540;
  const { c, g } = mk(W, H);
  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, col(t, -14, 70, 7));
  sky.addColorStop(0.55, col(t, 0, 65, 20));
  sky.addColorStop(1, col(t, 20, 80, 38));
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);
  // a glowing sun / planet
  const gr = g.createRadialGradient(W * 0.68, H * 0.42, 0, W * 0.68, H * 0.42, 190);
  gr.addColorStop(0, col(t, 40, 100, 88, 1));
  gr.addColorStop(0.35, col(t, 10, 100, 70, 0.55));
  gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, W, H);
  // a perspective grid floor
  g.strokeStyle = col(t, 0, 100, 74, 0.55);
  g.lineWidth = 2;
  const hz = H * 0.58;
  for (let i = -16; i <= 16; i++) {
    g.beginPath();
    g.moveTo(W / 2 + i * 22, hz);
    g.lineTo(W / 2 + i * 150, H);
    g.stroke();
  }
  for (let i = 0; i < 10; i++) {
    const y = hz + Math.pow(i / 9, 2.1) * (H - hz);
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(W, y);
    g.stroke();
  }
  // floating shapes
  g.fillStyle = col(t, 0, 100, 80, 0.9);
  g.beginPath();
  g.roundRect(190, 150, 120, 120, 30);
  g.fill();
  g.fillStyle = col(t, 60, 100, 72, 0.9);
  g.beginPath();
  g.moveTo(980, 120);
  g.lineTo(1040, 230);
  g.lineTo(920, 230);
  g.closePath();
  g.fill();
  // a window with the name
  g.fillStyle = "rgba(10,5,20,0.55)";
  g.beginPath();
  g.roundRect(60, 40, 260, 54, 14);
  g.fill();
  g.fillStyle = col(t, 0, 100, 86);
  g.font = '600 26px Poppins, "Segoe UI", Arial, sans-serif';
  g.textBaseline = "middle";
  g.fillText("We3vision · Metaverse", 82, 68);
  return finish(c, true, aniso);
}

/** a soft round sprite for the floating dust */
export function dustTexture() {
  const { c, g } = mk(64, 64);
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.4, "rgba(255,255,255,0.35)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return finish(c, true, 1);
}

/** the knitted band: fine vertical ribs (repeats along the band) */
export function bandTexture(aniso: number) {
  const { c, g } = mk(64, 64);
  g.fillStyle = "#cfcdd8";
  g.fillRect(0, 0, 64, 64);
  for (let i = 0; i < 4; i++) {
    const x = i * 16;
    const gr = g.createLinearGradient(x, 0, x + 16, 0);
    gr.addColorStop(0, "rgba(0,0,0,0.38)");
    gr.addColorStop(0.35, "rgba(255,255,255,0.16)");
    gr.addColorStop(0.65, "rgba(255,255,255,0.1)");
    gr.addColorStop(1, "rgba(0,0,0,0.42)");
    g.fillStyle = gr;
    g.fillRect(x, 0, 16, 64);
  }
  const t = finish(c, true, aniso);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** a lens of the headset seen from behind: a dark glass with the coloured reflection of the little displays */
export function lensTexture(aniso: number) {
  const S = 256;
  const { c, g } = mk(S, S);
  const r = rng(77);
  g.fillStyle = "#04030a";
  g.fillRect(0, 0, S, S);
  const clip = new Path2D();
  clip.arc(S / 2, S / 2, S / 2 - 2, 0, Math.PI * 2);
  g.save();
  g.clip(clip);
  const bg = g.createRadialGradient(S * 0.4, S * 0.35, 4, S / 2, S / 2, S / 2);
  bg.addColorStop(0, "#1b2349");
  bg.addColorStop(0.6, "#0a0b1c");
  bg.addColorStop(1, "#030308");
  g.fillStyle = bg;
  g.fillRect(0, 0, S, S);
  // small coloured app icons in the reflection
  const cols = ["#ff5d6c", "#ffb340", "#5ee0a0", "#4aa8ff", "#b787ff", "#ffe066"];
  for (let i = 0; i < 26; i++) {
    const x = 50 + r() * 156;
    const y = 50 + r() * 100;
    g.fillStyle = cols[Math.floor(r() * cols.length)];
    g.globalAlpha = 0.55 + r() * 0.35;
    g.beginPath();
    g.roundRect(x, y, 12, 12, 4);
    g.fill();
  }
  g.globalAlpha = 1;
  // a soft glare
  const gl = g.createLinearGradient(0, 0, S, S);
  gl.addColorStop(0, "rgba(255,255,255,0.22)");
  gl.addColorStop(0.35, "rgba(255,255,255,0)");
  g.fillStyle = gl;
  g.fillRect(0, 0, S, S);
  g.restore();
  return finish(c, true, aniso);
}
