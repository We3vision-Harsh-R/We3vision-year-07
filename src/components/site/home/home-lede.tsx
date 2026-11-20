"use client";

import { useState } from "react";

/** the paragraph under the title of the first screen: on a phone it is one line with "Read more…" (styles/home-mobile.css, hph-); a laptop shows it whole */
export function HomeLede({ children }: { children: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <p id="hb2-lede" className={`hb2-lede${open ? " is-open" : ""}`}>
        {children}
      </p>
      <button type="button" className="hph-more" aria-expanded={open} aria-controls="hb2-lede" onClick={() => setOpen((o) => !o)}>
        {open ? "Show less" : "Read more…"}
      </button>
    </>
  );
}
