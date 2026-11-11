import type { CSSProperties } from "react";
import { SmartLink } from "@/components/site/smart-link";
import "@/styles/home-brand.css";

// THE BRAND DESIGN SECTION OF THE HOME PAGE (owner, 2026-11-11: a separate section on the home page, so people know that We3vision gives brand design
// and what solution they get). Every sentence is from the Brand Identity page (lib/cms/content/brand.ts), nothing is invented, no numbers.
// Left: what it is and who it is for. Right: a small brand board drawn in CSS (logo mark, colours, type, a card). Under it: the four things you get,
// and three common problems with the answer for each. Styles: styles/home-brand.css ("hbd-").

const GET = [
  { t: "Brand strategy", x: "Your business goals, audience and brand direction, defined before any design starts." },
  { t: "Logo design", x: "A logo, colours and typography that reflect your business and speak to your audience." },
  { t: "Visual identity & guidelines", x: "One consistent visual system, with brand guidelines your team and partners can follow." },
  { t: "Marketing collateral", x: "Brand assets and creative materials for graphic design, website design and advertising." },
];

const SOLVE = [
  { q: "You have a logo, but the brand looks different everywhere", a: "One consistent look across every platform: logo, colours and typography working as one visual system." },
  { q: "You are not sure where to start", a: "We begin with your goals and your audience, and let them guide the design direction." },
  { q: "Your team and partners design in their own way", a: "Brand guidelines and brand assets that everyone can follow, from the first post to the full brand kit." },
];

export function Home2Brand() {
  return (
    <section className="hbd" id="brand-design" aria-labelledby="hbd-title">
      <div className="hb2-wrap">
        <p className="hb2-label">Brand design</p>
        <div className="hbd-top">
          <div className="hbd-copy" data-r>
            <h2 id="hbd-title">
              Brand design that makes people <em>remember you</em>
            </h2>
            <p className="hbd-lede">
              Your brand is more than a logo. We3vision builds a clear and consistent visual identity for your business, from the first idea to the logo, the colours, the guidelines and the creative materials you use every day.
            </p>
            <ul className="hbd-for" aria-label="Who it is for">
              <li>Launching a new business</li>
              <li>Redesigning an existing brand</li>
              <li>Teams that need one consistent look</li>
            </ul>
            <div className="hbd-cta">
              <SmartLink href="/contact" className="hb2-m-btn">
                Start your brand project
              </SmartLink>
              <SmartLink href="/brand-identity" className="hbd-more">
                See brand design <span aria-hidden>&rarr;</span>
              </SmartLink>
            </div>
          </div>

          {/* a small brand board, drawn in CSS */}
          <div className="hbd-board" aria-hidden data-r style={{ "--d": "120ms" } as CSSProperties}>
            <div className="hbd-b-logo">
              <i />
              <b />
            </div>
            <div className="hbd-b-type">
              <span>Aa</span>
              <small>Typography</small>
            </div>
            <div className="hbd-b-sw">
              {[0, 1, 2, 3, 4].map((k) => (
                <i key={k} style={{ "--k": k } as CSSProperties} />
              ))}
            </div>
            <div className="hbd-b-card">
              <i />
              <span />
              <span />
              <span />
            </div>
            <div className="hbd-b-guide">
              <span />
              <span />
              <span />
              <small>Guidelines</small>
            </div>
          </div>
        </div>

        <h3 className="hbd-h3" data-r>
          What you get
        </h3>
        <ul className="hbd-get">
          {GET.map((g, i) => (
            <li key={g.t} data-r style={{ "--d": `${i * 80}ms` } as CSSProperties}>
              <span className="hbd-no">{String(i + 1).padStart(2, "0")}</span>
              <h4>{g.t}</h4>
              <p>{g.x}</p>
            </li>
          ))}
        </ul>

        <h3 className="hbd-h3" data-r>
          The problem, and the solution
        </h3>
        <ul className="hbd-solve">
          {SOLVE.map((s, i) => (
            <li key={s.q} data-r style={{ "--d": `${i * 90}ms` } as CSSProperties}>
              <p className="hbd-q">{s.q}</p>
              <p className="hbd-a">{s.a}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
