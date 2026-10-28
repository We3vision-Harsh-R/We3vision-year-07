// The services of the home page (Admin > Pages > Home > hero cards), shared by the laptop scene (hero-scene.tsx) and the phone / tablet rail
// (services-rail.tsx): the accent colour of every service, its title on one line and its sub-services.

// Accent colour of each service (taken from the old site's pastel palette and the violet of the new design)
export const ACCENTS = ["hsl(calc(var(--th) + 76) calc(81.25% * var(--ts)) 87.45%)", "hsl(calc(var(--th) + 316) calc(66.15% * var(--ts)) 87.25%)", "hsl(calc(var(--th) + 354) calc(100% * var(--ts)) 76.47%)", "hsl(calc(var(--th) + 358) calc(100% * var(--ts)) 92.16%)", "hsl(calc(var(--th) + 339.48) calc(100% * var(--ts)) 77.45%)", "hsl(calc(var(--th) + 40) calc(40.82% * var(--ts)) 80.78%)", "hsl(calc(var(--th) + 339.6) calc(100% * var(--ts)) 82.55%)"];

export type ServiceCard = { title: string; href: string; summary: string; subs: string };

export const oneLine = (t: string) => t.replace(/\s*\n\s*/g, " ").trim();

// "Name | short description" per line (up to 4 lines); the sub-services have no page, they are only a list
export const parseSubs = (raw: string) =>
  raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((l) => {
      const [name = "", desc = ""] = l.split("|").map((x) => x.trim());
      return { name, desc };
    });
