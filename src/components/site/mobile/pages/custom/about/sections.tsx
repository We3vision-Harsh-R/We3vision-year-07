import type { MobileSection } from "../../types";
import { AppLink, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Rich, lines, oneLine } from "../../../app/text";
import { Pando } from "./pando";

// /about in the theme of the home page (app/home-theme.css): every piece of information of the page stays on the screen, one under the other, in the same
// cards, headings and spacing as the other pages: the story as numbered chapters, the lines of Pando, the services as a list of links, the founders, the
// journey as a rail of years with the goal card, the reasons to choose us, and the leaders as a grid. Same CMS words as the laptop page; styles:
// (m)/m/about/page.css (abh-).

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
const num = (i: number) => String(i + 1).padStart(2, "0");

/** "Our Story": the chapters one under the other, then Pando says hello */
export const AboutChapters: MobileSection<"aboutChapters"> = ({ data, id }) => {
  const tips = lines(data.meet.tips);
  return (
    <>
      <Section id={id} chip={data.chip} title={data.heading}>
        <ol className="abh-chapters">
          {data.chapters.map((c, i) => (
            <li key={i}>
              <span className="abh-no" aria-hidden="true">
                {num(i)}
              </span>
              <h3>{oneLine(c.title)}</h3>
              <p>{c.text}</p>
            </li>
          ))}
        </ol>
      </Section>
      {(data.meet.heading || tips.length > 0) && (
        <Section chip={data.meet.chip} title={data.meet.heading}>
          <div className="abh-meet">
            <Pando />
            {data.meet.text && (
              <p className="abh-meet-t">
                <Rich text={data.meet.text} />
              </p>
            )}
            {tips.length > 0 && (
              <ul className="abh-tips">
                {tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        </Section>
      )}
    </>
  );
};

/** "Services We Offer": every service with its words and its link */
export const AboutServices: MobileSection<"services"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="abh-services">
      {data.cards.map((c, i) => {
        const name = oneLine(c.title);
        const body = (
          <>
            <span className="abh-ic" aria-hidden="true">
              {name.charAt(0)}
            </span>
            <span className="abh-sv-t">
              <b>{name}</b>
              {c.description && <small>{c.description}</small>}
            </span>
            {c.href && <IcChevron className="abh-chev" />}
          </>
        );
        return (
          <li key={i}>
            {c.href ? (
              <AppLink href={c.href} className="abh-sv">
                {body}
              </AppLink>
            ) : (
              <div className="abh-sv">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  </Section>
);

/** "Our Journey": the founders, the years as a rail, the goal and its teams */
export const AboutTimeline: MobileSection<"timeline"> = ({ data, id }) => {
  const names = lines(data.names);
  const teams = lines(data.teams);
  const people = [...names.map((n) => ({ n, d: "" })), ...(data.partnerName ? [{ n: data.partnerName, d: data.partnerYear }] : [])];
  return (
    <Section id={id} chip={data.chip} title={data.heading}>
      {people.length > 0 && (
        <ul className="abh-people" aria-label="People">
          {people.map((p, i) => (
            <li key={i}>
              <span className="abh-av" aria-hidden="true">
                {initials(p.n)}
              </span>
              <b>{p.n}</b>
              {p.d && <small>{p.d}</small>}
            </li>
          ))}
        </ul>
      )}
      {data.items.length > 0 && (
        <ol className="abh-rail">
          {data.items.map((x, i) => (
            <li key={i}>
              <span className="abh-year">{x.year}</span>
              <p>{x.text}</p>
            </li>
          ))}
        </ol>
      )}
      {data.finalYear && (
        <div className="abh-goal">
          <span className="abh-goal-y">{data.finalYear}</span>
          {data.goalTitle && <h3>{data.goalTitle}</h3>}
          {data.goalText && (
            <p>
              <Rich text={data.goalText} />
            </p>
          )}
          {teams.length > 0 && (
            <ul className="abh-teams">
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

/** "Why Choose We3vision": numbered cards with the whole text */
export const AboutAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="abh-why">
      {data.items.map((x, i) => (
        <li key={i}>
          <span className="abh-no" aria-hidden="true">
            {num(i)}
          </span>
          <h3>{x.title}</h3>
          <p>{x.description}</p>
        </li>
      ))}
    </ul>
  </Section>
);

/** "Our Leaders": a grid of people */
export const AboutLeaders: MobileSection<"team"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading}>
    <ul className="abh-leaders">
      {data.members.map((m, i) => (
        <li key={i}>
          <span className="abh-av is-lg" aria-hidden="true">
            {initials(m.name)}
          </span>
          <b>{m.name}</b>
          <small>{m.role}</small>
        </li>
      ))}
    </ul>
  </Section>
);
