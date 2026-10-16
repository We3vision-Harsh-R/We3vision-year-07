"use client";

import { useEffect, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IcChevronLeft } from "./icons";

/**
 * The navigation bar of an app screen (the only client code every screen needs):
 *  - a Back control that returns to the launcher ("/", which the proxy rewrites to /m on a phone) with a short leave transition,
 *  - a small title that fades in when the large title has scrolled away (`data-scrolled` on .ma-root; CSS does the rest).
 */
export function ScreenChrome({ title }: { title: string }) {
  const router = useRouter();

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".ma-root");
    if (!root) return;
    let on = false;
    let frame = 0;
    const update = () => {
      frame = 0;
      const next = window.scrollY > 56;
      if (next === on) return;
      on = next;
      if (next) root.setAttribute("data-scrolled", "");
      else root.removeAttribute("data-scrolled");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const close = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const root = document.querySelector<HTMLElement>(".ma-root");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root?.classList.add("is-leaving");
    window.setTimeout(() => router.push("/"), calm ? 0 : 230);
  };

  return (
    <div className="ma-bar">
      <Link href="/" prefetch={false} className="ma-back" onClick={close} aria-label="Home screen">
        <IcChevronLeft />
        Home
      </Link>
      <span className="ma-bar-title" aria-hidden="true">{title}</span>
      <span aria-hidden="true" />
    </div>
  );
}
