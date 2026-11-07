import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Home2Fx } from "@/components/site/home2/home2-fx";
import { SmartLink } from "@/components/site/smart-link";
import "@/styles/home-2.css";

// HOME 2 (owner, 2026-11-07): a second home page in a new design (a dark glowing arch, a lit disc, hairline grids), kept apart from "/" until the owner
// says it is final; then it replaces the main home page. Nothing links to it, it is not in the sitemap and search engines are told to skip it.
// The words are ours (the old site and the home page content); the font is the site font (Poppins). Laptop / desktop only.
export const metadata: Metadata = {
  title: "We3vision | Home 2",
  robots: { index: false, follow: false },
};

// stars of the first screen: fixed numbers (no random on render), x / y in percent, size in px, a slow twinkle delay
const STARS = Array.from({ length: 64 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  const c = Math.sin(i * 39.346) * 9871.123;
  const f = (n: number) => n - Math.floor(n);
  return { x: f(a) * 100, y: f(b) * 62, s: 1 + f(c) * 1.6, d: f(a + b) * 6 };
});

const NAV = [
  { label: "Services", href: "/webdev" },
  { label: "Products", href: "/products" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

const POINTS = [
  { title: "Client-Centric Approach", text: "We put your needs first, ensuring every solution is tailored to your goals." },
  { title: "Scalable Solutions", text: "Our services grow with your business, adapting to new challenges and opportunities." },
  { title: "Creative Thinking", text: "We bring fresh ideas and innovative strategies to every project." },
  { title: "On-Time Delivery", text: "We respect your deadlines and deliver quality work, every time." },
];

// the products of We3vision (content/products.ts): where each card sits in the 3 x 4 grid
const PRODUCTS = [
  { name: "WeBugMate", text: "AI-powered project and task management. Live now.", href: "/products/webugmate", col: 2, row: 1 },
  { name: "WeJobs", text: "A new software product from We3vision. Coming soon.", href: "/products/wejobs", col: 3, row: 2 },
  { name: "WeThink", text: "A new software product from We3vision. Coming soon.", href: "/products/wethink", col: 1, row: 3 },
  { name: "WePresent", text: "A new software product from We3vision. Coming soon.", href: "/products/wepresent", col: 2, row: 4 },
];

export default function Home2Page() {
  return (
    <div className="hb2">
      <Home2Fx />

      {/* ---------------------------------------------------------------- the first screen */}
      <div className="hb2-fly">
        <span id="hb2-about" className="hb2-anchor" aria-hidden />
        <div className="hb2-pin">
          <header className="hb2-bar">
          <nav aria-label="Home 2 left">
            {NAV.slice(0, 3).map((l) => (
              <SmartLink key={l.href} href={l.href}>
                {l.label}
              </SmartLink>
            ))}
          </nav>
          {/* the middle is left free: the logo of the site stays there on every page */}
          <nav aria-label="Home 2 right">
            {NAV.slice(3).map((l) => (
              <SmartLink key={l.href} href={l.href}>
                {l.label}
              </SmartLink>
            ))}
            <SmartLink href="/contact" className="hb2-bar-cta">
              Start a project
            </SmartLink>
          </nav>
        </header>
      <section className="hb2-hero" aria-label="We3vision">
        <div className="hb2-stars" aria-hidden>
          {STARS.map((s, i) => (
            <i key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }} />
          ))}
        </div>


        {/* the glowing door */}
        <div className="hb2-arch" aria-hidden>
          <span className="hb2-arch-halo" />
          <span className="hb2-arch-o3" />
          <span className="hb2-arch-o2" />
          <span className="hb2-arch-o1" />
          <span className="hb2-arch-door" />
        </div>

        {/* the dunes in front of it */}
        <svg className="hb2-dunes" viewBox="0 0 1440 360" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="hb2-d1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="hsl(calc(var(--th) + 0) calc(88% * var(--ts)) 60%)" />
              <stop offset=".18" stopColor="hsl(calc(var(--th) + 358) calc(80% * var(--ts)) 34%)" />
              <stop offset=".6" stopColor="hsl(calc(var(--th) + 352) calc(70% * var(--ts)) 13%)" />
              <stop offset="1" stopColor="hsl(calc(var(--th) + 350) calc(45% * var(--ts)) 4%)" />
            </linearGradient>
            <linearGradient id="hb2-d2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="hsl(calc(var(--th) + 356) calc(70% * var(--ts)) 26%)" />
              <stop offset="1" stopColor="hsl(calc(var(--th) + 350) calc(45% * var(--ts)) 4%)" />
            </linearGradient>
            <filter id="hb2-blur" x="-10%" y="-40%" width="120%" height="180%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>
          <path className="hb2-d-back" d="M0 214 C 160 192 300 226 470 202 C 640 180 780 154 940 128 C 1100 104 1260 84 1440 54 L1440 360 L0 360 Z" fill="url(#hb2-d2)" />
          <path className="hb2-d-glow" d="M0 262 C 200 237 330 274 520 248 C 700 224 820 212 980 182 C 1120 156 1280 132 1440 96" fill="none" stroke="hsl(calc(var(--th) + 0) calc(95% * var(--ts)) 70%)" strokeWidth="18" filter="url(#hb2-blur)" />
          <path className="hb2-d-front" d="M0 262 C 200 237 330 274 520 248 C 700 224 820 212 980 182 C 1120 156 1280 132 1440 96 L1440 360 L0 360 Z" fill="url(#hb2-d1)" />
        </svg>

        <div className="hb2-copy">
          <p className="hb2-kick">We3vision</p>
          <h1>
            <em>Web, AI</em> &amp; Metaverse
            <br />
            studio in Surat, India
          </h1>
        </div>
        <p className="hb2-lede">
          We3vision is a software and digital company in Surat. We build websites, apps, AI solutions, metaverse worlds, UI/UX, CRM and brands for businesses everywhere.
        </p>
        <SmartLink href="#hb2-about" className="hb2-go">
          <em>Explore</em>
        </SmartLink>
      </section>

      {/* ---------------------------------------------------------------- 1: the statement and the lit disc */}
      <section className="hb2-s1" aria-labelledby="hb2-t1">
        <div className="hb2-wrap hb2-s1-top">
          <p className="hb2-label">About</p>
          <h2 id="hb2-t1">
            Good software is not loud.
            <br />
            It is <em>clear</em>, fast and made to last.
          </h2>
        </div>
        <div className="hb2-disc" aria-hidden>
          <span className="hb2-disc-glow" />
          {Array.from({ length: 14 }, (_, k) => (
            <i key={k} style={{ "--k": k } as CSSProperties} />
          ))}
          <span className="hb2-disc-top" />
        </div>
      </section>
        </div>
      </div>

      <section className="hb2-s1b" aria-label="Why We3vision">
        <div className="hb2-wrap">
          <ul className="hb2-points">
            {POINTS.map((p, i) => (
              <li key={p.title} data-r style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 2: the products on a hairline grid */}
      <section className="hb2-s2" aria-labelledby="hb2-t2">
        <div className="hb2-wrap">
          <p className="hb2-label">Products</p>
          <div className="hb2-grid">
            <div className="hb2-head" data-r>
              <h2 id="hb2-t2">
                <em>Our products</em>
                <br />
                built in-house
              </h2>
            </div>
            {PRODUCTS.map((p, i) => (
              <SmartLink
                key={p.name}
                href={p.href}
                className="hb2-card"
                data-r
                style={{ gridColumn: p.col, gridRow: p.row, "--d": `${i * 80}ms` } as CSSProperties}>
                <span className="hb2-card-no">{String(i + 1).padStart(2, "0")}.</span>
                <strong>{p.name}</strong>
                <span className="hb2-card-tx">{p.text}</span>
                <svg viewBox="0 0 24 24" aria-hidden className="hb2-card-ar">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </SmartLink>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
