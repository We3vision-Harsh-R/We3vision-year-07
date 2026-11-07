import { Home2Cta, Home2PageHero, Home2Shell } from "@/components/site/home2/home2-chrome";
import { Home2Portfolio, type Pin } from "@/components/site/home2/home2-portfolio";
import { pageMetadata } from "@/lib/cms/page-route";
import { coverOf, getProjects } from "@/lib/projects";
import "@/styles/home-2.css";

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
  return (
    <Home2Shell>
      <Home2PageHero label="Portfolio" line="A selection of the work We3vision has built for clients: brand identity, websites, apps, AI and immersive experiences.">
        <em>Projects</em> we are proud of
      </Home2PageHero>
      <section className="hb2-pf" aria-label="Projects">
        <div className="hb2-wrap">
          <Home2Portfolio projects={pins} />
        </div>
      </section>
      <Home2Cta />
    </Home2Shell>
  );
}
