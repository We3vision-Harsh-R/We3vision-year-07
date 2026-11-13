import { HomeCta, HomePageHero, HomeShell } from "@/components/site/home/home-chrome";
import { HomePortfolio, type Pin } from "@/components/site/home/home-portfolio";
import { PageJsonLd } from "@/components/site/page-jsonld";
import { getPublishedPage } from "@/lib/cms/queries";
import { pageMetadata } from "@/lib/cms/page-route";
import { siteBase } from "@/lib/seo/schema";
import { coverOf, getProjects } from "@/lib/projects";
import "@/styles/home.css";

// Portfolio page: the projects of the admin panel (Admin > Projects) as a board. Served from cache; saving a project refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("portfolio");

export default async function PagePortfolio() {
  let pins: Pin[] = [];
  try {
    pins = (await getProjects()).map((p) => ({ id: p.id, slug: p.slug, title: p.title, category: p.category, summary: p.summary, cover: coverOf(p) }));
  } catch {
    // the database is not reachable: the page shows its quiet empty state
  }
  // structured data: the page, and the list of its projects (the same projects the board shows)
  const [page, base] = [await getPublishedPage("portfolio"), siteBase()];
  const list = {
    "@type": "ItemList",
    "@id": `${base}/portfolio#projects`,
    name: "Projects by We3vision",
    numberOfItems: pins.length,
    itemListElement: pins.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.title, url: `${base}/portfolio/${p.slug}` })),
  };
  return (
    <HomeShell>
      <PageJsonLd slug="portfolio" title={page.title} description={page.description} extra={pins.length ? [list] : []} mainEntityId={pins.length ? list["@id"] : undefined} />
      <HomePageHero label="Portfolio" line="A selection of the work We3vision has built for clients: brand identity, websites, apps, AI and immersive experiences.">
        <em>Projects</em> we are proud of
      </HomePageHero>
      <section className="hb2-pf" aria-label="Projects">
        <div className="hb2-wrap">
          <HomePortfolio projects={pins} />
        </div>
      </section>
      <HomeCta />
    </HomeShell>
  );
}
