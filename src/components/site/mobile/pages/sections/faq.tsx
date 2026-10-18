import type { MobileSection } from "../types";
import { Section } from "../../app";

/** FAQ: always an open list. The question is a regular line with a + that turns into a −; one answer open at a time */
export const FaqSection: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="ma-s27 ma-s27-qa" data-exclusive>
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
