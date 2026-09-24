import type { Resume } from "@/lib/resume";
import { resolveTemplateId } from "@/lib/templates";
import { coverLetterToPreview } from "./cover-letter/cover-letter-preview";
import type { ExportFormat } from "./export-format";

/**
 * Exports the cover letter for `resume` in the chosen format and triggers the browser download.
 */
export async function downloadCoverLetter(
  resume: Resume,
  format: ExportFormat,
  fileName: string,
): Promise<void> {
  if (format === "json") {
    const { downloadResumeJson } = await import("./download-resume-json");
    downloadResumeJson(resume, fileName);
    return;
  }

  if (format === "yaml") {
    const { downloadResumeYaml } = await import("./download-resume-yaml");
    downloadResumeYaml(resume, fileName);
    return;
  }

  const preview = coverLetterToPreview(resume);

  if (format === "pdf") {
    const { downloadCoverLetterPdf } = await import(
      "./pdf/cover-letter/download-cover-letter-pdf"
    );
    await downloadCoverLetterPdf(
      preview,
      fileName,
      resolveTemplateId(resume.templateId),
    );
    return;
  }

  if (format === "docx") {
    const { downloadCoverLetterDocx } = await import(
      "./docx/download-cover-letter-docx"
    );
    await downloadCoverLetterDocx(preview, fileName);
    return;
  }

  if (format === "md") {
    const { downloadCoverLetterMarkdown } = await import(
      "./cover-letter/download-cover-letter-markdown"
    );
    downloadCoverLetterMarkdown(preview, fileName);
    return;
  }

  const { downloadCoverLetterText } = await import(
    "./cover-letter/download-cover-letter-text"
  );
  downloadCoverLetterText(preview, fileName);
}
