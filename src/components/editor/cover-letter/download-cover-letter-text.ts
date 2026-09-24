import { safeFileName, triggerDownload } from "../download-file";
import type { CoverLetterPreview } from "./cover-letter-preview";
import { coverLetterToText } from "./cover-letter-to-text";

/** Serializes `preview` to plain text and downloads it as `<fileName>.txt`. */
export function downloadCoverLetterText(
  preview: CoverLetterPreview,
  fileName: string,
): void {
  const blob = new Blob([coverLetterToText(preview)], {
    type: "text/plain;charset=utf-8",
  });
  triggerDownload(blob, `${safeFileName(fileName)}.txt`);
}
