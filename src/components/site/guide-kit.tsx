import type { CSSProperties } from "react";
import { GuideFrontG } from "./avatar";

// Small pieces shared by the interactive scenes of the guide (guide-scenes.tsx, guide-scene.tsx).

/** What the frame (guide-scene.tsx) gives to every scene. */
export type SceneProps = {
  /** the guide says something (a speech bubble) */
  say: (text: string) => void;
  /** counts up when the guide is clicked (the guide hops) */
  bump: number;
  /** the click on the guide */
  onAvatar: () => void;
};

/**
 * The cartoon guide inside the svg of a scene (480 x 300): the rigged front view, cropped at `crop` (118 = down to the belt, so a desk
 * can hide the rest). One rig unit is w / 100 scene units: the head is at (x + w / 2, y + 0.34 * w) and the shoulders are at
 * y + 0.68 * w (left x + 0.31 * w, right x + 0.69 * w). `hide` hides the arms of the rig ("l", "r") when the scene draws its own.
 */
export function SceneAvatar({
  x = 95,
  y = 34,
  w = 150,
  crop = 118,
  headset = false,
  glasses = false,
  hide = "",
  bump = 0,
  onAvatar,
  tone,
}: {
  x?: number;
  y?: number;
  w?: number;
  crop?: number;
  headset?: boolean;
  glasses?: boolean;
  hide?: string;
  bump?: number;
  onAvatar?: () => void;
  tone?: number;
}) {
  const h = (w * crop) / 100;
  return (
    <g key={bump} className={bump ? "gs-av-g gs-hop" : "gs-av-g"} onClick={onAvatar} style={{ transformOrigin: `${x + w / 2}px ${y + h}px` }}>
      <svg className="gs-av" x={x} y={y} width={w} height={h} viewBox={`0 0 100 ${crop}`} style={{ overflow: crop >= 150 ? "visible" : "hidden", "--tone": tone } as CSSProperties}>
        <GuideFrontG headset={headset} glasses={glasses} hide={hide} />
      </svg>
    </g>
  );
}

/** An arm drawn by the scene: sleeve from the shoulder to the elbow, a cuff, the skin to the hand. `pts` = shoulder, elbow, hand. */
export function Arm({ pts, w = 15, hand = true, className, style }: { pts: [number, number][]; w?: number; hand?: boolean; className?: string; style?: CSSProperties }) {
  const [s, e, h] = pts;
  const c: [number, number] = [e[0] + (h[0] - e[0]) * 0.2, e[1] + (h[1] - e[1]) * 0.2];
  return (
    <g className={className} style={style}>
      <path className="ch-sleeve-s" d={`M${s[0]} ${s[1]}L${e[0]} ${e[1]}`} strokeWidth={w} />
      <path className="ch-skin-s" d={`M${e[0]} ${e[1]}L${h[0]} ${h[1]}`} strokeWidth={w * 0.66} />
      <path className="ch-cuff-s" d={`M${e[0]} ${e[1]}L${c[0]} ${c[1]}`} strokeWidth={w * 1.02} />
      {hand && <circle className="ch-skin" cx={h[0]} cy={h[1]} r={w * 0.46} />}
    </g>
  );
}

/** The soft light behind the guide, shared by every scene. */
export function SceneDefs() {
  return (
    <defs>
      <radialGradient id="gs-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="var(--g-b)" stopOpacity="0.38" />
        <stop offset="1" stopColor="var(--g-b)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="gs-desk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--g-b)" stopOpacity="0.55" />
        <stop offset="1" stopColor="var(--g-d)" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="gs-panel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--g-d)" />
        <stop offset="1" stopColor="var(--g-e)" />
      </linearGradient>
    </defs>
  );
}
