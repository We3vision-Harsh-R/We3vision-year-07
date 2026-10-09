"use client";

import { useId, useRef, useState } from "react";
import { uploadPicture } from "./upload";
import { btnSecondary, inputClass, labelClass } from "./ui";

/** A picture field: a small preview, an upload button (a photo from the computer or the phone) and, below it, the address of the picture. */
export function ImageField({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError("");
    const res = await uploadPicture(file);
    setBusy(false);
    if ("url" in res) onChange(res.url);
    else setError(res.error);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="mt-1.5 flex items-start gap-3">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 text-xs text-zinc-400">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            "no picture"
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnSecondary} disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? "Uploading…" : value ? "Change picture" : "Upload picture"}
            </button>
            {value && (
              <button type="button" className={btnSecondary} disabled={busy} onClick={() => onChange("")}>
                Remove
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => void pick(e.target.files?.[0])} />
          </div>
          <input id={id} type="text" value={value} maxLength={500} onChange={(e) => onChange(e.target.value)} placeholder="…or the address of a picture (/images/… or https://…)" className={`${inputClass} !mt-2`} />
          {hint && <span className="mt-1 block text-xs text-zinc-400">{hint}</span>}
          {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
        </div>
      </div>
    </div>
  );
}
