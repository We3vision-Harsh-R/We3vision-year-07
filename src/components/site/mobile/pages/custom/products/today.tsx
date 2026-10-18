import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink } from "../../../app";
import { Lines } from "../../../app/text";

// /products top: an iOS 27 App Store "Today" card (glass icon shapes and the chip over a theme gradient, the heading big, the text and two
// buttons side by side on glass below). Words only from the CMS. Styles: (m)/m/products/page.css ("mp-prod-").
export const ProductsToday: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  const acts = [
    { label: data.primaryLabel, href: data.primaryHref },
    { label: data.secondaryLabel, href: data.secondaryHref },
  ].filter((a) => a.label && a.href);
  return (
    <section className="mp-prod-today">
      <div className="mp-prod-art">
        <div className="mp-prod-icons" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <i key={i} style={{ "--i": i } as CSSProperties} />
          ))}
        </div>
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
              <AppLink key={i} href={a.href as string} className={i === 0 ? "ma-btn ma-btn-fill" : "ma-btn ma-btn-glass"}>
                {a.label}
              </AppLink>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
