import type { PageSection } from "../pages";
import type { SectionData, SectionType } from "../sections";

// AI DEVELOPMENT PAGE (/ai). Source: https://we3vision.com/#/ai (the old site): same services, process steps, tools, industries,
// reasons to choose us and FAQ answers (all five answers were read from the old page); wording tidied for visitors who have
// never used AI and enriched with search keywords (AI development company, custom AI solutions, chatbots, machine learning,
// computer vision, predictive analytics, Surat, India). The "what can AI take off your plate" list and the picture are built only
// from use cases the old page names (chatbots, recommendations, image recognition, predictive analytics, fraud detection,
// lead qualification, route optimisation, AI tutors, automation of data-heavy tasks). No numbers or client names are invented,
// except the project times that the old FAQ itself states (2-3 weeks for simple bots, 1-3 months for complex models).
// Words in *stars* are highlighted. This is what visitors see until someone publishes a version from the admin panel.

// `id` must be unique on a page: pass a second one when the same section type is used twice
const section = <T extends SectionType>(type: T, data: SectionData<T>, id: string = type): PageSection => ({
  id,
  type,
  data: data as Record<string, unknown>,
});

export const AI_SEO = {
  title: "AI Development Company in India | Custom AI Solutions | We3vision",
  description:
    "Custom AI development: chatbots, recommendation systems, computer vision, predictive analytics and machine learning. We3vision builds AI that automates real business problems and connects to your website, CRM or ERP.",
};

export const AI_SECTIONS: PageSection[] = [
  section("pageHero", {
    chip: "AI Development",
    heading: "Build Smarter Applications\nWith Custom AI",
    text: "We help businesses unlock the power of Artificial Intelligence by creating custom AI tools and integrations: from chatbots and recommendation systems to image recognition and predictive analytics, we turn your ideas into smart, scalable solutions.",
    primaryLabel: "Get a free quote",
    primaryHref: "#contact",
    secondaryLabel: "See how AI works",
    secondaryHref: "#ai-flow",
  }),
  section("flow", {
    chip: "How AI works for you",
    heading: "From Your Data\nTo Real Actions",
    intro: "AI connects to the places where your information already lives, understands it, and then does the work: answering, sorting, predicting and updating your systems. Here is the whole idea in one picture.",
    sourcesLabel: "Where your data lives",
    sourcesNote: "06 connected",
    sources: [
      { label: "Website & apps", icon: "globe" },
      { label: "Emails & chats", icon: "mail" },
      { label: "CRM & sales", icon: "users" },
      { label: "Documents", icon: "doc" },
      { label: "Databases", icon: "database" },
      { label: "Images & video", icon: "image" },
    ],
    coreLabel: "We3vision AI",
    actionsLabel: "What it does for you",
    actionsNote: "06 automations",
    actions: [
      { label: "Answer customers", icon: "chat" },
      { label: "Qualify leads", icon: "bolt" },
      { label: "Write reports", icon: "chart" },
      { label: "Predict demand", icon: "search" },
      { label: "Flag risks", icon: "shield" },
      { label: "Update systems", icon: "gear" },
    ],
  }),
  section("story", {
    body: "*AI development* means building software that can *learn from your data* and make decisions or predictions without being told every single step. A normal program always follows the same fixed rules. An AI system finds patterns, understands text and images, and gets better as it sees more examples.\n\nAt We3vision we build *custom AI solutions*: *chatbots, recommendation systems, AI search, computer vision, predictive models* and custom machine learning tools. We use *machine learning, natural language processing and deep learning* to build intelligent systems that grow with your business, and every project is built from scratch around your goals and the tools you already use.",
  }),
  section("guide", {
    chip: "Meet the AI guide",
    heading: "Ask the\nrobot buddy",
    text: "Our guide works with a friendly robot buddy. Ask it a question with the buttons and see how an AI assistant answers, then move your mouse and watch it follow you.",
    scene: "ai",
    tips: "Hi! Ask my robot buddy something with the buttons below.\nAI can answer customers, sort leads and predict demand.\nSimple bots can be ready in 2–3 weeks.\nMove your mouse: the robot watches you too.",
    buttonLabel: "",
    buttonHref: "",
  }),
  // Not a plain list: every problem has a switch that flips by itself ("by hand" -> "with AI") when it scrolls into view
  section("automate", {
    chip: "What AI can automate",
    heading: "Problems AI Can\nTake Off Your Plate",
    intro: "If a task is repetitive, data-heavy or waiting for a human to read something, AI can probably help. Watch the switches flip.",
    beforeLabel: "Today: by hand",
    afterLabel: "With AI",
    doneLabel: "automated",
    items: [
      { icon: "chat", problem: "Customers wait for answers", solution: "AI chatbots answer common questions instantly, at any hour, and pass the rest to your team." },
      { icon: "database", problem: "Too much manual data work", solution: "AI automates data-heavy tasks such as entering, sorting and checking information." },
      { icon: "chart", problem: "You cannot tell what will sell", solution: "Predictive models and recommendation engines forecast demand and suggest the right product to each customer." },
      { icon: "users", problem: "Leads are not sorted", solution: "Lead qualification bots score and route enquiries, so your team talks to the right people first." },
      { icon: "image", problem: "Images take hours to review", solution: "Computer vision reads images, such as medical scans or property photos, and flags what matters." },
      { icon: "shield", problem: "Risk and fraud slip through", solution: "AI models spot unusual transactions and help assess credit risk before it becomes a loss." },
      { icon: "spark", problem: "Learners need personal attention", solution: "AI tutors and personalised learning paths give every learner help at their own pace." },
      { icon: "globe", problem: "Deliveries are not efficient", solution: "Route optimisation, demand forecasting and real-time tracking with predictive AI." },
    ],
  }),
  section("services", {
    chip: "Our AI services",
    heading: "What We\nBuild",
    intro: "Four kinds of AI work, from a simple chatbot to a full machine learning system.",
    buttonLabel: "",
    buttonHref: "",
    cards: [
      { title: "Generative AI\n& AI Agents", description: "Chatbots and AI assistants connected to your own data, tools and systems, built on models such as OpenAI.", href: "" },
      { title: "Machine\nLearning", description: "Recommendation engines, customer behaviour prediction and other models trained on your business data.", href: "" },
      { title: "Computer\nVision", description: "Image recognition for use cases like medical image analysis or property listings.", href: "" },
      { title: "MLOps\n& RAG", description: "Deployment, monitoring and retraining of models in production, plus answers grounded in your own documents.", href: "" },
    ],
  }),
  section("process", {
    chip: "Our process",
    heading: "How We Build\nYour AI",
    intro: "A simple, collaborative process, from the first conversation to long-term support.",
    items: [
      { title: "Discovery & strategy", text: "We identify your business challenges and define how AI can deliver measurable impact.", points: "Define problems and objectives\nSet success metrics" },
      { title: "Data collection & preparation", text: "We gather, clean and structure data to make sure it is accurate and reliable for training.", points: "Data sourcing and cleansing\nFeature engineering and labeling" },
      { title: "Model design & development", text: "We design and build machine learning and deep learning models tailored to your goals and datasets.", points: "Model selection and design\nBaseline training" },
      { title: "Algorithm training & testing", text: "We train with real-world data and test for accuracy, efficiency and predictive performance.", points: "Hyperparameter tuning\nValidation and test evaluation" },
      { title: "Integration with systems", text: "We integrate the AI into your existing software, CRM or platforms through APIs and services.", points: "API / service integration\nSecurity and compliance checks" },
      { title: "Performance optimization", text: "We fine-tune the algorithms for speed, accuracy and real-time adaptability.", points: "Latency and throughput tuning\nModel compression / optimization" },
      { title: "Deployment & monitoring", text: "We deploy to production and continuously monitor stability and performance.", points: "Production deployment\nObservability and alerts" },
      { title: "Support & scalability", text: "We provide ongoing support, retraining and scaling as your data and needs evolve.", points: "Retraining and updates\nCapacity planning and scaling" },
    ],
  }),
  section("tags", {
    chip: "Tools & Technologies",
    heading: "The Technology\nBehind Our AI",
    intro: "",
    items: "Python\nTensorFlow\nPyTorch\nOpenAI\nScikit-learn\nGoogle Cloud AI\nAWS AI\nAzure AI\nPandas\nNumPy\nFlask\nDocker",
  }),
  section("industries", {
    chip: "Industries We Serve",
    heading: "AI For\nEvery Industry",
    intro: "The same ideas work differently in every business. Here is what AI looks like in some of them.",
    items: [
      { name: "Healthcare", description: "AI-powered medical image analysis, symptom checkers and patient prediction models." },
      { name: "E-commerce & retail", description: "Recommendation engines, customer behaviour prediction and AI chatbots for sales." },
      { name: "Finance & insurance", description: "Fraud detection, credit risk analysis and automation of data-heavy tasks." },
      { name: "Real estate", description: "Price estimation tools, image recognition for property listings and lead qualification bots." },
      { name: "Education", description: "AI tutors, smart content creation and personalised learning paths." },
      { name: "Logistics & transport", description: "Route optimisation, demand forecasting and real-time tracking with predictive AI." },
    ],
  }),
  section("advantages", {
    chip: "Why We3vision",
    heading: "AI That Actually\nSolves Problems",
    intro: "",
    items: [
      { title: "AI experts + business thinkers", description: "We combine data science with domain knowledge to build AI that actually solves problems." },
      { title: "Custom AI, no templates", description: "Every project is built from scratch to fit your needs, goals and tech stack." },
      { title: "Ethical & secure development", description: "We follow best practices in data privacy, model transparency and ethical AI design." },
      { title: "Scalable & future-ready code", description: "Our AI systems are designed to grow with your business, flexible and easy to update." },
      { title: "Ongoing support & model tuning", description: "AI needs updates: we monitor, retrain and keep your model sharp over time." },
    ],
  }, "why-we3vision"),
  section("faq", {
    chip: "FAQ",
    heading: "Questions\nWe Often Hear",
    intro: "",
    items: [
      { question: "What type of AI solutions do you build?", answer: "We build chatbots, recommendation systems, AI search, computer vision, predictive models and custom machine learning tools." },
      { question: "Do I need to have my own data?", answer: "If you have data, great! If not, we help gather or use open-source / public data to train your model." },
      { question: "How much time does an AI project take?", answer: "It depends. Simple bots can be done in 2–3 weeks. Complex models take 1–3 months." },
      { question: "Can your AI integrate with our current systems?", answer: "Yes! We build APIs or plugins that connect with your website, CRM, mobile app or ERP." },
      { question: "Will I need a developer to maintain it later?", answer: "Not always. We can automate monitoring and even offer ongoing support packages." },
    ],
  }),
  section("contact", {
    chip: "Let's talk",
    heading: "Ready To Bring\nYour Idea To Life?",
    text: "Fill out the form or contact us directly to get a free consultation. Tell us the problem you would like to automate and We3vision will suggest how AI can help.",
    buttonLabel: "Get a free quote",
  }),
];
