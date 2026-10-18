"use client";

import { useEffect, useRef, useState } from "react";

// Admin > Pages: the live preview next to the editor. It shows the saved draft of the page as a laptop (1440 px wide, scaled down to fit) or as a
// phone (390 × 844, the mobile app), and reloads whenever the editor has saved a change (rev), keeping the place where it was scrolled.

const LAPTOP = { w: 1440, h: 900 };
const PHONE = { w: 390, h: 844 };

export function LivePreview({ slug, phone, rev, status }: { slug: string; phone: boolean; rev: number; status: string }) {
  const [device, setDevice] = useState<"laptop" | "phone">(phone ? "phone" : "laptop");
  const [box, setBox] = useState({ w: 0, h: 0 });
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const scrollY = useRef(0);
  const firstRev = useRef(rev);

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
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // a saved change: reload the preview where it was
  useEffect(() => {
    if (rev === firstRev.current) return;
    const w = frame.current?.contentWindow;
    if (!w) return;
    try {
      scrollY.current = w.scrollY;
      w.location.reload();
    } catch {
      // ignore
    }
  }, [rev]);

  const size = device === "phone" ? PHONE : LAPTOP;
  const scale = box.w && box.h ? Math.min(box.w / size.w, device === "phone" ? box.h / size.h : 1, 1) : 0;
  const height = device === "phone" ? size.h : scale ? box.h / scale : size.h;
  const src = device === "phone" ? `/m/preview/${slug}?embed=1` : `/preview/${slug}?embed=1`;

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 px-3 py-2">
        <div className="inline-flex rounded-lg border border-zinc-300 p-0.5" role="group" aria-label="Device">
          {(phone ? (["laptop", "phone"] as const) : (["laptop"] as const)).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={device === d}
              onClick={() => {
                scrollY.current = 0;
                setDevice(d);
              }}
              className={`rounded-md px-3 py-1 text-sm font-medium ${device === d ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"}`}
            >
              {d === "laptop" ? "Laptop" : "Phone"}
            </button>
          ))}
        </div>
        <span className="text-xs text-zinc-500" role="status">
          {status}
        </span>
        <a href={src.replace("?embed=1", "")} target="_blank" rel="noreferrer" className="ml-auto text-xs font-medium text-brand hover:underline">
          Open in a new tab ↗
        </a>
      </div>
      <div ref={wrap} className={`relative min-h-0 flex-1 overflow-hidden ${device === "phone" ? "bg-zinc-100" : "bg-zinc-900"}`}>
        {scale > 0 && (
          <div
            className={device === "phone" ? "absolute left-1/2 top-0 overflow-hidden rounded-[36px] border-[6px] border-zinc-900 shadow-xl" : "absolute left-0 top-0"}
            style={{
              width: size.w,
              height,
              transform: device === "phone" ? `translateX(-50%) scale(${scale})` : `scale(${scale})`,
              transformOrigin: device === "phone" ? "top center" : "top left",
            }}
          >
            <iframe
              key={device}
              ref={frame}
              src={src}
              title={`Live preview: ${device}`}
              className="h-full w-full border-0 bg-white"
              onLoad={() => {
                try {
                  frame.current?.contentWindow?.scrollTo(0, scrollY.current);
                } catch {
                  // ignore
                }
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
