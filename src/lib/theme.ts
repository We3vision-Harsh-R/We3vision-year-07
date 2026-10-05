// The visitor's colour theme (see the big comment on --th / --ts in app/globals.css).
// The whole site is painted with hsl(<offset from the theme hue>, <saturation x --ts>, <lightness>): choosing a colour only
// changes the two numbers --th (hue, degrees) and --ts (saturation factor) on <html>; lightness never changes, so text stays as
// readable as in the original violet theme.

export const BASE_HUE = 284; // the original violet
export const THEME_KEY = "we3.theme";
export const THEME_EVENT = "we3-theme";
/** The brand accent colour (the original #d387ff) has this lightness; the picker shows colours at it. */
export const ACCENT_L = 76.47;
export const S_MIN = 0.45;
export const S_MAX = 1.15;

export type Theme = { h: number; s: number; name: string; done: boolean };
export const DEFAULT_THEME: Theme = { h: BASE_HUE, s: 1, name: "", done: false };

const mod = (n: number, m: number) => ((n % m) + m) % m;
export const clampS = (s: number) => Math.min(S_MAX, Math.max(S_MIN, s));

export function loadTheme(): Theme | null {
  try {
    const raw = JSON.parse(localStorage.getItem(THEME_KEY) || "null");
    if (!raw || typeof raw.h !== "number") return null;
    return { h: mod(raw.h, 360), s: clampS(Number(raw.s) || 1), name: String(raw.name ?? "").slice(0, 16), done: true };
  } catch {
    return null;
  }
}

export function saveTheme(t: Theme) {
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify({ h: Math.round(mod(t.h, 360) * 10) / 10, s: Math.round(t.s * 100) / 100, name: t.name }));
  } catch {
    // private mode: the colour then only lasts for this visit
  }
}

/** The hue currently on <html> (unbounded: it can run past 360 so the colour always takes the short way round). */
function currentHue(): number {
  const v = parseFloat(document.documentElement.style.getPropertyValue("--th"));
  return Number.isFinite(v) ? v : BASE_HUE;
}

/** Sets the colour of the whole site (it animates, see the transition on :root) and tells canvases and the cursor. */
export function applyTheme(h: number, s: number, name?: string) {
  const cur = currentHue();
  let delta = mod(h, 360) - mod(cur, 360);
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  const root = document.documentElement;
  root.style.setProperty("--th", String(Math.round((cur + delta) * 100) / 100));
  root.style.setProperty("--ts", String(Math.round(clampS(s) * 1000) / 1000));
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { h: mod(h, 360), s: clampS(s), name } }));
}

/** Reads the colour that is on screen right now (also while it is animating), for canvas drawing. */
export function liveTheme(): { h: number; s: number } {
  const cs = getComputedStyle(document.documentElement);
  const h = parseFloat(cs.getPropertyValue("--th"));
  const s = parseFloat(cs.getPropertyValue("--ts"));
  return { h: Number.isFinite(h) ? h : BASE_HUE, s: Number.isFinite(s) ? s : 1 };
}

// ---- colour maths -------------------------------------------------------------------------------------------------
export function hslToHex(h: number, s: number, l: number): string {
  const S = Math.min(1, Math.max(0, s / 100));
  const L = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = S * Math.min(L, 1 - L);
  const f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const x = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${x(f(0))}${x(f(8))}${x(f(4))}`.toUpperCase();
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  let t = hex.trim().replace(/^#/, "");
  if (t.length === 3) t = t.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(t)) return null;
  const r = parseInt(t.slice(0, 2), 16) / 255;
  const g = parseInt(t.slice(2, 4), 16) / 255;
  const b = parseInt(t.slice(4, 6), 16) / 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  const l = (mx + mn) / 2;
  let h = 0;
  let s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = mod(h * 60, 360);
  }
  return { h, s: s * 100, l: l * 100 };
}

/** The brand accent in a theme, as a hex string (what the picker shows as "the colour"). Default theme = #D387FF. */
export function accentHex(h: number, s: number): string {
  return hslToHex(mod(h + (278 - BASE_HUE), 360), Math.min(100, 100 * s), ACCENT_L);
}

/** A hue name for screen readers. */
export function hueName(h: number): string {
  const names = ["Red", "Orange", "Yellow", "Lime", "Green", "Mint", "Cyan", "Sky blue", "Blue", "Violet", "Magenta", "Rose"];
  return names[Math.round(mod(h, 360) / 30) % 12];
}
