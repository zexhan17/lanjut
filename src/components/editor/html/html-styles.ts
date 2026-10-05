import { resolveFont } from "@/lib/fonts";
import { TEMPLATE_LINE_HEIGHT, type TemplateId } from "@/lib/templates";

export interface HtmlStyleOptions {
  font?: string | null;
  letterSpacing?: number;
  lineHeight?: number | null;
  nameScale?: number;
  titleScale?: number;
  bodyScale?: number;
  sectionSpacing?: number;
}

/**
 * Generates self-contained CSS styles for the HTML document.
 * Covers responsive desktop/tablet screen view, paper document card, and print view.
 */
export function getHtmlStyles(
  templateId: TemplateId,
  options: HtmlStyleOptions,
): string {
  const overrideFont = resolveFont(options.font ?? undefined);
  const primaryFontFamily = overrideFont
    ? `'${overrideFont.family}', ui-sans-serif, system-ui, sans-serif`
    : null;

  const defaultLineHeight = TEMPLATE_LINE_HEIGHT[templateId] ?? 1.4;
  const lineHeight = options.lineHeight ?? defaultLineHeight;
  const letterSpacing = options.letterSpacing
    ? `${options.letterSpacing}px`
    : "normal";
  const nameScale = options.nameScale ?? 1;
  const titleScale = options.titleScale ?? 1;
  const bodyScale = options.bodyScale ?? 1;
  const sectionSpacing = options.sectionSpacing ?? 0;
  const headingGapBefore = Math.max(0, 20 + sectionSpacing);

  return `
:root {
  --foreground: #0f172a;
  --muted: #64748b;
  --border: #cbd5e1;
  --bg-page: #ffffff;
  --bg-screen: #f1f5f9;
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: 'Lora', ui-serif, Georgia, Cambria, 'Times New Roman', serif;
  --font-mono: 'GeistMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --name-scale: ${nameScale};
  --title-scale: ${titleScale};
  --body-scale: ${bodyScale};
  --line-height: ${lineHeight};
  --letter-spacing: ${letterSpacing};
  --heading-gap-before: ${headingGapBefore}px;
}

*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-screen);
  color: var(--foreground);
  font-family: ${primaryFontFamily ?? "var(--font-sans)"};
  font-size: calc(9.5pt * var(--body-scale));
  line-height: var(--line-height);
  letter-spacing: var(--letter-spacing);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Action Bar */
.action-bar {
  max-width: 794px;
  margin: 20px auto 0 auto;
  padding: 0 16px;
  display: flex;
  justify-content: flex-end;
}

.print-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--foreground);
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 0.15s ease;
}

.print-btn:hover {
  background-color: #334155;
}

/* Document Page Card */
.resume-card {
  background-color: var(--bg-page);
  width: 100%;
  max-width: 794px;
  min-height: 1123px;
  margin: 16px auto 32px auto;
  padding: 44px 48px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

/* Headers */
.resume-header {
  margin-bottom: 16px;
}

.resume-name {
  margin: 0;
  font-weight: 700;
  line-height: 1.2;
}

.resume-headline {
  margin: 4px 0 0 0;
  color: var(--muted);
  font-weight: 400;
}

.header-photo {
  object-fit: cover;
  flex-shrink: 0;
}

.contacts-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
}

.contact-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: calc(9pt * var(--body-scale));
  color: var(--muted);
}

.contact-item a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.contact-icon {
  flex-shrink: 0;
  display: inline-block;
}

/* Section Headings */
.section-heading-wrap {
  margin-top: var(--heading-gap-before);
  margin-bottom: 8px;
  break-after: avoid;
  page-break-after: avoid;
}

.section-title {
  margin: 0;
  font-size: calc(10.5pt * var(--title-scale));
  font-weight: 600;
}

/* Entries */
.atomic-entry {
  margin-bottom: 12px;
  break-inside: avoid;
  page-break-inside: avoid;
}

.entry-header-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.entry-title {
  margin: 0;
  font-size: calc(9.5pt * var(--body-scale));
  font-weight: 600;
}

.entry-date {
  font-size: calc(9pt * var(--body-scale));
  color: var(--muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.entry-subtitle-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-top: 1px;
}

.entry-subtitle {
  margin: 0;
  font-size: calc(9pt * var(--body-scale));
  color: var(--muted);
}

.entry-body {
  margin-top: 4px;
}

/* Rich Text */
.rich-text {
  color: var(--foreground);
}

.rich-text p {
  margin: 0 0 4px 0;
}

.rich-text p:last-child {
  margin-bottom: 0;
}

.rich-text ul {
  margin: 4px 0;
  padding-left: 20px;
  list-style-type: disc;
}

.rich-text ol {
  margin: 4px 0;
  padding-left: 20px;
  list-style-type: decimal;
}

.rich-text li {
  margin-bottom: 2px;
}

.rich-text a, a.link {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Grid Lists (Skills & Languages) */
.grid-list {
  display: grid;
  grid-template-columns: repeat(var(--grid-cols, 2), 1fr);
  gap: 4px 16px;
  margin-top: 6px;
}

.grid-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  font-size: calc(9pt * var(--body-scale));
}

.grid-name {
  color: var(--foreground);
  font-weight: 600;
}

.grid-details {
  font-weight: 400;
  color: var(--muted);
}

.grid-proficiency {
  color: var(--muted);
  font-size: 0.9em;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Cover Letter specific */
.cl-metadata {
  margin-top: 16px;
  margin-bottom: 16px;
  border-top: 1px solid var(--border);
  padding-top: 14px;
}

.cl-date {
  font-weight: 500;
  margin: 0 0 10px 0;
}

.cl-recipient {
  margin: 0 0 10px 0;
  line-height: 1.35;
}

.cl-recipient p {
  margin: 0;
}

.cl-salutation {
  font-weight: 500;
  margin: 10px 0 0 0;
}

.cl-body {
  margin: 16px 0;
}

.cl-signoff {
  margin-top: 16px;
}

.cl-signature-name {
  font-weight: 600;
  margin-top: 4px;
}

/* ===================================================
   TEMPLATE SPECIFIC STYLES
   =================================================== */

${getTemplateRules(templateId, primaryFontFamily)}

/* ===================================================
   RESPONSIVE & PRINT MEDIA QUERIES
   =================================================== */

@media (max-width: 820px) {
  body {
    padding: 12px;
  }
  .action-bar {
    padding: 0;
    margin: 8px auto;
  }
  .resume-card {
    margin: 0 auto;
    padding: 24px 20px;
    box-shadow: none;
    min-height: auto;
  }
  .contacts-list {
    flex-direction: column;
    gap: 4px;
  }
  .grid-list {
    grid-template-columns: 1fr !important;
  }
}

@page {
  size: A4;
  margin: 12mm 15mm;
}

@media print {
  html, body {
    background: none !important;
    background-color: #ffffff !important;
  }
  .no-print {
    display: none !important;
  }
  .resume-card {
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
    min-height: auto !important;
  }
  .atomic-entry {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }
  .section-heading-wrap {
    break-after: avoid !important;
    page-break-after: avoid !important;
  }
}
`;
}

function getTemplateRules(
  templateId: TemplateId,
  primaryFontFamily: string | null,
): string {
  switch (templateId) {
    case "awal":
      return `
/* Awal: Clean modern sans layout */
.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.header-left-strip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.resume-name {
  font-size: calc(18pt * var(--name-scale));
}
.contacts-list {
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
}
.section-title {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px dotted var(--border);
  padding-bottom: 2px;
  font-size: calc(10pt * var(--title-scale));
}
`;

    case "ketat":
      return `
/* Ketat: Compact serif classic with centered ruled headings */
${!primaryFontFamily ? ".resume-name, .resume-headline, .section-title { font-family: var(--font-serif); }" : ""}
.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}
.header-left-strip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.resume-name {
  font-size: calc(18pt * var(--name-scale));
  text-transform: uppercase;
}
.resume-headline {
  font-size: calc(10.5pt * var(--name-scale));
}
.contacts-list {
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}
.section-heading-wrap {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 3px 0;
  text-align: center;
}
.section-title {
  font-size: calc(11pt * var(--title-scale));
  font-weight: 600;
}
.entry-date {
  font-style: italic;
}
`;

    case "luasa":
      return `
/* Luasa: Airy minimalist layout with slim accent bar */
${!primaryFontFamily ? ".resume-name, .resume-headline, .section-title { font-family: var(--font-serif); }" : ""}
.resume-header {
  border-left: 2.5px solid var(--foreground);
  padding-left: 14px;
}
.header-left-strip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.resume-name {
  font-size: calc(18pt * var(--name-scale));
  text-transform: uppercase;
}
.resume-headline {
  font-size: calc(10pt * var(--name-scale));
}
.contacts-list {
  margin-top: 8px;
  gap: 4px 12px;
}
.section-title {
  text-transform: uppercase;
  font-size: calc(9.5pt * var(--title-scale));
  font-weight: 700;
}
.entry-title {
  text-transform: uppercase;
}
.entry-body {
  border-left: 2px solid var(--border);
  padding-left: 12px;
  margin-left: 2px;
}
`;

    case "tebal":
      return `
/* Tebal: Bold modern statement with heavy uppercase headings */
.resume-name {
  font-size: calc(22pt * var(--name-scale));
  font-weight: 700;
}
.resume-headline {
  font-size: calc(11pt * var(--name-scale));
  font-weight: 600;
}
.contacts-list {
  margin-top: 8px;
  gap: 4px 14px;
}
.section-heading-wrap {
  border-top: 2.5px solid var(--foreground);
  padding-top: 4px;
}
.section-title {
  text-transform: uppercase;
  font-size: calc(10pt * var(--title-scale));
  font-weight: 700;
}
.entry-title {
  font-weight: 700;
}
.entry-subtitle {
  font-weight: 600;
}
`;

    case "klasik":
      return `
/* Klasik: Traditional centered serif CV */
${!primaryFontFamily ? "html, body, .resume-name, .resume-headline, .section-title, .rich-text { font-family: var(--font-serif); }" : ""}
.resume-header {
  text-align: center;
}
.header-left-strip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.resume-name {
  font-size: calc(20pt * var(--name-scale));
}
.resume-headline {
  font-size: calc(10.5pt * var(--name-scale));
  font-style: italic;
}
.contacts-list {
  margin-top: 8px;
  justify-content: center;
  gap: 4px 12px;
}
.section-heading-wrap {
  text-align: center;
  border-bottom: 1px solid var(--border);
  padding-bottom: 3px;
}
.section-title {
  text-transform: uppercase;
  font-size: calc(10.5pt * var(--title-scale));
}
.entry-date {
  font-style: italic;
}
`;

    case "ketik":
      return `
/* Ketik: Typewriter-flavored monospace header/headings */
${!primaryFontFamily ? ".resume-name, .resume-headline, .contacts-list, .section-title, .entry-title, .entry-date { font-family: var(--font-mono); }" : ""}
.resume-name {
  font-size: calc(16pt * var(--name-scale));
  font-weight: 700;
}
.resume-headline {
  font-size: calc(10pt * var(--name-scale));
}
.contacts-list {
  margin-top: 6px;
  gap: 4px 12px;
}
.section-heading-wrap {
  border-bottom: 1px dashed var(--border);
  padding-bottom: 3px;
}
.section-title {
  text-transform: uppercase;
  font-size: calc(9.5pt * var(--title-scale));
  font-weight: 700;
}
.entry-title {
  font-weight: 700;
}
`;
  }
}
