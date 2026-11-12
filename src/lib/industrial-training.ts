// INDUSTRIAL TRAINING (owner, 2026-11-12): fee-based training of 3, 6 and 9 months at We3vision. The trainee pays a fee and learns what the industry needs, working like a
// real team. One page per duration (/industrial-training/3-month, /6-month, /9-month), one big list of domains, a different fee for every domain and every duration.
// This file is plain data: no client code, safe to import anywhere (the menu imports TRAINING_LINKS). The words of the pages are in components/site/training/.
//
// COURSES AND FEES are managed in Admin > Industrial Training (saved in the database; lib/training-shared.ts holds the starting list). Until a fee is typed there, the pages say
// "Contact us for the fee" and nothing is invented.

export type Months = 3 | 6 | 9;

export type Program = {
  months: Months;
  slug: string;
  path: string;
  /** the name in the menu */
  menu: string;
  title: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  /** who it suits, in one sentence */
  fit: string;
  lede: string;
  /** what the trainee does, month by month */
  plan: { m: string; t: string; x: string }[];
  /** what the trainee takes away */
  outcomes: string[];
};

export const PROGRAMS: Program[] = [
  {
    months: 3,
    slug: "3-month",
    path: "/industrial-training/3-month",
    menu: "3 Month Industrial training",
    title: "3 Month Industrial Training",
    h1: "3 Month Industrial Training",
    seoTitle: "3 Month Industrial Training in Surat | We3vision",
    seoDescription: "A 3 month industrial training at We3vision, Surat: learn the basics of a technology domain, build a guided mini project and see how a software team works. Choose your domain and ask for the fee.",
    fit: "A first step into the industry: learn the basics of one domain and see how a real team works.",
    lede: "Three months to learn the foundations of one technology domain, the tools the industry uses, and how a software team works, ending with a small project you build yourself.",
    plan: [
      { m: "Month 1", t: "Foundations", x: "The basics of your domain, the tools of the trade and Git for working in a team." },
      { m: "Month 2", t: "Guided building", x: "You build real modules with a mentor, take tasks from a task board and get your work reviewed." },
      { m: "Month 3", t: "Mini project", x: "A small project from requirement to testing, shown to the team and reviewed." },
    ],
    outcomes: ["The foundations of one domain", "Hands-on work with industry tools", "A first project you built yourself", "An idea of how a software team works day to day"],
  },
  {
    months: 6,
    slug: "6-month",
    path: "/industrial-training/6-month",
    menu: "6 Month Industrial training",
    title: "6 Month Industrial Training",
    h1: "6 Month Industrial Training",
    seoTitle: "6 Month Industrial Training in Surat | We3vision",
    seoDescription: "A 6 month industrial training at We3vision, Surat: build skills in your domain and work on a real project with the SDLC process and ISO 9001 based quality practice. Ask for the fee.",
    fit: "For learners who want to work on a real project and learn the full process, not only the skills.",
    lede: "Six months to build solid skills in your domain and then work on a real-time project inside a team, following the software development life cycle (SDLC) and quality practice based on ISO 9001.",
    plan: [
      { m: "Month 1", t: "Foundations", x: "The basics of your domain, the tools of the trade and Git for working in a team." },
      { m: "Month 2", t: "Core skills", x: "The main skills of the domain, built with small exercises and mentor reviews." },
      { m: "Month 3", t: "Team workflow", x: "Task boards, code or design reviews, and the stages of the SDLC, practised on a guided module." },
      { m: "Month 4", t: "Real project: plan and design", x: "You join a real-time project: requirements, planning and design, written down properly." },
      { m: "Month 5", t: "Real project: build and test", x: "You build your part of the project and test it with the team." },
      { m: "Month 6", t: "Deliver and document", x: "Deployment, documentation, a final review, and introductions to industry contacts." },
    ],
    outcomes: ["Solid skills in one domain", "Experience on a real-time project", "Practice of the SDLC from requirement to delivery", "Quality records and documentation in the ISO 9001 way", "Introductions to industry contacts"],
  },
  {
    months: 9,
    slug: "9-month",
    path: "/industrial-training/9-month",
    menu: "9 Month Industrial training",
    title: "9 Month Industrial Training",
    h1: "9 Month Industrial Training",
    seoTitle: "9 Month Industrial Training in Surat | We3vision",
    seoDescription: "A 9 month industrial training at We3vision, Surat: deep skills in your domain, a full SDLC cycle on a live project, ISO 9001 based quality practice and industry contacts. Ask for the fee.",
    fit: "The most complete path: deep skills, a leading role on a real project and the contacts to start your career.",
    lede: "Nine months to go deep in your domain, take a leading part in a real-time project from the first requirement to the final release, and finish ready for the job market, with industry contacts.",
    plan: [
      { m: "Months 1 and 2", t: "Foundations and core skills", x: "The basics and the main skills of your domain, the tools of the trade and Git for teamwork." },
      { m: "Months 3 and 4", t: "Advanced skills", x: "Advanced topics of the domain: larger structures, performance, security and the tools professionals use." },
      { m: "Month 5", t: "The SDLC in full", x: "All stages of the software development life cycle, practised on a guided project." },
      { m: "Month 6", t: "Quality and ISO 9001 practice", x: "Documented requirements, reviews, test records and change tracking, the way quality-managed teams work." },
      { m: "Months 7 and 8", t: "Lead part of a real project", x: "You own a real part of a live project with the team: planning, building, testing and reporting." },
      { m: "Month 9", t: "Release and career", x: "Deployment, documentation, a final review, interview preparation and introductions to industry contacts." },
    ],
    outcomes: ["Deep skills in one domain", "A leading part in a real-time project", "The full SDLC, from requirement to release", "ISO 9001 based quality practice", "Industry contacts and interview preparation"],
  },
];

export const PROGRAM: Record<Months, Program> = { 3: PROGRAMS[0], 6: PROGRAMS[1], 9: PROGRAMS[2] };

/** the stages of the software development life cycle, the way trainees practise them on a real project */
export const SDLC = [
  { t: "Requirement analysis", x: "Understand what the client needs and write it down clearly." },
  { t: "Planning", x: "Break the work into tasks, set the order and the time." },
  { t: "Design", x: "Plan the screens, the data and the structure before coding." },
  { t: "Development", x: "Build the work in small steps, with code or design reviews." },
  { t: "Testing", x: "Check every feature, fix what is wrong, test again." },
  { t: "Deployment", x: "Release the work safely to the client." },
  { t: "Maintenance", x: "Fix, improve and support after the release." },
];

/** what the trainee learns about quality, based on ISO 9001 (quality management) */
export const ISO = [
  { t: "Written requirements", x: "Every task starts from a clear, written requirement that the client agrees to." },
  { t: "Reviews", x: "Work is reviewed by another person before it moves on." },
  { t: "Test records", x: "What was tested, what failed and what was fixed is recorded." },
  { t: "Change tracking", x: "Every change is tracked, so you always know what changed and why." },
  { t: "Documentation", x: "A project is handed over with the documents the client needs." },
];

// the links of the menu (TRAINING_LINKS) are in lib/site-menu.ts, a small file that the menu can send to the browser
