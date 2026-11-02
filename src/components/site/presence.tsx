"use client";

import "@/styles/presence.css";
import { useEffect, useRef, useState } from "react";
import { NAME_KEY, VID_KEY, cleanName, type OtherCursor } from "@/lib/presence";

// LIVE CURSORS AND THE FIRST-VISIT NAME (owner, 2026-11-02; laptop site only, loaded late by late-extras.tsx).
//  - the first time somebody opens the site, once the welcome message is gone, one small question: their name (nothing else). It is the label of
//    their own cursor ("You" until then) and of their cursor on the screens of the others
//  - every few moments the page tells the server where the pointer is and gets back the pointers of the other visitors on the same page; Admin >
//    Visitors says how many are shown (the ones who came in first are shown first). They wear one colour, never the colour of the visitor's own cursor.
export const NAME_EVENT = "we3-name";
const SKIP_KEY = "w3v-name-skip";
const TICK_MS = 350;

const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* private mode: the name then only lasts for this visit */
  }
};

function visitorId(): string {
  let id = read(VID_KEY);
  if (!id || !/^[a-z0-9]{8,32}$/i.test(id)) {
    id = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => (b % 36).toString(36)).join("");
    write(VID_KEY, id);
  }
  return id;
}

export function PresenceLive() {
  const [others, setOthers] = useState<OtherCursor[]>([]);
  const [ask, setAsk] = useState(false);
  const [name, setName] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const me = useRef({ x: null as number | null, y: null as number | null, name: "", hi: true, askName: false });

  // 1. the poll: where is my pointer, where are the others
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const id = visitorId();
    me.current.name = cleanName(read(NAME_KEY));
    let tab = false;
    try {
      tab = !sessionStorage.getItem("w3v-tab");
      sessionStorage.setItem("w3v-tab", "1");
    } catch {}
    let off = false;
    const move = (e: PointerEvent) => {
      me.current.x = Math.round((e.clientX / innerWidth) * 10000) / 10000;
      me.current.y = Math.round((e.clientY / innerHeight) * 10000) / 10000;
    };
    window.addEventListener("pointermove", move, { passive: true });
    const tick = async () => {
      if (off || document.hidden) return;
      const m = me.current;
      const hi = m.hi;
      const isTab = hi && tab;
      if (hi) tab = false;
      try {
        const res = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, n: m.name, p: location.pathname, x: m.x, y: m.y, hi, tab: isTab }),
          keepalive: true,
        });
        if (!res.ok || off) return;
        const data = (await res.json()) as { cursors: boolean; askName: boolean; others: OtherCursor[] };
        m.hi = false;
        m.askName = data.askName;
        setOthers(data.cursors ? data.others : []);
        if (hi && data.askName && !read(NAME_KEY) && !read(SKIP_KEY)) {
          // wait until the welcome message has gone
          const wait = window.setInterval(() => {
            if (off) return window.clearInterval(wait);
            if (document.querySelector(".wg")) return;
            window.clearInterval(wait);
            setAsk(true);
          }, 400);
        }
      } catch {
        /* offline: the next tick tries again */
      }
    };
    void tick();
    const iv = window.setInterval(() => void tick(), TICK_MS);
    const onName = () => {
      me.current.name = cleanName(read(NAME_KEY));
      me.current.hi = true; // tell the server (and the visitor log) the name now
    };
    window.addEventListener(NAME_EVENT, onName);
    return () => {
      off = true;
      window.clearInterval(iv);
      window.removeEventListener("pointermove", move);
      window.removeEventListener(NAME_EVENT, onName);
    };
  }, []);

  useEffect(() => {
    if (ask) input.current?.focus();
  }, [ask]);

  function done(value: string) {
    const n = cleanName(value);
    if (n) write(NAME_KEY, n);
    else write(SKIP_KEY, "1");
    window.dispatchEvent(new Event(NAME_EVENT));
    setAsk(false);
  }

  return (
    <>
      <div className="pc-layer" aria-hidden>
        {others.map((o) => (
          <div key={o.id} className="pc-one" style={{ transform: `translate3d(${(o.x * 100).toFixed(3)}vw, ${(o.y * 100).toFixed(3)}vh, 0)` }}>
            <svg className="pc-arrow" width="22" height="22" viewBox="0 0 26 26" fill="none">
              <path
                d="M23.596 10.789c.812-.316 1.218-.474 1.332-.697a.658.658 0 0 0-.008-.614c-.12-.22-.53-.368-1.35-.662L2.655 1.308c-.671-.24-1.007-.361-1.226-.285a.658.658 0 0 0-.406.406c-.076.22.044.555.285 1.226L8.816 23.57c.294.82.442 1.23.662 1.35.19.104.42.107.614.008.223-.114.38-.52.697-1.332l3.418-8.79c.061-.159.092-.238.14-.305a.659.659 0 0 1 .154-.154 1.41 1.41 0 0 1 .305-.14l8.79-3.418Z"
                fill="currentColor"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span className="pc-name">{o.name}</span>
          </div>
        ))}
      </div>
      {ask && (
        <div className="na" role="dialog" aria-modal="true" aria-label="Your name">
          <form
            className="na-card"
            onSubmit={(e) => {
              e.preventDefault();
              done(name);
            }}
          >
            <label htmlFor="na-in" className="na-q">
              What should we call you?
            </label>
            <input
              id="na-in"
              ref={input}
              className="na-in"
              value={name}
              maxLength={16}
              autoComplete="given-name"
              placeholder="Your name"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") done("");
              }}
            />
            <span className="na-hint">Press Enter</span>
          </form>
        </div>
      )}
    </>
  );
}
