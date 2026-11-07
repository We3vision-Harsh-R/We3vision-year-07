import Link from "next/link";
import { AdminIcon, type IconName } from "./admin-icons";

// The small actions of the admin lists and forms as ICON buttons (owner 2026-11-07: "a button that can be an icon should be an icon, so it takes less room").
// The words are not lost: they are the tooltip (data-tip, shown on hover and on keyboard focus) and the accessible name (aria-label). Main actions such as
// Save and Add keep their words. Look: styles/admin-shell.css (.ads-ib). Works in server and client files (no hooks).
type Tone = "plain" | "accent" | "danger";
type Common = { icon: IconName; label: string; tone?: Tone };
type AsButton = Common & { href?: undefined; type?: "button" | "submit"; onClick?: () => void; disabled?: boolean };
type AsLink = Common & { href: string; external?: boolean };

export function IconBtn(p: AsButton | AsLink) {
  const { icon, label, tone = "plain" } = p;
  const inner = <AdminIcon name={icon} size={17} />;
  if (p.href !== undefined) {
    if (p.external)
      return (
        <a href={p.href} target="_blank" rel="noreferrer" className="ads-ib" data-tone={tone} data-tip={label} aria-label={label}>
          {inner}
        </a>
      );
    return (
      <Link href={p.href} className="ads-ib" data-tone={tone} data-tip={label} aria-label={label}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={p.type ?? "button"} className="ads-ib" data-tone={tone} data-tip={label} aria-label={label} onClick={p.onClick} disabled={p.disabled}>
      {inner}
    </button>
  );
}
