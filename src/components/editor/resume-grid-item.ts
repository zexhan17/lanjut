export interface ParsedGridItemName {
  isCategorized: boolean;
  category: string;
  details: string;
}

/**
 * Splits a skill or language entry name if it carries an explicit category
 * prefix separated by a colon, e.g. "Backend & Systems: NestJS, Node.js".
 *
 * When categorized, renderers can apply visual hierarchy (bold label,
 * regular-weight muted details) while preserving identical plain-text reading order.
 */
export function parseGridItemName(name: string): ParsedGridItemName {
  const colonIndex = name.indexOf(":");
  if (
    colonIndex > 0 &&
    !name.startsWith("http://") &&
    !name.startsWith("https://")
  ) {
    return {
      isCategorized: true,
      category: name.slice(0, colonIndex).trim(),
      details: name.slice(colonIndex + 1).trim(),
    };
  }
  return {
    isCategorized: false,
    category: "",
    details: name,
  };
}
