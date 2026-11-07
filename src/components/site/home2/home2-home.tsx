import type { CSSProperties } from "react";
import { Home2Fx } from "@/components/site/home2/home2-fx";
import { Home2Footer } from "@/components/site/home2/home2-chrome";
import { Home2More } from "@/components/site/home2/home2-more";
import { Home2Services } from "@/components/site/home2/home2-services";
import { SmartLink } from "@/components/site/smart-link";
import { getProjects } from "@/lib/projects";
import "@/styles/home-2.css";

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

// how many real projects (Admin > Projects) belong to each service, and the newest title: each project counts once, by the words of its category
const KINDS: [string, RegExp][] = [
  ["crm", /crm/i],
  ["meta", /metaverse|\b3d\b|\bvr\b|\bar\b|\bxr\b|virtual/i],
  ["ai", /\bai\b|\bml\b|machine|chatbot|artificial/i],
  ["brand", /brand|logo|identity|graphic|packag/i],
  ["soft", /software|\berp\b|saas/i],
  ["app", /\bapps?\b|mobile|android|\bios\b/i],
  ["web", /web|site|commerce|shop|wordpress/i],
];
async function serviceStats() {
  const out: Record<string, { n: number; latest: string }> = {};
  try {
    for (const pr of await getProjects()) {
      const k = KINDS.find(([, re]) => re.test(`${pr.category} ${pr.title}`))?.[0];
      if (!k) continue;
      const o = (out[k] ??= { n: 0, latest: "" });
      o.n += 1;
      o.latest = pr.title;
    }
  } catch {
    // no database: the cards simply show no numbers
  }
  return out;
}

// The home page "/" (design by the owner, 2026-11-07): a dark glowing arch, a lit disc, hairline grids, services, process, industries, tools and a contact form.
// Laptop / desktop only (phones are sent to /m by the proxy). The words are ours (the old home page content); the font is the site font (Poppins).
export async function Home2Home() {
  const stats = await serviceStats();
  return (
    <div className="hb2">
      <Home2Fx />

      {/* ---------------------------------------------------------------- the first screen */}
      <div className="hb2-fly" data-pause-off>
        <span id="hb2-about" className="hb2-anchor" aria-hidden />
        <div className="hb2-pin">
        <section className="hb2-hero" aria-label="We3vision">
        <div className="hb2-world">
        <div className="hb2-stars" aria-hidden />


        {/* the glowing door */}
        <div className="hb2-arch" aria-hidden>
          <span className="hb2-arch-halo" style={{ "--z": -300 } as CSSProperties} />
          <span className="hb2-arch-o3" style={{ "--z": -150 } as CSSProperties} />
          <span className="hb2-arch-o2" style={{ "--z": -90 } as CSSProperties} />
          <span className="hb2-arch-o1" style={{ "--z": -40 } as CSSProperties} />
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
        </div>

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
          <div className="hb2-disc-world">
          <span className="hb2-disc-glow" />
          {Array.from({ length: 14 }, (_, k) => (
            <i key={k} style={{ "--k": k } as CSSProperties} />
          ))}
          <span className="hb2-disc-top" />
          </div>
        </div>
      </section>
          <div className="hb2-flood" aria-hidden />
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

      <Home2Services stats={stats} />
      <Home2More />
      <Home2Footer />
    </div>
  );
}
