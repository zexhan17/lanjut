import type { TemplateId } from "@/lib/templates";
import { safeFileName, triggerDownload } from "../download-file";
import type { ResumePreview } from "../resume-preview";
import { resumeToHtml } from "./resume-to-html";

/**
 * Generates the self-contained HTML document for `preview` and triggers browser download.
 */
export async function downloadResumeHtml(
  preview: ResumePreview,
  fileName: string,
  templateId: TemplateId,
): Promise<void> {
  const html = await resumeToHtml(preview, templateId);
  const blob = new Blob([html], {
    type: "text/html;charset=utf-8",
  });
  triggerDownload(blob, `${safeFileName(fileName)}.html`);
}
