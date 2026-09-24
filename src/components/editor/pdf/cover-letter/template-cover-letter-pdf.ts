import type { ComponentType } from "react";
import type { TemplateId } from "@/lib/templates";
import type { CoverLetterPreview } from "../../cover-letter/cover-letter-preview";
import { AwalCoverLetterPdf } from "./awal-cover-letter-pdf";
import { KetatCoverLetterPdf } from "./ketat-cover-letter-pdf";
import { KetikCoverLetterPdf } from "./ketik-cover-letter-pdf";
import { KlasikCoverLetterPdf } from "./klasik-cover-letter-pdf";
import { LuasaCoverLetterPdf } from "./luasa-cover-letter-pdf";
import { TebalCoverLetterPdf } from "./tebal-cover-letter-pdf";

export type CoverLetterPdfComponent = ComponentType<{
  preview: CoverLetterPreview;
}>;

/**
 * Registry of Cover Letter PDF renderers for all 6 template families.
 */
export const COVER_LETTER_PDF_DOCUMENTS: Record<
  TemplateId,
  CoverLetterPdfComponent
> = {
  awal: AwalCoverLetterPdf,
  ketat: KetatCoverLetterPdf,
  luasa: LuasaCoverLetterPdf,
  tebal: TebalCoverLetterPdf,
  klasik: KlasikCoverLetterPdf,
  ketik: KetikCoverLetterPdf,
};
