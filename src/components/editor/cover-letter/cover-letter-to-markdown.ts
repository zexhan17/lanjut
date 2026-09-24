import { richBlocksToMarkdown } from "@/lib/resume/rich-content";
import type { ContactKind, ContactView } from "../resume-preview";
import type { CoverLetterPreview } from "./cover-letter-preview";

const CONTACT_ICONS: Record<ContactKind, string> = {
  phone: "📞",
  email: "✉️",
  website: "🌐",
  linkedin: "💼",
  github: "💻",
  link: "🔗",
  location: "📍",
};

function formatContactMarkdown(contact: ContactView): string {
  const icon = CONTACT_ICONS[contact.kind] ?? "🔗";
  if (contact.href) {
    return `${icon} [${contact.value}](${contact.href})`;
  }
  return `${icon} ${contact.value}`;
}

/**
 * Serializes the Cover Letter to GitHub-flavored markdown with contact icons,
 * active hyperlinks, and clean ATS-compliant structure.
 */
export function coverLetterToMarkdown(preview: CoverLetterPreview): string {
  const lines: string[] = [];

  // Header
  const { fullName, headline, contacts } = preview.header;
  if (fullName) lines.push(`# ${fullName}`);
  if (headline) lines.push(`*${headline}*`);
  if (contacts.length > 0) {
    lines.push(contacts.map(formatContactMarkdown).join(" | "));
  }
  lines.push("", "---", "");

  // Date
  if (preview.date) {
    lines.push(`**Date:** ${preview.date}`, "");
  }

  // Recipient
  if (
    preview.recipientName ||
    preview.recipientTitle ||
    preview.companyName ||
    preview.companyAddress
  ) {
    if (preview.recipientName) lines.push(`**${preview.recipientName}**`);
    if (preview.recipientTitle) lines.push(preview.recipientTitle);
    if (preview.companyName) lines.push(`*${preview.companyName}*`);
    if (preview.companyAddress) lines.push(preview.companyAddress);
    lines.push("");
  }

  // Salutation
  if (preview.salutation) {
    lines.push(preview.salutation, "");
  }

  // Body
  const body = richBlocksToMarkdown(preview.body);
  if (body) {
    lines.push(body, "");
  }

  // Sign-off
  if (preview.signoff) {
    lines.push(preview.signoff);
  }
  if (preview.signatureName) {
    lines.push(`**${preview.signatureName}**`);
  }
  lines.push("");

  return `${lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()}\n`;
}
