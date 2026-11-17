import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { PlatformNavbar } from "@/components/platform/platform-navbar";
import { PlatformSidebar } from "@/components/platform/platform-sidebar";
import { PlatformSidebarProvider } from "@/components/platform/platform-sidebar-provider";
import { TourProvider } from "@/components/tour/tour-provider";
import { Sidebar, SidebarInset } from "@/components/ui/sidebar";

// The platform is the local-first working area: its pages render each visitor's
// own IndexedDB data, so there is nothing meaningful for crawlers to index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PlatformLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <TourProvider>
      <PlatformSidebarProvider>
        <Sidebar>
          <PlatformSidebar />
        </Sidebar>

        {/* min-w-0 lets this flex-1 region shrink instead of being forced wide
            by its content (e.g. a long custom-section title), which otherwise
            pushes the layout past the viewport. */}
        <SidebarInset className="min-w-0">
          <PlatformNavbar />
          {props.children}
        </SidebarInset>
      </PlatformSidebarProvider>
    </TourProvider>
  );
}
