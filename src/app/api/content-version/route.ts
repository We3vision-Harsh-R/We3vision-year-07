import { getContentState } from "@/lib/content-version";

// The one small number the open pages ask (components/site/content-watch.tsx): the content version and whether the editor is locked.
// It never carries the content itself, never sets a cookie, and is never cached by the browser or a CDN.
export const dynamic = "force-dynamic";

export async function GET() {
  const { v, locked } = await getContentState();
  return Response.json({ v, locked }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
