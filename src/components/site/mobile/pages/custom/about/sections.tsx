import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Section } from "../../../app";
import { Lines, Rich, lines, oneLine } from "../../../app/text";
import { Pando, StoryPlayer } from "./client";

// /about in iOS 27: the story as a story player with Pando (client.tsx), Pando's words as Messages bubbles, services as an open list of
// app icons, the roadmap as a hairline rail, the facts as an open bento and the leaders as Contacts favourites. Same CMS words as the
// laptop page; styles in (m)/m/about/page.css ("mp-about-").

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

/** "Our Story": a story player (tap / swipe / arrows), then Pando says hello in Messages bubbles */
export const AboutChapters: MobileSection<"aboutChapters"> = ({ data, id }) => {
  const tips = lines(data.meet.tips);
  return (
    <>
      <Section id={id} chip={data.chip} title={data.heading}>
        <StoryPlayer label={oneLine(data.heading) || "Story"} chapters={data.chapters.map((c) => ({ title: oneLine(c.title), text: c.text }))} />
      </Section>
      {(data.meet.heading || tips.length > 0) && (
        <Section chip={data.meet.chip} title={data.meet.heading}>
          <div className="mp-about-chat">
            <div className="mp-about-who">
              <Pando size="sm" />
              <span>Pando</span>
            </div>
            {data.meet.text && (
              <p className="mp-about-note">
                <Rich text={data.meet.text} />
              </p>
            )}
            {tips.length > 0 && (
              <ul className="mp-about-bubbles">
                {tips.map((t, i) => (
                  <li key={i} className="ma-rvx" style={{ "--rv-d": `${80 * i}ms` } as CSSProperties}>
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>
      )}
    </>
  );
};

/** "Services We Offer": an open list of app icons with hairlines; each row opens its service app */
export const AboutServices: MobileSection<"services"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-about-apps">
      {data.cards.map((c, i) => {
        const body = (
          <>
            <span className="mp-about-ic" style={{ "--k": i } as CSSProperties} aria-hidden="true">
              {oneLine(c.title).charAt(0)}
            </span>
            <span className="mp-about-app-b">
              <span className="mp-about-app-t">
                <Lines text={c.title} />
              </span>
              {c.description && <span className="mp-about-app-s">{c.description}</span>}
            </span>
            {c.href && (
              <svg className="mp-about-chev" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </>
        );
        return (
          <li key={i}>
            {c.href ? (
              <AppLink href={c.href} className="mp-about-app">
                {body}
              </AppLink>
            ) : (
              <div className="mp-about-app">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  </Section>
);

/** "Our Journey": the people who started it, the years on a hairline rail, then the goal on one glass card */
export const AboutTimeline: MobileSection<"timeline"> = ({ data, id }) => {
  const names = lines(data.names);
  const teams = lines(data.teams);
  const people = [...names.map((n) => ({ n, d: "" })), ...(data.partnerName ? [{ n: data.partnerName, d: data.partnerYear }] : [])];
  return (
    <Section id={id} chip={data.chip} title={data.heading}>
      {people.length > 0 && (
        <ul className="mp-about-people" aria-label="People">
          {people.map((p, i) => (
            <li key={i}>
              <span className="mp-about-av mp-about-av-lg" aria-hidden="true">
                {initials(p.n)}
              </span>
              <span className="mp-about-pn-t">{p.n}</span>
              {p.d && <span className="mp-about-pn-s">{p.d}</span>}
            </li>
          ))}
        </ul>
      )}
      <ol className="mp-about-rail">
        {data.items.map((x, i) => (
          <li key={i} className="ma-rvx" style={{ "--rv-d": `${50 * i}ms` } as CSSProperties}>
            <span className="mp-about-year">{x.year}</span>
            <p>{x.text}</p>
          </li>
        ))}
      </ol>
      {data.finalYear && (
        <div className="mp-about-goal">
          <span className="mp-about-goal-y">{data.finalYear}</span>
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
      )}
    </Section>
  );
};

/** "Why Choose We3vision": an open bento at a glance, hairlines instead of boxes */
export const AboutAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-about-facts">
      {data.items.map((x, i) => (
        <li key={i} className="mp-about-fact ma-rvx" style={{ "--rv-d": `${60 * i}ms` } as CSSProperties}>
          <span className="mp-about-tick" aria-hidden="true" />
          <h3>{x.title}</h3>
          <p>{x.description}</p>
        </li>
      ))}
    </ul>
  </Section>
);

/** "Our Leaders": round avatars like the favourites row of Contacts, no boxes */
export const AboutLeaders: MobileSection<"team"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading}>
    <ul className="mp-about-leaders">
      {data.members.map((m, i) => (
        <li key={i}>
          <span className="mp-about-av mp-about-av-xl" aria-hidden="true">
            {initials(m.name)}
          </span>
          <span className="mp-about-pn-t">{m.name}</span>
          <span className="mp-about-pn-s">{m.role}</span>
        </li>
      ))}
    </ul>
  </Section>
);
