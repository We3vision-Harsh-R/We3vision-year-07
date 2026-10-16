"use client";

import { useEffect } from "react";

// The cartoon guides (.ch, avatar.tsx) have a walk cycle that runs all the time, and a page can hold more than a hundred of them (the timeline of the
// About page alone has ~100). Their parts are SVG shapes, so every one of those animations is worked out on the main thread on every frame, also for
// the people nobody can see. This pauses the animations of every figure that is off the screen (and starts them again when it comes back), which
// keeps the scroll smooth. Nothing changes for what the visitor can see: a paused figure stands exactly where its cycle stopped.
export function PauseOffscreen() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.setAttribute("data-off", e.isIntersecting ? "false" : "true");
      },
      { rootMargin: "160px 0px" },
    );
    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll(".ch").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();
    // figures are added later too (a section that mounts when it comes near, the menu): look again when the page changes (at most a few times per second)
    let timer = 0;
    const mo = new MutationObserver(() => {
      if (!timer) {
        timer = window.setTimeout(() => {
          timer = 0;
          scan();
        }, 350);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return null;
}
