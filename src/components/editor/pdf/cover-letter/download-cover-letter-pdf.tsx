import { pdf } from "@react-pdf/renderer";
import type { TemplateId } from "@/lib/templates";
import type { CoverLetterPreview } from "../../cover-letter/cover-letter-preview";
import { safeFileName, triggerDownload } from "../../download-file";
import { registerPdfFonts } from "../pdf-fonts";
import { COVER_LETTER_PDF_DOCUMENTS } from "./template-cover-letter-pdf";

/**
 * Generates the cover letter as a PDF entirely in the browser and triggers
 * a download as `<fileName>.pdf`.
 */
export async function downloadCoverLetterPdf(
  preview: CoverLetterPreview,
  fileName: string,
  template: TemplateId,
): Promise<void> {
  registerPdfFonts();
  const PdfDocument =
    COVER_LETTER_PDF_DOCUMENTS[template] ?? COVER_LETTER_PDF_DOCUMENTS.awal;
  const blob = await pdf(<PdfDocument preview={preview} />).toBlob();
  triggerDownload(blob, `${safeFileName(fileName)}.pdf`);
}
