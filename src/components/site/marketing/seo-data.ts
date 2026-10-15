// SEO / AEO page: the text. Educational and illustrative: no invented scores, rankings, volumes or client results.

export const SXO_NODES = [
  { k: "engines", t: "Search engines", d: "Crawl, index and rank pages. A site that is easy to crawl and understand gives them more to work with." },
  { k: "queries", t: "Relevant queries", d: "The words and questions real people use. Good SEO starts by matching your pages to the intent behind them." },
  { k: "content", t: "Helpful content", d: "Pages that answer the question well, written for the reader first, are the base of both SEO and AEO." },
  { k: "data", t: "Structured information", d: "Clear headings, consistent facts and appropriate structured data help systems interpret what a page is about." },
  { k: "ai", t: "AI answer experiences", d: "Answer systems may draw on clear, well-supported pages. Nothing can guarantee inclusion in an AI answer." },
];

export const SXO_MODES = [
  {
    k: "SEO", t: "Search Engine Optimization",
    def: "Improving crawlability, indexability, relevance, content quality, authority signals and the search experience, so the right pages can be found for the right searches.",
    query: "best accounting software for small business",
    shape: "A ranked list of pages. The visitor compares titles and snippets, then chooses where to click.",
    sample: { title: "Accounting Software For Small Business | Your Brand", url: "yourbrand.example › accounting", text: "Compare plans, features and set-up steps for a small team." },
    methods: ["Crawlability and indexing", "Title and heading optimization", "Keyword and intent mapping", "Internal linking", "Page speed and mobile usability", "Relevant, ethical link building"],
  },
  {
    k: "AEO", t: "Answer Engine Optimization",
    def: "Structuring clear, useful and well-supported information so answer systems can better interpret it and may surface it when it is relevant. It is a way of improving content, not a trick.",
    query: "How do I choose accounting software for a small business?",
    shape: "A short written answer that may cite sources. The visitor may read the answer first and click through only if they need more.",
    sample: { title: "Start with your must-have features, then compare cost, support and ease of use.", url: "Source: yourbrand.example › guide", text: "A direct answer, followed by the page that explains it in depth." },
    methods: ["Direct answers near the top of a page", "Question-focused headings and FAQs", "Consistent facts about the brand (entity clarity)", "Appropriate structured data", "Credible sources and clear authorship", "Important content that is easy to crawl"],
  },
];
export const SXO_SHARED = ["Helpful, original content", "A technically healthy website", "Clear structure and headings", "Trust and authority signals"];

export const SXO_AUDIT = [
  { k: "01", t: "Technical SEO", means: "Whether search engines can reach, crawl and index the important pages of the site without obstacles.",
    issues: ["Important pages blocked or not indexed", "Duplicate URLs without a clear canonical", "Long redirect chains and broken links", "Missing or outdated XML sitemap"],
    checks: ["Crawl and index coverage", "Robots directives and sitemap", "Canonical tags and redirects", "HTTPS and server responses"],
    next: ["Fix crawl blockers first", "Consolidate duplicate URLs", "Clean up redirects and broken links"],
    data: ["Search Console access", "A crawl of the site", "Server or CDN configuration details"] },
  { k: "02", t: "On-Page SEO", means: "How well each page explains itself to people and to search engines through titles, headings, copy, images and URLs.",
    issues: ["Missing, duplicated or vague titles and descriptions", "Headings that do not follow a logical order", "Images without useful alt text", "Pages that target no clear topic"],
    checks: ["Title and meta description quality", "Heading structure", "Image alt text", "URL structure and internal anchors"],
    next: ["Rewrite titles around real search intent", "Fix heading order", "Add descriptive alt text"],
    data: ["A page inventory", "Target topics per page", "Search Console query data"] },
  { k: "03", t: "Content Quality", means: "Whether the content is useful, accurate, complete and written for the audience, not only for search engines.",
    issues: ["Thin pages that do not answer the question", "Outdated information", "Content that overlaps and competes with itself", "No clear author or source for claims"],
    checks: ["Depth and accuracy", "Overlap between pages", "Freshness", "Expertise and source signals"],
    next: ["Merge or refresh overlapping pages", "Add the missing answers", "Plan a content calendar"],
    data: ["Page analytics", "Subject-matter input from your team", "Competitor content for comparison"] },
  { k: "04", t: "Internal Linking", means: "How pages connect to each other, which helps visitors move around and helps search engines understand what matters.",
    issues: ["Important pages hidden deep in the site", "Orphan pages with no links in", "Generic anchor text", "Links to pages that redirect or error"],
    checks: ["Click depth", "Orphan pages", "Anchor text", "Link targets"],
    next: ["Link key pages from related content", "Rewrite generic anchors", "Add topic hubs"],
    data: ["A full site crawl", "Your list of priority pages"] },
  { k: "05", t: "Structured Data", means: "Machine-readable labels (schema markup) that describe the page, the business, products, articles or FAQs.",
    issues: ["Markup that does not match the visible content", "Missing basic organization information", "Markup errors or warnings", "Markup added without a clear purpose"],
    checks: ["Markup validity", "Match with visible content", "Organization and page-type coverage"],
    next: ["Add markup only where it is accurate", "Fix validation errors", "Keep facts consistent across the site"],
    data: ["Rich-results and schema validation reports", "Access to templates or the CMS"] },
  { k: "06", t: "Performance and Mobile Experience", means: "How fast and comfortable the pages are to use, especially on phones, including Core Web Vitals.",
    issues: ["Large images and heavy scripts", "Layout that jumps while loading", "Small tap targets on mobile", "Slow server response"],
    checks: ["Core Web Vitals field data (where available)", "Mobile usability", "Image and script weight"],
    next: ["Compress and lazy-load images", "Remove unused scripts", "Fix layout shifts"],
    data: ["Search Console Core Web Vitals report", "A performance test of key templates"] },
  { k: "07", t: "Search Intent", means: "Whether each page gives people the kind of result they expect: an answer, a comparison, a product or a service page.",
    issues: ["A sales page for an informational query", "One page trying to serve several intents", "No page for an important question", "Titles that promise something the page does not give"],
    checks: ["Intent of target queries", "Match between query and page type", "Gaps in the topic map"],
    next: ["Map each keyword to one fitting page", "Create the missing page types", "Rework titles to match intent"],
    data: ["Query lists from Search Console", "Competitor results for the same queries"] },
  { k: "08", t: "AI Search Readiness", means: "How clear, consistent and accessible your information is for answer systems. It improves your content; it does not guarantee any AI placement.",
    issues: ["Answers buried deep in long pages", "Inconsistent facts about the brand across pages and profiles", "Key information only inside images or scripts", "No supporting sources"],
    checks: ["Direct answers and question headings", "Consistency of brand facts", "Crawl access to key content", "Source quality"],
    next: ["Add clear answers and useful FAQs", "Align brand details everywhere", "Make key facts available as text"],
    data: ["Your key questions", "Brand and profile details", "Site crawl data"] },
];
export const SXO_AUDIT_FIELDS = [["means", "What it means"], ["issues", "Common issues"], ["checks", "What an audit checks"], ["next", "Potential next steps"], ["data", "Data needed to verify"]] as const;

export const SXO_SERVICES = [
  { t: "Technical SEO", items: ["Crawlability and indexability review", "XML sitemap and robots directives review", "Canonicalization checks", "Redirect and broken-link analysis", "Core Web Vitals and page performance review", "Mobile usability review", "Structured data validation", "HTTPS and technical configuration checks"] },
  { t: "On-Page SEO", items: ["Title and meta description optimization", "Heading structure", "Content and search-intent alignment", "Image alt text", "Internal linking", "URL structure", "Content optimization"] },
  { t: "Keyword and Search Intent Research", items: ["Keyword discovery", "Search intent classification", "Topic clustering", "Competitor content research", "Content opportunity analysis", "Keyword mapping to relevant pages"] },
  { t: "Content SEO", items: ["SEO content strategy", "Landing-page optimization", "Blog planning", "Topic cluster development", "Content refresh recommendations", "Helpful, audience-focused content creation"] },
  { t: "Authority and Off-Page SEO", items: ["Relevant backlink profile analysis", "Digital PR planning", "Link opportunity research", "Brand mention opportunities", "Ethical link acquisition strategy"], note: "We do not promise a number of backlinks, rankings or traffic without a defined, substantiated agreement." },
  { t: "Local SEO", items: ["Google Business Profile optimization where applicable", "Local landing pages", "Business information consistency", "Review strategy recommendations", "Local search visibility monitoring"] },
  { t: "AEO and AI Search Readiness", items: ["Direct and clearly structured answers", "Question-focused content", "Entity clarity and consistent brand information", "Appropriate structured data", "Content citation and source-quality practices", "Useful FAQs", "Crawlability and accessibility of important information"], note: "No single tactic, schema type or FAQ page guarantees inclusion in AI-generated answers." },
];

export const SXO_JOURNEY = [
  { t: "Discovery", intent: "“What is the problem called, and is there a fix?”", format: "Guides, explainers, short videos", page: "A helpful blog article or resource hub", cta: "Read the full guide" },
  { t: "Research", intent: "“How does this work, and what are my options?”", format: "In-depth articles, checklists, FAQs", page: "A topic hub page that links to the details", cta: "Compare the options" },
  { t: "Comparison", intent: "“Which provider or approach suits me?”", format: "Comparison pages, case-style examples, process pages", page: "A service page with clear scope and proof", cta: "See how we work" },
  { t: "Decision", intent: "“Can I trust them, and what happens next?”", format: "Service detail, pricing-approach and FAQ pages", page: "A focused landing page for that service", cta: "Request a quote" },
  { t: "Conversion", intent: "“I am ready. How do I start?”", format: "Short form, contact page, booking page", page: "The inquiry or contact page", cta: "Request an SEO audit" },
];

export const SXO_FLOW = [
  { t: "Discovery and website assessment", d: "We learn about your business, audience and goals, and look at how the site is built and what it already does well.", by: "Business goals, site access, current tracking." },
  { t: "Technical and content audit", d: "We check crawling, indexing, performance, structure and the quality of key pages.", by: "A prioritised list of issues with the evidence for each." },
  { t: "Keyword and competitor research", d: "We study the questions your audience asks and what competing pages already cover.", by: "A keyword and topic map tied to real intent." },
  { t: "Strategy and prioritization", d: "We decide what to fix first, what to create and what to leave alone, based on effort and likely value.", by: "A practical roadmap you can approve." },
  { t: "Implementation and content optimization", d: "Technical fixes, page updates and new content are carried out and checked.", by: "Updated pages, templates and content." },
  { t: "Monitoring and reporting", d: "We follow search and engagement data where tracking is available and report what we see in plain words.", by: "Regular reports that separate activity from outcomes." },
  { t: "Continuous improvement", d: "Search changes and so does your business. We refine the plan as we learn.", by: "Ongoing priorities and next steps." },
];

export const SXO_METRICS = [
  { tier: "Activity", sub: "What happens in search", items: ["Organic clicks and impressions", "Search query performance", "Indexed-page coverage", "Technical issue resolution"] },
  { tier: "Engagement", sub: "What visitors do on the page", items: ["Landing-page engagement", "Relevant referral or AI-search traffic, where measurable"] },
  { tier: "Business outcomes", sub: "What matters to the business", items: ["Relevant conversions", "Qualified organic leads"] },
];

export const SXO_FAQ = [
  { q: "What is the difference between SEO and AEO?", a: "SEO helps search engines find, understand and rank your pages. AEO shapes the same content so that clear, well-supported answers are easier for answer systems to interpret and possibly surface. They overlap heavily: helpful content and a healthy website help both." },
  { q: "How long can SEO take to show results?", a: "It depends on the competition, the condition of the site, the quality of the content and how often changes are made. Some technical fixes show effects sooner, while content and authority usually take longer to build. We do not promise a fixed timeline." },
  { q: "Can you optimize an existing website?", a: "Yes. We start with an assessment of the current site, then fix what holds it back and improve what already works, without rebuilding it unless that is really needed." },
  { q: "Do you provide technical SEO and content SEO?", a: "Yes. Technical SEO, on-page work, keyword research, content strategy and optimization, local SEO and AEO are all part of our scope, depending on what your site needs." },
  { q: "Can you help improve AI search visibility?", a: "We can help you make your information clearer, more consistent and easier to crawl, which can make it more eligible to be used in AI-generated answers. No one can guarantee inclusion in them." },
  { q: "How is SEO progress measured?", a: "Where tracking is set up, we look at organic clicks and impressions, query performance, indexed pages, landing-page engagement and relevant conversions, and we keep activity metrics separate from business outcomes." },
  { q: "Do you guarantee search rankings?", a: "No. Rankings depend on competition, technical condition, content quality, authority and many other factors, some of which we do not control. We commit to careful, ethical work and clear reporting, not to a ranking position." },
];
