// The two government projects shown outside the metaverse office (section "vrFloor", components/site/metaverse/vr-gov.tsx).
// Facts come from the team's own project descriptions: nothing here is invented. `steps`, `tags` and `team` are one item per line
// (a team line is "Name | Role"). The ministry name of MOC is the usual full name of the Ministry of Coal: change it in the admin panel if needed.

export type GovProject = {
  org: string;
  orgFull: string;
  mark: string;
  logo: string;
  title: string;
  status: string;
  period: string;
  by: string;
  text: string;
  steps: string;
  tags: string;
  team: string;
};

export const GOV_TITLE = "Built for the Government";

export const GOV_PROJECTS: GovProject[] = [
  {
    org: "NRIDA",
    orgFull: "National Rural Infrastructure Development Agency",
    mark: "NR",
    logo: "",
    title: "Metaverse Roadwork Digitization",
    status: "Delivered",
    period: "Jul 2024 – Nov 2024",
    by: "Developed by We3vision for NRIDA, in collaboration with Cognecto",
    text: "An immersive VR experience that shows the whole road construction process, from surveying and excavation to road laying and finishing. It was built to support training and to help people understand real-world construction workflows.",
    steps: "Surveying\nExcavation\nRoad laying\nFinishing",
    tags: "Unity\nVirtual Reality",
    team: "Rutvi Valand | Project leader\nHarsh Ramoliya | Mentor\nParth Patel | Project manager\nKrina Rudani | UI/UX designer",
  },
  {
    org: "MOC",
    orgFull: "Ministry of Coal",
    mark: "MoC",
    logo: "",
    title: "VR Digitalization of Heavy Industries",
    status: "Ongoing",
    period: "Dec 2024 – Present",
    by: "Developed by We3vision, under active development",
    text: "A Virtual Reality simulation of the complete coal mining process, with detailed 3D models and step-by-step immersive visualisation of the operations. It is built in Unity with Cinemachine for Meta headsets (Oculus).",
    steps: "Drilling\nBlasting\nSoil excavation\nCoal extraction\nWagon loading\nEquipment servicing",
    tags: "Unity\nCinemachine\nMeta headset (Oculus)",
    team: "Rutvi Valand | Team leadership, VR development\nHarsh Ramoliya | Contributor\nParth Patel | Contributor",
  },
];
