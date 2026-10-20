// SOFTWARE DEVELOPMENT page: the workflow and the toolbox. The stages follow the life cycle of the old site (discovery, planning, UI/UX, development, testing,
// launch and support); the tools are the technologies of the old site plus the everyday tools of any web team. They are typical, chosen per project.

export type Stage = { k: string; t: string; line: string; do: string[]; tools: string[]; get: string; code: string };

export const SDV_STAGES: Stage[] = [
  { k: "01", t: "Discover", line: "Understand the work before any code", do: ["Meet the people who will use it", "Map how the work is done today", "Agree what the software must achieve"], tools: ["Calls", "Process map", "Notes"], get: "A one-page goal and a list of users", code: "git init" },
  { k: "02", t: "Plan", line: "Choose the features, the stack and the stages", do: ["List and rank the features", "Choose the technology", "Split the work into stages with dates"], tools: ["Feature list", "Roadmap", "Git"], get: "A plan with stages and a timeline", code: "git checkout -b plan/v1" },
  { k: "03", t: "Design", line: "Simple screens, tested before they are built", do: ["Sketch the flow", "Design the screens", "Try a clickable prototype with you"], tools: ["Figma", "Prototype", "Design system"], get: "Approved screens and a prototype", code: "git commit -m \"design: approved\"" },
  { k: "04", t: "Build", line: "Built in small stages you can try", do: ["Build one stage at a time", "Review the code before it joins", "Show a working demo regularly"], tools: ["VS Code", "Git and GitHub", "Code review"], get: "Working software, stage by stage", code: "git merge feature/orders" },
  { k: "05", t: "Test", line: "Every feature checked before it goes live", do: ["Test each feature and each device", "Run automatic tests", "Check logins, roles and data safety"], tools: ["Automatic tests", "Browser testing", "Security checks"], get: "A tested build and a fix list", code: "npm test" },
  { k: "06", t: "Launch", line: "Put it live, safely, and train your team", do: ["Deploy to the server", "Move the data across", "Train your team"], tools: ["Docker", "AWS", "Deploy pipeline"], get: "Live software and a trained team", code: "deploy --prod" },
  { k: "07", t: "Support", line: "Keep it healthy and keep improving it", do: ["Fix issues and apply updates", "Back up the data", "Add new features when you are ready"], tools: ["Backups", "Updates", "Monitoring"], get: "A support plan and a steady roadmap", code: "git tag v1.1" },
];

export type Group = { k: string; t: string; items: { n: string; why: string }[] };

export const SDV_TOOLS: Group[] = [
  { k: "ui", t: "Design", items: [{ n: "Figma", why: "Screens and the clickable prototype, shared with you for comments." }, { n: "Design system", why: "One set of buttons, forms and colours, so every screen matches." }] },
  { k: "front", t: "Front end", items: [{ n: "React.js", why: "The screens people use: fast, and easy to extend later." }, { n: "Next.js", why: "A solid base for web apps and portals, with good loading speed." }] },
  { k: "back", t: "Back end", items: [{ n: "Node.js", why: "The server side, in JavaScript like the screens, so one team can work on both." }, { n: "Python", why: "Used when the work is data, automation or reports." }, { n: "REST APIs", why: "How your software talks to other tools and to mobile apps." }, { n: "GraphQL", why: "When screens need exactly the data they ask for, nothing more." }] },
  { k: "data", t: "Data", items: [{ n: "PostgreSQL", why: "Our first choice for business data that must stay correct." }, { n: "MySQL", why: "Used when your system already runs on it." }, { n: "MongoDB", why: "For flexible records that change shape over time." }] },
  { k: "ship", t: "Delivery", items: [{ n: "Git and GitHub", why: "Every change is saved, reviewed and can be undone." }, { n: "Docker", why: "The software runs the same on every machine and every server." }, { n: "AWS", why: "Hosting that can grow when your users do." }] },
];

export type Folder = { k: string; name: string; file: string; what: string; modules: string[] };

export const SDV_FOLDERS: Folder[] = [
  { k: "custom", name: "business-software", file: "README.md", what: "Software built for your exact workflow: orders, stock, billing, staff or approvals.", modules: ["Orders", "Stock", "Billing", "Staff", "Approvals"] },
  { k: "portals", name: "portals-dashboards", file: "README.md", what: "Customer, vendor and staff portals with live dashboards in one place.", modules: ["Logins and roles", "Live dashboards", "Documents", "Notifications"] },
  { k: "erp", name: "erp-crm", file: "README.md", what: "Systems that bring sales, operations and customers together.", modules: ["Leads", "Sales", "Operations", "Reports"] },
  { k: "saas", name: "saas-products", file: "README.md", what: "An idea turned into a product: accounts, plans, admin panel and a clean base.", modules: ["Accounts", "Plans", "Admin panel", "Billing"] },
  { k: "auto", name: "workflow-automation", file: "README.md", what: "Repeated tasks moved from people to software.", modules: ["Reports", "Reminders", "Data entry", "Approvals"] },
  { k: "api", name: "api-integrations", file: "README.md", what: "Payment, accounting, courier, WhatsApp and CRM connected so nothing is typed twice.", modules: ["Payments", "Accounting", "Courier", "WhatsApp", "CRM"] },
  { k: "legacy", name: "legacy-upgrade", file: "README.md", what: "Old, slow or unsupported software rebuilt on a modern, secure base, with the data moved safely.", modules: ["Audit", "Data move", "Rebuild", "Switch over"] },
  { k: "care", name: "support-maintenance", file: "README.md", what: "Updates, security fixes, backups and new features after launch.", modules: ["Updates", "Fixes", "Backups", "New features"] },
];

export const SDV_GATES = [
  { t: "Code is reviewed", d: "A second developer reads every change." },
  { t: "Automatic tests pass", d: "The checks run on every change, not only before launch." },
  { t: "Security checks pass", d: "Logins, roles and data handling are checked." },
  { t: "You try the demo", d: "You see it working before it goes live." },
  { t: "Deployed, then watched", d: "It goes live safely and we keep an eye on it." },
];

export const SDV_LAYERS = [
  { k: "People", t: "Your people", d: "Staff, customers and vendors, each with their own login and their own view." },
  { k: "Screens", t: "Web and mobile screens", d: "Simple screens that work on a computer, a tablet and a phone." },
  { k: "API", t: "The API", d: "One door that every screen and every other tool uses, with its own rules and checks." },
  { k: "Logic", t: "Business rules", d: "Your process, written once: prices, approvals, stock rules, reminders." },
  { k: "Data", t: "The database", d: "Your records, backed up and kept correct." },
  { k: "Tools", t: "Your other tools", d: "Accounting, payments, courier, WhatsApp and CRM, connected." },
];

// ---- v2: the editor files, the cloud map and the floating tools ----
export type FileDef = { n: string; ico: string; lang: string; lines: string[] };
export const SDV_FILES: FileDef[] = [
  { n: "orders.service.ts", ico: "TS", lang: "TypeScript", lines: ["import { db } from \"./db\";", "", "export async function createOrder(input) {", "  const order = await db.order.create(input);", "  await notify(order.customer, \"received\");", "  await stock.reserve(order.items);", "  return order;", "}"] },
  { n: "api/routes.ts", ico: "TS", lang: "TypeScript", lines: ["// one door for every screen and every tool", "app.post(\"/orders\", auth, async (req, res) => {", "  const order = await createOrder(req.body);", "  res.json(order);", "});", "", "app.get(\"/reports/sales\", auth, salesReport);"] },
  { n: "schema.sql", ico: "DB", lang: "SQL", lines: ["CREATE TABLE orders (", "  id INTEGER PRIMARY KEY,", "  customer TEXT NOT NULL,", "  total INTEGER NOT NULL,", "  created_at TEXT", ");", "", "-- backed up every night"] },
  { n: "README.md", ico: "MD", lang: "Markdown", lines: ["# your-software", "", "Built around the way your team works.", "", "- Simple screens for your staff", "- Safe logins and roles", "- Backups and updates after launch"] },
];

export type CloudNode = { k: string; t: string; aws: string; why: string };
export const SDV_CLOUD: CloudNode[] = [
  { k: "users", t: "Your users", aws: "browser, phone", why: "Your staff and customers open the software on a computer or a phone." },
  { k: "cdn", t: "Fast delivery", aws: "CloudFront", why: "Screens and images are served from a place near the user, so the software opens quickly." },
  { k: "lb", t: "Traffic manager", aws: "Load balancer", why: "It shares the visitors between the servers, so no single server is overloaded." },
  { k: "app", t: "Your software", aws: "Docker on EC2", why: "Your application runs in containers. When more people arrive, more servers are added." },
  { k: "db", t: "Database", aws: "RDS", why: "Your records live here, with a backup every night, so nothing is lost." },
  { k: "files", t: "Files", aws: "S3", why: "Documents, photos and reports are stored safely and can grow without limit." },
];

export type ToolFlat = { n: string; why: string; h: number };
export const SDV_TOOLS_FLAT: ToolFlat[] = [
  { n: "VS Code", why: "Where the code is written and checked every day.", h: 210 },
  { n: "Git", why: "Saves every change, so any change can be reviewed or undone.", h: 14 },
  { n: "GitHub", why: "Where the team reviews the code together before it joins.", h: 280 },
  { n: "React.js", why: "The screens people use: fast, and easy to extend later.", h: 190 },
  { n: "Next.js", why: "A solid base for web apps and portals, with good loading speed.", h: 250 },
  { n: "Node.js", why: "The server side, in JavaScript like the screens, so one team can work on both.", h: 120 },
  { n: "Python", why: "Used when the work is data, automation or reports.", h: 48 },
  { n: "PostgreSQL", why: "Our first choice for business data that must stay correct.", h: 220 },
  { n: "MySQL", why: "Used when your system already runs on it.", h: 30 },
  { n: "MongoDB", why: "For flexible records that change shape over time.", h: 140 },
  { n: "REST APIs", why: "How your software talks to other tools and to mobile apps.", h: 330 },
  { n: "GraphQL", why: "When screens need exactly the data they ask for, nothing more.", h: 310 },
  { n: "Docker", why: "The software runs the same on every machine and every server.", h: 200 },
  { n: "AWS", why: "Hosting that can grow when your users do.", h: 38 },
  { n: "Figma", why: "Screens and the clickable prototype, shared with you for comments.", h: 340 },
];

// ---- v3: industries (which software does which work) and the 15-day offer ----
export type IndTask = { t: string; d: string };
export type Industry = { name: string; lead: string; tasks: IndTask[] };
export const SDV_INDUSTRIES: Industry[] = [
  { name: "Manufacturing and trading", lead: "Order, stock, dispatch and billing in one system, with reports for the owner.", tasks: [{ t: "Orders", d: "Take and track every order from one screen." }, { t: "Stock", d: "Know what is in the godown and what is running low." }, { t: "Dispatch", d: "Plan deliveries and keep the challan and invoice together." }, { t: "Billing", d: "GST invoices, payments and outstanding in one place." }, { t: "Owner reports", d: "Daily sales, stock and dues without asking anyone." }] },
  { name: "Diamond and jewellery", lead: "Inventory, job work and sales tracking made simple and secure.", tasks: [{ t: "Inventory", d: "Every piece with its details, status and location." }, { t: "Job work", d: "Who has which item, and when it comes back." }, { t: "Sales", d: "Quotes, invoices and customer history." }, { t: "Parties", d: "Accounts of buyers and suppliers." }, { t: "Secure access", d: "Each person sees only what they should." }] },
  { name: "Textile and retail", lead: "Stock, parties, orders and accounts connected from one place.", tasks: [{ t: "Stock", d: "Designs, lots and rolls tracked up to the shelf." }, { t: "Parties", d: "Buyers, agents and their balances." }, { t: "Orders", d: "From enquiry to dispatch, with status at each step." }, { t: "Accounts", d: "Payments and ledgers connected to your accounting tool." }, { t: "Catalogue", d: "A simple catalogue to share with buyers." }] },
  { name: "Education", lead: "Student, fee, class and exam management with portals for teachers and parents.", tasks: [{ t: "Students", d: "Admission and records of every student." }, { t: "Fees", d: "Fee plans, receipts and reminders." }, { t: "Classes", d: "Timetable, attendance and teachers." }, { t: "Exams", d: "Marks, results and report cards." }, { t: "Portals", d: "A login for teachers, parents and students." }] },
  { name: "Healthcare", lead: "Appointments, patient records and billing with privacy in mind.", tasks: [{ t: "Appointments", d: "Booking, reminders and a clear daily list." }, { t: "Patient records", d: "History, prescriptions and reports in one place." }, { t: "Billing", d: "Bills, receipts and insurance details." }, { t: "Privacy", d: "Roles, so private data stays with the right people." }, { t: "Reports", d: "Visits, income and follow-ups at a glance." }] },
  { name: "Logistics", lead: "Booking, tracking and delivery management with live status.", tasks: [{ t: "Booking", d: "Take and confirm consignments." }, { t: "Tracking", d: "Live status for you and your customer." }, { t: "Fleet and drivers", d: "Who is carrying what, and where." }, { t: "Proof of delivery", d: "Signature or photo captured at the door." }, { t: "Billing", d: "Freight bills and payments." }] },
  { name: "Real estate", lead: "Leads, listings, site visits and payments in one system.", tasks: [{ t: "Leads", d: "Every enquiry captured and followed up." }, { t: "Listings", d: "Properties with photos, price and status." }, { t: "Site visits", d: "Schedule visits and note the feedback." }, { t: "Payments", d: "Booking amounts and instalments." }, { t: "Team", d: "Who handles which lead." }] },
  { name: "Startups", lead: "A first working product (MVP) built quickly and ready to improve with feedback.", tasks: [{ t: "Accounts", d: "Sign-up, login and profiles." }, { t: "Core feature", d: "The one thing your product does best." }, { t: "Admin panel", d: "Manage users and content without a developer." }, { t: "Payments", d: "Plans and online payments when you are ready." }, { t: "Feedback loop", d: "A simple way to learn from the first users." }] },
];

export type Phase = { from: number; to: number; t: string; d: string };
export const SDV_PHASES: Phase[] = [
  { from: 1, to: 2, t: "Discover", d: "We meet, map how the work is done and agree one clear scope." },
  { from: 3, to: 4, t: "Plan and design", d: "The feature list, the plan and the screens are approved by you." },
  { from: 5, to: 11, t: "Build", d: "The software is built in stages. You see a working demo every few days." },
  { from: 12, to: 13, t: "Test", d: "Every feature is tested and fixed before it goes live." },
  { from: 14, to: 14, t: "Launch", d: "The software goes live on a safe server and your data is moved across." },
  { from: 15, to: 15, t: "Handover", d: "Your team is trained and you get everything you need to start." },
];
