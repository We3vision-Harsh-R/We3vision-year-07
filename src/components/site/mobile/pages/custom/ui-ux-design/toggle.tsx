"use client";

import { useId, useState } from "react";

/**
 * "From wireframe to final design": the laptop shows a small Figma where you switch from the grey wireframe to the finished design.
 * Here: one frame and one switch (the label is the CMS tip). Shapes only; no words of its own.
 */
export function WireToDesign({ label }: { label: string }) {
  const [final, setFinal] = useState(false);
  const uid = useId();
  return (
    <div className={"mp-ux-frame mp-ux-glass" + (final ? " is-final" : "")}>
      <div className="mp-ux-art" aria-hidden="true">
        <span className="mp-ux-bar" />
        <span className="mp-ux-img" />
        <span className="mp-ux-line" />
        <span className="mp-ux-line is-short" />
        <span className="mp-ux-btn" />
      </div>
      <label className="mp-ux-sw" htmlFor={uid}>
        <span>{label}</span>
        <input id={uid} type="checkbox" role="switch" checked={final} onChange={(e) => setFinal(e.target.checked)} />
        <i aria-hidden="true" />
      </label>
    </div>
  );
}
