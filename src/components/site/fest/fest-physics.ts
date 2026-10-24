// The physics of a firework, kept apart from the canvas so it can be tested. Units are CSS pixels and seconds.
//
//   rocket   a ballistic body: it leaves the ground with a speed and gravity slows it down until it stops at the top (the apex), where it bursts.
//            So it is fast at first and almost still at the end, like a real one, and the burst is exactly at the height that was asked.
//   stars    the burning balls of a burst fly out in all directions of a SPHERE (not a flat disc); air drag stops them quickly (v = v0 * e^-kt) and
//            gravity then pulls them down slowly, so the burst blooms and droops. Seen from the side the sphere is a round shell that is brightest at
//            the rim, which is how a real shell looks.

/** gravity on the heavy rocket body (px/s^2) */
export const ROCKET_G = 1150;

/** the launch speed (px/s, upwards) that brings a rocket to rest exactly `rise` px higher: v^2 = 2 g h */
export function launchSpeed(rise: number, g = ROCKET_G): number {
  return Math.sqrt(2 * g * Math.max(1, rise));
}

/** seconds a rocket needs to reach the top: t = v / g */
export function climbTime(rise: number, g = ROCKET_G): number {
  return launchSpeed(rise, g) / g;
}

/** the starting speed that lets a star with air drag `k` (1/s) travel `reach` px in `life` seconds: x(t) = v0 (1 - e^-kt) / k */
export function starSpeed(reach: number, k: number, life: number): number {
  return (reach * k) / (1 - Math.exp(-k * life));
}

/** the direction (unit vector) of star `i` of `n` on a sphere: a Fibonacci spiral spreads them evenly, like the stars packed in a real shell */
export function sphereDir(i: number, n: number, spin = 0): [number, number, number] {
  const z = 1 - (2 * (i + 0.5)) / n;
  const r = Math.sqrt(Math.max(0, 1 - z * z));
  const phi = i * 2.399963 + spin; // the golden angle
  return [Math.cos(phi) * r, Math.sin(phi) * r, z];
}

/** a ring: the directions lie in one plane that is tilted towards the viewer by `tilt` radians (0 = seen flat on, 1.4 = nearly edge on) */
export function ringDir(i: number, n: number, tilt: number, spin = 0): [number, number, number] {
  const a = (i / n) * Math.PI * 2 + spin;
  return [Math.cos(a), Math.sin(a) * Math.cos(tilt), Math.sin(a) * Math.sin(tilt)];
}

/** how far a star has fallen after `t` seconds with drag `k` and gravity `g`: terminal speed g/k, reached by e^-kt */
export function fallDistance(g: number, k: number, t: number): number {
  return (g / k) * (t - (1 - Math.exp(-k * t)) / k);
}

/** the colour of a burning star as [hue, saturation %, lightness %] by its age (0 new .. 1 burnt out): white-hot first, then its own colour,
 *  then a dying ember */
export function starColour(age: number, hue: number, hue2: number, sat: number, light: number): [number, number, number] {
  const hot = Math.max(0, 1 - age / 0.13);
  const shift = age * age * (3 - 2 * age);
  const dying = Math.max(0, (age - 0.72) / 0.28);
  return [hue + (hue2 - hue) * shift - dying * 8, sat * (1 - 0.7 * hot), light + (97 - light) * hot - dying * 14];
}

/** how bright a star is by its age: full for most of its life, then a fading, flickering end */
export function starAlpha(age: number, flicker: number): number {
  if (age < 0.5) return 1;
  const fade = 1 - Math.pow((age - 0.5) / 0.5, 1.6);
  const tw = age > 0.78 ? 0.45 + 0.55 * flicker : 1;
  return Math.max(0, fade * tw);
}
