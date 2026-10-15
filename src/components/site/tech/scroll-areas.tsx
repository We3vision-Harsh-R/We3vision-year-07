"use client";

import { useEffect } from "react";

// Long lists on the technology pages scroll inside their own box (see "tsc-" in globals.css). Lenis (the smooth page scroll) would swallow the
// mouse wheel, so these boxes are marked with data-lenis-prevent and the wheel scrolls the box first.
const AREAS = ".wpa-main, .shp-main";

export function TechScrollAreas() {
  useEffect(() => {
    document.querySelectorAll(AREAS).forEach((el) => el.setAttribute("data-lenis-prevent", ""));
  }, []);
  return null;
}
