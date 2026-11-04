"use client";

import { useMemo, useState } from "react";
import { techDetail } from "@/lib/cms/content/tech-details";

/**
 * The technology stack of the home page, kept quiet: one hairline row per group (front end, back end, ...), the technologies as plain words.
 * Hover (or focus) a word and one line under the list says what it is for. No pop-up, no orbit, nothing moves on its own.
 */
export function HomeStack({ items }: { items: string[] }) {
  const groups = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const name of items) {
      const cat = techDetail(name)?.cat ?? "More tools";
      m.set(cat, [...(m.get(cat) ?? []), name]);
    }
    return [...m.entries()];
  }, [items]);
  const [sel, setSel] = useState("");
  const d = sel ? techDetail(sel) : undefined;

  return (
    <div className="hs-wrap" onPointerLeave={() => setSel("")}>
      <ul className="hs-list">
        {groups.map(([cat, names]) => (
          <li key={cat} className="hs-row">
            <span className="hs-cat">{cat}</span>
            <span className="hs-names">
              {names.map((name) => (
                <button key={name} type="button" className="hs-name" data-on={sel === name} onPointerEnter={() => setSel(name)} onFocus={() => setSel(name)} onBlur={() => setSel("")}>
                  {name}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <p className="hs-note" aria-live="polite" data-on={!!d}>
        {d ? (
          <>
            <b>{sel}</b>
            <span>{d.tagline}</span>
          </>
        ) : (
          <span>Hover a technology to see what we use it for.</span>
        )}
      </p>
    </div>
  );
}
