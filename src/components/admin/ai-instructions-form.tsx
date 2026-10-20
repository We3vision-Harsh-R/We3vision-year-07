"use client";

import { useState, useTransition } from "react";
import { saveAiInstructions } from "@/actions/ai-instructions";
import type { ActionResult } from "@/actions/types";
import { btnPrimary, btnSecondary, card, inputClass, labelClass } from "./ui";

export type TypeBlock = {
  key: string;
  label: string;
  description: string;
  defaultAskFirst: string[];
  askFirst: string[];
  extra: string;
  builtIn: string[];
  /** what the AI receives for this type (get_content_guidelines), as saved now */
  preview: string;
};

type Limits = { general: number; extra: number; askFirstItems: number; askFirstEach: number };

export function AiInstructionsForm({ general: initialGeneral, blocks, limits }: { general: string; blocks: TypeBlock[]; limits: Limits }) {
  const [general, setGeneral] = useState(initialGeneral);
  const [types, setTypes] = useState(() => Object.fromEntries(blocks.map((b) => [b.key, { extra: b.extra, askFirst: b.askFirst.join("\n") }])));
  const [result, setResult] = useState<ActionResult | null>(null);
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();

  const setType = (key: string, patch: Partial<{ extra: string; askFirst: string }>) => {
    setTypes((t) => ({ ...t, [key]: { ...t[key], ...patch } }));
    setDirty(true);
    setResult(null);
  };

  const save = () =>
    start(async () => {
      const res = await saveAiInstructions({ general, types });
      setResult(res);
      if (res.ok) setDirty(false);
    });

  return (
    <div className="space-y-6">
      <section className={`${card} space-y-3`}>
        <div>
          <h2 className="text-lg font-semibold">About We3vision and rules for everything the AI writes</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Facts the AI may use about the company, who your readers and candidates are, the voice, and what it must never say. Written once; every AI tool reads it when it connects and again before it writes.
          </p>
        </div>
        <label className={labelClass}>
          General instructions
          <textarea
            className={`${inputClass} min-h-40`}
            value={general}
            maxLength={limits.general}
            onChange={(e) => {
              setGeneral(e.target.value);
              setDirty(true);
              setResult(null);
            }}
            placeholder={"Example:\nWe3vision is a web, app, AI, metaverse, UI/UX, SEO, CRM, animation and brand-design studio in Surat, India.\nOur readers are business owners. Write simply, in short sentences.\nNever promise rankings or prices. Never name a client unless the user gave the name."}
          />
          <span className="mt-1 block text-xs font-normal text-zinc-400">
            {general.length} / {limits.general} characters. Only write facts that are true: the AI will repeat them.
          </span>
        </label>
      </section>

      {blocks.map((b) => {
        const t = types[b.key];
        return (
          <section key={b.key} className={`${card} space-y-4`}>
            <div>
              <h2 className="text-lg font-semibold">{b.label}</h2>
              <p className="mt-1 text-sm text-zinc-500">{b.description}</p>
            </div>

            <label className={labelClass}>
              Information the AI must collect from the user before it writes (one point per line)
              <textarea className={`${inputClass} min-h-44`} value={t.askFirst} onChange={(e) => setType(b.key, { askFirst: e.target.value })} />
              <span className="mt-1 block text-xs font-normal text-zinc-400">
                The AI asks the user for whatever of this it does not know yet, then writes. At most {limits.askFirstItems} points, {limits.askFirstEach} characters each. Empty list = it does not ask.
              </span>
            </label>
            <button type="button" className={`${btnSecondary} !px-3 !py-1.5`} onClick={() => setType(b.key, { askFirst: b.defaultAskFirst.join("\n") })}>
              Put back the standard list
            </button>

            <label className={labelClass}>
              Your extra instructions for this type
              <textarea
                className={`${inputClass} min-h-36`}
                value={t.extra}
                maxLength={limits.extra}
                onChange={(e) => setType(b.key, { extra: e.target.value })}
                placeholder={b.key === "blog" ? "Example:\nEnd every article with a short call to action to talk to our team.\nUse Indian examples. Keep paragraphs under 4 lines.\nAlways include at least one practical checklist." : "Example:\nAlways mention that interviews are held in Surat.\nWrite requirements as skills, not as years only."}
              />
              <span className="mt-1 block text-xs font-normal text-zinc-400">
                {t.extra.length} / {limits.extra} characters. These win over the built-in rules when they differ.
              </span>
            </label>

            <details className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
              <summary className="cursor-pointer font-medium text-zinc-700">Built-in rules (always sent, change them in the code)</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {b.builtIn.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </details>
            <details className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
              <summary className="cursor-pointer font-medium text-zinc-700">What the AI receives now (last saved version)</summary>
              <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap break-words text-xs text-zinc-700">{b.preview}</pre>
            </details>
          </section>
        );
      })}

      <div className={`${card} flex flex-wrap items-center gap-3`}>
        <button type="button" className={btnPrimary} disabled={pending || !dirty} onClick={save}>
          {pending ? "Saving…" : "Save instructions"}
        </button>
        {result && (
          <p role="status" className={`rounded-lg px-3 py-2 text-sm ${result.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
            {result.ok ? result.message : result.error}
          </p>
        )}
      </div>
    </div>
  );
}
