"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawPath = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;

    const base = process.env.BASE_PATH || "";
    let path = rawPath;
    if (base && path.startsWith(base)) {
      path = path.slice(base.length);
    }
    if (!path.startsWith("/")) path = `/${path}`;

    // Handle old path param: /platform/editor/[id] or /[locale]/platform/editor/[id]
    const editorIdMatch = path.match(
      /^(?:\/(en|id))?\/platform\/editor\/([a-zA-Z0-9_-]+)\/?$/,
    );
    if (editorIdMatch) {
      const loc = editorIdMatch[1] || "en";
      const id = editorIdMatch[2];
      router.replace(`/${loc}/platform/editor/?id=${id}${hash}`);
      return;
    }

    // Handle missing locale: e.g. /platform, /platform/editor, /platform/template
    const knownSegments = ["platform", "platform/editor", "platform/template"];
    const stripped = path.replace(/^\/|\/$/g, "");
    if (
      knownSegments.includes(stripped) ||
      stripped.startsWith("platform/editor")
    ) {
      const lang = (navigator.language || "").toLowerCase();
      const loc = lang.startsWith("id") ? "id" : "en";
      router.replace(`/${loc}/${stripped}/${search}${hash}`);
      return;
    }

    setRedirecting(false);
  }, [router]);

  if (redirecting) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="text-muted-foreground">This page could not be found.</p>
      <Link
        href="/platform"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
