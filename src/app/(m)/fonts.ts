import { Bebas_Neue, Caveat, Pacifico, Playfair_Display, Quicksand, Space_Mono } from "next/font/google";

// The fonts the visitor can choose for the launcher (Customize > Font). Modern (Poppins) is the site font and is always loaded (root-shell.tsx).
// The others are declared with preload: false, so a phone downloads one of them only when the visitor picks it.
// (next/font needs plain object literals here: no spread, no shared variable.)
const soft = Quicksand({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-soft" });
const serif = Playfair_Display({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-serif" });
const poster = Bebas_Neue({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-poster", weight: "400" });
const mono = Space_Mono({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-mono", weight: ["400", "700"] });
const script = Pacifico({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-script", weight: "400" });
const hand = Caveat({ subsets: ["latin"], display: "swap", preload: false, variable: "--f-hand" });

export const fontVars = [soft, serif, poster, mono, script, hand].map((f) => f.variable).join(" ");
