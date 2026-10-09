import type { PageSection } from "../pages";
import type { SectionData, SectionType } from "../sections";

// ABOUT PAGE CONTENT. Source: the About Us page of the old site https://www.we3vision.com (#/about): same story,
// facts, services, roadmap, reasons and leaders; wording tidied and enriched with search keywords (IT company in Surat,
// AR/VR, metaverse, web & app development).
// Left out on purpose: the "Web N Soft Solution way" hiring comparison (it names another company) and the lorem-ipsum
// line under "Our Leaders". Leader photos are not copied yet (initials avatars are used until the user approves photos).
// Words in *stars* are highlighted. This is what visitors see until someone publishes a version from the admin panel.

const section = <T extends SectionType>(type: T, data: SectionData<T>): PageSection => ({
  id: type,
  type,
  data: data as Record<string, unknown>,
});

export const ABOUT_SEO = {
  title: "About We3vision | IT Company in Surat, India Since 2019",
  description:
    "We3vision Private Limited is a Surat-based IT company founded in 2019, building web, app, AR/VR, metaverse, AI, CGI and CRM solutions for businesses across India and the globe.",
};

export const ABOUT_SECTIONS: PageSection[] = [
  // the top of the page is words (the 3D island of the earlier version is still a section type: "aboutWorld")
  section("aboutHero", {"chip":"About Us","heading":"Empowering Digital Transformation\nThrough Innovation","text":"At We3vision Private Limited we are dedicated to transforming how people live digitally. Since 2019 we have been at the forefront of digital innovation, delivering cutting-edge solutions that empower businesses and individuals alike.","primaryLabel":"Discover our story","primaryHref":"#story","secondaryLabel":"Our services","secondaryHref":"#services"}),
  section("aboutChapters", {"chip":"Our story","heading":"Our Story","chapters":[{"title":"A leading IT service company","text":"We3vision Private Limited blends technology, design and strategy to deliver high-performance solutions for businesses and individuals."},{"title":"Founded in 2019","text":"Born in Surat with a vision to deliver innovative, customer-focused IT solutions, and growing every year since."},{"title":"Based in Surat, India","text":"Our headquarters and development office are in Surat, Gujarat. We build custom digital solutions for companies across India and the globe."},{"title":"Everything digital, one team","text":"Web and app development, AR, VR, XR, CGI and 3D animation, CRM, ERP and digital branding: delivered by one skilled team."},{"title":"Ideas into impactful realities","text":"With a skilled team, strong values and a vision for innovation, we turn your ideas into reality, from a dynamic website to immersive virtual experiences."}],"meet":{"chip":"Meet our mascot","heading":"Say hello to\nPando","text":"Pando is the little panda of We3vision. It shows you around the studio, so say hello: click it and move your mouse.","tips":"Hi! I am Pando, the panda of We3vision.\nWe are a Surat-based studio, working since 2019.\nWeb, AI, AR/VR, metaverse, apps, CRM and 3D: we do it all.\nBamboo helps me think. Ideas help you grow.\nScroll down to see our journey and our leaders."}}),
  section("highlights", {
    chip: "At a glance",
    items: [
      { value: "2019", label: "Founded in Surat" },
      { value: "7", label: "Years of innovation" },
      { value: "11–50", label: "Team members" },
      { value: "2", label: "Offices: India & Germany" },
    ],
  }),
  section("services", {
    chip: "Services We Offer",
    heading: "Services\nWe Offer",
    intro: "Immersive experiences, smart software and creative design from one team.",
    buttonLabel: "",
    buttonHref: "",
    cards: [
      {
        title: "AR/VR &\nMetaverse",
        description: "Immersive virtual environments and experiences for real estate, events, training and brand engagement.",
        href: "/metaverse",
      },
      {
        title: "AI\nDevelopment",
        description: "Smart AI solutions for web, mobile and emerging platforms, blending creativity and technology.",
        href: "/ai",
      },
      {
        title: "Web Design &\nDevelopment",
        description: "Responsive, fast and beautiful websites tailored to your business goals, built with modern frameworks.",
        href: "/webdev",
      },
      {
        title: "Application Design &\nDevelopment",
        description: "High-performance mobile and web applications for seamless user experiences.",
        href: "/mobile",
      },
      {
        title: "Game\nDevelopment",
        description: "Engaging and interactive games for web, mobile and emerging platforms, blending creativity and technology.",
        href: "/metaverse-games",
      },
      {
        title: "UI/UX &\nBranding",
        description: "Beautiful, intuitive interfaces and strong brand identities that leave a lasting impression.",
        href: "/ui-ux-design",
      },
    ],
  }),
  section("timeline", {
    chip: "Our Journey",
    heading: "Our Journey:\nRoadmap",
    names: "Smit\nHarsh\nVatsal",
    leaveYear: "2021",
    partnerName: "Parth",
    partnerYear: "2023",
    finalYear: "2027",
    goalTitle: "Our goal for 2027",
    goalText: "To grow We3vision into a brand that people love to work with: a company clients trust and recommend, where seven teams keep building more value for every project.",
    teams: "Brand Design\nWeb Development\nMobile App Development\nAI Development\nMetaverse Solutions\nUI/UX Design\nCRM Development",
    items: [
      { year: "2019", text: "Founded in Surat, Gujarat, with a vision to deliver innovative and customer-focused IT solutions." },
      { year: "2020", text: "Expanded core services to web and app design and development." },
      { year: "2021", text: "Introduced AR and VR solutions, stepping into immersive technology." },
      { year: "2022", text: "Launched metaverse solutions and grew a specialized team." },
      { year: "2023", text: "Scaled AR/VR pilots and boosted UI/UX with new prototypes." },
      { year: "2024", text: "Delivered diverse VR projects in construction, real estate and mining." },
      { year: "2025", text: "Focused on metaverse, game development, graphic design and animation." },
      { year: "2026", text: "Started building our own SaaS product, expanding our solutions into scalable software." },
    ],
  }),
  section("advantages", {
    chip: "Why Choose Us",
    heading: "Why Choose\nWe3vision",
    intro: "Our expertise, your success. We think big and have hands in all leading technology platforms to provide you a wide array of services.",
    items: [
      { title: "Client-Centric Approach", description: "We put your needs first, ensuring every solution is tailored to your goals." },
      { title: "Scalable Solutions", description: "Our services grow with your business, adapting to new challenges and opportunities." },
      { title: "Creative Thinking", description: "We bring fresh ideas and innovative strategies to every project." },
      { title: "On-Time Delivery", description: "We respect your deadlines and deliver quality work, every time." },
    ],
  }),
  section("team", {
    chip: "Our Leaders",
    heading: "Our Leaders\nBehind the Vision",
    members: [
      { name: "Vinod Patel", role: "BOD & CFO" },
      { name: "Mohit Patel", role: "PM & BOD" },
      { name: "Parth Patel", role: "Director & COO" },
    ],
  }),
];
