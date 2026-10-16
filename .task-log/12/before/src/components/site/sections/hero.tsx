import { HeroScene } from "../hero-scene";
import type { SectionComponent } from "./shared";

// The hero has no visible headline on purpose. It is a pinned scene: a glowing ball with a character inside; scrolling
// breaks it into particles that stream across the screen while glass service cards appear on the same screen.
// The page heading stays in the HTML (hidden on screen) so Google and screen readers still get it.
export const Hero: SectionComponent<"hero"> = ({ data }) => (
  <>
    <h1 className="sr-only">{data.title}</h1>
    <p className="sr-only">{[data.above, data.mark, data.below].filter(Boolean).join(" ")}</p>
    <HeroScene mark={data.mark} above={data.above} below={data.below} cards={data.cards} />
  </>
);
