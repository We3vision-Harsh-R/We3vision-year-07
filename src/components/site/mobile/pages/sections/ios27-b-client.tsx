"use client";

import { useRef, useState, type KeyboardEvent } from "react";

// Interactive parts of the shared sections (iOS 27 pass, "ma-s27-"). Styles: app/ios27-sections.css.

/** industries: a row of capsules (a tab list) and the answer of the one you pick under it. Every answer is in the HTML (the others are hidden). */
export function IndustryPicker({ id, items }: { id: string; items: { name: string; description: string }[] }) {
  const [on, setOn] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const pick = (i: number) => {
    const n = (i + items.length) % items.length;
    setOn(n);
    const b = tabs.current[n];
    b?.focus();
    b?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  };
  const keys = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") pick(on + 1);
    else if (e.key === "ArrowLeft") pick(on - 1);
    else if (e.key === "Home") pick(0);
    else if (e.key === "End") pick(items.length - 1);
    else return;
    e.preventDefault();
  };
  return (
    <div className="ma-s27-ind">
      <div className="ma-s27-caps" role="tablist" aria-label="Choose an industry" onKeyDown={keys}>
        {items.map((x, i) => (
          <button
            key={i}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-t${i}`}
            aria-selected={on === i}
            aria-controls={`${id}-p${i}`}
            tabIndex={on === i ? 0 : -1}
            className={on === i ? "is-on" : undefined}
            onClick={() => pick(i)}
          >
            {x.name}
          </button>
        ))}
      </div>
      {items.map((x, i) => (
        <div key={i} role="tabpanel" id={`${id}-p${i}`} aria-labelledby={`${id}-t${i}`} hidden={on !== i} className="ma-s27-ans">
          <h3>{x.name}</h3>
          <p>{x.description}</p>
          <p className="ma-s27-count" aria-hidden="true">
            {i + 1} / {items.length}
          </p>
        </div>
      ))}
    </div>
  );
}
