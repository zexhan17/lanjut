import { Packer } from "docx";
import type { CoverLetterPreview } from "../cover-letter/cover-letter-preview";
import { safeFileName, triggerDownload } from "../download-file";
import { buildCoverLetterDocx } from "./cover-letter-to-docx";

/**
 * Builds the cover letter as a .docx file and triggers a browser download as
 * `<fileName>.docx`.
 */
export async function downloadCoverLetterDocx(
  preview: CoverLetterPreview,
  fileName: string,
): Promise<void> {
  const doc = buildCoverLetterDocx(preview);
  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `${safeFileName(fileName)}.docx`);
}
