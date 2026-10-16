import type { CSSProperties } from "react";
import type { App } from "./launcher-data";
import { Glyph } from "./glyph";

/** the colour of an app: its own hue (--off) */
export const hue = (n: number) => ({ "--off": n }) as CSSProperties;

/** the icon of an app (a tile and its picture) */
export function Ic({ app, mini }: { app: App; mini?: boolean }) {
  return <span className={`lnc-ic ${app.solid ? "is-c" : "is-w"} ${mini ? "lnc-mini" : ""}`} style={hue(app.off)}><Glyph name={app.glyph} /></span>;
}
