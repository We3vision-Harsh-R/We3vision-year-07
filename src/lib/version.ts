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
    v: 154,
    date: "2026-11-13",
    title: "Recognition logos on the home page; calmer headers on phone service pages",
    notes: [
      "The Startup India and MSME logos (the files of Admin > Settings > badges) are shown at the top of the footer of the home page, on laptop and phone.",
      "Phone service pages: the pink app icon beside the large title and the little shape icons before the 3D Modeling list items are gone.",
    ],
  },
  {
    v: 153,
    date: "2026-11-13",
    title: "Home page on phones, round 3: questions, contact, footer",
    notes: [
      "Questions: the questions and answers start further left. Contact: the label looks like the other section labels, e-mail and phone sit close together, a smaller form and a tighter heading. All main buttons (also All contact details, Send) have the dark glass button with the turning colour border.",
      "Footer: LinkedIn and Instagram have icons, the Surat block shows the phone number, a Germany block (address, e-mail, phone) is added, and Back to the top is a round arrow button.",
    ],
  },
  {
    v: 152,
    date: "2026-11-13",
    title: "Home page on phones, round 2",
    notes: [
      "The problem chat in the AI and Brand Design sections now uses the same glowing Ask Panda bar as the Metaverse section: the problems are the chips, a tap shows the answer, a typed question goes to Panda.",
      "Icons are smaller and always a rounded square (Brand and Metaverse cards, process numbers); the Brand check badge is a small rounded square that no longer covers the text.",
      "Numbers section is a flat ledger of hairlines with a smaller 300+ card; industry cards have no empty room; the tools card is dark glass with dark chips.",
    ],
  },
  {
    v: 151,
    date: "2026-11-13",
    title: "Home page on phones: owner's screenshot fixes",
    notes: [
      "First screen: \"This year\" sits lower, clear of the dunes. The main buttons (Start your project, Get a free quote, We3vision AI) are dark glass with a soft turning multicolour border.",
      "Service cards: smaller picture, readable tags, \"Latest\" on its own line, the four small cards have the same icon corner. Product names sit higher. A soft shining line on the corners of the cards.",
      "AI and Brand Design sections: the list of problems is a small chat (tap a problem, get the answer); Documents sits beside Website and apps; the brand circle is a gradient logo mark.",
    ],
  },
  {
    v: 150,
    date: "2026-11-13",
    title: "Blog article with an index and a side column; AI industry cards the same",
    notes: [
      "Blog article page: the index of the article on the left, the article in the middle, and on the right the article facts, tags, author and three related articles. Both sides stay in view while reading.",
      "AI page, Industries We Serve: all six cards now have the same corners, the same light and the same number and heading lines.",
    ],
  },
  {
    v: 149,
    date: "2026-11-13",
    title: "About page on phones: gliding card rows",
    notes: [
      "On phones and tablets the About page is shorter: Our Story, Services We Offer, Our Journey, Why Choose We3vision and Our Leaders are rows of cards that glide sideways by themselves (1 second after they come into view; a touch takes over). The long texts under the headings are hidden on a phone.",
      "The gliding rows now wait until the page part they belong to is ready, so the copies of the cards never clash with the page.",
    ],
  },
  {
    v: 148,
    date: "2026-11-13",
    title: "New product: WePte",
    notes: [
      "WePte (wepte.online) is added to our products: a fifth card on the home page grid (phone slider too), the Products stat now shows 5, and it is in the products list, the menu and the footer.",
    ],
  },
  {
    v: 147,
    date: "2026-11-13",
    title: "One button feel, no cursor-following, phone Metaverse tiles, launcher removed",
    notes: [
      "The main buttons of every page now share one look and feel: the same pill shape, the same small lift on hover, the same press and the same keyboard focus ring. No button follows the mouse any more (the home page magnet and the tilt of the contact choices are gone).",
      "The dark shadow behind headings and intro text that moved while scrolling is removed.",
      "Phones and tablets: the cards that glide sideways now start 1 second after they come into view (it was 2 seconds). The Metaverse section of the home page is shorter on a phone: four icon tiles and the button at the end.",
      "The old phone launcher (app-style home screen) code is removed; the address /m goes to the home page.",
    ],
  },
  {
    v: 146,
    date: "2026-11-13",
    title: "Problem in soft red, answer in soft green",
    notes: [
      "Everywhere a problem is shown with its answer, the problem is now in a soft red and the answer in a soft green, so it is clear at a glance: the Brand design and AI development sections of the home page (laptop and phone), the Problems AI can take off your plate rows of the AI Development page, and its phone version.",
    ],
  },
  {
    v: 145,
    date: "2026-11-13",
    title: "Phone home refresh: calmer hero, gliding cards, clearer AI and Brand sections",
    notes: [
      "Phone home first screen is smaller and calmer: the numbers strip and the Explore button are removed, and the wish line and the studio title are two clear blocks with one type scale.",
      "The About text now says what We3vision is: a software and digital company in Surat that builds websites, apps, AI and more.",
      "On phones and tablets the swipe rows (why cards, Our products, AI work cards, bento row) glide slowly from right to left, start 2 seconds after they come into view, give way to a touch and glide on from where the finger left them. The Our products heading stays in place.",
      "The AI development section on the phone has less text, a top-to-bottom picture of how it works, swipe cards and Problem / With AI cards.",
      "The Brand design section on the phone shows What you get as four icon tiles, and the problem in soft red and the answer in soft green.",
    ],
  },
  {
    v: 144,
    date: "2026-11-12",
    title: "AI development section, Industrial Training pages",
    notes: [
      "New AI development section on the home page: what we build, what you get and the problems AI can take off your plate.",
      "The home stats strip now shows 4 Products instead of 6 Technology platforms.",
      "New Industrial Training pages for 3, 6 and 9 months (what is learned month by month, SDLC, ISO 9001 based practice, industry contacts, domains and fees), in the laptop menu, the phone menu, the phone launcher and the sitemaps.",
      "New Admin > Industrial Training screen to add, edit, hide and order the courses and set the fee of each for 3, 6 and 9 months.",
      "The training pages fit phones and tablets.",
    ],
  },
  {
    v: 143,
    date: "2026-11-12",
    title: "Metaverse service section with Ask Panda, Glimmer drawings",
    notes: [
      "New Metaverse service section on the home page: a glowing one-line Ask Panda bar (answers about our metaverse service) and four cards on what we build.",
      "The moving dot on the Process line of the home page is removed.",
      "Four new glowing night drawings (plant, mushrooms, moon, tree) on the 404 page, the error page, the contact Message sent and the job application sent screens.",
      "The first-visit name question now blurs in and out smoothly.",
    ],
  },
  {
    v: 142,
    date: "2026-11-11",
    title: "Brand Design section on the home page",
    notes: [
      "New Brand Design section on the home page after the services: what brand design is, who it is for, what you get (strategy, logo, identity and guidelines, collateral) and the problem and solution, with buttons to the contact page and the Brand Identity page.",
    ],
  },
  {
    v: 141,
    date: "2026-11-11",
    title: "Smoother home scroll, wish line fades with the door",
    notes: [
      "The home first screen (the fly-through into the door) now scrolls smoothly: its 3D layers are painted once and moved by the graphics card.",
      "\"This year, open your success door\" blurs and fades out as the door comes close, so it no longer gets lost in the light of the door.",
    ],
  },
  {
    v: 140,
    date: "2026-11-11",
    title: "Fest and welcome message removed, Portfolio glass on phones",
    notes: [
      "The Fest system is removed from the website and the admin panel: no festival decorations, no Admin > Fest page.",
      "The 3-second welcome message at the start is removed: the site opens straight on the home page.",
      "Phones and tablets: the Portfolio board is 2 columns on a tablet and 1 on a phone, with glass cards and filter chips.",
    ],
  },
  {
    v: 139,
    date: "2026-11-11",
    title: "Phone and tablet UI refresh, product links",
    notes: [
      "Phones and tablets get a dark glass look: frosted cards on every service page, the home page (stats, steps, services) and the contact page, in the theme colours.",
      "The Contact page is one column on phones, so the form is no longer cut off.",
      "The bottom dock has a glass ring and a white Menu label, and the menu shows the 7 services as tiles.",
      "WeBugMate and WeThink link to their own websites. WeJobs and WePresent show a \"Coming soon\" label in the menu and on the home cards.",
    ],
  },
  {
    v: 138,
    date: "2026-11-10",
    title: "Plans and pricing, app showcase, graphic pills, phone hero",
    notes: [
      "New \"Plans & pricing\" section, editable in Admin > Pages and usable on any service page. Brand Design has 3 pinned-note plans and Graphic Design has 3 monthly plan cards.",
      "New \"App showcase\" section (tablet with two phones) on the Mobile App Development page, and a pill word board on the Graphic Design page.",
      "The home phone hero follows the new reference with the wish line in the flow, so it never overlaps the door. The home menu is readable over the purple tools slider.",
      "Back to top now blurs the page, jumps to the top of the hero and eases it back in.",
    ],
  },
  {
    v: 137,
    date: "2026-11-09",
    title: "AI page redesigned, new 300+ section, home hero words",
    notes: [
      "The AI page has a new first screen: an AI lab graph (data in, one core, five kinds of AI, jobs done, an agent panel) that fits laptop screens.",
      "The AI page sections are redesigned: What we build, How we build, Why We3vision, Industries, Tools, the story and the FAQ.",
      "Home: \"This year, open your success door\" over the door, AI and Metaverse highlighted, a new 300+ section, and \"industry\" highlighted in the industries title.",
    ],
  },
  {
    v: 136,
    date: "2026-11-09",
    title: "Home page polish: 300+ card, tools slider, menu colour",
    notes: [
      "The 300+ card is smaller on the web and fits the card on phones. The first-screen words sit above the diyas.",
      "The tools are three sliding lines instead of the ball. On phones the product cards swipe under a fixed heading and animate as they pass.",
      "The menu pop-up uses the same dark violet as the home page.",
    ],
  },
  {
    v: 135,
    date: "2026-11-08",
    title: "The home page is redesigned for phones",
    notes: [
      "On phones the first screen is a full-screen door with the words, a Start your project button, Explore and three facts. The door grows and the words fade as you scroll away.",
      "Points, products and industries are swipe rows, the services are a compact board with Branding on top, and the process is a timeline. Screens wider than 900 px are unchanged.",
    ],
  },
  {
    v: 134,
    date: "2026-11-08",
    title: "The home page works on phones",
    notes: [
      "The new home page now has a phone layout (screens under 900 px wide): the door stands above the words, and every section becomes one column. Phones no longer go to the old /m launcher for the home page.",
      "On phones the pinned fly-through is replaced by plain scrolling; Explore scrolls to the About part. Desktop and laptop are unchanged.",
    ],
  },
  {
    v: 133,
    date: "2026-11-07",
    title: "Diwali diyas at the gate of the home page",
    notes: [
      "In a Diwali festival the home page shows a row of flickering diyas with a warm glow on the dune on both sides of the glowing door. They zoom in with the door when you scroll.",
      "A new switch, Diyas at the gate of the home page, is in Admin > Fest, group Places. It is on by default and nothing is downloaded when no festival is on.",
    ],
  },
  {
    v: 132,
    date: "2026-11-07",
    title: "New home page, Services, Portfolio and Contact in the new design",
    notes: [
      "The home page is now the new dark design: a glowing door that the scroll flies through, a lit disc, our four reasons, products, services as seven animated cards (Branding is the hero), a big number, the process, industries, global reach, tools and a contact form.",
      "A new Services page (/services) shows the seven main services with a picture, what we build and who it is for. The Portfolio page is now a board of project cards with category filters, and the Contact page has the contact cards and a new form with the same checks as before.",
      "These pages have a new footer in the same design. The menu bar is unchanged. The scroll through the door is lighter and smoother, and Explore glides to the About part. Laptop only; phones keep their own pages.",
    ],
  },
  {
    v: 131,
    date: "2026-11-07",
    title: "Home 2: scroll flies through the door",
    notes: [
      "On /home-2 the first screen is now pinned and the scroll moves the camera: it zooms into the centre of the glowing door, passes through the light, comes out of the middle of the disc and pulls back to the About part. Reduced motion shows the parts one after another without the zoom.",
    ],
  },
  {
    v: 130,
    date: "2026-11-07",
    title: "Home 2: a new home page design (not linked)",
    notes: [
      "A second home page at /home-2 in a new dark design: a glowing arch with dunes and a first screen with our words, then a statement with a lit disc and the four reasons to choose us, then our four products on a hairline grid. It scrolls smoothly and the pieces drift and rise in as you scroll.",
      "Nothing links to it and search engines skip it. The main home page is unchanged until Home 2 is approved and replaces it. Laptop only.",
    ],
  },
  {
    v: 129,
    date: "2026-11-07",
    title: "Phone project form fits one screen",
    notes: [
      "On phones the first step of the project form (What would you like to make) is much shorter: eight small tiles with the icon beside the name and a short question, so the whole step is visible on one screen. A tick shows on the chosen tiles. Laptops are unchanged.",
    ],
  },
  {
    v: 128,
    date: "2026-11-07",
    title: "Industry cards drift by themselves on phones",
    notes: [
      "On phones and tablets the row of industry cards moves sideways by itself, to the end and back, while it is on screen. A touch or a drag takes over and the drift starts again 2.5 seconds later. It stays still for visitors who prefer less motion.",
    ],
  },
  {
    v: 127,
    date: "2026-11-07",
    title: "Phone menu redesigned",
    notes: [
      "The menu on phones and tablets is a solid dark sheet with the same curve as the first screen box. The products are a row of tall cards you swipe with a big ghost number, and the pages are one editorial list with a number, a big name and an arrow. Laptops are unchanged.",
    ],
  },
  {
    v: 126,
    date: "2026-11-07",
    title: "20 live cursors and the live visitor count in the menu",
    notes: [
      "Up to 20 visitors on the same page now see each other's cursors (the old default of 5 moves to 20; Admin > Visitors can still change it). The server holds who is where and sends it to everybody. The menu shows how many people are live on the website right now; phones are counted too (they only say hello every 12 seconds and show no cursor).",
    ],
  },
  {
    v: 125,
    date: "2026-11-07",
    title: "Smoother phone scrolling",
    notes: [
      "On phones and tablets the glass cards of the page no longer blur what is behind them (the tint stays), the background lights stand still instead of moving on every scroll frame, and the globe draws fewer pixels. The bottom bar and the menus keep their own lighter blur. Laptops are unchanged.",
    ],
  },
  {
    v: 124,
    date: "2026-11-07",
    title: "Admin: icon buttons everywhere, softer laptop scrolling",
    notes: [
      "More admin actions are icon buttons with a tooltip: the application drawer (previous, next, close, e-mail, WhatsApp, call, resume, LinkedIn, remove), the Back buttons of the Careers screens and the Open the page links. On a laptop the mouse wheel glides a little longer and a fast wheel no longer jumps.",
    ],
  },
  {
    v: 123,
    date: "2026-11-07",
    title: "Admin panel: icon buttons and a denser look",
    notes: [
      "In the admin panel the small actions are icon buttons with a tooltip (edit, delete, hide or show, move up or down, view live, copy link, duplicate, open or close a job, mark as read, back). Main actions such as Save and Add keep their words. Cards, fields and buttons are tighter, one control height, and every control has a clear keyboard focus ring.",
    ],
  },
  {
    v: 122,
    date: "2026-11-07",
    title: "Phone services in one card with smooth opening",
    notes: [
      "On phones all seven services sit in one glass card, one line each. A tap opens that service smoothly under its line with what we build and a link to its page, and the card and its lines come in one after the other when the section reaches the screen.",
    ],
  },
  {
    v: 121,
    date: "2026-11-07",
    title: "Bottom bar as wide as the first screen box",
    notes: [
      "On phones and tablets the bottom bar is exactly as wide as the box of the first screen, with the same left and right edge.",
    ],
  },
  {
    v: 120,
    date: "2026-11-07",
    title: "Bottom bar has the same curve as the first screen box",
    notes: [
      "On phones and tablets the bottom bar is a rounded square with the same corner curve as the box of the first screen (22px on a phone, 28px on a tablet) instead of a pill. The lit tab follows the inner curve.",
    ],
  },
  {
    v: 119,
    date: "2026-11-07",
    title: "Phone: Home goes to the top, services as one clear list",
    notes: [
      "On a phone, tapping Home in the bottom bar while you are on the home page smooths you back up to the first screen. The services are one clear list on phones: all seven names with a short line and an arrow, each row opens its service page.",
    ],
  },
  {
    v: 118,
    date: "2026-11-07",
    title: "First-screen button: no animation, glow on hover",
    notes: [
      "The Start a project button of the first screen has no animation now (no ping ring, no light sweep, no arrow slide, no growing). On hover it only glows.",
    ],
  },
  {
    v: 117,
    date: "2026-11-07",
    title: "Name question: blurred page and theme glow",
    notes: [
      "When the site asks What should we call you, the page behind is blurred strongly and two slow glows in the colours of the company theme drift behind it, with a soft breathing light around the question.",
    ],
  },
  {
    v: 116,
    date: "2026-11-06",
    title: "Phone Services and Industries look alike",
    notes: [
      "On phones the Services and Industries sections now share one look: same heading size, same swipe cards with a number, a name and a short line, same spacing.",
    ],
  },
  {
    v: 115,
    date: "2026-11-06",
    title: "Technology board fits on a laptop",
    notes: [
      "On a laptop the group tabs of the Technologies board stay inside their frame and the tabs and tiles are smaller and quieter.",
    ],
  },
  {
    v: 114,
    date: "2026-11-06",
    title: "Phone first screen fits one screen",
    notes: [
      "On phones the first screen is exactly one screen tall and ends above the bottom menu. There is room for the logo on top, the words sit low on the screen, and the Recognised logos are at the bottom with some air above them. Laptops are unchanged.",
    ],
  },
  {
    v: 113,
    date: "2026-11-06",
    title: "Phone home page: premium and light",
    notes: [
      "On phones and tablets the Technologies section is not shown. On phones the services are swipe cards, the industries are one row of small cards, and the first screen is shorter with smaller words and more empty space. Laptops are unchanged.",
    ],
  },
  {
    v: 112,
    date: "2026-11-06",
    title: "Phone home page takes less space",
    notes: [
      "On phones the technologies are one swipe row of small tiles (the group names too) with the card of the chosen one under it. The first screen has no empty hole, the services list, Global Reach and Contact are tighter with smaller words. Laptops are unchanged.",
    ],
  },
  {
    v: 111,
    date: "2026-11-06",
    title: "Phone polish: smaller words, compact cards",
    notes: [
      "On phones and tablets the AI card of the first screen and the row of group words under Our services (Development, Creatives and so on) are not shown any more. On phones the first screen, the Industries cards and the address cards have smaller words and tighter cards, and the custom scroll line is gone. Laptops are unchanged.",
    ],
  },
  {
    v: 110,
    date: "2026-11-06",
    title: "UX audit tool and a first round of UI / UX fixes",
    notes: [
      "New audit tool (tools/ux-audit): opens every page on a laptop and an iPhone, lists every UI / UX / accessibility problem one per line, counts buttons, links and words per page, and writes the CSS cures.",
      "Problems found on the local pages fell from 1912 to 414: small text, low contrast, tap targets, lonely last words, invisible keyboard tab stops, missing skip link and share picture on phone pages, and a broken script on every phone page (the desktop guard).",
    ],
  },
  {
    v: 109,
    date: "2026-11-06",
    title: "Contact first screen redesigned",
    notes: [
      "The receptionist avatar, her chat and the office room are removed from the Contact page. The first screen is now a heading and five path cards (services, work, your problem, join the team, start a project) with a light that follows the pointer. It works the same on a laptop, a tablet and a narrow window.",
    ],
  },
  {
    v: 108,
    date: "2026-11-06",
    title: "Footer console on narrow windows",
    notes: [
      "On a narrow window the console grows with its text instead of being a small scrolling box, and on a tablet the logo and the text sit in a row under it.",
    ],
  },
  {
    v: 107,
    date: "2026-11-06",
    title: "Footer console is easier to understand",
    notes: [
      "The footer console explains itself: a short 3-step guide in the window, buttons grouped as Pages (with the number of pages) and For fun, a clearer input hint and a helpful answer when a word is not known.",
      "The window starts empty again on a refresh and also on every new page.",
    ],
  },
  {
    v: 106,
    date: "2026-11-06",
    title: "More footer commands",
    notes: [
      "The footer console has six more commands next to services, technology and company: brand, marketing, software, products, home (the sections of the home page) and social. Each one lists links to the real pages.",
    ],
  },
  {
    v: 105,
    date: "2026-11-06",
    title: "Footer: one wide console",
    notes: [
      "The footer console is now as wide as the page, with the logo, the sentence and the social icons in a row under it.",
      "The Services, Technology and Company link columns are removed from the footer; the console buttons and commands open the same pages (the links stay in the page for search engines and screen readers).",
    ],
  },
  {
    v: 104,
    date: "2026-11-06",
    title: "Sections wake up on scroll",
    notes: [
      "Every section under the first screen now loads and starts its code only when it comes near the screen. The text is still in the page, so search engines see it as before. Home first load JS 283 to 202 KB, blocking time 89 to 28 ms.",
    ],
  },
  {
    v: 103,
    date: "2026-11-06",
    title: "Lighter first load",
    notes: [
      "The chat answer reader (markdown, about 43 KB) is now downloaded only when the first answer arrives, not while the home page or the menu loads. Home first load JS 283 to 239 KB.",
    ],
  },
  {
    v: 102,
    date: "2026-11-06",
    title: "Technology board and Global Reach",
    notes: [
      "Technology board redesigned: one calm rail of groups, tiles with a light that follows the pointer, and a glass card with a big outline monogram whose lines rise in one after the other.",
      "Global Reach is no longer pinned to the scroll: the section scrolls like the others and the globe turns round by itself all the time, smoothly; the list lights up the country the globe is sending light to.",
      "The box behind the Startup India and MSME logos on the first screen is removed.",
    ],
  },
  {
    v: 100,
    date: "2026-11-06",
    title: "Hero polish",
    notes: [
      "The first screen is more elegant: a soft slow aurora and a fine grid behind it, a heading that rises word by word with a violet gradient on its last words, a glowing dot in the tag, a hairline above Recognised by and a light sweep on the Start a project button.",
    ],
  },
  {
    v: 99,
    date: "2026-11-06",
    title: "Home celebration removed",
    notes: [
      "The Home celebration switch, the hero button and the full-window screen are removed from the Fest theme (owner's order).",
    ],
  },
  {
    v: 98,
    date: "2026-11-06",
    title: "Home celebration: the footer family, big",
    notes: [
      "The home celebration screen is blank except for the date, Happy Dhanteras and Esc to exit.",
      "The same family as in the footer (the puja at the mandir, grandparents, children with crackers, the cat) celebrates on the same flat floor, drawn big.",
    ],
  },
  {
    v: 97,
    date: "2026-11-06",
    title: "Home celebration: art removed, floor kept",
    notes: [
      "The Dhanteras story, house, people and rockets are gone from the home celebration.",
      "What is left: the blurred hero, the date, Happy Dhanteras and an empty flat floor like the one in the footer.",
    ],
  },
  {
    v: 96,
    date: "2026-11-06",
    title: "Home celebration: Happy Dhanteras",
    notes: [
      "New switch in Admin > Fest > Places: Home celebration. It is off until you turn it on.",
      "A glowing button on the hero. One click blurs the hero, locks the page and opens a full-window night scene.",
      "The scene shows today's date, Happy Dhanteras, the story of the day in four pictures, and below it people decorating a house, making a rangoli and bursting crackers.",
      "It is plain SVG and CSS in its own chunk, fetched only after the click. No library is loaded and nothing else of the page is drawn while it is open.",
    ],
  },
  {
    v: 95,
    date: "2026-11-06",
    title: "New AI card on the first screen",
    notes: [
      "The purple rings behind the first screen are gone and so is the old chat card.",
      "New PANDA card: a greeting, three ways to start, service chips, the conversation and one field.",
      "The border of the card glows where the mouse is and fades out when it leaves.",
    ],
  },
  {
    v: 94,
    date: "2026-11-04",
    title: "Home page redesign",
    notes: [
      "Services: one pinned screen with a list and a stage, the scroll walks through all seven (an accordion on a phone).",
      "First screen: the AI of the big menu (PANDA) is open next to the heading, on a laptop and on a phone.",
      "Industries: one flick of the mouse wheel moves to the next industry.",
      "Technology: a board with groups, tiles and a detail card. Global reach: a pinned globe that turns to every country while you scroll.",
      "Footer: a small console to play with, a live clock of Surat, a spotlight that follows the mouse and a bigger headline.",
    ],
  },
  {
    v: 93,
    date: "2026-11-04",
    title: "Quiet tech stack, one phone button",
    notes: [
      "Home page: the Technology section is now a quiet list of groups with the technologies as plain words and one line about the one you hover. The planets stay on the service pages.",
      "Phone and tablet home page: the first-screen button, Start your project buttons and Back to top now share one button design.",
    ],
  },
  {
    v: 92,
    date: "2026-11-04",
    title: "Size budget before every push",
    notes: [
      "The push command now checks the size budget of the last build and refuses a push when a page got heavier than allowed.",
      "A GitHub check (types, lint, build, size budget) runs on every push. No change on the website.",
    ],
  },
  {
    v: 91,
    date: "2026-11-04",
    title: "Less polling",
    notes: [
      "Live cursors: a visitor who is alone on the site with a still pointer now asks the server every 3 seconds instead of every 0.6 seconds. With another visitor or a moving pointer it is as fast as before.",
      "The festival settings check of the open pages runs every 30 seconds instead of every 10 seconds (a change in Admin > Fest in the same browser still shows at once).",
    ],
  },
  {
    v: 90,
    date: "2026-11-04",
    title: "Pages editor removed",
    notes: [
      "The Pages text editor is removed from the admin panel (menu, dashboard card, editor, save and publish). The website keeps showing the text it shows now.",
      "Team, Careers, Blog, Projects, Site settings, Fest and the AI tools are not changed.",
    ],
  },
  {
    v: 89,
    date: "2026-11-03",
    title: "Lock editor and content version removed",
    notes: [
      "The Lock editor button and the content version number are removed from the admin panel and the website.",
      "The website no longer asks for a version number every 15 seconds, so it runs lighter. Only the festival theme still updates live.",
    ],
  },
  {
    v: 88,
    date: "2026-11-03",
    title: "Content version and Lock editor",
    notes: [
      "The content of the website now has one version number that goes up with every publish (pages, site settings, blog, projects, team).",
      "The open pages ask only that small number every 15 seconds, never the content, and load the new content once when it changed. A reload always checks first.",
      "A Lock editor button in the top bar of the admin panel (like Publish) makes the content final: nothing can be published until Unlock editor, and the pages stop asking.",
    ],
  },
  {
    v: 87,
    date: "2026-11-02",
    title: "Visitor name, live cursors, Admin Visitors",
    notes: [
      "A first-time visitor of the laptop website is asked for one thing after the welcome message: a name. The name is the label of their cursor.",
      "Visitors on the same page see each other as live cursors with names, in one colour that is never their own. Admin > Visitors sets how many cursors one visitor sees; the visitors who came in first are shown first.",
      "Admin > Visitors lists who opened the website: name, first visit, last seen, visits, device and last page.",
    ],
  },
  {
    v: 86,
    date: "2026-11-02",
    title: "Welcome message before the site opens",
    notes: [
      "Every visitor first sees a calm message for 3 seconds: for the best experience open the site on a laptop, then Click and celebrate. There is no button.",
      "The message blurs away and the home page is there. It shows once per browser tab, on the laptop site and on the phone and tablet site.",
    ],
  },
  {
    v: 85,
    date: "2026-11-02",
    title: "Phone: picker shift, tool chips, technologies list",
    notes: [
      "On the phone pages the chip rows (industries, categories, steps) now scroll only the row; before, picking the last chip pushed the whole section to the left and cut the first letters.",
      "The tools of a page (for example The Tools We Design With) are glass chips, so a name never breaks in the middle.",
      "The technologies on the home page are one list on a phone: every row has the same height and every name stays on one line.",
    ],
  },
  {
    v: 84,
    date: "2026-11-01",
    title: "Footer: tidy columns",
    notes: [
      "The footer columns got widths that fit their links (Technology is the widest), so no link wraps and the gaps between the lists look even.",
      "More room between the logo, the text and the social buttons.",
    ],
  },
  {
    v: 83,
    date: "2026-11-01",
    title: "Home page: one colour",
    notes: [
      "The hero (rings, glow, pills, button, tech stack tiles on a phone) used a bluer pink-violet; it now uses the same violet as the other sections of the home page, so all of them match and follow the theme colour.",
    ],
  },
  {
    v: 82,
    date: "2026-11-01",
    title: "Fest: separate settings for phone and tablet",
    notes: [
      "Admin Fest has two lists now: Laptop and desktop (every effect, as before) and Phone and tablet (one shared list for screens under 1024px).",
      "The phone list has the layer above the page (lanterns, fireworks, kandils, toran, diyas, glow and more) and what a tap does (crackers, rangoli bloom).",
      "Old saved settings keep working: the phone list starts from what the laptop list had.",
    ],
  },
  {
    v: 81,
    date: "2026-11-01",
    title: "Phone and tablet: hero button, tech stack, tap crackers",
    notes: [
      "On phones and tablets the Start a project button is a violet pill with a round arrow and a slow ping ring; the rings only glow softly at the back.",
      "The tech stack at the bottom of the home page has a sun, glass tiles with an arrow, a Tap hint, and four columns on a tablet.",
      "On a phone or tablet a tap anywhere (not on a link or button) launches the festival crackers, like a click on a laptop.",
      "The Explore decoration of the big menu now appears only after the menu has opened.",
    ],
  },
  {
    v: 80,
    date: "2026-10-31",
    title: "Big menu: Diwali touch-up",
    notes: [
      "The big menu lost the corner lamps, the rangolis and the people under the service lists; the flower garland on top stays.",
      "In the Explore row two colleagues burst crackers on the line and three lamps hang below it, each swinging like a real pendulum.",
      "The lamps of the page hide while the menu is open.",
    ],
  },
  {
    v: 79,
    date: "2026-10-31",
    title: "Hero: soft glow, logos, any screen size",
    notes: [
      "The light behind the Start a project button is now a soft blurred glow that fades into the page colour (no rays).",
      "The At a glance panel under the hero is removed; the Startup India and MSME logos now sit in the hero as glass pills.",
      "The hero scales with the screen, so a 1920 x 1080 screen and small laptops show one full first screen.",
    ],
  },
  {
    v: 78,
    date: "2026-10-31",
    title: "Numbers and journey, hero light, fest hanging",
    notes: [
      "At a glance is now two rows of glass tiles: company numbers on top and the years 2019 to 2026 below, with their milestone text always shown on the year tiles; a number tile shows its words and glows when the cursor is on it.",
      "The hero rings fade into the page colour and the Start a project button sends out soft rays and a glow on hover.",
      "Fest: the toran hangs from the very top pixel and sways, the kandils swing like real pendulums, and the ground next to the logo is gone.",
    ],
  },
  {
    v: 77,
    date: "2026-10-31",
    title: "Home hero, numbers and glass cards",
    notes: [
      "New home hero: a calm heading and sentence on the left, glowing rounded rings on the right with one Start a project button.",
      "The At a glance numbers are now a panel of frosted glass number tiles that run sideways and count up, with the Startup India / MSME recognitions. Cards across the site share one glass look.",
    ],
  },
  {
    v: 76,
    date: "2026-10-31",
    title: "Home services: redesigned stage",
    notes: [
      "The services of the home page on a laptop are one calm frame: the list on the left, the words and a bigger animated drawing on the right, and the four parts of the service in a row under them.",
      "Fixed scroll: the stage stays on the screen while you scroll and the scroll opens the services one after the other (it settles on one when you stop); round arrow buttons, a click and the arrow keys scroll to a service.",
      "The frame keeps one size so the page does not jump, and it fits one laptop screen.",
    ],
  },
  {
    v: 75,
    date: "2026-10-31",
    title: "Home services: one animated stage",
    notes: [
      "The services of the home page on a laptop are now a list and one animated stage (a drawing for AI, web, app, metaverse, UI/UX, CRM and brand) that changes by itself and by click.",
      "The walking guide on the road is gone from the home page; phone and tablet keep the swipe cards.",
    ],
  },
  {
    v: 74,
    date: "2026-10-30",
    title: "Phone: calmer service wheel",
    notes: [
      "The service wheel on a phone is taller, with soft top and bottom edges, a blurred page behind it and smaller names.",
      "The groups are plain tabs, and the bottom bar folds into the Home icon while the wheel is open.",
    ],
  },
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
