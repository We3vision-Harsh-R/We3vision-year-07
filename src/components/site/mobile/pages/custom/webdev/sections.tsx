import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Clamp, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";
import { APPS } from "../../../launcher-data";
import { Glyph } from "../../../glyph";
import { SiteBuilder } from "./builder";
import { PaperForm } from "./paper";
import { IndustryWheel } from "./wheel";
import { ServiceTiles } from "../../../../lazy";

// /webdev and /mobile as one iOS 27 app screen (brain/16): open lists with hairlines, Apple type scale (regular text, 500 for row titles,
// 600 for headings only), Liquid Glass only where it groups a tool (the builder, the service tiles, the paper form, the wheel band).
// The bottom tab bar is added by renderMobilePage. Styles: (m)/m/webdev/page.css ("mp-wd-"). Words only from the CMS.

const d = (ms: number) => ({ "--rv-d": `${ms}ms` }) as CSSProperties;

/** the top: a large title on the page itself (no card), the text, two buttons side by side */
export const WebHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-wd-hero">
      <span className="mp-wd-hero-glow" aria-hidden="true" />
      {data.chip && <span className="ma-chip">{data.chip}</span>}
      <H className="mp-wd-h">
        <Lines text={data.heading} />
      </H>
      {data.text && (data.text.length > 210 ? <Clamp lines={4}><p className="mp-wd-t">{data.text}</p></Clamp> : <p className="mp-wd-t">{data.text}</p>)}
      {(data.primaryLabel || data.secondaryLabel) && (
        <div className="ma-actions mp-wd-hero-act">
          {data.primaryLabel && data.primaryHref && (
            <Button href={data.primaryHref} block>
              {data.primaryLabel}
            </Button>
          )}
          {data.secondaryLabel && data.secondaryHref && (
            <Button href={data.secondaryHref} variant="glass" block>
              {data.secondaryLabel}
            </Button>
          )}
        </div>
      )}
    </section>
  );
};

/** the story: open paragraphs (Body 17 regular), a thin tint rule on the left, no box */
export const WebStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <article className="mp-wd-story ma-rvx">
      <Clamp lines={6}>
        {paragraphs(data.body).map((p, i) => (
          <p key={i}>
            <Rich text={p} />
          </p>
        ))}
      </Clamp>
    </article>
  </section>
);

/** "Type a name, watch it get built": the glass builder (a tool, so it is the one card here) and the tips as an open numbered list */
export const WebGuide: MobileSection<"guide"> = ({ data, id }) => {
  const tips = lines(data.tips);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
      <SiteBuilder label={tips[0] ?? oneLine(data.heading)} />
      {tips.length > 0 && (
        <ol className="mp-wd-tips">
          {tips.map((t, i) => (
            <li key={i} className="ma-rvx" style={d(i * 60)}>
              <span className="mp-wd-tips-n" aria-hidden="true">{i + 1}</span>
              <span className="mp-wd-tips-t">{t}</span>
            </li>
          ))}
        </ol>
      )}
      {data.buttonLabel && data.buttonHref && (
        <div className="ma-actions">
          <Button href={data.buttonHref} block>
            {data.buttonLabel}
          </Button>
        </div>
      )}
    </Section>
  );
};

/** "What we build" = glass tiles that open a sheet · "More from We3vision" = the app icons of those pages, like a home screen */
export const WebServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-wd-rel">
          {data.cards.map((c, i) => {
            const app = Object.values(APPS).find((x) => x.href === c.href);
            return (
              <li key={i} className="ma-rvx" style={d(i * 50)}>
                <AppLink href={c.href || "#contact"} className="mp-wd-rel-a">
                  <span className="ma-appic" style={{ "--off": app?.off ?? i * 40 } as CSSProperties} aria-hidden="true">
                    <Glyph name={app?.glyph ?? "globe"} />
                  </span>
                  <span className="mp-wd-rel-t">{oneLine(c.title)}</span>
                  <span className="ma-sr">{c.description}</span>
                </AppLink>
              </li>
            );
          })}
        </ul>
      ) : (
        data.cards.length > 0 && (
          <ServiceTiles
            more="Learn more"
            items={data.cards.map((c) => ({ title: oneLine(c.title), description: c.description, fit: c.fit || undefined, problems: lines(c.problems), outcomes: lines(c.outcomes), href: c.href || undefined }))}
          />
        )
      )}
      {data.buttonLabel && data.buttonHref && (
        <div className="ma-actions">
          <Button href={data.buttonHref} block>
            {data.buttonLabel}
          </Button>
        </div>
      )}
    </Section>
  );
};

/** the build process: a timeline (a number on a thin rail), one stage open at a time */
export const WebProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-wd-pl is-steps" data-exclusive>
      {data.items.map((x, i) => (
        <li key={i} className="mp-wd-pl-i ma-rvx" style={d(i * 60)}>
          <details>
            <summary>
              <span className="mp-wd-pl-n">{i + 1}</span>
              <span className="mp-wd-pl-t">{oneLine(x.title)}</span>
              <span className="mp-wd-pl-x" aria-hidden="true" />
            </summary>
            <div className="mp-wd-pl-b">
              <p>{x.text}</p>
              {lines(x.points).length > 0 && <Points items={lines(x.points)} />}
            </div>
          </details>
        </li>
      ))}
    </ol>
  </Section>
);

/** which row a technology belongs to (found from its name, so a new one from the admin panel lands in the right row; the first row that fits wins) */
const KIND: { label: string; test: RegExp }[] = [
  { label: "Mobile", test: /flutter|react native|kotlin|swift|ionic|xamarin|android|ios/i },
  { label: "Front end", test: /html|css|javascript|typescript|react|vue|angular|next|svelte|tailwind|bootstrap|jquery/i },
  { label: "APIs", test: /api|graphql|rest\b/i },
  { label: "Back end", test: /node|express|laravel|django|php|python|ruby|rails|java\b|spring|\.net|asp|golang|nest|flask/i },
  { label: "Databases", test: /sql|mongo|postgres|redis|firebase|sqlite|oracle|dynamo|maria|supabase/i },
  { label: "Cloud", test: /aws|google cloud|azure|docker|ci\/cd|git\b|vercel|netlify/i },
  { label: "Design", test: /figma|xd\b|zeplin|sketch|illustrator|photoshop|invision/i },
];

/** the technologies like the rows of the Settings app: the kind as a small label, the names as quiet capsules under it */
export const WebTags: MobileSection<"tags"> = ({ data, id }) => {
  const all = lines(data.items);
  const groups = new Map<string, string[]>();
  for (const t of all) {
    const k = KIND.find((x) => x.test.test(t))?.label ?? "More";
    groups.set(k, [...(groups.get(k) ?? []), t]);
  }
  const order = [...KIND.map((k) => k.label), "More"];
  const rows = order.filter((l) => groups.has(l)).map((l) => ({ label: groups.size === 1 && l === "More" ? "" : l, items: groups.get(l) as string[] }));
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      <dl className="mp-wd-tg">
        {rows.map((r, i) => (
          <div key={r.label || "all"} className="mp-wd-tg-r ma-rvx" style={d(i * 60)}>
            {r.label && <dt>{r.label}</dt>}
            <dd>
              {r.items.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
};

/** industries: the iOS picker wheel */
export const WebIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <IndustryWheel items={data.items.map((x) => ({ name: oneLine(x.name), description: x.description }))} />
  </Section>
);

/** why We3vision: an open list, a small tint tick and the point in regular weight */
export const WebAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-wd-pt">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={d(i * 50)}>
          <span className="mp-wd-pt-k" aria-hidden="true" />
          <span className="mp-wd-pt-t">
            {x.title}
            {/* the explanation stays in the page for search engines and screen readers, it is just not shown */}
            <span className="ma-sr">{x.description}</span>
          </span>
        </li>
      ))}
    </ul>
  </Section>
);

/** the FAQ: an open list, the question regular 17, a + that turns into −, the answer 16 under it */
export const WebFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-wd-pl is-q" data-exclusive>
      {data.items.map((x, i) => (
        <li key={i} className="mp-wd-pl-i ma-rvx" style={d(i * 40)}>
          <details>
            <summary>
              <span className="mp-wd-pl-t">{x.question}</span>
              <span className="mp-wd-pl-x" aria-hidden="true" />
            </summary>
            <div className="mp-wd-pl-b">
              <p>{x.answer}</p>
            </div>
          </details>
        </li>
      ))}
    </ul>
  </Section>
);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?\d[\d\s().-]{6,}$/;

/** contact: a note you write and fold into a paper plane (paper.tsx); the phone, e-mail and offices open below it as open lists */
export const WebContact: MobileSection<"contact"> = ({ data, site }) => (
  <Section id="contact" chip={data.chip} title={data.heading} intro={data.text}>
    <PaperForm label={data.buttonLabel || undefined} />
    {site.contactCards.length > 0 && (
      <details className="mp-wd-ct">
        <summary>
          <span>Phone, e-mail and offices</span>
          <IcChevron />
        </summary>
        <div className="mp-wd-ct-b">
          {site.contactCards.map((card, i) => (
            <div key={i} className="mp-wd-ct-g">
              {card.title && <p className="mp-wd-ct-h">{card.title}</p>}
              <ul>
                {lines(card.lines).map((l, n) => {
                  const href = EMAIL.test(l) ? "mailto:" + l : PHONE.test(l) ? "tel:" + l.replace(/[^\d+]/g, "") : undefined;
                  return <li key={n}>{href ? <a href={href}>{l}</a> : <span>{l}</span>}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
      </details>
    )}
  </Section>
);
