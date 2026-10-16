import type { SiteSettings } from "@/lib/cms/settings";

// The real contact details of the company (Admin > Settings > contact cards), found the same way as the launcher's "Talk to us" widget
// (src/app/(m)/m/page.tsx). Pure and server-safe.
export type ContactInfo = { phone: string; phoneHref: string; whatsapp: string; email: string; address: string; maps: string };

export function contactFrom(site: SiteSettings): ContactInfo | null {
  const lines = site.contactCards.flatMap((c) => c.lines.split("\n").map((l) => l.trim()));
  const phone = lines.find((l) => /^\+?[\d\s]{9,}$/.test(l));
  const email = lines.find((l) => /^info@\S+\.\S+$/.test(l)) ?? lines.find((l) => /^\S+@\S+\.\S+$/.test(l));
  if (!phone && !email) return null;
  const head = site.contactCards[0]?.lines.split("\n").map((l) => l.trim()).filter((l) => l && !/@/.test(l) && !/^\+?[\d\s]{9,}$/.test(l)) ?? [];
  const address = head.join(" ").replace(/\s+/g, " ").replace(/,\s*$/, "");
  return {
    phone: phone ?? "",
    phoneHref: phone ? phone.replace(/[^\d+]/g, "") : "",
    whatsapp: phone ? phone.replace(/\D/g, "") : "",
    email: email ?? "",
    address,
    maps: address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "",
  };
}
