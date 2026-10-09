import { getAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

// Upload of a picture from the admin panel. Only a logged-in admin may use it. The browser sends the picture already resized to a light .webp
// (see components/admin/upload.ts); here the file is checked again (really a picture, not too big) and kept in the table Media.
const MAX = 6 * 1024 * 1024;

function kind(b: Uint8Array): string | null {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  if (b.length > 6 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return "image/gif";
  return null;
}

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return Response.json({ error: "Please log in again." }, { status: 401 });
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ error: "No file." }, { status: 400 });
    if (file.size > MAX) return Response.json({ error: "The picture is too big (6 MB at most)." }, { status: 413 });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const mime = kind(bytes);
    if (!mime) return Response.json({ error: "Please choose a JPG, PNG, WEBP or GIF picture." }, { status: 415 });
    const row = await db.media.create({ data: { name: file.name.slice(0, 120), mime, size: bytes.length, data: bytes }, select: { id: true } });
    return Response.json({ url: `/media/${row.id}` });
  } catch (error) {
    console.error("upload failed", error);
    return Response.json({ error: "Could not upload the picture. Please try again." }, { status: 500 });
  }
}
