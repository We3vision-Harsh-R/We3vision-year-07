import type { ReactNode } from "react";
import { Clamp } from "./clamp";

/**
 * Wraps one whole section of a screen: when it is taller than `max` px (about one and a half screens) only the first part shows, fading out, with a
 * "Show more" button; a short section is shown as it is. Everything stays in the page. Used by renderMobilePage for every section after the first.
 */
export function Collapse({ children, max = 640 }: { children: ReactNode; max?: number }) {
  return (
    <Clamp max={`${max}px`} slack={150} fade="120px" more="Show more" less="Show less" className="ma-collapse">
      {children}
    </Clamp>
  );
}
