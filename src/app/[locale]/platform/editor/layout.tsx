import { setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense } from "react";
import { EditorPanels } from "@/components/editor/editor-panels";

export default async function EditorLayoutPage(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <Suspense>
      <EditorPanels>{props.children}</EditorPanels>
    </Suspense>
  );
}
