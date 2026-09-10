import { richBlocksToMarkdown } from "@/lib/resume/rich-content";
import { buildResumeBlocks } from "./resume-blocks";
import type { ContactKind, ContactView, ResumePreview } from "./resume-preview";

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

function dateRange(start: string, end: string): string {
  if (!start && !end) return "";
  return `${start} - ${end}`;
}

function metaLine(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" | ");
}

/**
 * Serializes the résumé to GitHub-flavored markdown with contact icons,
 * active hyperlinks, and clean ATS-compliant heading hierarchy.
 */
export function resumeToMarkdown(preview: ResumePreview): string {
  const lines: string[] = [];

  for (const block of buildResumeBlocks(preview)) {
    switch (block.kind) {
      case "header": {
        const { fullName, headline, contacts } = block.header;
        if (fullName) lines.push(`# ${fullName}`);
        if (headline) lines.push(`*${headline}*`);
        if (contacts.length > 0) {
          lines.push(contacts.map(formatContactMarkdown).join(" | "));
        }
        lines.push("");
        break;
      }
      case "heading":
        lines.push("", `## ${block.title}`, "");
        break;
      case "summary": {
        const body = richBlocksToMarkdown(block.body);
        if (body) lines.push(body, "");
        break;
      }
      case "experience": {
        const {
          role,
          company,
          companyHref,
          roleHref,
          location,
          startDate,
          endDate,
          description,
        } = block.item;
        const roleText = roleHref ? `[${role}](${roleHref})` : role;
        const companyText = companyHref
          ? `[${company}](${companyHref})`
          : company;
        const titleLine = [roleText, companyText].filter(Boolean).join(" — ");
        if (titleLine) lines.push(`### ${titleLine}`);
        const meta = metaLine(location, dateRange(startDate, endDate));
        if (meta) lines.push(`*${meta}*`);
        const desc = richBlocksToMarkdown(description);
        if (desc) lines.push("", desc);
        lines.push("");
        break;
      }
      case "education": {
        const { degree, institution, location, startDate, endDate, details } =
          block.item;
        const titleLine = [degree, institution].filter(Boolean).join(" — ");
        if (titleLine) lines.push(`### ${titleLine}`);
        const meta = metaLine(location, dateRange(startDate, endDate));
        if (meta) lines.push(`*${meta}*`);
        const desc = richBlocksToMarkdown(details);
        if (desc) lines.push("", desc);
        lines.push("");
        break;
      }
      case "certificate": {
        const { title, issuer, href, startDate, endDate } = block.item;
        const titleMd = href ? `[${title}](${href})` : title;
        const parts = [
          `**${titleMd}**`,
          issuer,
          dateRange(startDate, endDate),
        ].filter(Boolean);
        lines.push(`- ${parts.join(" — ")}`);
        break;
      }
      case "skills":
      case "languages": {
        for (const item of block.items) {
          if (item.proficiency) {
            lines.push(`- **${item.name}**: ${item.proficiency}`);
          } else {
            lines.push(`- **${item.name}**`);
          }
        }
        lines.push("");
        break;
      }
    }
  }

  // Collapse excess consecutive blank lines and end with a single trailing newline.
  return `${lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()}\n`;
}
