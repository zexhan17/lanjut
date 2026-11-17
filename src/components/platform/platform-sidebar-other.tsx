"use client";

import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useNextStep } from "nextstepjs";
import { MEDIA_XL, useMediaQuery } from "@/hooks/use-media-query";
import { usePathname } from "@/i18n/navigation";
import { useResumeStore } from "@/lib/store";
import { EDITOR_SHEET_TOUR, EDITOR_TOUR, tourForPathname } from "@/lib/tour";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

export function PlatformSidebarOther() {
  const pathname = usePathname();
  const openStatus = useResumeStore((state) => state.openStatus);
  const isDesktop = useMediaQuery(MEDIA_XL);
  const { startNextStep } = useNextStep();
  const t = useTranslations("platform.sidebar");

  const baseTour = tourForPathname(pathname);
  const tour =
    baseTour === EDITOR_TOUR && !isDesktop ? EDITOR_SHEET_TOUR : baseTour;
  const guideDisabled = baseTour === EDITOR_TOUR && openStatus !== "ready";

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("other")}</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            id="tour-guide"
            disabled={guideDisabled}
            onClick={() => startNextStep(tour)}
          >
            <HelpCircle /> {t("guide")}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
