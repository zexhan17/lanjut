import { safeFileName, triggerDownload } from "../download-file";
import type { CoverLetterPreview } from "./cover-letter-preview";
import { coverLetterToMarkdown } from "./cover-letter-to-markdown";

/** Serializes `preview` to markdown and downloads it as `<fileName>.md`. */
export function downloadCoverLetterMarkdown(
  preview: CoverLetterPreview,
  fileName: string,
): void {
  const blob = new Blob([coverLetterToMarkdown(preview)], {
    type: "text/markdown;charset=utf-8",
  });
  triggerDownload(blob, `${safeFileName(fileName)}.md`);
}
