"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SceneProps } from "./guide-kit";
import { SCENES } from "./guide-scenes";

// The interactive guide: a card with a scene where the cartoon guide works with the technology of the page (guide-scenes.tsx).
// Its eyes and head follow the pointer, it hops when clicked, it talks (a speech bubble with the tips of the page, one after the other)
// and every scene has something to play with. The pointer is tracked on the whole window while the card is on screen.

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

export function GuideScene({ scene, tips }: { scene: string; tips: string[] }) {
  const Scene = (SCENES[scene] ?? SCENES.hello) as (p: SceneProps) => React.JSX.Element;
  const rootRef = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const talkT = useRef(0);
  const [tip, setTip] = useState(0);
  const [custom, setCustom] = useState<string | null>(null);
  const [bump, setBump] = useState(0);
  const list = tips.length ? tips : ["Hi! I am the guide of We3vision."];
  const text = custom ?? list[tip % list.length];

  // the mouth moves for a moment whenever the guide says something (set on the element, no re-render needed)
  const talk = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    el.dataset.talk = "1";
    window.clearTimeout(talkT.current);
    talkT.current = window.setTimeout(() => {
      if (el) el.dataset.talk = "0";
    }, 1500);
  }, []);
  const say = useCallback(
    (t: string) => {
      setCustom(t);
      talk();
    },
    [talk],
  );
  const onAvatar = useCallback(() => {
    setBump((n) => n + 1);
    setCustom(null);
    setTip((n) => n + 1);
    talk();
  }, [talk]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      const stage = el.querySelector<HTMLElement>(".gs-stage");
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      // the head of the guide is at about 35% / 28% of the scene
      el.style.setProperty("--lx", clamp((px - (r.left + r.width * 0.355)) / (r.width * 0.55)).toFixed(3));
      el.style.setProperty("--ly", clamp((py - (r.top + r.height * 0.3)) / (r.height * 0.6)).toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf && visible.current) raf = requestAnimationFrame(apply);
    };
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });
    // every few seconds the guide says the next tip by itself, while it is on screen
    const id = window.setInterval(() => {
      if (!visible.current) return;
      setCustom(null);
      setTip((n) => n + 1);
      talk();
    }, 7500);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.clearInterval(id);
      window.clearTimeout(talkT.current);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [talk]);

  return (
    <div ref={rootRef} className="gs" data-scene={scene} data-talk="0">
      <p key={text} className="gs-bubble" role="status" aria-live="polite">
        {text}
      </p>
      <Scene say={say} bump={bump} onAvatar={onAvatar} />
      <p className="gs-hint">Click the guide, move your mouse and play with the scene</p>
    </div>
  );
}
