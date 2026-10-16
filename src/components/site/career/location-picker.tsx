"use client";

import "@/styles/careers.css";


import { useEffect, useRef, useState } from "react";
import { cityLabel } from "@/lib/careers-shared";

// "Your location": the visitor types the first letters of their city and a list of cities of the whole world answers (66,000 places of
// GeoNames, CC BY 4.0, loaded when the field is first used). At most three lines of cities are shown. Every letter that is typed makes the cities
// that do not match go away as purple dust, until one is left; a click on a city puts it into the field. The look is in globals.css (.cj-*).

const START = ["Surat|IN", "Mumbai|IN", "Ahmedabad|IN", "Delhi|IN", "Bengaluru|IN", "Pune|IN", "London|GB", "New York City|US", "Dubai|AE", "Singapore|SG", "Toronto|CA", "Berlin|DE"];
const MAX = 12; // three lines of four
const DUST_MS = 800;

type Chip = { key: string; line: string; state: "in" | "out"; since: number };

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]+/g, "").trim();

type Chips = Chip[];

/** the cities that match what is typed (the biggest first; a city starts with the letters) */
function matches(query: string, cities: string[] | null): string[] {
  const q = norm(query);
  if (!q) return START.slice(0, MAX);
  const pool = cities ?? START;
  const out: string[] = [];
  for (const l of pool) {
    if (norm(l.split("|")[0]).startsWith(q)) {
      out.push(l);
      if (out.length >= MAX) break;
    }
  }
  return out;
}

/** the chips: the ones that stay stay, the ones that do not match turn into dust, new matches come in */
function merge(prev: Chips, wanted: string[]): Chips {
  const want = new Set(wanted);
  const now = Date.now();
  const next: Chips = [];
  const have = new Set<string>();
  for (const c of prev) {
    if (c.state === "out") {
      if (now - c.since < DUST_MS) next.push(c);
      continue;
    }
    if (want.has(c.line)) {
      next.push(c);
      have.add(c.line);
    } else next.push({ ...c, state: "out", since: now });
  }
  for (const l of wanted) if (!have.has(l)) next.push({ key: l + ":" + Math.random().toString(36).slice(2, 6), line: l, state: "in", since: 0 });
  return next;
}

export function LocationPicker({ value, onSelect, onClear, locked }: { value: string; onSelect: (label: string) => void; onClear: () => void; locked?: boolean }) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<string[] | null>(null);
  const [chips, setChips] = useState<Chips>(() => START.map((l) => ({ key: l, line: l, state: "in" as const, since: 0 })));
  const loading = useRef(false);
  const queryRef = useRef("");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((x) => window.clearTimeout(x));
  }, []);

  // the dust is gone after a moment: the chips that went away are removed from the list (so that the list closes up)
  const sweep = () => {
    timers.current.push(window.setTimeout(() => setChips((p) => p.filter((c) => c.state === "in" || Date.now() - c.since < DUST_MS)), DUST_MS + 60));
  };

  const load = () => {
    if (cities || loading.current) return;
    loading.current = true;
    fetch("/data/cities.json")
      .then((r) => r.json())
      .then((list: string[]) => {
        setCities(list);
        // what was typed while the list was loading
        if (queryRef.current) {
          setChips((p) => merge(p, matches(queryRef.current, list)));
          sweep();
        }
      })
      .catch(() => {
        loading.current = false;
      });
  };

  const type = (q: string) => {
    load();
    setQuery(q);
    queryRef.current = q;
    setChips((p) => merge(p, matches(q, cities)));
    sweep();
  };

  const visible = chips.filter((c) => c.state === "in");

  if (value) {
    return (
      <div className="cj-picked" data-locked={Boolean(locked)}>
        <span className="cj-pin" aria-hidden />
        <b>{value}</b>
        {!locked && (
          <button type="button" onClick={onClear} aria-label="Change the location">
            Change
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="cj-loc">
      <input
        className="cj-in"
        value={query}
        placeholder="Type the name of your city"
        autoComplete="off"
        spellCheck={false}
        aria-label="Your location"
        onFocus={load}
        onChange={(e) => type(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && visible[0]) onSelect(cityLabel(visible[0].line));
        }}
      />
      <ul className="cj-cities" aria-label="Cities">
        {chips.map((c) => (
          <li key={c.key} data-state={c.state}>
            <button type="button" tabIndex={c.state === "in" ? 0 : -1} disabled={c.state === "out"} onClick={() => onSelect(cityLabel(c.line))}>
              {cityLabel(c.line)}
            </button>
            {c.state === "out" && (
              <span className="cj-dust" aria-hidden>
                {Array.from({ length: 14 }, (_, i) => {
                  const ang = (i / 14) * Math.PI * 2 + (c.line.length % 5);
                  const r = 30 + ((i * 37) % 46);
                  return <i key={i} style={{ "--dx": `${(Math.cos(ang) * r).toFixed(0)}px`, "--dy": `${(Math.sin(ang) * r - 26).toFixed(0)}px`, "--d": `${(i % 5) * 40}ms`, "--s": `${3 + (i % 3)}px` } as React.CSSProperties} />;
                })}
              </span>
            )}
          </li>
        ))}
      </ul>
      {query && visible.length === 0 && cities && <p className="cj-none">No city starts with “{query}”. Check the spelling.</p>}
      {query && visible.length === 0 && !cities && <p className="cj-none">Loading the cities of the world…</p>}
    </div>
  );
}
