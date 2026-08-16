import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nameZh} · ${site.nameEn}`,
    template: `%s · ${site.nameZh}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.nameZh,
  authors: [{ name: site.nameEn, url: site.github }],
  creator: site.nameEn,
  publisher: site.nameEn,
  category: "education",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: site.ogLocale,
    siteName: site.nameZh,
    title: `${site.nameZh} · ${site.nameEn}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nameZh} · ${site.nameEn}`,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <JsonLd data={websiteJsonLd()} />
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
