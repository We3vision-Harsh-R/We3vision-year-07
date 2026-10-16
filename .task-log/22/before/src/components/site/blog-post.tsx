import Link from "next/link";
import type { Post } from "@/lib/blog-posts";
import { Img } from "./img";

// One article of the blog (/blog/<slug>): a calm reading column in the look of the service pages. Text is plain server HTML (nothing here needs
// JavaScript), the questions at the end are also given to Google as an Article and a FAQPage. The look is in globals.css (.bp-*).
export function BlogPost({ post, base }: { post: Post; base: string }) {
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.summary,
        datePublished: post.date,
        image: post.image ? `${base}${post.image}` : undefined,
        keywords: post.tags.join(", "),
        author: { "@type": "Organization", name: "We3vision Private Limited" },
        publisher: { "@type": "Organization", name: "We3vision Private Limited" },
        mainEntityOfPage: `${base}/blog/${post.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: post.faq.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
      },
    ],
  };
  return (
    <article className="bp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }} />
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
        {post.image && <Img src={post.image} alt="" className="bp-cover" />}
      </header>

      <div className="bp-body">
        {post.blocks.map((b, i) =>
          "h" in b ? (
            <h2 key={i}>{b.h}</h2>
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

        <h2>Frequently asked questions</h2>
        <div className="bp-faq">
          {post.faq.map((q) => (
            <details key={q.question}>
              <summary>{q.question}</summary>
              <p>{q.answer}</p>
            </details>
          ))}
        </div>

        <ul className="bp-tags" aria-label="Topics">
          {post.tags.map((t) => (
            <li key={t}>#{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
