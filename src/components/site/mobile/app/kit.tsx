/* eslint-disable @next/next/no-img-element -- image links are editable in the admin panel and can point anywhere (the laptop <Img> does the same) */
import type { CSSProperties, ReactNode } from "react";
import { Clamp } from "./clamp";
import { IcChevron } from "./icons";
import { AppLink } from "./link";
import { Lines } from "./text";

// The MobileApp kit: small server components that every app screen is built from. Class prefix "ma-", all styles in app.css.

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** a small rounded label ("Our work", "FAQ") */
export function Chip({ children }: { children: ReactNode }) {
  return <span className="ma-chip">{children}</span>;
}

/** A section of a screen: an optional chip, title and intro, then the content. `title` may hold line breaks (the later lines take the accent colour). */
export function Section({ id, chip, title, intro, children, as: H = "h2" }: { id?: string; chip?: string; title?: string; intro?: string; children?: ReactNode; as?: "h1" | "h2" | "h3" }) {
  const head = chip || title || intro;
  return (
    <section id={id} className="ma-sec">
      {head && (
        <header className="ma-sec-head">
          {chip && <Chip>{chip}</Chip>}
          {title && (
            <H className="ma-h2">
              <Lines text={title} />
            </H>
          )}
          {intro && (intro.length > 170 ? <Clamp lines={3}><p className="ma-intro">{intro}</p></Clamp> : <p className="ma-intro">{intro}</p>)}
        </header>
      )}
      {children}
    </section>
  );
}

/** a card; `tone="tint"` colours it with the theme; with `href` the whole card is a link */
export function Card({ children, tone, href, className, style }: { children: ReactNode; tone?: "tint"; href?: string; className?: string; style?: CSSProperties }) {
  const cls = cx("ma-card", tone === "tint" && "ma-card-tint", className);
  return href ? (
    <AppLink href={href} className={cls}>
      {children}
    </AppLink>
  ) : (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}

/** a button (a link that looks like a capsule); `variant` fill (main), tinted, glass or plain */
export function Button({ href, children, variant = "fill", block, icon }: { href: string; children: ReactNode; variant?: "fill" | "tinted" | "glass" | "plain"; block?: boolean; icon?: ReactNode }) {
  return (
    <AppLink href={href} className={cx("ma-btn", `ma-btn-${variant}`, block && "ma-btn-block")}>
      {icon}
      {children}
    </AppLink>
  );
}

/** The first card of a page: chip, big heading, text and up to two buttons. `h1` makes the heading the page's h1. */
export function Hero({ chip, title, text, actions, children, h1 }: { chip?: string; title?: string; text?: string; actions?: { label: string; href: string }[]; children?: ReactNode; h1?: boolean }) {
  const H = h1 ? "h1" : "h2";
  const acts = (actions ?? []).filter((a) => a.label && a.href);
  return (
    <section className="ma-hero">
      {chip && <Chip>{chip}</Chip>}
      {title && (
        <H className="ma-title2">
          <Lines text={title} />
        </H>
      )}
      {text && (text.length > 210 ? <Clamp lines={4}><p className="ma-intro">{text}</p></Clamp> : <p className="ma-intro">{text}</p>)}
      {children}
      {acts.length > 0 && (
        <div className="ma-actions">
          {acts.map((a, i) => (
            <Button key={a.label + i} href={a.href} variant={i === 0 ? "fill" : "glass"} block>
              {a.label}
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}

/** a group of rows in one rounded surface (iOS "inset grouped list") with an optional header and footer */
export function GroupedList({ header, footer, children }: { header?: string; footer?: string; children: ReactNode }) {
  return (
    <div>
      {header && <p className="ma-gh">{header}</p>}
      <div className="ma-group">{children}</div>
      {footer && <p className="ma-gf">{footer}</p>}
    </div>
  );
}

/** a row of a grouped list: a title, an optional text under it, an optional detail on the right, an icon, a link with a chevron */
export function ListRow({ title, text, detail, icon, href }: { title: ReactNode; text?: ReactNode; detail?: ReactNode; icon?: ReactNode; href?: string }) {
  const inner = (
    <>
      {icon && <span className="ma-row-ic">{icon}</span>}
      <span className="ma-row-body">
        <span className="ma-row-t">{title}</span>
        {text && <span className="ma-row-s">{text}</span>}
      </span>
      {detail && <span className="ma-row-d">{detail}</span>}
      {href && <IcChevron className="ma-row-chev" />}
    </>
  );
  return href ? (
    <AppLink href={href} className="ma-row">
      {inner}
    </AppLink>
  ) : (
    <div className="ma-row">{inner}</div>
  );
}

/** Rows that open to show their text (FAQ). Native <details>, so it needs no script and the text is always in the page. */
export function Accordion({ items, openFirst }: { items: { title: ReactNode; body: ReactNode }[]; openFirst?: boolean }) {
  return (
    <div className="ma-group">
      {items.map((it, i) => (
        <details key={i} className="ma-acc" open={openFirst && i === 0}>
          <summary>
            <span>{it.title}</span>
            <IcChevron />
          </summary>
          <div className="ma-acc-body">{it.body}</div>
        </details>
      ))}
    </div>
  );
}

/** a vertical timeline / numbered steps; `label` replaces the number (e.g. a year) */
export function Stepper({ steps }: { steps: { label?: string; kicker?: string; title?: string; text?: string; points?: string[] }[] }) {
  return (
    <ol className="ma-steps">
      {steps.map((s, i) => (
        <li key={i} className="ma-step">
          <span className={cx("ma-step-n", s.label && "is-year")}>{s.label ?? String(i + 1).padStart(2, "0")}</span>
          <div className="ma-step-b">
            {s.kicker && <p className="ma-kicker">{s.kicker}</p>}
            {s.title && <h3>{s.title}</h3>}
            {s.text && <p>{s.text}</p>}
            {s.points && s.points.length > 0 && <Points items={s.points} />}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** a list with check marks */
export function Points({ items }: { items: string[] }) {
  return (
    <ul className="ma-pts">
      {items.map((p, i) => (
        <li key={i}>{p}</li>
      ))}
    </ul>
  );
}

/** big numbers with a label */
export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="ma-stats">
      {items.map((s, i) => (
        <div key={i} className="ma-stat">
          <b>{s.value}</b>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/** short labels as pills */
export function Cloud({ items }: { items: string[] }) {
  return (
    <div className="ma-cloud">
      {items.map((t, i) => (
        <span key={i} className="ma-pill">
          {t}
        </span>
      ))}
    </div>
  );
}

/** a row of cards that scrolls sideways and snaps */
export function Gallery({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="ma-gal" role="group" aria-label={label}>
      {children}
    </div>
  );
}

/** a picture in a fixed shape; no picture = a soft coloured placeholder with the first letter of `alt` */
export function Pic({ src, alt, ratio = "4 / 3" }: { src?: string; alt: string; ratio?: string }) {
  return (
    <div className={cx("ma-pic", !src && "ma-pic-ph")} style={{ "--r": ratio } as CSSProperties}>
      {src ? <img src={src} alt={alt} loading="lazy" decoding="async" /> : <span aria-hidden="true">{alt.trim().charAt(0).toUpperCase()}</span>}
    </div>
  );
}

/** a card with a picture on top (projects, articles, windows) */
export function PicCard({ src, alt, ratio, kicker, title, text, points, href }: { src?: string; alt: string; ratio?: string; kicker?: string; title: string; text?: string; points?: string[]; href?: string }) {
  return (
    <Card className="ma-tile" href={href}>
      <Pic src={src} alt={alt} ratio={ratio} />
      <div className="ma-tile-b">
        {kicker && <p className="ma-kicker">{kicker}</p>}
        <h3>{title}</h3>
        {text && <p>{text}</p>}
        {points && points.length > 0 && <Points items={points} />}
      </div>
    </Card>
  );
}
