import Link from "next/link";
import type { BlogEntry } from "@/lib/blog-shared";
import { articleGraph } from "@/lib/seo/schema";
import { Img } from "./img";
import { JsonLd } from "./json-ld";
import "@/styles/blog-post.css";

// One article of the blog (/blog/<slug>): the reading column in the middle, the index of the article on the left (sticky), and on the right (sticky)
// the facts of the article, its tags, the author and related articles. Text is plain server HTML (nothing here needs JavaScript), the page is also
// described to Google as a breadcrumb, an Article and a FAQPage (lib/seo/schema.ts). Look: globals.css (.bp-*) for the column, styles/blog-post.css (.bpx-*) for the sides.
const words = (post: BlogEntry) => post.blocks.reduce((n, b) => n + ("h" in b ? b.h : "p" in b ? b.p : b.ul.join(" ")).split(/\s+/).length, 0);

export function BlogPost({ post, related = [] }: { post: BlogEntry; base?: string; related?: BlogEntry[] }) {
  const index = post.blocks.flatMap((b, i) => ("h" in b ? [{ id: `bp-s${i}`, label: b.h }] : []));
  if (post.faq.length) index.push({ id: "bp-faq", label: "Frequently asked questions" });
  const minutes = Math.max(1, Math.round(words(post) / 200));
  return (
    <article className="bp bpx">
      <JsonLd graph={articleGraph(post)} />

      <nav className="bpx-side bpx-toc" aria-label="In this article">
        <p className="bpx-k">In this article</p>
        <ol>
          {index.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>{s.label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="bpx-main">
        <header className="bp-head">
          <Link href="/blog" className="bp-back">
            ← All articles
          </Link>
          <span className="bp-chip">{post.category}</span>
          <h1 className="bp-h1">{post.title}</h1>
          <p className="bp-meta">
            <time dateTime={post.date}>{post.dateLabel}</time>
          </p>
          <p className="bp-lead">{post.summary}</p>
          {post.image && <Img src={post.image} alt={post.title} className="bp-cover" />}
        </header>

        <div className="bp-body">
          {post.blocks.map((b, i) =>
            "h" in b ? (
              <h2 key={i} id={`bp-s${i}`}>
                {b.h}
              </h2>
            ) : "p" in b ? (
              <p key={i}>{b.p}</p>
            ) : (
              <ul key={i}>
                {b.ul.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ),
          )}

          <h2 id="bp-faq">Frequently asked questions</h2>
          <div className="bp-faq">
            {post.faq.map((q) => (
              <details key={q.question}>
                <summary>{q.question}</summary>
                <p>{q.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <aside className="bpx-side bpx-info" aria-label="About this article">
        <section>
          <p className="bpx-k">Article</p>
          <dl>
            <div>
              <dt>Topic</dt>
              <dd>{post.category}</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>
                <time dateTime={post.date}>{post.dateLabel}</time>
              </dd>
            </div>
            <div>
              <dt>Reading time</dt>
              <dd>{minutes} min</dd>
            </div>
          </dl>
        </section>

        {post.tags.length > 0 && (
          <section>
            <p className="bpx-k">Tags</p>
            <ul className="bp-tags" aria-label="Topics">
              {post.tags.map((t) => (
                <li key={t}>#{t}</li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <p className="bpx-k">Author</p>
          <p className="bpx-au">
            <span aria-hidden>W</span>
            <b>We3vision Team</b>
            <i>We3vision Private Limited, Surat</i>
          </p>
        </section>

        {related.length > 0 && (
          <section>
            <p className="bpx-k">Related articles</p>
            <ul className="bpx-rel">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`}>
                    <span>{r.category}</span>
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </article>
  );
}
