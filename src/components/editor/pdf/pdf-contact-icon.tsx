import { Circle, Path, Rect, Svg } from "@react-pdf/renderer";
import type { ContactKind } from "../resume-preview";
import { PDF_COLORS } from "./pdf-fonts";

const ICON = {
  stroke: PDF_COLORS.muted,
  strokeWidth: 2,
  fill: "none",
} as const;

/** lucide-equivalent contact glyphs, drawn as vector SVG (not text). */
export function PdfContactIcon(props: { kind: ContactKind }) {
  switch (props.kind) {
    case "phone":
      return (
        <Svg width={8} height={8} viewBox="0 0 24 24">
          <Path
            {...ICON}
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
          />
        </Svg>
      );
    case "email":
      return (
        <Svg width={8} height={8} viewBox="0 0 24 24">
          <Rect {...ICON} x={2} y={4} width={20} height={16} rx={2} />
          <Path {...ICON} d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </Svg>
      );
    case "website":
      return (
        <Svg width={8} height={8} viewBox="0 0 24 24">
          <Circle {...ICON} cx={12} cy={12} r={10} />
          <Path {...ICON} d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <Path {...ICON} d="M2 12h20" />
        </Svg>
      );
    case "linkedin":
      return (
        <Svg width={8} height={8} viewBox="0 0 24 24">
          <Path
            {...ICON}
            d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
          />
          <Rect {...ICON} x={2} y={9} width={4} height={12} />
          <Circle {...ICON} cx={4} cy={4} r={2} />
        </Svg>
      );
    case "github":
      return (
        <Svg width={8} height={8} viewBox="0 0 24 24">
          <Path
            {...ICON}
            d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
          />
          <Path {...ICON} d="M9 18c-4.51 2-5-2-7-2" />
        </Svg>
      );
    case "link":
      return (
        <Svg width={8} height={8} viewBox="0 0 24 24">
          <Path {...ICON} d="M15 3h6v6" />
          <Path {...ICON} d="M10 14 21 3" />
          <Path
            {...ICON}
            d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
          />
        </Svg>
      );
    case "location":
      return (
        <Svg width={8} height={8} viewBox="0 0 24 24">
          <Path
            {...ICON}
            d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
          />
          <Circle {...ICON} cx={12} cy={10} r={3} />
        </Svg>
      );
  }
}
