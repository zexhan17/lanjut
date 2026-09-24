import { resolveFont } from "@/lib/fonts";
import { type RichBlock, tiptapToRichBlocks } from "@/lib/resume/rich-content";
import type { CoverLetter, Resume } from "@/lib/resume/types";
import type { HeaderView } from "../resume-preview";
import { resumeToPreview } from "../resume-to-preview";

export interface CoverLetterPreview {
  header: HeaderView;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  date: string;
  salutation: string;
  body: RichBlock[];
  signoff: string;
  signatureName: string;
  templateId: string;
  font: string | null;
  letterSpacing: number;
  lineHeight: number | null;
  nameScale: number;
  titleScale: number;
  bodyScale: number;
}

/**
 * Projects a Resume document and its paired Cover Letter data into a
 * `CoverLetterPreview` view-model for rendering across templates, PDF, docx, and text.
 */
export function coverLetterToPreview(resume: Resume): CoverLetterPreview {
  const preview = resumeToPreview(resume);
  const cl: Partial<CoverLetter> = resume.coverLetter ?? {};

  const bodyBlocks = cl.body?.value ? tiptapToRichBlocks(cl.body.value) : [];

  const fullName = preview.header.fullName || "Your Name";

  return {
    header: preview.header,
    recipientName: cl.recipientName ?? "",
    recipientTitle: cl.recipientTitle ?? "",
    companyName: cl.companyName ?? "",
    companyAddress: cl.companyAddress ?? "",
    date: cl.date ?? "",
    salutation: cl.salutation ?? "Dear Hiring Team,",
    body: bodyBlocks,
    signoff: cl.signoff ?? "Sincerely,",
    signatureName: cl.signatureName ?? fullName,
    templateId: resume.templateId,
    font: resolveFont(resume.font)?.id ?? null,
    letterSpacing: preview.letterSpacing,
    lineHeight: preview.lineHeight,
    nameScale: preview.nameScale,
    titleScale: preview.titleScale,
    bodyScale: preview.bodyScale,
  };
}
