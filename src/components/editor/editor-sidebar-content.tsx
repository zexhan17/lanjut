"use client";

import { FileText, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  type DocumentMode,
  type EditorTab,
  useEditorChromeStore,
} from "@/lib/store";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { CoverLetterForm } from "./cover-letter/cover-letter-form";
import { EditorDocumentPanel } from "./editor-document-panel";
import { EditorImportLeftovers } from "./editor-import-leftovers";
import { EditorLayoutTemplateList } from "./editor-layout/ed-layout-template-list";
import { EditorSectionList } from "./editor-sections/ed-section-list";
import { EditorSectionOrderReset } from "./editor-sections/ed-section-order-reset";
import { EditorUndoRedo } from "./editor-undo-redo";

const TABS = [
  { value: "editor", labelKey: "tabEditor" },
  { value: "layout", labelKey: "tabLayout" },
  { value: "document", labelKey: "tabDocument", id: "tour-document-tab" },
];

const PANEL_HEIGHT = "h-[calc(100vh-7rem)] xl:h-[calc(100vh-7rem)]";

export function EditorSidebarContent() {
  const t = useTranslations("editor.chrome");
  const tab = useEditorChromeStore((state) => state.activeTab);
  const setActiveTab = useEditorChromeStore((state) => state.setActiveTab);
  const documentMode = useEditorChromeStore((state) => state.documentMode);
  const setDocumentMode = useEditorChromeStore(
    (state) => state.setDocumentMode,
  );

  const onTabChange = (next: string) => setActiveTab(next as EditorTab);

  return (
    <div className="flex flex-col py-6">
      <EditorImportLeftovers />

      <Tabs value={tab} onValueChange={onTabChange}>
        <div className="flex shrink-0 items-center gap-2 px-4">
          <TabsList>
            {TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value} id={item.id}>
                {t(item.labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="ml-auto">
            <EditorUndoRedo />
          </div>
        </div>

        <TabsContent value="editor">
          <ScrollArea id="tour-editor-sections" className={PANEL_HEIGHT}>
            <div className="px-4 pt-4">
              <ToggleGroup
                variant="outline"
                spacing={0}
                className="w-full"
                value={[documentMode]}
                onValueChange={(value) => {
                  const next = value[0] as DocumentMode | undefined;
                  if (next) setDocumentMode(next);
                }}
              >
                <ToggleGroupItem value="resume" className="flex-1 text-xs">
                  <FileText className="mr-1.5 size-3.5" />
                  {t("modeResume")}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="cover-letter"
                  className="flex-1 text-xs"
                >
                  <Mail className="mr-1.5 size-3.5" />
                  {t("modeCoverLetter")}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {documentMode === "resume" ? (
              <>
                <div className="flex items-center justify-end px-4 pt-2">
                  <h3 className="text-sm font-medium sr-only">
                    {t("sectionsHeading")}
                  </h3>
                  <EditorSectionOrderReset />
                </div>
                <EditorSectionList />
              </>
            ) : (
              <CoverLetterForm />
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="layout">
          <ScrollArea id="tour-editor-layout" className={PANEL_HEIGHT}>
            <EditorLayoutTemplateList />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="document">
          <ScrollArea id="tour-editor-document" className={PANEL_HEIGHT}>
            <EditorDocumentPanel />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
