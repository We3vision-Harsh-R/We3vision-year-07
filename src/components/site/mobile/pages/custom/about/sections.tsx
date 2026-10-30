import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Section } from "../../../app";
import { TapSheet, TodayCard, Typing, YearPicker } from "../../../../lazy";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine } from "../../../app/text";
import { Pando, StoryPlayer } from "./client";

// /about like Apple's own apps (iOS 27): the story as a story player, Pando in Messages (the bubbles arrive one by one), the services as a
// Settings list whose rows open a sheet, the journey as Photos "Years" (pick or swipe a year) with the goal as an App Store Today card, the
// facts as home-screen widgets (tap for the whole text) and the leaders as Contacts favourites (tap for the card).
// Same CMS words as the laptop page; kit pieces in app/apple.tsx (ma-ap-), page styles in (m)/m/about/page.css (mp-about-).

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

/** "Our Story": a story player, then Pando says hello in Messages */
export const AboutChapters: MobileSection<"aboutChapters"> = ({ data, id }) => {
  const tips = lines(data.meet.tips);
  return (
    <>
      <Section id={id} chip={data.chip} title={data.heading}>
        <StoryPlayer label={oneLine(data.heading) || "Story"} chapters={data.chapters.map((c) => ({ title: oneLine(c.title), text: c.text }))} />
      </Section>
      {(data.meet.heading || tips.length > 0) && (
        <Section chip={data.meet.chip} title={data.meet.heading}>
          {data.meet.text && (
            <p className="mp-about-note">
              <Rich text={data.meet.text} />
            </p>
          )}
          {tips.length > 0 && (
            <Typing
              items={tips}
              who={
                <div className="mp-about-who">
                  <Pando size="sm" />
                  <span>Pando</span>
                </div>
              }
            />
          )}
        </Section>
      )}
    </>
  );
};

/** "Services We Offer": a Settings list (coloured icon, name, one line); a row opens a sheet with the whole text and the service app */
export const AboutServices: MobileSection<"services"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="ma-ap-group">
      {data.cards.map((c, i) => {
        const name = oneLine(c.title);
        return (
          <li key={i} style={{ "--k": i } as CSSProperties}>
            <TapSheet
              triggerClass="ma-ap-row"
              label={name}
              title={name}
              trigger={
                <>
                  <span className="ma-ap-ic" aria-hidden="true">
                    {name.charAt(0)}
                  </span>
                  <span className="ma-ap-rt">
                    <b>{name}</b>
                    {c.description && <small>{c.description}</small>}
                  </span>
                  <IcChevron className="ma-ap-chev" />
                </>
              }
            >
              <div className="ma-ap-hd" style={{ "--k": i } as CSSProperties}>
                <span className="ma-ap-ic" aria-hidden="true">
                  {name.charAt(0)}
                </span>
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
    </ul>
  </Section>
);

/** "Our Journey": the founders as Contacts favourites, the years as Photos "Years", the goal as a Today card that opens full screen */
export const AboutTimeline: MobileSection<"timeline"> = ({ data, id }) => {
  const names = lines(data.names);
  const teams = lines(data.teams);
  const people = [...names.map((n) => ({ n, d: "" })), ...(data.partnerName ? [{ n: data.partnerName, d: data.partnerYear }] : [])];
  return (
    <Section id={id} chip={data.chip} title={data.heading}>
      {people.length > 0 && (
        <ul className="ma-ap-favs mp-about-founders" aria-label="People">
          {people.map((p, i) => (
            <li key={i} className="ma-ap-fav" style={{ "--k": i } as CSSProperties}>
              <span className="ma-ap-av" aria-hidden="true">
                {initials(p.n)}
              </span>
              <b>{p.n}</b>
              {p.d && <small>{p.d}</small>}
            </li>
          ))}
        </ul>
      )}
      {data.items.length > 0 && <YearPicker label={oneLine(data.heading) || "Years"} years={data.items.map((x) => ({ year: x.year, content: <p>{x.text}</p> }))} />}
      {data.finalYear && (
        <div className="mp-about-goalw">
          <TodayCard
            label={data.goalTitle || data.finalYear}
            kicker={data.finalYear}
            title={data.goalTitle || data.finalYear}
            art={
              <span className="ma-ap-glow mp-about-goalart">
                <span className="mp-about-goalyear" aria-hidden="true">
                  {data.finalYear}
                </span>
              </span>
            }
            body={
              <>
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
              </>
            }
          />
        </div>
      )}
    </Section>
  );
};

/** "Why Choose We3vision": home-screen widgets; a tap opens the whole text in a sheet */
export const AboutAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="ma-ap-widgets">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={{ "--k": i, "--rv-d": `${60 * i}ms` } as CSSProperties}>
          <TapSheet
            triggerClass="ma-ap-widget"
            label={x.title}
            title={x.title}
            trigger={
              <>
                <i aria-hidden="true">{String(i + 1)}</i>
                <b>{x.title}</b>
              </>
            }
          >
            <p>{x.description}</p>
          </TapSheet>
        </li>
      ))}
    </ul>
  </Section>
);

/** "Our Leaders": Contacts favourites; a tap opens the contact card */
export const AboutLeaders: MobileSection<"team"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading}>
    <ul className="ma-ap-favs">
      {data.members.map((m, i) => (
        <li key={i} style={{ "--k": i } as CSSProperties}>
          <TapSheet
            triggerClass="ma-ap-fav"
            label={`${m.name}, ${m.role}`}
            title={m.name}
            trigger={
              <>
                <span className="ma-ap-av is-xl" aria-hidden="true">
                  {initials(m.name)}
                </span>
                <b>{m.name}</b>
                <small>{m.role}</small>
              </>
            }
          >
            <div className="ma-ap-contact">
              <span className="ma-ap-av is-xl" aria-hidden="true">
                {initials(m.name)}
              </span>
              <b>{m.name}</b>
              <small>{m.role}</small>
            </div>
          </TapSheet>
        </li>
      ))}
    </ul>
  </Section>
);

