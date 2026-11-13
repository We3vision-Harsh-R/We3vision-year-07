"use client";

import { useEffect } from "react";

// THE GLIDING CARD ROWS OF THE HOME PAGE ON PHONES AND TABLETS (owner, 2026-11-13). Every row of cards that is swiped sideways (the "why" cards, Our products,
// the AI work cards, the home bento row) glides slowly from right to left by itself:
//   - it starts 1 second after the row comes into view, and stops when it leaves the screen or the tab is hidden;
//   - a touch (or the mouse wheel / trackpad) takes over at once, and the card can be moved by hand as usual;
//   - 1.4 seconds after the finger is lifted (and the swipe has settled) it glides on again from wherever the cards were left;
//   - it loops with no gap: a copy of the cards (aria-hidden, not focusable) is added after the real ones while the page is small, and removed again on a big screen.
// Reduced motion: nothing glides. Only scrollLeft changes; the styles are in styles/home-mobile.css (hms-).

const ROWS = ".hb2-points, .hb2-grid, .hb2-m-bento, .hba-work, .ac-list, .tl-ol, .abp-row, .ss, .rs-cards, .aip-svc, .aip-ind, .hm-addr, .pln-grid, .pph-auto, .gfx-notes, .gfx-frames, .gfx-abs, .gfx-kw, .bdv-plates, .e2e-jr, .e2e-eco, .e2e-aud, .e2e-why, .vp-bd-cols, .md-rel, .tj";
const START_DELAY = 1000;
const RESUME_DELAY = 1400;
const SPEED = 26; // pixels per second: slow and smooth

function glide(row: HTMLElement): () => void {
  const cards = (Array.from(row.children) as HTMLElement[]).filter((c) => !c.classList.contains("hb2-head") && getComputedStyle(c).position !== "absolute");
  if (cards.length < 2) return () => {};
  const clones = cards.map((c) => {
    const k = c.cloneNode(true) as HTMLElement;
    k.setAttribute("aria-hidden", "true");
    k.setAttribute("inert", "");
    k.setAttribute("data-in", "true");
    k.querySelectorAll<HTMLElement>("a, button").forEach((a) => a.setAttribute("tabindex", "-1"));
    if (k.tagName === "A") k.setAttribute("tabindex", "-1");
    k.removeAttribute("data-reveal");
    k.querySelectorAll("[data-reveal]").forEach((x) => x.removeAttribute("data-reveal"));
    k.classList.add("hb2-glide-copy");
    row.appendChild(k);
    return k;
  });

  let visible = false;
  let startAt = 0;
  let touching = false;
  let lastTouch = 0;
  let pos = row.scrollLeft;
  let setTo = pos;
  let last = 0;
  let raf = 0;
  let loop = 0;

  const measure = () => {
    loop = clones[0].offsetLeft - cards[0].offsetLeft;
  };
  const wrap = (x: number) => (loop > 0 ? (x >= loop ? x - loop : x < 0 ? x + loop : x) : x);

  const tick = (t: number) => {
    raf = 0;
    if (!visible || document.hidden) return;
    const dt = last ? Math.min(0.1, (t - last) / 1000) : 0;
    last = t;
    const now = performance.now();
    if (now < startAt || touching || now - lastTouch < RESUME_DELAY) {
      pos = row.scrollLeft;
    } else {
      if (!loop) measure();
      pos = wrap(pos + SPEED * dt);
      setTo = pos;
      row.scrollLeft = pos;
    }
    raf = requestAnimationFrame(tick);
  };
  const run = () => {
    if (!raf) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };

  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        startAt = performance.now() + START_DELAY;
        measure();
        run();
      }
    },
    { threshold: 0.3 },
  );
  io.observe(row);

  const down = () => {
    touching = true;
    lastTouch = performance.now();
  };
  const up = () => {
    touching = false;
    lastTouch = performance.now();
  };
  const wheel = () => {
    lastTouch = performance.now();
  };
  // a scroll that is not ours is the visitor's: wait for it to settle, and keep the loop seamless while it moves
  const onScroll = () => {
    const x = row.scrollLeft;
    if (Math.abs(x - setTo) > 1.5) {
      lastTouch = performance.now();
      if (!loop) measure();
      if (loop > 0 && (x >= loop || x <= 0)) {
        const y = x >= loop ? x - loop : x + loop;
        row.scrollLeft = y;
        setTo = y;
        pos = y;
      }
    }
  };
  const vis = () => {
    if (!document.hidden && visible) {
      startAt = performance.now() + 600;
      run();
    }
  };
  row.addEventListener("touchstart", down, { passive: true });
  row.addEventListener("touchend", up, { passive: true });
  row.addEventListener("touchcancel", up, { passive: true });
  row.addEventListener("pointerdown", down, { passive: true });
  row.addEventListener("pointerup", up, { passive: true });
  row.addEventListener("wheel", wheel, { passive: true });
  row.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", vis);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    row.removeEventListener("touchstart", down);
    row.removeEventListener("touchend", up);
    row.removeEventListener("touchcancel", up);
    row.removeEventListener("pointerdown", down);
    row.removeEventListener("pointerup", up);
    row.removeEventListener("wheel", wheel);
    row.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", vis);
    clones.forEach((k) => k.remove());
    row.scrollLeft = 0;
  };
}

// A row that belongs to a lazily hydrated part of a page is only touched once React has finished with it (the copies of the cards would otherwise be
// seen as a hydration mismatch). The last card gets its React link when the row has been taken over; a short pause follows.
function whenReady(row: HTMLElement): () => void {
  let dead = false;
  let stop = () => {};
  let tries = 0;
  const hydrated = (el: Element | null) => !!el && Object.keys(el).some((k) => k.startsWith("__reactFiber"));
  const go = () => {
    if (dead) return;
    if (hydrated(row) && hydrated(row.lastElementChild)) {
      setTimeout(() => {
        if (!dead) stop = glide(row);
      }, 600);
    } else if (tries++ < 1200) setTimeout(go, 500);
  };
  go();
  return () => {
    dead = true;
    stop();
  };
}

// A tall stack of three to twelve cards of the same width (on any page) becomes a sideways row on a phone: the class pph-auto (styles: globals.css, pph-).
// Only things that look like cards qualify; lists of links, questions and answers, forms and anything inside the menu or the footer do not.
const checked = new WeakSet<Element>();
const SKIP = "nav, footer, header, form, aside, [aria-expanded], details, canvas, input, textarea, select, [class*='faq'], [class*='-qa'], [class*='hb2-'], [class*='lnc'], [data-no-glide]";
function cardLike(c: HTMLElement): boolean {
  const s = getComputedStyle(c);
  const bg = s.backgroundColor.match(/[\d.]+/g);
  const alpha = bg && bg.length > 3 ? parseFloat(bg[3]) : bg ? 1 : 0;
  const look = parseFloat(s.borderTopWidth) > 0 || alpha > 0.03 || s.backgroundImage !== "none";
  const len = (c.textContent ?? "").trim().length;
  return look && len > 20 && len < 500;
}
function findStacks() {
  document.querySelectorAll<HTMLElement>("main ul, main ol, main div, main section").forEach((e) => {
    if (checked.has(e) || e.classList.contains("pph-auto") || e.closest("[class*='hb2-glide-copy']")) return;
    const n = e.children.length;
    if (n < 3 || n > 12) return;
    checked.add(e);
    if (e.matches(SKIP) || e.closest(SKIP)) return;
    const kids = Array.from(e.children) as HTMLElement[];
    const rs = kids.map((k) => k.getBoundingClientRect());
    const box = e.getBoundingClientRect();
    if (box.width < 240 || rs.some((r) => r.width < 0.8 * box.width || Math.abs(r.left - rs[0].left) > 6 || Math.abs(r.width - rs[0].width) > 8 || r.height < 100 || r.height > 560)) return;
    if (rs.reduce((a, r) => a + r.height, 0) < 520) return;
    if (kids.some((k) => k.matches(SKIP) || k.querySelector(SKIP) || getComputedStyle(k).position === "absolute")) return;
    if (!kids.every(cardLike)) return;
    e.classList.add("pph-auto");
  });
}

export function HomeGlide() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const small = window.matchMedia("(max-width: 900px)");
    const rows = new Map<HTMLElement, () => void>();
    // every second: the rows of the page now on screen that are not gliding yet start (pages change without a reload), the rows that left are cleaned up
    const scan = () => {
      for (const [row, stop] of rows) {
        if (!row.isConnected || !small.matches) {
          stop();
          rows.delete(row);
        }
      }
      if (!small.matches) return;
      findStacks();
      document.querySelectorAll<HTMLElement>(ROWS).forEach((row) => {
        if (!rows.has(row)) rows.set(row, whenReady(row));
      });
    };
    scan();
    const timer = window.setInterval(scan, 1000);
    return () => {
      window.clearInterval(timer);
      rows.forEach((stop) => stop());
      rows.clear();
    };
  }, []);
  return null;
}
