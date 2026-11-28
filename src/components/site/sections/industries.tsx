import "@/styles/industries-list.css";
import { AiIndustries } from "../lazy";
import { IndustryIcon } from "../icons";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

/**
 * "Industries we serve": a simple, light section. A heading and one card for every industry (icon, name, one line). The old 3D city with the
 * driving car was removed (owner, 2026-11-28); the list of the industries is the same CMS data as before.
 */
export const Industries: SectionComponent<"industries"> = ({ data, page }) => {
  if (page === "ai") return <AiIndustries data={data} />;
  return (
    <section id="industries" className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1120px] px-4">
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
        <ul className="ixl-grid">
          {data.items.map((it) => (
            <li key={it.name} className="ixl-card">
              <span className="ixl-ico" aria-hidden>
                <IndustryIcon name={it.name} />
              </span>
              <h3 className="ixl-name">{it.name}</h3>
              {it.description && <p className="ixl-text">{it.description}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
