"use client";

import type { MouseEvent, ReactNode } from "react";

/**
 * The list of the home FAQ (home-faq.tsx). On phones and tablets (below 1024 px, see home-faq.css) every answer is folded and the tapped question opens
 * (the others fold again); on a laptop every answer stays open and this does nothing visible. The answers are plain server HTML in both cases.
 */
export function FaqToggle({ children }: { children: ReactNode }) {
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const q = (e.target as HTMLElement).closest<HTMLButtonElement>(".hfq-q");
    const item = q?.closest<HTMLElement>(".hfq-item");
    if (!q || !item) return;
    const open = item.dataset.open !== "true";
    for (const other of e.currentTarget.querySelectorAll<HTMLElement>(".hfq-item[data-open='true']")) {
      other.dataset.open = "false";
      other.querySelector(".hfq-q")?.setAttribute("aria-expanded", "false");
    }
    item.dataset.open = String(open);
    q.setAttribute("aria-expanded", String(open));
  };
  return (
    <div className="hfq-list" onClick={onClick}>
      {children}
    </div>
  );
}
