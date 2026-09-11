"use client";
import Link from "next/link";
import { Search, Phone, Car } from "lucide-react";
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
// centred heading + copy + two buttons, and three cars lined up along the bottom
// edge peeking over it. Sales-only business, so no "rent" button.
// TODO(client): drop three transparent car PNGs at /public/cta/car-left.png,
// car-center.png and car-right.png. Until then a faint placeholder shows.
const CTA_CARS = [
  {
    src: "/cta/car-left.png",
    alt: "Featured car",
    // left car — slightly smaller, sits a touch lower and behind the centre one
    wrap: "left-0 bottom-0 w-[38%] sm:w-[34%] lg:w-[32%] translate-y-[8%] z-10",
  },
  {
    src: "/cta/car-center.png",
    alt: "Featured car",
    // hero car — biggest, in front, centred
    wrap: "left-1/2 bottom-0 w-[46%] sm:w-[40%] lg:w-[36%] -translate-x-1/2 z-20",
  },
  {
    src: "/cta/car-right.png",
    alt: "Featured car",
    wrap: "right-0 bottom-0 w-[38%] sm:w-[34%] lg:w-[32%] translate-y-[8%] z-10",
  },
];

export default function FinalCTA() {
  const { lang } = useLang();
  return (
    <section className="section-padding bg-cloud">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-[1rem] bg-teal px-6 pt-20 pb-56 text-center shadow-[0_30px_70px_rgba(95,203,187,0.28)] sm:px-10 sm:pt-24 sm:pb-64 lg:pt-28 lg:pb-80">
          {/* Soft light sweep + subtle grid for depth */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(255,255,255,0.28),transparent_60%)]" />
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-[50%] bg-teal-dark/40 blur-3xl" />

          {/* Copy */}
          <div className="relative z-30 mx-auto max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {T.heading[lang]}
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-white/85">
              {T.copy[lang]}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/cars"
                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3 font-heading text-sm font-semibold text-ink transition-colors hover:bg-cloud"
              >
                {T.browse[lang]}
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal text-white">
                  <Search size={13} />
                </span>
              </Link>
              <Link
                href="#contact"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/60 px-6 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {T.contact[lang]}
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-teal">
                  <Phone size={13} />
                </span>
              </Link>
            </div>
          </div>

          {/* Cars lined up along the bottom edge */}
          <div className="absolute inset-x-0 bottom-0 mx-auto h-48 max-w-6xl sm:h-60 lg:h-72">
            {CTA_CARS.map((c, n) => (
              <div key={n} className={`absolute flex items-end justify-center ${c.wrap}`}>
                {/* faint placeholder until the PNG is supplied */}
                <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4 text-white/25">
                  <Car size={56} strokeWidth={1} />
                </div>
                <FallbackImage
                  src={c.src}
                  alt={c.alt}
                  className="relative w-full object-contain"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
