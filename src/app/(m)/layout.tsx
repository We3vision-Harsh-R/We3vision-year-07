import type { Metadata } from "next";
import "./mobile.css";
import { RootShell, baseMetadata } from "@/lib/root-shell";
import { fontVars } from "./fonts";

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

// A laptop must never stay in the phone app (a shared cache can hand the phone page to anybody, an old cookie can too): a browser with a mouse, a wide window and a desktop user agent
// goes once to the desktop site of the same address (?view=desktop remembers it). ?view=mobile (on purpose) is left alone.
const DESKTOP_GUARD = "(function(){try{if(/[?&]view=mobile/.test(location.search))return;var d=matchMedia(\"(pointer:fine) and (hover:hover)\").matches&&innerWidth>=900&&!/Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent);if(!d||sessionStorage.getItem(\"w3v-dg\"))return;sessionStorage.setItem(\"w3v-dg\",\"1\");location.replace(location.pathname.replace(/^\/m(\/|$)/,\"/\")+\"?view=desktop\"+location.hash)}catch(e){}})();";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell htmlClass={fontVars} boot={DESKTOP_GUARD}>
      <div className="m-root">{children}</div>
    </RootShell>
  );
}
