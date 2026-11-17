// The part of every privacy policy page that is the same in all countries: who we are, how we work, what data we keep for a client, where it is
// used, how it is stored and deleted. The region text (regions.ts) is put in the middle. Do not write a made-up number or a certificate here:
// only what We3vision really does and promises.
import { POLICY_EMAIL, POLICY_PHONE, type Region, type Section } from "./regions";

const before = (r: Region): Section[] => [
  {
    id: "who",
    title: "Who we are and what this page covers",
    paras: [
      `We3vision Private Limited ("We3vision", "we", "us") is a web, app, AI, metaverse, UI/UX, CRM, SEO and brand-design company. Our head office is in Surat, Gujarat, India and we have an office in Marburg, Germany. This page explains how we handle personal data for ${r.name === "all countries" ? "every person and every company we work with" : `people and companies in ${r.name}`}: visitors of our website, people who write to us, people who apply for a job, and the clients for whom we build and run projects.`,
      "A short rule that sums it up: we collect only what we need, we use it only for the work it was given for, we keep it safe, we do not sell it, and we delete or return it when the work is over.",
    ],
  },
  {
    id: "how-we-work",
    title: "How we work on a client project",
    paras: ["Every project goes through the same steps. At each step this is what happens to data:"],
    list: [
      "1. Enquiry: you write to us (form, e-mail, phone, chat). We keep your name, contact details and what you ask, only to reply and to make a quote.",
      "2. Agreement: we sign a contract and, when the project handles personal data of your customers or staff, a data processing agreement. It says what we may do with the data and for how long.",
      "3. Design and build: our team works on your requirements, content and, if needed, test data. We ask for test or sample data first. Real customer data is used only when the project cannot be tested without it, and only after you agree.",
      "4. Testing and launch: the project runs on servers you choose or approve. Access for our team is limited, named and logged.",
      "5. Support and updates: we see your live data only when you ask for support, and only as much as needed to solve the problem.",
      "6. Handover and end: we hand over the code, content and data, and delete our copies (see 'How long we keep data').",
    ],
  },
  {
    id: "data-we-collect",
    title: "What data we collect",
    list: [
      "Website visitors: pages visited, device and browser type, approximate location from the IP address, and the cookies described below.",
      "People who write to us: name, e-mail, phone number, company, country and the message, from the contact form, chat or e-mail.",
      "Job applicants: the CV, contact details and what the applicant sends us.",
      "Clients: company and billing details, names and contact details of the client's team, project files and the accounts we need to work on the project.",
      "Data of a client's customers or staff, which a client lets us handle inside a project (see the next two sections). We do not collect this data for ourselves.",
    ],
    paras: [
      "We do not ask for sensitive data (health, religion, political opinion, biometric data, passwords of private accounts) for our own purposes. If a project needs it, the client tells us in writing and we apply stricter rules.",
    ],
  },
  {
    id: "client-data-store",
    title: "How we save a client's data",
    paras: [
      "The data of a client belongs to the client. We keep it like this:",
    ],
    list: [
      "Where: on the client's own servers or accounts where possible, otherwise on project servers that the client approves. The place (country) is written in the contract.",
      "Who can open it: only the named members of the project team, each with a personal account. No shared passwords. When a person leaves the project or the company, the access is closed at once.",
      "How it is protected: encrypted connections (HTTPS/TLS), strong passwords with two-step sign-in where the tool has it, separate working copies for each client, and regular updates of the software.",
      "No private places: client data is not kept on private phones, private e-mail accounts or personal cloud drives.",
      "Backups: made only where the project needs them, with the same protection, and removed on a schedule.",
      "Records: we keep a log of who got access to what, and we keep a written plan for a data breach.",
    ],
  },
  {
    id: "client-data-use",
    title: "Where a client's data is used",
    paras: ["A client's data is used only in these places, and nowhere else:"],
    list: [
      "To build and test the project the client ordered (website, app, CRM, AI tool, store, VR/AR world, design).",
      "To run, host and support the project after launch, when the client asks us to.",
      "To fix a fault, find the cause of a problem and improve the security of that project.",
      "To meet a legal duty (for example when a court or authority asks, in a lawful way).",
      "We do NOT use a client's data to train our own AI models, to make our own advertising, to sell to others, or for another client's project. If an AI tool in the project processes the data, we use only the tools the client has approved and the client is told which tool it is.",
    ],
  },
  {
    id: "our-own-use",
    title: "Where our own data (visitors, enquiries, applicants) is used",
    list: [
      "To reply to you and make a quote.",
      "To run, secure and improve our website (find errors, stop spam and attacks, see which pages are useful).",
      "To judge a job application.",
      "To send you news about our work, only if you agreed, and with a link to stop.",
      "To keep the accounts, taxes and contracts that the law needs.",
    ],
  },
];

const after = (): Section[] => [
  {
    id: "sharing",
    title: "Who we share data with",
    paras: [
      "We do not sell personal data. We share it only with: our own team members who need it; service providers who work for us under a contract (hosting, e-mail, project tools, payment services, analytics), who may use it only for us; the client for whose project we process it; and authorities when the law says we must.",
      "A provider that holds a client's data is called a sub-processor. We tell the client before we use one and the contract gives it the same duties we have. The list is available on request.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep data",
    list: [
      "Enquiries that do not become a project: up to 24 months, then deleted.",
      "Job applications: up to 12 months after the job is filled, unless the applicant agrees that we keep it longer.",
      "Client contracts, invoices and tax records: as long as the law of the place requires (in India, usually 8 years).",
      "Project working copies and a client's data: deleted, or returned to the client, within 90 days after the project ends or earlier on the client's written request. Backups disappear within 30 more days. If the contract says something else, the contract wins.",
      "Server and website logs: usually up to 12 months.",
    ],
    paras: ["We may keep data longer only if a law needs it or for a legal claim, and then only the part that is needed."],
  },
  {
    id: "security",
    title: "Security and data breach",
    paras: [
      "We protect data with the measures above and we improve them over time. No system is 100% safe. If we find a breach that touches your data, we tell the client without delay (within 24 hours of finding it) and give the facts that the client needs to tell the authority and the people, as the law of the country requires.",
    ],
  },
  {
    id: "transfers",
    title: "Data across borders",
    paras: [
      "Our development team works from India, and we have an office in Germany. A client's data may therefore be seen or processed in India or Germany, and on the servers the client approves. When the law of the client's country limits such a transfer, we use the tool that law asks for (for example standard contractual clauses) and tell you in the country page.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    paras: [
      "Our website uses the cookies that it needs to work (for example to remember your choices). Where the law needs your consent for other cookies, we ask first and you can change your mind at any time in your browser. We do not use cookies to sell data.",
    ],
  },
  {
    id: "children",
    title: "Children",
    paras: [
      "Our website and services are for businesses and not for children. We do not knowingly collect data of children under 13 (or the age that the law of your country sets). If a client's project is meant for children, the client must get the consent of the parents and we build the steps into the project. If you think a child sent us data, write to us and we delete it.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paras: [
      "When the law or our way of working changes, we update this page and the date at the top. For a big change we tell our clients by e-mail. Older versions are available on request.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    paras: [
      `We3vision Private Limited, Surat, Gujarat, India. E-mail: ${POLICY_EMAIL}. Phone: ${POLICY_PHONE}. Our German office is in Marburg: see the Contact page for the address. Write "Privacy request" in the subject. If you are not happy with our answer, you can complain to the data protection authority of your country (named on the page of your country).`,
    ],
  },
];

/** all sections of one policy page, in reading order: common start, the region's own part, common end */
export function policySections(r: Region): Section[] {
  return [...before(r), ...r.sections, ...after()];
}
