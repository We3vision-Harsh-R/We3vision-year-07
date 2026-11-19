import type { PageSection } from "../pages";
import { build, related } from "./tech";

// GAME DEVELOPMENT (/game-development), added 2026-11-19 for search: the site named game development as a service (About page, Metaverse page) but had no page of its
// own, so nobody searching "game development company in India" or "make a game like GTA" could find it. Written for this site, in plain words: the facts are the
// ones already on the site (Unity, Unreal Engine, WebGL, Three.js, WebXR, 3D modeling, animation, VR training and simulation projects, Surat, India). Nothing is invented:
// no prices, client names, game titles, counts or results. "GTA" is used only to describe a style of game (an open-world, sandbox game), the page says that the
// company is not connected to the owner of that name, and it promises no copy of any other game. Words in *stars* are highlighted. This is what visitors see
// until someone publishes a version from the admin panel.

export const GAME_SEO = {
  title: "Game Development Company in India | Unity & Unreal | We3vision",
  description: "We3vision builds 3D games with Unity and Unreal Engine for web, mobile and VR: open-world and GTA-style prototypes, simulations and branded games. Surat, India.",
};

const BASE = build({
  seo: GAME_SEO,
  hero: {
    chip: "Game Development",
    heading: "Game Development\nCompany In India",
    text: "From a first playable prototype to a finished game. We design and build interactive 3D games and game experiences with Unity and Unreal Engine, for web, mobile, VR and emerging platforms.",
  },
  story:
    "A good game is more than good graphics. It is a *world with rules*, a goal that makes the player want to carry on, and controls that feel right. We3vision is a *game development company in Surat, India* that builds interactive *3D games and game experiences* with *Unity* and *Unreal Engine*, for the web, mobile devices, VR and other emerging platforms.\n\nGames are part of our metaverse and 3D work, so one team looks after the whole project: the game idea and design, the 3D models and animation, the interface, the code and the testing. A game can be made for entertainment, and also for *training, education, real estate and brand campaigns*, where an interactive experience holds attention better than a brochure.\n\nMany clients start with the same sentence: *we want something like GTA*. That style is called an *open-world or sandbox game*: a big 3D city or landscape that the player explores on foot or by vehicle, with missions and things to do. We build *GTA-style open-world games* at a scope that fits your goal and your budget, for example a driving city, a mission-based world or a branded virtual city. Games from the biggest studios are made by hundreds of people over several years, so we tell you honestly what is realistic before we start.\n\nGTA and Grand Theft Auto are trademarks of Take-Two Interactive Software, Inc. We3vision is an independent company and is not connected to Take-Two or Rockstar Games. We use the name only to describe a style of game, and we never copy another game's characters, maps, music or art: your game gets its own look and its own story.",
  services: {
    heading: "Our Game\nDevelopment Services",
    intro: "One team for the whole game, from the first idea to the update after launch.",
    cards: [
      { title: "Open-world and\nsandbox games", description: "Explorable 3D cities and landscapes with vehicles, characters and missions: the style people call GTA-style, built at a scope that fits your goal." },
      { title: "3D games for\nweb and mobile", description: "Games that run in the browser with WebGL and Three.js, or as mobile apps, so your players can start playing in a few seconds." },
      { title: "VR and AR\ngames", description: "Immersive games for headsets and phones: training games, simulations, tours and branded experiences." },
      { title: "Metaverse and\nmultiplayer worlds", description: "Shared virtual worlds where many people meet, play and take part in events." },
      { title: "Driving, action\nand mission games", description: "Games built around driving, quick action and missions, with controls tuned until they feel good." },
      { title: "Game design and\nprototyping", description: "The idea, the rules, the levels and a first playable prototype, so you can test the fun before full production starts." },
      { title: "3D art, animation\nand game interface", description: "Characters, vehicles, buildings and props, animation and effects, and menus and screens that are easy to use." },
      { title: "Online features\nand support", description: "Player accounts, leaderboards and servers when your game needs them, and updates and fixes after launch." },
    ],
  },
  process: {
    heading: "How We Build\nYour Game",
    intro: "A clear path from the first idea to a game your players can open.",
    items: [
      { title: "Idea and scope", text: "We learn what the game is, who will play it and on which devices, then agree how big the first version should be.", points: "Players and platforms\nSize of the first version" },
      { title: "Prototype", text: "We build a first playable version of the key moments, so you can try the game early and we can change direction cheaply.", points: "Core gameplay\nA playable test" },
      { title: "Production", text: "We make the 3D art, animation, levels, interface and code, and add features step by step in short rounds you can review.", points: "3D art and animation\nLevels, code and interface" },
      { title: "Testing and polish", text: "We playtest on the real devices, fix bugs, tune the controls and check that the game runs smoothly.", points: "Playtests and bug fixing\nSpeed on real devices" },
      { title: "Launch and updates", text: "We publish the game, help with the release and stay on hand for updates, fixes and new content.", points: "Release support\nUpdates after launch" },
    ],
  },
  tools: { heading: "Game Tools And\nTechnologies", items: "Unity\nUnreal Engine\nWebGL\nThree.js\nWebXR\nA-Frame\nBlender\nCinema 4D\nCinemachine\nMeta (Oculus) headsets" },
  why: {
    heading: "Why Choose We3vision\nFor Game Development",
    items: [
      { title: "One team for the whole game", description: "Game design, 3D art, animation, interface and code come from one company, so nothing is lost between teams." },
      { title: "Unity and Unreal Engine", description: "We choose the engine that fits your platform, your look and your budget, instead of forcing one tool on every project." },
      { title: "VR and 3D experience", description: "We build VR simulations and 3D worlds, and the same skills go into your game." },
      { title: "Honest scope", description: "We tell you what is realistic for your time and budget, and suggest a smaller first version when the idea is very big." },
      { title: "Play it early", description: "You get a first playable prototype early, so you can test the fun before the full production starts." },
      { title: "Support after launch", description: "Updates, fixes and new content once the game is live." },
    ],
  },
  industries: {
    heading: "Games For\nEvery Industry",
    intro: "A game can teach, sell, show and entertain. Some of the places where we use it.",
    items: [
      { name: "Education and training", description: "Training games and simulations that let people practise a task step by step, safely." },
      { name: "Real estate", description: "Walk-through games and interactive tours of properties and projects." },
      { name: "Construction and mining", description: "VR simulations of processes and sites, for training and planning." },
      { name: "Brands and marketing", description: "Branded games, virtual events and interactive campaigns that people want to play." },
      { name: "Entertainment", description: "Stand-alone games for players on the web, on mobile and in VR." },
      { name: "Retail and e-commerce", description: "Virtual showrooms and playful shopping experiences that show products in 3D." },
    ],
  },
  faq: [
    { question: "Does We3vision provide game development services?", answer: "Yes. We3vision builds interactive 3D games and game experiences for web, mobile, VR and emerging platforms with Unity and Unreal Engine, from the first prototype to launch and updates." },
    { question: "Can you build a game like GTA?", answer: "We can build open-world and sandbox games in the style of games like GTA: an explorable 3D city with vehicles, characters and missions. Games from the biggest studios are made by hundreds of people over several years, so we agree a scope that fits your goal and budget, such as a smaller city, a focused set of missions or a branded driving world. We tell you honestly what is realistic before we start, and your game gets its own look and story, not a copy of another game." },
    { question: "Can you build a game like GTA 6?", answer: "We can build a game in the style of open-world games like GTA 6: a big 3D city to explore, vehicles, characters and missions. GTA 6 is made by one of the biggest studios in the world over many years, so a game of that size is not realistic for a normal project budget. What we can do is agree a smaller scope that keeps the feel, for example one district, a focused set of missions or a branded driving world, and build it with its own look and story." },
    { question: "What is an open-world game?", answer: "An open-world game lets the player move freely through a large world and choose what to do and in which order, instead of following a fixed series of levels. Exploring a city, driving, taking missions or just wandering around are all part of the game." },
    { question: "Is Unity or Unreal Engine better for an open-world game?", answer: "Both can be used. Unreal Engine is known for high-quality visuals, and Unity is flexible and strong for mobile, web and VR. We choose with you, based on the platform, the look, the team and the budget." },
    { question: "How much does it cost to develop a game like GTA?", answer: "It depends on the size of the world, the number of missions and vehicles, the quality of the art, the platforms and the online features. We do not give a price before we know the scope. Tell us your idea and we will suggest a scope and a plan; a small prototype costs far less than a full game." },
    { question: "How long does it take to build a game?", answer: "A first playable prototype can be ready much sooner than a full game, which takes months or more depending on its size. We agree the stages and the dates with you at the start." },
    { question: "Can you make a game that runs in a browser and on mobile phones?", answer: "Yes. We build 3D games for the web with WebGL and Three.js, and games for mobile devices, so players can start without a big download or get the game from the store." },
    { question: "Do you build VR and AR games?", answer: "Yes. We build VR and AR games and simulations with Unity and Unreal Engine, for example training simulations, virtual tours and branded experiences for headsets and phones." },
    { question: "Do you make the 3D models and animation too?", answer: "Yes. Characters, vehicles, buildings, props, animation, effects and the game interface are made by our 3D modeling, animation and UI/UX teams, so the game has one consistent look." },
    { question: "Will my game idea stay confidential?", answer: "Yes. Your idea stays yours, and we protect it with confidentiality rules." },
    { question: "Is We3vision connected to Rockstar Games or the GTA series?", answer: "No. We3vision is an independent company in Surat, India. GTA and Grand Theft Auto are trademarks of Take-Two Interactive Software, Inc. We use the name only to describe a style of game." },
  ],
  related: related("metaverse", "modeling", "mobile"),
  cta: { heading: "Ready To Turn Your\nGame Idea Into A Game?", text: "Tell us your idea, your players and your platform. We will suggest a scope, a first prototype and a plan.", button: "Get a free quote" },
});

// the explanation of a GTA-style game: its parts as a second "reasons" block, right after the services (own id, so the page has no duplicate id)
const OPEN_WORLD: PageSection = {
  id: "open-world",
  type: "advantages",
  data: {
    chip: "Open-world games",
    heading: "What Goes Into A\nGTA-Style Game",
    intro: "An open-world game is many systems working together. These are the parts we plan, build and test for you.",
    items: [
      { title: "A big world that loads as you move", description: "The city or landscape is built in pieces that load and unload around the player, so the world feels huge and still runs smoothly." },
      { title: "Vehicles that feel right", description: "Cars, bikes and other vehicles with believable driving, handling and crashes, because driving is half of the fun." },
      { title: "People and traffic", description: "Characters and crowds that walk, talk and react, and traffic that follows the roads, so the city feels alive." },
      { title: "Missions and story", description: "Tasks, goals, rewards and a story that give the player a reason to explore, with a clear way to follow progress." },
      { title: "Day, night and weather", description: "Light, weather and time of day that change the mood of the city and the way the game plays." },
      { title: "Map, interface and controls", description: "A mini-map, menus, markers and controls for keyboard, gamepad or touch, designed so players always know where to go." },
      { title: "Characters, buildings and props", description: "3D models and animation for characters, buildings, vehicles and props, made by our 3D modeling and animation teams." },
      { title: "Online play and accounts", description: "Multiplayer, player accounts, leaderboards and servers, when your game needs players to meet online." },
    ],
  },
};

// the articles of the game series (Blog, topic "Game Development"): all of them, as plain links, so this page is the hub of the series
const ARTICLES: PageSection = {
  id: "game-articles",
  type: "blogs",
  data: {
    chip: "Learn",
    heading: "How GTA-Style Open-World\nGames Are Made",
    buttonLabel: "All articles",
    buttonHref: "/blog",
    layout: "masonry",
    phoneLayout: "news",
    topics: "hide",
    allLabel: "All",
    category: "Game Development",
    limit: "",
    moreLabel: "Show more articles",
    readLabel: "min read",
    emptyText: "New articles will appear here soon.",
    items: [],
  },
};

const at = BASE.findIndex((s) => s.type === "services") + 1;
const faqAt = BASE.findIndex((s) => s.type === "faq") + 1;
export const GAME_SECTIONS: PageSection[] = [...BASE.slice(0, at), OPEN_WORLD, ...BASE.slice(at, faqAt), ARTICLES, ...BASE.slice(faqAt)];
