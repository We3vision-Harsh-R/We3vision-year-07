"use client";

import { Suspense, use, useEffect, useRef, useState, type ReactNode } from "react";

// LAZY HYDRATION (2026-11-06, optimize phase 9). The section is rendered on the server as always (text, links and SEO are in the page source), but
// its JavaScript is only downloaded and started when the section comes within ~800 px of the screen. Until then React keeps the server HTML as it
// is: the Gate below suspends while it hydrates, and a Suspense boundary that suspends during hydration stays dehydrated (clicks on it are replayed
// once it wakes up). The sentinel is a 1 px absolute box just before the section; it takes no room, so `main > section` rules still match.
function Gate({ wake, children }: { wake: Promise<void>; children: ReactNode }) {
  if (typeof window !== "undefined") use(wake);
  return children;
}

export function LazyHydrate({ children }: { children: ReactNode }) {
  const [wake] = useState(() => {
    let open = () => {};
    const promise = new Promise<void>((r) => (open = r));
    return { promise, open };
  });
  const sentinel = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || typeof IntersectionObserver === "undefined") return wake.open();
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        wake.open();
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [wake]);
  return (
    <>
      <span ref={sentinel} data-lh aria-hidden style={{ position: "absolute", width: 1, height: 1, pointerEvents: "none" }} />
      <Suspense fallback={null}>
        <Gate wake={wake.promise}>{children}</Gate>
      </Suspense>
    </>
  );
}
