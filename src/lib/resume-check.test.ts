import { describe, expect, it } from "vitest";
import { resumeContentProblem, resumeNameProblem } from "./resume-check";

const bytes = (s: string) => new TextEncoder().encode(s);

describe("resume file name", () => {
  it("accepts pdf, doc, docx", () => {
    for (const n of ["cv.pdf", "My CV 2026.docx", "resume.DOC"]) expect(resumeNameProblem(n, 1000)).toBe("");
  });
  it("refuses other types and double extensions with a program name", () => {
    for (const n of ["cv.exe", "cv", "cv.pdf.exe", "xyz.exe.pdf", "a.js.docx", "run.bat.pdf", "page.html.pdf", "macro.docm"]) expect(resumeNameProblem(n, 1000)).not.toBe("");
  });
  it("refuses an empty or a too big file", () => {
    expect(resumeNameProblem("cv.pdf", 0)).not.toBe("");
    expect(resumeNameProblem("cv.pdf", 6 * 1024 * 1024)).not.toBe("");
  });
});

describe("resume file content", () => {
  it("a plain pdf is fine, a pdf with a script is not", () => {
    expect(resumeContentProblem(bytes("%PDF-1.7 /Type /Page"), "pdf")).toBe("");
    expect(resumeContentProblem(bytes("%PDF-1.7 /OpenAction << /S /JavaScript /JS (app.alert(1)) >>"), "pdf")).not.toBe("");
    expect(resumeContentProblem(bytes("%PDF-1.7 /Launch /EmbeddedFile"), "pdf")).not.toBe("");
  });
  it("a docx must be a word document without macros", () => {
    expect(resumeContentProblem(bytes("PK word/document.xml"), "docx")).toBe("");
    expect(resumeContentProblem(bytes("PK something/else.xml"), "docx")).not.toBe("");
    expect(resumeContentProblem(bytes("PK word/document.xml word/vbaProject.bin"), "docx")).not.toBe("");
  });
});
