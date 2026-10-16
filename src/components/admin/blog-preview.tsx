"use client";

import "@/styles/admin.css";


import { useState } from "react";
import { BlogMasonry, type MasonryItem } from "@/components/site/modern/blog-masonry";

// The preview of the Blog page in the admin panel: the same masonry as the website, with the number of columns of a laptop, a desktop and a large
// screen (the bigger the screen, the more columns). The article that is being edited can be marked.
const VIEWS = [
  { cols: 3, label: "Small laptop", note: "3 columns" },
  { cols: 4, label: "Laptop", note: "4 columns" },
  { cols: 5, label: "Desktop", note: "5 columns" },
  { cols: 6, label: "Large screen", note: "6 columns" },
] as const;

export function BlogPreview({ items, highlightId, defaultCols = 4 }: { items: MasonryItem[]; highlightId?: string; defaultCols?: number }) {
  const [cols, setCols] = useState<number>(defaultCols);
  return (
    <div className="adb-preview">
      <div className="adb-views" role="tablist" aria-label="Screen size">
        {VIEWS.map((v) => (
          <button key={v.cols} type="button" role="tab" aria-selected={cols === v.cols} data-on={cols === v.cols} onClick={() => setCols(v.cols)}>
            {v.label}
            <span>{v.note}</span>
          </button>
        ))}
      </div>
      <div className="adb-frame">
        {items.length === 0 ? <p className="adb-empty">No articles yet.</p> : <BlogMasonry items={items} columns={cols} highlightId={highlightId} interactive={false} />}
      </div>
    </div>
  );
}
