"use client";

import "@/styles/contact.css";
import Link from "next/link";
import { Chip } from "./ui";

// THE FIRST SCREEN OF THE CONTACT PAGE (redesigned 2026-11-06, owner): the receptionist, her chat and the office room are gone. A heading, one
// sentence and five path cards (what the visitor may want: services, work, their problem, joining the team, starting a project); every card is a
// real link and a light follows the pointer over it. The words of the cards are the ones of the old receptionist. The look is in contact.css (cx-).

type Choice = {
  id: string;
  label: string;
  /** one sentence about it */
  say: string;
  /** the line at the bottom of the card */
  cta: string;
  href: string;
};

const CHOICES: Choice[] = [
  {
    id: "services",
    label: "Our services",
    say: "We build websites, mobile apps, AI, VR and metaverse, brand design and CRM. Have a look at everything we do.",
    cta: "See our services",
    href: "/#services",
  },
  {
    id: "work",
    label: "Our work",
    say: "We have made VR projects for the government, brands, websites and apps. Here is some of our work.",
    cta: "See our work",
    href: "/portfolio",
  },
  {
    id: "problem",
    label: "Tell us your problem",
    say: "Tell us what is not working. A few lines are enough, and we will find the way together.",
    cta: "Tell us your problem",
    href: "#contact",
  },
  {
    id: "team",
    label: "Join the team",
    say: "We are always happy to meet new people. See the open roles and say hello.",
    cta: "See open roles",
    href: "/careers",
  },
  {
    id: "collab",
    label: "Start a project",
    say: "Wonderful. Tell us about your project and the team will come back to you soon.",
    cta: "Start a project",
    href: "#contact",
  },
];

const go = (e: React.MouseEvent, href: string) => {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  const el = document.querySelector(href);
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element | number, o?: object) => void } }).__lenis;
  if (el) {
    if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const glow = (e: React.PointerEvent<HTMLElement>) => {
  if (e.pointerType !== "mouse") return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export function ContactReception({
  chip,
  heading,
  text,
  links,
  badges,
}: {
  chip: string;
  heading: string;
  text: string;
  links: { label: string; href: string }[];
  badges?: React.ReactNode;
}) {
  return (
    <section id="top" className="cx">
      <div className="cx-aura" aria-hidden />
      {badges}
      <div className="cx-in">
        {chip && <Chip>{chip}</Chip>}
        <h1 className="cx-h">{heading.replace(/\n/g, " ")}</h1>
        {text && <p className="cx-sub">{text}</p>}
        <p className="cx-ask">What would you like to do?</p>
        <ol className="cx-cards">
          {CHOICES.map((c, i) => (
            <li key={c.id} style={{ "--i": i } as React.CSSProperties}>
              <Link href={c.href} className="cx-card" onClick={(e) => go(e, c.href)} onPointerMove={glow}>
                <span className="cx-n">{String(i + 1).padStart(2, "0")}</span>
                <h2>{c.label}</h2>
                <p>{c.say}</p>
                <span className="cx-go">
                  {c.cta}
                  <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        {links.length > 0 && (
          <p className="cx-links">
            {links.map((l) => (
              <Link key={l.href + l.label} href={l.href} onClick={(e) => go(e, l.href)}>
                {l.label}
              </Link>
            ))}
          </p>
        )}
      </div>
    </section>
  );
}
