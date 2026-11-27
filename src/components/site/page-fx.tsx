"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// The change from one page to another (owner, 2026-11-27): when a link to another page is tapped, the page behind softens (blur + a light dim, ease in-out);
// when the new page is there, the blur clears the same way. One fixed layer with `backdrop-filter`, so the pages themselves are never filtered (a filter on
// the page would break the fixed layers inside it). Looks: .pgx in globals.css. Reduced motion: no effect.
export function PageFx() {
  const path = usePathname();
  const [on, setOn] = useState(false);
  const last = useRef(path);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t = 0;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      let u: URL;
      try {
        u = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (u.origin !== window.location.origin || u.pathname === window.location.pathname) return;
      setOn(true);
      window.clearTimeout(t);
      t = window.setTimeout(() => setOn(false), 5000); // a page that never opens must not stay blurred
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (last.current === path) return;
    last.current = path;
    const id = window.setTimeout(() => setOn(false), 140); // the new page has its first paint, then the blur clears
    return () => window.clearTimeout(id);
  }, [path]);

  return <div className="pgx" data-on={on} aria-hidden />;
}
