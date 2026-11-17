import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Providers } from "@/components/shared/providers";
import { type Locale, routing } from "@/i18n/routing";
import { SITE } from "@/lib/site";

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  id: "id_ID",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: t("title"),
      template: `%s · ${SITE.name}`,
    },
    description: t("description"),
    applicationName: SITE.name,
    keywords: [
      "resume builder",
      "ATS resume",
      "applicant tracking system",
      "CV builder",
      "free resume builder",
      "open source",
      "local-first",
    ],
    authors: [{ name: "Rizki Citra", url: "https://rimzzlabs.com" }],
    creator: "Rizki Citra",
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: SITE.name,
      title: t("title"),
      description: t("description"),
      locale: OG_LOCALE[locale],
      images: [
        { url: `/og/${locale}.png`, width: 1200, height: 630, alt: t("title") },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`/og/${locale}.png`],
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <Providers>{props.children}</Providers>
    </NextIntlClientProvider>
  );
}
