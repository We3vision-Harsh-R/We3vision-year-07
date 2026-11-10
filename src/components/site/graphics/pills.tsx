import { SmartLink } from "../smart-link";
import "@/styles/gfx-pills.css";

// "Creative / Ideas / Make this": the pill-shaped word board of the owner's reference (2026-11-10).
// Pure CSS (sizes in container width, so it scales on laptop and phone). Tool names come from the page data.

export function Pills({ tools }: { tools: string[] }) {
  const logos = tools.slice(0, 4);
  return (
    <section className="gpl gfx-sec gfx-sec-wide" aria-label="Creative studio">
      <div className="gpl-stage">
        <i className="gpl-dot" style={{ left: "3%", top: "40%" }} aria-hidden />
        <i className="gpl-dot gpl-dot-b" style={{ left: "8%", top: "54%" }} aria-hidden />
        <i className="gpl-dot gpl-dot-c" style={{ left: "26%", top: "66%" }} aria-hidden />
        <i className="gpl-dot gpl-dot-b" style={{ left: "96%", top: "70%" }} aria-hidden />

        <div className="gpl-row gpl-r1">
          <span className="gpl-band" />
          <b className="gpl-w gpl-white">Creative</b>
          <span className="gpl-chip" aria-hidden><svg viewBox="0 0 24 24"><path d="M3 20 L13 10 M11 4 l9 0 l0 9 M14 7 l3 3" /></svg></span>
          <span className="gpl-orb" aria-hidden />
        </div>

        <div className="gpl-row gpl-r2">
          <span className="gpl-band" />
          <b className="gpl-w gpl-blue">Ideas</b>
          <span className="gpl-knob" aria-hidden><i /></span>
          <span className="gpl-bubble">
            <i aria-hidden />
            <b>Problem</b>
            <small>Solution</small>
          </span>
        </div>

        <div className="gpl-row gpl-r3">
          <span className="gpl-band" />
          <span className="gpl-gear" aria-hidden><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" /></svg></span>
          <b className="gpl-w gpl-white">Make this</b>
        </div>

        <div className="gpl-row gpl-r4">
          <span className="gpl-band" />
          <span className="gpl-face" aria-hidden />
          <span className="gpl-ring" aria-hidden />
          <span className="gpl-back" aria-hidden><svg viewBox="0 0 24 24"><path d="M20 12H5M11 6l-6 6 6 6" /></svg></span>
        </div>
      </div>

      <ul className="gpl-logos">
        {logos.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      <div className="gpl-foot">
        <p className="gpl-circle" aria-hidden>
          <svg viewBox="0 0 200 200">
            <defs><path id="gplc" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" /></defs>
            <text><textPath href="#gplc">Graphic work as and when you need it · Web &amp; Print ·</textPath></text>
            <path className="gpl-arrow" d="M60 100 H140 M122 84 L140 100 L122 116" />
          </svg>
        </p>
        <div className="gpl-talk">
          <span className="gpl-swatch" aria-hidden />
          <p>We design logos, social posts, print and packaging, so your brand looks sharp everywhere people see it.</p>
          <SmartLink href="#contact" className="gpl-btn">Let&apos;s talk</SmartLink>
        </div>
      </div>
    </section>
  );
}
