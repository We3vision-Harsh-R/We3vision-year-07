"use client";

import { useRef, useState } from "react";
import { uploadPicture } from "./upload";
import { btnIcon, btnSecondary } from "./ui";

/** Several pictures: upload them (one or many at once), put them in order, remove them. */
export function GalleryField({ label, hint, value, onChange }: { label: string; hint?: string; value: string[]; onChange: (v: string[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const add = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const res = await uploadPicture(file);
      if ("url" in res) urls.push(res.url);
      else setError(`${file.name}: ${res.error}`);
    }
    setBusy(false);
    if (urls.length) onChange([...value, ...urls].slice(0, 30));
    if (fileRef.current) fileRef.current.value = "";
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
  };

  return (
    <div>
      <p className="text-sm font-medium text-zinc-700">
        {label} <span className="font-normal text-zinc-400">({value.length}/30)</span>
      </p>
      {value.length > 0 && (
        <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((url, i) => (
            <li key={`${url}-${i}`} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
              <div className="flex justify-between gap-1 p-2">
                <button type="button" className={btnIcon} disabled={i === 0} onClick={() => move(i, i - 1)} aria-label="Move earlier">
                  ←
                </button>
                <button type="button" className={btnIcon} disabled={i === value.length - 1} onClick={() => move(i, i + 1)} aria-label="Move later">
                  →
                </button>
                <button type="button" className={`${btnIcon} hover:!bg-rose-50 hover:!text-rose-600`} onClick={() => onChange(value.filter((_, n) => n !== i))} aria-label="Remove picture">
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className={`${btnSecondary} mt-3`} disabled={busy || value.length >= 30} onClick={() => fileRef.current?.click()}>
        {busy ? "Uploading…" : "+ Add pictures"}
      </button>
      <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => void add(e.target.files)} />
      {hint && <span className="mt-1 block text-xs text-zinc-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </div>
  );
}
