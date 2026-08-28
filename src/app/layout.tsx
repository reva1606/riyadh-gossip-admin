import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";

import { Providers } from "@/components/shared/providers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_DIR, isLocale } from "@/lib/i18n/config";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: {
    default: "MBFshow Admin",
    template: "%s · MBFshow Admin",
  },
  description: "Admin panel for the MBFshow entertainment platform.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  return (
    <html
      lang={locale}
      dir={LOCALE_DIR[locale]}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
