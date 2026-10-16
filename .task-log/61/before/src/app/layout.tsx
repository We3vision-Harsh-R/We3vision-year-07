import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// The brand font of We3vision: Poppins, used for everything on the website and in the admin panel.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "We3vision",
  description: "We3vision Private Limited",
};

// Puts the visitor's saved colour on <html> BEFORE the first paint, so the site never flashes the original violet first.
// (The admin panel keeps its own colours: it is skipped.)
const THEME_BOOT = `(function(){try{if(location.pathname.indexOf("/admin")===0)return;var t=JSON.parse(localStorage.getItem("we3.theme")||"null");if(t&&typeof t.h==="number"){var r=document.documentElement.style;r.setProperty("--th",String(t.h));r.setProperty("--ts",String(t.s||1));}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body>
        <Script id="theme-boot" strategy="beforeInteractive">
          {THEME_BOOT}
        </Script>
        {children}
      </body>
    </html>
  );
}
