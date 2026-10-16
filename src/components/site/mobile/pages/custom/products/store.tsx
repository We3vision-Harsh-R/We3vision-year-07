import type { CSSProperties } from "react";
import type { MobileSectionProps } from "../../types";
import { AppLink, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Rich, lines, oneLine, paragraphs } from "../../../app/text";
import "./store.css";

// App Store-like pieces for the product pages (/products and /products/*): a product header (icon, name, subtitle, GET-style button),
// a description card and the product list. Every word comes from the CMS section; `look` and `hue` only change the design per page.
// Styles: store.css next to this file ("mp-store-"); each page adds its own touches in its page.css.

export type StoreLook = "row" | "center" | "slide" | "note";

const nameOf = (heading: string) => lines(heading)[0] ?? "";
const subOf = (heading: string) => lines(heading).slice(1).join(" ");

/** the product icon: the first letter of the product's name on a theme-coloured squircle */
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
    <section className={"mp-store-head is-" + look}>
      {look === "slide" && (
        <div className="mp-store-slide" aria-hidden="true">
          <span>{name}</span>
          <i />
          <i />
        </div>
      )}
      <div className="mp-store-id">
        {look !== "slide" && <StoreIcon name={name} hue={hue} size="lg" />}
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
            <AppLink key={i} href={a.href} className={i === 0 ? "mp-store-get" : "mp-store-alt"}>
              {a.label}
            </AppLink>
          ))}
        </div>
      )}
      {data.text && <p className="mp-store-t">{data.text}</p>}
    </section>
  );
}

/** the story section as the product's description */
export function StoreAbout({ data, id, look = "row" }: MobileSectionProps<"story"> & { look?: StoreLook }) {
  return (
    <section id={id} className={"ma-sec mp-store-about is-" + look}>
      <div className="mp-store-desc">
        {paragraphs(data.body).map((p, i) => (
          <p key={i}>
            <Rich text={p} />
          </p>
        ))}
      </div>
    </section>
  );
}

/** the products of /products as App Store rows: icon, name, line, a pill to open it */
export function StoreList({ data, id }: MobileSectionProps<"services">) {
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      <ul className="mp-store-list">
        {data.cards.map((c, i) => {
          const name = oneLine(c.title);
          const inner = (
            <>
              <StoreIcon name={name} hue={i * 70} />
              <span className="mp-store-lb">
                <b>{name}</b>
                {c.description && <span>{c.description}</span>}
              </span>
              {c.href ? (
                <span className="mp-store-pill" aria-hidden="true">
                  <IcChevron />
                </span>
              ) : null}
            </>
          );
          return <li key={i}>{c.href ? <AppLink href={c.href} className="mp-store-row">{inner}</AppLink> : <div className="mp-store-row">{inner}</div>}</li>;
        })}
      </ul>
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
