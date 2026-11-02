"use client";

import "@/styles/welcome-gate.css";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// THE FIRST THING A VISITOR SEES (owner, 2026-11-02): before any page opens, a short message "For the best experience open on a laptop" and one
// button "Click and celebrate". The click opens the site with a small burst. It shows once per browser tab (sessionStorage), on the laptop site and
// on the phone/tablet site. The server renders it open; the script below closes it before the first paint when this tab has seen it already.
const KEY = "w3v-welcome";
const BOOT = `(function(){try{if(sessionStorage.getItem("${KEY}")){document.documentElement.classList.add("wg-seen")}else{document.documentElement.classList.add("wg-lock")}}catch(e){}})();`;
const SPARKS = 28;

function seenBefore() {
  try {
    return !!sessionStorage.getItem(KEY);
  } catch {
    return false;
  }
}
const noSubscribe = () => () => {};

export function WelcomeGate() {
  const seen = useSyncExternalStore(noSubscribe, seenBefore, () => false);
  const [done, setDone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const open = !seen && !done;

  useEffect(() => {
    if (open) btn.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    document.documentElement.classList.toggle("wg-lock", open && !leaving);
    return () => document.documentElement.classList.remove("wg-lock");
  }, [open, leaving]);

  function go() {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    setLeaving(true);
    window.setTimeout(() => setDone(true), 900);
  }

  if (!open) return null;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      <div className={`wg${leaving ? " wg-out" : ""}`} role="dialog" aria-modal="true" aria-labelledby="wg-t">
        <div className="wg-card">
          <p className="wg-tag">We3vision</p>
          <h2 id="wg-t" className="wg-t">
            For the best experience, open this site on a laptop
          </h2>
          <button ref={btn} type="button" className="wg-btn" onClick={go} disabled={leaving}>
            Click and celebrate
          </button>
          {leaving && (
            <span className="wg-burst" aria-hidden>
              {Array.from({ length: SPARKS }, (_, i) => (
                <i key={i} style={{ "--a": `${(360 / SPARKS) * i}deg`, "--d": `${90 + ((i * 37) % 80)}px`, "--k": i % 4 } as React.CSSProperties} />
              ))}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
