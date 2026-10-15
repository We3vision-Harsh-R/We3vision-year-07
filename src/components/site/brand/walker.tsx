/** A side-view walker for the chapter road: human proportions (about seven heads tall), a real gait (hip, knee, ankle, opposite arm swing, body bob),
 *  a profile face with nose, ear, brow, blinking eye and a small smile. It faces right. The steps run while an ancestor has .is-walking (see globals.css, bdvw-). */
export function Walker({ className }: { className?: string }) {
  return (
    <svg className={`ch bdvw ${className ?? ""}`} viewBox="0 0 64 142" aria-hidden focusable="false">
      <g className="bdvw-body">
        {/* far leg and arm (darker) */}
        <g className="bdvw-thigh bdvw-far" style={{ transformOrigin: "30px 70px" }}>
          <rect className="ch-pants ch-far" x="24" y="67" width="12.4" height="37" rx="6" />
          <g className="bdvw-shin" style={{ transformOrigin: "30px 102px" }}>
            <rect className="ch-pants ch-far" x="24.6" y="99" width="10.6" height="33" rx="5" />
            <g className="bdvw-foot" style={{ transformOrigin: "30px 131px" }}>
              <path className="ch-shoe ch-far" d="M24.6 130h8.6q6 .8 10.6 6q2 2.2.8 3.6H25.6q-2 0-2-2z" />
            </g>
          </g>
        </g>
        <g className="bdvw-arm bdvw-far" style={{ transformOrigin: "30px 35px" }}>
          <rect className="ch-sleeve ch-far" x="26.6" y="31" width="7.6" height="18" rx="3.8" />
          <g className="bdvw-fore" style={{ transformOrigin: "30.4px 48px" }}>
            <rect className="ch-skin-d" x="27" y="47" width="6.8" height="16" rx="3.4" />
            <circle className="ch-skin-d" cx="30.4" cy="64.4" r="3.8" />
          </g>
        </g>
        <g className="bdvw-torso" style={{ transformOrigin: "30px 70px" }}>
          <path className="ch-shirt" d="M22.6 36q0-7.6 7.6-7.6t7.8 7.6l-.8 35.4q-7 2.2-14.4 0z" />
          <path className="ch-shirt-d" d="M22.6 36q.2-5.4 4-7l-.3 42.2l-3.1-.6z" />
          <rect className="ch-belt" x="22.4" y="66.4" width="15.8" height="4.4" rx="1.4" />
          <rect className="ch-buckle" x="33.6" y="67" width="3.8" height="3.2" rx=".8" />
          <path className="ch-collar" d="M30 28.4l7 3.4l-1.4 4.2l-5.6-1.6z" />
          <rect className="ch-skin-d" x="27" y="22" width="6.8" height="8" rx="2.6" />
          <path className="ch-lan" style={{ strokeWidth: 1.2 }} d="M34.4 30.4q1 8 .4 15" />
          <rect className="ch-badge" x="32.6" y="45" width="4.6" height="6.6" rx="1" />
          <rect className="ch-badge-a" x="33.4" y="46.4" width="3" height="1.4" rx=".4" />
          <g className="bdvw-head" style={{ transformOrigin: "30px 26px" }}>
            <path className="ch-skin" d="M21.6 14.4C21.6 4.6 31 1.6 37.4 5.6C40.6 7.6 41.4 11 41.4 13.4C41.4 15 42.2 16.4 43.2 18C43.8 19 43 19.8 41.8 19.8C41.4 21 41.8 21.8 41.4 22.8C41 24 40 24.2 39.4 24.4C39.2 27.4 36.2 29.4 32.4 29.4C26 29.4 21.6 24 21.6 18.4Z" />
            <ellipse className="ch-skin-d" cx="29.4" cy="17.4" rx="2.2" ry="3.3" />
            <ellipse className="ch-cheek" cx="35.6" cy="20.6" rx="2.6" ry="1.8" />
            <path className="ch-brow" style={{ strokeWidth: 1.2 }} d="M33.4 11.4Q36.2 9.8 39 11.4" />
            <g className="bdvw-eye" style={{ transformOrigin: "36.6px 14.4px" }}>
              <ellipse className="ch-eye" cx="36.6" cy="14.6" rx="1.5" ry="2.1" />
              <circle className="ch-eye-hi" cx="37.1" cy="13.8" r=".6" />
            </g>
            <path className="ch-nose" style={{ strokeWidth: 0.8 }} d="M41.6 19.2q.7.5-.1 1.1" />
            <path style={{ fill: "none", stroke: "#a64b57", strokeWidth: 1, strokeLinecap: "round" }} d="M36.6 23.4Q38.6 24.8 40.4 23" />
            <path className="ch-hair" d="M20.6 17C18.6 4 29 -.4 37 2.8C41.4 4.6 42.6 9 41 11.6C38.6 8.2 33 7.4 28.4 10.2C26 11.8 25 15 25.8 19.6C23 19.2 20.8 18.6 20.6 17Z" />
            <path className="ch-hair-l" d="M27 5.4Q33 1.4 39 5Q33 4.2 28.4 7.6Z" />
            <path className="ch-hair" d="M21 15.6Q20.2 25 25 27.6Q24 22.6 25 18Z" />
          </g>
        </g>
        <g className="bdvw-thigh" style={{ transformOrigin: "30px 70px" }}>
          <rect className="ch-pants" x="24" y="67" width="12.4" height="37" rx="6" />
          <path className="ch-crease" d="M26 80q4 2 8 0" />
          <g className="bdvw-shin" style={{ transformOrigin: "30px 102px" }}>
            <rect className="ch-pants" x="24.6" y="99" width="10.6" height="33" rx="5" />
            <g className="bdvw-foot" style={{ transformOrigin: "30px 131px" }}>
              <path className="ch-shoe" d="M24.6 130h8.6q6 .8 10.6 6q2 2.2.8 3.6H25.6q-2 0-2-2z" />
              <path className="ch-shoe-hi" d="M28 136.4q6-.8 11 1.2" />
            </g>
          </g>
        </g>
        <g className="bdvw-arm" style={{ transformOrigin: "30px 35px" }}>
          <rect className="ch-sleeve" x="26" y="30.4" width="8.4" height="19" rx="4.2" />
          <rect className="ch-cuff" x="26.2" y="45.4" width="8" height="3.2" rx="1.6" />
          <g className="bdvw-fore" style={{ transformOrigin: "30.2px 48px" }}>
            <rect className="ch-skin" x="26.8" y="47.4" width="7" height="16" rx="3.5" />
            <circle className="ch-skin" cx="30.2" cy="65" r="4" />
          </g>
        </g>
      </g>
    </svg>
  );
}
