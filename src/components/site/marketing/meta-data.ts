// Meta Marketing page: the text. Concept examples only: no invented costs, rates, results or client work. Features and objectives depend on the current Meta Ads platform.

export const MTA_OBJ = [
  { k: "Brand Awareness", short: "Awareness", explain: "Show your brand to people who are likely to remember it. It builds familiarity before anyone is ready to buy.", formats: ["Short video", "Reels-oriented creative", "Brand story carousel"], landing: "Brand story or home page", metrics: ["Reach", "Impressions", "Frequency"], setup: ["A clear, memorable message", "Frequency limits to avoid fatigue"], ad: { head: "Meet the brand behind the product", cta: "Learn more" }, event: "Brand recall" },
  { k: "Reach", short: "Reach", explain: "Show your ad to as many different people as the budget allows, for launches, events and local announcements.", formats: ["Single image", "Short video", "Story format"], landing: "Announcement or event page", metrics: ["Reach", "Frequency", "Cost to reach"], setup: ["A defined location and audience", "A creative that works in seconds"], ad: { head: "Something new is opening near you", cta: "See details" }, event: "People reached" },
  { k: "Traffic", short: "Traffic", explain: "Send interested people to a page on your website or app, such as a service page, article or product page.", formats: ["Image with a clear link", "Carousel of pages", "Video teaser"], landing: "A fast service, product or article page", metrics: ["Link clicks", "Landing-page views", "Cost per click"], setup: ["A fast mobile landing page", "UTM tags on every link"], ad: { head: "Find out how it works", cta: "Read the guide" }, event: "Landing-page view" },
  { k: "Engagement", short: "Engagement", explain: "Encourage people to react, comment, share, message or watch, which helps content travel and builds an audience.", formats: ["Interactive carousels", "Short video", "Question or poll-style creative"], landing: "A post, profile or message thread", metrics: ["Reactions and comments", "Video views", "Messages started"], setup: ["A plan for replying quickly", "A hook in the first seconds"], ad: { head: "Which would you choose?", cta: "Join in" }, event: "Reaction or message" },
  { k: "Lead Generation", short: "Leads", explain: "Collect enquiries from people who want to hear from you, through an instant form or a landing page.", formats: ["Image with an offer", "Video explaining the service", "Instant form"], landing: "A short enquiry form or landing page", metrics: ["Leads", "Cost per lead", "Lead quality"], setup: ["Questions that qualify the lead", "A fast hand-off to your team or CRM"], ad: { head: "Get a free consultation", cta: "Sign up" }, event: "Lead submitted" },
  { k: "Sales and Conversions", short: "Sales", explain: "Drive purchases or other valuable actions on your site, measured with correct tracking.", formats: ["Product carousel", "Offer image", "Short product video"], landing: "A product or offer page with a clear checkout path", metrics: ["Purchases or conversions", "Cost per result", "Conversion rate"], setup: ["Pixel and conversion events checked", "Product pages that match the ad"], ad: { head: "Your favourites, ready to order", cta: "Shop now" }, event: "Purchase" },
  { k: "Retargeting", short: "Retargeting", explain: "Reconnect with people who already visited, watched or engaged, where data and consent permit.", formats: ["Reminder creative", "Offer or benefit recap", "Testimonial-style content you are approved to use"], landing: "The page they left, or a tailored follow-up page", metrics: ["Frequency", "Conversion rate", "Cost per result"], setup: ["Audience size large enough to run", "Exclusions so buyers are not shown the same ad"], ad: { head: "Still thinking it over?", cta: "Continue" }, event: "Return visit" },
];
export const MTA_OBJ_NOTE = "Objectives and features depend on the current Meta Ads platform, your account eligibility and the campaign configuration.";

export const MTA_SERVICES = [
  { t: "Campaign Strategy", items: ["Business and campaign goal discovery", "Audience research", "Offer and message development", "Funnel planning", "Campaign structure recommendations", "Campaign testing strategy"] },
  { t: "Meta Ads Management", items: ["Campaign setup", "Ad set and ad organization", "Budget and bid strategy configuration", "Audience and placement configuration", "Campaign monitoring", "Optimization and reporting"] },
  { t: "Ad Creative Production", items: ["Static ad creatives", "Carousel ads", "Short-form video ads", "Reels-oriented creative", "Product and service showcases", "Motion graphics and animation", "Creative variations for testing"] },
  { t: "Audience Strategy", items: ["Audience hypothesis development", "Relevant interest and demographic settings where available", "Custom audience planning where data and consent permit", "Retargeting strategy", "Exclusion and overlap considerations", "Creative-to-audience alignment"] },
  { t: "Tracking and Measurement", items: ["Meta Pixel implementation support", "Conversions API integration support where appropriate", "Event configuration and validation", "UTM conventions", "Landing-page tracking review", "Conversion measurement", "Campaign reporting"], note: "Tracking follows applicable privacy laws, consent requirements and platform policies." },
  { t: "Lead Generation", items: ["Instant form campaigns", "Landing-page lead campaigns", "Lead qualification questions", "CRM integration where available", "Lead handoff workflow", "Lead quality measurement"] },
  { t: "E-commerce and Sales Campaigns", items: ["Product and offer promotion", "Catalog advertising where appropriate", "Retargeting", "Product landing-page alignment", "Conversion-focused creative testing"] },
  { t: "Campaign Optimization", items: ["Creative testing", "Audience testing", "Placement analysis", "Budget reallocation", "Frequency and fatigue monitoring", "Landing-page feedback", "Periodic performance reviews"] },
];

export const MTA_DIRS = [
  { k: "Product-focused", head: "Made for the way you work", text: "One product, shown clearly, with the benefit in a single line.", cta: "Shop now", tone: 0, art: "product" },
  { k: "Problem and solution", head: "Tired of the same old problem?", text: "Show the pain first, then the simple fix your service gives.", cta: "See the fix", tone: 1, art: "split" },
  { k: "Brand storytelling", head: "Why we started", text: "A short story that makes people care about the people behind the brand.", cta: "Read our story", tone: 2, art: "story" },
  { k: "Promotional offer", head: "This month only", text: "A clear offer with a clear end date, and one simple step to claim it.", cta: "Claim the offer", tone: 3, art: "offer" },
  { k: "Educational content", head: "3 things to check before you buy", text: "Useful tips first. The product comes in naturally as the answer.", cta: "Learn more", tone: 4, art: "tips" },
];

export const MTA_STAGES = [
  { t: "Awareness", obj: "Brand awareness or reach", creative: "Short, simple video or image that introduces the brand", cta: "Learn more", metrics: ["Reach", "Impressions", "Frequency"], next: "People who watched or clicked move to the next stage." },
  { t: "Interest", obj: "Traffic or engagement", creative: "Carousel or video that explains one useful idea", cta: "Read the guide", metrics: ["Link clicks", "Landing-page views", "Engagement"], next: "Visitors who read and return become warm audiences." },
  { t: "Consideration", obj: "Traffic or lead generation", creative: "Proof, comparison or demonstration of the service", cta: "See how it works", metrics: ["Landing-page views", "Click-through rate", "Time on page"], next: "Interested people are invited to ask or try." },
  { t: "Lead or Purchase", obj: "Leads or conversions", creative: "A clear offer with one simple action", cta: "Get a quote / Buy now", metrics: ["Leads or purchases", "Cost per result", "Conversion rate"], next: "New customers receive a follow-up and onboarding." },
  { t: "Retention or Repeat Purchase", obj: "Retargeting or sales", creative: "Reminders, new arrivals, loyalty or referral messages", cta: "Order again", metrics: ["Repeat purchases", "Frequency", "Customer value (where measured)"], next: "Happy customers may refer others and the cycle continues." },
];
export const MTA_STAGE_NOTE = "Not every customer follows a straight line. People can skip stages, return or leave at any point.";

export const MTA_BUDGET_OBJ = [
  { k: "Brand Awareness", a: [20, 55, 5, 20] },
  { k: "Reach", a: [15, 65, 5, 15] },
  { k: "Traffic", a: [20, 50, 15, 15] },
  { k: "Engagement", a: [20, 50, 10, 20] },
  { k: "Lead Generation", a: [20, 40, 20, 20] },
  { k: "Sales and Conversions", a: [15, 35, 30, 20] },
  { k: "Retargeting", a: [10, 15, 60, 15] },
];
export const MTA_BUCKETS = [
  { k: "Campaign testing", d: "Small budgets to learn which audiences, messages and placements respond." },
  { k: "Prospecting", d: "Reaching new people who have not met the brand yet." },
  { k: "Retargeting", d: "Following up with people who already visited or engaged." },
  { k: "Creative experimentation", d: "Trying new formats, hooks and visuals so creative does not go stale." },
];
export const MTA_PREFS = ["Balanced", "More testing", "More retargeting", "More creative experiments"];

export const MTA_FLOW = [
  { t: "Business discovery", d: "We learn what you sell, who buys it and what a good result means for you." },
  { t: "Audience and offer research", d: "We shape who to reach and what to say, using your data and market understanding." },
  { t: "Campaign planning", d: "Objectives, structure, budget approach and a testing plan are agreed with you." },
  { t: "Creative development", d: "Static, carousel and video ads are designed and written, with variations to test." },
  { t: "Tracking and launch preparation", d: "Pixel, events, UTM tags and landing pages are checked, within privacy and consent rules." },
  { t: "Campaign launch", d: "Ads go live in the agreed structure and are watched closely at the start." },
  { t: "Monitoring and testing", d: "We compare creatives, audiences and placements and move budget to what works." },
  { t: "Reporting and iteration", d: "You receive clear reports and we decide the next round together." },
];

export const MTA_METRICS = [
  { k: "Reach and impressions", shows: "How many people saw the ad, and how many times it was shown.", care: "A large reach is not the same as interest." },
  { k: "Frequency", shows: "How often the average person saw the ad.", care: "Too high can mean fatigue, too low may mean the message is not remembered." },
  { k: "Link clicks", shows: "How many people clicked through to your site or app.", care: "Clicks do not tell you whether they found what they wanted." },
  { k: "Landing-page views", shows: "How many clicks became real page visits.", care: "A big gap against clicks can point to slow pages or tracking problems." },
  { k: "Cost per click", shows: "How much, on average, each click cost.", care: "A cheap click is not always a good one." },
  { k: "Leads or purchases", shows: "The valuable actions people took, as recorded by your tracking.", care: "Depends on correct tracking and on lead quality." },
  { k: "Cost per result", shows: "What each lead or purchase cost, on average.", care: "Compare it with what a result is worth to you." },
  { k: "Conversion rate", shows: "The share of visitors who completed the action.", care: "It reflects the offer and the website as much as the ad." },
  { k: "Return on ad spend", shows: "Revenue linked to the ads compared with what was spent.", care: "Only meaningful where sales are reliably tracked." },
];

export const MTA_FAQ = [
  { q: "What is Meta marketing?", a: "It is advertising and promotion on Meta platforms such as Facebook and Instagram: planning the campaign, creating the ads, choosing audiences, running the campaign and measuring what it delivers." },
  { q: "Do you manage Facebook and Instagram ads?", a: "Yes. We set up, run, monitor and optimize campaigns, and report on them clearly." },
  { q: "Do you create ad creatives?", a: "Yes. Static images, carousels, short videos, reels-style content and motion graphics, with variations for testing." },
  { q: "Can you help generate leads?", a: "Yes. We can plan lead campaigns with instant forms or landing pages and help connect them to your team or CRM. We cannot promise a number of leads." },
  { q: "Is the advertising budget included in your service fee?", a: "No. Media spend is paid to the platform and our fee is separate, unless a proposal clearly says otherwise." },
  { q: "Can you set up Pixel and conversion tracking?", a: "Yes. We can support Meta Pixel and Conversions API set-up and check events, following privacy, consent and platform rules." },
  { q: "Do you guarantee leads or sales?", a: "No. Results depend on the offer, audience, budget, creative, competition and your website, so we do not guarantee leads or sales." },
  { q: "Can you manage existing ad accounts?", a: "Yes. We can review an existing account and campaigns, then improve the structure, creative and tracking." },
];

// What we do for each of the seven objectives, and where the ads can show (placements depend on the objective and on the current platform).
export const MTA_WE: string[][] = [
  ["Define who should remember the brand", "Make short, simple video and image creative", "Set reach and frequency limits", "Report reach, frequency and recall signals"],
  ["Pick the area, audience and schedule", "Design creative that works in the first second", "Spread the budget to reach as many different people as possible", "Report reach and cost to reach"],
  ["Choose the page that the traffic should land on", "Make the page fast on a phone", "Tag every link with UTM parameters", "Report clicks, landing-page views and cost per click"],
  ["Find the idea people want to react to", "Write hooks for the first seconds of a video", "Set up replies for comments and messages", "Report engagement and what to repeat"],
  ["Write the offer and the qualifying questions", "Build the instant form or the landing page", "Connect leads to your team or CRM", "Report leads, cost per lead and lead quality"],
  ["Check the Pixel and the conversion events", "Match product pages to the ads", "Test creative and offers against each other", "Report purchases, cost per result and conversion rate"],
  ["Build audiences from visitors and viewers (where data and consent permit)", "Exclude people who already bought", "Write reminder and benefit creative", "Report frequency and conversion rate"],
];
export const MTA_WHERE: string[][] = [
  ["Feed", "Stories", "Reels"],
  ["Feed", "Stories", "Reels"],
  ["Feed", "Stories", "Explore"],
  ["Feed", "Reels", "Stories"],
  ["Feed", "Stories", "Instant form"],
  ["Feed", "Stories", "Catalog"],
  ["Feed", "Stories", "Reels"],
];
export const MTA_LEVELS = [
  { k: "Campaign", sub: "The goal", groups: [0, 7] },
  { k: "Ad sets", sub: "Who, where and how much", groups: [1, 3] },
  { k: "Ads", sub: "What people see", groups: [2, 5, 6] },
  { k: "Measurement", sub: "What happened", groups: [4] },
];
