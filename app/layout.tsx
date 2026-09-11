import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/components/LanguageProvider";
import { FavoritesProvider } from "@/components/FavoritesContext";
import { buildMeta, localBusinessSchema } from "@/lib/seo";

export const metadata: Metadata = buildMeta();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mk">
      <head>
        {/* Manrope — used for BOTH headings and body, and ships a Cyrillic
            subset so EN (Latin) and MK (Cyrillic) render in the same clean/thin
            face. (Dropped Clash Display + Unbounded: user preferred the thin
            look consistent across both languages.) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap&subset=cyrillic,cyrillic-ext,latin"
          rel="stylesheet"
        />
        {/* AutoDealer + LocalBusiness structured data (Macedonian, Bitola). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema()),
          }}
        />
      </head>
      <body className="flex min-h-svh flex-col font-body antialiased">
        <LanguageProvider>
          <FavoritesProvider>
            <SmoothScroll>
              <Header />
              <main className="flex-1">{children}</main>
            </SmoothScroll>
          </FavoritesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
