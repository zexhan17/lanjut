import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { EditorResumePreview } from "@/components/editor/editor-resume-preview";
import { TourAutostartEditor } from "@/components/tour/tour-autostart-editor";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "editor.chrome" });
  return { title: t("editorTitle") };
}

export default async function EditorPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <Suspense>
      <EditorResumePreview />
      <TourAutostartEditor />
    </Suspense>
  );
}
