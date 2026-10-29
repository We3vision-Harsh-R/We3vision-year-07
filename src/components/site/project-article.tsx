import Link from "next/link";
import { Img } from "@/components/site/img";
import { coverOf, type ProjectView } from "@/lib/projects";

// The body of one portfolio project page (/portfolio/<slug>): the live page and the AI-submission preview use this same component.
export function ProjectArticle({ p }: { p: ProjectView }) {
  const paragraphs = p.content.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
  const cover = coverOf(p);
  const gallery = p.images.filter((u) => u !== cover);
  return (
    <article className="bp">
      <header className="bp-head">
        <Link href="/portfolio" className="bp-back">
          ← All projects
        </Link>
        {p.category && <span className="bp-chip">{p.category}</span>}
        <h1 className="bp-h1">{p.title}</h1>
        {p.summary && <p className="bp-lead">{p.summary}</p>}
        {cover && <Img src={cover} alt={p.title} className="bp-cover" />}
      </header>
      {paragraphs.length > 0 && (
        <div className="bp-body">
          {paragraphs.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      )}
      {gallery.length > 0 && (
        <div className="bp-gallery">
          {gallery.map((u, i) => (
            <Img key={`${u}-${i}`} src={u} alt={`${p.title}, picture ${i + 1}`} className="bp-pic" />
          ))}
        </div>
      )}
    </article>
  );
}
