import {
  BorderStyle,
  Document,
  ExternalHyperlink,
  ImageRun,
  Paragraph,
  TextRun,
} from "docx";
import type { InlineRun, RichBlock } from "@/lib/resume/rich-content";
import type { CoverLetterPreview } from "../cover-letter/cover-letter-preview";
import type { ContactView, HeaderView } from "../resume-preview";

const MUTED = "525252";

function inlineRuns(runs: InlineRun[]): (TextRun | ExternalHyperlink)[] {
  return runs.map((run) => {
    const child = new TextRun({
      text: run.text,
      bold: run.bold,
      italics: run.italic,
      underline: run.href ? {} : undefined,
    });
    return run.href
      ? new ExternalHyperlink({ link: run.href, children: [child] })
      : child;
  });
}

function richParagraphs(blocks: RichBlock[]): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  for (const block of blocks) {
    if (block.type === "paragraph") {
      paragraphs.push(
        new Paragraph({
          children: inlineRuns(block.runs),
          spacing: { after: 120 },
        }),
      );
      continue;
    }
    for (const item of block.items) {
      paragraphs.push(
        new Paragraph({
          children: inlineRuns(item),
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
      );
    }
  }
  return paragraphs;
}

function photoRun(photo: string, size: number): ImageRun | null {
  const match = photo.match(/^data:image\/(jpeg|png);base64,(.+)$/);
  if (!match) return null;
  const bytes = Uint8Array.from(atob(match[2]), (char) => char.charCodeAt(0));
  return new ImageRun({
    type: match[1] === "png" ? "png" : "jpg",
    data: bytes,
    transformation: { width: size, height: size },
  });
}

function contactRuns(contacts: ContactView[]): (TextRun | ExternalHyperlink)[] {
  const runs: (TextRun | ExternalHyperlink)[] = [];
  contacts.forEach((contact, index) => {
    if (index > 0) runs.push(new TextRun({ text: "   |   ", color: MUTED }));
    const child = new TextRun({
      text: contact.value,
      underline: contact.href ? {} : undefined,
    });
    runs.push(
      contact.href
        ? new ExternalHyperlink({ link: contact.href, children: [child] })
        : child,
    );
  });
  return runs;
}

function headerParagraphs(header: HeaderView): Paragraph[] {
  const photo = header.photo ? photoRun(header.photo, header.photoSize) : null;
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [
        ...(photo ? [photo] : []),
        new TextRun({ text: header.fullName, bold: true, size: 36 }),
      ],
    }),
  ];
  if (header.headline) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: header.headline, size: 21, color: MUTED }),
        ],
      }),
    );
  }
  if (header.contacts.length > 0) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 140 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 4,
            space: 4,
            color: "D4D4D4",
          },
        },
        children: contactRuns(header.contacts),
      }),
    );
  }
  return paragraphs;
}

/**
 * Builds the Cover Letter as a .docx `Document` in clean, linear ATS-friendly reading order.
 */
export function buildCoverLetterDocx(preview: CoverLetterPreview): Document {
  const children: Paragraph[] = [];

  // 1. Header
  children.push(...headerParagraphs(preview.header));

  // 2. Date
  if (preview.date) {
    children.push(
      new Paragraph({
        spacing: { before: 160, after: 120 },
        children: [new TextRun({ text: preview.date, bold: true })],
      }),
    );
  }

  // 3. Recipient
  if (
    preview.recipientName ||
    preview.recipientTitle ||
    preview.companyName ||
    preview.companyAddress
  ) {
    const recipientRuns: TextRun[] = [];
    if (preview.recipientName) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: preview.recipientName, bold: true })],
        }),
      );
    }
    if (preview.recipientTitle) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: preview.recipientTitle, color: MUTED }),
          ],
        }),
      );
    }
    if (preview.companyName) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: preview.companyName, color: MUTED })],
        }),
      );
    }
    if (preview.companyAddress) {
      children.push(
        new Paragraph({
          spacing: { after: 140 },
          children: [
            new TextRun({ text: preview.companyAddress, color: MUTED }),
          ],
        }),
      );
    }
  }

  // 4. Salutation
  if (preview.salutation) {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [new TextRun({ text: preview.salutation, bold: true })],
      }),
    );
  }

  // 5. Body
  children.push(...richParagraphs(preview.body));

  // 6. Sign-off & Signature
  if (preview.signoff) {
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 40 },
        children: [new TextRun({ text: preview.signoff, color: MUTED })],
      }),
    );
  }
  if (preview.signatureName) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: preview.signatureName, bold: true })],
      }),
    );
  }

  return new Document({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 21, color: "0A0A0A" } },
      },
    },
    sections: [
      {
        properties: { page: { size: { width: 11906, height: 16838 } } },
        children,
      },
    ],
  });
}
