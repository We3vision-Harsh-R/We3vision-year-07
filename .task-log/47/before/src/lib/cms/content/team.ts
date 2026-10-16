import type { PageSection } from "../pages";
import type { SectionData, SectionType } from "../sections";

// TEAM PAGE (/team): the office seen from above with the people of We3vision at their desks, department by department (see
// components/site/modern/team-office.tsx). The people with a real name and role come from the other pages of the site and from the team's
// own project descriptions. The other places are PLACEHOLDERS (the name says "Team member"): replace them in the admin panel with the real
// name, role, photo and a few words, and add or remove people there (20 to 30 fit well).

const section = <T extends SectionType>(type: T, data: SectionData<T>, id: string = type): PageSection => ({ id, type, data: data as Record<string, unknown> });

export const TEAM_SEO = {
  title: "Our Team | The People Behind We3vision | Surat, India",
  description: "Meet the people of We3vision Private Limited: the leaders, developers, designers, artists and marketers who build websites, apps, AI, metaverse and brand work from our office in Surat.",
};

export type TeamMember = { name: string; role: string; dept: string; bio: string; photo: string; linkedin: string; girl: string };

const soon = "Add the name, photo and a few words about this person in the admin panel (Pages, Team).";
const m = (name: string, role: string, dept: string, bio = soon, girl = ""): TeamMember => ({ name, role, dept, bio, photo: "", linkedin: "", girl });

export const TEAM_MEMBERS: TeamMember[] = [
  m("Vinod Patel", "BOD & CFO", "Leadership", "Leads the finance of We3vision and sits on the board of directors."),
  m("Mohit Patel", "PM & BOD", "Leadership", "Project manager and member of the board of directors."),
  m("Parth Patel", "Director & COO", "Leadership", "Director and chief operating officer. Project manager of the NRIDA road construction VR project."),
  m("Harsh Ramoliya", "Founder & Mentor", "Leadership", "One of the founders of We3vision. Mentor of the metaverse team and of the VR projects for NRIDA and the Ministry of Coal."),
  m("Smit", "Founder", "Leadership", "One of the founders of We3vision, who started the company in Surat in 2019."),
  m("Vatsal", "Founder", "Leadership", "One of the founders of We3vision, who started the company in Surat in 2019."),
  m("Rutvi Valand", "Sr. Metaverse Engineer", "Metaverse", "Leads VR and metaverse projects: the road construction VR for NRIDA and the coal mining VR simulation for the Ministry of Coal. Built with Unity.", "yes"),
  m("Team member", "Unity Developer", "Metaverse"),
  m("Team member", "3D Artist", "Metaverse"),
  m("Krina Rudani", "UI/UX Designer", "Design", "Designs the interfaces and the experience of our projects, among them the NRIDA road construction VR.", "yes"),
  m("Team member", "Graphic Designer", "Design", soon, "yes"),
  m("Team member", "2D/3D Animator", "Design"),
  m("Team member", "Brand Designer", "Design"),
  m("Team member", "Web Developer", "Web & Mobile"),
  m("Team member", "Web Developer", "Web & Mobile", soon, "yes"),
  m("Team member", "Mobile App Developer", "Web & Mobile"),
  m("Team member", "Mobile App Developer", "Web & Mobile"),
  m("Team member", "QA Engineer", "Web & Mobile", soon, "yes"),
  m("Team member", "AI Engineer", "AI & CRM"),
  m("Team member", "AI Engineer", "AI & CRM", soon, "yes"),
  m("Team member", "CRM Developer", "AI & CRM"),
  m("Team member", "SEO Specialist", "Marketing"),
  m("Team member", "Content Writer", "Marketing", soon, "yes"),
  m("Team member", "Business Development", "Marketing"),
];

export const TEAM_SECTIONS: PageSection[] = [
  section("pageHero", {
    chip: "Our team",
    heading: "The People Behind\nWe3vision",
    text: "Developers, designers, artists and marketers, working together in one office in Surat. Scroll to walk through the office and point at anybody to meet them.",
    primaryLabel: "Walk through the office",
    primaryHref: "#office",
    secondaryLabel: "Work with us",
    secondaryHref: "/careers",
  }),
  section("teamManifesto", {
    chip: "Why the team matters",
    heading: "Behind every screen,\nthere is a person",
    body: "A website, an app or a virtual world looks like technology. It is really a long list of small decisions, made by people who care. *The way a button feels, the way a page loads, the way a 3D model moves:* somebody thought about every one of them.\n\nAt We3vision that somebody sits in our office in Surat. They are developers, designers, 3D artists, engineers and marketers, and they have been building together since 2019. We do not hide them behind a company name. This page is here to introduce them.\n\nTools change every year. What does not change is that good work comes from people who listen, disagree kindly, help each other and finish what they start. That is why the team comes first at We3vision, and the projects come after.",
    quote: "We move forward because they move forward. Every project we ship is a thank-you to the people who built it.",
    quoteBy: "The We3vision way",
  }),
  section("teamOffice", {
    chip: "The office",
    heading: "Meet The Team",
    intro: "Every department has its own corner. Point at a person (tap on a phone) to see who they are.",
    members: TEAM_MEMBERS,
  }),
  section("highlights", {
    chip: "The team in numbers",
    items: [
      { value: "6", label: "Departments, one team" },
      { value: "2", label: "Offices: Surat and Marburg" },
      { value: "2", label: "Government VR projects" },
      { value: "2019", label: "The year we started" },
    ],
  }),
  section("teamJourney", {
    chip: "How we work",
    heading: "How a project\nmoves through the team",
    intro: "Nobody builds alone here. A project passes from hand to hand like a relay race, and every hand matters.",
    steps: [
      { stage: "We listen", who: "Business development", text: "We start with your goal, your users and your limits. Questions first, ideas second." },
      { stage: "We plan", who: "Project managers", text: "The idea becomes a clear plan with steps, dates and one person you can always ask." },
      { stage: "We design", who: "UI/UX and brand designers", text: "Screens, logos and 3D worlds take shape. You see them early and tell us how they feel." },
      { stage: "We build", who: "Web, mobile, AI and metaverse developers", text: "Developers and engineers turn the design into something that really works, on web, mobile, AI or VR." },
      { stage: "We test", who: "QA engineers", text: "Somebody who did not build it tries to break it. What breaks is fixed before you ever see it." },
      { stage: "We launch and care", who: "The whole team", text: "We go live together, and then we stay: updates, fixes and growth with SEO and marketing." },
    ],
  }),
  section("teamValues", {
    chip: "Our values",
    heading: "What we believe in\nas a team",
    intro: "Not words on a wall. These are the habits you will see in our office every day.",
    items: [
      { title: "People before projects", text: "A project ends, a person stays. We look after the team first, because a team that is looked after looks after its clients." },
      { title: "Together, not one after the other", text: "Designers, developers and artists work on the same problem at the same time. The best idea wins, whoever it came from." },
      { title: "Own it from start to finish", text: "Everyone owns something real: a screen, a module, a client. If it is yours, you finish it and you fix it." },
      { title: "Keep learning", text: "AR, VR, AI and new frameworks: the field moves fast, so learning is part of the work, not a favour." },
      { title: "Be honest, and be kind", text: "We tell clients what is possible and what is not. We tell each other what works and what does not." },
      { title: "Make it simple", text: "Clear layouts, clear words, clear promises. If a user has to think twice, we are not done." },
    ],
  }),
  section("advantages", {
    chip: "Growing together",
    heading: "How we help\nthe people grow",
    intro: "A company moves forward only when its people do. This is what we try to give everybody who joins us.",
    items: [
      { title: "Real projects from the first weeks", description: "New people work on live projects with a mentor next to them, not on practice tasks." },
      { title: "Mentors in every team", description: "Senior people, our founders among them, guide the younger ones, in the metaverse team and beyond." },
      { title: "Room to go deep", description: "Web, mobile, AI, VR, 3D, brand or marketing: you can grow in the field you love." },
      { title: "Credit where it is due", description: "Good work is named and shown, on this page and on our projects." },
      { title: "A team that helps", description: "Stuck? Ask. Somebody in the office has been there before and will sit down with you." },
      { title: "A path upward", description: "People grow with the company, from their first project to leading one." },
    ],
  }),
  section("faq", {
    chip: "Good to know",
    heading: "Questions about\nthe team",
    intro: "",
    items: [
      { question: "Where is the We3vision team based?", answer: "Our head office and development team are in Surat, Gujarat, India. We also have an office in Marburg, Germany." },
      { question: "Who will I talk to when I start a project?", answer: "You get one main contact, a project manager, who knows everything about your project. Designers and developers join the calls whenever it helps." },
      { question: "What kind of people work at We3vision?", answer: "Web and mobile developers, UI/UX and graphic designers, 2D/3D animators, AR/VR and Unity engineers, AI engineers, QA engineers, SEO specialists and content writers." },
      { question: "Can I join the team?", answer: "Yes. Look at the open roles on our Careers page, or write to hr@we3vision.com with your work and a few words about you." },
      { question: "Do you work with clients outside India?", answer: "Yes. We work with companies across India and the globe, and we have an office in Germany." },
    ],
  }),
  section("contact", { chip: "Let's talk", heading: "Want To Work\nWith Us?", text: "Tell us about your project, or about yourself if you would like to join the team.", buttonLabel: "Send message" }),
];
