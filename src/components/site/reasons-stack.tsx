"use client";

import { useEffect, useRef, useState } from "react";
import { IconTile } from "./icons";

type Item = { title: string; description: string };

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

// "Why We3vision" made easy to understand: on the left a list of the reasons stays in place like a check list, on the right the reasons pass by
// one after the other, big and readable. On a desktop the stage is pinned and the cards go the other way round than usual: while you scroll DOWN
// the next reason comes in from ABOVE and moves down to the middle (the one before it leaves at the bottom). The reason in the middle is the
// active one: it is ticked on the list (the ticks are drawn while you scroll) and the line of the list fills up. Only the position and the
// opacity of five cards change, so the scroll stays smooth. Click a reason in the list to go to it. On a tablet, a phone and for visitors who
// prefer less motion the reasons are simply one under the other.
export function ReasonsStack({ chip, heading, intro, items }: { chip: string; heading: string; intro?: string; items: Item[] }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    const pin = pinRef.current;
    const col = cardsRef.current;
    if (!track || !pin || !col || n < 1) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    let last = -1;
    let io: IntersectionObserver | null = null;

    // pinned: the scroll moves the cards, from the top to the bottom
    const place = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const dist = Math.max(1, r.height - pin.offsetHeight);
      const p = Math.min(1, Math.max(0, -r.top / dist));
      const seg = p * (n - 1);
      const i = Math.min(Math.max(0, n - 2), Math.floor(seg));
      // every reason rests in the middle for a while, then the next one comes down
      const f = n < 2 ? 0 : p >= 1 ? n - 1 : i + smooth((seg - i - 0.2) / 0.6);
      col.style.setProperty("--f", f.toFixed(4));
      cards.current.forEach((el, k) => {
        if (!el) return;
        const a = Math.min(1, Math.abs(k - f));
        el.style.opacity = String((1 - a * 0.68).toFixed(3));
        el.style.transform = `scale(${(1 - a * 0.045).toFixed(4)})`;
      });
      const idx = Math.round(f);
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };
    const clearStyles = () => {
      col.style.removeProperty("--f");
      cards.current.forEach((el) => {
        if (el) {
          el.style.opacity = "";
          el.style.transform = "";
        }
      });
    };
    const setup = () => {
      if (io) {
        io.disconnect();
        io = null;
      }
      if (mq.matches) {
        place();
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onScroll);
        clearStyles();
        // not pinned: the card in the middle of the screen is the active one
        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
          },
          { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
        );
        cards.current.forEach((el) => el && io?.observe(el));
      }
    };
    setup();
    window.addEventListener("resize", setup);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setup);
      if (io) io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);

  // a click on the list: pinned, scroll to the place where that reason rests in the middle; otherwise to its card
  const goTo = (i: number) => {
    const track = trackRef.current;
    const pin = pinRef.current;
    const el = cards.current[i];
    if (!track || !pin) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    let y: number;
    if (window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches) {
      const dist = Math.max(1, track.offsetHeight - pin.offsetHeight);
      y = track.getBoundingClientRect().top + window.scrollY + (n > 1 ? (i / (n - 1)) * dist : 0);
    } else if (el) {
      y = el.getBoundingClientRect().top + window.scrollY - (window.innerHeight - el.offsetHeight) / 2;
    } else return;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (n === 0) return null;

  return (
    <div ref={trackRef} className="rs" style={{ "--n": n } as React.CSSProperties}>
      <div ref={pinRef} className="rs-pin">
        <aside className="rs-side">
          <span className="rs-chip">{chip}</span>
          <h2 className="text-vfade rs-title">{heading}</h2>
          {intro && <p className="rs-intro">{intro}</p>}
          <p className="rs-count">
            <b>{n}</b> reasons to build your website with us
          </p>
          <ol className="rs-list">
            <span className="rs-line" aria-hidden>
              <i style={{ transform: `scaleY(${n > 1 ? active / (n - 1) : 1})` }} />
            </span>
            {items.map((it, i) => (
              <li key={i} data-done={i <= active} data-on={i === active}>
                <button type="button" onClick={() => goTo(i)} aria-current={i === active ? "true" : undefined}>
                  <svg viewBox="0 0 24 24" className="rs-tick" aria-hidden>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M7 12.5l3.4 3.4L17 9" />
                  </svg>
                  <span>{it.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <div className="rs-view">
          <div ref={cardsRef} className="rs-cards">
            {items.map((it, i) => (
              <article
                key={i}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                data-i={i}
                data-on={i === active}
                className="rs-card"
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="rs-top">
                  <IconTile index={i + 2} large />
                  <span className="rs-label">
                    Reason {i + 1} of {n}
                  </span>
                </div>
                <h3>{it.title}</h3>
                <p>{it.description}</p>
                <span className="rs-no" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
