// The receptionist of the Contact page: a hand-drawn 2D character made of layers (hair behind, neck, blazer, head with ears, face, eyes with
// their own iris, eyebrows, mouth, fringe, headset, the raised hand). Every layer can move on its own, so the character is alive:
//   - the eyes and the head follow the pointer (--ex/--ey and --hx/--hy are set by the section; -1..1)
//   - she blinks by herself, breathes, and the mouth moves while she speaks (data-talk="true")
//   - she waves (data-wave) and nods (data-nod), both started by the section with a changing key
// The look is in globals.css (.ra-*). Skin and hair are natural colours, the clothes follow the colours of the site (theme).

export function ReceptionAvatar({ talking = false, waveKey = 0, nodKey = 0, mini = false }: { talking?: boolean; waveKey?: number; nodKey?: number; mini?: boolean }) {
  return (
    <svg className={mini ? "ra ra-mini" : "ra"} viewBox={mini ? "140 80 200 230" : "0 0 480 560"} aria-hidden focusable="false" data-talk={talking}>
      <defs>
        <clipPath id="ra-clip-l">
          <path d="M179 192 Q205 164 231 192 Q205 216 179 192 Z" />
        </clipPath>
        <clipPath id="ra-clip-r">
          <path d="M249 192 Q275 164 301 192 Q275 216 249 192 Z" />
        </clipPath>
        <linearGradient id="ra-skin" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#f0c4a0" />
          <stop offset="0.55" stopColor="#dfa57d" />
          <stop offset="1" stopColor="#c58a64" />
        </linearGradient>
        <radialGradient id="ra-cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e07a7a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#e07a7a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ra-neck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8704d" />
          <stop offset="0.5" stopColor="#c88c66" />
          <stop offset="1" stopColor="#d9a07a" />
        </linearGradient>
        <linearGradient id="ra-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a2d36" />
          <stop offset="0.5" stopColor="#2a1820" />
          <stop offset="1" stopColor="#1a0f16" />
        </linearGradient>
        <linearGradient id="ra-hair-sh" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--ra-shine)" }} stopOpacity="0" />
          <stop offset="0.5" style={{ stopColor: "var(--ra-shine)" }} stopOpacity="0.8" />
          <stop offset="1" style={{ stopColor: "var(--ra-shine)" }} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ra-blazer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--ra-b1)" }} />
          <stop offset="1" style={{ stopColor: "var(--ra-b2)" }} />
        </linearGradient>
        <linearGradient id="ra-lapel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--ra-l1)" }} />
          <stop offset="1" style={{ stopColor: "var(--ra-l2)" }} />
        </linearGradient>
        <radialGradient id="ra-iris" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#9a6a48" />
          <stop offset="0.6" stopColor="#4a2a1a" />
          <stop offset="1" stopColor="#25130c" />
        </radialGradient>
        <linearGradient id="ra-lip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c0596a" />
          <stop offset="1" stopColor="#a63f55" />
        </linearGradient>
      </defs>

      {/* ---- the waving hand: behind the counter, comes up on the right (it is in front of everything else when she waves) ---- */}
      <g className="ra-arm" key={"w" + waveKey} data-wave={waveKey > 0}>
        <path className="ra-sleeve" d="M382 470 C380 430 384 392 392 366 L430 372 C426 400 424 436 428 470 Z" />
        <rect className="ra-cuff" x="386" y="352" width="46" height="20" rx="8" />
        <g className="ra-hand">
          <path className="ra-skin" d="M390 356 C384 330 384 306 392 292 L426 292 C436 306 436 332 430 356 Z" />
          <rect className="ra-finger" x="388" y="238" width="11" height="62" rx="5.5" transform="rotate(-8 393 300)" />
          <rect className="ra-finger" x="401" y="228" width="11" height="70" rx="5.5" />
          <rect className="ra-finger" x="414" y="232" width="11" height="68" rx="5.5" transform="rotate(5 420 300)" />
          <rect className="ra-finger" x="426" y="248" width="10" height="56" rx="5" transform="rotate(14 431 300)" />
          <path className="ra-skin" d="M388 322 C372 314 366 296 372 284 C378 290 386 300 394 308 Z" />
          <path className="ra-palm-sh" d="M396 330 Q410 342 424 330" />
        </g>
      </g>

      {/* ---- hair behind the head and shoulders ---- */}
      <g className="ra-body" data-nod={nodKey > 0} key={"n" + nodKey}>
        <path className="ra-hair-back" d="M240 74 C322 74 358 138 352 222 C350 280 362 340 388 420 L92 420 C118 340 130 280 128 222 C122 138 158 74 240 74 Z" />

        {/* neck with the shadow of the chin */}
        <path className="ra-neck" d="M208 250 L208 346 Q240 366 272 346 L272 250 Z" />
        <ellipse className="ra-chin-shadow" cx="240" cy="296" rx="38" ry="15" />

        {/* shoulders: the blazer, the blouse and the V of the neck */}
        <path className="ra-blazer" d="M44 560 L56 452 C62 396 116 362 178 346 L212 338 Q240 358 268 338 L302 346 C364 362 418 396 424 452 L436 560 Z" />
        <path className="ra-blouse" d="M204 340 Q240 360 276 340 L262 470 Q240 486 218 470 Z" />
        <path className="ra-vneck" d="M212 342 Q240 360 268 342 L240 408 Z" />
        <path className="ra-lapel" d="M178 346 L236 426 L206 470 L150 392 Q158 360 178 346 Z" />
        <path className="ra-lapel ra-lapel-r" d="M302 346 L244 426 L274 470 L330 392 Q322 360 302 346 Z" />
        <path className="ra-seam" d="M178 346 L236 426 M302 346 L244 426" />
        <rect className="ra-badge" x="296" y="410" width="48" height="30" rx="6" />
        <path className="ra-badge-line" d="M304 421H336M304 429H326" />
        <circle className="ra-badge-dot" cx="334" cy="429" r="2.4" />

        {/* the head: moves a little with the pointer */}
        <g className="ra-head">
          {/* ears and earrings */}
          <ellipse className="ra-skin-d" cx="166" cy="206" rx="13" ry="23" />
          <ellipse className="ra-skin-d" cx="314" cy="206" rx="13" ry="23" />
          <circle className="ra-earring" cx="166" cy="232" r="4" />
          <circle className="ra-earring" cx="314" cy="232" r="4" />

          {/* the face */}
          <path
            className="ra-face"
            d="M240 98 C294 98 322 140 320 192 C318 238 294 278 266 294 C254 301 226 301 214 294 C186 278 162 238 160 192 C158 140 186 98 240 98 Z"
          />
          <path className="ra-face-sh" d="M160 196 C162 240 186 278 214 294 C190 270 178 236 176 204 Z" />
          <path className="ra-face-sh ra-face-sh-r" d="M320 196 C318 240 294 278 266 294 C290 270 302 236 304 204 Z" />
          <ellipse cx="190" cy="232" rx="26" ry="18" fill="url(#ra-cheek)" />
          <ellipse cx="290" cy="232" rx="26" ry="18" fill="url(#ra-cheek)" />

          {/* eyebrows */}
          <path className="ra-brow" d="M180 162 Q204 142 230 154" />
          <path className="ra-brow" d="M250 154 Q276 142 300 162" />

          {/* the eyes: the white, the iris (it follows the pointer), the lid that blinks, the lashes */}
          <g className="ra-eye" data-side="l">
            <path className="ra-sclera" d="M179 192 Q205 164 231 192 Q205 216 179 192 Z" />
            <g clipPath="url(#ra-clip-l)">
              <g className="ra-iris-g">
                <circle cx="205" cy="193" r="11" fill="url(#ra-iris)" />
                <circle cx="205" cy="193" r="5" fill="#120a07" />
                <circle cx="209" cy="189" r="3.2" fill="#fff" opacity="0.95" />
                <circle cx="200" cy="197" r="1.6" fill="#fff" opacity="0.7" />
              </g>
            </g>
            <path className="ra-lid" d="M179 192 Q205 164 231 192 Q205 216 179 192 Z" />
            <path className="ra-lash" d="M177 194 Q205 161 233 192 L237 185" />
            <path className="ra-lash-b" d="M186 200 Q205 212 224 200" />
          </g>
          <g className="ra-eye" data-side="r">
            <path className="ra-sclera" d="M249 192 Q275 164 301 192 Q275 216 249 192 Z" />
            <g clipPath="url(#ra-clip-r)">
              <g className="ra-iris-g">
                <circle cx="275" cy="193" r="11" fill="url(#ra-iris)" />
                <circle cx="275" cy="193" r="5" fill="#120a07" />
                <circle cx="279" cy="189" r="3.2" fill="#fff" opacity="0.95" />
                <circle cx="270" cy="197" r="1.6" fill="#fff" opacity="0.7" />
              </g>
            </g>
            <path className="ra-lid" d="M249 192 Q275 164 301 192 Q275 216 249 192 Z" />
            <path className="ra-lash" d="M303 194 Q275 161 247 192 L243 185" />
            <path className="ra-lash-b" d="M256 200 Q275 212 294 200" />
          </g>

          {/* the nose */}
          <path className="ra-nose" d="M240 198 Q233 224 226 234 Q240 244 254 234 Q247 224 240 198" />
          <path className="ra-nose-hi" d="M238 200 Q236 218 233 228" />
          <circle className="ra-nostril" cx="232" cy="236" r="2.2" />
          <circle className="ra-nostril" cx="248" cy="236" r="2.2" />

          {/* the mouth: a smile; while she speaks the open mouth moves over it */}
          <g className="ra-mouth">
            <path className="ra-smile-fill" d="M208 252 Q224 244 240 249 Q256 244 272 252 Q240 282 208 252 Z" />
            <path className="ra-lip-hi" d="M226 249 Q240 245 254 249" />
            <g className="ra-open">
              <path className="ra-open-bg" d="M212 252 Q240 246 268 252 Q262 280 240 281 Q218 280 212 252 Z" />
              <path className="ra-teeth" d="M216 252 Q240 247 264 252 L262 259 Q240 255 218 259 Z" />
              <ellipse className="ra-tongue" cx="240" cy="272" rx="14" ry="6" />
            </g>
          </g>

          {/* the hair in front: a fringe swept to the side, with the shine of the theme */}
          <path
            className="ra-hair"
            d="M156 214 C146 140 184 84 244 84 C304 84 336 138 326 214 C320 168 300 140 266 128 C244 162 200 166 172 206 C166 210 160 214 156 214 Z"
          />
          <path className="ra-hair-line" d="M266 128 C240 150 206 160 176 200" />
          <path className="ra-hair-shine" d="M190 118 C214 96 262 94 292 118 C262 108 222 108 190 118 Z" />
          <path className="ra-hair-hi" d="M178 150 C186 128 204 112 226 106M300 134 C310 150 314 170 314 194" />

          {/* the headset: band over the hair, the cup over the ear, the microphone in front of the mouth */}
          <g className="ra-headset">
            <path className="ra-band" d="M152 206 C142 106 338 106 328 206" />
            <rect className="ra-cup" x="138" y="186" width="28" height="56" rx="12" />
            <rect className="ra-cup-hi" x="144" y="194" width="8" height="38" rx="4" />
            <rect className="ra-cup" x="314" y="192" width="22" height="44" rx="10" />
            <path className="ra-boom" d="M150 238 C148 286 190 304 224 276" />
            <ellipse className="ra-mic" cx="226" cy="274" rx="9" ry="6.5" transform="rotate(-24 226 274)" />
            <circle className="ra-led" cx="152" cy="236" r="3" />
          </g>
        </g>
      </g>
    </svg>
  );
}
