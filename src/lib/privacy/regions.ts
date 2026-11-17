// PRIVACY POLICIES: the list of regions and the text that is specific to each one. The shared text (how we work, where data is kept and used, security,
// retention) lives in common.ts. One page per region: /privacy-policy-general, /privacy-policy-usa, /privacy-policy-germany ...
// To add a country: add an entry here, add the folder src/app/(site)/privacy-policy-<slug>/page.tsx (4 lines, copy any other) and a line in
// src/app/sitemap.ts is NOT needed (it reads REGIONS). The text is written by We3vision and must be checked by a lawyer before a client relies on it.

export type Section = { id: string; title: string; paras?: string[]; list?: string[]; note?: string };

export type Region = {
  slug: string; // the address is /privacy-policy-<slug>
  tag: string; // the label of the tag under the heading
  code: string; // 2 or 3 letters shown in the tag
  name: string; // the full name used in text ("the United States")
  title: string; // heading of the page
  intro: string; // one paragraph under the heading
  laws: string[]; // the laws the page follows, shown as a list
  keywords: string; // extra words the search finds (country, law short names)
  sections: Section[]; // the sections that are only for this region
};

export const POLICY_VERSION = "1.0";
export const POLICY_UPDATED = "17 November 2026";
export const POLICY_EMAIL = "info@we3vision.com";
export const POLICY_PHONE = "+91 7383216096";

const dpo = `Write to ${POLICY_EMAIL} with the subject "Privacy request". We answer within the time the law of your country allows (30 days at the latest unless the law says less).`;

export const REGIONS: Region[] = [
  {
    slug: "general",
    tag: "General policy",
    code: "ALL",
    name: "all countries",
    title: "Privacy Policy",
    intro:
      "This is the main privacy policy of We3vision Private Limited. It applies to everybody, in every country, and it follows Indian law. If you or your company is in a country that has a page of its own (tags above), read that page too: it adds what that country's law needs.",
    laws: [
      "Digital Personal Data Protection Act, 2023 (India) and the rules made under it",
      "Information Technology Act, 2000, section 43A, and the SPDI Rules, 2011 (India)",
      "Our own world-wide standard: the strictest rule of the pages below is the one we aim for everywhere",
    ],
    keywords: "india dpdp it act spdi world worldwide global general",
    sections: [
      {
        id: "india-law",
        title: "Indian law that applies to us",
        paras: [
          "We3vision Private Limited is a company registered in India with its head office in Surat, Gujarat. Indian law applies to all our work, wherever the client is.",
        ],
        list: [
          "Digital Personal Data Protection Act, 2023 (DPDP Act): we ask for your consent in clear words, we use data only for the purpose we told you, and we delete it when the purpose is over.",
          "IT Act, 2000 and the SPDI Rules, 2011: we keep reasonable security practices for sensitive personal data (passwords, financial details, health details and the like).",
          "If data of a person is breached, we tell the people and the authority as the law requires (for India: the Data Protection Board of India).",
        ],
      },
      {
        id: "india-rights",
        title: "Your rights under Indian law",
        list: [
          "Know what data of yours we hold and why (right to information about your personal data).",
          "Ask us to correct, complete or update it.",
          "Ask us to erase it when it is no longer needed.",
          "Withdraw your consent at any time. Withdrawing does not make the earlier use unlawful.",
          "Nominate a person who can use these rights for you if you die or cannot act.",
          "Complain to us first. If we do not solve it, you can complain to the Data Protection Board of India.",
        ],
        note: `To use a right: ${dpo}`,
      },
      {
        id: "grievance",
        title: "Grievance officer (India)",
        paras: [
          `Our grievance officer for privacy complaints can be reached at ${POLICY_EMAIL} or by post at our head office in Surat, Gujarat, India. We acknowledge a complaint within 3 working days and try to solve it within 30 days.`,
        ],
      },
      {
        id: "other-countries",
        title: "Working for clients in other countries",
        paras: [
          "When we work on a project for a company in another country, the law of that country about its customers' data also applies to the project. The tags above open one page for each country: what we do, what the client does, and what we sign (data processing agreements, standard contractual clauses and so on). If your country is not yet listed, write to us before the project starts and we will add it to the contract.",
        ],
      },
    ],
  },
  {
    slug: "usa",
    tag: "USA",
    code: "US",
    name: "the United States",
    title: "Privacy Policy for United States clients",
    intro:
      "The United States has no single privacy law. There are state laws (California first), laws for special data (health, children, finance) and the rules of the Federal Trade Commission. This page tells US clients and visitors what we do under them when we build a project for a company in the United States.",
    laws: [
      "California Consumer Privacy Act as amended by the California Privacy Rights Act (CCPA/CPRA)",
      "State privacy laws of Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA), Utah (UCPA), Texas (TDPSA), Oregon, Montana and the other states that have one",
      "Children's Online Privacy Protection Act (COPPA)",
      "Health Insurance Portability and Accountability Act (HIPAA), only when a Business Associate Agreement is signed",
      "Gramm-Leach-Bliley Act (GLBA), only for financial-service projects",
      "Section 5 of the FTC Act (no unfair or deceptive practices) and the data breach laws of every state",
    ],
    keywords: "usa us united states america california ccpa cpra virginia colorado texas hipaa coppa glba ftc state",
    sections: [
      {
        id: "us-sell",
        title: "We do not sell your data",
        paras: [
          "We do not sell personal information and we do not share it for cross-context behavioural advertising. We have not done so in the last 12 months. Our client's customers' data is used only to build, run and support the client's project.",
        ],
      },
      {
        id: "us-ccpa",
        title: "California and other state rights",
        paras: [
          "If you live in California, Virginia, Colorado, Connecticut, Utah, Texas, Oregon or another state with a privacy law, you have these rights:",
        ],
        list: [
          "Know and access the personal information we hold about you.",
          "Delete it, and correct it when it is wrong.",
          "Opt out of sale, of sharing for advertising and of profiling. (We do not do these, so there is nothing to opt out of, but you can still ask.)",
          "Limit the use of sensitive personal information.",
          "Not be treated worse because you used a right.",
          "Appeal our answer (in states that give an appeal right). Write to the same address and say 'Appeal'.",
        ],
        note: `Use a right: ${dpo} We check that the request comes from you (usually by answering from the same e-mail address) and we answer within 45 days (we can extend it once by 45 days and then tell you why).`,
      },
      {
        id: "us-role",
        title: "Our role: service provider or processor",
        paras: [
          "When we build or run a project for a US company, the client decides why and how the data of its customers is used. We act as its 'service provider' (California) or 'processor' (other states). We process the data only on the client's written instructions, we do not combine it with other data, we do not use it for our own purposes, and we sign a written agreement that says so (a data processing addendum).",
        ],
      },
      {
        id: "us-health",
        title: "Health, finance and children",
        list: [
          "Health data (HIPAA): we do not accept protected health information unless a Business Associate Agreement is signed first and the project is set up for it.",
          "Financial data (GLBA): for banks, lenders and similar clients we follow the written information security programme of the client.",
          "Children (COPPA): our website is not for children under 13. If a client's project is for children, the client must get the parent's consent and we build the consent steps into the project.",
        ],
      },
      {
        id: "us-breach",
        title: "If there is a data breach",
        paras: [
          "We tell the client without undue delay (and within 72 hours of finding out for a confirmed breach) so the client can meet the breach laws of its states, which have their own deadlines. The client decides who is told, and we help with the facts.",
        ],
      },
      {
        id: "us-transfer",
        title: "Data goes to India",
        paras: [
          "Our development team works from India, so the client's data may be seen from India. We tell US clients this before the project starts and write it in the contract. Where the client needs the data to stay in the United States, we work on servers the client controls in the United States and our team connects to them with named accounts.",
        ],
      },
    ],
  },
  {
    slug: "germany",
    tag: "Germany",
    code: "DE",
    name: "Germany",
    title: "Datenschutz / Privacy Policy for Germany",
    intro:
      "We3vision has an office in Marburg, Germany, and works for German companies. German law adds to the EU data protection rules (GDPR): the Federal Data Protection Act (BDSG), the rules on cookies and end devices (TDDDG) and the rules on the legal notice (DDG). This page says what a German client can expect and what we sign.",
    laws: [
      "General Data Protection Regulation (GDPR, DSGVO)",
      "Bundesdatenschutzgesetz (BDSG), the Federal Data Protection Act",
      "Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG, formerly TTDSG): cookies and access to the end device (section 25)",
      "Digitale-Dienste-Gesetz (DDG): legal notice (Impressum) of a website",
      "The data protection laws of the German states (Landesdatenschutzgesetze) for clients in the public sector",
    ],
    keywords: "germany german deutschland marburg hesse hessen dsgvo gdpr bdsg tdddg ttdsg ddg impressum avv av-vertrag toms auftragsverarbeitung",
    sections: [
      {
        id: "de-avv",
        title: "Data processing contract (Auftragsverarbeitungsvertrag, AVV)",
        paras: [
          "When we handle personal data for a German client, Article 28 GDPR needs a written contract. We sign it before we get access to the data. It says: what we process and for how long; that we act only on the client's documented instructions; that everyone on our team who sees the data is bound to secrecy; which technical and organisational measures (TOMs) we use; that we help with the rights of data subjects and with breaches; that we use sub-processors only with the client's approval; and that we delete or return the data at the end.",
          "We can sign the client's own AVV template or give ours. The text can be in German or in English.",
        ],
      },
      {
        id: "de-toms",
        title: "Technical and organisational measures (Article 32 GDPR)",
        list: [
          "Access only for named team members who need it for the project, with their own accounts and two-step sign-in where the tool allows it.",
          "Encryption of data in transit (HTTPS/TLS) and, where the client's setup allows, at rest.",
          "Work on the client's systems or on project servers, not on private laptops or personal clouds.",
          "Separate working copies for each client, deleted at the end of the project.",
          "A written plan for a breach, and a log of who got access to what.",
          "Training of the team about data protection and secrecy.",
        ],
        note: "The full list is attached to the AVV and can be sent before you sign.",
      },
      {
        id: "de-hosting",
        title: "Where the data is hosted",
        paras: [
          "For German and other EU clients we agree where the project data is stored before the project starts. Where the project needs it, we use servers in Germany or the EU. Our development team is in India, which is a country without an EU adequacy decision, so access from India is a transfer to a third country: we cover it with the EU Standard Contractual Clauses (see the European Union page) and extra measures (encryption, limited access, logging).",
        ],
      },
      {
        id: "de-cookies",
        title: "Cookies and tracking (TDDDG section 25)",
        paras: [
          "On a German website we build, a cookie or a script that is not strictly necessary (analytics, advertising, maps, video embeds) starts only after the visitor says yes in a cookie banner that has an equal 'accept' and 'reject' button. We build the banner and the records of the consent into the project. Our own site follows the same rule.",
        ],
      },
      {
        id: "de-impressum",
        title: "Legal notice (Impressum) and privacy page",
        paras: [
          "A German business website needs a legal notice (section 5 DDG) and a privacy notice that is easy to find from every page. We add both to the websites we build, with the text the client gives us or a draft that the client's lawyer checks. The notice about this site is on the Contact page: We3vision Private Limited, Surat, India, with the German office in Marburg.",
        ],
      },
      {
        id: "de-employee",
        title: "Employee data and works councils",
        paras: [
          "If a project handles data of employees (an HR tool, a time sheet, an intranet), section 26 BDSG and, where there is one, the works council (Betriebsrat) are involved. We build the project so that the client can show what is processed and why, and we do not build functions that watch the performance or behaviour of staff unless the client confirms that the works council agreed.",
        ],
      },
      {
        id: "de-authority",
        title: "Supervisory authority",
        paras: [
          "Our German office is in Marburg in the state of Hesse. The supervisory authority for Hesse is the Hessischer Beauftragter für Datenschutz und Informationsfreiheit (HBDI) in Wiesbaden. You can complain there, or to the authority of the state in which you live or work.",
        ],
      },
      {
        id: "de-rights",
        title: "Your rights",
        list: [
          "Information and access (Article 15), correction (16), erasure (17), restriction (18), data portability (20), objection (21).",
          "Not to be subject to a decision made only by a machine that affects you in a big way (22).",
          "Withdraw consent for the future at any time (7).",
        ],
        note: `Use a right: ${dpo}`,
      },
    ],
  },
  {
    slug: "eu",
    tag: "European Union",
    code: "EU",
    name: "the European Union and the EEA",
    title: "Privacy Policy for European Union clients",
    intro:
      "The General Data Protection Regulation (GDPR) applies to a project for a client in any country of the European Union or the EEA, and to every person there whose data we handle. This page tells what that means for the way we work. (Germany has its own page for the German additions.)",
    laws: [
      "General Data Protection Regulation (EU) 2016/679 (GDPR)",
      "ePrivacy Directive 2002/58/EC and the national cookie laws of each country",
      "Standard Contractual Clauses of the European Commission (Decision 2021/914) for transfers to third countries",
      "National data protection laws of each member state",
    ],
    keywords: "eu european union eea gdpr scc standard contractual clauses france spain italy netherlands ireland austria belgium sweden poland adequacy article 28 dpa",
    sections: [
      {
        id: "eu-basis",
        title: "Why we may use data (legal bases, Article 6)",
        list: [
          "Contract: to answer your enquiry, make a quote and do the work you ordered.",
          "Consent: for the newsletter, for optional cookies and for anything else where we ask 'do you agree?'. You can withdraw it at any time.",
          "Legitimate interest: to keep our site secure, to stop spam and abuse, and to run our business. We weigh it against your rights first.",
          "Legal duty: for tax, accounting and when an authority asks us in a lawful way.",
        ],
      },
      {
        id: "eu-roles",
        title: "Controller and processor",
        paras: [
          "For our own website, enquiries, job applications and business contacts we are the controller. For the personal data that a client's customers or staff enter into a project we build or run for the client, the client is the controller and we are the processor under Article 28. We sign a data processing agreement with each client and keep a record of the processing (Article 30).",
        ],
      },
      {
        id: "eu-transfer",
        title: "Transfers outside the EU/EEA (Chapter V)",
        paras: [
          "Our team in India has no adequacy decision of the European Commission. When the team can see EU personal data, the transfer is covered by the Standard Contractual Clauses (module 2 controller to processor, or module 3 processor to processor), a written transfer impact assessment, and added measures: encryption, limited and logged access, and a duty to challenge an unlawful order from an authority. Our German office in Marburg is part of the same group of We3vision.",
        ],
      },
      {
        id: "eu-subs",
        title: "Sub-processors",
        paras: [
          "We use a sub-processor (for example a hosting or e-mail service) only with the client's approval, with the same duties in a contract as ours, and we tell the client in advance about a change so it can object. The list is sent on request.",
        ],
      },
      {
        id: "eu-breach",
        title: "Data breach",
        paras: [
          "We tell the client without undue delay and within 24 hours of finding a breach of the client's data, so the client can tell the authority within 72 hours (Article 33) and the people where the risk is high (Article 34). For a breach of our own controller data we tell the authority and the people ourselves.",
        ],
      },
      {
        id: "eu-dpia",
        title: "Privacy by design and impact assessments",
        paras: [
          "We build projects with data minimisation and default settings that protect privacy (Article 25). If a project is likely to be high risk (profiling, large-scale sensitive data, AI that decides about people), we help the client do the data protection impact assessment (Article 35) before it goes live.",
        ],
      },
      {
        id: "eu-rights",
        title: "Your rights and complaints",
        list: [
          "Access, correction, erasure, restriction, portability and objection (Articles 15 to 21).",
          "Withdraw consent for the future.",
          "Complain to the supervisory authority of the country where you live, work or where the issue happened.",
        ],
        note: `Use a right: ${dpo}`,
      },
    ],
  },
  {
    slug: "uk",
    tag: "United Kingdom",
    code: "UK",
    name: "the United Kingdom",
    title: "Privacy Policy for United Kingdom clients",
    intro:
      "After Brexit the United Kingdom has its own version of the GDPR. This page tells UK clients and visitors what we do under it. It follows the same ideas as the European Union page, but the papers, the authority and the transfer tools are British.",
    laws: [
      "UK General Data Protection Regulation (UK GDPR)",
      "Data Protection Act 2018, as changed by the Data (Use and Access) Act 2025",
      "Privacy and Electronic Communications Regulations 2003 (PECR): cookies and marketing messages",
    ],
    keywords: "uk united kingdom britain england scotland wales ico ukgdpr pecr idta addendum",
    sections: [
      {
        id: "uk-roles",
        title: "Controller and processor",
        paras: [
          "For our own site, enquiries and job applications we are the controller. For a project we build or run for a UK client, the client is the controller and we are its processor. The written contract that Article 28 UK GDPR needs is signed before we get the data.",
        ],
      },
      {
        id: "uk-transfer",
        title: "Transfers to India",
        paras: [
          "India has no UK adequacy regulation. When our team can see UK personal data we use the International Data Transfer Agreement (IDTA) or the UK Addendum to the EU Standard Contractual Clauses, and we keep a transfer risk assessment. We add encryption, limited access and logging.",
        ],
      },
      {
        id: "uk-cookies",
        title: "Cookies and e-mail marketing (PECR)",
        paras: [
          "On a UK website we build, a cookie that is not strictly necessary starts only after the visitor agrees. Marketing e-mails go only to people who said yes, or to existing customers about similar services with a simple way to stop them (soft opt-in).",
        ],
      },
      {
        id: "uk-breach",
        title: "Data breach",
        paras: [
          "We tell the client without delay and within 24 hours of finding a breach, so the client can report it to the Information Commissioner's Office (ICO) within 72 hours when the law says so.",
        ],
      },
      {
        id: "uk-rights",
        title: "Your rights and complaints",
        list: [
          "Access, correction, erasure, restriction, portability and objection. Rights about automated decisions.",
          "Withdraw consent at any time.",
          "Complain to the Information Commissioner's Office (ico.org.uk), the UK authority.",
        ],
        note: `Use a right: ${dpo}`,
      },
    ],
  },
  {
    slug: "canada",
    tag: "Canada",
    code: "CA",
    name: "Canada",
    title: "Privacy Policy for Canadian clients",
    intro:
      "Canada has a federal law for companies (PIPEDA) and stronger laws in some provinces, above all Quebec. This page tells Canadian clients what we do for a project in Canada.",
    laws: [
      "Personal Information Protection and Electronic Documents Act (PIPEDA)",
      "Quebec: Act respecting the protection of personal information in the private sector, as changed by Law 25",
      "Alberta PIPA and British Columbia PIPA",
      "Canada's Anti-Spam Legislation (CASL)",
    ],
    keywords: "canada canadian pipeda quebec law 25 alberta british columbia casl ontario opc",
    sections: [
      {
        id: "ca-principles",
        title: "The 10 fair information principles (PIPEDA)",
        list: [
          "Accountability: one person at We3vision is responsible for privacy.",
          "Identifying purposes, consent and limiting collection: we say why we need the data and collect only that.",
          "Limiting use, disclosure and retention: we use it for that purpose and delete it afterwards.",
          "Accuracy, safeguards and openness: we keep it correct, protected, and tell you how we handle it.",
          "Individual access and challenging compliance: you can see your data and complain.",
        ],
      },
      {
        id: "ca-quebec",
        title: "Quebec (Law 25)",
        paras: [
          "For a project that handles personal information of people in Quebec we help the client with: a privacy impact assessment before data goes outside Quebec, a person responsible for the protection of personal information, privacy settings that are the strictest by default, notice when a decision is made only by a machine, and notice to the Commission d'accès à l'information of a serious incident. We provide French text for the privacy notice and the consent when the client asks.",
        ],
      },
      {
        id: "ca-transfer",
        title: "Data processed outside Canada",
        paras: [
          "Our team is in India. The client stays responsible for the data and tells its customers that it may be processed in another country. We handle it under a contract that gives the same level of protection, and we tell the client about any request of a foreign authority.",
        ],
      },
      {
        id: "ca-breach",
        title: "Breach of security safeguards",
        paras: [
          "We tell the client without delay and within 24 hours of finding a breach so the client can report to the Office of the Privacy Commissioner of Canada and tell the people where there is a real risk of significant harm. We keep a record of all breaches for 24 months.",
        ],
      },
      {
        id: "ca-rights",
        title: "Your rights and complaints",
        list: [
          "See your personal information, ask for a correction, and withdraw consent (with reasonable notice).",
          "Complain to us, and then to the Office of the Privacy Commissioner of Canada (priv.gc.ca) or to your provincial commissioner.",
        ],
        note: `Use a right: ${dpo}`,
      },
    ],
  },
  {
    slug: "australia",
    tag: "Australia",
    code: "AU",
    name: "Australia",
    title: "Privacy Policy for Australian clients",
    intro:
      "Australia's Privacy Act 1988 and its 13 Australian Privacy Principles (APPs) apply to most companies. This page tells Australian clients what we do for a project in Australia, including sending data to our team in India.",
    laws: [
      "Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs)",
      "Notifiable Data Breaches scheme (Part IIIC of the Privacy Act)",
      "Spam Act 2003",
      "State laws for health records (for example in Victoria and New South Wales)",
    ],
    keywords: "australia australian privacy act 1988 app oaic ndb sydney melbourne spam act",
    sections: [
      {
        id: "au-app8",
        title: "Sending data overseas (APP 8)",
        paras: [
          "Before an Australian company sends personal information to us in India, APP 8 says it must take reasonable steps to make sure we handle it as the APPs require. We sign a contract with this promise, give the client our security measures, and the client stays accountable for what we do with the data.",
        ],
      },
      {
        id: "au-ndb",
        title: "Notifiable Data Breaches",
        paras: [
          "If we find a breach that is likely to cause serious harm, we tell the client within 24 hours so the client can assess it within 30 days and tell the Office of the Australian Information Commissioner (OAIC) and the people when required.",
        ],
      },
      {
        id: "au-direct",
        title: "Direct marketing (APP 7) and the Spam Act",
        paras: [
          "On an Australian project we build the consent, the sender name and a working 'unsubscribe' link into every marketing e-mail or SMS, as the Spam Act needs.",
        ],
      },
      {
        id: "au-rights",
        title: "Your rights and complaints",
        list: [
          "Ask for access to your information (APP 12) and for a correction (APP 13).",
          "Deal with us without giving your name when that is practical (APP 2).",
          "Complain to us. If you are not satisfied after 30 days, you can complain to the OAIC (oaic.gov.au).",
        ],
        note: `Use a right: ${dpo}`,
      },
    ],
  },
  {
    slug: "uae",
    tag: "UAE",
    code: "AE",
    name: "the United Arab Emirates",
    title: "Privacy Policy for UAE clients",
    intro:
      "The United Arab Emirates has a federal data protection law and two free-zone laws (DIFC in Dubai and ADGM in Abu Dhabi). This page tells UAE clients what we do for a project in the UAE.",
    laws: [
      "Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL)",
      "DIFC Data Protection Law, DIFC Law No. 5 of 2020",
      "ADGM Data Protection Regulations 2021",
      "Sector rules for health data, banking and government clients",
    ],
    keywords: "uae emirates dubai abu dhabi difc adgm pdpl gulf middle east",
    sections: [
      {
        id: "ae-pdpl",
        title: "Federal PDPL",
        paras: [
          "The PDPL needs the consent of the person for most processing, a clear purpose, data that is correct, and security that fits the risk. People have the right to information, to access, to correct, to delete, to restrict, to portability and to object to automated decisions. We build these into the project and sign a processor contract with the client.",
        ],
      },
      {
        id: "ae-free-zones",
        title: "DIFC and ADGM",
        paras: [
          "A client in the Dubai International Financial Centre or Abu Dhabi Global Market follows its own law, which is close to the GDPR. For these clients we use the same processor contract, records and breach steps as on the European Union page, and report to the Commissioner of Data Protection of the zone.",
        ],
      },
      {
        id: "ae-transfer",
        title: "Data sent outside the UAE",
        paras: [
          "Our team is in India. A transfer from the UAE needs a country that has the protection required, or a contract and safeguards, or the consent of the person. We use a contract that gives the same level of protection and limits access to named staff. For clients in regulated sectors we work on servers that stay inside the UAE.",
        ],
      },
      {
        id: "ae-rights",
        title: "Your rights",
        list: [
          "Access, correction, deletion, restriction, portability, objection, and withdrawal of consent.",
          "Complain to us and to the UAE Data Office, or to the authority of the free zone where the client is.",
        ],
        note: `Use a right: ${dpo}`,
      },
    ],
  },
  {
    slug: "singapore",
    tag: "Singapore",
    code: "SG",
    name: "Singapore",
    title: "Privacy Policy for Singapore clients",
    intro:
      "Singapore's Personal Data Protection Act 2012 (PDPA) applies to all organisations that handle personal data of people in Singapore. This page tells Singapore clients what we do for a project there.",
    laws: [
      "Personal Data Protection Act 2012 (PDPA)",
      "Do Not Call (DNC) Registry rules of the PDPA",
      "Sector guides for finance (MAS) and health",
    ],
    keywords: "singapore sg pdpa pdpc dnc mas",
    sections: [
      {
        id: "sg-obligations",
        title: "The PDPA obligations we follow",
        list: [
          "Consent, purpose limitation and notification: people know why their data is used.",
          "Access and correction, accuracy, protection and retention limitation.",
          "Transfer limitation: data leaves Singapore only under a contract that gives the same standard of protection.",
          "Accountability and data breach notification.",
        ],
      },
      {
        id: "sg-processor",
        title: "Data intermediary",
        paras: [
          "When we process data for a Singapore client we are its 'data intermediary'. We must protect it and delete it when it is no longer needed, and the client stays responsible for compliance. We sign a written contract that says so.",
        ],
      },
      {
        id: "sg-breach",
        title: "Data breach",
        paras: [
          "We tell the client without delay and within 24 hours of finding a breach. The client then tells the Personal Data Protection Commission (PDPC) within 3 calendar days and the people when the breach is likely to cause significant harm or is of significant scale.",
        ],
      },
      {
        id: "sg-dnc",
        title: "Marketing messages",
        paras: [
          "On a Singapore project we check the Do Not Call Registry before a marketing call, SMS or fax to a Singapore number, and we build the consent and opt-out into the project.",
        ],
      },
      {
        id: "sg-rights",
        title: "Your rights",
        list: ["Access and correct your personal data.", "Withdraw your consent. Complain to us, and then to the PDPC (pdpc.gov.sg)."],
        note: `Use a right: ${dpo}`,
      },
    ],
  },
];

export const regionBySlug = (slug: string) => REGIONS.find((r) => r.slug === slug);
export const regionPath = (r: Region) => `/privacy-policy-${r.slug}`;
