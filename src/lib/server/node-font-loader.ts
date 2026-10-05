import fs from "node:fs/promises";
import path from "node:path";

const serverFontCache = new Map<string, string>();

/**
 * Server/CLI font loader reading from `public/fonts/<file>`.
 * Returns base64 encoded font data.
 */
export async function nodeFontLoader(file: string): Promise<string> {
  const cached = serverFontCache.get(file);
  if (cached) return cached;

  const fontPath = path.join(process.cwd(), "public", "fonts", file);
  try {
    const buffer = await fs.readFile(fontPath);
    const base64 = buffer.toString("base64");
    serverFontCache.set(file, base64);
    return base64;
  } catch {
    return "";
  }
}
