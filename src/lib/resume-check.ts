// The safety checks of a resume file. Pure functions with no imports: the forms use the first one at once (before anything is uploaded) and
// the upload route (api/careers/resume) uses both, so a request that skips the page is stopped too.

export const RESUME_MAX = 5 * 1024 * 1024;
const RESUME_EXT = ["pdf", "doc", "docx"];
// a program, a script or a web page: never allowed anywhere in the name (a double extension such as "cv.exe.pdf" hides one of these)
const DANGEROUS = ["exe", "bat", "cmd", "com", "scr", "msi", "js", "jse", "vbs", "vbe", "wsf", "ps1", "sh", "jar", "php", "html", "htm", "svg", "dll", "lnk", "apk", "hta", "reg", "docm", "xlsm"];

/** the problem of a file by its NAME and size ("" = fine): only .pdf, .doc and .docx, no program name inside the name, not empty, 5 MB at most */
export function resumeNameProblem(name: string, size: number): string {
  const parts = name.trim().toLowerCase().split(".");
  if (parts.length < 2 || !RESUME_EXT.includes(parts[parts.length - 1])) return "Please upload a PDF, DOC or DOCX file.";
  if (parts.slice(1, -1).some((p) => DANGEROUS.includes(p.trim()))) return "This file name looks unsafe (a program name before .pdf). Please rename the file or choose another one.";
  if (size <= 0) return "This file is empty.";
  if (size > RESUME_MAX) return "The file is too big (5 MB at most).";
  return "";
}

/** the problem of a file by its CONTENT ("" = fine): a PDF must not carry scripts, launch actions or embedded files; a DOCX must be a Word document without macros */
export function resumeContentProblem(bytes: Uint8Array, ext: "pdf" | "doc" | "docx"): string {
  const text = new TextDecoder("latin1").decode(bytes);
  if (ext === "pdf" && /\/(JavaScript|JS|Launch|EmbeddedFile|RichMedia)\b/.test(text)) return "This PDF contains active content (scripts or attachments). Please save it again as a plain PDF.";
  if (ext === "docx" && (!text.includes("word/") || text.includes("vbaProject"))) return "This is not a normal Word document (or it contains macros). Please save it again as a plain DOCX.";
  return "";
}
