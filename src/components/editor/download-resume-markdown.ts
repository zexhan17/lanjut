import { safeFileName, triggerDownload } from "./download-file";
import type { ResumePreview } from "./resume-preview";
import { resumeToMarkdown } from "./resume-to-markdown";

/** Serializes `preview` to markdown and downloads it as `<fileName>.md`. */
export function downloadResumeMarkdown(
  preview: ResumePreview,
  fileName: string,
): void {
  const blob = new Blob([resumeToMarkdown(preview)], {
    type: "text/markdown;charset=utf-8",
  });
  triggerDownload(blob, `${safeFileName(fileName)}.md`);
}
