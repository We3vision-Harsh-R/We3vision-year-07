import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // https only for a year (the browser never tries http again), own window (no other site can reach this tab), no Flash/PDF cross-domain files
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  // only this site may frame its pages or be the target of its forms; no <base> tricks, no plugins
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'" },
];

const nextConfig: NextConfig = {
  // set NEXT_DIST_DIR to serve a second, older build next to the new one (used to compare the look before and after a change)
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  // build on small hosts: use worker threads (no extra processes) and few workers
  experimental: { workerThreads: true, cpus: 2, globalNotFound: true, optimizePackageImports: ["three", "gsap"] },
  // gzip/brotli of text (on by default, kept explicit); pictures through next/image: AVIF/WebP, kept 31 days at the CDN/browser
  compress: true,
  images: { formats: ["image/avif", "image/webp"], minimumCacheTTL: 2678400 },
  // development only: lets other computers on the same Wi-Fi open the dev server (http://<this PC's IP>:1010)
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],
  // `ANALYZE_STATS=1 npm run build` writes .next/stats-client.json (what is inside every browser chunk); read it with node tools/chunk-report.mjs
  // the webpack hook below is only used by the production build (`next build --webpack`); this empty block tells the Turbopack dev server that this is fine
  turbopack: {},
  webpack(config, { isServer }) {
    // `NO_MINIFY=1 NEXT_DIST_DIR=.next-nm npm run build` makes a readable build (function and file names kept) for tools/cpu-profile.mjs
    if (process.env.NO_MINIFY && !isServer) config.optimization.minimize = false;
    if (process.env.ANALYZE_STATS && !isServer) {
      config.plugins.push({
        apply(compiler: { hooks: { done: { tap: (n: string, f: (s: { toJson: (o: object) => unknown }) => void) => void } } }) {
          compiler.hooks.done.tap("w3v-stats", (stats) => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            require("node:fs").writeFileSync(".next/stats-client.json", JSON.stringify(stats.toJson({ all: false, chunks: true, modules: true, chunkModules: true, ids: true, entrypoints: true })));
          });
        },
      });
    }
    return config;
  },
  // the old staging address (07.we3vision.com) is replaced by www.we3vision.com: old links go to the same page of the real site.
  // The bare domain (we3vision.com) also answers with the whole website, a second copy of every page (the canonical links, the sitemap and the structured
  // data already point to www, so Google is told which one counts). FORCE_WWW=1 (set it in the environment BEFORE the build; it is baked into the routes)
  // adds a 301 from the bare domain to www. It is off by default because it relies on the host forwarding the original Host header: if it did not, www would
  // redirect to itself. Turn it on, open https://we3vision.com/about in a private window, and remove the variable again if it does not land on www.
  async redirects() {
    // three technology pages used to be indexed under mis-spelt addresses ("devlopment"): permanent redirect to the correct ones
    const spelling = [
      ["/custom-wordpress-devlopment-services", "/custom-wordpress-development-services"],
      ["/custom-woocommerce-devlopment", "/custom-woocommerce-development"],
      ["/headless-CMS-devlopment-services", "/headless-cms-development-services"],
    ].map(([source, destination]) => ({ source, destination, permanent: true }));
    // Game Development was removed from the website (owner, 2026-11-27): the page goes to the home page, its articles to the Blog
    const gameGone = [
      { source: "/game-development", destination: "/", permanent: true },
      ...["how-gta-style-open-world-games-are-made", "open-world-map-streaming-chunks-and-lod", "vehicle-physics-in-3d-games-explained", "traffic-and-crowd-ai-in-open-world-games", "pathfinding-navmesh-and-a-star-in-games", "multiplayer-game-architecture-client-server", "netcode-lag-prediction-and-interpolation", "scaling-game-servers-for-thousands-of-players", "mission-and-quest-systems-in-open-world-games", "third-person-camera-and-controls-in-3d-games", "3d-model-pipeline-for-games-concept-to-engine", "rendering-big-3d-cities-culling-and-draw-calls", "day-night-cycle-lighting-and-weather-in-games", "procedural-generation-for-3d-game-worlds", "spatial-audio-and-sound-design-in-3d-games", "game-ui-minimaps-waypoints-and-hud-design", "player-accounts-and-databases-for-online-games", "anti-cheat-and-security-for-online-games", "unity-vs-unreal-engine-open-world-games", "gta-style-game-development-cost-time-and-team"].map((slug) => ({ source: `/blog/${slug}`, destination: "/blog", permanent: true })),
    ];
    const hosts = ["07.we3vision.com", ...(process.env.FORCE_WWW === "1" ? ["we3vision.com"] : [])].map((host) => ({ source: "/:path*", has: [{ type: "host" as const, value: host }], destination: "https://www.we3vision.com/:path*", permanent: true }));
    return [...spelling, ...gameGone, ...hosts];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Files in /public keep the same name when they are replaced, so they are not "immutable": 30 days in the browser/CDN, a year of
      // serving the old copy while a new one is fetched (stale-while-revalidate). cities.json (1 MB, only loaded when the location field is used): 7 days.
      ...["images", "brand", "mobile", "fonts"].map((dir) => ({
        source: `/${dir}/:path*`,
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=31536000" }],
      })),
      { source: "/data/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }] },
      {
        // Admin + draft preview must never be indexed or cached.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/m/preview/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/preview/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
