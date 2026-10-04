"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { discardDraft, publish, restoreVersion, saveDraft } from "@/actions/pages";
import type { ActionResult } from "@/actions/types";
import { newSection, type PageSection } from "@/lib/cms/pages";
import { SECTIONS, SECTION_TYPES, type SectionType } from "@/lib/cms/sections";
import { FieldsEditor } from "./fields-editor";
import { btnDanger, btnIcon, btnPrimary, btnSecondary, card, inputClass, labelClass } from "./ui";

type Props = {
  slug: string;
  title: string;
  path: string;
  initial: { seoTitle: string; seoDescription: string; sections: PageSection[] };
  hasDraftChanges: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  versions: { id: string; createdAt: string }[];
  restored: boolean;
};

export function PageEditor({ slug, title, path, initial, hasDraftChanges, isPublished, publishedAt, versions, restored }: Props) {
  const router = useRouter();
  const [sections, setSections] = useState(initial.sections);
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle);
  const [seoDescription, setSeoDescription] = useState(initial.seoDescription);
  const [openId, setOpenId] = useState<string | null>(null);
  const [newType, setNewType] = useState<SectionType>("services");
  const [dirty, setDirty] = useState(false);
  const [unpublished, setUnpublished] = useState(hasDraftChanges);
  const [live, setLive] = useState(isPublished);
  const [result, setResult] = useState<ActionResult | null>(
    restored ? { ok: true, message: "Old version loaded into the draft. Review it, then publish when you are happy." } : null,
  );
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const edit = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setDirty(true);
    setResult(null);
  };
  const payload = { seoTitle, seoDescription, content: { sections } };

  const run = (action: () => Promise<ActionResult>, onOk: () => void) =>
    startTransition(async () => {
      const res = await action();
      setResult(res);
      if (res.ok) {
        onOk();
        router.refresh();
      }
    });

  const onSave = () =>
    run(() => saveDraft(slug, payload), () => {
      setDirty(false);
      setUnpublished(true);
    });

  const onPublish = () => {
    if (!window.confirm("Publish these changes to the live website?")) return;
    run(() => publish(slug, payload), () => {
      setDirty(false);
      setUnpublished(false);
      setLive(true);
    });
  };

  const onDiscard = () => {
    if (!window.confirm("Discard all unpublished changes? This cannot be undone.")) return;
    run(() => discardDraft(slug), () => window.location.reload());
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= sections.length) return;
    const next = [...sections];
    next.splice(to, 0, next.splice(from, 1)[0]);
    edit(setSections)(next);
  };

  const badge = !live
    ? { text: "Showing demo content, not published yet", cls: "bg-zinc-100 text-zinc-600" }
    : unpublished || dirty
      ? { text: "Unpublished changes", cls: "bg-amber-100 text-amber-800" }
      : { text: "Published", cls: "bg-emerald-100 text-emerald-800" };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-30 -mx-4 border-b border-zinc-200 bg-zinc-100/90 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">{title} page</h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <span className={`rounded-full px-2.5 py-0.5 font-medium ${badge.cls}`}>{badge.text}</span>
              {dirty && <span className="text-amber-700">You have unsaved edits</span>}
              {publishedAt && <span>Last published {publishedAt}</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={dirty ? undefined : `/preview/${slug}`} target="_blank" rel="noreferrer" aria-disabled={dirty} title={dirty ? "Save draft first" : undefined} className={`${btnSecondary} ${dirty ? "pointer-events-none opacity-50" : ""}`}>
              Preview draft ↗
            </a>
            <button type="button" className={btnSecondary} onClick={onSave} disabled={pending || !dirty}>
              Save draft
            </button>
            <button type="button" className={btnPrimary} onClick={onPublish} disabled={pending || (!dirty && !unpublished && live)}>
              {pending ? "Working…" : "Publish"}
            </button>
          </div>
        </div>
        {result && (
          <p role="status" className={`mt-3 rounded-lg px-3 py-2 text-sm ${result.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
            {result.ok ? result.message : result.error}
          </p>
        )}
      </div>

      <section className={card}>
        <h2 className="font-semibold text-zinc-900">Search engine (SEO)</h2>
        <p className="text-sm text-zinc-500">How this page appears on Google. Leave empty to use the default.</p>
        <div className="mt-4 space-y-4">
          <label className={labelClass}>
            Page title <span className="font-normal text-zinc-400">({seoTitle.length}/120)</span>
            <input className={inputClass} value={seoTitle} maxLength={120} onChange={(e) => edit(setSeoTitle)(e.target.value)} />
          </label>
          <label className={labelClass}>
            Description <span className="font-normal text-zinc-400">({seoDescription.length}/300)</span>
            <textarea className={`${inputClass} resize-y`} rows={3} value={seoDescription} maxLength={300} onChange={(e) => edit(setSeoDescription)(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-zinc-900">Sections ({sections.length})</h2>
        {sections.map((section, i) => {
          const def = SECTIONS[section.type];
          const open = openId === section.id;
          return (
            <div key={section.id} className={`${card} !p-0`}>
              <div className="flex items-center gap-2 p-3 sm:p-4">
                <button type="button" onClick={() => setOpenId(open ? null : section.id)} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-xs font-bold text-brand">{i + 1}</span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-zinc-900">{def.label}</span>
                    <span className="block truncate text-xs text-zinc-500">{def.description}</span>
                  </span>
                  <span className="ml-auto text-zinc-400" aria-hidden>
                    {open ? "▲" : "▼"}
                  </span>
                </button>
                <button type="button" className={btnIcon} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move section up">
                  ↑
                </button>
                <button type="button" className={btnIcon} onClick={() => move(i, i + 1)} disabled={i === sections.length - 1} aria-label="Move section down">
                  ↓
                </button>
                <button
                  type="button"
                  className={`${btnIcon} hover:!bg-rose-50 hover:!text-rose-600`}
                  aria-label={`Remove ${def.label} section`}
                  onClick={() => window.confirm(`Remove the ${def.label} section?`) && edit(setSections)(sections.filter((s) => s.id !== section.id))}
                >
                  ✕
                </button>
              </div>
              {open && (
                <div className="border-t border-zinc-200 p-4 sm:p-5">
                  <FieldsEditor
                    fields={def.fields}
                    value={section.data}
                    onChange={(data) => edit(setSections)(sections.map((s) => (s.id === section.id ? { ...s, data } : s)))}
                  />
                </div>
              )}
            </div>
          );
        })}

        <div className={`${card} flex flex-wrap items-end gap-3 border-dashed`}>
          <label className={`${labelClass} min-w-48 flex-1`}>
            Add a section
            <select className={inputClass} value={newType} onChange={(e) => setNewType(e.target.value as SectionType)}>
              {SECTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {SECTIONS[type].label}, {SECTIONS[type].description}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={btnSecondary}
            disabled={sections.length >= 40}
            onClick={() => {
              const created = newSection(newType);
              edit(setSections)([...sections, created]);
              setOpenId(created.id);
            }}
          >
            + Add section
          </button>
        </div>
      </section>

      <section className={card}>
        <h2 className="font-semibold text-zinc-900">Version history</h2>
        <p className="text-sm text-zinc-500">A copy is kept every time you publish (last 10). Restoring loads it into the draft, nothing goes live until you publish.</p>
        {versions.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">No published versions yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-zinc-100">
            {versions.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="text-zinc-700">{v.createdAt}</span>
                <form action={restoreVersion}>
                  <input type="hidden" name="versionId" value={v.id} />
                  <button className={btnSecondary} disabled={dirty} title={dirty ? "Save or publish your edits first" : undefined}>
                    Restore to draft
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
        {unpublished && live && (
          <button type="button" className={`${btnDanger} mt-4`} onClick={onDiscard} disabled={pending}>
            Discard unpublished changes
          </button>
        )}
      </section>

      <p className="pb-8 text-center text-xs text-zinc-400">
        Live page: <a className="underline" href={path} target="_blank" rel="noreferrer">{path}</a>
      </p>
    </div>
  );
}
