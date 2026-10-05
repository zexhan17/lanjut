import type { TemplateId } from "@/lib/templates";
import type { CoverLetterPreview } from "../cover-letter/cover-letter-preview";
import type { HeaderView } from "../resume-preview";
import { escapeHtml, sanitizeHref } from "./html-escape";
import {
  buildHtmlFontFacesCss,
  defaultBrowserFontLoader,
  type FontLoader,
} from "./html-fonts";
import { getContactSvg } from "./html-icons";
import { richBlocksToHtml } from "./html-rich-text";
import { getHtmlStyles } from "./html-styles";

function renderHeader(header: HeaderView, templateId: TemplateId): string {
  const photoHtml = header.photo
    ? `<img src="${header.photo}" alt="${escapeHtml(header.fullName)}" class="header-photo" style="width: ${header.photoSize}px; height: ${header.photoSize}px; border-radius: ${header.photoRadius}%; align-self: ${header.photoAlign === "top" ? "flex-start" : header.photoAlign === "bottom" ? "flex-end" : "center"};" />`
    : "";

  const contactsHtml =
    header.contacts.length > 0
      ? `<ul class="contacts-list">
          ${header.contacts
            .map((c) => {
              const icon = header.showIcons ? getContactSvg(c.kind) : "";
              const val = escapeHtml(c.value);
              const textNode = c.href
                ? `<a href="${sanitizeHref(c.href)}" class="link">${val}</a>`
                : `<span>${val}</span>`;
              const content =
                templateId === "ketat"
                  ? `${textNode} ${icon}`
                  : `${icon} ${textNode}`;
              return `<li class="contact-item">${content}</li>`;
            })
            .join("\n")}
        </ul>`
      : "";

  return `
    <header class="resume-header">
      <div class="header-left-strip">
        ${photoHtml}
        <div>
          <h1 class="resume-name">${escapeHtml(header.fullName)}</h1>
          ${header.headline ? `<p class="resume-headline">${escapeHtml(header.headline)}</p>` : ""}
        </div>
      </div>
      ${contactsHtml}
    </header>
  `;
}

export interface HtmlExportOptions {
  fontLoader?: FontLoader;
}

/**
 * Converts a `CoverLetterPreview` into a completely self-contained single HTML document.
 */
export async function coverLetterToHtml(
  preview: CoverLetterPreview,
  templateId: TemplateId,
  options: HtmlExportOptions = {},
): Promise<string> {
  const fontLoader = options.fontLoader ?? defaultBrowserFontLoader;

  const fontFacesCss = await buildHtmlFontFacesCss(
    templateId,
    preview.font,
    fontLoader,
  );

  const stylesCss = getHtmlStyles(templateId, {
    font: preview.font,
    letterSpacing: preview.letterSpacing,
    lineHeight: preview.lineHeight,
    nameScale: preview.nameScale,
    titleScale: preview.titleScale,
    bodyScale: preview.bodyScale,
    sectionSpacing: 0,
  });

  const headerHtml = renderHeader(preview.header, templateId);

  const hasRecipientInfo =
    preview.recipientName ||
    preview.recipientTitle ||
    preview.companyName ||
    preview.companyAddress;

  const recipientHtml = hasRecipientInfo
    ? `
      <div class="cl-recipient">
        ${preview.recipientName ? `<p><strong>${escapeHtml(preview.recipientName)}</strong></p>` : ""}
        ${preview.recipientTitle ? `<p>${escapeHtml(preview.recipientTitle)}</p>` : ""}
        ${preview.companyName ? `<p><strong>${escapeHtml(preview.companyName)}</strong></p>` : ""}
        ${preview.companyAddress ? `<p>${escapeHtml(preview.companyAddress)}</p>` : ""}
      </div>
    `
    : "";

  const metadataHtml = `
    <div class="cl-metadata">
      ${preview.date ? `<p class="cl-date">${escapeHtml(preview.date)}</p>` : ""}
      ${recipientHtml}
      ${preview.salutation ? `<p class="cl-salutation">${escapeHtml(preview.salutation)}</p>` : ""}
    </div>
  `;

  const bodyHtml = richBlocksToHtml(preview.body, "cl-body rich-text");

  const signoffHtml = `
    <div class="cl-signoff">
      ${preview.signoff ? `<p>${escapeHtml(preview.signoff)}</p>` : ""}
      ${preview.signatureName ? `<p class="cl-signature-name">${escapeHtml(preview.signatureName)}</p>` : ""}
    </div>
  `;

  const pageTitle = preview.header.fullName
    ? `${preview.header.fullName} - Cover Letter`
    : "Cover Letter";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <style>
${fontFacesCss}

${stylesCss}
  </style>
</head>
<body>
  <div class="no-print action-bar">
    <button type="button" class="print-btn" onclick="window.print()" title="Print or save this document as PDF">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      Print / Save as PDF
    </button>
  </div>
  <main class="resume-card">
    ${headerHtml}
    ${metadataHtml}
    ${bodyHtml}
    ${signoffHtml}
  </main>
</body>
</html>
`;
}
