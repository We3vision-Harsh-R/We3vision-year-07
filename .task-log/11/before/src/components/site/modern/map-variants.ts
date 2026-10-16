// The look of the industries map of every service page (a plain module: it is read by a server component).

export type Shape = "serpentine" | "ring" | "spiral" | "grid" | "figure8" | "wave" | "switchback" | "climb" | "circuit";
export type Traveller = "walker" | "cyclist" | "scooter" | "bus" | "rover";
export type Scenery = "river" | "park" | "mountains" | "plain" | "circuit" | "lake";
export type Variant = { shape: Shape; traveller: Traveller; scenery: Scenery; tone: number };

/** the look of the map of every service page */
export const VARIANTS: Record<string, Variant> = {
  webdev: { shape: "serpentine", traveller: "cyclist", scenery: "river", tone: 0 },
  mobile: { shape: "ring", traveller: "scooter", scenery: "park", tone: 40 },
  "ui-ux-design": { shape: "spiral", traveller: "walker", scenery: "park", tone: 300 },
  crm: { shape: "grid", traveller: "bus", scenery: "plain", tone: 200 },
  animation: { shape: "figure8", traveller: "walker", scenery: "lake", tone: 20 },
  "3d-modeling": { shape: "wave", traveller: "rover", scenery: "plain", tone: 100 },
  graphics: { shape: "switchback", traveller: "cyclist", scenery: "river", tone: 340 },
  seo: { shape: "climb", traveller: "walker", scenery: "mountains", tone: 60 },
  ai: { shape: "circuit", traveller: "rover", scenery: "circuit", tone: 250 },
};
export const DEFAULT_VARIANT: Variant = VARIANTS.webdev;

