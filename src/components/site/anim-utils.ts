// Small helpers shared by the hero canvas animations (the hero particle sphere).

export type RGB = [number, number, number];
export const TAU = Math.PI * 2;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/** Small deterministic random generator: the same seed always paints the same sky. */
export function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/** Soft round glow, drawn once and stamped thousands of times. */
export function makeSprite(color: RGB, softness: number, px = 64) {
  const c = document.createElement("canvas");
  c.width = c.height = px;
  const g = c.getContext("2d");
  if (!g) return c;
  const grad = g.createRadialGradient(px / 2, px / 2, 0, px / 2, px / 2, px / 2);
  grad.addColorStop(0, rgba(color, 1));
  grad.addColorStop(0.05 + softness * 0.25, rgba(color, 0.5));
  grad.addColorStop(0.35 + softness * 0.3, rgba(color, 0.12));
  grad.addColorStop(1, rgba(color, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, px, px);
  return c;
}

/**
 * The same colour in the visitor's theme (see lib/theme.ts): hue turned by (theme hue - 284), saturation x the theme's factor,
 * lightness untouched. Canvas drawing cannot use the CSS variables, so it asks for its colours through this.
 */
export function shiftRgb(c: RGB, th: number, ts: number): RGB {
  const r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  const l = (mx + mn) / 2;
  if (!d) return c;
  let s = d / (1 - Math.abs(2 * l - 1));
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (((h * 60 + (th - 284)) % 360) + 360) % 360;
  s = Math.min(1, s * ts);
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round((l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))) * 255);
  };
  return [f(0), f(8), f(4)];
}
