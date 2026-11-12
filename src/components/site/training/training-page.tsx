import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { SmartLink } from "@/components/site/smart-link";
import { ISO, PROGRAM, PROGRAMS, SDLC, type Months } from "@/lib/industrial-training";
import type { Course } from "@/lib/training-shared";
import { SHARE_IMAGE } from "@/lib/share-image";
import { siteBase } from "@/lib/seo-ping";
import "@/styles/training.css";

// THE INDUSTRIAL TRAINING PAGES (owner, 2026-11-12): /industrial-training/3-month, /6-month and /9-month. One page design, the words of each page come from
// lib/industrial-training.ts (what is learned month by month, the domains, the fees). Fee-based training: the trainee pays a fee and learns what the industry needs.
// Styles: styles/training.css ("tr-"). Phones get this same page (it is responsive).

export function trainingMetadata(months: Months): Metadata {
  const p = PROGRAM[months];
  return {
    title: p.seoTitle,
    description: p.seoDescription,
    alternates: { canonical: p.path },
    openGraph: { type: "website", url: p.path, title: p.seoTitle, description: p.seoDescription, images: [SHARE_IMAGE] },
  };
}

const WAYS = [
  { t: "You pay a fee", x: "This is a fee-based training, not a paid internship. The fee depends on the domain and on the length you choose." },
  { t: "You learn what the industry needs", x: "In return you learn the skills, tools and ways of working that companies look for in new people." },
  { t: "You work like a real team", x: "You work with our team on real-time project work, with proper practice, reviews and records." },
];

const STEPS = [
  { t: "Choose a domain and a length", x: "Pick the domain you like and 3, 6 or 9 months." },
  { t: "Ask for the fee", x: "Write to us. We share the fee for that domain and length, and answer your questions." },
  { t: "Start learning", x: "We confirm your batch and you begin with your mentor." },
];

export function TrainingPage({ months, courses }: { months: Months; courses: Course[] }) {
  const p = PROGRAM[months];
  const base = siteBase();
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
          { "@type": "ListItem", position: 2, name: "Industrial Training" },
          { "@type": "ListItem", position: 3, name: p.title, item: `${base}${p.path}` },
        ],
      },
      { "@type": "Course", name: p.title, description: p.seoDescription, url: `${base}${p.path}`, provider: { "@type": "Organization", name: "We3vision Private Limited", url: base || undefined } },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "<") }} />
      <div className="tr">
        {/* ---- the top */}
        <section className="tr-hero">
          <div className="tr-wrap">
            <p className="tr-chip">Industrial training</p>
            <h1>{p.h1}</h1>
            <p className="tr-lede">{p.lede}</p>
            <ul className="tr-pick" aria-label="Choose the length">
              {PROGRAMS.map((o) => (
                <li key={o.months}>
                  <SmartLink href={o.path} aria-current={o.months === months ? "page" : undefined}>
                    {o.months} months
                  </SmartLink>
                </li>
              ))}
            </ul>
            <div className="tr-cta">
              <SmartLink href="/contact" className="tr-btn">
                Apply for this training
              </SmartLink>
              <a href="#fees" className="tr-link">
                See domains and fees <span aria-hidden>&darr;</span>
              </a>
            </div>
          </div>
        </section>

        {/* ---- how it works */}
        <section className="tr-sec" aria-labelledby="tr-how">
          <div className="tr-wrap">
            <p className="tr-label">How it works</p>
            <h2 id="tr-how">A training that is paid for, and worth it</h2>
            <ul className="tr-cards tr-c3">
              {WAYS.map((w, i) => (
                <li key={w.t}>
                  <span className="tr-no">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{w.t}</h3>
                  <p>{w.x}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- what is learned, month by month */}
        <section className="tr-sec" aria-labelledby="tr-learn">
          <div className="tr-wrap">
            <p className="tr-label">What you learn</p>
            <h2 id="tr-learn">
              {months} months, <em>month by month</em>
            </h2>
            <p className="tr-sub">{p.fit}</p>
            <ol className="tr-plan">
              {p.plan.map((s) => (
                <li key={s.m}>
                  <span className="tr-m">{s.m}</span>
                  <h3>{s.t}</h3>
                  <p>{s.x}</p>
                </li>
              ))}
            </ol>
            <h3 className="tr-h3">You finish with</h3>
            <ul className="tr-tick">
              {p.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- real-time project work and the SDLC */}
        <section className="tr-sec" aria-labelledby="tr-sdlc">
          <div className="tr-wrap">
            <p className="tr-label">Real-time project work</p>
            <h2 id="tr-sdlc">
              Learn the <em>SDLC</em> on real projects
            </h2>
            <p className="tr-sub">
              The software development life cycle (SDLC) is the process every good software team follows. {months === 3 ? "You see it and practise it on your mini project." : "You practise every stage on real project work, with the proper practice a job needs."}
            </p>
            <ol className="tr-steps">
              {SDLC.map((s, i) => (
                <li key={s.t} style={{ "--i": i } as CSSProperties}>
                  <span>{i + 1}</span>
                  <h3>{s.t}</h3>
                  <p>{s.x}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- ISO 9001 based practice */}
        <section className="tr-sec" aria-labelledby="tr-iso">
          <div className="tr-wrap">
            <p className="tr-label">Quality</p>
            <h2 id="tr-iso">
              Quality practice based on <em>ISO 9001</em>
            </h2>
            <p className="tr-sub">ISO 9001 is the international standard for quality management. You learn how software is developed when quality is managed this way.</p>
            <ul className="tr-cards tr-c5">
              {ISO.map((s) => (
                <li key={s.t}>
                  <h3>{s.t}</h3>
                  <p>{s.x}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- industry contacts */}
        <section className="tr-sec" aria-labelledby="tr-net">
          <div className="tr-wrap">
            <div className="tr-band">
              <div>
                <p className="tr-label">Industry contacts</p>
                <h2 id="tr-net">
                  Meet the people who <em>hire</em>
                </h2>
              </div>
              <p>
                Working on real projects, you get to know the people in the industry. {months === 3 ? "You learn what companies look for in new people." : "Toward the end of the training you are introduced to industry contacts, so that your first step into a career is easier."}
              </p>
            </div>
          </div>
        </section>

        {/* ---- the domains and the fees */}
        <section className="tr-sec" id="fees" aria-labelledby="tr-fee">
          <div className="tr-wrap">
            <p className="tr-label">Domains and fees</p>
            <h2 id="tr-fee">
              Choose your <em>domain</em>
            </h2>
            <p className="tr-sub">Every domain has its own fee, and the fee is different for 3, 6 and 9 months. The fees below are for the {months} month training.</p>
            <ul className="tr-dom">
              {courses.filter((d) => d.show).map((d) => {
                const fee = d.fees[`m${months}` as keyof Course["fees"]];
                return (
                  <li key={d.id}>
                    <div>
                      <span className="tr-area">{d.area}</span>
                      <h3>{d.name}</h3>
                      <p>{d.learn}</p>
                    </div>
                    <div className="tr-fee">
                      <span>{months} month fee</span>
                      {fee ? <b>{fee}</b> : <b className="tr-ask">Contact us for the fee</b>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ---- which length */}
        <section className="tr-sec" aria-labelledby="tr-cmp">
          <div className="tr-wrap">
            <p className="tr-label">Which length</p>
            <h2 id="tr-cmp">
              3, 6 or <em>9 months?</em>
            </h2>
            <ul className="tr-cards tr-c3">
              {PROGRAMS.map((o) => (
                <li key={o.months} className={o.months === months ? "tr-on" : undefined}>
                  <span className="tr-no">{o.months} months</span>
                  <h3>{o.title}</h3>
                  <p>{o.fit}</p>
                  {o.months === months ? <span className="tr-here">You are here</span> : <SmartLink href={o.path} className="tr-link">See this training &rarr;</SmartLink>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- how to join */}
        <section className="tr-sec tr-last" aria-labelledby="tr-join">
          <div className="tr-wrap">
            <p className="tr-label">How to join</p>
            <h2 id="tr-join">
              Three steps to <em>start</em>
            </h2>
            <ol className="tr-join">
              {STEPS.map((s, i) => (
                <li key={s.t}>
                  <span>{i + 1}</span>
                  <h3>{s.t}</h3>
                  <p>{s.x}</p>
                </li>
              ))}
            </ol>
            <SmartLink href="/contact" className="tr-btn">
              Ask for the fee
            </SmartLink>
          </div>
        </section>
      </div>
    </>
  );
}
