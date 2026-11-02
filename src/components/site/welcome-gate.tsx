"use client";

import "@/styles/welcome-gate.css";
import { useEffect, useState, useSyncExternalStore } from "react";

// THE FIRST THING A VISITOR SEES (owner, 2026-11-02): a calm message with a lot of white space, shown for 3 seconds, no button. Then it blurs away
// and the home page (already loading behind it) is there. Once per browser tab (sessionStorage), on the laptop site and on the phone/tablet site.
// The server renders it open; the script below closes it before the first paint when this tab has seen it already.
const KEY = "w3v-welcome";
const SHOW_MS = 3000;
const OUT_MS = 1300;
const BOOT = `(function(){try{if(sessionStorage.getItem("${KEY}")){document.documentElement.classList.add("wg-seen")}else{document.documentElement.classList.add("wg-lock")}}catch(e){}})();`;

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
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const open = !seen && !done;

  useEffect(() => {
    if (!open) return;
    const a = window.setTimeout(() => setLeaving(true), SHOW_MS);
    const b = window.setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      setDone(true);
    }, SHOW_MS + OUT_MS);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [open]);

  useEffect(() => {
    document.documentElement.classList.toggle("wg-lock", open && !leaving);
    return () => document.documentElement.classList.remove("wg-lock");
  }, [open, leaving]);

  if (!open) return null;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      <div className={`wg${leaving ? " wg-out" : ""}`} role="status" aria-live="polite">
        <div className="wg-card">
          <p className="wg-tag">We3vision</p>
          <h2 className="wg-t">
            For the best experience,
            <br />
            open this site on a laptop
          </h2>
          <span className="wg-line" aria-hidden />
          <p className="wg-sub">Click and celebrate</p>
        </div>
      </div>
    </>
  );
}
