import type { MobileSection } from "../../types";
import { AppLink } from "../../../app";
import { Lines } from "../../../app/text";

// /products top, in the theme of the home page: a plain label, the page heading, the text and the two buttons (the same first screen as every other phone page).
// Words only from the CMS. Styles: (m)/m/products/page.css (mp-prod-).
export const ProductsToday: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  const acts = [
    { label: data.primaryLabel, href: data.primaryHref },
    { label: data.secondaryLabel, href: data.secondaryHref },
  ].filter((a) => a.label && a.href);
  return (
    <section className="mp-prod-hero">
      {data.chip && <p className="mp-prod-lbl">{data.chip}</p>}
      <H className="mp-prod-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-prod-t">{data.text}</p>}
      {acts.length > 0 && (
        <div className="mp-prod-acts">
          {acts.map((a, i) => (
            <AppLink key={i} href={a.href as string} className={i === 0 ? "ma-btn ma-btn-fill" : "ma-btn ma-btn-glass"}>
              {a.label}
            </AppLink>
          ))}
        </div>
      )}
    </section>
  );
};
