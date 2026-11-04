"use client";

import { useEffect, useState, type ComponentType } from "react";

// The AI card of the first screen. The chat (and the Markdown library it needs) is not part of the first load: a card of the same size is drawn at
// once (so nothing jumps) and the chat takes its place when the browser is idle, a moment after the first paint.
export function HeroAi() {
  const [Chat, setChat] = useState<ComponentType<{ hero?: boolean }> | null>(null);
  useEffect(() => {
    let off = false;
    const load = () =>
      void import("./ai-chat").then((m) => {
        if (!off) setChat(() => m.AiChat);
      });
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const h = idle ? idle(load, { timeout: 2500 }) : window.setTimeout(load, 900);
    return () => {
      off = true;
      if (!idle) window.clearTimeout(h);
      else (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(h);
    };
  }, []);
  if (Chat) return <Chat hero />;
  return (
    <div className="pd pd-hero" data-open="true" aria-hidden>
      <div className="pd-hero-ph" />
      <div className="pd-hero-ph pd-hero-bar" />
    </div>
  );
}
