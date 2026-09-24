import path from "node:path";
import { type DocumentProps, Font, renderToBuffer } from "@react-pdf/renderer";
import { Packer } from "docx";
import React from "react";
import YAML from "yaml";
import { coverLetterToPreview } from "@/components/editor/cover-letter/cover-letter-preview";
import { coverLetterToMarkdown } from "@/components/editor/cover-letter/cover-letter-to-markdown";
import { coverLetterToText } from "@/components/editor/cover-letter/cover-letter-to-text";
import { buildCoverLetterDocx } from "@/components/editor/docx/cover-letter-to-docx";
import { buildAwalDocx } from "@/components/editor/docx/resume-to-docx";
import type { ExportFormat } from "@/components/editor/export-format";
import { COVER_LETTER_PDF_DOCUMENTS } from "@/components/editor/pdf/cover-letter/template-cover-letter-pdf";
import { TEMPLATE_PDF_DOCUMENTS } from "@/components/editor/pdf/template-pdf-document";
import { resumeToMarkdown } from "@/components/editor/resume-to-markdown";
import { resumeToPreview } from "@/components/editor/resume-to-preview";
import { resumeToText } from "@/components/editor/resume-to-text";
import { FONTS } from "@/lib/fonts";
import { runMigrations } from "@/lib/resume/migrations";
import { resolveTemplateId } from "@/lib/templates";

let serverFontsRegistered = false;

export function registerServerPdfFonts(): void {
  if (serverFontsRegistered) return;
  serverFontsRegistered = true;
  const root = process.cwd();

  for (const font of FONTS) {
    Font.register({
      family: font.family,
      fonts: font.faces.map((face) => ({
        src: path.join(root, "public", "fonts", face.file),
        fontWeight: face.weight,
        fontStyle: face.style,
      })),
    });
  }

  Font.registerHyphenationCallback((word) => [word]);
}

export interface ServerExportOptions {
  format?: ExportFormat;
  template?: string;
  fileName?: string;
  type?: "resume" | "cover-letter";
}

export interface ServerExportResult {
  data: Uint8Array | string;
  contentType: string;
  fileName: string;
}

export async function exportResumeServer(
  rawResume: unknown,
  options: ServerExportOptions = {},
): Promise<ServerExportResult> {
  // 1. Validate and forward-migrate to latest Resume schema
  const resume = runMigrations(rawResume);

  const format = options.format ?? "pdf";
  const templateId = resolveTemplateId(options.template ?? resume.templateId);
  const isCoverLetter = options.type === "cover-letter";
  const defaultBase = isCoverLetter
    ? `${resume.title || "document"}-cover-letter`
    : resume.title || "resume";
  const baseName = options.fileName?.trim() || defaultBase;

  if (isCoverLetter) {
    if (format === "json") {
      return {
        data: JSON.stringify(resume.coverLetter ?? {}, null, 2),
        contentType: "application/json; charset=utf-8",
        fileName: `${baseName}.json`,
      };
    }

    if (format === "yaml") {
      return {
        data: YAML.stringify(resume.coverLetter ?? {}),
        contentType: "application/x-yaml; charset=utf-8",
        fileName: `${baseName}.yaml`,
      };
    }

    const preview = coverLetterToPreview(resume);

    if (format === "pdf") {
      registerServerPdfFonts();
      const PdfDocument =
        COVER_LETTER_PDF_DOCUMENTS[templateId] ??
        COVER_LETTER_PDF_DOCUMENTS.awal;
      const buffer = await renderToBuffer(
        React.createElement(PdfDocument, {
          preview,
        }) as React.ReactElement<DocumentProps>,
      );
      return {
        data: new Uint8Array(buffer),
        contentType: "application/pdf",
        fileName: `${baseName}.pdf`,
      };
    }

    if (format === "docx") {
      const buffer = await Packer.toBuffer(buildCoverLetterDocx(preview));
      return {
        data: new Uint8Array(buffer),
        contentType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        fileName: `${baseName}.docx`,
      };
    }

    if (format === "md") {
      return {
        data: coverLetterToMarkdown(preview),
        contentType: "text/markdown; charset=utf-8",
        fileName: `${baseName}.md`,
      };
    }

    return {
      data: coverLetterToText(preview),
      contentType: "text/plain; charset=utf-8",
      fileName: `${baseName}.txt`,
    };
  }

  // Resume export
  if (format === "json") {
    return {
      data: JSON.stringify(resume, null, 2),
      contentType: "application/json; charset=utf-8",
      fileName: `${baseName}.json`,
    };
  }

  if (format === "yaml") {
    return {
      data: YAML.stringify(resume),
      contentType: "application/x-yaml; charset=utf-8",
      fileName: `${baseName}.yaml`,
    };
  }

  const preview = resumeToPreview(resume);

  if (format === "pdf") {
    registerServerPdfFonts();
    const PdfDocument = TEMPLATE_PDF_DOCUMENTS[templateId];
    const buffer = await renderToBuffer(
      React.createElement(PdfDocument, {
        preview,
      }) as React.ReactElement<DocumentProps>,
    );
    return {
      data: new Uint8Array(buffer),
      contentType: "application/pdf",
      fileName: `${baseName}.pdf`,
    };
  }

  if (format === "docx") {
    const buffer = await Packer.toBuffer(buildAwalDocx(preview));
    return {
      data: new Uint8Array(buffer),
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      fileName: `${baseName}.docx`,
    };
  }

  if (format === "md") {
    return {
      data: resumeToMarkdown(preview),
      contentType: "text/markdown; charset=utf-8",
      fileName: `${baseName}.md`,
    };
  }

  return {
    data: resumeToText(preview),
    contentType: "text/plain; charset=utf-8",
    fileName: `${baseName}.txt`,
  };
}
