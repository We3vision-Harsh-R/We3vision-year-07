import type { MobileSection } from "../../types";
import { AppLink } from "../../../app";
import { Lines } from "../../../app/text";

// /products top: an App Store "Today" story card (the chip as its label, the heading big over a theme gradient, the text and buttons below).
// Styles: (m)/m/products/page.css ("mp-prod-").
export const ProductsToday: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  const acts = [
    { label: data.primaryLabel, href: data.primaryHref },
    { label: data.secondaryLabel, href: data.secondaryHref },
  ].filter((a) => a.label && a.href);
  return (
    <section className="mp-prod-today">
      <div className="mp-prod-art">
        {data.chip && <p className="mp-prod-lbl">{data.chip}</p>}
        <H className="mp-prod-h">
          <Lines text={data.heading} />
        </H>
      </div>
      <div className="mp-prod-body">
        {data.text && <p>{data.text}</p>}
        {acts.length > 0 && (
          <div className="mp-prod-acts">
            {acts.map((a, i) => (
              <AppLink key={i} href={a.href} className={i === 0 ? "ma-btn ma-btn-fill ma-btn-block" : "ma-btn ma-btn-glass ma-btn-block"}>
                {a.label}
              </AppLink>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
