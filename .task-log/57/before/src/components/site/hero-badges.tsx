import Image from "next/image";

type Badge = { label: string; image: string };

/**
 * The recognitions (Startup India, MSME) on the first screen of the pages, as on the old site: one on the left and one on the right of the screen, at
 * the height of the logo (the first half of the list on the left, the rest on the right). They come from the site settings (Admin > Settings), so they
 * can be changed there. Put it inside the (relative) section of the hero. The look is in globals.css (.hb).
 */
export function HeroBadges({ badges }: { badges: Badge[] }) {
  const list = badges.filter((b) => b.image);
  if (list.length === 0) return null;
  const half = Math.ceil(list.length / 2);
  const side = (items: Badge[]) => (
    <ul>
      {items.map((b) => (
        <li key={b.label + b.image}>
          <Image src={b.image} alt={b.label} title={b.label} width={300} height={110} unoptimized />
        </li>
      ))}
    </ul>
  );
  return (
    <div aria-label="Recognitions" className="hb">
      {side(list.slice(0, half))}
      {side(list.slice(half))}
    </div>
  );
}
