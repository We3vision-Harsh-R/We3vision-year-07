// The cartoon guide of the site as a RIGGED vector figure: every part that moves (head, hair, arms, forearms, legs, shins, feet) is its
// own group with its pivot at the joint, so CSS can animate a real walk cycle, a wave, a cheer or typing (see .ch-* in globals.css).
// Three views: front (stands, waves, cheers), side (walks, seen from the side, faces right) and top (seen from above, faces down).
// All colours are theme colours (--th, --ts) and the shirt of every person can differ (--tone, 352 = the colour of the theme itself).

// The arm of the front view (the left one; the right one is the same drawing mirrored). It hangs from the shoulder, the sleeve is rolled up
// at the elbow and the forearm goes into the pocket of the trousers. It still waves and cheers: the whole arm turns at the shoulder and the
// forearm (.ch-fore) at the elbow.
function FrontArm({ side }: { side: "l" | "r" }) {
  const inner = (
    <>
      <path className="ch-sleeve" d="M33.6 61.4C27 61.4 23.6 65.6 23.8 72L23.4 83.4Q23.4 86.4 26.4 86.6L34.4 86.8Q37.2 86.8 37.2 84L37 70C37 64.6 36 62 33.6 61.4Z" />
      <path className="ch-sleeve-hi" d="M27.4 64.4Q24.8 68 25.4 76" />
      <rect className="ch-cuff" x="22.2" y="81.6" width="15.8" height="6.6" rx="3" />
      <path className="ch-fold" d="M23.6 85.6Q30 87.6 36.6 85.6" />
      <g className="ch-fore">
        <path className="ch-skin-s" d="M28.4 88.4L34.6 99.4" strokeWidth="7.6" />
        <path className="ch-arm-hi" d="M26.8 89.4L31.6 97.6" />
        <circle className="ch-skin" cx="35.2" cy="101.6" r="4.6" />
        <path className="ch-skin-s" d="M37.4 98.4q3.2-.2 3.2 3.4" strokeWidth="2.8" />
      </g>
    </>
  );
  return (
    <g className={`ch-arm ch-arm-${side}`}>
      {side === "l" ? inner : <g transform="translate(100 0) scale(-1 1)">{inner}</g>}
    </g>
  );
}

function FrontParts({ headset = false, glasses = false }: { headset?: boolean; glasses?: boolean }) {
  return (
    <>
      <ellipse className="ch-shadow" cx="50" cy="147" rx="26" ry="3.4" />
      <g className="ch-body">
        {/* legs: trousers with a crease and a turned-up hem, shiny black shoes */}
        <g className="ch-leg ch-leg-l">
          <path className="ch-pants" d="M33.4 100H49.8L49 138H35Z" />
          <path className="ch-crease" d="M42.6 106Q42.2 120 42.2 131" />
          <path className="ch-fold" d="M36.6 112Q40 114 44 112" />
          <rect className="ch-cuffp" x="34.4" y="131.6" width="15.4" height="7" rx="1.4" />
          <path className="ch-shoe" d="M32.4 138H49.6V144Q49.6 148.4 45.6 148.4H33.6Q29.8 148.4 29.8 144.6Q29.8 140.4 32.4 138Z" />
          <path className="ch-shoe-sole" d="M30.2 146.4H49.4" />
          <path className="ch-shoe-hi" d="M34 141.4Q40 139.8 46 141.2" />
        </g>
        <g className="ch-leg ch-leg-r">
          <path className="ch-pants" d="M50.2 100H66.6L65 138H51Z" />
          <path className="ch-crease" d="M57.4 106Q57.8 120 57.8 131" />
          <path className="ch-fold" d="M63.4 112Q60 114 56 112" />
          <rect className="ch-cuffp" x="50.2" y="131.6" width="15.4" height="7" rx="1.4" />
          <path className="ch-shoe" d="M67.6 138H50.4V144Q50.4 148.4 54.4 148.4H66.4Q70.2 148.4 70.2 144.6Q70.2 140.4 67.6 138Z" />
          <path className="ch-shoe-sole" d="M69.8 146.4H50.6" />
          <path className="ch-shoe-hi" d="M66 141.4Q60 139.8 54 141.2" />
        </g>
        <g className="ch-torso">
          {/* the shirt */}
          <path className="ch-shirt" d="M32.4 66Q32.4 60 40 59.6H60Q67.6 60 67.6 66L68.8 101.6Q50 105.6 31.2 101.6Z" />
          <path className="ch-shirt-d ch-soft" d="M60.4 60.4Q67.6 61 67.6 66L68.8 101.6Q64.6 102.6 60.6 103Z" />
          <path className="ch-shirt-l ch-soft" d="M35.2 66Q35.2 62.4 39 62H41.4Q37.4 72 38 100L33 99.6Z" />
          <path className="ch-fold" d="M36 93Q40 90.6 44.4 93M56 94Q60 91.6 64 94M38 83Q40.6 81.6 43.4 83" />
          <path className="ch-placket" d="M50 72V99" />
          <circle className="ch-btn" cx="50" cy="75.4" r="1" />
          <circle className="ch-btn" cx="50" cy="98" r="1" />
          {/* the chest pocket */}
          <path className="ch-pkt" d="M56.6 72.6H66V81Q61.3 83.6 56.6 81Z" />
          <path className="ch-pkt-l" d="M56.6 75H66" />
          <path className="ch-neckv" d="M42.4 59.6L50 72.6L57.6 59.6Z" />
          <path className="ch-collar" d="M40.4 59.4L50 73.8L43.2 77L35.4 64Q36.4 60.6 40.4 59.4ZM59.6 59.4L50 73.8L56.8 77L64.6 64Q63.6 60.6 59.6 59.4Z" />
          <path className="ch-collar-line" d="M40.4 59.4L50 73.8M59.6 59.4L50 73.8M43.2 77L50 73.8L56.8 77" />
          {/* the belt */}
          <path className="ch-belt" d="M31.4 97.4H68.6V103Q50 105.8 31.4 103Z" />
          <rect className="ch-buckle" x="46" y="97.8" width="8" height="5" rx="1.2" />
          <rect className="ch-buckle-in" x="47.8" y="99.2" width="4.4" height="2.2" rx="0.8" />
          {/* the lanyard with the badge */}
          <path className="ch-lan" d="M43.4 60Q47.6 76 50 85.4Q52.4 76 56.6 60" />
          <path className="ch-lan-hi" d="M44.6 62Q47.8 74 50 82" />
          <rect className="ch-clip" x="48.4" y="83" width="3.2" height="3" rx="0.8" />
          <rect className="ch-badge" x="45" y="85" width="10" height="13.4" rx="2" />
          <rect className="ch-badge-top" x="45" y="85" width="10" height="2.4" rx="1.2" />
          <path className="ch-badge-a" d="M50 89.4l-3 7.4h1.6l.6-1.7h1.6l.6 1.7h1.6zM49.5 93.8h1l-.5-1.4z" />
          <path className="ch-badge-line" d="M47.2 97.2H52.8" />
          {/* the arms hang in front of the shirt and the forearms go into the pockets of the trousers */}
          <FrontArm side="l" />
          <FrontArm side="r" />
          <path className="ch-pants ch-pocket" d="M32.4 105Q37.2 102 42.6 105L42.8 113L32.4 113Z" />
          <path className="ch-pants ch-pocket" d="M67.6 105Q62.8 102 57.4 105L57.2 113L67.6 113Z" />
          <path className="ch-pocket-l" d="M33 104.8Q37.4 102.4 42 105M67 104.8Q62.6 102.4 58 105" />
        </g>
        {/* head */}
        <g className="ch-head">
          <rect className="ch-skin-d" x="45" y="51" width="10" height="12" rx="4" />
          <circle className="ch-skin" cx="25.6" cy="40" r="5.8" />
          <circle className="ch-skin" cx="74.4" cy="40" r="5.8" />
          <circle className="ch-skin-d" cx="26.2" cy="40.4" r="2.8" />
          <circle className="ch-skin-d" cx="73.8" cy="40.4" r="2.8" />
          <path className="ch-hair" d="M21 40C14 25 19.6 8 32 4.4C33.4 1.4 40.6 0.6 45 3.2C48.4 0.6 56 0.6 59 3.4C66.4 1 76 4.6 79 14C84 24 82.4 33 79 40C77 31.6 73.6 27 70 24L30 24C26.4 27 23 31.6 21 40Z" />
          <ellipse className="ch-skin" cx="50" cy="36.4" rx="24.8" ry="22" />
          <ellipse className="ch-skin-d ch-soft" cx="50" cy="22" rx="20" ry="6" />
          <ellipse className="ch-skin-hi" cx="50" cy="29" rx="9" ry="2.6" />
          {/* the hair: a full fringe that is swept to the side, a few locks and a purple shine */}
          <path
            className="ch-hair"
            d="M25.6 36C23 25 27.6 15.4 36 12C34.6 14.8 35.2 17.6 37.6 19C39 13.4 45.4 8.6 52.6 9C50.8 11.2 51 13.4 52.8 15C55 10.6 61.2 9.6 66.6 12.4C65.6 14.2 65.8 16.2 67.6 17.6C72 20.8 76.6 27 74.4 36C73.2 31.4 71.4 27 68.6 24.4C67.4 27 64 27.8 61 26C59.2 23 56 21.8 52.6 23.4C49.4 21 45.4 21.4 43.4 24C40 25.4 36.4 24 34.4 21.6C31 23.8 28.6 28 27.6 33Z"
          />
          <path className="ch-hair" d="M24.4 36Q23 44.4 26.6 49.4Q25.6 43.4 28.2 38Z" />
          <path className="ch-hair" d="M75.6 36Q77 44.4 73.4 49.4Q74.4 43.4 71.8 38Z" />
          <path className="ch-hair-l" d="M36.4 13.4C44 8 55 8.6 63 12.6C54.6 11.8 45.6 12.6 39 18Z" />
          <path className="ch-hair-l" d="M27.8 25C28.4 19.6 31.6 16 35.6 14.2C33 19 32.8 22 34 24.4Z" />
          <path className="ch-hair-l" d="M60 15C65 13.6 70 16 72.6 21C68.4 18.8 64.6 18.4 61.4 19.4Z" />
          <path className="ch-hair-sh" d="M32 11Q41 4.4 52 6Q43.6 6.4 36 12.6Z" />
          <path className="ch-hair-hi" d="M33 11.6Q41 6.4 50 7.4M55 7.2Q63 6.8 70.4 11.6M30 17Q33 13 37 11.4" />
          {/* face */}
          {/* the eyes are one group so that they can follow the pointer (--lx, --ly: -1..1) */}
          <g className="ch-eyes">
            <path className="ch-brow" d="M33.4 29.6Q39.4 25.6 46 28.2M54 28.2Q60.6 25.6 66.6 29.6" />
            <g className="ch-eyeb">
              <ellipse className="ch-sclera" cx="40.2" cy="39" rx="6.5" ry="7.5" />
              <ellipse className="ch-iris" cx="40.2" cy="39.6" rx="5.3" ry="6.6" />
              <ellipse className="ch-eye" cx="40.2" cy="39.8" rx="3.1" ry="4" />
              <path className="ch-iris-l" d="M36.2 43.6Q40.2 47 44.2 43.6" />
              <circle className="ch-eye-hi" cx="42.4" cy="36.2" r="2.3" />
              <circle className="ch-eye-hi" cx="37.8" cy="42.2" r="1.1" />
              <path className="ch-lid" d="M33.4 35.6Q40.2 29.6 47 35" />
            </g>
            <g className="ch-eyeb">
              <ellipse className="ch-sclera" cx="59.8" cy="39" rx="6.5" ry="7.5" />
              <ellipse className="ch-iris" cx="59.8" cy="39.6" rx="5.3" ry="6.6" />
              <ellipse className="ch-eye" cx="59.8" cy="39.8" rx="3.1" ry="4" />
              <path className="ch-iris-l" d="M55.8 43.6Q59.8 47 63.8 43.6" />
              <circle className="ch-eye-hi" cx="62" cy="36.2" r="2.3" />
              <circle className="ch-eye-hi" cx="57.4" cy="42.2" r="1.1" />
              <path className="ch-lid" d="M53 35Q59.8 29.6 66.6 35.6" />
            </g>
          </g>
          <ellipse className="ch-cheek" cx="32.4" cy="47.6" rx="5.2" ry="3.3" />
          <ellipse className="ch-cheek" cx="67.6" cy="47.6" rx="5.2" ry="3.3" />
          <ellipse className="ch-cheek-hi" cx="31" cy="46.6" rx="2" ry="1.1" />
          <ellipse className="ch-cheek-hi" cx="66.2" cy="46.6" rx="2" ry="1.1" />
          <path className="ch-nose" d="M48.8 45.8Q50 47 51.2 45.8" />
          <g className="ch-mouth">
            <path className="ch-mouth-bg" d="M41.8 50.2Q50 52.8 58.2 50.2Q57.6 60.2 50 60.2Q42.4 60.2 41.8 50.2Z" />
            <path className="ch-teeth" d="M42.6 50.6Q50 53 57.4 50.6L57 53.4Q50 55.6 43 53.4Z" />
            <path className="ch-tongue" d="M44.8 57.4Q50 54.2 55.2 57.4Q53.4 59.8 50 59.8Q46.6 59.8 44.8 57.4Z" />
          </g>
          <path className="ch-nose" d="M39.8 49.4q-1.2 1.4-.2 3M60.2 49.4q1.2 1.4.2 3" />
          {glasses && !headset && (
            <g className="ch-glasses">
              <circle className="ch-glass" cx="40.2" cy="39" r="9.6" />
              <circle className="ch-glass" cx="59.8" cy="39" r="9.6" />
              <path className="ch-frame" d="M49.8 38.2q.2-1.4.4 0M30.6 36.6L26.6 34M69.4 36.6l4-2.6" />
              <path className="ch-glass-shine" d="M34.2 33.6q2-2.2 4.8-2.6M53.8 33.6q2-2.2 4.8-2.6" />
            </g>
          )}
          {headset && (
            <g className="ch-headset">
              <path className="ch-strap" d="M26.4 31Q50 12 73.6 31" />
              <path className="ch-strap" d="M25 44Q22 38 26.4 31M75 44Q78 38 73.6 31" />
              <rect className="ch-visor" x="24.6" y="28" width="50.8" height="22" rx="9" />
              <rect className="ch-visor-lens" x="28" y="31" width="44" height="16" rx="6.8" />
              <path className="ch-visor-shine" d="M32 34.8Q42 32.4 52 33.8" />
              <circle className="ch-visor-led" cx="50" cy="51.6" r="1.4" />
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
          <path className="ch-hair-l" d="M38 14C46 8.4 58 8.8 66 13C57 12 47 13 40 18.6Z" />
          <path className="ch-hair-l" d="M62 15.6C68 14.6 73.6 18 75.6 23.6C71 20.6 67 20 63.6 21Z" />
          <path className="ch-hair-sh" d="M36 12Q46 5.4 58 7.2Q48 7.4 40 13.6Z" />
          <path className="ch-hair-hi" d="M35 12.4Q45 7 55 8.4M60 8.2Q69 8.6 75.4 14.6M27 28Q28.6 21.4 34 18" />
          <circle className="ch-skin" cx="43.4" cy="39.6" r="5.4" />
          <circle className="ch-skin-d" cx="43.8" cy="40" r="2.5" />
          <path className="ch-brow" d="M58 28.6Q64.2 25 70.4 28.8" />
          <ellipse className="ch-sclera" cx="64.6" cy="38" rx="5.6" ry="7" />
          <ellipse className="ch-iris" cx="65.2" cy="38.6" rx="4.6" ry="6" />
          <ellipse className="ch-eye" cx="65.4" cy="38.8" rx="2.8" ry="3.6" />
          <circle className="ch-eye-hi" cx="67" cy="35.4" r="2" />
          <circle className="ch-eye-hi" cx="63.2" cy="41.4" r="1" />
          <path className="ch-lid" d="M59.6 33.6Q64.8 29.4 70.2 34" />
          <circle className="ch-skin" cx="75.8" cy="43" r="2.6" />
          <ellipse className="ch-cheek" cx="66.4" cy="47.6" rx="4.4" ry="3" />
          <path className="ch-mouth-bg" d="M63.6 51.4Q68.4 53.2 72.6 51.2Q72 58.4 67.8 58.4Q63.8 58.4 63.6 51.4Z" />
          <path className="ch-teeth" d="M64.4 51.8Q68.4 53.4 72 51.6L71.8 54Q68 55.4 64.6 54Z" />
        </g>
      </g>
    </>
  );
}

function TopParts({ girl = false }: { girl?: boolean }) {
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
          {girl && (
            <>
              {/* the girl version: a long ponytail that hangs down the back (it swings with the head), a hair tie and a clip */}
              <path className="ch-hair" d="M41 26Q36 6 50 1Q64 6 59 26Q50 20 41 26Z" />
              <path className="ch-hair-hi" d="M47 20Q44 11 49 5M53 20Q55 11 52 6" />
              <ellipse className="ch-tie" cx="50" cy="24.4" rx="7.4" ry="3.4" />
            </>
          )}
          <circle className="ch-hair" cx="50" cy="51" r={girl ? 30.6 : 29.4} />
          <path className="ch-hair-hi" d="M30 38Q40 24 56 26Q70 28 73 42M34 62Q30 50 34 42M44 34Q54 32 62 38M38 48Q48 40 60 46M62 62Q70 56 70 46M36 56Q46 62 58 58" />
          {girl && <circle className="ch-tie" cx="69" cy="37" r="3.6" />}
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
export function GuideTop({ className, girl = false }: { className?: string; girl?: boolean }) {
  return (
    <svg className={`ch ch-top ${className ?? ""}`} viewBox="0 0 100 126" aria-hidden focusable="false">
      <TopParts girl={girl} />
    </svg>
  );
}
