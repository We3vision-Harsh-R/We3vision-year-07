// Physical Marketing page: the text. Conceptual examples only: no invented locations, inventory, prices, attendance or results. We3vision designs and plans;
// printing, media buying, production and installation may need outside partners and depend on the approved scope.

export const PHY_FORMATS = [
  { k: "billboard", t: "Billboard", use: "Brand visibility on busy roads and landmarks; announcements; launches.", read: "Seven words or fewer, large type, one image." },
  { k: "poster", t: "Poster", use: "Notice boards, shops, campuses, transit areas; events and offers.", read: "One strong visual, one headline, one action." },
  { k: "brochure", t: "Brochure", use: "Sales meetings, reception desks, mailers; explaining a service in detail.", read: "A clear fold structure and a story that flows panel to panel." },
  { k: "catalogue", t: "Product catalogue", use: "Dealers, distributors and buyers; showing a full range.", read: "A consistent grid, clear product names and easy-to-find codes." },
  { k: "retail", t: "Retail display", use: "Shelves and counters in shops; promotions at the point of sale.", read: "A header that works from the aisle and products at eye level." },
  { k: "backdrop", t: "Event backdrop", use: "Stages, press moments and photo opportunities.", read: "A repeat pattern that looks good in photos from any angle." },
  { k: "stand", t: "Exhibition stand", use: "Trade shows and expos; meeting visitors and capturing leads.", read: "Readable from the aisle, with an open, welcoming layout." },
  { k: "merch", t: "Branded merchandise", use: "Gifts, welcome kits and giveaways that keep the brand in daily life.", read: "A simple mark that works on many materials." },
];

export const PHY_MEDIA = [
  { t: "Outdoor Advertising", items: ["Billboards and hoardings", "Outdoor posters", "Transit advertising where available", "Local-area advertising", "Building and storefront signage"], what: "Large-format messages seen by people on the move.", where: "Roads, junctions, building fronts and local neighbourhoods.", deliver: ["Outdoor artwork in the right sizes", "Simple, readable layouts", "QR or short-URL planning"], plan: ["Viewing distance and speed", "Location and permissions", "Lighting and weather"], next: "Share the location idea and the message; we shape the artwork." },
  { t: "Print Marketing", items: ["Brochures", "Flyers and leaflets", "Catalogues", "Posters", "Direct mail", "Product information sheets", "Sales collateral"], what: "Printed pieces people can hold, keep and share.", where: "Meetings, mailers, counters, events and shops.", deliver: ["Print-ready artwork", "Layouts and folds", "Production specifications"], plan: ["Paper, size and finish", "Quantity and budget", "How the piece connects to a web page"], next: "Tell us what the piece must do; we design and prepare it for print." },
  { t: "Retail and Point-of-Sale", items: ["In-store displays", "Promotional stands", "Product display materials", "Window graphics", "Point-of-sale branding", "Retail signage"], what: "Materials that influence the choice at the moment of purchase.", where: "Shops, counters, shelves, windows and entrances.", deliver: ["Display and signage artwork", "Window and shelf graphics", "Production-ready files"], plan: ["Store layout and sight lines", "Materials and durability", "Installation access"], next: "Share the shop type and the products; we design the display." },
  { t: "Events and Exhibitions", items: ["Event backdrops", "Exhibition graphics", "Stall and booth branding", "Directional signage", "Event collateral", "Promotional materials"], what: "A branded presence at events, trade shows and launches.", where: "Venues, expo halls, conferences and launch events.", deliver: ["Booth and backdrop graphics", "Signage sets", "Handouts and giveaways"], plan: ["Venue rules and dimensions", "Build and dismantle time", "Lead capture after the event"], next: "Send the event details; we plan the identity and the materials." },
  { t: "Corporate and Promotional Materials", items: ["Corporate stationery", "Business cards", "Company profiles", "Product samples and promotional kits", "Branded merchandise", "Corporate event materials"], what: "Everyday materials that carry the brand into meetings and homes.", where: "Offices, client meetings, welcome kits and gifts.", deliver: ["Stationery and profile layouts", "Merchandise designs", "A consistent look across items"], plan: ["Brand guidelines", "Materials and quantities", "Delivery timeline"], next: "Share your brand files or ask for a brand kit first; we then design the set." },
  { t: "Experiential and Activation Campaigns", items: ["Brand activation concepts", "Product demonstrations", "Sampling campaign materials", "On-ground promotional campaigns", "Interactive physical experiences"], what: "Ways for people to try, touch and experience the brand in person.", where: "Malls, campuses, community events and pop-ups.", deliver: ["Activation concepts", "Campaign materials and signage", "Lead-capture and follow-up flow"], plan: ["Permissions and safety", "Staffing and logistics", "Capturing responses"], next: "Tell us who you want to meet and where; we shape the idea." },
];

export const PHY_JOURNEY = [
  { t: "First physical impression", touch: "Outdoor sign or poster", piece: "poster", role: "Gets noticed and plants the name.", measure: "A dedicated URL or QR code visit, or a simple “how did you hear about us?” question." },
  { t: "Brand recognition", touch: "Signage and storefront", piece: "billboard", role: "Makes the brand familiar through repeated, consistent exposure.", measure: "Recall in conversations or surveys." },
  { t: "Product or service discovery", touch: "Brochure or catalogue", piece: "brochure", role: "Explains what you offer and why it matters.", measure: "Requests for quotes that mention the material." },
  { t: "Customer interaction", touch: "Retail display or booth", piece: "retail", role: "Lets the person see, ask and try.", measure: "Conversations started, samples given, sign-ups." },
  { t: "Response or purchase", touch: "Packaging and point of sale", piece: "box", role: "Helps the person decide and buy.", measure: "Sales of the featured item, redemptions of a code." },
  { t: "Follow-up and retention", touch: "Stationery, merchandise and mailers", piece: "card", role: "Keeps the relationship going after the first purchase.", measure: "Repeat orders and referrals." },
];

export const PHY_COLLATERAL = [
  { k: "brochure", t: "Brochure", note: "Folds guide the reader: cover, benefit, proof, action. Typography and colour keep each panel connected." },
  { k: "flyer", t: "Flyer", note: "One page, one idea. A large headline, one offer and a clear way to respond." },
  { k: "catalogue", t: "Catalogue", note: "A strong grid and consistent product blocks make a long range easy to scan." },
  { k: "poster", t: "Poster", note: "Seen from a distance: a big picture, a short line and a single action." },
  { k: "card", t: "Business card", note: "Small, but it carries the brand. Simple hierarchy, readable contact details." },
  { k: "box", t: "Product packaging", note: "A box works on a shelf and in the hand. The mark, the name and the key benefit come first." },
  { k: "backdrop", t: "Event backdrop", note: "A repeating logo pattern looks right from any camera angle." },
];

export const PHY_OUTDOOR = [
  { d: 5, t: "Up close (about 5 m)", g: "People can read short paragraphs and small print, such as a shop window." },
  { d: 15, t: "Walking distance (about 15 m)", g: "A headline and a short line. Keep details for a QR code or a web page." },
  { d: 30, t: "Across a street (about 30 m)", g: "One short headline and the logo. A very simple image." },
  { d: 60, t: "From a vehicle (about 60 m)", g: "Seven words or fewer, huge type, strong contrast. Nothing else." },
];
export const PHY_OUTDOOR_POINTS = ["Outdoor media planning", "Audience and location considerations", "Creative format adaptation", "Message readability at a distance", "Call-to-action selection", "QR codes and trackable campaign links", "Coordination with media owners and production partners where applicable"];

export const PHY_EVENT = [
  { t: "Entrance", d: "The first look: event identity, arrival signage and a clear welcome.", items: ["Entrance arch or gate graphics", "Directional signage"] },
  { t: "Registration", d: "Where people check in: branded desk, printed or digital badges and a first handout.", items: ["Desk graphics", "Badges and welcome kit"] },
  { t: "Main display", d: "The centre of attention: stage backdrop, product display or booth wall.", items: ["Stage backdrop", "Product display system"] },
  { t: "Engagement zone", d: "Where people try, play and talk: demos, interactive experiences and photo spots.", items: ["Interactive experience concept", "Branded photo opportunity"] },
  { t: "Follow-up", d: "Where the event continues: lead capture, QR codes, thank-you materials and a digital follow-up.", items: ["Lead capture", "Brochures and merchandise"] },
];

export const PHY_CONNECT = [
  { k: "Brochure", url: "service-page", medium: "print", step: "A QR code or short URL on the back panel", page: "A service landing page for that brochure", conv: "Inquiry form", measure: "Visits and inquiries tagged to the brochure" },
  { k: "Billboard", url: "campaign", medium: "outdoor", step: "A short, memorable campaign URL", page: "A campaign page that repeats the billboard message", conv: "Call or inquiry", measure: "Visits to the campaign URL" },
  { k: "Event booth", url: "event-leads", medium: "event", step: "A QR code on the booth wall and badges", page: "A short lead form", conv: "Lead capture", measure: "Leads tagged to the event" },
  { k: "Product packaging", url: "product-info", medium: "packaging", step: "A QR code on the pack", page: "A product information page", conv: "Reorder or registration", measure: "Scans that become visits" },
  { k: "Retail display", url: "offer", medium: "retail", step: "A QR code or code word at the display", page: "A promotional landing page", conv: "Redemption or sign-up", measure: "Visits and redemptions" },
];
export const PHY_CONNECT_NOTE = "UTM parameters, QR codes, dedicated landing pages and lead capture can support measurement once they are set up. This page does not track any scans or conversions.";

export const PHY_FLOW = [
  { t: "Campaign brief and audience discovery", by: "We3vision", d: "We learn the goal, the audience and where they will meet the brand." },
  { t: "Media and format selection", by: "We3vision", d: "We recommend the formats that fit the goal and the budget." },
  { t: "Creative concept development", by: "We3vision", d: "Ideas, layouts and the message are developed and agreed with you." },
  { t: "Artwork preparation", by: "We3vision", d: "Final, print-ready or production-ready files with specifications." },
  { t: "Print or production coordination", by: "Partner may be needed", d: "Printers and fabricators produce the pieces. We coordinate where it is in the scope." },
  { t: "Vendor and installation coordination", by: "Partner may be needed", d: "Outdoor media owners or installers place the pieces, where this is included." },
  { t: "Campaign launch", by: "Shared", d: "The campaign goes live and we check that it looks right." },
  { t: "Response measurement and review", by: "We3vision", d: "We review responses with the tools that were set up, and plan the next round." },
];

export const PHY_DELIVERABLES = ["Creative design files", "Print-ready artwork", "Outdoor advertising artwork", "Event and exhibition graphics", "Retail and point-of-sale materials", "Promotional merchandise designs", "QR-enabled campaign materials", "Production specifications", "Installation-ready files where relevant"];

export const PHY_FAQ = [
  { q: "What services are included in physical marketing?", a: "Design and planning for print, outdoor, retail, event, promotional and activation materials, so your brand shows up in the real world and connects with your digital marketing." },
  { q: "Do you design brochures, posters and catalogues?", a: "Yes. We design them and prepare print-ready artwork, with specifications for the printer." },
  { q: "Can you help with billboard and outdoor advertising?", a: "We can plan the format and design the artwork. Media space, permissions and installation come from media owners and production partners, which we can coordinate where it is in the scope." },
  { q: "Do you manage event and exhibition branding?", a: "Yes. We can design booth and backdrop graphics, signage, handouts and a follow-up flow to capture leads." },
  { q: "Is printing included in your service?", a: "Design and artwork are ours. Printing and production depend on the approved scope and on vendor arrangements, and can be coordinated if included." },
  { q: "Can physical campaigns connect to digital marketing?", a: "Yes. QR codes, short URLs, dedicated landing pages and campaign tags can link a physical piece to an online action." },
  { q: "Can you coordinate production and installation?", a: "Where it is part of the scope, we coordinate with printers, fabricators and installers. This is agreed in the proposal." },
  { q: "How is the cost of a physical campaign calculated?", a: "It depends on the formats, quantities, materials, locations, production and installation requirements. We prepare a tailored proposal after we understand the brief." },
];
