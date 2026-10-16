// BLOG POSTS (/blog and /blog/<slug>). Source: the two articles of the blog of the old site (https://we3vision.com/#/blog). They are shortened and
// reworded here (every heading and every point is from the article, nothing is added). The posts live in this file for now; to add one, add
// an entry below (and its image in public/images/blog).

export type Block = { h: string } | { p: string } | { ul: string[] };

export type Post = {
  slug: string;
  title: string;
  category: string;
  date: string; // ISO date
  dateLabel: string;
  image: string;
  summary: string;
  tags: string[];
  blocks: Block[];
  faq: { question: string; answer: string }[];
};

export const POSTS: Post[] = [
  {
    slug: "what-is-uiux-design-and-why-does-it-matter-for-businesses",
    title: "What Is UI/UX Design and Why Does It Matter for Businesses?",
    category: "Design",
    date: "2026-09-16",
    dateLabel: "September 16, 2026",
    image: "/images/blog/ui-ux-design.webp",
    summary: "Understand how UI/UX design enhances usability, customer satisfaction, and digital experiences while enabling businesses to develop better websites and apps.",
    tags: ["UI/UX Design", "Web Design", "User Experience", "Digital Products"],
    blocks: [
      { p: "A business website or digital product is often the first touchpoint a potential customer has with a brand. Users form a perception in seconds, based on how the interface looks, how easily they find information and how smoothly they can complete an action." },
      { p: "UI/UX design is a blend of visual interface design and user experience planning, to create digital products that are appealing, accessible and easy to use. It is more than choosing colours and fonts or adding animation: it is about understanding users, structuring information, designing intuitive interactions and making sure the final product supports business goals." },
      { h: "What is UI/UX design?" },
      { p: "UI/UX design joins two closely related disciplines. User Interface (UI) design is what you see and engage with in a digital product. User Experience (UX) design is the whole experience users have when they interact with it. Together they make digital experiences that are visually consistent, understandable and usable." },
      { p: "Think of an online shop. UI design covers the product cards, buttons, typography, colours and layout. UX design covers how customers search for products, apply filters, compare items, add products to the cart and complete checkout. A website can look good and still frustrate users if it is hard to navigate, and it can work well but be hard to use if the interface is inconsistent. Good UI/UX design merges the two." },
      { h: "The difference between UI and UX" },
      { ul: ["UI: visual interfaces, typography, colours, buttons, forms and page layouts, and a consistent look.", "UX: the overall experience, user flows, usability and research, how users complete their tasks, and simplicity."] },
      { h: "Why UI/UX design matters for businesses" },
      { ul: [
        "It leaves a good first impression: a clear, consistent interface helps visitors understand what you do, who the service is for and what to do next.",
        "It improves usability: confusing menus, hidden buttons, needless form fields, poorly structured content and hard-to-use mobile pages are found and fixed in the planning stage.",
        "It supports engagement: logical page structure and clear calls to action help people view services, read product details, create an account, add to cart or send an enquiry. Design alone cannot guarantee a business result, because content quality, product value and performance matter too.",
        "It keeps your brand consistent: the same type, colours, buttons, spacing and icons across every page, and reusable components that help designers and developers work together.",
        "It supports mobile and responsive use: layouts and interactions that adapt to phones, tablets, laptops and desktops, with readable text and touch-friendly buttons.",
        "It reduces friction: any barrier that stops users from doing something, such as a difficult checkout or an unclear form, is a chance to make things clearer and simpler.",
      ] },
      { h: "Key elements of UI/UX design" },
      { ul: [
        "Discovery and UX research: defining the users, the business objectives and the problems the product has to solve.",
        "Information architecture: the structure of content and features, such as navigation, page hierarchy, content types and user journeys.",
        "Wireframes and prototypes: the skeleton of a page before it is styled, and interactive models that let stakeholders review the experience before development.",
        "UI and design systems: fonts, colours, layouts, buttons, forms and cards, with reusable components and rules that keep things consistent.",
        "Design-to-development hand-off: approved layouts, component details, spacing, responsive behaviour and design assets, with open communication between designer and developer.",
      ] },
      { h: "Which businesses can use it?" },
      { ul: [
        "Start-ups: wireframes, prototypes and focused user flows help test an idea before investing in full development.",
        "Small and medium businesses: better usability and structure for websites, service pages, contact forms and online shops.",
        "E-commerce companies: product discovery, category navigation, filters, product details, cart and checkout.",
        "Digital platforms and enterprises: consistent design patterns across many features, teams and user roles.",
      ] },
      { h: "The UI/UX design process" },
      { p: "A project usually runs in phases, and the exact process depends on the requirements: learn and define the business objectives and users; design the user flows; design wireframes; design the interface; review and refine; and hand over to development. Larger projects may need more research, testing and iteration." },
      { h: "How to choose a UI/UX design company" },
      { ul: [
        "Look at related portfolio work for projects like yours, and at how the design solved the original problem.",
        "Ask about the design process: discovery, wireframes, prototypes, UI design and hand-off.",
        "Check how communication and feedback work, because design is iterative.",
        "Ask how mobile layouts, navigation and accessibility will be handled.",
        "Agree the deliverables before you start: wireframes, prototypes, high-fidelity screens, components and hand-off documents.",
      ] },
      { h: "Common mistakes to avoid" },
      { ul: ["Putting looks above usability.", "Ignoring mobile users.", "Inconsistent components.", "Too much content and too many competing visual elements.", "Designing screens without thinking about the user flow.", "Not involving developers early enough.", "Unclear calls to action."] },
      { h: "Conclusion" },
      { p: "UI/UX design is vital for consistent and useful digital experiences. It combines user research, information architecture, wireframes, visual design and interaction design, and it should be part of product planning, not a visual styling step. Launching a new website or revamping a platform? Start by outlining your requirements and talk with a UI/UX design team." },
    ],
    faq: [
      { question: "What is UI/UX design in simple words?", answer: "It is the visual design of a digital interface, plus the planning of the whole experience of the user. UI is how a product looks and responds; UX is its usability, navigation and user journeys." },
      { question: "What is the difference between UI and UX?", answer: "UI design is about the visual side: typography, colours, buttons and layouts. UX design is about how users move through and interact with a product to reach their goals." },
      { question: "Is UI/UX design necessary for every business website?", answer: "Every website involves design decisions, but how much UI/UX work you need depends on the complexity, the audience and the goals. A simple website and a large digital platform need different processes." },
      { question: "What does a UI/UX design project include?", answer: "Depending on the scope: UX discovery, information architecture, wireframes, prototypes, UI design, responsive screens, design systems and design-to-development hand-off." },
      { question: "What is a design system?", answer: "A collection of reusable design components, patterns and guidelines. It keeps screens consistent and can make design and development more efficient." },
      { question: "How long does UI/UX design take?", answer: "It depends on the number of screens, the complexity, the research needed, the feedback cycles and the deliverables. Once the scope is clear, a timeline can be set." },
      { question: "Should UI/UX design be done before development?", answer: "Usually it is created first, so teams can review the structure, user flows and interface. Design and development can also be iterative, depending on the approach." },
      { question: "How do I start a UI/UX project with We3vision?", answer: "Talk to us about your website or digital product through the UI/UX Design page or the Contact page. We agree the scope, availability and deliverables together." },
    ],
  },
  {
    slug: "how-ai-can-automate-business-processes",
    title: "How AI Can Automate Business Processes",
    category: "AI/ML",
    date: "2026-09-16",
    dateLabel: "September 16, 2026",
    image: "/images/blog/ai-automation.webp",
    summary: "Find out how AI automates business processes, streamlines tasks, improves workflows, and enables smarter business decisions.",
    tags: ["AI Business Automation", "AI Development", "Business Process Automation", "Workflow Automation", "CRM Automation", "ERP Automation"],
    blocks: [
      { p: "Businesses waste countless hours on repetitive tasks like data entry, processing emails, extracting information from documents and updating CRM records. These tasks may need to be done, but not necessarily by hand at every step." },
      { p: "The opportunity is not just to \"use AI\". It is to find the right workflows where AI can reduce repetitive manual work while people stay in charge of decisions that matter." },
      { h: "What is business process automation with AI?" },
      { p: "It is the use of artificial intelligence to automate repetitive or information-heavy workflows. Traditional automation is rule-based: if X happens, do Y. Where the input varies and needs a little interpretation, AI can take care of the workflow. For example, an AI workflow can receive an email, work out what the customer is asking, pull out the key details and pass them to the right system." },
      { h: "Where AI can automate" },
      { ul: [
        "Data extraction: turning emails, documents, forms and invoices into structured data (document data mining, OCR, form handling, classification).",
        "Email automation: classifying incoming mail, identifying the request, gathering a response and sending it to the right team. Where approval is needed, the AI prepares the answer and an employee decides.",
        "CRM automation: extracting and classifying leads, updating customer details, assigning leads by business rules, prompting follow-ups and summarising customer interactions.",
        "ERP workflow automation: processing data and documents, routing requests and keeping records updated. AI can complement an ERP system, not replace it.",
        "Intelligent workflow automation: understanding the information, deciding the route, taking the business action and asking for human review when needed.",
        "Web automation: gathering information, moving data between systems and running predefined actions, with proper controls on permissions and data access.",
        "Customer service automation: understanding queries, answering frequent questions, routing complex issues and creating support records.",
        "Sales process automation: lead capture, classification, CRM updates, follow-up reminders and reporting.",
      ] },
      { h: "AI automation and traditional automation" },
      { p: "Traditional automation is mainly rule-based and works well for predictable, repetitive processes. AI-based automation can handle variable inputs and less structured information, and it helps with classification and routing. Many organisations use both: for example, AI reads an incoming document, traditional automation updates the database and a business rule triggers a notification." },
      { h: "Advantages" },
      { ul: ["Less repetitive manual work, so employees spend more time on communication, creativity and analysis.", "More consistent workflows.", "Faster processing of large amounts of structured and unstructured information.", "Connected business systems through integrations and APIs.", "Better support for decisions, with human oversight where the consequences are significant."] },
      { h: "How to select processes to automate" },
      { ul: [
        "Step 1: find repetitive tasks, such as duplicate data entry, email processing, record updates, data extraction and regular reports.",
        "Step 2: map your existing workflow: input, processing steps, business rules, systems used, human approvals and output.",
        "Step 3: identify the bottlenecks, where people spend the most time or information is held up.",
        "Step 4: assess whether AI is appropriate: is it repetitive, is there enough data, does it involve interpreting information, are the rules clear, can it connect to your systems, and where is human approval needed?",
        "Step 5: begin with one well-defined workflow before you automate the whole organisation.",
        "Step 6: measure process time, manual steps, errors and workflow completion.",
      ] },
      { h: "An AI automation project, step by step" },
      { ul: ["Workflow discovery.", "Automation opportunity assessment.", "Solution design, with workflow logic, integrations and human approval points.", "Development.", "Integration with business applications and data sources.", "Testing of normal, exception, permission and failure flows.", "Deployment.", "Monitoring and optimisation."] },
      { h: "What should not be automated with AI" },
      { p: "AI is not a substitute for human decision-making. Look carefully at processes that involve confidential information, high-stakes decisions, regulatory or legal obligations, financial sanctions, security-sensitive actions, complex exceptions or professional judgement. AI can help process information in these workflows, but people keep control and approval." },
      { h: "For businesses of every size" },
      { ul: ["Small businesses can start with targeted workflows like email handling, lead processing, customer service, data collection and CRM updates.", "Growing companies can connect several systems and automate workflows across sales, support, operations and reporting.", "Enterprises may need wider workflow orchestration, integrations, governance, permissions and monitoring."] },
      { h: "Summary" },
      { p: "The most value comes when AI solves a defined, specific business problem. Instead of asking \"where can we use AI?\", ask: what repetitive workflow is slowing our team down, and what part of it can be intelligently automated? Automate real workflows, integrate with your existing systems and keep the right level of human supervision." },
    ],
    faq: [
      { question: "What is AI business process automation?", answer: "It uses artificial intelligence to carry out specific repetitive or information-heavy business tasks and workflows, such as data extraction, email handling and request routing." },
      { question: "What business processes can AI automate?", answer: "Emails, documents, data extraction, customer support, CRM workflows, ERP workflows, sales processes and other repetitive, information-heavy tasks." },
      { question: "Is AI automation better than traditional automation?", answer: "They solve different problems. Traditional automation is good at predictable, rule-based processes; AI can help where inputs vary and information has to be interpreted. Many businesses use both." },
      { question: "Can AI automate CRM processes?", answer: "Yes. AI can help with CRM workflows such as pulling lead information, updating records, classifying leads, starting follow-ups and routing leads." },
      { question: "Can AI automate ERP processes?", answer: "It can help with certain ERP processes, such as information processing, data extraction, routing and repetitive updates." },
      { question: "Will AI automation replace employees completely?", answer: "Not necessarily. Selected repetitive tasks can be handled by AI automation while employees continue to handle decisions, exceptions and approvals." },
      { question: "How do I know if my business needs AI automation?", answer: "Look for processes that are repetitive, time-consuming and information-heavy. Then assess the process, the data, the integrations, the business rules and where human approval is needed." },
    ],
  },
];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);
