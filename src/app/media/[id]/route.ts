import { db, hasDb } from "@/lib/db";

// A picture uploaded in the admin panel (table Media). The id of a picture never changes content (a new upload gets a new id), so it can be
// kept by the browser and by a CDN for a year.
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!hasDb || !/^[a-z0-9]{10,40}$/i.test(id)) return new Response("Not found", { status: 404 });
  const row = await db.media.findUnique({ where: { id }, select: { mime: true, data: true, name: true } });
  if (!row) return new Response("Not found", { status: 404 });
  // a picture is shown in the page; anything else (a resume sent to the Careers page) is only ever downloaded
  const isImage = row.mime.startsWith("image/");
  return new Response(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.mime,
      ...(isImage ? {} : { "Content-Disposition": `attachment; filename="${row.name.replace(/[^\w.-]+/g, "_")}"` }),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'",
    },
  });
}
