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
    v: 73,
    date: "2026-10-30",
    title: "Phone: new menu, one hero for service pages, lighter",
    notes: [
      "The big menu on a phone has product tiles, two columns of page pills and a glass strip at the end.",
      "Every service page starts with one landing hero on a phone, and squeezed three-column blocks became cards.",
      "The festival is lighter on a phone (no big lanterns on the text) and the page scrolls natively and with less blur.",
    ],
  },
  {
    v: 72,
    date: "2026-10-30",
    title: "The database is kept awake (no more paused Supabase project)",
    notes: [
      "New address /api/health makes one tiny database read and answers ok (or 503 when the database is down).",
      "A scheduled GitHub job opens it every 6 hours, so the Supabase project never counts as idle and is not paused; if it ever fails, GitHub e-mails the owner.",
    ],
  },
  {
    v: 71,
    date: "2026-10-29",
    title: "New domain www.we3vision.com, and portfolio projects through the AI (MCP) connection",
    notes: [
      "The site address is now www.we3vision.com everywhere: the MCP and sign-in links, the sitemap and the canonical links all read NEXT_PUBLIC_SITE_URL, and the old 07.we3vision.com address sends visitors to the same page of the new one.",
      "AI tools can now send portfolio projects and case studies (name, story, cover and more pictures) to Admin > AI Submissions, with a preview of the real project page and an Edit screen; nothing goes live before an admin approves it.",
    ],
  },
  {
    v: 70,
    date: "2026-10-29",
    title: "Less empty space between sections on phone and tablet",
    notes: [
      "On phone and tablet the gap between sections is about half as tall on every page (the big 96-128px paddings are shortened); the laptop pages are unchanged.",
      "Home page sections (industries, technology, why us, reach, contact) sit closer together.",
    ],
  },
  {
    v: 69,
    date: "2026-10-29",
    title: "Smoother service wheel, quieter bottom bar, app-style menu",
    notes: [
      "The service wheel is driven by the finger itself (momentum and a spring), so it moves smoothly; only an up or down drag moves it, sideways does nothing. Group buttons at the top jump to a group and a counter shows where you are.",
      "The bottom bar is smaller and quieter, plain glass with one lit pill.",
      "On phone and tablet the menu is a sheet that slides up with grouped lists and no services (they have the wheel).",
    ],
  },
  {
    v: 68,
    date: "2026-10-29",
    title: "Glass bottom bar and service wheel on phone and tablet",
    notes: [
      "Phone and tablet get a floating glass bar at the bottom (Home, Services, Work, Contact, Menu) with a lit pill that slides between the tabs; the top bar of the last version is gone.",
      "Services opens a wheel: every service on an arc at the right edge, scroll up and down, tap the lit one to open it. The big menu has a Browse all button for it.",
      "The big menu opens above the bar with a stronger glass look; the laptop pill is unchanged.",
    ],
  },
  {
    v: 67,
    date: "2026-10-29",
    title: "Top navigation bar on phone and tablet",
    notes: [
      "Below 1024px the floating round menu button is replaced by a bar that stays at the top: logo, Contact and Menu.",
      "The Menu button opens the same big menu; the laptop pill is unchanged.",
    ],
  },
  {
    v: 66,
    date: "2026-10-29",
    title: "Home page redesigned for phone and tablet",
    notes: [
      "Services are one row of cards to swipe; industries, reasons and offices swipe too, so the page is about half as long on a phone.",
      "The big menu on a phone and tablet is one column with the service groups folding open.",
      "Footer, hero, glance, technologies, reach and contact are laid out for small screens; the laptop design is unchanged.",
    ],
  },
  {
    v: 65,
    date: "2026-10-28",
    title: "Careers seat: every answer is checked",
    notes: [
      "Careers (Book your seat): current status takes letters only (special characters and digits are removed as you type), the join date must be a real day from today to one year ahead, the notice period, destination and HR call slot must come from the lists.",
      "The server checks the same rules, so a request that skips the page is stopped too.",
    ],
  },
  {
    v: 64,
    date: "2026-10-27",
    title: "New home hero: one big rounded panel",
    notes: [
      "The first screen of the home page is one big rounded dark panel: heading (last words softer) on the left, one sentence and two buttons on the right, three services and the recognition logos along the bottom.",
      "Phone/tablet: the panel stacks in one column. Phone launcher stays locked.",
    ],
  },
  {
    v: 63,
    date: "2026-10-27",
    title: "Phone launcher locked; the home page works on every screen",
    notes: [
      "The phone launcher (the app-style home screen) is locked: phones and tablets get the same home page as the laptop, made to fit small screens.",
      "Home on a phone: the hero, At a glance (two facts in a row, recognitions that wrap) and the service tabs (one row that slides sideways) fit the width.",
    ],
  },
  {
    v: 62,
    date: "2026-10-27",
    title: "Job forms: a message under every field; event layout; laptop never gets the phone app",
    notes: [
      "Job application forms (the job page and the ticket on /careers): every field that is wrong has a red border and its own message under it, a field that is needed says so after the first try to send, and the box at the bottom and the popup over the button are gone.",
      "Rules: full name letters and spaces only; email; mobile exactly 10 digits starting 6-9 (or a number with its country code); salaries digits only; links must be https; why-join at least 20 characters and no tags; a question that asks for a link is checked as a link.",
      "The label of a field stays above the floating particles.",
      "Physical marketing, Turn Brand Moments Into Brand Memories: the five zones are evenly spaced with room at both ends, the names fit their boxes, and the bottom of the section clears the menu bar.",
      "A laptop no longer gets the phone launcher: pages that have a phone twin are not kept in a shared cache, and a desktop browser that lands on the phone page goes to the desktop site of the same address.",
    ],
  },
  {
    v: 61,
    date: "2026-10-27",
    title: "Team bug list part 4: forms, PANDA, industries arrows, ad preview, clock, step counter",
    notes: [
      "Contact forms (Get a free quote / Start a project): name, email, mobile (10 digits starting 6-9, or a number with its country code) and message are checked while the visitor works, with a red border and a clear line under the field, a spinner on Sending and the same rules on the server; the typed text stays light also when the browser fills a field in.",
      "Home: the arrows of the Built for every industry panel work again (the wide floating menu bar was covering them and took the click).",
      "PANDA: the blur behind its window no longer covers a whole screen of content, and it closes by itself when the cursor leaves it, also after a question was asked.",
      "About: the reasons cards glide between positions instead of jumping.",
      "Brand development: the walker turns round and walks back when the page is scrolled up.",
      "Meta marketing: the story and reel ad previews show the headline once and the description under it, no overlapping text.",
      "SEO: the 1 of 7 counter in the ring stands one under the other. Phone clock: the dial is drawn in one picture with the hands and numbers.",
      "A laptop no longer keeps the phone version because of an old ?view=mobile.",
    ],
  },
  {
    v: 60,
    date: "2026-10-26",
    title: "Team bug list part 3: Why-us card, no public version, CRM stepper, safe job form",
    notes: [
      "The featured Experienced mobile developers card (and every featured Why us card) has a small app-screen picture in the middle instead of an empty hollow; it shows only where the card is two rows high.",
      "The footer no longer shows the version number; it stays in the admin panel (sidebar and Admin > Versions).",
      "CRM on the phone: the disabled Back button has no spinner on step 1, and the last step has a Start your CRM project button instead of a stuck Next.",
      "Job application on the phone: only one dropdown is open at a time and the open one floats above the fields; hints are readable; the resume is checked before upload (name, size, double extension) and on the server (no scripts in a PDF, a real Word file without macros).",
      "The chatbot goes through the website to the real server (ai-chatbot-lghb on Render) and answers.",
    ],
  },
  {
    v: 59,
    date: "2026-10-26",
    title: "Chatbot through our server, PANDA dropdown, careers scroll and strict forms",
    notes: [
      "Chatbot: the browser now talks to this website (/api/chat), which calls the chatbot server itself, so the CORS block and the \"Failed to fetch\" error are gone; a sleeping server gives a friendly message.",
      "PANDA: the All services dropdown always opens (arrow button, click on the field, outside click closes it); if the chatbot server does not answer it shows the services of the website.",
      "Careers page: the page scrolls freely again (the lock that sent it back to the top until a city was chosen was removed).",
      "Careers forms: name, email, phone (10 to 15 digits), links (https), experience, salaries and texts are checked in the form with a message and a red border under each field, a toast tells success or error, and the same rules run on the server.",
    ],
  },
  {
    v: 58,
    date: "2026-10-26",
    title: "Team bug list: process steps, LinkedIn, hero buttons, careers validation, brief overflow",
    notes: [
      "Animation page: the checklist of steps 05 and 06 sits inside its card again (a staircase rule also moved the nested checklist items); the same rule was made safe for the other process layouts.",
      "LinkedIn: the company link is https://www.linkedin.com/company/we3visionprivatelimited/ everywhere; an old saved address is replaced automatically.",
      "Hero buttons such as Discuss your animation project stay on one line and have the same height.",
      "Careers forms (the train booking and the job apply form): email and phone are checked in the form (message under the field) and again on the server.",
      "AI contact flow: a very long name no longer leaves the Mission brief box.",
    ],
  },
  {
    v: 57,
    date: "2026-10-26",
    title: "Home hero: poster layout",
    notes: [
      "The Home hero is now a poster: the heading as wide as the screen, and along the bottom a rule with the two buttons, the outlined 7 and one tick for every year from the founding year to now (the last lit). The At a glance section below is unchanged.",
    ],
  },
  {
    v: 56,
    date: "2026-10-26",
    title: "Brand Identity page fixed on laptops and desktops",
    notes: [
      "The Brand Identity page showed tiny text and a lot of empty space: the home hero style .hi also matched the highlighted words of the heading there and made each one a full screen tall. The hero style now only applies to the hero section, so the heading, text and board are large and in place again.",
    ],
  },
  {
    v: 55,
    date: "2026-10-26",
    title: "Home hero redesigned as an editorial page",
    notes: [
      "The first screen of the Home page is now two sections: the hero (big heading, two actions, a huge 7 cut by the screen edge with a year ruler from the founding year) and, under it, At a glance (the facts as large numerals in a ruled table, the Startup India and MSME recognitions as a quiet line).",
      "Same content as before; no cards, glass or glows.",
    ],
  },
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
