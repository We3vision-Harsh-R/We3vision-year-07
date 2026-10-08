import type { GovProject } from "@/lib/cms/content/gov-projects";
import { GlowEdge } from "../glow-edge";

// The ground outside the metaverse office (see vr-floor.tsx): a courtyard where two government projects stand, one on the left and one on
// the right, each with the name of the department in big letters, a little top-view picture of the work and the facts of the project.
// Rutvi walks out of the office and stands by them one after the other; vr-floor.tsx uncovers the facts when she gets there (the children
// of .vfo-more come in one by one). Everything is plain markup: the look is in globals.css (.vfo-out, .vfo-pad ...).

const lines = (t: string) => t.split("\n").map((l) => l.trim()).filter(Boolean);

/** NRIDA: a road in the making, seen from above: finished part, the part that is dug, survey stakes and a roller that goes along it */
function RoadArt() {
  return (
    <svg viewBox="0 0 320 110" preserveAspectRatio="xMidYMid slice" className="vfo-art-svg" aria-hidden>
      <rect width="320" height="110" className="ga-ground" />
      <path d="M0 22q60 -14 120 0t120 -4t80 6V0H0z" className="ga-hill" />
      <path d="M0 96q70 -12 140 2t180 -6V110H0z" className="ga-hill" />
      <rect x="0" y="38" width="320" height="38" className="ga-road" />
      <rect x="0" y="38" width="118" height="38" className="ga-road-done" />
      <path d="M0 40.5H118M0 73.5H118" className="ga-edge" />
      <rect x="150" y="38" width="64" height="38" className="ga-dug" />
      <path d="M156 44l12 12M170 44l12 12M184 44l12 12M198 44l12 12M156 58l12 12M170 58l12 12M184 58l12 12M198 58l12 12" className="ga-hatch" />
      <path d="M0 57H320" className="ga-dash" />
      {[238, 262, 286, 310].map((x, i) => (
        <g key={x} className="ga-stake" style={{ animationDelay: `${i * 0.35}s` }}>
          <path d={`M${x} 30V38`} className="ga-pole" />
          <circle cx={x} cy="28" r="3.2" className="ga-flag" />
          <circle cx={x} cy="86" r="3.2" className="ga-flag" />
          <path d={`M${x} 78V83`} className="ga-pole" />
        </g>
      ))}
      <g className="ga-roller">
        <rect x="10" y="46" width="30" height="22" rx="5" className="ga-machine" />
        <rect x="40" y="45" width="9" height="24" rx="3" className="ga-drum" />
        <rect x="16" y="52" width="12" height="10" rx="2" className="ga-cab" />
      </g>
      <g className="ga-arm">
        <rect x="176" y="22" width="22" height="14" rx="3" className="ga-machine" />
        <path d="M187 36l0 14" className="ga-boom" />
        <circle cx="187" cy="52" r="3.4" className="ga-bucket" />
      </g>
    </svg>
  );
}

/** MOC: an open-cast coal mine, seen from above: terraces, a drill that blasts, a rail with a wagon that goes to the load point */
function MineArt() {
  return (
    <svg viewBox="0 0 320 110" preserveAspectRatio="xMidYMid slice" className="vfo-art-svg" aria-hidden>
      <rect width="320" height="110" className="ga-ground" />
      <rect x="22" y="10" width="170" height="90" rx="34" className="ga-pit ga-pit-0" />
      <rect x="38" y="20" width="138" height="70" rx="28" className="ga-pit ga-pit-1" />
      <rect x="54" y="30" width="106" height="50" rx="22" className="ga-pit ga-pit-2" />
      <rect x="72" y="40" width="70" height="30" rx="14" className="ga-pit ga-pit-3" />
      <circle cx="107" cy="55" r="7" className="ga-coal" />
      <g className="ga-blast">
        <circle cx="64" cy="42" r="4" className="ga-ring" />
        <circle cx="64" cy="42" r="4" className="ga-ring ga-ring-b" />
      </g>
      <g className="ga-drill">
        <circle cx="150" cy="70" r="4.4" className="ga-flag" />
        <path d="M150 62v16M142 70h16" className="ga-boom" />
      </g>
      <path d="M192 55H320" className="ga-rail" />
      <path d="M192 55H320" className="ga-tie" />
      <g className="ga-wagon">
        <rect x="196" y="47" width="30" height="16" rx="3" className="ga-machine" />
        <rect x="229" y="47" width="30" height="16" rx="3" className="ga-machine" />
        <rect x="199" y="50" width="24" height="10" rx="2" className="ga-coal" />
        <rect x="232" y="50" width="24" height="10" rx="2" className="ga-coal" />
      </g>
      <rect x="282" y="36" width="30" height="38" rx="5" className="ga-dug" />
      <path d="M287 44h20M287 52h20M287 60h20" className="ga-hatch" />
    </svg>
  );
}

const ARTS = [RoadArt, MineArt];

export function GovOutside({ title, projects }: { title: string; projects: GovProject[] }) {
  return (
    <div className="vfo-out" aria-label={title}>
      <h3 className="vfo-out-title">{title}</h3>
      <div className="vfo-pads">
        {projects.map((pr, i) => {
          const Art = ARTS[i % ARTS.length];
          const steps = lines(pr.steps);
          const tags = lines(pr.tags);
          const team = lines(pr.team).map((l) => {
            const [who, ...role] = l.split("|");
            return { who: who.trim(), role: role.join("|").trim() };
          });
          return (
            <article key={i} className="vfo-pad bglow" data-i={i}>
              <GlowEdge />
              <header className="vfo-pad-head">
                <span className="vfo-emblem" aria-hidden>
                  {pr.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pr.logo} alt="" />
                  ) : (
                    <b>{pr.mark || pr.org.slice(0, 3)}</b>
                  )}
                </span>
                <div>
                  <h4 className="vfo-org">{pr.org}</h4>
                  <p className="vfo-orgfull">{pr.orgFull}</p>
                </div>
              </header>
              <div className="vfo-art">
                <Art />
              </div>
              <div className="vfo-more">
                <div className="vfo-st-row">
                  <span className="vfo-st" data-live={/ongoing|progress|develop/i.test(pr.status)}>
                    {pr.status}
                  </span>
                  <span className="vfo-period">{pr.period}</span>
                </div>
                <h5 className="vfo-ptitle">{pr.title}</h5>
                {pr.by && <p className="vfo-by">{pr.by}</p>}
                <p className="vfo-text">{pr.text}</p>
                {steps.length > 0 && (
                  <ol className="vfo-steps" style={{ "--n": steps.length } as React.CSSProperties}>
                    {steps.map((t, k) => (
                      <li key={k} style={{ "--i": k } as React.CSSProperties}>
                        <b>{k + 1}</b>
                        {t}
                      </li>
                    ))}
                  </ol>
                )}
                <div className="vfo-team-row">
                  {team.length > 0 && (
                    <ul className="vfo-team">
                      {team.map((m, k) => (
                        <li key={k}>
                          <b>{m.who}</b>
                          <span>{m.role}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {tags.length > 0 && (
                    <ul className="vfo-tags">
                      {tags.map((t, k) => (
                        <li key={k}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
