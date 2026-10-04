"use client";

import { useState } from "react";
import { IndustryIcon } from "./icons";

type Item = { name: string; description: string };

/** Pills for each industry; choosing one shows its description underneath. */
export function IndustriesTabs({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  if (items.length === 0) return null;
  const current = items[Math.min(active, items.length - 1)];

  return (
    <div>
      <div role="tablist" aria-label="Industries" className="flex flex-wrap justify-center gap-3">
        {items.map((item, i) => {
          const selected = item === current;
          return (
            <button
              key={item.name + i}
              type="button"
              role="tab"
              id={`industry-tab-${i}`}
              aria-selected={selected}
              aria-controls="industry-panel"
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition duration-300 ${
                selected
                  ? "border-violet/60 bg-violet/15 text-violet shadow-[0_0_24px_rgba(211,135,255,0.2)]"
                  : "border-violet/15 bg-violet/[0.03] text-orchid hover:border-violet/35 hover:text-violet"
              }`}
            >
              <IndustryIcon name={item.name} className="size-4" />
              {item.name}
            </button>
          );
        })}
      </div>

      <div
        key={current.name}
        id="industry-panel"
        role="tabpanel"
        aria-labelledby={`industry-tab-${items.indexOf(current)}`}
        className="card-glass animate-fade-in mx-auto mt-8 max-w-[760px] rounded-[19px] p-8 text-center sm:p-10"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-xl border border-violet/20 bg-[linear-gradient(180deg,#2a1140,#1b0b2a)] text-violet">
          <IndustryIcon name={current.name} className="size-6" />
        </span>
        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-violet">{current.name}</h3>
        <p className="mt-4 leading-relaxed text-orchid">{current.description}</p>
      </div>
    </div>
  );
}
