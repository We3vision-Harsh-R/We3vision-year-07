import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink } from "../../../app";
import { TodayCard } from "../../../../lazy";
import { Lines, oneLine } from "../../../app/text";

// /products top as the App Store "Today" tab: the chip as the date line, the page heading as the Large Title (the page's h1), then a Today card
// (glass squircles over the theme light) that opens full screen with the text and the two buttons. Words only from the CMS.
// Styles: app/apple.css (ma-ap-) and (m)/m/products/page.css (mp-prod-).
export const ProductsToday: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  const acts = [
    { label: data.primaryLabel, href: data.primaryHref },
    { label: data.secondaryLabel, href: data.secondaryHref },
  ].filter((a) => a.label && a.href);
  const art = (
    <span className="ma-ap-glow">
      {[0, 1, 2, 3].map((i) => (
        <i key={i} className="ma-ap-glass" style={{ "--i": i } as CSSProperties} />
      ))}
    </span>
  );
  return (
    <section className="mp-prod-today">
      <header className="mp-prod-tt">
        {data.chip && <p className="mp-prod-lbl">{data.chip}</p>}
        {/* the heading is the card title on screen; the h1 stays for search engines and screen readers */}
        <H className="mp-prod-h ma-ap-vh">
          <Lines text={data.heading} />
        </H>
      </header>
      <TodayCard
        label={oneLine(data.heading)}
        kicker={data.chip}
        title={<Lines text={data.heading} />}
        art={art}
        body={
          <>
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
          </>
        }
      />
      {data.text && <p className="mp-prod-sub">{data.text}</p>}
    </section>
  );
};
