"use client";

import { useEffect } from "react";
import { haptic } from "../haptics";

/**
 * The life of an app screen (one per screen, renders nothing). Everything is delegated from the screen root, so every page has it, with no change in
 * the page code:
 *  - REVEAL: cards, lists and titles that are still below the screen fade up as they come in (a short stagger between neighbours);
 *  - SMOOTH ROWS: every <details> (FAQ, process, folds, sitemap groups) opens and closes with a height animation; in a list only one row stays open;
 *    a row that opens inside a "Show more" section opens that section; the row is brought fully into view;
 *  - COUNT UP: big numbers count up when they appear;
 *  - ANCHORS: a link to #something uses the same blur jump as the tab bar;
 *  - TOUCH FEEDBACK: a light haptic tap on buttons, rows and tabs; pictures fade in; a field that gets focus is centred above the keyboard;
 *  - PROGRESS: a thin line under the navigation bar shows how far down the page you are.
 * With "reduce motion" nothing is animated (rows open natively, nothing fades).
 */
const REVEAL = ".ma-rvx, .ma-sec-head, .ma-card, .ma-group, .ma-dg, .ma-stats, .ma-car, .ma-cloud, .ma-pic, .mp-wd-panel, .ma-form, .ma-actions";
const TAP = "a[href], button, summary, .ma-row, [role='tab']";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function bringIntoView(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const bottom = window.innerHeight - 112; // the tab bar
  const top = 76; // the navigation bar
  if (r.bottom > bottom) window.scrollBy({ top: Math.min(r.bottom - bottom, r.top - top), behavior: "smooth" });
  else if (r.top < top) window.scrollBy({ top: r.top - top - 8, behavior: "smooth" });
}

function toggle(det: HTMLDetailsElement, force?: "open" | "close") {
  if (det.dataset.moving) return;
  const opening = force ? force === "open" : !det.open;
  if (opening === det.open) return;
  const sum = det.querySelector<HTMLElement>(":scope > summary");
  if (!sum) { det.open = opening; return; }
  det.dataset.moving = "1";
  const from = det.getBoundingClientRect().height;
  if (opening) det.open = true;
  const to = opening ? det.getBoundingClientRect().height : sum.getBoundingClientRect().height + (det.offsetHeight - det.clientHeight);
  det.style.overflow = "hidden";
  const a = det.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 340, easing: EASE });
  let over = false;
  const done = () => {
    if (over) return;
    over = true;
    if (!opening) det.open = false;
    det.style.overflow = "";
    delete det.dataset.moving;
    if (opening) bringIntoView(det);
  };
  a.onfinish = done;
  a.oncancel = done;
  window.setTimeout(done, 460);
}

export function Motion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".ma-root");
    if (!root) return;
    const reduced = calm();
    const cleanups: (() => void)[] = [];
    root.classList.add("ma-js");

    // ---------------------------------------------------------------- reveal + count up
    const pending = new Set<HTMLElement>();
    const show = (el: HTMLElement) => {
      if (!pending.delete(el)) return;
      el.classList.add("is-in");
      el.querySelectorAll<HTMLElement>(".ma-stat b").forEach(countUp);
    };
    const sweep = () => {
      pending.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.94 && r.bottom > 0 && r.height > 0) show(el);
      });
    };
    if (!reduced && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            io.unobserve(e.target);
            show(e.target as HTMLElement);
          }
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
      );
      const seen = new WeakSet<Element>();
      const scan = () => {
        const list = root.querySelectorAll<HTMLElement>(REVEAL);
        const groups = new Map<Element, number>();
        list.forEach((el) => {
          if (seen.has(el) || el.closest(".ma-car-track")) return; // the cards of a swipe row come in with the row
          seen.add(el);
          if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return; // already on the screen: no animation
          const p = el.parentElement ?? root;
          const n = groups.get(p) ?? 0;
          groups.set(p, n + 1);
          el.style.setProperty("--rv-d", `${Math.min(n, 4) * 70}ms`);
          el.classList.add("ma-rv");
          pending.add(el);
          io.observe(el);
        });
      };
      scan();
      const mo = new MutationObserver(() => scan());
      mo.observe(root, { childList: true, subtree: true });
      const sweeper = window.setInterval(sweep, 900);
      window.addEventListener("scroll", sweep, { passive: true });
      cleanups.push(() => { io.disconnect(); mo.disconnect(); window.clearInterval(sweeper); window.removeEventListener("scroll", sweep); });
    }
    function countUp(b: HTMLElement) {
      if (reduced || b.dataset.counted) return;
      b.dataset.counted = "1";
      const m = b.textContent?.trim().match(/^(\D*)(\d{1,6})(\D*)$/);
      if (!m) return;
      const [, pre, num, post] = m;
      const end = Number(num);
      if (end < 2) return;
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1000);
        b.textContent = `${pre}${Math.round(end * (1 - Math.pow(1 - k, 3)))}${post}`;
        if (k < 1) requestAnimationFrame(step);
      };
      b.textContent = `${pre}0${post}`;
      requestAnimationFrame(step);
    }

    // ---------------------------------------------------------------- clicks: smooth rows, anchors, touch feedback
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !root.contains(t)) return;
      // a row (details) opens and closes smoothly
      const sum = t.closest("summary");
      if (sum && !reduced) {
        const det = sum.parentElement;
        if (det instanceof HTMLDetailsElement && !det.hasAttribute("data-native")) {
          e.preventDefault();
          const opening = !det.open;
          if (opening) {
            // only one row open in a list
            const par = det.parentElement;
            if (par && (par.classList.contains("ma-group") || par.classList.contains("mp-wd-panel"))) {
              par.querySelectorAll<HTMLDetailsElement>(":scope > details[open]").forEach((o) => { if (o !== det) toggle(o, "close"); });
            }
            // a list that asks for it (data-exclusive): the steps are <li><details>
            const list = det.closest("[data-exclusive]");
            list?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((o) => { if (o !== det) toggle(o, "close"); });
            // a "Show more" section that is still closed opens first
            const more = det.closest(".ma-collapse")?.querySelector<HTMLButtonElement>(":scope > .ma-more[aria-expanded='false']");
            more?.click();
          }
          toggle(det);
          haptic("select");
          return;
        }
      }
      // a link to a place on the same screen: the blur jump
      const a = t.closest<HTMLAnchorElement>("a[href^='#']");
      if (a && a.getAttribute("href")!.length > 1) {
        const id = decodeURIComponent(a.getAttribute("href")!.slice(1));
        if (document.getElementById(id)) {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("ma:jump", { detail: id }));
          haptic("light");
          return;
        }
      }
      if (t.closest(TAP)) haptic("select");
    };
    root.addEventListener("click", onClick, true);
    cleanups.push(() => root.removeEventListener("click", onClick, true));

    // ---------------------------------------------------------------- pictures fade in, fields are centred
    const fade = (img: HTMLImageElement) => img.classList.add("is-ld");
    root.querySelectorAll("img").forEach((img) => (img.complete ? fade(img) : img.addEventListener("load", () => fade(img), { once: true })));
    const onLoad = (e: Event) => { if (e.target instanceof HTMLImageElement) fade(e.target); };
    root.addEventListener("load", onLoad, true);
    cleanups.push(() => root.removeEventListener("load", onLoad, true));
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement;
      if (!t.matches?.("input, textarea") || reduced) return;
      window.setTimeout(() => t.scrollIntoView({ block: "center", behavior: "smooth" }), 320);
    };
    root.addEventListener("focusin", onFocus);
    cleanups.push(() => root.removeEventListener("focusin", onFocus));

    // ---------------------------------------------------------------- progress line
    let frame = 0;
    const prog = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--prog", String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(prog); };
    prog();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => { window.removeEventListener("scroll", onScroll); if (frame) cancelAnimationFrame(frame); });

    return () => { root.classList.remove("ma-js"); cleanups.forEach((c) => c()); };
  }, []);
  return null;
}
