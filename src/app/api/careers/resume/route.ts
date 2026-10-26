import { alertFailure } from "@/lib/alerts";
import { db, hasDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { resumeContentProblem, resumeNameProblem } from "@/lib/resume-check";
import { clientIp } from "@/lib/request";

// A visitor of the Careers page uploads a resume (PDF, DOC or DOCX, 5 MB at most). It is kept in the table Media and the application gets
// its link (/media/<id>). The file is checked by its first bytes; it is only ever downloaded, never shown in the page (see media/[id]/route.ts).
const MAX = 5 * 1024 * 1024;

function kind(b: Uint8Array): { mime: string; ext: string } | null {
  if (b.length > 5 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 && b[4] === 0x2d) return { mime: "application/pdf", ext: "pdf" };
  if (b.length > 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04) return { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ext: "docx" };
  if (b.length > 8 && b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0) return { mime: "application/msword", ext: "doc" };
  return null;
}

export async function POST(req: Request) {
  if (!hasDb) return Response.json({ error: "Uploading is not available right now." }, { status: 503 });
  if (!rateLimit(`resume:${await clientIp()}`, 6, 60 * 60_000)) return Response.json({ error: "Too many uploads. Please try again later." }, { status: 429 });
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ error: "No file." }, { status: 400 });
    if (file.size > MAX) return Response.json({ error: "The file is too big (5 MB at most)." }, { status: 413 });
    // the name (only .pdf / .doc / .docx, no program name in a double extension such as xyz.exe.pdf)
    const nameBad = resumeNameProblem(file.name, file.size);
    if (nameBad) return Response.json({ error: nameBad }, { status: 415 });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const k = kind(bytes);
    if (!k) return Response.json({ error: "Please upload a PDF, DOC or DOCX file." }, { status: 415 });
    // the content: a PDF without scripts or attachments, a DOCX that is a real Word file without macros
    const contentBad = resumeContentProblem(bytes, k.ext as "pdf" | "doc" | "docx");
    if (contentBad) return Response.json({ error: contentBad }, { status: 415 });
    const base = file.name.replace(/\.[^.]+$/, "").replace(/[^\w .-]+/g, "").slice(0, 80) || "resume";
    const row = await db.media.create({ data: { name: `${base}.${k.ext}`, mime: k.mime, size: bytes.length, data: bytes }, select: { id: true } });
    return Response.json({ url: `/media/${row.id}`, name: `${base}.${k.ext}` });
  } catch (error) {
    console.error("resume upload failed", error);
    alertFailure("Uploading a resume", error, "critical");
    return Response.json({ error: "Could not upload the file. Please try again." }, { status: 500 });
  }
}
