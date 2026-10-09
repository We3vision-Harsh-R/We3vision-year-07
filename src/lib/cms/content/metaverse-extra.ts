// Content of the two sections that follow the services on the Metaverse page: the device wall ("vrDevices", replaces the tools cloud)
// and the "which reality fits your idea" quiz ("vrQuiz", before the contact form). Written from what the old Metaverse page and the team's
// own projects say: the devices are the ones the page talks about (headsets, phone AR, the browser, the game engines); nothing here
// promises a result. Everything is editable in the admin panel.

export const DEVICES = {
  chip: "Devices & platforms",
  heading: "Built For Every\nDevice",
  intro: "Choose a device to see what we build for it. Use the filter to see which ones fit AR, VR, XR or MR.",
  ctaLabel: "Plan it for this device",
  toolsLabel: "Technology we work with",
  tools: "Unity\nUnreal Engine\nWebGL\nThree.js\nWebXR\nA-Frame\nBlender\nCinema 4D\nSpatial.io\nMozilla Hubs\nDecentraland SDK",
  items: [
    {
      name: "Meta Quest & VR headsets",
      kind: "VR headset",
      realities: "VR",
      text: "Fully immersive worlds that people step into: training simulations, virtual showrooms and site walkthroughs. Our VR simulation for the Ministry of Coal is built for Meta (Oculus) headsets.",
      tags: "Unity\nCinemachine\nMeta (Oculus)",
    },
    {
      name: "Apple Vision Pro & spatial headsets",
      kind: "Spatial computing",
      realities: "MR XR",
      text: "Spatial experiences where digital objects sit in the room around you: product demos, 3D visualisation and shared design reviews, planned around your goal and the device you choose.",
      tags: "Spatial experiences\n3D visualisation",
    },
    {
      name: "HoloLens & mixed-reality glasses",
      kind: "Mixed reality",
      realities: "MR",
      text: "Hands-free mixed reality for teams: guided procedures, design reviews and remote work on the same 3D model.",
      tags: "Mixed reality\nTeamwork",
    },
    {
      name: "Phone & tablet AR",
      kind: "Augmented reality",
      realities: "AR",
      text: "AR on the phones people already own: product previews in their own space, try-ons and interactive guides, with ARKit and ARCore.",
      tags: "ARKit\nARCore",
    },
    {
      name: "Browser & WebXR",
      kind: "On the web",
      realities: "AR VR XR",
      text: "AR and VR that open from a link or a QR code, with nothing to install. Good for campaigns, kiosks and quick demos.",
      tags: "WebXR\nWebGL\nThree.js\nA-Frame",
    },
    {
      name: "Unity & Unreal Engine",
      kind: "Real-time 3D",
      realities: "AR VR MR XR",
      text: "The real-time 3D engines behind our worlds, simulations and interactions, with 3D models made in Blender and Cinema 4D.",
      tags: "Unity\nUnreal Engine\nBlender\nCinema 4D",
    },
  ],
};

export const QUIZ = {
  chip: "Find your reality",
  heading: "Which Reality\nFits Your Idea?",
  intro: "Answer three quick questions and we will point you to AR, VR, XR or MR. It takes less than a minute.",
  startLabel: "Start",
  restartLabel: "Start again",
  ctaLabel: "Discuss this with us",
  // one line per answer: the answer | the realities it points to (a reality written twice counts twice)
  questions: [
    {
      question: "What do you want to achieve?",
      options: "Show a product or a place to customers | AR VR\nTrain people or explain a process | VR\nRun a virtual event or a showroom | VR XR\nMix digital content with a real room or team | MR\nI am not sure yet | XR",
    },
    {
      question: "Who will use it?",
      options: "Customers, on their own phones | AR\nStaff or students, with headsets | VR\nTeams in one room or working remotely | MR\nEveryone, on any device | XR",
    },
    {
      question: "Which device do you have in mind?",
      options: "A phone or a tablet | AR\nA VR headset, like Meta Quest | VR\nA mixed-reality headset or glasses | MR\nA browser, on any device | XR AR\nNot decided yet | XR",
    },
  ],
  results: [
    {
      code: "AR",
      title: "Augmented Reality (AR)",
      text: "You want people to see and try something in their own space, from a phone, without a headset. AR puts digital layers on top of the real world: product previews, interactive guides and try-ons.",
      project: "A good first step: an AR preview of one product that opens from a link or a QR code.",
    },
    {
      code: "VR",
      title: "Virtual Reality (VR)",
      text: "You want people to feel inside a place: a showroom, a site, a training room or an event. VR gives them a fully immersive virtual world with a headset, the way our road construction VR works for NRIDA.",
      project: "A good first step: a VR walkthrough or training simulation of one process or one place.",
    },
    {
      code: "XR",
      title: "Extended Reality (XR)",
      text: "You want one experience that works across devices, or you are not sure yet which technology fits. XR plans AR, VR and MR together, from the first idea to the launch.",
      project: "A good first step: a short talk about your goal, then a small prototype on one device.",
    },
    {
      code: "MR",
      title: "Mixed Reality (MR)",
      text: "Your digital content has to live in the real room and react to it: product demos, design reviews or shared work, with everybody looking at the same model.",
      project: "A good first step: a mixed-reality demo of one product or one space.",
    },
  ],
};
