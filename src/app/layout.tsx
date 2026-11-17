import type { Viewport } from "next";
import {
  Fraunces,
  Geist,
  Geist_Mono,
  Inter,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: "normal",
});

export const viewport: Viewport = {
  themeColor: "#1c6b4f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        fraunces.variable,
        jakarta.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
