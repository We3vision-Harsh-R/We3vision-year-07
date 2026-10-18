import { getBlogEntries } from "@/lib/blog";
import { feedOf, readMinutes } from "@/lib/blog-select";
import { type MasonryItem } from "../modern/blog-masonry";
import { BlogShelf, type ShelfLabels } from "../modern/blog-shelf";
import { ButtonLink, SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

// The list of the articles. The articles, the shape of every picture and their order come from the admin panel (Blog); what this section shows
// (the look, the topic buttons, one topic only, how many, the words of the buttons) comes from Admin > Pages. The items written in the content
// of the section are only used when there is no article at all.
async function BlogGrid({ fallback, category, limit, layout, topics, labels }: { fallback: MasonryItem[]; category: string; limit: string; layout: string; topics: boolean; labels: ShelfLabels }) {
  const entries = feedOf(await getBlogEntries(), category, limit);
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
  return <BlogShelf items={items} layout={layout} topics={topics} labels={labels} />;
}

export const Blogs: SectionComponent<"blogs"> = ({ data }) => (
  <section id="blogs" className="py-24 sm:py-32">
    {/* the picture wall is wider than the other sections: the bigger the screen, the more columns of pictures */}
    <div className={`mx-auto w-full px-5 sm:px-8 ${data.layout === "grid" || data.layout === "list" ? "max-w-[1240px]" : "max-w-[2200px]"}`}>
      <SectionHead chip={data.chip} heading={data.heading}>
        {data.buttonLabel && data.buttonHref ? (
          <ButtonLink href={data.buttonHref} variant="ghost">
            {data.buttonLabel}
          </ButtonLink>
        ) : null}
      </SectionHead>
      <div className="mt-14">
        <BlogGrid
          fallback={data.items.map((p) => ({ id: p.href || p.title, title: p.title, category: p.category, image: p.image, tile: "portrait", href: p.href || "#" }))}
          category={data.category}
          limit={data.limit}
          layout={data.layout}
          topics={data.topics !== "hide"}
          labels={{ all: data.allLabel || "All", more: data.moreLabel || "Show more", read: data.readLabel, empty: data.emptyText }}
        />
      </div>
    </div>
  </section>
);
