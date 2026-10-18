/* eslint-disable @next/next/no-img-element -- article pictures are links from the admin panel (Blog) */
import "@/styles/blog-sections.css";
import Link from "next/link";
import { getBlogEntries } from "@/lib/blog";
import { pickFeatured, pickList, readMinutes } from "@/lib/blog-select";
import { ButtonLink, Chip, Rich, SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

// Three sections made for the blog page (they work on any page): the top story, hand-picked articles and a call-to-action band.
// The articles come from Admin > Blog; which article, the words and the look come from the section (Admin > Pages). Styles: src/styles/blog-sections.css (bx-).

/** one article shown big */
export const BlogFeatured: SectionComponent<"blogFeatured"> = async ({ data, sectionId }) => {
  const post = pickFeatured(await getBlogEntries(), data.slug);
  if (!post) return null;
  const split = data.look === "split";
  return (
    <section id={sectionId} className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1240px]">
        {data.chip && (
          <div className="mb-8 text-center">
            <Chip>{data.chip}</Chip>
          </div>
        )}
        <Link href={`/blog/${post.slug}`} className={`bx-top ${split ? "bx-top-split" : "bx-top-wide"}`}>
          <span className="bx-top-pic">{post.image ? <img src={post.image} alt="" loading="lazy" decoding="async" /> : <span className="bx-pic-ph" aria-hidden="true" />}</span>
          <span className="bx-top-body">
            {post.category && <span className="bx-cat">{post.category}</span>}
            <span className="bx-top-title">{post.title}</span>
            {post.summary && <span className="bx-top-sum">{post.summary}</span>}
            <span className="bx-meta">{[post.dateLabel, `${readMinutes(post.blocks)} ${data.readLabel}`.trim()].filter(Boolean).join(" · ")}</span>
            {data.buttonLabel && <span className="bx-top-btn">{data.buttonLabel} →</span>}
          </span>
        </Link>
      </div>
    </section>
  );
};

/** a short list of articles chosen by hand (editor's picks, most read, start here) */
export const BlogPicks: SectionComponent<"blogPicks"> = async ({ data, sectionId }) => {
  const posts = pickList(await getBlogEntries(), data.slugs);
  if (!posts.length) return null;
  const cards = data.look === "cards";
  return (
    <section id={sectionId} className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
        <ol className={`mt-12 ${cards ? "bx-picks-cards" : "bx-picks"}`}>
          {posts.map((p, i) => (
            <li key={p.id} style={{ "--i": i } as React.CSSProperties}>
              <Link href={`/blog/${p.slug}`} className="bx-pick">
                {cards ? (
                  <span className="bx-pic">{p.image ? <img src={p.image} alt="" loading="lazy" decoding="async" /> : <span className="bx-pic-ph" aria-hidden="true" />}</span>
                ) : (
                  <span className="bx-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                <span className="bx-body">
                  {p.category && <span className="bx-cat">{p.category}</span>}
                  <span className="bx-title">{p.title}</span>
                  {!cards && p.summary && <span className="bx-sum">{p.summary}</span>}
                  {p.dateLabel && <span className="bx-meta">{p.dateLabel}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

/** a wide band: heading, a line of text and one or two buttons */
export const CtaBand: SectionComponent<"ctaBand"> = ({ data, sectionId }) => {
  const glow = data.look !== "plain";
  const buttons = (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      {data.primaryLabel && <ButtonLink href={data.primaryHref}>{data.primaryLabel}</ButtonLink>}
      {data.secondaryLabel && (
        <ButtonLink href={data.secondaryHref} variant="ghost">
          {data.secondaryLabel}
        </ButtonLink>
      )}
    </div>
  );
  return (
    <section id={sectionId} className="px-5 py-20 sm:px-8 sm:py-28">
      {glow ? (
        <div className="bx-band mx-auto max-w-[1100px]">
          {data.chip && <Chip>{data.chip}</Chip>}
          {data.heading && <h2 className="text-vfade mx-auto mt-6 max-w-[820px] whitespace-pre-line pb-1 text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">{data.heading}</h2>}
          {data.text && (
            <p className="mx-auto mt-5 max-w-[620px] text-base leading-relaxed text-orchid">
              <Rich text={data.text} />
            </p>
          )}
          {buttons}
        </div>
      ) : (
        <div className="mx-auto max-w-[1100px]">
          <SectionHead chip={data.chip} heading={data.heading} intro={data.text} />
          {buttons}
        </div>
      )}
    </section>
  );
};
