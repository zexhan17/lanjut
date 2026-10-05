import type { TemplateId } from "@/lib/templates";
import type { CoverLetterPreview } from "../cover-letter/cover-letter-preview";
import { safeFileName, triggerDownload } from "../download-file";
import { coverLetterToHtml } from "./cover-letter-to-html";

/**
 * Generates the self-contained HTML document for `preview` cover letter and triggers browser download.
 */
export async function downloadCoverLetterHtml(
  preview: CoverLetterPreview,
  fileName: string,
  templateId: TemplateId,
): Promise<void> {
  const html = await coverLetterToHtml(preview, templateId);
  const blob = new Blob([html], {
    type: "text/html;charset=utf-8",
  });
  triggerDownload(blob, `${safeFileName(fileName)}.html`);
}
