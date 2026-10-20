import "server-only";
import { db } from "@/lib/db";

// Pictures sent by an AI tool (upload_image). Same rule as the admin upload (src/app/api/admin/upload/route.ts): the file must really be a
// JPG, PNG, WEBP or GIF (checked by its first bytes, not by its name). SVG is not accepted. The limit is smaller because the picture travels
// inside a JSON message as base64.

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function imageKind(b: Uint8Array): string | null {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  if (b.length > 6 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return "image/gif";
  return null;
}

export type ImageResult = { ok: true; url: string; mime: string; size: number } | { ok: false; error: string };

/** Decodes the base64 text, checks it and keeps it in the Media table. */
export async function storeImage(filename: string, base64: string): Promise<ImageResult> {
  const clean = base64.replace(/^data:[^;]+;base64,/, "").replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(clean)) return { ok: false, error: "data_base64 is not valid base64." };
  if (clean.length > Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 8) return { ok: false, error: `The picture is too big: ${MAX_IMAGE_BYTES / 1024 / 1024} MB at most. Send a smaller or compressed picture.` };
  const bytes = new Uint8Array(Buffer.from(clean, "base64"));
  if (bytes.length === 0) return { ok: false, error: "The picture is empty." };
  if (bytes.length > MAX_IMAGE_BYTES) return { ok: false, error: `The picture is too big: ${MAX_IMAGE_BYTES / 1024 / 1024} MB at most. Send a smaller or compressed picture.` };
  const mime = imageKind(bytes);
  if (!mime) return { ok: false, error: "Only JPG, PNG, WEBP or GIF pictures are accepted (SVG is not)." };
  const name = `ai-${filename.replace(/[^\w. -]+/g, "").slice(0, 100) || "picture"}`;
  const row = await db.media.create({ data: { name, mime, size: bytes.length, data: bytes }, select: { id: true } });
  return { ok: true, url: `/media/${row.id}`, mime, size: bytes.length };
}
