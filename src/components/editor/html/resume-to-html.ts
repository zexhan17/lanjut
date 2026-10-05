import type { TemplateId } from "@/lib/templates";
import { buildResumeBlocks, type ResumeBlock } from "../resume-blocks";
import { locationSuffix, withLocation } from "../resume-entry-location";
import { parseGridItemName } from "../resume-grid-item";
import type {
  CertificateItemView,
  EducationItemView,
  ExperienceItemView,
  HeaderView,
  LanguageItemView,
  ResumePreview,
  SkillItemView,
} from "../resume-preview";
import { escapeHtml, sanitizeHref } from "./html-escape";
import {
  buildHtmlFontFacesCss,
  defaultBrowserFontLoader,
  type FontLoader,
} from "./html-fonts";
import { getContactSvg } from "./html-icons";
import { richBlocksToHtml } from "./html-rich-text";
import { getHtmlStyles } from "./html-styles";

function dateRange(start: string, end: string): string {
  if (!start && !end) return "";
  return `${start} - ${end}`;
}

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
              // In Ketat, icons sit at the end of the item
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

function renderExperience(
  item: ExperienceItemView,
  templateId: TemplateId,
): string {
  const range = dateRange(item.startDate, item.endDate);
  const titleText = escapeHtml(item.role);
  const titleNode = item.roleHref
    ? `<a href="${sanitizeHref(item.roleHref)}" class="link">${titleText}</a>`
    : titleText;
  const compText = escapeHtml(item.company);
  const compNode = item.companyHref
    ? `<a href="${sanitizeHref(item.companyHref)}" class="link">${compText}</a>`
    : compText;
  const locSuffix = escapeHtml(locationSuffix(item.company, item.location));

  // Ketat layout puts company on left and date on right in subtitle row
  if (templateId === "ketat") {
    return `
      <div class="atomic-entry">
        <h3 class="entry-title">${titleNode}</h3>
        <div class="entry-subtitle-row">
          <p class="entry-subtitle">${compNode}${locSuffix}</p>
          ${range ? `<span class="entry-date">${escapeHtml(range)}</span>` : ""}
        </div>
        ${richBlocksToHtml(item.description, "entry-body rich-text")}
      </div>
    `;
  }

  return `
    <div class="atomic-entry">
      <div class="entry-header-row">
        <h3 class="entry-title">${titleNode}</h3>
        ${range ? `<span class="entry-date">${escapeHtml(range)}</span>` : ""}
      </div>
      <p class="entry-subtitle">${compNode}${locSuffix}</p>
      ${richBlocksToHtml(item.description, "entry-body rich-text")}
    </div>
  `;
}

function renderEducation(
  item: EducationItemView,
  templateId: TemplateId,
): string {
  const range = dateRange(item.startDate, item.endDate);
  const degreeText = escapeHtml(item.degree);
  const instWithLoc = escapeHtml(withLocation(item.institution, item.location));

  if (templateId === "ketat") {
    return `
      <div class="atomic-entry">
        <h3 class="entry-title">${degreeText}</h3>
        <div class="entry-subtitle-row">
          <p class="entry-subtitle">${instWithLoc}</p>
          ${range ? `<span class="entry-date">${escapeHtml(range)}</span>` : ""}
        </div>
        ${richBlocksToHtml(item.details, "entry-body rich-text")}
      </div>
    `;
  }

  return `
    <div class="atomic-entry">
      <div class="entry-header-row">
        <h3 class="entry-title">${degreeText}</h3>
        ${range ? `<span class="entry-date">${escapeHtml(range)}</span>` : ""}
      </div>
      <p class="entry-subtitle">${instWithLoc}</p>
      ${richBlocksToHtml(item.details, "entry-body rich-text")}
    </div>
  `;
}

function renderCertificate(item: CertificateItemView): string {
  const range = dateRange(item.startDate, item.endDate);
  const titleText = escapeHtml(item.title);
  const titleNode = item.href
    ? `<a href="${sanitizeHref(item.href)}" class="link">${titleText}</a>`
    : titleText;
  const issuerText = escapeHtml(item.issuer);

  return `
    <div class="atomic-entry">
      <div class="entry-header-row">
        <h3 class="entry-title">${titleNode}</h3>
        ${range ? `<span class="entry-date">${escapeHtml(range)}</span>` : ""}
      </div>
      <p class="entry-subtitle">${issuerText}</p>
    </div>
  `;
}

function renderGrid(
  items: (SkillItemView | LanguageItemView)[],
  columns = 2,
): string {
  const itemsHtml = items
    .map((item) => {
      const parsed = parseGridItemName(item.name);
      const nameHtml = parsed.isCategorized
        ? `<span class="grid-name"><strong>${escapeHtml(parsed.category)}:</strong> <span class="grid-details">${escapeHtml(parsed.details)}</span></span>`
        : `<span class="grid-name">${escapeHtml(item.name)}</span>`;
      const profHtml = item.proficiency
        ? `<span class="grid-proficiency">${escapeHtml(item.proficiency)}</span>`
        : "";
      return `<div class="grid-item">${nameHtml}${profHtml}</div>`;
    })
    .join("\n");

  return `<div class="grid-list" style="--grid-cols: ${columns}">${itemsHtml}</div>`;
}

function renderBlock(block: ResumeBlock, templateId: TemplateId): string {
  switch (block.kind) {
    case "header":
      return renderHeader(block.header, templateId);
    case "heading":
      return `
        <div class="section-heading-wrap">
          <h2 class="section-title">${escapeHtml(block.title)}</h2>
        </div>
      `;
    case "summary":
      return `<div class="summary-body">${richBlocksToHtml(block.body)}</div>`;
    case "experience":
      return renderExperience(block.item, templateId);
    case "education":
      return renderEducation(block.item, templateId);
    case "certificate":
      return renderCertificate(block.item);
    case "skills":
      return renderGrid(block.items, block.columns);
    case "languages":
      return renderGrid(block.items, block.columns);
  }
}

export interface HtmlExportOptions {
  fontLoader?: FontLoader;
}

/**
 * Converts a `ResumePreview` into a completely self-contained single HTML document
 * with embedded base64 fonts, inline vector SVG icons, responsive card styling,
 * and print media rules.
 */
export async function resumeToHtml(
  preview: ResumePreview,
  templateId: TemplateId,
  options: HtmlExportOptions = {},
): Promise<string> {
  const fontLoader = options.fontLoader ?? defaultBrowserFontLoader;
  const blocks = buildResumeBlocks(preview);

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
    sectionSpacing: preview.sectionSpacing,
  });

  const bodyContent = blocks.map((b) => renderBlock(b, templateId)).join("\n");

  const pageTitle = preview.header.fullName
    ? `${preview.header.fullName} - Resume`
    : "Resume";

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
${bodyContent}
  </main>
</body>
</html>
`;
}
