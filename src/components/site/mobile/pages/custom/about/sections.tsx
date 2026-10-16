import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Card, Section } from "../../../app";
import { Lines, Rich, lines, oneLine } from "../../../app/text";

// /about as a "story" app: chapters you swipe through like stories, Pando talking in chat bubbles, the roadmap as a timeline rail,
// facts as tiles and the leaders as contact avatars. Same CMS words as the laptop page; styles in (m)/m/about/page.css ("mp-about-").

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

/** "Our Story": one swipeable card per chapter (1/5, 2/5 ...), then Pando says hello in chat bubbles */
export const AboutChapters: MobileSection<"aboutChapters"> = ({ data, id }) => {
  const tips = lines(data.meet.tips);
  return (
    <>
      <Section id={id} chip={data.chip} title={data.heading}>
        <ol className="mp-about-stories" aria-label={oneLine(data.heading)}>
          {data.chapters.map((c, i) => (
            <li key={i} className="mp-about-story">
              <span className="mp-about-bars" aria-hidden="true">
                {data.chapters.map((_, n) => (
                  <i key={n} className={n <= i ? "is-on" : undefined} />
                ))}
              </span>
              <span className="mp-about-no">
                {i + 1} / {data.chapters.length}
              </span>
              <h3>{oneLine(c.title)}</h3>
              <p>{c.text}</p>
            </li>
          ))}
        </ol>
      </Section>
      {(data.meet.heading || tips.length > 0) && (
        <Section chip={data.meet.chip} title={data.meet.heading}>
          <Card className="mp-about-chat">
            <div className="mp-about-who">
              <span className="mp-about-av" aria-hidden="true">
                P
              </span>
              <span>Pando</span>
            </div>
            {data.meet.text && (
              <p className="mp-about-note">
                <Rich text={data.meet.text} />
              </p>
            )}
            <ul className="mp-about-bubbles">
              {tips.map((t, i) => (
                <li key={i} style={{ animationDelay: `${0.12 * i}s` }}>
                  {t}
                </li>
              ))}
            </ul>
          </Card>
        </Section>
      )}
    </>
  );
};

/** "Services We Offer": app-icon tiles in a grid, each opens its service app */
export const AboutServices: MobileSection<"services"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-about-apps">
      {data.cards.map((c, i) => {
        const body = (
          <>
            <span className="mp-about-ic" style={{ "--k": i } as CSSProperties} aria-hidden="true">
              {oneLine(c.title).charAt(0)}
            </span>
            <span className="mp-about-app-t">
              <Lines text={c.title} />
            </span>
            {c.description && <span className="mp-about-app-s">{c.description}</span>}
          </>
        );
        return c.href ? (
          <AppLink key={i} href={c.href} className="mp-about-app">
            {body}
          </AppLink>
        ) : (
          <div key={i} className="mp-about-app">
            {body}
          </div>
        );
      })}
    </div>
  </Section>
);

/** "Our Journey": the years on a rail, the people who started it, then the goal */
export const AboutTimeline: MobileSection<"timeline"> = ({ data, id }) => {
  const names = lines(data.names);
  const teams = lines(data.teams);
  const people = [...names.map((n) => ({ n, d: "" })),...(data.partnerName ? [{ n: data.partnerName, d: data.partnerYear }] : [])];
  return (
    <Section id={id} chip={data.chip} title={data.heading}>
      {people.length > 0 && (
        <ul className="mp-about-people" aria-label="People">
          {people.map((p, i) => (
            <li key={i}>
              <span className="mp-about-av mp-about-av-lg" aria-hidden="true">
                {initials(p.n)}
              </span>
              <b>{p.n}</b>
              {p.d && <span>{p.d}</span>}
            </li>
          ))}
        </ul>
      )}
      <ol className="mp-about-rail">
        {data.items.map((x, i) => (
          <li key={i}>
            <span className="mp-about-year">{x.year}</span>
            <p>{x.text}</p>
          </li>
        ))}
        {data.finalYear && (
          <li className="is-goal">
            <span className="mp-about-year">{data.finalYear}</span>
            <div>
              {data.goalTitle && <h3>{data.goalTitle}</h3>}
              {data.goalText && (
                <p>
                  <Rich text={data.goalText} />
                </p>
              )}
              {teams.length > 0 && (
                <ul className="mp-about-teams">
                  {teams.map((t, n) => (
                    <li key={n}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        )}
      </ol>
    </Section>
  );
};

/** "Why Choose We3vision": four fact tiles */
export const AboutAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-about-facts">
      {data.items.map((x, i) => (
        <div key={i} className="mp-about-fact">
          <span className="mp-about-tick" aria-hidden="true" />
          <h3>{x.title}</h3>
          <p>{x.description}</p>
        </div>
      ))}
    </div>
  </Section>
);

/** "Our Leaders": round avatars like the favourites row of Contacts */
export const AboutLeaders: MobileSection<"team"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading}>
    <ul className="mp-about-leaders">
      {data.members.map((m, i) => (
        <li key={i}>
          <span className="mp-about-av mp-about-av-xl" aria-hidden="true">
            {initials(m.name)}
          </span>
          <b>{m.name}</b>
          <span>{m.role}</span>
        </li>
      ))}
    </ul>
  </Section>
);
