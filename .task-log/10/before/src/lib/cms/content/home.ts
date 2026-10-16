import type { PageSection } from "../pages";
import type { SectionData, SectionType } from "../sections";

// HOME PAGE CONTENT. Source: the old site https://www.we3vision.com (same facts, services, industries and offices;
// wording tidied and enriched with search keywords: web development, AI, AR/VR, metaverse, Surat, India).
// Only facts that exist on the old site are used (no invented numbers or reviews).
// This is what visitors see until someone publishes a version from the admin panel.

const section = <T extends SectionType>(type: T, data: SectionData<T>): PageSection => ({
  id: type,
  type,
  data: data as Record<string, unknown>,
});

export const HOME_SEO = {
  title: "We3vision | Web, AI & Metaverse Development Company, India",
  description:
    "Surat-based studio for web development, AI solutions, AR/VR & metaverse, mobile apps, UI/UX design, CRM and 3D animation. Get a quote today.",
};

export const HOME_SECTIONS: PageSection[] = [
  section("hero", {
    title: "We3vision: Leading Web, AI & Metaverse Development Services in India",
    mark: "7",
    above: "Celebrating",
    below: "Years of We3vision",
    // The 7 main services. Links keep the old site URLs so Google rankings carry over. The sentences and descriptions are
    // written from what the old site's service pages say (tools, processes, industries), with search keywords added.
    // Sub-services: one per line as "Name | short description".
    cards: [
      {
        title: "Brand Design",
        href: "/brand-identity",
        summary: "Brand identity design that gives your business a clear, consistent look: strategy, logo, colours, typography and brand assets.",
        subs: "Brand strategy | Your business goals, audience and brand direction defined before any design starts. | /brand-identity/brand-strategy\nLogo design | A logo, colours and typography that reflect your business and speak to your audience. | /brand-identity/logo-design\nVisual identity & guidelines | One consistent visual system, with brand guidelines your team can follow. | /brand-identity/visual-identity-guidelines\nMarketing collateral | Brand assets for graphic design, website design and advertising creatives. | /brand-identity/marketing-collateral",
      },
      {
        title: "Web\nDevelopment",
        href: "/webdev",
        summary: "Modern, responsive and SEO-friendly websites that are fast, secure and easy to manage, from landing pages to complex web portals.",
        subs: "WordPress & WooCommerce | Custom WordPress websites and WooCommerce stores you can manage yourself, with CMS training.\nShopify stores | Conversion-focused Shopify stores and apps to sell your products online.\nHeadless CMS | Fast React, Vue or Angular front ends connected to a headless CMS.\nE-commerce websites | Secure online stores with scalable Node.js, Laravel or PHP back ends.",
      },
      {
        title: "Mobile App\nDevelopment",
        href: "/mobile",
        summary: "Fast, user-friendly Android and iOS apps built to scale, from first idea to Google Play and App Store launch.",
        subs: "Android apps | Native Kotlin and cross-platform Android apps tuned for performance on every device.\niOS apps | Native Swift apps with clean, brand-aligned interfaces, ready for App Store approval.\nMVP development | A focused first version with the core features, so you can launch and learn quickly.\nFull-scale products | Flutter or React Native apps with APIs, real-time sync and ongoing updates.",
      },
      {
        title: "AI\nDevelopment",
        href: "/ai",
        summary: "Custom AI development: chatbots, recommendation systems and predictive analytics built with machine learning, NLP and deep learning.",
        subs: "Generative AI & AI agents | Chatbots and AI assistants connected to your own data, tools and systems.\nMachine learning | Recommendation engines and predictive models trained on your business data.\nComputer vision | Image recognition for use cases like medical images or property listings.\nMLOps & RAG | Production deployment, monitoring and retraining, plus answers grounded in your documents.",
      },
      {
        title: "Metaverse\nSolutions",
        href: "/metaverse",
        summary: "Metaverse solutions and interactive digital environments, from virtual worlds and applications to virtual events, built with Unity and Unreal Engine.",
        subs: "Metaverse platforms | Virtual worlds and applications planned around your business goals and audience.\nMetaverse games | Interactive 3D game experiences with engaging environments and interactions.\nNFT marketplace | Digital asset marketplaces with platform and wallet integration.\nImmersive marketing | Virtual events and interactive brand experiences that hold attention.",
      },
      {
        title: "UI/UX\nDesign",
        href: "/ui-ux-design",
        summary: "UI/UX design services for websites and apps that look great, feel effortless and guide visitors naturally towards action.",
        subs: "Wireframes & prototypes | Low and high fidelity wireframes and interactive prototypes to test ideas early.\nDesign systems | Reusable components, colours and typography so every screen stays consistent.\nWeb & mobile interfaces | Responsive interfaces designed for every device and screen size.\nVisual branding | Colour, typography and iconography that carry your brand's tone.",
      },
      {
        title: "CRM\nDevelopment",
        href: "/crm",
        summary: "Custom CRM software that centralises your customer data, automates workflows and connects with the tools you already use.",
        subs: "CRM software | Custom modules, dashboards, roles and permissions for sales, marketing and support teams.\nERP software | ERP and CMS connectors so all your systems share one source of data.\nLead tracking | Pipelines and automation with email, analytics and WhatsApp Business API.\nInventory & support | Track stock and customer requests, with team training and ongoing support.",
      },
    ],
  }),
];
