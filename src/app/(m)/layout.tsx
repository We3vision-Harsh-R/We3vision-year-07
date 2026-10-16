import type { Metadata } from "next";
import "./mobile.css";
import { RootShell, baseMetadata } from "@/lib/root-shell";

// THE MOBILE SITE: its own ROOT layout (route group "(m)", internal address /m/...). A phone or tablet is sent here by src/proxy.ts for every
// page listed in MOBILE_READY (src/lib/device.ts); the address in the browser stays the normal one. It loads ONLY mobile.css (never globals.css)
// and has no background, smooth scroll, custom cursor, 3D, desktop footer or floating menu. Add only what mobile needs.
export const metadata: Metadata = {
  ...baseMetadata,
  // the page keeps the same public address as its desktop twin (one URL for Google)
  alternates: { canonical: "/" },
  other: { "mobile-web-app-capable": "yes" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "We3vision" },
};

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell>
      <div className="m-root">{children}</div>
    </RootShell>
  );
}
