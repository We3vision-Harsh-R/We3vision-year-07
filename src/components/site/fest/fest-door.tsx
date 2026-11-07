"use client";

import "@/styles/fest-places.css";

// DIWALI AT THE GATE of the home page (switch "door" in Admin > Fest, group Places): a row of diyas on the dune in front of the glowing door.
// It sits inside the 3D world of the first screen (.hb2-world), on the same box as the dunes (1440 x 360 units, stretched), so the diyas lie on the
// dune curve and zoom in with the camera. Each flame flickers and each glow breathes (transform / opacity only, CSS "fdr-" in styles/fest-places.css).

type P = [number, number];
const bez = (a: P, b: P, c: P, d: P, t: number): P => {
  const u = 1 - t;
  return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
};
// the front dune of the first screen (the same numbers as the path in home2-home.tsx)
const S1: P[] = [[0, 262], [200, 237], [330, 274], [520, 248]];
const S2: P[] = [[520, 248], [700, 224], [820, 212], [980, 182]];
// where the diyas stand: on both sides of the door (the door and its rings take x 612..828), a little nearer ones bigger
const SPOTS: { s: P[]; t: number; k: number }[] = [
  { s: S1, t: 0.8, k: 1.15 },
  { s: S1, t: 0.92, k: 1.3 },
  { s: S1, t: 1, k: 1.45 },
  { s: S2, t: 0.05, k: 1.55 },
  { s: S2, t: 0.11, k: 1.6 },
  { s: S2, t: 0.8, k: 1.3 },
  { s: S2, t: 0.88, k: 1.2 },
  { s: S2, t: 0.95, k: 1.1 },
  { s: S2, t: 1, k: 1 },
];
const DIYAS = SPOTS.map((p, i) => {
  const [x, y] = bez(p.s[0], p.s[1], p.s[2], p.s[3], p.t);
  return { x: (x / 1440) * 100, y: (y / 360) * 100 - 3, k: p.k, d: (i * 0.37) % 1.6 };
});

export function DoorFest() {
  return (
    <div className="fdr" aria-hidden>
      {DIYAS.map((d, i) => (
        <span key={i} className="fdr-d" style={{ left: `${d.x}%`, top: `${d.y}%`, "--k": d.k, "--dl": `${d.d}s` } as React.CSSProperties}>
          <i className="fdr-glow" />
          <i className="fdr-bowl" />
          <i className="fdr-flame" />
        </span>
      ))}
    </div>
  );
}
