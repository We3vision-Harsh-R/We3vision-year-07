import "@/styles/home-intro.css";
import type { CSSProperties } from "react";
import { HomeGlance } from "./home-glance";
import { SmartLink } from "./smart-link";

type Badge = { label: string; image: string };
type Fact = { value: string; label: string };

// THE FIRST SCREEN OF THE HOME PAGE, redesigned 2026-10-31 after two references of the owner (a dark page with a big calm heading on the left and
// glowing rounded rings on the right with ONE pill button inside them; and a panel of glass number tiles that run sideways and count up):
//   hero   the heading (CMS), one sentence about the company, the rings and ONE button "Start a project" (right side)
//   glance the facts of "At a glance" as animated glass tiles (home-glance.tsx), with the recognitions (Startup India, MSME)
// Styles: src/styles/home-intro.css ("hx-" hero, "hg-" glance). Same content as before: nothing invented.

const RINGS = 7;

export function HomeIntro({
  title,
  above,
  mark,
  below,
  chip,
  facts,
  badges,
}: {
  title: string;
  above: string;
  mark: string;
  below: string;
  chip: string;
  facts: Fact[];
  badges: Badge[];
}) {
  // the heading: the last three words are shown softer
  const words = title.trim().split(/\s+/);
  const cut = words.length > 4 ? words.length - 3 : words.length;
  const lead = words.slice(0, cut).join(" ");
  const tail = words.slice(cut).join(" ");
  // the sentence under the heading: about the company, from the page "About us"
  const text = "Since 2019 we have been at the forefront of digital innovation, delivering cutting-edge solutions that empower businesses and individuals alike.";

  return (
    <>
      <section className="hx" aria-labelledby="hx-title">
        <div className="hx-panel">
          <div className="hx-orbit" aria-hidden>
            <i className="hx-halo" />
            {Array.from({ length: RINGS }, (_, k) => (
              <i key={k} className="hx-ring" style={{ "--k": k } as CSSProperties} />
            ))}
          </div>
          <SmartLink href="/contact" className="hx-go">
            Start a project
          </SmartLink>

          <div className="hx-head">
            {above && mark && (
              <p className="hx-tag">
                {above} {mark} {below}
              </p>
            )}
            <h1 id="hx-title" className="hx-title">
              {lead}
              {tail && <span> {tail}</span>}
            </h1>
            <p className="hx-text">{text}</p>
          </div>
        </div>
      </section>

      {facts.length > 0 && <HomeGlance chip={chip} facts={facts} badges={badges} />}
    </>
  );
}
