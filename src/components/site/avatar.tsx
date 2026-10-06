// The cartoon guide of the site as a RIGGED vector figure: every part that moves (head, hair, arms, forearms, legs, shins, feet) is its
// own group with its pivot at the joint, so CSS can animate a real walk cycle, a wave, a cheer or typing (see .ch-* in globals.css).
// Three views: front (stands, waves, cheers), side (walks, seen from the side, faces right) and top (seen from above, faces down).
// All colours are theme colours (--th, --ts) and the shirt of every person can differ (--tone, 352 = the colour of the theme itself).

function FrontParts({ headset = false, glasses = false }: { headset?: boolean; glasses?: boolean }) {
  return (
    <>
      <ellipse className="ch-shadow" cx="50" cy="147" rx="24" ry="3.2" />
      <g className="ch-body">
        {/* legs */}
        <g className="ch-leg ch-leg-l">
          <rect className="ch-pants" x="36.5" y="100" width="12.5" height="38" rx="5" />
          <path className="ch-shoe" d="M33.5 138h15.5v5.5q0 3.2-3.2 3.2H35.6q-3.4 0-3.4-3.4q0-3.6 1.3-5.3z" />
          <path className="ch-shoe-hi" d="M36 141.5q4-1.4 9-.2" />
        </g>
        <g className="ch-leg ch-leg-r">
          <rect className="ch-pants" x="51" y="100" width="12.5" height="38" rx="5" />
          <path className="ch-shoe" d="M66.5 138H51v5.5q0 3.2 3.2 3.2h10.2q3.4 0 3.4-3.4q0-3.6-1.3-5.3z" />
          <path className="ch-shoe-hi" d="M64 141.5q-4-1.4-9-.2" />
        </g>
        <g className="ch-torso">
          {/* arms behind the shirt hem */}
          <g className="ch-arm ch-arm-l">
            <path className="ch-sleeve" d="M31 64.5q-5.2 1.6-5.6 8.4l-.6 12.4q-.2 3 2.8 3.6l5.8.8q3 .4 3.4-2.6l1.8-16.6z" />
            <rect className="ch-cuff" x="25.2" y="82.5" width="11.2" height="4.6" rx="2.2" />
            <g className="ch-fore">
              <rect className="ch-skin" x="26.6" y="85" width="8.2" height="13" rx="4" />
              <circle className="ch-skin" cx="30.7" cy="100.5" r="4.7" />
            </g>
          </g>
          <g className="ch-arm ch-arm-r">
            <path className="ch-sleeve" d="M69 64.5q5.2 1.6 5.6 8.4l.6 12.4q.2 3-2.8 3.6l-5.8.8q-3 .4-3.4-2.6l-1.8-16.6z" />
            <rect className="ch-cuff" x="63.6" y="82.5" width="11.2" height="4.6" rx="2.2" />
            <g className="ch-fore">
              <rect className="ch-skin" x="65.2" y="85" width="8.2" height="13" rx="4" />
              <circle className="ch-skin" cx="69.3" cy="100.5" r="4.7" />
            </g>
          </g>
          <path className="ch-shirt" d="M32 66.5q0-5 6-5.6h24q6 .6 6 5.6l-1.6 36.4q-16.4 3.4-32.8 0z" />
          <path className="ch-shirt-d" d="M62 62q6 1 6 5.6l-1.6 35.4q-2 .6-4 1z" />
          <rect className="ch-belt" x="32.4" y="97.4" width="35.2" height="5.6" rx="1.6" />
          <rect className="ch-buckle" x="46.6" y="98" width="6.8" height="4.4" rx="1" />
          <path className="ch-collar" d="M41 60.6l9 12.2l-3.4 2.6l-8.6-10.4zM59 60.6l-9 12.2l3.4 2.6l8.6-10.4z" />
          <path className="ch-lan" d="M44 61.5q4.6 13.5 6 22.5q1.4-9 6-22.5" />
          <rect className="ch-badge" x="45.2" y="83" width="9.6" height="12.4" rx="1.8" />
          <path className="ch-badge-a" d="M50 85.6l-2.6 6.6h1.4l.5-1.4h1.4l.5 1.4h1.4zM49.6 89.6h.8l-.4-1.1z" />
        </g>
        {/* head */}
        <g className="ch-head">
          <rect className="ch-skin-d" x="44.5" y="52" width="11" height="12" rx="4" />
          <circle className="ch-skin" cx="26" cy="38" r="5.6" />
          <circle className="ch-skin" cx="74" cy="38" r="5.6" />
          <circle className="ch-skin-d" cx="26.6" cy="38.4" r="2.6" />
          <circle className="ch-skin-d" cx="73.4" cy="38.4" r="2.6" />
          <ellipse className="ch-skin" cx="50" cy="34" rx="24.4" ry="23" />
          <path
            className="ch-hair"
            d="M23.4 40C18.6 14 34 3.4 50 4.2C66 3.4 81.4 14 76.6 40C77.4 33 75.4 27.4 71 25.2C68.4 29 64.6 30.6 61 28.2C59 24.8 55 22.4 50.6 25.4C46 22.4 41.4 24.4 39 28.6C35.4 31 31 29.2 28.6 25.4C24.8 27.4 22.8 33.4 23.4 40Z"
          />
          <path className="ch-hair" d="M27.6 13.4Q29.6 3 38.4 7Q43 -1.2 51 5.6Q59 -0.8 63.6 7.4Q72.6 5.4 73.4 15.6Q61.4 9 50 9.4Q38 9 27.6 13.4Z" />
          <path className="ch-hair-hi" d="M31 14.6Q41 8.4 52 9.6M57 8.8Q65 8.6 71 14.4" />
          <path className="ch-hair-hi" d="M26.6 30.4Q28.4 24.6 33.4 21.4" />
          {/* face */}
          {/* the eyes are one group so that they can follow the pointer (--lx, --ly: -1..1) */}
          <g className="ch-eyes">
            <path className="ch-brow" d="M33.8 28.6Q39.4 25.4 45.4 28.4M54.6 28.4Q60.6 25.4 66.2 28.6" />
            <ellipse className="ch-eye" cx="40.4" cy="38.4" rx="5.4" ry="6.6" />
            <ellipse className="ch-eye" cx="59.6" cy="38.4" rx="5.4" ry="6.6" />
            <circle className="ch-eye-hi" cx="42.4" cy="35.8" r="2" />
            <circle className="ch-eye-hi" cx="61.6" cy="35.8" r="2" />
            <circle className="ch-eye-hi" cx="38.4" cy="41.2" r="0.9" />
            <circle className="ch-eye-hi" cx="57.6" cy="41.2" r="0.9" />
          </g>
          <ellipse className="ch-cheek" cx="33.4" cy="46" rx="4.6" ry="3" />
          <ellipse className="ch-cheek" cx="66.6" cy="46" rx="4.6" ry="3" />
          <path className="ch-nose" d="M48.6 44.2q1.4 1.6 2.8 0" />
          <path className="ch-mouth" d="M43 48.4Q50 58.6 57 48.4Q50 50.4 43 48.4Z" />
          <path className="ch-tongue" d="M46.6 53.8Q50 51.6 53.4 53.8Q50 56.8 46.6 53.8Z" />
          {glasses && !headset && (
            <g className="ch-glasses">
              <circle className="ch-glass" cx="40.4" cy="38.2" r="9.4" />
              <circle className="ch-glass" cx="59.6" cy="38.2" r="9.4" />
              <path className="ch-frame" d="M49.8 37.4q.2-1.4.4 0M31 36L26.6 33.6M69 36l4.4-2.4" />
              <path className="ch-glass-shine" d="M34.4 33q2-2.2 4.8-2.6M53.6 33q2-2.2 4.8-2.6" />
            </g>
          )}
          {headset && (
            <g className="ch-headset">
              <path className="ch-strap" d="M26.4 31Q50 12 73.6 31" />
              <path className="ch-strap" d="M25 44Q22 38 26.4 31M75 44Q78 38 73.6 31" />
              <rect className="ch-visor" x="24.6" y="27.6" width="50.8" height="21.6" rx="9" />
              <rect className="ch-visor-lens" x="28" y="30.6" width="44" height="15.6" rx="6.8" />
              <path className="ch-visor-shine" d="M32 34.4Q42 32 52 33.4" />
              <circle className="ch-visor-led" cx="50" cy="51" r="1.4" />
            </g>
          )}
        </g>
      </g>
    </>
  );
}

function SideParts() {
  return (
    <>
      <ellipse className="ch-shadow" cx="50" cy="147" rx="24" ry="3.2" />
      <g className="ch-body">
        {/* the far leg and arm (darker) */}
        <g className="ch-leg ch-leg-b" style={{ transformOrigin: "50px 102px" }}>
          <rect className="ch-pants ch-far" x="43.6" y="100" width="12" height="25" rx="5" />
          <g className="ch-shin" style={{ transformOrigin: "49.6px 123px" }}>
            <rect className="ch-pants ch-far" x="44" y="119" width="11.2" height="22" rx="4.6" />
            <g className="ch-foot" style={{ transformOrigin: "49.6px 141px" }}>
              <path className="ch-shoe ch-far" d="M43 139.2h12.4q8 0 10 5.2v1.8q0 1.2-1.2 1.2H44q-2.6 0-2.6-2.8q0-3.2 1.6-5.4z" />
            </g>
          </g>
        </g>
        <g className="ch-arm ch-arm-b" style={{ transformOrigin: "50px 69px" }}>
          <path className="ch-sleeve ch-far" d="M45.4 64.4q5.2-2.4 9.4 0l2 15.6q.2 2.4-2.4 2.8l-5 .4q-2.6 0-3-2.4z" />
          <g className="ch-fore" style={{ transformOrigin: "50.4px 82px" }}>
            <rect className="ch-skin-d" x="46.6" y="80" width="7.6" height="14" rx="3.8" />
            <circle className="ch-skin-d" cx="50.4" cy="96.4" r="4.6" />
          </g>
        </g>
        <g className="ch-torso">
          <path className="ch-shirt" d="M38 67q0-6.4 7-7h10q7 .6 7 7l-.8 36.4q-11.6 3.2-23.4 0z" />
          <path className="ch-shirt-d" d="M38 67q.2-5 4-6.4l-.2 41.6l-3.4-.4z" />
          <rect className="ch-belt" x="37.6" y="97.6" width="24.8" height="5.6" rx="1.6" />
          <rect className="ch-buckle" x="55.4" y="98.2" width="5.8" height="4.2" rx="1" />
          <path className="ch-collar" d="M50 59.6l9 3.4l-1.2 5l-8.2-1.6z" />
          <path className="ch-lan" d="M52 61q5.6 9.6 6.6 20" />
          <g className="ch-badge-g">
            <rect className="ch-badge" x="55.4" y="80.4" width="7.4" height="11.4" rx="1.6" />
            <path className="ch-badge-a" d="M59.1 83l-2.2 6h1.2l.4-1.2h1.2l.4 1.2h1.2zM58.7 86.4h.8l-.4-1z" />
          </g>
        </g>
        {/* the near leg */}
        <g className="ch-leg ch-leg-f" style={{ transformOrigin: "50px 102px" }}>
          <rect className="ch-pants" x="43.6" y="100" width="12" height="25" rx="5" />
          <g className="ch-shin" style={{ transformOrigin: "49.6px 123px" }}>
            <rect className="ch-pants" x="44" y="119" width="11.2" height="22" rx="4.6" />
            <g className="ch-foot" style={{ transformOrigin: "49.6px 141px" }}>
              <path className="ch-shoe" d="M43 139.2h12.4q8 0 10 5.2v1.8q0 1.2-1.2 1.2H44q-2.6 0-2.6-2.8q0-3.2 1.6-5.4z" />
              <path className="ch-shoe-hi" d="M46 142q6-1.4 12 .6" />
            </g>
          </g>
        </g>
        {/* the near arm */}
        <g className="ch-arm ch-arm-f" style={{ transformOrigin: "50px 69px" }}>
          <path className="ch-sleeve" d="M44.6 63.6q6.2-2.8 10.8 0l2 16.4q.2 2.6-2.6 3l-5.4.4q-2.8 0-3.2-2.6z" />
          <rect className="ch-cuff" x="44" y="79.6" width="12.6" height="4.6" rx="2.2" />
          <g className="ch-fore" style={{ transformOrigin: "50.2px 82px" }}>
            <rect className="ch-skin" x="46.2" y="82" width="8" height="14" rx="4" />
            <circle className="ch-skin" cx="50.2" cy="98.4" r="4.8" />
          </g>
        </g>
        {/* head (faces right) */}
        <g className="ch-head" style={{ transformOrigin: "50px 58px" }}>
          <rect className="ch-skin-d" x="45" y="52" width="10" height="11" rx="4" />
          <ellipse className="ch-skin" cx="52" cy="34" rx="24" ry="23" />
          <path
            className="ch-hair"
            d="M24 38C19 14 36 3.6 54 5.4C72 5.6 81 18 76.6 30.4C72.6 23 65 19.4 57 22C53 26.6 46 24 41.6 26.4C35.4 29.6 33.4 35 33.6 41.6C33.8 48 36.4 52.4 41 55.6C30 56.4 24.6 47.4 24 38Z"
          />
          <path className="ch-hair" d="M31 10.6Q35 1.6 44 6.4Q50 -0.6 57 5.8Q66 1.2 71 8.8Q79 9 79 19Q64 11 52 11.4Q40 11 31 10.6Z" />
          <path className="ch-hair-hi" d="M33 13.6Q44 7.4 56 9.2M60 8.6Q69 8.8 75.4 15" />
          <path className="ch-hair-hi" d="M25.6 31Q27.6 24.4 33 20.4" />
          <circle className="ch-skin" cx="43.4" cy="39.6" r="5.4" />
          <circle className="ch-skin-d" cx="43.8" cy="40" r="2.5" />
          <path className="ch-brow" d="M58 29.2Q64.2 26.2 70 29.6" />
          <ellipse className="ch-eye" cx="64.4" cy="38" rx="4.5" ry="5.8" />
          <circle className="ch-eye-hi" cx="66" cy="35.6" r="1.7" />
          <circle className="ch-eye-hi" cx="62.8" cy="40.4" r="0.8" />
          <circle className="ch-skin" cx="75.8" cy="43" r="2.6" />
          <ellipse className="ch-cheek" cx="66.4" cy="47.6" rx="4.4" ry="3" />
          <path className="ch-mouth-line" d="M63.4 51.4Q68.2 56.6 72.6 51" />
        </g>
      </g>
    </>
  );
}

function TopParts() {
  return (
    <>
      <ellipse className="ch-shadow" cx="50" cy="68" rx="42" ry="46" />
      <path className="ch-shoe ch-ft ch-ft-l" d="M38 99.6q-8.4 0-8.4 11.4q0 8 8.4 8q8.4 0 8.4-8q0-11.4-8.4-11.4z" />
      <path className="ch-shoe ch-ft ch-ft-r" d="M62 99.6q-8.4 0-8.4 11.4q0 8 8.4 8q8.4 0 8.4-8q0-11.4-8.4-11.4z" />
      <g className="ch-body">
        <g className="ch-ar ch-ar-l">
          <ellipse className="ch-sleeve" cx="17.6" cy="80" rx="9.4" ry="14.4" />
          <ellipse className="ch-cuff" cx="16.6" cy="90.6" rx="8" ry="3.4" />
          <circle className="ch-skin" cx="16" cy="97" r="6.2" />
        </g>
        <g className="ch-ar ch-ar-r">
          <ellipse className="ch-sleeve" cx="82.4" cy="80" rx="9.4" ry="14.4" />
          <ellipse className="ch-cuff" cx="83.4" cy="90.6" rx="8" ry="3.4" />
          <circle className="ch-skin" cx="84" cy="97" r="6.2" />
        </g>
        <ellipse className="ch-shirt" cx="50" cy="79" rx="34" ry="18" />
        <path className="ch-shirt-d" d="M24 70q26-8 52 0q-4 -6 -26-7q-22 1-26 7z" />
        <path className="ch-lan" d="M40.4 68q4.2 15 9.6 24q5.4-9 9.6-24" />
        <rect className="ch-badge" x="45.2" y="91" width="9.6" height="12.4" rx="1.8" />
        <path className="ch-badge-a" d="M50 93.4l-2.6 6.6h1.4l.5-1.4h1.4l.5 1.4h1.4zM49.6 97.4h.8l-.4-1.1z" />
        <g className="ch-head">
          <circle className="ch-skin" cx="21.4" cy="55" r="6.4" />
          <circle className="ch-skin" cx="78.6" cy="55" r="6.4" />
          <circle className="ch-skin-d" cx="22" cy="55.4" r="3" />
          <circle className="ch-skin-d" cx="78" cy="55.4" r="3" />
          <circle className="ch-hair" cx="50" cy="51" r="29.4" />
          <path className="ch-hair-hi" d="M30 38Q40 24 56 26Q70 28 73 42M34 62Q30 50 34 42M44 34Q54 32 62 38M38 48Q48 40 60 46M62 62Q70 56 70 46M36 56Q46 62 58 58" />
          <path className="ch-hair-hi2" d="M28 66Q50 78 72 66Q66 76 50 77Q34 76 28 66Z" />
        </g>
      </g>
    </>
  );
}

/** The cartoon guide, standing, seen from the front: waves (data-m="wave"), cheers (data-m="up"), breathes (data-m="idle"). */
export function GuideFront({ className, headset = false }: { className?: string; headset?: boolean }) {
  return (
    <svg className={`ch ch-front ${className ?? ""}`} viewBox="0 0 100 150" aria-hidden focusable="false">
      <FrontParts headset={headset} />
    </svg>
  );
}
/** The same, as a group to put into another svg. */
export function GuideFrontG({ headset = false, glasses = false, hide = "", pose = "" }: { headset?: boolean; glasses?: boolean; hide?: string; pose?: string }) {
  return (
    <g className="ch ch-front" data-hide={hide} data-pose={pose}>
      <FrontParts headset={headset} glasses={glasses} />
    </g>
  );
}
/** The cartoon guide seen from the side, facing right: walks when an ancestor says so (.ch-walking). */
export function GuideSide({ className }: { className?: string }) {
  return (
    <svg className={`ch ch-side ${className ?? ""}`} viewBox="0 0 100 150" aria-hidden focusable="false">
      <SideParts />
    </svg>
  );
}
/** The cartoon guide seen from above, facing down. */
export function GuideTop({ className }: { className?: string }) {
  return (
    <svg className={`ch ch-top ${className ?? ""}`} viewBox="0 0 100 126" aria-hidden focusable="false">
      <TopParts />
    </svg>
  );
}
