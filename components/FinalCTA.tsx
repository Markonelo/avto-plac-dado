"use client";
import Link from "next/link";
import { Search, Phone } from "lucide-react";
import Reveal from "./Reveal";
import FallbackImage from "./FallbackImage";
import { useLang } from "./LanguageProvider";

const T = {
  heading: {
    mk: "Спремни за возење со доверба?",
    en: "Ready to Drive with Confidence?",
  },
  copy: {
    mk: "Најдете го совршениот автомобил со јасна цена и комплетни податоци. Секој чекор од купувањето го правиме едноставен, чесен и транспарентен.",
    en: "Find your perfect car with upfront pricing and complete details. We make every step of buying simple, honest and transparent.",
  },
  browse: { mk: "Разгледај возила", en: "Browse Cars" },
  contact: { mk: "Контактирај нѐ", en: "Contact Us" },
} as const;

// Full-width closing CTA before the footer (reference photo): one big teal card,
// centred heading + copy + two buttons, and a line-up of cars peeking over the
// bottom edge. Sales-only business, so no "rent" button.
export default function FinalCTA() {
  const { lang } = useLang();
  return (
    <section className="section-padding bg-cloud">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-[1rem] bg-teal px-6 pt-12 pb-40 text-center shadow-[0_30px_70px_rgba(95,203,187,0.28)] sm:px-10 sm:pt-16 sm:pb-56 lg:pt-20 lg:pb-80">
          {/* Soft light sweep + subtle grid for depth */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(255,255,255,0.28),transparent_60%)]" />
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-[50%] bg-teal-dark/40 blur-3xl" />

          {/* Copy */}
          <div className="relative z-30 mx-auto max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {T.heading[lang]}
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-white/85 sm:text-lg">
              {T.copy[lang]}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/cars"
                className="group relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-[0.625rem] border border-transparent bg-white px-6 py-3 font-heading text-sm font-semibold text-ink transition-colors duration-500 ease-out hover:border-white hover:text-white hover:duration-1000"
              >
                {/* teal circle flood from the icon */}
                <span className="absolute right-6 top-1/2 -z-10 h-6 w-6 -translate-y-1/2 rounded-full bg-teal transition-transform duration-[750ms] ease-out group-hover:scale-[22] group-hover:duration-[1700ms] group-hover:ease-[cubic-bezier(0.22,1,0.36,1)]" />
                {T.browse[lang]}
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal text-white transition-colors duration-500 ease-out group-hover:bg-white group-hover:text-teal group-hover:duration-1000">
                  <Search size={13} />
                </span>
              </Link>
              <Link
                href="#contact"
                className="group relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-[0.625rem] border border-white/60 px-6 py-3 font-heading text-sm font-semibold text-white transition-colors duration-500 ease-out hover:border-white hover:text-teal-dark hover:duration-1000"
              >
                {/* white circle flood from the icon */}
                <span className="absolute right-6 top-1/2 -z-10 h-6 w-6 -translate-y-1/2 rounded-full bg-white transition-transform duration-[750ms] ease-out group-hover:scale-[22] group-hover:duration-[1700ms] group-hover:ease-[cubic-bezier(0.22,1,0.36,1)]" />
                {T.contact[lang]}
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-teal transition-colors duration-500 ease-out group-hover:bg-teal group-hover:text-white group-hover:duration-1000">
                  <Phone size={13} />
                </span>
              </Link>
            </div>
          </div>

          {/* Car line-up peeking over the bottom edge */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center lg:translate-y-8">
            <FallbackImage
              src="/cta-card.png"
              alt="Cars available at Avto Plac Dado"
              className="w-full max-w-xl object-contain object-bottom sm:max-w-3xl lg:max-w-4xl"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
