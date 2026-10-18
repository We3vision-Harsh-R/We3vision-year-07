import type { CSSProperties } from "react";
import type { MobileSectionProps } from "../../types";
import { AppLink, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { TapSheet } from "../../../app/apple";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";
import "./store.css";

// iOS 27 App Store pieces for the product pages (/products and /products/*): a product header (glass squircle icon, name, subtitle,
// a "Get"-style capsule and a glass one), the description with "more", the product list as open App Store rows, the FAQ as an open list.
// Every word comes from the CMS section; `look` and `hue` only change the artwork per page. Styles: store.css ("mp-store-").

export type StoreLook = "row" | "center" | "slide" | "note";

const nameOf = (heading: string) => lines(heading)[0] ?? "";
const subOf = (heading: string) => lines(heading).slice(1).join(" ");

/** the product icon: the first letter of the product's name on a theme-coloured squircle with a specular glass edge */
export function StoreIcon({ name, hue = 0, size }: { name: string; hue?: number; size?: "sm" | "lg" }) {
  return (
    <span className={"mp-store-ic" + (size ? " is-" + size : "")} style={{ "--o": hue } as CSSProperties} aria-hidden="true">
      {name.replace(/^We/, "").charAt(0).toUpperCase() || name.charAt(0).toUpperCase()}
    </span>
  );
}

/** pageHero of a product page as an App Store header */
export function StoreHeader({ data, index, look = "row", hue = 0 }: MobileSectionProps<"pageHero"> & { look?: StoreLook; hue?: number }) {
  const H = index === 0 ? "h1" : "h2";
  const name = nameOf(data.heading);
  const sub = subOf(data.heading);
  const acts = [
    { label: data.primaryLabel, href: data.primaryHref },
    { label: data.secondaryLabel, href: data.secondaryHref },
  ].filter((a) => a.label && a.href);
  return (
    <section className={"mp-store-head is-" + look} style={{ "--o": hue } as CSSProperties}>
      {look === "slide" && (
        <div className="mp-store-slide" aria-hidden="true">
          <span>{name}</span>
          <i />
          <i />
        </div>
      )}
      <div className="mp-store-id">
        <StoreIcon name={name} hue={hue} size={look === "slide" ? undefined : "lg"} />
        <div className="mp-store-nm">
          <H className="mp-store-h">
            {name}
            {sub && <span className="mp-store-sub">{sub}</span>}
          </H>
          {data.chip && <span className="mp-store-badge">{data.chip}</span>}
        </div>
      </div>
      {acts.length > 0 && (
        <div className="mp-store-acts">
          {acts.map((a, i) => (
            <AppLink key={i} href={a.href as string} className={i === 0 ? "mp-store-get" : "mp-store-alt"}>
              {a.label}
            </AppLink>
          ))}
        </div>
      )}
      {data.text && <p className="mp-store-t">{data.text}</p>}
    </section>
  );
}

/** the story section as the product's description: the first paragraph, the rest behind "more" (like the App Store) */
export function StoreAbout({ data, id, look = "row" }: MobileSectionProps<"story"> & { look?: StoreLook }) {
  const ps = paragraphs(data.body);
  const [first, ...rest] = ps;
  return (
    <section id={id} className={"ma-sec mp-store-about is-" + look}>
      <div className="mp-store-desc">
        {first && (
          <p>
            <Rich text={first} />
          </p>
        )}
        {rest.length > 0 && (
          <details className="mp-store-more">
            <summary>more</summary>
            {rest.map((p, i) => (
              <p key={i}>
                <Rich text={p} />
              </p>
            ))}
          </details>
        )}
      </div>
    </section>
  );
}

/** the products of /products as App Store "Top Apps": rank, icon, name, line and a View capsule; a row opens the product's App Store sheet */
export function StoreList({ data, id }: MobileSectionProps<"services">) {
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      <ol className="mp-store-list mp-store-top">
        {data.cards.map((c, i) => {
          const name = oneLine(c.title);
          return (
            <li key={i} className="ma-rvx" style={{ "--rv-d": `${i * 60}ms` } as CSSProperties}>
              <TapSheet
                triggerClass="mp-store-row"
                label={name}
                title={name}
                trigger={
                  <>
                    <span className="mp-store-rank" aria-hidden="true">
                      {i + 1}
                    </span>
                    <StoreIcon name={name} hue={i * 70} />
                    <span className="mp-store-lb">
                      <b>{name}</b>
                      {c.description && <span>{c.description}</span>}
                    </span>
                    <span className="mp-store-pill" aria-hidden="true">
                      <IcChevron />
                    </span>
                  </>
                }
              >
                <div className="mp-store-sheet">
                  <StoreIcon name={name} hue={i * 70} size="lg" />
                  <b>
                    <Lines text={c.title} />
                  </b>
                </div>
                {c.description && <p>{c.description}</p>}
                {c.href && (
                  <AppLink href={c.href} className="ma-btn ma-btn-fill ma-btn-block">
                    {name}
                  </AppLink>
                )}
              </TapSheet>
            </li>
          );
        })}
      </ol>
      {data.buttonLabel && data.buttonHref && (
        <div className="ma-actions">
          <AppLink href={data.buttonHref} className="ma-btn ma-btn-fill ma-btn-block">
            {data.buttonLabel}
          </AppLink>
        </div>
      )}
    </Section>
  );
}

/** the FAQ of a product page as an open list: + turns into −, one open at a time */
export function StoreFaq({ data, id }: MobileSectionProps<"faq">) {
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      <ul className="mp-store-qa" data-exclusive>
        {data.items.map((x, i) => (
          <li key={i}>
            <details>
              <summary>
                <span>{x.question}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{x.answer}</p>
            </details>
          </li>
        ))}
      </ul>
    </Section>
  );
}
