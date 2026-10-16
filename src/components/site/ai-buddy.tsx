"use client";

import "@/styles/ai.css";



import { useEffect, useRef, useState } from "react";

// "Ask the robot buddy" (the guide section of the AI page): a small chat window with a robot that shows what an AI agent can do. The visitor picks a
// topic (customers, sales, operations, insights, getting started) and one of its questions; the robot "types" for a moment (three dots), writes the answer
// letter by letter and shows an example of the result. The robot's eyes follow the pointer while the section is on the screen. Only a few cells
// change; nothing is loaded. The look is in globals.css (.bud-*).

type QA = { q: string; a: string; ex: string };

const GROUPS: { name: string; items: QA[] }[] = [
  {
    name: "Customers",
    items: [
      { q: "Can it answer my customers all day?", a: "Yes. It answers the usual questions on your website, WhatsApp and e-mail at any hour, in the customer's language, and hands the tricky ones to your team.", ex: "\"Where is my order?\" answered in 3 seconds, at 2 a.m." },
      { q: "Can it handle complaints and returns?", a: "It understands what went wrong, replies politely, opens the ticket and tells the right person, so nothing gets lost.", ex: "Complaint read, ticket opened, your team told" },
      { q: "Can it talk in my customers' language?", a: "It can chat in English, Hindi, Gujarati and many other languages and keep the same friendly tone in all of them.", ex: "One agent, the same answer in 3 languages" },
    ],
  },
  {
    name: "Sales",
    items: [
      { q: "Can it sort and score my leads?", a: "It reads every enquiry, scores how serious it is and sends the best ones to your sales team first.", ex: "New enquiry scored 86 / 100 and sent to sales" },
      { q: "Can it follow up for me?", a: "It sends the first reply in seconds and follows up with people who have not answered, until they book a call or say no.", ex: "3 follow-ups sent, 1 call booked, 0 forgotten" },
      { q: "Can it book meetings?", a: "It looks at your calendar, suggests times, books the meeting and sends the reminders.", ex: "Meeting booked for Tuesday 11:00, invite sent" },
    ],
  },
  {
    name: "Operations",
    items: [
      { q: "Can it read invoices and documents?", a: "It reads PDFs, invoices and forms, takes out the important fields and fills them into your system.", ex: "Invoice read, 12 fields filled in your system" },
      { q: "Can it update my CRM and sheets?", a: "Every call, e-mail or order can update your CRM, your sheets and your database by itself, without anyone typing.", ex: "Customer record updated after the call" },
      { q: "Can it watch for problems?", a: "It watches orders, payments and logs and warns you about unusual things before they become a problem.", ex: "Unusual payment spotted and flagged to you" },
    ],
  },
  {
    name: "Insights",
    items: [
      { q: "Can it write my reports?", a: "It pulls the numbers from your tools and writes the weekly report in plain words, ready to send.", ex: "Weekly sales report written and e-mailed" },
      { q: "Can it predict demand?", a: "It learns from your past orders and tells you what is likely to sell next month, so you stock the right things.", ex: "Next month: product A +24%, product C -8%" },
      { q: "Can it answer questions about my data?", a: "You ask in normal words, like \"which city bought the most last week?\", and it answers from your own data.", ex: "Answer found in your data in 2 seconds" },
    ],
  },
  {
    name: "Getting started",
    items: [
      { q: "How long does a bot take?", a: "Simple bots can be done in 2–3 weeks. Complex models take 1–3 months.", ex: "Week 1 plan, week 2 build, week 3 live" },
      { q: "Can it use my data?", a: "Yes. It can connect to your website, CRM, documents and databases.", ex: "Connected: website, CRM, documents, database" },
      { q: "Is my data safe?", a: "Your data is used only for your own agent. We decide together what it may see, so it only gets what it needs.", ex: "Access set per tool, you stay in control" },
    ],
  },
];

type Msg = { role: "bot" | "user"; text: string; ex?: string };

export function AiBuddy({ greeting }: { greeting: string }) {
  const hello = greeting || "Hi! I am your AI agent. Pick a topic and a question, and I will show you what I can do.";
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: hello }]);
  const [typing, setTyping] = useState(false);
  const [asked, setAsked] = useState<string[]>([]);
  const [group, setGroup] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  // the eyes of the robot follow the pointer (only while the section is on the screen)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let visible = false;
    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      const eye = el.querySelector<HTMLElement>(".bud-face");
      if (!eye) return;
      const r = eye.getBoundingClientRect();
      const dx = Math.max(-1, Math.min(1, (px - (r.left + r.width / 2)) / 420));
      const dy = Math.max(-1, Math.min(1, (py - (r.top + r.height / 2)) / 300));
      el.style.setProperty("--ex", `${(dx * 7).toFixed(2)}px`);
      el.style.setProperty("--ey", `${(dy * 5).toFixed(2)}px`);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (visible && !raf) raf = requestAnimationFrame(apply);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const ask = (item: QA) => {
    if (typing) return;
    setAsked((x) => (x.includes(item.q) ? x : [...x, item.q]));
    setMsgs((m) => [...m, { role: "user", text: item.q }]);
    setTyping(true);
    later(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: "bot", text: "" }]);
      let k = 0;
      const step = () => {
        k = Math.min(item.a.length, k + 3);
        const done = k >= item.a.length;
        setMsgs((m) => {
          const c = [...m];
          c[c.length - 1] = { role: "bot", text: item.a.slice(0, k), ex: done ? item.ex : undefined };
          return c;
        });
        if (!done) later(step, 24);
      };
      later(step, 40);
    }, 1000);
  };

  const reset = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setTyping(false);
    setAsked([]);
    setMsgs([{ role: "bot", text: hello }]);
  };

  return (
    <div ref={rootRef} className="bud">
      <div className="bud-side">
        <div className="bud-robot" aria-hidden>
          <i className="bud-ant" />
          <div className="bud-head">
            <div className="bud-face">
              <span className="bud-eye">
                <b />
              </span>
              <span className="bud-eye">
                <b />
              </span>
            </div>
            <i className="bud-mouth" data-talk={typing} />
          </div>
          <div className="bud-body">
            <i />
          </div>
          <span className="bud-glow" />
        </div>
        <p className="bud-name">
          <b>Robot buddy</b>
          <span>
            <i aria-hidden /> Online
          </span>
        </p>
      </div>

      <div className="bud-chat">
        <div ref={bodyRef} className="bud-thread" aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className="bud-turn" data-role={m.role}>
              <p className="bud-msg" data-role={m.role}>
                {m.text || " "}
              </p>
              {m.ex && (
                <p className="bud-ex">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  <span>
                    <b>Example result</b>
                    {m.ex}
                  </span>
                </p>
              )}
            </div>
          ))}
          {typing && (
            <p className="bud-msg bud-typing" data-role="bot" aria-label="Typing">
              <i />
              <i />
              <i />
            </p>
          )}
        </div>
        <div className="bud-ask">
          <p>What can an AI agent do? Pick a topic and a question.</p>
          <div className="bud-tabs" role="tablist">
            {GROUPS.map((g, gi) => (
              <button key={g.name} type="button" role="tab" aria-selected={group === gi} className="bud-tab" onClick={() => setGroup(gi)}>
                {g.name}
              </button>
            ))}
          </div>
          <div className="bud-qs">
            {GROUPS[group].items.map((it) => (
              <button key={it.q} type="button" className="bud-q" data-done={asked.includes(it.q)} disabled={typing} onClick={() => ask(it)}>
                {it.q}
              </button>
            ))}
            {asked.length > 0 && (
              <button type="button" className="bud-reset" onClick={reset}>
                Start again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
