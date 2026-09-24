"use client";

import { useEffect, useRef, useState } from "react";
import type { TemplateId } from "@/lib/templates";
import { ResumeFontFaces, resumeTypographyStyle } from "../resume-fonts";
import { A4 } from "../resume-geometry";
import { ResumePage } from "../resume-page";
import { KetatCoverLetter } from "../templates/ketat/ketat-cover-letter";
import { KetikCoverLetter } from "../templates/ketik/ketik-cover-letter";
import { KlasikCoverLetter } from "../templates/klasik/klasik-cover-letter";
import { LuasaCoverLetter } from "../templates/luasa/luasa-cover-letter";
import { TebalCoverLetter } from "../templates/tebal/tebal-cover-letter";
import { AwalCoverLetter } from "./awal-cover-letter";
import type { CoverLetterPreview } from "./cover-letter-preview";

const COVER_LETTER_TEMPLATES: Record<
  TemplateId,
  React.ComponentType<CoverLetterPreview>
> = {
  awal: AwalCoverLetter,
  ketat: KetatCoverLetter,
  luasa: LuasaCoverLetter,
  tebal: TebalCoverLetter,
  klasik: KlasikCoverLetter,
  ketik: KetikCoverLetter,
};

interface CoverLetterDocumentProps {
  preview: CoverLetterPreview;
  template: TemplateId;
}

export function CoverLetterDocument(props: CoverLetterDocumentProps) {
  const TemplateComponent =
    COVER_LETTER_TEMPLATES[props.template] ?? AwalCoverLetter;
  const containerRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setAvailableWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale =
    availableWidth > 0 ? Math.min(1, (availableWidth - 32) / A4.widthPx) : 1;

  const typographyStyle = resumeTypographyStyle(props.preview, props.template);

  return (
    <div
      ref={containerRef}
      className="flex w-full justify-center overflow-x-auto py-6"
    >
      <ResumeFontFaces />
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          width: A4.widthPx,
          ...typographyStyle,
        }}
      >
        <ResumePage page={1} total={1}>
          <TemplateComponent {...props.preview} />
        </ResumePage>
      </div>
    </div>
  );
}
