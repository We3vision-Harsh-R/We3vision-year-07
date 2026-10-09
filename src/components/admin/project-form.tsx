"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createProject, deleteProject, updateProject } from "@/actions/projects";
import { PROJECT_GROUPS } from "@/lib/project-groups";
import { GalleryField } from "./gallery-field";
import { ImageField } from "./image-field";
import { btnDanger, btnPrimary, btnSecondary, card, inputClass, labelClass } from "./ui";

export type ProjectData = {
  title: string;
  category: string;
  summary: string;
  content: string;
  cover: string;
  images: string[];
  group: string;
  published: boolean;
};

export const EMPTY_PROJECT: ProjectData = { title: "", category: "", summary: "", content: "", cover: "", images: [], group: "brand", published: true };

/** The editor of one project: name, small label, short text, long text, pictures, where it is shown. Saving updates the website at once. */
export function ProjectForm({ id, initial, slug }: { id?: string; initial: ProjectData; slug?: string }) {
  const router = useRouter();
  const [v, setV] = useState<ProjectData>(initial);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const set = <K extends keyof ProjectData>(k: K, val: ProjectData[K]) => {
    setV((o) => ({ ...o, [k]: val }));
    setDirty(true);
    setMsg(null);
  };

  const save = () =>
    start(async () => {
      if (id) {
        const res = await updateProject(id, v);
        setMsg(res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error });
        if (res.ok) {
          setDirty(false);
          router.refresh();
        }
      } else {
        const res = await createProject(v);
        if (res.ok && res.id) router.push(`/admin/projects/${res.id}?added=1`);
        else setMsg({ ok: false, text: res.ok ? "Could not save." : res.error });
      }
    });

  const remove = () => {
    if (!id || !window.confirm("Delete this project for good? It disappears from the website.")) return;
    start(async () => {
      const res = await deleteProject(id);
      if (res.ok) router.push("/admin/projects");
      else setMsg({ ok: false, text: res.error });
    });
  };

  return (
    <div className="space-y-6">
      <div className={`${card} space-y-5`}>
        <label className={labelClass}>
          Name of the project
          <input type="text" value={v.title} maxLength={120} onChange={(e) => set("title", e.target.value)} className={inputClass} placeholder="e.g. Nirmal Jewellers brand identity" />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            What we did (small label)
            <input type="text" value={v.category} maxLength={60} onChange={(e) => set("category", e.target.value)} className={inputClass} placeholder="e.g. Brand identity" />
          </label>
          <label className={labelClass}>
            Where it is shown
            <select value={v.group} onChange={(e) => set("group", e.target.value)} className={inputClass}>
              {PROJECT_GROUPS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className={labelClass}>
          Short description
          <textarea rows={2} value={v.summary} maxLength={200} onChange={(e) => set("summary", e.target.value)} className={`${inputClass} resize-y`} />
          <span className="mt-1 block text-xs font-normal text-zinc-400">1–2 sentences. Shown on the card and on the sliding photo. {v.summary.length}/200</span>
        </label>
        <label className={labelClass}>
          Full description (for the project page)
          <textarea rows={8} value={v.content} maxLength={8000} onChange={(e) => set("content", e.target.value)} className={`${inputClass} resize-y`} />
          <span className="mt-1 block text-xs font-normal text-zinc-400">The goal of the client, what you did, the result. Leave an empty line between paragraphs.</span>
        </label>
      </div>

      <div className={`${card} space-y-6`}>
        <ImageField label="Main picture (the cover)" hint="Shown on the sliding photos and on the cards. If you leave it empty, the first picture below is used." value={v.cover} onChange={(x) => set("cover", x)} />
        <GalleryField label="More pictures of the project" hint="Shown on the project page, in this order." value={v.images} onChange={(x) => set("images", x)} />
      </div>

      <div className={`${card} flex flex-wrap items-center justify-between gap-4`}>
        <label className="flex items-center gap-2.5 text-sm font-medium text-zinc-700">
          <input type="checkbox" checked={v.published} onChange={(e) => set("published", e.target.checked)} className="size-4 accent-[var(--color-brand)]" />
          Show this project on the website
        </label>
        <div className="flex flex-wrap items-center gap-3">
          {msg && (
            <p role="status" className={`rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
              {msg.text}
            </p>
          )}
          {slug && (
            <a href={`/portfolio/${slug}`} target="_blank" rel="noreferrer" className={btnSecondary}>
              View live ↗
            </a>
          )}
          {id && (
            <button type="button" className={btnDanger} onClick={remove} disabled={pending}>
              Delete
            </button>
          )}
          <Link href="/admin/projects" className={btnSecondary}>
            Back
          </Link>
          <button type="button" className={btnPrimary} onClick={save} disabled={pending || (id ? !dirty : false)}>
            {pending ? "Saving…" : id ? "Save changes" : "Add project"}
          </button>
        </div>
      </div>
    </div>
  );
}
