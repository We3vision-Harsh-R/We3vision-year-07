import type { ReactNode } from "react";

// The seven services of the home design, shared by the home page cards (home-services.tsx) and the Services page (/services).
// The pictures are plain markup; their motion is in styles/home.css (hb2-sv, only while .hb2-sv has data-live).
export type Svc = {
  key: string;
  kick: string;
  em: string;
  rest: string;
  href: string;
  line: string;
  tags: string[];
  over: string;
  builds: string[];
  fit: string[];
};

export const SERVICES: Svc[] = [
  {
    key: "ai",
    kick: "Intelligence",
    em: "AI / ML",
    rest: "development",
    href: "/ai",
    line: "Assistants and models trained on your own data.",
    tags: ["Chatbots", "Automation", "Data"],
    over: "Models and assistants trained on your data, built into the tools your team already uses.",
    builds: ["Chatbots and AI assistants", "Document and data understanding", "Prediction and automation", "Integration with your software"],
    fit: ["Support and sales teams", "Operations and back office", "Products that need smart features"],
  },
  {
    key: "brand",
    kick: "Identity",
    em: "Branding",
    rest: "",
    href: "/brand-identity",
    line: "Logo, colour, type and a full brand kit that makes your company unmistakable.",
    tags: ["Logo", "Brand kit", "Guidelines", "Brand video"],
    over: "A clear, consistent identity for your company, from the first logo to the full brand kit.",
    builds: ["Logo and brand identity", "Colour, type and guidelines", "Brand kit and templates", "Brand video"],
    fit: ["New companies", "Rebrands", "Teams that need consistency"],
  },
  {
    key: "meta",
    kick: "Immersive",
    em: "Metaverse",
    rest: "development",
    href: "/metaverse",
    line: "Immersive 3D worlds for the web, VR and AR.",
    tags: ["3D worlds", "VR", "AR"],
    over: "Immersive 3D worlds and experiences that run on the web, in VR and in AR.",
    builds: ["3D worlds and showrooms", "VR and AR experiences", "Real-time 3D on the web", "Virtual events and spaces"],
    fit: ["Real estate and retail", "Education and training", "Brands that want to stand out"],
  },
  {
    key: "web",
    kick: "Web",
    em: "Web",
    rest: "development",
    href: "/webdev",
    line: "Fast, custom sites, stores and portals.",
    tags: [],
    over: "Fast, custom websites, stores and portals that are easy to manage and made to grow.",
    builds: ["WordPress and WooCommerce", "Shopify stores", "Headless CMS front ends", "Custom web portals"],
    fit: ["E-commerce", "Healthcare and education", "Finance and travel"],
  },
  {
    key: "app",
    kick: "Mobile",
    em: "App",
    rest: "development",
    href: "/mobile",
    line: "Mobile apps for iOS and Android.",
    tags: [],
    over: "Mobile apps for iOS and Android, designed with care and built on clean, solid code.",
    builds: ["iOS and Android apps", "UI and UX design", "API and back end", "Launch and support"],
    fit: ["Startups with an idea", "Businesses going mobile", "Products that need an app"],
  },
  {
    key: "soft",
    kick: "Software",
    em: "Software",
    rest: "development",
    href: "/software-development-services",
    line: "Custom software built around your process.",
    tags: [],
    over: "Custom software built around the way your business really works, secure and easy to extend.",
    builds: ["Business and internal tools", "Dashboards and portals", "APIs and integrations", "Maintenance and upgrades"],
    fit: ["Growing companies", "Teams with manual work", "Products with special rules"],
  },
  {
    key: "crm",
    kick: "Customers",
    em: "CRM",
    rest: "development",
    href: "/crm",
    line: "A CRM shaped to your sales and support.",
    tags: [],
    over: "A CRM made for your sales and support process, connected to the tools you already use.",
    builds: ["Leads and pipeline", "Customer records", "Automation and reminders", "Reports and integrations"],
    fit: ["Sales teams", "Support teams", "Businesses that outgrew sheets"],
  },
];

export function Art({ k }: { k: string }): ReactNode {
  switch (k) {
    case "ai":
      return (
        <div className="hb2-sv-a">
          <svg viewBox="0 0 400 200" className="hb2-sv-chart">
            <path className="g" d="M10 190 L80 100 L100 60 L128 112 L170 112 L200 50 L240 70 L280 90 L330 80 L390 86" />
            <path d="M10 190 L80 100 L100 60 L128 112 L170 112 L200 50 L240 70 L280 90 L330 80 L390 86" />
            <line x1="100" y1="60" x2="100" y2="200" />
            <line x1="200" y1="50" x2="200" y2="200" />
            <circle cx="100" cy="60" r="6" />
            <circle cx="200" cy="50" r="6" />
            <circle cx="330" cy="80" r="6" />
          </svg>
          <span className="hb2-sv-pills">
            <b>Train</b>
            <i>+</i>
            <b>Deploy</b>
          </span>
        </div>
      );
    case "brand":
      return (
        <div className="hb2-sv-a">
          <span className="hb2-sv-orbit" />
          <span className="hb2-sv-orbit hb2-sv-orbit2" />
          <span className="hb2-sv-mark">
            <em>Aa</em>
            <i />
          </span>
          <span className="hb2-sv-sw">
            <b />
            <b />
            <b />
            <b />
            <b />
          </span>
        </div>
      );
    case "meta":
      return (
        <div className="hb2-sv-a">
          <span className="hb2-sv-dial">
            <i />
            <i />
            <i />
            <s />
          </span>
        </div>
      );
    case "web":
      return (
        <div className="hb2-sv-a">
          <span className="hb2-sv-tile">
            <u />
            <u />
            <u />
            <u />
            <em>
              <svg viewBox="0 0 24 24">
                <path d="M13 2 5 14h6l-1 8 8-12h-6z" />
              </svg>
            </em>
          </span>
        </div>
      );
    case "app":
      return (
        <div className="hb2-sv-a">
          <span className="hb2-sv-keys">
            <b>UI</b>
            <b>API</b>
            <b>iOS</b>
            <b>Android</b>
          </span>
          <span className="hb2-sv-rings" />
        </div>
      );
    case "soft":
      return (
        <div className="hb2-sv-a">
          <span className="hb2-sv-code">
            <i style={{ width: "62%" }} />
            <i style={{ width: "40%", marginLeft: 22 }} />
            <i style={{ width: "54%", marginLeft: 22 }} />
            <i style={{ width: "30%", marginLeft: 44 }} />
            <i style={{ width: "48%", marginLeft: 22 }} />
            <u />
          </span>
        </div>
      );
    default:
      return (
        <div className="hb2-sv-a">
          <span className="hb2-sv-funnel">
            <i />
            <i />
            <i />
            <i />
            <s />
          </span>
        </div>
      );
  }
}
