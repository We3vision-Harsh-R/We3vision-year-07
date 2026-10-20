"use client";

import "@/styles/admin.css";


import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { createBlogPost, deleteBlogPost, updateBlogPost } from "@/actions/blog";
import type { MasonryItem } from "@/components/site/modern/blog-masonry";
import { TILES, type TileValue } from "@/lib/blog-shared";
import { BlogPreview } from "./blog-preview";
import { ImageField } from "./image-field";
import { btnDanger, btnPrimary, btnSecondary, card, inputClass, labelClass } from "./ui";

export type BlogData = {
  title: string;
  category: string;
  summary: string;
  cover: string;
  tile: TileValue;
  content: string;
  tags: string;
  faq: string;
  date: string;
  position: number;
  published: boolean;
};

export const EMPTY_BLOG = (position: number): BlogData => ({
  title: "",
  category: "",
  summary: "",
  cover: "",
  tile: "portrait",
  content: "",
  tags: "",
  faq: "",
  date: new Date().toISOString().slice(0, 10),
  position,
  published: true,
});

/** The other articles of the blog, in the order of the Blog page (for the preview: the one that is edited is put among them). */
export type OtherPost = MasonryItem & { published: boolean };

const CONTENT_PLACEHOLDER = "First paragraph…\n\n## A heading\n\nA paragraph.\n\n- a point\n- another point";

/** The editor of one article: the words, the picture, the shape and the place of the picture on the Blog page, with a preview of that page. */
export type FormSave = (values: BlogData) => Promise<{ ok: boolean; message: string }>;

/**
 * Optional `onSave`: the AI Submissions screen uses the same form, but "Save" then keeps the changes in the submission instead of adding the article
 * to the list (`backHref` says where Back goes). Without it the form works exactly as before.
 */
export function BlogForm({ id, slug, initial, others, onSave, backHref }: { id?: string; slug?: string; initial: BlogData; others: OtherPost[]; onSave?: FormSave; backHref?: string }) {
  const router = useRouter();
  const [v, setV] = useState<BlogData>(initial);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const set = <K extends keyof BlogData>(k: K, val: BlogData[K]) => {
    setV((o) => ({ ...o, [k]: val }));
    setDirty(true);
    setMsg(null);
  };

  const tile = TILES.find((t) => t.value === v.tile) ?? TILES[2];

  // the Blog page as it will be: this article at the chosen place among the others (the hidden ones are not on the page)
  const previewItems = useMemo(() => {
    const list = others.filter((o) => o.published);
    const me: MasonryItem = {
      id: id ?? "__new",
      title: v.title || "Title of the article",
      category: v.category,
      image: v.cover,
      tile: v.tile,
      href: "#",
    };
    const at = Math.min(Math.max(Math.round(v.position) - 1, 0), list.length);
    const out: MasonryItem[] = list.slice();
    if (v.published) out.splice(at, 0, me);
    return out;
  }, [others, id, v.title, v.category, v.cover, v.tile, v.position, v.published]);

  const save = () =>
    start(async () => {
      if (onSave) {
        const res = await onSave(v);
        setMsg({ ok: res.ok, text: res.message });
        if (res.ok) setDirty(false);
      } else if (id) {
        const res = await updateBlogPost(id, v);
        setMsg(res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error });
        if (res.ok) {
          setDirty(false);
          router.refresh();
        }
      } else {
        const res = await createBlogPost(v);
        if (res.ok && res.id) router.push(`/admin/blog/${res.id}?added=1`);
        else setMsg({ ok: false, text: res.ok ? "Could not save." : res.error });
      }
    });

  const remove = () => {
    if (!id || !window.confirm("Delete this article for good? It disappears from the website.")) return;
    start(async () => {
      const res = await deleteBlogPost(id);
      if (res.ok) router.push("/admin/blog");
      else setMsg({ ok: false, text: res.error });
    });
  };

  return (
    <div className="space-y-6">
      <div className={`${card} space-y-5`}>
        <label className={labelClass}>
          Title of the article
          <input type="text" value={v.title} maxLength={140} onChange={(e) => set("title", e.target.value)} className={inputClass} placeholder="e.g. How AI can automate business processes" />
        </label>
        <div className="grid gap-5 sm:grid-cols-3">
          <label className={labelClass}>
            Topic (small label)
            <input type="text" value={v.category} maxLength={40} onChange={(e) => set("category", e.target.value)} className={inputClass} placeholder="e.g. Design" />
          </label>
          <label className={labelClass}>
            Date shown on the article
            <input type="date" value={v.date} onChange={(e) => set("date", e.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>
            Short description
            <input type="text" value={v.summary} maxLength={300} onChange={(e) => set("summary", e.target.value)} className={inputClass} placeholder="1–2 sentences (also used by Google)" />
          </label>
        </div>
      </div>

      <div className={`${card} space-y-6`}>
        <div>
          <p className={labelClass}>Shape of the picture on the Blog page</p>
          <p className="mt-1 text-xs text-zinc-500">The Blog page is a wall of pictures of different shapes. Choose the shape this article should have, then upload a picture of that size (it is cropped to fill the shape).</p>
          <div className="adb-tiles" role="radiogroup" aria-label="Shape of the picture">
            {TILES.map((t) => (
              <button key={t.value} type="button" role="radio" aria-checked={v.tile === t.value} data-on={v.tile === t.value} className="adb-tile" onClick={() => set("tile", t.value)}>
                <span className="adb-tile-shape" style={{ aspectRatio: `1 / ${t.ratio}` }} />
                <b>{t.label}</b>
                <small>{t.size}</small>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            <b className="text-zinc-700">{tile.label}:</b> {tile.hint} Upload about {tile.size}.
          </p>
        </div>
        <ImageField
          label="Cover picture"
          hint={`Shown on the Blog page and at the top of the article. Best size for the ${tile.label.toLowerCase()} shape: ${tile.size}.`}
          value={v.cover}
          onChange={(x) => set("cover", x)}
        />
        <label className={`${labelClass} block max-w-xs`}>
          Place in the list of the Blog page
          <input type="number" min={1} max={999} value={v.position} onChange={(e) => set("position", Math.max(1, Number(e.target.value) || 1))} className={inputClass} />
          <span className="mt-1 block text-xs font-normal text-zinc-400">1 = first. The preview below shows where the picture lands.</span>
        </label>
      </div>

      <div className={card}>
        <p className={labelClass}>Preview of the Blog page</p>
        <p className="mb-3 mt-1 text-xs text-zinc-500">How the pictures lie on a laptop, a desktop and a large screen. The article you are editing has a coloured frame.</p>
        <BlogPreview items={previewItems} highlightId={v.published ? (id ?? "__new") : undefined} />
      </div>

      <div className={`${card} space-y-5`}>
        <label className={labelClass}>
          The article
          <textarea rows={18} value={v.content} onChange={(e) => set("content", e.target.value)} className={`${inputClass} resize-y font-mono`} placeholder={CONTENT_PLACEHOLDER} />
          <span className="mt-1 block text-xs font-normal text-zinc-400">
            Write normally; an empty line starts a new paragraph. <code>## Heading</code> makes a heading, lines that start with <code>- </code> make a list.
          </span>
        </label>
        <label className={labelClass}>
          Questions and answers (optional)
          <textarea rows={5} value={v.faq} onChange={(e) => set("faq", e.target.value)} className={`${inputClass} resize-y`} placeholder="Is it hard to start? | No, we guide you from the first call." />
          <span className="mt-1 block text-xs font-normal text-zinc-400">One per line: question | answer. They are shown at the end and given to Google.</span>
        </label>
        <label className={labelClass}>
          Tags (optional)
          <input type="text" value={v.tags} onChange={(e) => set("tags", e.target.value)} className={inputClass} placeholder="AI Development, Automation, CRM" />
          <span className="mt-1 block text-xs font-normal text-zinc-400">Separate with commas.</span>
        </label>
      </div>

      <div className={`${card} flex flex-wrap items-center justify-between gap-4`}>
        {onSave ? (
          <span className="text-sm text-zinc-500">Saved into the submission. It goes live only when you press Approve.</span>
        ) : (
          <label className="flex items-center gap-2.5 text-sm font-medium text-zinc-700">
            <input type="checkbox" checked={v.published} onChange={(e) => set("published", e.target.checked)} className="size-4 accent-[var(--color-brand)]" />
            Show this article on the website
          </label>
        )}
        <div className="flex flex-wrap items-center gap-3">
          {msg && (
            <p role="status" className={`rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
              {msg.text}
            </p>
          )}
          {slug && (
            <a href={`/blog/${slug}`} target="_blank" rel="noreferrer" className={btnSecondary}>
              View live ↗
            </a>
          )}
          {id && (
            <button type="button" className={btnDanger} onClick={remove} disabled={pending}>
              Delete
            </button>
          )}
          <Link href={backHref ?? "/admin/blog"} className={btnSecondary}>
            Back
          </Link>
          <button type="button" className={btnPrimary} onClick={save} disabled={pending || (id || onSave ? !dirty : false)}>
            {pending ? "Saving…" : onSave ? "Save changes" : id ? "Save changes" : "Add article"}
          </button>
        </div>
      </div>
    </div>
  );
}
