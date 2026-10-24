"use client";

import "@/styles/portfolio-board.css";
import { useMemo, useState } from "react";
import { Img } from "../img";
import { SmartLink } from "../smart-link";

// The portfolio board: filter chips by category (with the number of projects), a search box, and the projects as a bento grid. The first project is the
// big one (2 x 2); every card is a picture with a glass panel (category, name, text) and an arrow; the light follows the mouse on a card. Filtering
// replays a short staggered entrance. The look is in styles/portfolio-board.css ("pfb-").

export type BoardProject = { id: string; slug: string; title: string; category: string; summary: string; cover: string };

const OTHER = "Other";
/** how many category chips show before "More" (the rest are folded away so the bar stays calm) */
const CHIPS = 6;
const catOf = (p: BoardProject) => p.category.trim() || OTHER;

/** the letters on a card without a picture: the first letters of the first two words */
const initials = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

export function ProjectsBoard({ projects }: { projects: BoardProject[] }) {
  const [cat, setCat] = useState<string>("");
  const [q, setQ] = useState("");
  const [more, setMore] = useState(false);

  // the categories, the biggest first (the same name in other letters counts as one)
  const cats = useMemo(() => {
    const map = new Map<string, { name: string; n: number }>();
    for (const p of projects) {
      const name = catOf(p);
      const k = name.toLowerCase();
      const cur = map.get(k);
      if (cur) cur.n++;
      else map.set(k, { name, n: 1 });
    }
    return [...map.values()].sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  }, [projects]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return projects.filter((p) => {
      if (cat && catOf(p).toLowerCase() !== cat.toLowerCase()) return false;
      return !term || `${p.title} ${p.category} ${p.summary}`.toLowerCase().includes(term);
    });
  }, [projects, cat, q]);

  // the chips that show: the biggest few, and always the chosen one
  const chips = more ? cats : cats.filter((c, i) => i < CHIPS || c.name.toLowerCase() === cat.toLowerCase());
  const hidden = cats.length - chips.length;
  const filtered = cat !== "" || q.trim() !== "";
  const clear = () => {
    setCat("");
    setQ("");
  };

  return (
    <div className="pfb">
      <div className="pfb-bar">
        <div className="pfb-chips" role="group" aria-label="Filter projects by category">
          <button type="button" className="pfb-chip" aria-pressed={cat === ""} onClick={() => setCat("")}>
            All <b>{projects.length}</b>
          </button>
          {chips.map((c) => {
            const on = cat.toLowerCase() === c.name.toLowerCase();
            return (
              <button key={c.name} type="button" className="pfb-chip" aria-pressed={on} onClick={() => setCat(on ? "" : c.name)}>
                {c.name} <b>{c.n}</b>
              </button>
            );
          })}
          {cats.length > CHIPS && (
            <button type="button" className="pfb-chip pfb-more" aria-expanded={more} onClick={() => setMore(!more)}>
              {more ? "Fewer" : `More +${hidden}`}
            </button>
          )}
        </div>
        <label className="pfb-search">
          <svg viewBox="0 0 24 24" aria-hidden width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or word" aria-label="Search projects" />
        </label>
      </div>

      <p className="pfb-count" aria-live="polite">
        {filtered ? (
          <>
            <span>
              Showing <b>{shown.length}</b> of {projects.length} projects
            </span>
            <button type="button" onClick={clear}>
              Clear filters
            </button>
          </>
        ) : (
          <span>
            <b>{projects.length}</b> projects in <b>{cats.length}</b> {cats.length === 1 ? "category" : "categories"}
          </span>
        )}
      </p>

      {shown.length === 0 ? (
        <div className="pfb-empty">
          <p>No project matches this.</p>
          <button type="button" onClick={clear}>
            Show all projects
          </button>
        </div>
      ) : (
        <div className="pfb-grid" key={`${cat}|${q}`}>
          {shown.map((p, i) => (
            <SmartLink
              key={p.id}
              href={`/portfolio/${p.slug}`}
              className="pfb-card"
              data-big={i === 0 && shown.length >= 3 ? "true" : undefined}
              style={{ "--i": Math.min(i, 12) } as React.CSSProperties}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              {p.cover ? (
                <Img src={p.cover} alt={p.title} className="pfb-img" />
              ) : (
                <span className="pfb-ph" aria-hidden>
                  {initials(p.title)}
                </span>
              )}
              <span className="pfb-shade" aria-hidden />
              <span className="pfb-light" aria-hidden />
              <span className="pfb-no" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pfb-go" aria-hidden>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </span>
              <span className="pfb-info">
                <span className="pfb-cat">{catOf(p)}</span>
                <span className="pfb-title">{p.title}</span>
                {p.summary && <span className="pfb-sum">{p.summary}</span>}
              </span>
            </SmartLink>
          ))}
        </div>
      )}
    </div>
  );
}
