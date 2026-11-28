import type { PageSection } from "../pages";
import { build } from "./tech";

// INTERNSHIP AND INDUSTRIAL TRAINING IN SURAT (/internship-in-surat), added for search: students look for "internship in Surat", "industrial training in Surat" and
// "summer training Surat". The facts are only the ones already on the site (lib/industrial-training.ts, lib/training-shared.ts, the training pages, the Careers page):
// We3vision runs FEE-BASED industrial training of 3, 6 and 9 months (the fee depends on the domain and the length, it is shared on request) and lists internship roles on the
// Careers page. The page says plainly that the training is NOT a paid internship. Nothing is invented: no prices, stipend, certificate, placement or job guarantee, counts,
// client names or ratings. Words in *stars* are highlighted. This is what visitors see until someone publishes a version from the admin panel.

export const INTERNSHIP_SEO = {
  title: "Internship & Industrial Training in Surat | We3vision",
  description: "Internship and industrial training in Surat at We3vision: 3, 6 and 9 month fee-based training in web, app, AI, UI/UX and more, on real project work. Ask for the fee.",
};

export const INTERNSHIP_SECTIONS: PageSection[] = build({
  seo: INTERNSHIP_SEO,
  hero: {
    chip: "Internship & Training",
    heading: "Internship And Industrial\nTraining In Surat",
    text: "Learn in a working software company. We3vision, Surat, offers 3, 6 and 9 month industrial training and lists internship roles on its Careers page, for students and freshers who want real project experience.",
  },
  story:
    "Many students in Surat and across Gujarat ask the same thing: *where can I do an internship or industrial training in Surat, with a real IT company?* We3vision Private Limited is a software and creative company in Surat, India, and we take students and freshers into our team to learn how real projects are built.\n\nWe run *industrial training of 3, 6 and 9 months*. It suits students of *BE, BTech, BCA, MCA, diploma and other graduate courses*, and freshers who want to start a career in IT. You pick a domain, such as web development, app development, AI and machine learning, UI/UX design, graphic design, 3D modeling and animation or digital marketing, and you learn with a mentor and work with our team.\n\nPlease note this clearly: *our industrial training is fee-based. It is a training, not a paid internship.* The fee depends on the domain and on the length you choose, and we share it when you ask. Separate from the training, our *Careers page lists internship roles* when we have them, and you can apply there.\n\nIn the 6 and 9 month trainings you work on *real-time project work* and practise the *software development life cycle (SDLC)* and quality practice based on *ISO 9001*: written requirements, reviews, test records, change tracking and documentation. The 3 month training ends with a small project that you build yourself.",
  services: {
    heading: "Domains You Can\nLearn In Surat",
    intro: "Choose one domain and a length of 3, 6 or 9 months. The fee is different for every domain and length, and we share it when you ask.",
    cards: [
      { title: "Web\nDevelopment", description: "HTML, CSS and JavaScript, then React or Next.js, back-end work with Node.js or PHP, and databases." },
      { title: "App\nDevelopment", description: "Phone apps for Android and iPhone with Flutter, React Native, Kotlin or Swift." },
      { title: "Software\nDevelopment", description: "Back-end systems, APIs, databases and testing, the way business software is built." },
      { title: "AI / Machine\nLearning", description: "Python, data handling, machine learning models, chatbots and AI tools such as OpenAI and TensorFlow." },
      { title: "CRM\nDevelopment", description: "Customer and sales systems: forms, pipelines, automation and connecting them to other software." },
      { title: "Metaverse,\nVR and AR", description: "3D worlds and VR / AR experiences with Unity and Unreal Engine." },
      { title: "UI/UX\nDesign", description: "User research, wireframes, clickable prototypes and clean, usable interfaces." },
      { title: "Graphic and\nBrand Design", description: "Logos, brand identity, social and print design, with the guidelines that keep a brand consistent." },
      { title: "2D/3D Modeling\nand Animation", description: "3D models, 2D and 3D animation and video editing." },
      { title: "E-commerce\n(Shopify, WordPress)", description: "Online stores, themes, plugins and custom features on Shopify, WordPress and WooCommerce." },
      { title: "Digital\nMarketing", description: "SEO, Meta ads, content and how to measure what works." },
    ],
  },
  process: {
    heading: "How To Join Our\nTraining In Surat",
    intro: "Three simple steps, from choosing your domain to your first day.",
    items: [
      { title: "Choose a domain and a length", text: "Pick the domain you like and a training of 3, 6 or 9 months.", points: "One domain\n3, 6 or 9 months" },
      { title: "Ask for the fee", text: "Write to us. We share the fee for that domain and length, and answer your questions before you decide.", points: "Fee for your domain\nYour questions answered" },
      { title: "Start learning", text: "We confirm your batch and you begin with your mentor, working like a real team with task boards and reviews.", points: "Your batch is confirmed\nMentor and real project work" },
    ],
  },
  tools: { heading: "What You\nWork With", items: "HTML, CSS, JavaScript\nReact and Next.js\nNode.js and PHP\nFlutter and React Native\nPython and TensorFlow\nUnity and Unreal Engine\nShopify and WordPress\nGit and task boards\nSEO and Meta ads" },
  why: {
    heading: "Why Choose We3vision\nFor Training In Surat",
    items: [
      { title: "A working company, not only a classroom", description: "You learn inside a software and creative company in Surat and work with our team on real-time project work." },
      { title: "Month-by-month plan", description: "Every training has a clear plan for each month, from foundations to a project, so you know what you will learn." },
      { title: "SDLC on real projects", description: "You practise all stages of the software development life cycle: requirement, planning, design, development, testing, deployment and maintenance." },
      { title: "ISO 9001 based practice", description: "You learn how teams work when quality is managed: written requirements, reviews, test records, change tracking and documentation." },
      { title: "Many domains in one place", description: "Development, design, e-commerce and marketing are all done by our own teams, so you can choose the domain that suits you." },
      { title: "Honest about the fee", description: "The training is fee-based and we say so on the first page. The fee is shared on request, and nothing is hidden." },
    ],
  },
  faq: [
    { question: "Is there an internship in Surat for IT students?", answer: "Yes. We3vision, a software and creative company in Surat, offers 3, 6 and 9 month industrial training for IT and design students and freshers, and lists internship roles on its Careers page when they are open. The training is fee-based; open roles are on the Careers page." },
    { question: "Which company offers industrial training in Surat?", answer: "We3vision Private Limited, based in Surat, India, offers industrial training of 3, 6 and 9 months in domains such as web development, app development, AI and machine learning, UI/UX design, graphic design, 3D modeling and animation and digital marketing." },
    { question: "Is the training paid or free?", answer: "It is neither a paid internship nor free. The industrial training at We3vision is fee-based: you pay a fee and learn what the industry needs. The fee depends on the domain and on the length (3, 6 or 9 months), and we share it when you ask. Internship roles, when open, are listed on our Careers page." },
    { question: "How long is the industrial training?", answer: "You can choose 3, 6 or 9 months. The 3 month training covers the foundations of one domain and a small project, the 6 month training adds a real-time project and the SDLC, and the 9 month training goes deeper and gives you a leading part in a real project." },
    { question: "Who can join the industrial training in Surat?", answer: "The training is meant for students of BE, BTech, BCA, MCA, diploma and other graduate courses, and for freshers who want to start a career in IT. Write to us with your course and the domain you like, and we will tell you which length suits you." },
    { question: "Can I do summer training in Surat at We3vision?", answer: "Our 3 month industrial training is a good fit for a first step into the industry, such as a summer break. Tell us your dates when you contact us, and we will confirm the batch." },
    { question: "Which domains can I choose for training or internship in Surat?", answer: "You can choose web development, app development, software development, AI and machine learning, CRM development, metaverse, VR and AR, UI/UX design, graphic and brand design, 2D/3D modeling and animation, e-commerce on Shopify and WordPress, or digital marketing." },
    { question: "Is there a web development or AI internship in Surat?", answer: "Web development and AI / machine learning are two of the domains of our industrial training in Surat. Web development covers HTML, CSS, JavaScript, React or Next.js and back-end work; AI covers Python, data handling and machine learning models. Open internship roles are listed on our Careers page." },
    { question: "Is there a UI/UX design or data internship in Surat?", answer: "UI/UX design is one of our training domains: user research, wireframes, clickable prototypes and clean interfaces. For data work, our AI / machine learning domain covers Python and data handling. Ask us about your interest and we will guide you." },
    { question: "Will I work on real projects during the training?", answer: "Yes. In the 6 and 9 month trainings you work on real-time project work with our team and practise the SDLC with reviews and records. In the 3 month training you build a small project from requirement to testing." },
    { question: "Do I get a certificate or a job after the training?", answer: "Please ask us about the certificate when you contact us. We do not promise a job. In the 6 and 9 month trainings you are introduced to industry contacts, which can make your first step into a career easier." },
    { question: "How do I apply for the internship or training?", answer: "Choose a domain and a length, then write to us on the contact page to ask for the fee. We answer your questions, confirm your batch and you start with your mentor. For internship roles, apply on the Careers page." },
  ],
  related: [
    { title: "3 Month\nIndustrial Training", description: "The foundations of one domain, guided building and a small project of your own.", href: "/industrial-training/3-month" },
    { title: "6 Month\nIndustrial Training", description: "Solid skills plus a real-time project, the SDLC and ISO 9001 based practice.", href: "/industrial-training/6-month" },
    { title: "9 Month\nIndustrial Training", description: "Deep skills, a leading part in a real project and interview preparation.", href: "/industrial-training/9-month" },
    { title: "Careers at\nWe3vision", description: "See the roles that are open now, including internship roles, and apply.", href: "/careers" },
  ],
  cta: { heading: "Ready To Start Your\nTraining In Surat?", text: "Tell us your course, the domain you like and the length you want. We will share the fee and the next batch.", button: "Ask for the fee" },
});
