import { MetaverseAsk } from "@/components/site/home2/home2-metaverse-ask";
import { SmartLink } from "@/components/site/smart-link";
import "@/styles/home-metaverse.css";

// THE METAVERSE SERVICE SECTION OF THE HOME PAGE (owner, 2026-11-12), in the style of the Toolfolio reference: a black stage, a big calm heading, one line of text, a
// glowing one-line bar to ask PANDA (components/site/home2/home2-metaverse-ask.tsx) with streaks of light to both sides, and four glass cards under it about what
// we build. No 3D objects. It says that We3vision BUILDS this for clients (a service). Words: only what the Metaverse page already says
// (content/metaverse-extra.ts), no numbers. Styles: styles/home-metaverse.css ("hbm-").

const WORK = [
  { t: "VR headsets", d: "Fully immersive worlds that people step into: training simulations, virtual showrooms and site walkthroughs." },
  { t: "Phone and tablet AR", d: "AR on the phones people already own: product previews in their own space, try-ons and interactive guides." },
  { t: "Browser and WebXR", d: "AR and VR that open from a link or a QR code, with nothing to install." },
  { t: "Mixed reality", d: "Spatial experiences with digital objects in the room: product demos, 3D visualisation and shared design reviews." },
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
            {WORK.map((w) => (
              <li key={w.t}>
                <h3>{w.t}</h3>
                <p>{w.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
