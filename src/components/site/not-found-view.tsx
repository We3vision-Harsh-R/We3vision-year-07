import Image from "next/image";
import "@/styles/not-found.css";

// The branded "lost" screen (CSS prefix nf-): used for an unknown address, a missing article / job / project and a crashed page.
// Plain <a> links on purpose: it must also work inside global-not-found, which renders without the site layout.
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
  children,
}: {
  code?: string;
  chip?: string;
  title?: string;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="nf-root">
      <div className="nf-box">
        <a href="/" className="nf-logo" aria-label="We3vision home">
          <Image src="/brand/logo-white.webp" alt="" width={600} height={468} priority unoptimized />
        </a>
        <p className="nf-code" aria-hidden>
          {code}
        </p>
        <p className="nf-chip">{chip}</p>
        <h1 className="nf-title">{title}</h1>
        <p className="nf-text">{text}</p>
        <div className="nf-actions">
          {children}
          <a href="/" className="nf-btn nf-btn-main">
            Back to home
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
