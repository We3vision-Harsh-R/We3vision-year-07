"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Chip } from "./ui";

// The first screen of the Contact page: a receptionist at the reception desk of the office. She welcomes the visitor ("two minutes of your
// time?"), asks what they would like to know about We3vision and offers five answers (services, work, their problem, joining the team,
// working together). The choice gets a short answer and one button that goes to the right place. The picture is a real photograph (2D, not a
// cartoon) whose edges are blurred into the page; the counter in front of her is drawn in CSS. The look is in globals.css (.rc-*).
// (Photo: Unsplash, free licence. Cropped from photo-1576092783872-50eaba4d62bf.)

type Choice = {
  id: string;
  label: string;
  /** what the receptionist says about it */
  say: string;
  /** the button that goes on */
  cta: string;
  href: string;
};

const CHOICES: Choice[] = [
  {
    id: "services",
    label: "Know about your services",
    say: "We build websites, mobile apps, AI, VR and metaverse, brand design and CRM. Have a look at everything we do.",
    cta: "See our services",
    href: "/#services",
  },
  {
    id: "work",
    label: "See your work",
    say: "We have made VR projects for the government, brands, websites and apps. Here is some of our work.",
    cta: "See our work",
    href: "/portfolio",
  },
  {
    id: "problem",
    label: "Tell you my problem",
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
    label: "Work together on a project",
    say: "Wonderful. Tell us about your project and the team will come back to you soon.",
    cta: "Start a project",
    href: "#contact",
  },
];

type Line = { who: "her" | "you"; text: string };

const HELLO = "Hello, and welcome to We3vision! Do you have two minutes? Let's have a quick chat.";
const ASK = "What would you like to know about We3vision?";

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
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState(true);
  const [picked, setPicked] = useState<Choice | null>(null);
  const [offer, setOffer] = useState(false);
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((x) => window.clearTimeout(x));
  }, []);

  // she says hello, then asks what the visitor would like to know
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduce ? 0 : 1;
    later(() => {
      setLines([{ who: "her", text: HELLO }]);
      setTyping(true);
    }, 700 * k);
    later(() => {
      setLines([
        { who: "her", text: HELLO },
        { who: "her", text: ASK },
      ]);
      setTyping(false);
      setOffer(true);
    }, 2300 * k);
  }, [later]);

  const choose = (c: Choice) => {
    setOffer(false);
    setPicked(null);
    setLines((l) => [...l, { who: "you", text: c.label }]);
    setTyping(true);
    later(() => {
      setLines((l) => [...l, { who: "her", text: c.say }]);
      setTyping(false);
      setPicked(c);
    }, 900);
  };

  const again = () => {
    setPicked(null);
    setLines((l) => [...l, { who: "her", text: "Of course. What else would you like to know?" }]);
    setOffer(true);
  };

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

  // the last two lines stay visible: older ones fade
  const shown = lines.slice(-3);

  return (
    <section id="top" className="rc">
      <div className="rc-scene" aria-hidden>
        <div className="rc-back" />
        <div className="rc-lights">
          <i />
          <i />
          <i />
        </div>
        <i className="rc-plant rc-plant-l" />
        <i className="rc-plant rc-plant-r" />
        <div className="rc-glow" />
        <div className="rc-photo" />
        <div className="rc-counter">
          <span className="rc-logo">WE3VISION</span>
          <i className="rc-bell" />
          <i className="rc-pot" />
        </div>
      </div>

      {badges}

      <div className="rc-top">
        {chip && (
          <div className="animate-rise" style={{ animationDelay: "100ms" }}>
            <Chip>{chip}</Chip>
          </div>
        )}
        <h1 className="rc-h animate-rise" style={{ animationDelay: "220ms" }}>
          {heading.replace(/\n/g, " ")}
        </h1>
        {text && (
          <p className="rc-sub animate-rise" style={{ animationDelay: "340ms" }}>
            {text}
          </p>
        )}

        <div className="rc-chat" role="region" aria-label="Reception" aria-live="polite">
          <div className="rc-lines">
            {shown.map((l, i) => (
              <div key={lines.length - shown.length + i} className="rc-line" data-who={l.who} data-old={i < shown.length - 2 ? "true" : "false"}>
                {l.who === "her" && <span className="rc-face" aria-hidden />}
                <p>{l.text}</p>
              </div>
            ))}
            {typing && (
              <div className="rc-line" data-who="her">
                <span className="rc-face" aria-hidden />
                <p className="rc-dots" aria-label="typing">
                  <i />
                  <i />
                  <i />
                </p>
              </div>
            )}
          </div>

          {offer && (
            <div className="rc-opts" role="group" aria-label="What would you like to know?">
              {CHOICES.map((c, i) => (
                <button key={c.id} type="button" className="rc-opt" style={{ animationDelay: `${i * 70}ms` }} onClick={() => choose(c)}>
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {picked && (
            <div className="rc-opts rc-act">
              <Link href={picked.href} className="rc-go" onClick={(e) => go(e, picked.href)}>
                {picked.cta} <span aria-hidden>→</span>
              </Link>
              <button type="button" className="rc-opt rc-again" onClick={again}>
                Ask something else
              </button>
            </div>
          )}
        </div>

        {links.length > 0 && (
          <p className="rc-links">
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
