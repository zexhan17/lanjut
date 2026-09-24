"use client";

import { useEffect, useRef } from "react";
import type { Resume } from "@/lib/resume";
import { downloadCoverLetter } from "./download-cover-letter";
import { downloadResume } from "./download-resume";
import type { ExportFormat } from "./export-format";

export interface ResumeExportRequest {
  resume: Resume;
  format: ExportFormat;
  fileName: string;
  type?: "resume" | "cover-letter";
}

interface ResumeExporterProps {
  request: ResumeExportRequest;
  onSettled: (ok: boolean) => void;
}

export function ResumeExporter({ request, onSettled }: ResumeExporterProps) {
  // The download hands a file to the browser and cannot be undone, so it must
  // fire once per request even though the effect re-runs (StrictMode). Guard on
  // the request identity rather than cleanup, which cannot cancel the download.
  const startedFor = useRef<ResumeExportRequest | null>(null);

  // Driving the browser download is a side effect against an external system,
  // so it lives in an effect. Loaded only through a ssr:false boundary to keep
  // the PDF/DOCX libraries out of the server bundle.
  useEffect(() => {
    if (startedFor.current === request) return;
    startedFor.current = request;
    const downloadFn =
      request.type === "cover-letter" ? downloadCoverLetter : downloadResume;
    downloadFn(request.resume, request.format, request.fileName)
      .then(() => onSettled(true))
      .catch(() => onSettled(false));
  }, [request, onSettled]);

  return null;
}
