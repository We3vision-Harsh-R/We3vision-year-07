import type { MobileSection } from "../types";
import { lines } from "../../app/text";
import { IaHero } from "./pageHero";

// The laptop's floating words become a quiet row of capsules under the text (no boxes).
export const WordHeroSection: MobileSection<"wordHero"> = ({ data, index }) => {
  const words = lines(data.words);
  return (
    <IaHero h1={index === 0} heading={data.heading} text={data.text} actions={[{ label: data.primaryLabel, href: data.primaryHref }, { label: data.secondaryLabel, href: data.secondaryHref }]}>
      {words.length > 0 && (
        <ul className="ma-ia-words" aria-label="Topics">
          {words.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      )}
    </IaHero>
  );
};
