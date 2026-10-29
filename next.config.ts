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
  experimental: { workerThreads: true, cpus: 2, globalNotFound: true },
  // development only: lets other computers on the same Wi-Fi open the dev server (http://<this PC's IP>:1010)
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],
  // `ANALYZE_STATS=1 npm run build` writes .next/stats-client.json (what is inside every browser chunk); read it with node tools/chunk-report.mjs
  // the webpack hook below is only used by the production build (`next build --webpack`); this empty block tells the Turbopack dev server that this is fine
  turbopack: {},
  webpack(config, { isServer }) {
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
  // the old staging address (07.we3vision.com) is replaced by www.we3vision.com: old links go to the same page of the real site
  async redirects() {
    return [{ source: "/:path*", has: [{ type: "host", value: "07.we3vision.com" }], destination: "https://www.we3vision.com/:path*", permanent: true }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Files in /public keep the same name when they are replaced, so they are not "immutable": a day in the browser, a week of
      // serving the old copy while a new one is fetched (stale-while-revalidate). Repeat visits and page changes skip the download.
      ...["images", "brand", "data"].map((dir) => ({
        source: `/${dir}/:path*`,
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      })),
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
