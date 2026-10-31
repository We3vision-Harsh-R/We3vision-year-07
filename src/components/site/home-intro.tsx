import "@/styles/home-intro.css";
import type { CSSProperties } from "react";
import Image from "next/image";
import { SmartLink } from "./smart-link";

type Badge = { label: string; image: string };

// THE FIRST SCREEN OF THE HOME PAGE, redesigned 2026-10-31 after two references of the owner (a dark page with a big calm heading on the left and
// glowing rounded rings on the right with ONE pill button inside them; and a panel of glass number tiles that run sideways and count up):
//   hero   the heading (CMS), one sentence about the company, the rings and ONE button "Start a project" (right side)
//   under the sentence the two recognitions (Startup India, MSME) as glass pills; the At a glance panel was removed (owner, 2026-10-31)
// Styles: src/styles/home-intro.css ("hx-" hero, "hg-" glance). Same content as before: nothing invented.

const RINGS = 7;

export function HomeIntro({
  title,
  above,
  mark,
  below,
  badges,
}: {
  title: string;
  above: string;
  mark: string;
  below: string;
  badges: Badge[];
}) {
  // the heading: the last three words are shown softer
  const words = title.trim().split(/\s+/);
  const cut = words.length > 4 ? words.length - 3 : words.length;
  const lead = words.slice(0, cut).join(" ");
  const tail = words.slice(cut).join(" ");
  // the sentence under the heading: about the company, from the page "About us"
  const logos = badges.filter((b) => b.image);
  const text =
    "Since 2019 we have been at the forefront of digital innovation, delivering cutting-edge solutions that empower businesses and individuals alike.";

  return (
    <section className="hx" aria-labelledby="hx-title">
      <div className="hx-panel">
        <div className="hx-orbit" aria-hidden>
          <i className="hx-halo" />
          {Array.from({ length: RINGS }, (_, k) => (
            <i
              key={k}
              className="hx-ring"
              style={{ "--k": k } as CSSProperties}
            />
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
          {logos.length > 0 && (
            <div className="hx-rec">
              <p>Recognised by</p>
              <ul>
                {logos.map((b) => (
                  <li key={b.image} title={b.label}>
                    <Image
                      src={b.image}
                      alt={b.label}
                      width={300}
                      height={110}
                      unoptimized
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
