"use client";

import { useState, useTransition } from "react";
import { setEditorLock } from "@/actions/content-lock";

// "Lock editor" / "Unlock editor": works like the Publish button. Locked = the content is final: nothing can be published and the website stops
// asking for changes every 15 seconds. The number is the content version (it goes up with every publish).
export function LockButton({ locked, version }: { locked: boolean; version: number }) {
  const [now, setNow] = useState(locked);
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  const press = () =>
    start(async () => {
      const res = await setEditorLock(!now);
      if (res.ok) setNow(!now);
      setMsg(res.ok ? res.message : res.error);
    });
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-zinc-500 xl:inline" title="Content version">
        Content v{version} · {now ? "Locked" : "Editing"}
      </span>
      <button
        type="button"
        onClick={press}
        disabled={pending}
        title={msg || (now ? "Open the editor again" : "Make the content final")}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${now ? "border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100" : "bg-brand text-white hover:bg-brand/90"}`}
      >
        {pending ? "..." : now ? "Unlock editor" : "Lock editor"}
      </button>
    </div>
  );
}
