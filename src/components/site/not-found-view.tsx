import Image from "next/image";
import { GlimmerArt, type GlimmerName } from "@/components/site/glimmer-art";
import { GTA_ON } from "@/lib/gta"; // the GTA theme master switch ("mission failed" for a missing page)
import "@/styles/not-found.css";
import "@/styles/gta-device.css";
import "@/styles/gta-404.css";

// The branded "lost" screen (CSS prefix nf-): used for an unknown address, a missing article / job / project and a crashed page.
// Plain <a> links on purpose (hence the eslint-disable lines): it must also work inside global-not-found, which renders without the site layout/router.
// GTA theme (task 156, gta-404.css; laptop and desktop only since task 162): the real 404 (code "404") is a "Mission failed" screen with a respawn bar on screens
// of 1024 px and more; phones and tablets keep the original screen (both are in the page, the CSS shows one of them). The crash page keeps its own look.
const LINKS: [string, string][] = [
  ["Web Development", "/webdev"],
  ["App Development", "/mobile"],
  ["AI Development", "/ai"],
  ["Portfolio", "/portfolio"],
  ["Blog", "/blog"],
  ["Careers", "/careers"],
];

export function NotFoundView({
  code = "404",
  chip = "Page not found",
  title = "This page took a wrong turn.",
  text = "The link may be old or mistyped. Pick where you want to go next.",
  art = "moon",
  children,
}: {
  code?: string;
  chip?: string;
  title?: string;
  text?: string;
  art?: GlimmerName;
  children?: React.ReactNode;
}) {
  const mission = GTA_ON && code === "404";
  const plain = (
    <>
      <GlimmerArt art={art} size={220} className="nf-art" />
      <p className="nf-code" aria-hidden>
        {code}
      </p>
      <p className="nf-chip">{chip}</p>
      <h1 className="nf-title">{title}</h1>
      <p className="nf-text">{text}</p>
    </>
  );
  return (
    <section className={mission ? "nf-root gt-nf" : "nf-root"}>
      <div className="nf-box">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="nf-logo" aria-label="We3vision home">
          <Image src="/brand/logo-white.webp" alt="" width={600} height={468} priority unoptimized />
        </a>
        {mission ? (
          <>
            <div className="nf-v-g">
              <div className="gt-nf-band">
                <h1 className="gt-nf-fail">Mission failed</h1>
              </div>
              <p className="gt-nf-resp">
                <i aria-hidden />
                Respawning… <b>{code}</b> {chip}
              </p>
              <span className="gt-nf-bar" aria-hidden>
                <i />
              </span>
              <p className="gt-nf-line">{title}</p>
              <p className="nf-text">{text}</p>
            </div>
            <div className="nf-v-p">{plain}</div>
          </>
        ) : (
          plain
        )}
        <div className="nf-actions">
          {children}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="nf-btn nf-btn-main">
            {mission ? (
              <>
                <span className="gt-dk">Respawn at home</span>
                <span className="gt-pk">Back to home</span>
              </>
            ) : (
              "Back to home"
            )}
          </a>
          <a href="/contact" className="nf-btn nf-btn-ghost">
            Contact us
          </a>
        </div>
        <ul className="nf-links">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
