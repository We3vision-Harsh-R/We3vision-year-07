import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { ScrollTop } from "@/components/site/scroll-top";

// The parts every ROOT layout shares. The site has three root layouts, one per "app" (so a visitor only downloads the CSS and JS of the app they use):
//   src/app/(site)/layout.tsx  the laptop website      (globals.css)
//   src/app/admin/layout.tsx   the admin panel         (globals.css)
//   src/app/(m)/layout.tsx     the phone/tablet site   (mobile.css only)
// A root layout must render <html> and <body>; <RootShell> does that with the brand font and the saved colour theme.

// The brand font of We3vision: Poppins, used for everything on the website and in the admin panel.
const poppins = Poppins({
  subsets: ["latin"],
  // 300 (light) is not used anywhere in the CSS or the components: one font file less to download. 800 is the heaviest weight: the giant year of the
  // About page and the rotating word of the Brand page use it (they used the Archivo font before; the site is Poppins only)
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

// Canonical links, robots.txt and sitemap.xml are built from NEXT_PUBLIC_SITE_URL. Without it they point to localhost and Google would index
// nothing useful, so a production build says so loudly (it does not fail: a deploy must never be blocked by a missing setting).
if (!process.env.NEXT_PUBLIC_SITE_URL && process.env.NODE_ENV === "production") {
  console.warn("[we3vision] NEXT_PUBLIC_SITE_URL is not set: canonical links, robots.txt and sitemap.xml will point to http://localhost:1010. Set it to the live https address (Hostinger > environment variables).");
}

// Proof of ownership for Google Search Console and Bing Webmaster Tools (the "HTML tag" method). Paste the code that the tool shows into the environment
// (GOOGLE_SITE_VERIFICATION = the content="..." value of the google-site-verification tag, BING_SITE_VERIFICATION = the content value of msvalidate.01),
// then deploy: the tag is written into every page when the site is built, so set the variable BEFORE the build. Nothing is written while they are empty.
// (A Domain property verified through a DNS TXT record needs none of this.)
const verification: NonNullable<Metadata["verification"]> = {
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
  ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
};

export const baseMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:1010"),
  title: "We3vision",
  description: "We3vision Private Limited",
  ...(Object.keys(verification).length ? { verification } : {}),
};

// Puts the visitor's saved colour on <html> BEFORE the first paint, so the site never flashes the original violet first.
// (The admin panel wears the same colour: styles/admin-shell.css.)
const THEME_BOOT = `(function(){try{var t=JSON.parse(localStorage.getItem("we3.theme")||"null");if(t&&typeof t.h==="number"){var r=document.documentElement.style;r.setProperty("--th",String(t.h));r.setProperty("--ts",String(t.s||1));}}catch(e){}})();`;

/** boot: one more small script that must run before the first paint (for example the colour picker switch of the laptop site) */
export function RootShell({ children, htmlClass = "", boot }: { children: React.ReactNode; htmlClass?: string; boot?: string }) {
  return (
    <html lang="en" className={`${poppins.variable} ${htmlClass}`.trim()} suppressHydrationWarning>
      <body>
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- rendered by every root layout, as it was in app/layout.tsx */}
        <Script id="theme-boot" strategy="beforeInteractive">
          {THEME_BOOT}
        </Script>
        {boot && (
          // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- like the theme boot script above
          <Script id="page-boot" strategy="beforeInteractive">
            {boot}
          </Script>
        )}
        <ScrollTop />
        {children}
      </body>
    </html>
  );
}
