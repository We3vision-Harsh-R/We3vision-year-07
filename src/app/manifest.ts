import type { MetadataRoute } from "next";

// /manifest.webmanifest: the name and icons of the website for browsers, phones and search tools. The website is not an installable app, so it
// opens in the browser ("display: browser"). The colours are the dark background of the site in its default colour theme.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "We3vision Private Limited",
    short_name: "We3vision",
    description: "We3vision Private Limited is a software and digital company in Surat, India: web, AI, apps, AR/VR and metaverse, UI/UX, CRM and brand design.",
    start_url: "/",
    scope: "/",
    display: "browser",
    lang: "en-IN",
    background_color: "#0d0316",
    theme_color: "#0d0316",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
