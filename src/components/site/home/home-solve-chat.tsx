"use client";

import { useEffect, useRef, useState } from "react";

// THE PROBLEM CHAT (owner, 2026-11-13, phone): instead of a long list of problems and answers, a small chat. The visitor taps a problem (it is sent as their
// message) and the assistant answers with the answer of the list ("With AI", "Our answer"). Answers are fixed text from the page, nothing is sent anywhere.
// It is only shown on a phone (styles/home-phone-ux.css, "hps-"); on a laptop the list stays. Used by the AI and the Brand Design sections of the home page.
type Item = { q: string; a: string };
type Line = { who: "me" | "bot"; text: string; tag?: string };

export function SolveChat({ items, tag, hello }: { items: Item[]; tag: string; hello: string }) {
  const [lines, setLines] = useState<Line[]>([{ who: "bot", text: hello }]);
  const [asked, setAsked] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const b = box.current;
    if (b) b.scrollTo({ top: b.scrollHeight, behavior: "smooth" });
  }, [lines.length, typing]);

  const ask = (i: number) => {
    if (typing || asked.includes(i)) return;
    setAsked((a) => [...a, i]);
    setLines((l) => [...l, { who: "me", text: items[i].q }]);
    setTyping(true);
    timer.current = setTimeout(() => {
      setLines((l) => [...l, { who: "bot", text: items[i].a, tag }]);
      setTyping(false);
    }, 650);
  };
  const left = items.map((s, i) => ({ s, i })).filter(({ i }) => !asked.includes(i));

  return (
    <div className="hps" role="group" aria-label="Ask about a problem">
      <div ref={box} className="hps-log" aria-live="polite">
        {lines.map((l, k) => (
          <p key={k} className={`hps-b hps-${l.who}`}>
            {l.tag && <b>{l.tag}</b>}
            {l.text}
          </p>
        ))}
        {typing && (
          <p className="hps-b hps-bot hps-dots" aria-label="Typing">
            <i />
            <i />
            <i />
          </p>
        )}
      </div>
      {left.length > 0 && (
        <ul className="hps-ask">
          {left.map(({ s, i }) => (
            <li key={s.q}>
              <button type="button" onClick={() => ask(i)} disabled={typing}>
                {s.q}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
