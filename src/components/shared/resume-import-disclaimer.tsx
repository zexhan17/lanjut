"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GITHUB_ISSUES_URL } from "@/lib/github-issue";

export function ResumeImportDisclaimer() {
  const t = useTranslations("forms.import");
  return (
    <Alert>
      <Info className="size-4 mt-px" />
      <AlertDescription className="text-xs">
        <span>
          {t("disclaimer")}{" "}
          <a
            href={GITHUB_ISSUES_URL}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {t("reportIssue")}
          </a>
        </span>
      </AlertDescription>
    </Alert>
  );
}
