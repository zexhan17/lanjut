/**
 * Sanitizes and escapes text and URLs for self-contained HTML export.
 */

export function escapeHtml(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SAFE_PROTOCOL_PATTERN = /^(https?:|mailto:|tel:|#|\/)/i;

/**
 * Validates and escapes href attributes to prevent script execution.
 */
export function sanitizeHref(href: string | null | undefined): string {
  if (!href) return "#";
  const trimmed = href.trim();
  if (SAFE_PROTOCOL_PATTERN.test(trimmed)) {
    return escapeHtml(trimmed);
  }
  return "#";
}
