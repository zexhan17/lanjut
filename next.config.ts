import { execSync } from "node:child_process";
import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const basePath =
  process.env.BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/lanjut" : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default function config(phase: string) {
  // Regenerate the Open Graph images before every production build.
  if (phase === PHASE_PRODUCTION_BUILD) {
    execSync("pnpm generate:og", { stdio: "inherit" });
  }

  return withNextIntl(nextConfig);
}
