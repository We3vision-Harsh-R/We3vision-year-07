"use client";

import "@/styles/admin.css";


import Image from "next/image";
import { useActionState, useState } from "react";
import { login, type LoginState } from "@/actions/auth";
import { Background } from "@/components/site/background";
import { ADMIN_DOMAIN } from "@/lib/admin-access";

// The admin login page: a split screen (the idea is the "log in – split quote image" page of Untitled UI, dressed in the colours of the site).
// Left: the form. Right: a rounded picture card with a short line over a frosted strip and two round arrows to step through the lines.
// The look is in globals.css (.al-*).

const SLIDES = [
  { quote: "Websites, AI and metaverse experiences: built, launched and managed from one place.", name: "We3vision Studio", role: "Admin console", note: "Websites · AI · Metaverse" },
  { quote: "Every page, project and article you save here is live on the website within minutes.", name: "Publishing", role: "Pages, projects and blog", note: "One calm place to update the site" },
  { quote: "A small team with big ideas. Keep the site fresh, one clear update at a time.", name: "The We3vision team", role: "Content and design", note: "Made with care in India" },
];

const Arrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
    <path d={dir === "left" ? "M16 10H4m0 0 5-5m-5 5 5 5" : "M4 10h12m0 0-5-5m5 5-5 5"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function LoginScreen({ image, next = "" }: { image: string; next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [show, setShow] = useState(false);
  const [help, setHelp] = useState(false);
  const [n, setN] = useState(0);
  const slide = SLIDES[n];
  const step = (d: number) => setN((cur) => (cur + d + SLIDES.length) % SLIDES.length);

  return (
    <main className="al">
      <Background />
      <section className="al-side">
        <div className="al-form">
          <span className="al-icon">
            <Image src="/brand/logo-mark.webp" alt="We3vision" width={480} height={395} priority />
          </span>
          <h1>Welcome back</h1>
          <p className="al-sub">Sign in to manage the website.</p>

          <form action={action}>
            {next && <input type="hidden" name="next" value={next} />}
            <label className="al-field">
              <span>Email</span>
              <input name="email" type="email" required autoComplete="username" autoFocus placeholder={`name@${ADMIN_DOMAIN}`} />
            </label>
            <label className="al-field">
              <span>Password</span>
              <span className="al-pass">
                <input name="password" type={show ? "text" : "password"} required autoComplete="current-password" placeholder="Enter your password" />
                <button type="button" className="al-eye" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}>
                  <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
                    <path d="M1.7 10s2.7-5.8 8.3-5.8S18.3 10 18.3 10 15.6 15.8 10 15.8 1.7 10 1.7 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                    {show && <path d="M3 17 17 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
                  </svg>
                </button>
              </span>
            </label>

            <div className="al-row">
              <label className="al-check">
                <input type="checkbox" name="remember" />
                <span>Remember for 30 days</span>
              </label>
              <button type="button" className="al-link" onClick={() => setHelp((v) => !v)} aria-expanded={help}>
                Forgot password
              </button>
            </div>
            {help && <p className="al-note">Passwords are reset by the site owner. Please ask them to set a new one for you.</p>}

            {state.error && (
              <p role="alert" className="al-error">
                {state.error}
              </p>
            )}
            <button type="submit" disabled={pending} className="al-submit btn-primary">
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="al-foot">Only @{ADMIN_DOMAIN} accounts can sign in.</p>
        </div>
      </section>

      <aside className="al-art" aria-label="About the admin console">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="al-photo" />
        <div className="al-quote">
          <blockquote key={n}>“{slide.quote}”</blockquote>
          <div className="al-who">
            <div key={`w${n}`}>
              <strong>{slide.name}</strong>
              <span>{slide.role}</span>
              <small>{slide.note}</small>
            </div>
            <div className="al-nav">
              <span className="al-count">
                {n + 1} / {SLIDES.length}
              </span>
              <div>
                <button type="button" onClick={() => step(-1)} aria-label="Previous">
                  <Arrow dir="left" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Next">
                  <Arrow dir="right" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
