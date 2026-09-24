import { richBlocksToText } from "@/lib/resume/rich-content";
import type { CoverLetterPreview } from "./cover-letter-preview";

/**
 * Serializes the Cover Letter to plain text in linear reading order.
 */
export function coverLetterToText(preview: CoverLetterPreview): string {
  const lines: string[] = [];

  // Header
  const { fullName, headline, contacts } = preview.header;
  if (fullName) lines.push(fullName);
  if (headline) lines.push(headline);
  for (const contact of contacts) {
    lines.push(contact.value);
  }
  lines.push("");

  // Date
  if (preview.date) {
    lines.push(preview.date, "");
  }

  // Recipient
  if (
    preview.recipientName ||
    preview.recipientTitle ||
    preview.companyName ||
    preview.companyAddress
  ) {
    if (preview.recipientName) lines.push(preview.recipientName);
    if (preview.recipientTitle) lines.push(preview.recipientTitle);
    if (preview.companyName) lines.push(preview.companyName);
    if (preview.companyAddress) lines.push(preview.companyAddress);
    lines.push("");
  }

  // Salutation
  if (preview.salutation) {
    lines.push(preview.salutation, "");
  }

  // Body
  lines.push(...richBlocksToText(preview.body));
  lines.push("");

  // Sign-off
  if (preview.signoff) {
    lines.push(preview.signoff);
  }
  if (preview.signatureName) {
    lines.push(preview.signatureName);
  }
  lines.push("");

  return `${lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()}\n`;
}
