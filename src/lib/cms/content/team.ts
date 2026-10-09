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
  section("teamOffice", {
    chip: "The office",
    heading: "Meet The Team",
    intro: "Every department has its own corner. Point at a person (tap on a phone) to see who they are.",
    members: TEAM_MEMBERS,
  }),
  section("contact", { chip: "Let's talk", heading: "Want To Work\nWith Us?", text: "Tell us about your project, or about yourself if you would like to join the team.", buttonLabel: "Send message" }),
];
