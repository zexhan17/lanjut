import { FONTS, resolveFont } from "@/lib/fonts";
import type { TemplateId } from "@/lib/templates";

export type FontLoader = (file: string) => Promise<string>;

const browserFontCache = new Map<string, string>();

/**
 * Loads font files in a browser environment by fetching `/fonts/<file>`.
 * Returns base64 encoded string, or empty string on failure.
 */
export async function defaultBrowserFontLoader(file: string): Promise<string> {
  const cached = browserFontCache.get(file);
  if (cached) return cached;

  if (typeof window === "undefined" || typeof fetch === "undefined") {
    return "";
  }

  try {
    const res = await fetch(`/fonts/${file}`);
    if (!res.ok) return "";
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    browserFontCache.set(file, base64);
    return base64;
  } catch {
    return "";
  }
}

/**
 * Identifies the font families required for a template and document configuration.
 */
export function getRequiredFontFamilies(
  templateId: TemplateId,
  fontId?: string | null,
): string[] {
  const override = resolveFont(fontId ?? undefined);
  if (override) {
    // If user selected a custom font, load that family plus Inter as body fallback
    return Array.from(new Set([override.family, "Inter"]));
  }

  switch (templateId) {
    case "awal":
    case "tebal":
      return ["Inter"];
    case "ketat":
    case "luasa":
      return ["Lora", "Inter"];
    case "klasik":
      return ["Lora"];
    case "ketik":
      return ["GeistMono", "Inter"];
  }
}

/**
 * Builds the embedded base64 @font-face CSS blocks for all required fonts.
 * If fontLoader returns empty strings, @font-face rules are omitted and system fallbacks apply.
 */
export async function buildHtmlFontFacesCss(
  templateId: TemplateId,
  fontId?: string | null,
  fontLoader: FontLoader = defaultBrowserFontLoader,
): Promise<string> {
  const families = getRequiredFontFamilies(templateId, fontId);
  const relevantFonts = FONTS.filter((f) => families.includes(f.family));

  const cssBlocks: string[] = [];

  for (const font of relevantFonts) {
    for (const face of font.faces) {
      try {
        const base64 = await fontLoader(face.file);
        if (base64) {
          cssBlocks.push(
            `@font-face {
  font-family: '${font.family}';
  font-weight: ${face.weight};
  font-style: ${face.style};
  src: url('data:font/ttf;charset=utf-8;base64,${base64}') format('truetype');
  font-display: swap;
}`,
          );
        }
      } catch {
        // Fall back gracefully to system fonts
      }
    }
  }

  return cssBlocks.join("\n\n");
}
