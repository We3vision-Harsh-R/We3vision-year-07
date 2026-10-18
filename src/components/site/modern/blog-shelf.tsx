"use client";
/* eslint-disable @next/next/no-img-element -- article pictures are links from the admin panel (Blog) */

import "@/styles/blog-sections.css";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import type { MasonryItem } from "./blog-masonry";

const BlogMasonry = dynamic(() => import("./blog-masonry").then((m) => m.BlogMasonry));

// The articles of the blog page on a laptop, in the look chosen in Admin > Pages > Blog ("Blog cards" section):
//   masonry: the wall of cover pictures (blog-masonry.tsx)    grid: cards with the words under the picture    list: headline rows
// Topic buttons above (the topics of the articles themselves) filter the list; every word on the screen comes from the section.

export type ShelfLabels = { all: string; more: string; read: string; empty: string };
const STEP = 9;

export function BlogShelf({ items, layout, topics, labels }: { items: MasonryItem[]; layout: string; topics: boolean; labels: ShelfLabels }) {
  const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
  const [cat, setCat] = useState("");
  const [shown, setShown] = useState(STEP);
  const list = cat ? items.filter((i) => i.category === cat) : items;
  const pick = (c: string) => {
    setCat(c);
    setShown(STEP);
  };
  const meta = (i: MasonryItem) => [i.dateLabel, i.minutes ? `${i.minutes} ${labels.read}`.trim() : ""].filter(Boolean).join(" · ");

  if (!items.length) return <p className="bx-empty">{labels.empty}</p>;
  return (
    <div className="bx-shelf">
      {topics && cats.length > 1 && (
        <div className="bx-topics" role="group" aria-label="Topics">
          {["", ...cats].map((c) => (
            <button key={c || "all"} type="button" aria-pressed={cat === c} className={cat === c ? "is-on" : ""} onClick={() => pick(c)}>
              {c || labels.all}
            </button>
          ))}
        </div>
      )}
      {layout === "grid" || layout === "list" ? (
        <>
          <ul key={cat} className={layout === "grid" ? "bx-grid" : "bx-list"}>
            {list.slice(0, shown).map((i, n) => (
              <li key={i.id} style={{ "--i": n % STEP } as React.CSSProperties}>
                <Link href={i.href} className="bx-card">
                  <span className="bx-pic">{i.image ? <img src={i.image} alt="" loading="lazy" decoding="async" /> : <span className="bx-pic-ph" aria-hidden="true" />}</span>
                  <span className="bx-body">
                    {i.category && <span className="bx-cat">{i.category}</span>}
                    <span className="bx-title">{i.title}</span>
                    {i.summary && <span className="bx-sum">{i.summary}</span>}
                    {meta(i) && <span className="bx-meta">{meta(i)}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {list.length > shown && (
            <div className="bx-more">
              <button type="button" onClick={() => setShown((s) => s + STEP)}>
                {labels.more}
              </button>
            </div>
          )}
        </>
      ) : (
        <BlogMasonry key={cat} items={list} readLabel={labels.read} />
      )}
    </div>
  );
}
