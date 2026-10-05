// The cartoon guide of the site as a vector drawing (public/avatar/<view>.svg, traced from the character sheet). Every file holds
// one view in a group with the id "a"; the shirt, the trousers and the badge are filled with theme colours (--th, --ts) and the
// colour of the person (--tone, 352 = the colour of the theme itself), so the guide follows the visitor's colour choice.
// The views: front, side, back, top (from above), toplite (from above, fewer shapes: for the many little people of the office), walk,
// point and present (poses).

export const AVATAR_SIZE = {
  front: [221, 440],
  side: [217, 440],
  back: [192, 440],
  top: [233, 300],
  toplite: [233, 300],
  walk: [308, 440],
  point: [236, 440],
  present: [283, 440],
} as const;

export type AvatarView = keyof typeof AVATAR_SIZE;

export function Avatar({ view, className }: { view: AvatarView; className?: string }) {
  const [w, h] = AVATAR_SIZE[view];
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMax meet" aria-hidden focusable="false">
      <use href={`/avatar/${view}.svg#a`} />
    </svg>
  );
}
