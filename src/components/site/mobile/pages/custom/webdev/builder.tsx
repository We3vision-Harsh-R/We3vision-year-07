"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useCalm } from "../../../app/use-calm";

/**
 * "Type a name, watch it get built". Nobody knows they can type here, so it shows itself: while the field is untouched it types "www.we3vision.com"
 * by itself (and the small page below builds up with it), the border of the field glows, and a small "Tap and type" hint points at it. Touch the
 * field and the demo stops; the page then takes what you type. If you leave it empty the demo comes back. The words (label) come from the CMS.
 */
const DEMO = "www.we3vision.com";

export function SiteBuilder({ label }: { label: string }) {
  const [name, setName] = useState("");
  const [focus, setFocus] = useState(false);
  const [demo, setDemo] = useState("");
  const [seen, setSeen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const uid = useId();
  const calm = useCalm();

  // the demo only runs while the box is on the screen
  useEffect(() => {
    const el = box.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const idle = !focus && name === "";
  useEffect(() => {
    if (!idle || !seen || calm) return;
    let i = 0;
    let dir = 1;
    let t = 0;
    const tick = () => {
      i += dir;
      setDemo(DEMO.slice(0, i));
      if (dir === 1 && i >= DEMO.length) { dir = -1; t = window.setTimeout(tick, 2200); return; }
      if (dir === -1 && i <= 0) { dir = 1; t = window.setTimeout(tick, 700); return; }
      t = window.setTimeout(tick, dir === 1 ? 95 : 35);
    };
    t = window.setTimeout(tick, 500);
    return () => window.clearTimeout(t);
  }, [idle, seen, calm]);

  const shown = name || (idle ? (calm ? DEMO : demo) : "");
  const on = shown.length > 0;
  return (
    <div className={`mp-wd-build${idle ? " is-demo" : ""}`} ref={box}>
      <label className="mp-wd-addr" htmlFor={uid}>
        <span className="mp-wd-lock" aria-hidden="true" />
        <span className="ma-sr">{label}</span>
        <span className="mp-wd-field">
          {idle && shown && <span className="mp-wd-demo" aria-hidden="true">{shown}</span>}
          <input id={uid} className="mp-wd-input" value={name} maxLength={28} autoComplete="off" autoCapitalize="off" spellCheck={false} onChange={(e) => setName(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
        </span>
      </label>
      {idle && <p className="mp-wd-hint" aria-hidden="true"><span className="mp-wd-tap">Tap the bar and type your own name</span></p>}
      <div className="mp-wd-page" aria-hidden="true">
        <div className="mp-wd-nav">
          <b className={on ? "is-on" : ""}>{shown}</b>
          <i />
          <i />
          <i />
        </div>
        <div className="mp-wd-heroline">
          <span className={on ? "is-on" : ""} />
          <span className={on ? "is-on" : ""} />
        </div>
        <div className="mp-wd-blocks">
          <em className={on ? "is-on" : ""} />
          <em className={on ? "is-on" : ""} />
          <em className={on ? "is-on" : ""} />
        </div>
      </div>
    </div>
  );
}
