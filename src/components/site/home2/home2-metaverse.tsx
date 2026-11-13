import type { CSSProperties } from "react";
import { MetaverseAsk } from "@/components/site/home2/home2-metaverse-ask";
import { SmartLink } from "@/components/site/smart-link";
import "@/styles/home-metaverse.css";

// THE METAVERSE SERVICE SECTION OF THE HOME PAGE (owner, 2026-11-12), in the style of the Toolfolio reference: a black stage, a big calm heading, one line of text, a
// glowing one-line bar to ask PANDA (components/site/home2/home2-metaverse-ask.tsx) with streaks of light to both sides, and four glass cards under it about what
// we build. No 3D objects. It says that We3vision BUILDS this for clients (a service). Words: only what the Metaverse page already says
// (content/metaverse-extra.ts), no numbers. Styles: styles/home-metaverse.css ("hbm-").

const ICON: Record<string, string> = {
  vr: "M3 8h18v8H3zM8 16v2M16 16v2M10 12h4",
  ar: "M7 3h10v18H7zM10 6h4M12 18h.01",
  web: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  mr: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5",
};
// `s` is a short line (condensed from the sentence `d`, nothing new) shown on phones; the full sentence stays for the laptop and screen readers
const WORK = [
  { k: "vr", t: "VR headsets", s: "Immersive worlds to step into", d: "Fully immersive worlds that people step into: training simulations, virtual showrooms and site walkthroughs." },
  { k: "ar", t: "Phone and tablet AR", s: "AR on phones people own", d: "AR on the phones people already own: product previews in their own space, try-ons and interactive guides." },
  { k: "web", t: "Browser and WebXR", s: "Opens from a link or QR code", d: "AR and VR that open from a link or a QR code, with nothing to install." },
  { k: "mr", t: "Mixed reality", s: "Digital objects in the room", d: "Spatial experiences with digital objects in the room: product demos, 3D visualisation and shared design reviews." },
];

export function Home2Metaverse() {
  return (
    <section className="hbm" id="metaverse-service" aria-labelledby="hbm-title">
      <div className="hb2-wrap">
        <div className="hbm-stage" data-r data-pause-off>
          <div className="hbm-head">
            <p className="hbm-top">Metaverse service</p>
            <h2 id="hbm-title">
              Metaverse development
              <br />
              for your business
            </h2>
            <p className="hbm-lede">We design and build 3D worlds, VR and AR experiences for web and headsets. Ask Panda anything about them.</p>
          </div>

          {/* the bar: its edge is lit by a magenta and a blue light that travel round it */}
          <div className="hbm-row">
            <MetaverseAsk />
          </div>

          <div className="hbm-more-row">
            <SmartLink href="/metaverse" className="hbm-btn">
              See our metaverse service <span aria-hidden>→</span>
            </SmartLink>
          </div>

          <p className="hbm-feat">What we build</p>
          <ul className="hbm-list">
            {WORK.map((w, i) => (
              <li key={w.t} data-r style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <span className="hbm-ic" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <path d={ICON[w.k]} />
                  </svg>
                </span>
                <h3>{w.t}</h3>
                <p className="hbm-x">{w.d}</p>
                <p className="hbm-s" aria-hidden>
                  {w.s}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
