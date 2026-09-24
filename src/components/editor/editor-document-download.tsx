"use client";

import { useResumeDownload } from "@/hooks/use-resume-download";
import { useEditorChromeStore } from "@/lib/store";
import { PlatformResumeDownloadForm } from "../platform/platform-resume-download-form";

/** The document export form, hosted inline in the Document tab. */
export function EditorDocumentDownload() {
  const { resume, generating, download, exporter } = useResumeDownload();
  const documentMode = useEditorChromeStore((state) => state.documentMode);
  if (!resume) return null;

  const defaultFileName =
    documentMode === "cover-letter"
      ? `${resume.title || "document"}-cover-letter`
      : resume.title || "resume";

  return (
    <>
      <PlatformResumeDownloadForm
        key={`${resume.id}-${documentMode}`}
        defaultFileName={defaultFileName}
        generating={generating}
        onSubmit={(format, fileName) =>
          void download(format, fileName, documentMode)
        }
      />
      {exporter}
    </>
  );
}
