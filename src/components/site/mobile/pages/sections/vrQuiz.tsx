import type { MobileSection } from "../types";
import { Accordion, Card, Points, Section } from "../../app";
import { lines } from "../../app/text";

// The "which reality fits you" quiz is interactive on the laptop: here its questions with their answers, and the possible results.
export const VrQuizSection: MobileSection<"vrQuiz"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <Accordion items={data.questions.map((q) => ({ title: q.question, body: <Points items={lines(q.options)} /> }))} />
    <div className="ma-stack ma-gap ma-grid2">
      {data.results.map((r, i) => (
        <Card key={i}>
          <p className="ma-kicker">{r.code}</p>
          <h3>{r.title}</h3>
          {r.text && <p>{r.text}</p>}
          {r.project && <p className="ma-cap">{r.project}</p>}
        </Card>
      ))}
    </div>
  </Section>
);
