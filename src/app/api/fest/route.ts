import { getFestConfigLive } from "@/lib/fest-server";

// The festival settings (Admin > Fest) for the open pages of the website: they ask now and then (components/site/fest/fest-live.tsx), so a
// change in the admin panel shows on the site without a reload. Public and harmless: it is the same data the boot script already puts in
// every page. Never cached by the browser or a CDN.
export const dynamic = "force-dynamic";

export async function GET() {
  const cfg = await getFestConfigLive();
  return Response.json(cfg, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
