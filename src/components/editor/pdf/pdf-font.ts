import type { Styles } from "@react-pdf/renderer";
import * as React from "react";
import { resolveFont } from "@/lib/fonts";

type PdfStyle = Styles[string];

// Dynamically reference createContext / useContext to allow server-side @react-pdf rendering
// without triggering Next.js App Router static AST RSC restrictions
const createReactContext = <T>(defaultValue: T): React.Context<T> => {
  const fn = (
    React as unknown as { createContext?: <V>(d: V) => React.Context<V> }
  )["createContext"];
  if (typeof fn === "function") {
    return fn(defaultValue);
  }
  return {
    Provider: (({ children }: { children?: React.ReactNode }) =>
      children) as unknown as React.Provider<T>,
    Consumer: (({ children }: { children: (v: T) => React.ReactNode }) =>
      children(defaultValue)) as unknown as React.Consumer<T>,
    displayName: "PdfContext",
  } as React.Context<T>;
};

const useReactContext = <T>(context: React.Context<T>): T => {
  const fn = (
    React as unknown as { useContext?: <V>(c: React.Context<V>) => V }
  )["useContext"];
  if (typeof fn === "function") {
    return fn(context);
  }
  return (context as unknown as { _currentValue: T })._currentValue;
};

/**
 * Document-level font family override for a PDF render; null means the
 * template's shipped families apply. Provided once per document so nested
 * template components don't thread the family through props.
 */
export const PdfFontContext = createReactContext<string | null>(null);

/**
 * The family a template style should render with: the document override when
 * set, otherwise `fallback` (the family the template ships for that style).
 */
export function usePdfFontFamily(fallback: string): string {
  return useReactContext(PdfFontContext) ?? fallback;
}

/** Per-group font-size multipliers a PDF template applies to its baseline sizes. */
export interface FontScales {
  name: number;
  title: number;
  body: number;
}

/** Identity scales: renders each template at its baseline sizes. */
export const NO_SCALE: FontScales = { name: 1, title: 1, body: 1 };

export interface PreviewTypographyInputs {
  font?: string | null;
  letterSpacing: number;
  lineHeight: number | null;
  nameScale: number;
  titleScale: number;
  bodyScale: number;
}

export function fontScales(preview: PreviewTypographyInputs): FontScales {
  return {
    name: preview.nameScale,
    title: preview.titleScale,
    body: preview.bodyScale,
  };
}

/**
 * Carries a template's font-size-scaled StyleSheet to its nested block
 * components, so they read scaled styles from context instead of the module
 * baseline and never thread a `styles` prop. Each template narrows the value
 * to its own sheet via `usePdfStyles`.
 */
export const PdfStylesContext = createReactContext<unknown>(null);

export function usePdfStyles<T>(fallback: T): T {
  return (useReactContext(PdfStylesContext) as T | null) ?? fallback;
}

interface PdfTypography {
  /** Override family for PdfFontContext, or null for template families. */
  family: string | null;
  /** Page-level style overrides, or null when template defaults fully apply. */
  page: PdfStyle | null;
}

/**
 * The document-level typography overrides a PDF template applies at its Page:
 * font family, tracking, and line height all inherit from the Page in
 * react-pdf, so one style array entry covers the whole document (explicit
 * per-element styles, e.g. a serif accent or a name's tight leading, still
 * win, matching the preview's behavior). An absent line height keeps the
 * template's own page baseline.
 */
export function pdfTypography(preview: PreviewTypographyInputs): PdfTypography {
  const family = resolveFont(preview.font ?? undefined)?.family ?? null;
  const page: PdfStyle = {};
  if (family) page.fontFamily = family;
  if (preview.letterSpacing !== 0) page.letterSpacing = preview.letterSpacing;
  if (preview.lineHeight != null) page.lineHeight = preview.lineHeight;
  return { family, page: Object.keys(page).length > 0 ? page : null };
}
