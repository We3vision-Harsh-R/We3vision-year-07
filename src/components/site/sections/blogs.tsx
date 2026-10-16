import { getBlogEntries } from "@/lib/blog";
import type { BlogEntry } from "@/lib/blog-shared";
import { type MasonryItem } from "../modern/blog-masonry";
import { BlogMasonry } from "../lazy";
import { ButtonLink, SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

// The list of the articles: only the cover pictures, in a masonry (blog-masonry.tsx). The articles, the shape of every picture and their order come
// from the admin panel (Blog); the items written in the content of the section are only used when there is no article at all.
/** about how long the article takes to read (200 words a minute) */
function readMinutes(blocks: BlogEntry["blocks"]) {
  const words = blocks.reduce((n, b) => n + ("h" in b ? b.h : "p" in b ? b.p : b.ul.join(" ")).split(/s+/).length, 0);
  return Math.max(1, Math.round(words / 200));
}

async function BlogGrid({ fallback }: { fallback: MasonryItem[] }) {
  const entries = await getBlogEntries();
  const items: MasonryItem[] = entries.length
    ? entries.map((e) => ({
        id: e.id,
        title: e.title,
        category: e.category,
        image: e.image,
        tile: e.tile,
        href: `/blog/${e.slug}`,
        summary: e.summary,
        dateLabel: e.dateLabel,
        tags: e.tags,
        minutes: readMinutes(e.blocks),
      }))
    : fallback;
  return <BlogMasonry items={items} />;
}

export const Blogs: SectionComponent<"blogs"> = ({ data }) => (
  <section id="blogs" className="py-24 sm:py-32">
    {/* wider than the other sections: the bigger the screen, the more columns of pictures */}
    <div className="mx-auto w-full max-w-[2200px] px-5 sm:px-8">
      <SectionHead chip={data.chip} heading={data.heading}>
        {data.buttonLabel && data.buttonHref ? (
          <ButtonLink href={data.buttonHref} variant="ghost">
            {data.buttonLabel}
          </ButtonLink>
        ) : null}
      </SectionHead>
      <div className="mt-14">
        <BlogGrid fallback={data.items.map((p) => ({ id: p.href || p.title, title: p.title, category: p.category, image: p.image, tile: "portrait", href: p.href || "#" }))} />
      </div>
    </div>
  </section>
);
