import { describe, expect, it } from "vitest";
import { ROCKET_G, climbTime, fallDistance, launchSpeed, ringDir, sphereDir, starAlpha, starColour, starSpeed } from "./fest-physics";

describe("fireworks physics", () => {
  it("a rocket launched with launchSpeed stops exactly at the asked height", () => {
    for (const rise of [60, 240, 520]) {
      let v = launchSpeed(rise);
      let y = 0;
      const dt = 1 / 2000;
      while (v > 0) {
        v -= ROCKET_G * dt;
        y += v * dt;
      }
      expect(Math.abs(y - rise)).toBeLessThan(rise * 0.01 + 0.5);
    }
  });

  it("a higher rocket is faster and needs longer", () => {
    expect(launchSpeed(500)).toBeGreaterThan(launchSpeed(100));
    expect(climbTime(500)).toBeGreaterThan(climbTime(100));
    expect(climbTime(100)).toBeCloseTo(launchSpeed(100) / ROCKET_G, 6);
  });

  it("a star with starSpeed reaches the asked distance", () => {
    const k = 2.1;
    const life = 1.6;
    const v0 = starSpeed(150, k, life);
    const x = (v0 / k) * (1 - Math.exp(-k * life));
    expect(x).toBeCloseTo(150, 6);
  });

  it("the stars of a sphere are unit vectors spread over all of it", () => {
    const n = 90;
    let sx = 0;
    let sy = 0;
    let sz = 0;
    let front = 0;
    for (let i = 0; i < n; i++) {
      const [x, y, z] = sphereDir(i, n, 0.3);
      expect(Math.hypot(x, y, z)).toBeCloseTo(1, 6);
      sx += x;
      sy += y;
      sz += z;
      if (z > 0) front++;
    }
    expect(Math.hypot(sx, sy, sz) / n).toBeLessThan(0.05); // no side is heavier
    expect(front).toBe(n / 2);
  });

  it("a ring lies in one plane, a flat ring is a circle and a tilted ring an ellipse", () => {
    const flat = Array.from({ length: 24 }, (_, i) => ringDir(i, 24, 0));
    for (const [x, y, z] of flat) {
      expect(Math.hypot(x, y)).toBeCloseTo(1, 6);
      expect(z).toBeCloseTo(0, 6);
    }
    const tilted = Array.from({ length: 24 }, (_, i) => ringDir(i, 24, 1));
    const h = Math.max(...tilted.map((d) => Math.abs(d[1])));
    expect(h).toBeCloseTo(Math.cos(1), 2);
    for (const [x, y, z] of tilted) expect(Math.hypot(x, y, z)).toBeCloseTo(1, 6);
  });

  it("stars fall slowly at first and then at a steady pace (terminal speed g/k)", () => {
    const g = 160;
    const k = 2;
    expect(fallDistance(g, k, 0.2)).toBeLessThan(fallDistance(g, k, 1) * 0.1);
    const d1 = fallDistance(g, k, 3);
    const d2 = fallDistance(g, k, 4);
    expect(d2 - d1).toBeCloseTo(g / k, 0);
  });

  it("a star is white-hot when new, its own colour in the middle and dim at the end", () => {
    const born = starColour(0, 45, 45, 100, 60);
    const mid = starColour(0.4, 45, 45, 100, 60);
    const dead = starColour(1, 45, 45, 100, 60);
    expect(born[2]).toBeGreaterThan(90);
    expect(mid[2]).toBeCloseTo(60, 0);
    expect(dead[2]).toBeLessThan(mid[2]);
    expect(starAlpha(0.2, 1)).toBe(1);
    expect(starAlpha(1, 1)).toBe(0);
    expect(starAlpha(0.9, 0)).toBeLessThan(starAlpha(0.9, 1));
  });
});
