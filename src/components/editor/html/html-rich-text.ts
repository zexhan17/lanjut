import type { InlineRun, RichBlock } from "@/lib/resume/rich-content";
import { escapeHtml, sanitizeHref } from "./html-escape";

function inlineRunToHtml(run: InlineRun): string {
  let text = escapeHtml(run.text);
  if (!text) return "";
  if (run.bold) text = `<strong>${text}</strong>`;
  if (run.italic) text = `<em>${text}</em>`;
  if (run.href) {
    const href = sanitizeHref(run.href);
    text = `<a href="${href}" class="link">${text}</a>`;
  }
  return text;
}

function runsToHtml(runs: InlineRun[]): string {
  return runs.map(inlineRunToHtml).join("");
}

/**
 * Serializes `RichBlock`s into standard semantic HTML elements (<p>, <ul>, <ol>, <li>).
 */
export function richBlocksToHtml(
  blocks: RichBlock[],
  className = "rich-text",
): string {
  if (blocks.length === 0) return "";

  const elements: string[] = [];

  for (const block of blocks) {
    if (block.type === "paragraph") {
      const html = runsToHtml(block.runs);
      if (html.trim()) {
        elements.push(`<p>${html}</p>`);
      }
      continue;
    }

    if (block.type === "list") {
      const tag = block.ordered ? "ol" : "ul";
      const items = block.items
        .map((runs) => {
          const itemHtml = runsToHtml(runs);
          return itemHtml.trim() ? `<li>${itemHtml}</li>` : "";
        })
        .filter(Boolean)
        .join("");

      if (items) {
        elements.push(`<${tag}>${items}</${tag}>`);
      }
    }
  }

  if (elements.length === 0) return "";
  return `<div class="${className}">${elements.join("")}</div>`;
}
