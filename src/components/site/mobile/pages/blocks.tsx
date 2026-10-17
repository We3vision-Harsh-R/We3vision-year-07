import type { ReactNode } from "react";
import { Accordion, Button, Card, Carousel, GroupedList, Hero, ListRow, Points, Section } from "../app";
import { Lines, Rich, lines, oneLine } from "../app/text";

// Building blocks the section files share, so that each section type is a few lines: it only says WHICH words go into WHICH kit component.

type Head = { id?: string; chip?: string; heading?: string; intro?: string };

/** cards, one under the other (two columns on a tablet) */
export function CardList({ id, chip, heading, intro, items, tone }: Head & { items: { title?: string; text?: string; points?: string[]; foot?: ReactNode; href?: string }[]; tone?: "tint" }) {
  return (
    <Section id={id} chip={chip} title={heading} intro={intro}>
      <Carousel label={heading ? oneLine(heading) : undefined}>
        {items.map((it, i) => (
          <Card key={i} tone={tone} href={it.href} className="ma-fill">
            {it.title && <h3><Lines text={it.title} /></h3>}
            {it.text && <p>{it.text}</p>}
            {it.points && it.points.length > 0 && <Points items={it.points} />}
            {it.foot}
          </Card>
        ))}
      </Carousel>
    </Section>
  );
}

/** one grouped list: a title and a text in every row */
export function RowList({ id, chip, heading, intro, items }: Head & { items: { title: string; text?: string; href?: string; icon?: ReactNode; detail?: string }[] }) {
  return (
    <Section id={id} chip={chip} title={heading} intro={intro}>
      {items.some((it) => it.href) ? (
        <GroupedList>
          {items.map((it, i) => (
            <ListRow key={i} title={oneLine(it.title)} text={it.text} href={it.href} icon={it.icon} detail={it.detail} />
          ))}
        </GroupedList>
      ) : (
        <Accordion items={items.map((it, i) => ({ title: <><span className="ma-an">{i + 1}</span>{oneLine(it.title)}</>, body: <p>{it.text}</p> }))} />
      )}
    </Section>
  );
}

/** numbered steps (or a timeline) */
export function StepList({ id, chip, heading, intro, steps }: Head & { steps: { label?: string; kicker?: string; title?: string; text?: string; points?: string[] }[] }) {
  return (
    <Section id={id} chip={chip} title={heading} intro={intro}>
      <Accordion
        items={steps.map((s, i) => ({
          title: <><span className="ma-an">{s.label ?? i + 1}</span>{s.title ? oneLine(s.title) : s.kicker ?? ""}</>,
          body: <>{s.text && <p>{s.text}</p>}{s.points && s.points.length > 0 && <Points items={s.points} />}</>,
        }))}
      />
    </Section>
  );
}

/** question / answer rows */
export function QaList({ id, chip, heading, intro, items }: Head & { items: { q: string; a: string }[] }) {
  return (
    <Section id={id} chip={chip} title={heading} intro={intro}>
      <Accordion items={items.map((x) => ({ title: x.q, body: <p>{x.a}</p> }))} />
    </Section>
  );
}

/** a hero card (the first card of a page); only the first section of a page owns the h1 */
export function HeroBlock({ index, chip, heading, text, actions, children }: { index: number; chip?: string; heading?: string; text?: string; actions?: { label?: string; href?: string }[]; children?: ReactNode }) {
  const acts = (actions ?? []).flatMap((a) => (a.label && a.href ? [{ label: a.label, href: a.href }] : []));
  return (
    <Hero h1={index === 0} chip={chip} title={heading} text={text} actions={acts}>
      {children}
    </Hero>
  );
}

/** a heading + paragraph card, with an optional list and button (used by "guide", "reach", "sketch" ...) */
export function TextBlock({ id, chip, heading, text, points, button, note }: Head & { text?: string; points?: string[]; button?: { label?: string; href?: string }; note?: string }) {
  return (
    <Section id={id} chip={chip} title={heading}>
      <Card tone="tint">
        {text && <p><Rich text={text} /></p>}
        {points && points.length > 0 && <Points items={points} />}
        {note && <p className="ma-cap">{note}</p>}
        {button?.label && button.href && (
          <div className="ma-actions">
            <Button href={button.href} variant="fill" block>{button.label}</Button>
          </div>
        )}
      </Card>
    </Section>
  );
}

export { lines };
