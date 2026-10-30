import { redirect } from "next/navigation";
import { LAUNCHER_UNLOCKED } from "@/lib/launcher-lock";
import { Launcher } from "../../../components/site/lazy";
import type { Contact } from "@/components/site/mobile/launcher-widgets";
import { getSiteSettings } from "@/lib/cms/queries";

// Mobile home = the phone launcher (Home, All Apps, App Library). Served for "/" to phones and tablets. Cached; Publish in the admin refreshes it.
export const revalidate = 600;

export default async function MobileHome() {
  // the launcher is locked (src/lib/launcher-lock.ts): /m goes to the normal home page
  if (!LAUNCHER_UNLOCKED) redirect("/");
  // the widgets that help a visitor to reach us (call, WhatsApp, mail, map, social) use the real details from the site settings (Admin > Settings)
  const site = await getSiteSettings();
  const lines = site.contactCards.flatMap((c) => c.lines.split("\n").map((l) => l.trim()));
  const phone = lines.find((l) => /^\+?[\d\s]{9,}$/.test(l));
  const email = lines.find((l) => /^info@\S+\.\S+$/.test(l)) ?? lines.find((l) => /^\S+@\S+\.\S+$/.test(l));
  // the head office: the lines of the first card that are neither an e-mail nor a phone number
  const head = site.contactCards[0]?.lines.split("\n").map((l) => l.trim()).filter((l) => l && !/@/.test(l) && !/^\+?[\d\s]{9,}$/.test(l)) ?? [];
  const address = head.join(" ").replace(/\s+/g, " ").replace(/,\s*$/, "");
  const contact: Contact | null = phone && email
    ? {
        phone,
        phoneHref: phone.replace(/[^\d+]/g, ""),
        email,
        whatsapp: phone.replace(/\D/g, ""),
        address,
        maps: address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "",
        social: site.social.filter((s) => /^https:\/\//.test(s.href)).map((s) => ({ label: s.label, href: s.href })),
      }
    : null;
  return <Launcher contact={contact} />;
}
