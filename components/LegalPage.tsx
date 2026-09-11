"use client";
import Footer from "./Footer";
import { useLang } from "./LanguageProvider";

const T = {
  legal: { mk: "Правно", en: "Legal" },
  lastUpdated: { mk: "Последно ажурирано", en: "Last updated" },
} as const;

// Shared shell for the legal pages (Privacy Policy, Terms of Service). Clean
// white panel matching the rest of the site — kicker, title, last-updated line,
// then prose. Body typography is handled with arbitrary child selectors so the
// page files can stay plain semantic HTML.
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  const { lang } = useLang();
  return (
    <>
      <section className="bg-bg p-2 pt-24 sm:p-2.5 sm:pt-28">
        <div className="relative overflow-hidden rounded-[0.625rem] bg-surface sm:rounded-[0.75rem]">
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.5]" />

          <div className="relative z-10 mx-auto max-w-3xl px-6 py-14 sm:px-10 sm:py-20">
            <span className="inline-flex w-fit items-center rounded-lg border border-teal/40 px-4 py-1.5 font-heading text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
              {T.legal[lang]}
            </span>

            <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 font-body text-sm text-mute">
              {T.lastUpdated[lang]} {updated}
            </p>

            <div className="mt-10 space-y-5 font-body text-base leading-relaxed text-mute [&_a]:text-teal-dark [&_a]:underline [&_h2:first-of-type]:mt-0 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_li]:marker:text-teal [&_strong]:text-ink-soft [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
              {children}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
