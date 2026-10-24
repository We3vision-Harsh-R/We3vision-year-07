// THE VERSION OF THE WEBSITE (owner, 2026-10-24: "from today the version runs from 51").
// One list, newest first. Every finished update adds ONE entry at the top with the next number (52, 53, ...); the number shown in the footer of
// the website and in the admin panel (sidebar + Admin > Versions) is the first entry, so nothing else has to be changed by hand.
// After the push the same number is a git tag (`git tag v51 && git push origin v51`), so any version can be found or restored later.

export type VersionEntry = {
  /** the version number: 51, 52, 53 ... */
  v: number;
  /** the day it went out, YYYY-MM-DD (Indian time) */
  date: string;
  /** one short line: what this update is */
  title: string;
  /** what changed, one plain sentence each */
  notes: string[];
};

export const VERSION_LOG: VersionEntry[] = [
  {
    v: 54,
    date: "2026-10-24",
    title: "Fest: rangolis drawn on the office floors, crackers in the menu, family at home in the footer",
    notes: [
      "About, Team and Metaverse offices: rangolis lie on the floor at random free places and two colleagues walk over and draw new ones, walking round the pattern while it grows; the oldest fades.",
      "Big menu: in the empty space under the short service lists a boy with a sparkler, a girl with an anar and a couple with sparklers enjoy on a small floor (switch: People with crackers in the big menu).",
      "Footer: a little home with a mandir and the family at the puja, the grandparents, children with crackers and a cat; it shows as many people as the window has room for and none on a small window (switch: Family at home in the footer).",
      "New switches in Admin > Fest: Metaverse page office, People with crackers in the big menu, Family at home in the footer. Nothing was removed.",
    ],
  },
  {
    v: 53,
    date: "2026-10-24",
    title: "Fest: a click launches a fan of rockets",
    notes: [
      "A click on an empty part of a page (Fest > Rocket on click) now launches 3 to 5 rockets at different angles, each in its own colour.",
      "Each rocket flies a real parabola (gravity), draws a glowing line of its path, stops at its own height and bursts there; the tops of the arcs stay inside the window.",
    ],
  },
  {
    v: 52,
    date: "2026-10-24",
    title: "Portfolio page redesign with filters",
    notes: [
      "The Portfolio page is now a board: filter chips by category (with the number of projects, extra categories folded behind More) and a search box.",
      "The projects are a bento grid: the first one is big, every card is a picture with a glass panel, an arrow, a light that follows the mouse and a text that opens on hover; filtering replays a short entrance.",
      "A message when nothing matches, with a button to show all projects.",
    ],
  },
  {
    v: 51,
    date: "2026-10-24",
    title: "Real fireworks + version numbers start",
    notes: [
      "Festival fireworks follow physics: the rocket slows under gravity and bursts at the top, the stars fly out as a round ball, slow down in the air, sink, burn from white-hot to ember and leave a streak.",
      "A change in Admin > Fest shows on the open website without a reload.",
      "The floating menu opens only when the mouse is on the Menu button (hover or click), not on Home, About or Services.",
      "CRM boxes and SEO boxes have the same size; the company name in the footer is no longer cut; the About timeline shows Harsh in front and Parth behind him.",
      "Version numbers: the website footer and the admin panel show the version, and Admin > Versions lists every update.",
    ],
  },
];

/** the number of the newest version */
export const SITE_VERSION = VERSION_LOG[0].v;

/** "Version 51" */
export const versionLabel = (v = SITE_VERSION) => `Version ${v}`;
