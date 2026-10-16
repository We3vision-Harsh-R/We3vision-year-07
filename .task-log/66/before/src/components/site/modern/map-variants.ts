// The road of the industries city of every service page (a plain module: it is read by a server component). The city is the same on every
// page; only the shape of the road and the point of view differ. The car always drives straight ahead, it never turns back.

export type Road = "straight" | "wave" | "stairs";
export type Variant = { road: Road; ang: number };

/** the road of every service page (ang: the angle the camera looks at the road from, in degrees) */
export const VARIANTS: Record<string, Variant> = {
  webdev: { road: "straight", ang: -34 },
  mobile: { road: "wave", ang: -22 },
  "ui-ux-design": { road: "stairs", ang: -44 },
  crm: { road: "straight", ang: 26 },
  animation: { road: "wave", ang: 34 },
  "3d-modeling": { road: "stairs", ang: 30 },
  graphics: { road: "straight", ang: -58 },
  seo: { road: "stairs", ang: -24 },
  ai: { road: "wave", ang: -50 },
};
export const DEFAULT_VARIANT: Variant = VARIANTS.webdev;
