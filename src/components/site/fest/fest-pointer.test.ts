import { describe, expect, it } from "vitest";
import { ROCKET_TOP, rocketTarget } from "./fest-pointer";

describe("rocket on click: where it bursts", () => {
  it("stays on the screen, below the top margin, for every click height and every random number", () => {
    for (let cy = 0; cy <= 1400; cy += 7) {
      for (const r of [0, 0.25, 0.5, 0.75, 0.999999]) {
        const ty = rocketTarget(cy, r);
        expect(ty).toBeGreaterThanOrEqual(ROCKET_TOP);
        // (a click right under the margin has no room: the rocket then stays where it was clicked, never goes up past the margin)
        expect(ty).toBeLessThanOrEqual(Math.max(ROCKET_TOP, cy));
      }
    }
  });
  it("climbs between 35 % and 92 % of the free height above the click", () => {
    const cy = 856; // free height 800
    expect(rocketTarget(cy, 0)).toBeCloseTo(cy - 0.35 * 800, 5);
    expect(rocketTarget(cy, 1)).toBeCloseTo(cy - 0.92 * 800, 5);
  });
  it("a click near the top climbs a short way only", () => {
    const ty = rocketTarget(100, 0.5); // free height 44
    expect(ty).toBeLessThan(100);
    expect(ty).toBeGreaterThanOrEqual(ROCKET_TOP);
  });
  it("different random numbers give different heights (the height is random)", () => {
    expect(rocketTarget(700, 0.1)).not.toBeCloseTo(rocketTarget(700, 0.9), 0);
  });
});
