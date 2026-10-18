/* eslint-disable @next/next/no-img-element -- article pictures are links from the admin panel (Blog), like the kit's <Pic> */
import { pickFeatured, pickList, readMinutes } from "@/lib/blog-select";
import type { MobileSection } from "../types";
import { AppLink, Button, Chip, Section } from "../../app";
import { Lines } from "../../app/text";

// The phone screens of the three blog sections (the laptop twins are in src/components/site/sections/blog-extra.tsx): the top story, hand-picked
// articles and a call-to-action band. Same CMS data, same articles (Admin > Blog). Styles: src/components/site/mobile/app/blog-sections.css (mbx-).

export const BlogFeaturedSection: MobileSection<"blogFeatured"> = ({ data, id, extra }) => {
  const post = pickFeatured(extra.posts ?? [], data.slug);
  if (!post) return null;
  return (
    <section id={id} className="ma-sec mbx">
      {data.chip && (
        <header className="ma-sec-head">
          <Chip>{data.chip}</Chip>
        </header>
      )}
      <AppLink href={`/blog/${post.slug}`} className={`mbx-top ${data.look === "split" ? "mbx-top-split" : ""}`}>
        <span className="mbx-top-pic">{post.image ? <img src={post.image} alt="" loading="lazy" decoding="async" /> : <span className="mbx-ph" aria-hidden="true" />}</span>
        <span className="mbx-top-b">
          {post.category && <span className="mbx-cat">{post.category}</span>}
          <span className="mbx-top-t">{post.title}</span>
          {post.summary && <span className="mbx-sum">{post.summary}</span>}
          <span className="mbx-meta">{[post.dateLabel, `${readMinutes(post.blocks)} ${data.readLabel}`.trim()].filter(Boolean).join(" · ")}</span>
          {data.buttonLabel && <span className="mbx-go">{data.buttonLabel}</span>}
        </span>
      </AppLink>
    </section>
  );
};

export const BlogPicksSection: MobileSection<"blogPicks"> = ({ data, id, extra }) => {
  const posts = pickList(extra.posts ?? [], data.slugs);
  if (!posts.length) return null;
  const cards = data.look === "cards";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      <ol className={cards ? "mbx-cards" : "mbx-rows"}>
        {posts.map((p, i) => (
          <li key={p.id}>
            <AppLink href={`/blog/${p.slug}`} className="mbx-pick">
              {cards ? (
                <span className="mbx-pic">{p.image ? <img src={p.image} alt="" loading="lazy" decoding="async" /> : <span className="mbx-ph" aria-hidden="true" />}</span>
              ) : (
                <span className="mbx-num" aria-hidden="true">
                  {i + 1}
                </span>
              )}
              <span className="mbx-pb">
                {p.category && <span className="mbx-cat">{p.category}</span>}
                <span className="mbx-pt">{p.title}</span>
                {p.dateLabel && <span className="mbx-meta">{p.dateLabel}</span>}
              </span>
            </AppLink>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export const CtaBandSection: MobileSection<"ctaBand"> = ({ data, id }) => {
  const acts = [
    { label: data.primaryLabel, href: data.primaryHref, v: "fill" as const },
    { label: data.secondaryLabel, href: data.secondaryHref, v: "glass" as const },
  ].filter((a) => a.label && a.href);
  return (
    <section id={id} className="ma-sec mbx">
      <div className={data.look === "plain" ? "mbx-band mbx-band-plain" : "mbx-band"}>
        {data.chip && <Chip>{data.chip}</Chip>}
        {data.heading && (
          <h2 className="ma-h2">
            <Lines text={data.heading} />
          </h2>
        )}
        {data.text && <p className="mbx-band-t">{data.text.replace(/\*/g, "")}</p>}
        {acts.length > 0 && (
          <div className="mbx-band-acts">
            {acts.map((a) => (
              <Button key={a.href + a.label} href={a.href} variant={a.v} block>
                {a.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
