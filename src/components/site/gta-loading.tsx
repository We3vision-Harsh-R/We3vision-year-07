import Image from "next/image";
import "@/styles/gta-load.css";

// GTA theme (task 156): a short "loading screen" the first time a visitor opens any page in a browser session. Plain markup: it is part of the server
// HTML and removes itself with a CSS animation (about 1.5 s), so it needs no script to go away and the page underneath is already in the HTML. A tiny
// boot script (GTA_LOAD_BOOT, added to the layout's boot) sets data-gt-ld="off" on <html> when the visitor has seen it in this session, so it does
// not come back on every page. Visitors who prefer less motion never see it. Styles: styles/gta-load.css (prefix gt-ld-). Master switch: lib/gta.ts.
export const GTA_LOAD_BOOT = `(function(){try{if(sessionStorage.getItem("gt-ld")){document.documentElement.setAttribute("data-gt-ld","off")}else{sessionStorage.setItem("gt-ld","1")}}catch(e){}})();`;

export function GtaLoading() {
  return (
    <div className="gt-ld" aria-hidden="true">
      <div className="gt-ld-sun" />
      <div className="gt-ld-mid">
        <Image src="/brand/logo-white.webp" alt="" width={600} height={468} unoptimized className="gt-ld-logo" />
        <p className="gt-ld-t">Loading We3vision</p>
        <span className="gt-ld-bar">
          <i />
        </span>
      </div>
      <p className="gt-ld-tip">
        <b>Tip</b> Every service is a mission. Pick one and press Start mission.
      </p>
    </div>
  );
}
