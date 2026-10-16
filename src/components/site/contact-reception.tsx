"use client";

import "@/styles/contact.css";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReceptionAvatar } from "./reception-avatar";
import { Chip } from "./ui";

// The first screen of the Contact page: a receptionist at the reception desk of the office. She welcomes the visitor ("two minutes of your
// time?"), asks what they would like to know about We3vision and offers five answers (services, work, their problem, joining the team,
// working together). The choice gets a short answer and one button that goes to the right place.
// The receptionist is a layered 2D character (reception-avatar.tsx) in a room of layers (wall, windows, lights, plants, counter, plants in
// front) that move by different amounts with the pointer, so the room has depth. She looks at the pointer, blinks, speaks (the mouth moves
// while a line is said), waves when she says hello and when she is clicked, and nods when a choice is made.
// The look is in globals.css (.rc-*, .ra-*).

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
  const rootRef = useRef<HTMLElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState(true);
  const [picked, setPicked] = useState<Choice | null>(null);
  const [offer, setOffer] = useState(false);
  const [talking, setTalking] = useState(false);
  const [waveKey, setWaveKey] = useState(0);
  const [nodKey, setNodKey] = useState(0);
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((x) => window.clearTimeout(x));
  }, []);

  // her mouth moves for as long as it takes to say a line
  const speak = useCallback(
    (line: string) => {
      setTalking(true);
      later(() => setTalking(false), Math.min(2800, 500 + line.length * 38));
    },
    [later],
  );

  // she says hello (and waves), then asks what the visitor would like to know
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduce ? 0 : 1;
    later(() => {
      setLines([{ who: "her", text: HELLO }]);
      setWaveKey((n) => n + 1);
      speak(HELLO);
      setTyping(true);
    }, 800 * k);
    later(() => {
      setLines([
        { who: "her", text: HELLO },
        { who: "her", text: ASK },
      ]);
      setTyping(false);
      speak(ASK);
      setOffer(true);
    }, 2900 * k);
  }, [later, speak]);

  // the room and the character follow the pointer: -1..1 over the whole first screen (one write per frame)
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      root.style.setProperty("--px", px.toFixed(3));
      root.style.setProperty("--py", py.toFixed(3));
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = root.getBoundingClientRect();
      px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      if (!raf) raf = requestAnimationFrame(apply);
    };
    root.addEventListener("pointermove", move);
    return () => {
      root.removeEventListener("pointermove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const choose = (c: Choice) => {
    setOffer(false);
    setPicked(null);
    setLines((l) => [...l, { who: "you", text: c.label }]);
    setNodKey((n) => n + 1);
    setTyping(true);
    later(() => {
      setLines((l) => [...l, { who: "her", text: c.say }]);
      setTyping(false);
      setPicked(c);
      speak(c.say);
    }, 900);
  };

  const again = () => {
    const say = "Of course. What else would you like to know?";
    setPicked(null);
    setLines((l) => [...l, { who: "her", text: say }]);
    speak(say);
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

  // the last three lines stay visible: older ones fade
  const shown = lines.slice(-3);

  return (
    <section id="top" className="rc" ref={rootRef}>
      <div className="rc-scene" aria-hidden>
        {/* the room: every layer moves by a different amount with the pointer */}
        <div className="rc-l rc-wall" />
        <div className="rc-l rc-windows">
          <i />
          <i />
          <i />
        </div>
        <div className="rc-l rc-sign">WE3VISION</div>
        <div className="rc-l rc-lights">
          <i />
          <i />
          <i />
        </div>
        <div className="rc-l rc-shelf rc-shelf-l">
          <b />
          <b />
          <b />
          <u />
        </div>
        <div className="rc-l rc-shelf rc-shelf-r">
          <b />
          <b />
          <b />
          <u />
        </div>
        <div className="rc-l rc-glow" />
        <div className="rc-l rc-avatar">
          <button type="button" className="rc-avatar-hit" tabIndex={-1} onClick={() => setWaveKey((n) => n + 1)} aria-label="Say hello to the receptionist">
            <ReceptionAvatar talking={talking} waveKey={waveKey} nodKey={nodKey} />
          </button>
        </div>
        <div className="rc-l rc-counter">
          <span className="rc-logo">WE3VISION</span>
          <span className="rc-plate">Reception</span>
          <i className="rc-bell" />
          <i className="rc-pot" />
          <i className="rc-lamp" />
        </div>
        <div className="rc-l rc-fore rc-fore-l" />
        <div className="rc-l rc-fore rc-fore-r" />
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
                {l.who === "her" && (
                  <span className="rc-face" aria-hidden>
                    <ReceptionAvatar mini />
                  </span>
                )}
                <p>{l.text}</p>
              </div>
            ))}
            {typing && (
              <div className="rc-line" data-who="her">
                <span className="rc-face" aria-hidden>
                  <ReceptionAvatar mini />
                </span>
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
