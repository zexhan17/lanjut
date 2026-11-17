"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const lang = (navigator.language || "").toLowerCase();
    const targetLocale = lang.startsWith("id") ? "id" : "en";
    router.replace(`/${targetLocale}/`);
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
