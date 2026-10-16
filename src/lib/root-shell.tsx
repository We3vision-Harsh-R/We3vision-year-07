import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";

// The parts every ROOT layout shares. The site has three root layouts, one per "app" (so a visitor only downloads the CSS and JS of the app they use):
//   src/app/(site)/layout.tsx  the laptop website      (globals.css)
//   src/app/admin/layout.tsx   the admin panel         (globals.css)
//   src/app/(m)/layout.tsx     the phone/tablet site   (mobile.css only)
// A root layout must render <html> and <body>; <RootShell> does that with the brand font and the saved colour theme.

// The brand font of We3vision: Poppins, used for everything on the website and in the admin panel.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const baseMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "We3vision",
  description: "We3vision Private Limited",
};

// Puts the visitor's saved colour on <html> BEFORE the first paint, so the site never flashes the original violet first.
// (The admin panel keeps its own colours: it is skipped.)
const THEME_BOOT = `(function(){try{if(location.pathname.indexOf("/admin")===0)return;var t=JSON.parse(localStorage.getItem("we3.theme")||"null");if(t&&typeof t.h==="number"){var r=document.documentElement.style;r.setProperty("--th",String(t.h));r.setProperty("--ts",String(t.s||1));}}catch(e){}})();`;

export function RootShell({ children, htmlClass = "" }: { children: React.ReactNode; htmlClass?: string }) {
  return (
    <html lang="en" className={`${poppins.variable} ${htmlClass}`.trim()} suppressHydrationWarning>
      <body>
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- rendered by every root layout, as it was in app/layout.tsx */}
        <Script id="theme-boot" strategy="beforeInteractive">
          {THEME_BOOT}
        </Script>
        {children}
      </body>
    </html>
  );
}
