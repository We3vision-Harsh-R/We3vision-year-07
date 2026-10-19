"use client";

import { useEffect, useRef, useState } from "react";

// The preview of an AI submission: the real page of the website (a laptop, 1440 px wide, scaled down to fit) in a frame. The page is
// /preview/submission, which shows the draft with the same components as the live page.

const W = 1440;

export function SubmissionFrame({ id }: { id: string }) {
  const [box, setBox] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const src = `/preview/submission?id=${encodeURIComponent(id)}`;

  // the preview must not ask for a colour theme (the welcome window of the website): same tab, same session storage
  useEffect(() => {
    try {
      sessionStorage.setItem("we3.theme.seen", "1");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = box ? Math.min(box / W, 1) : 0;
  const height = 760;
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-4 py-2.5">
        <p className="text-sm font-semibold">Preview, as it will look on the website</p>
        <a href={`${src}&full=1`} target="_blank" rel="noreferrer" className="text-xs font-medium text-brand hover:underline">
          Open in a new tab ↗
        </a>
      </div>
      <div ref={wrap} className="relative overflow-hidden bg-zinc-900" style={{ height: scale ? height * scale : height }}>
        {scale > 0 && (
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height, transform: `scale(${scale})` }}>
            <iframe src={`${src}&embed=1`} title="Preview of the submission" className="h-full w-full border-0 bg-white" />
          </div>
        )}
      </div>
    </section>
  );
}
