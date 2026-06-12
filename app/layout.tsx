import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import { getLocale } from "@/lib/i18n-server";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display-src",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body-src",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "The Millionaire's Dollar — Prove you exist",
    template: "%s — The Millionaire's Dollar",
  },
  description:
    "A cultural experiment. Millionaires pay €5 to declare publicly that they exist.",
  keywords: ["social experiment", "wealth", "culture", "project"],
  authors: [{ name: "The Curators" }],
  openGraph: {
    type: "website",
    url: siteUrl(),
    siteName: "The Millionaire's Dollar",
    title: "The Millionaire's Dollar",
    description: "Millionaires declare they exist. €5 each.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@TheCurators",
    title: "The Millionaire's Dollar",
    description: "Millionaires declare they exist. €5 each.",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
