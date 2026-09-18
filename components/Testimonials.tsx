"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";
import FallbackImage from "./FallbackImage";
import { useLang } from "./LanguageProvider";

// Full-screen single testimonial (reference photo): giant teal quote marks in the
// corners, one large centered quote, circular avatar + name + role, dots, and a
// slanted repeating "testimonial" wordmark banner across the bottom.
// TODO(client): swap the fake reviews + avatars below for real Google reviews.
type Review = {
  text: { mk: string; en: string };
  name: string;
  role: { mk: string; en: string };
  avatar: string;
};

const T = {
  badge: { mk: "Што велат купувачите", en: "What buyers say" },
} as const;

const REVIEWS: Review[] = [
  {
    text: {
      mk: "Го најдов токму автомобилот што го барав, по фер цена. Екипата беше искрена за историјата на возилото, а документацијата беше подготвена истиот ден. Не можам да замислам полесно искуство.",
      en: "Found exactly the car I was looking for at a fair price. The team was honest about the car's history and the paperwork was ready the same day. Couldn't ask for a smoother experience.",
    },
    name: "Marko Stefanovski",
    role: { mk: "Купи BMW Серија 3", en: "Bought a BMW 3 Series" },
    avatar: "https://i.pravatar.cc/160?img=12",
  },
  {
    text: {
      mk: "Без притисок и без изигрување. Ми го објаснија секој детал од автомобилот и трпеливо одговорија на сите мои прашања. Вака треба да изгледа купувањето автомобил.",
      en: "No pressure and no games. They walked me through every detail of the car and answered all of my questions patiently. This is exactly how buying a car should feel.",
    },
    name: "Elena Trajkovska",
    role: { mk: "Купи VW Golf", en: "Bought a VW Golf" },
    avatar: "https://i.pravatar.cc/160?img=45",
  },
  {
    text: {
      mk: "Одличен избор и навистина услужливи луѓе. Дојдов од Скопје и вредеше за патот. Сѐ беше чисто, проверено и точно како што беше опишано. Топло препорачувам.",
      en: "Great selection and genuinely helpful people. I drove down from Skopje and it was well worth the trip. Everything was clean, verified and exactly as described. Highly recommend.",
    },
    name: "Dragan Petrov",
    role: { mk: "Купи Audi A4", en: "Bought an Audi A4" },
    avatar: "https://i.pravatar.cc/160?img=33",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export default function Testimonials() {
  const [i, setI] = useState(0);
  const { lang } = useLang();
  const r = REVIEWS[i];

  const goto = useCallback(
    (n: number) => setI((n + REVIEWS.length) % REVIEWS.length),
    []
  );

  // Auto-advance after 8s. Any manual switch changes `i`, which resets this timer.
  useEffect(() => {
    const t = setTimeout(() => setI((v) => (v + 1) % REVIEWS.length), 8000);
    return () => clearTimeout(t);
  }, [i]);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-bg">
      {/* Main testimonial area */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-24 sm:px-10">
        {/* Opening quote — top left */}
        <Quote
          aria-hidden
          className="pointer-events-none absolute left-3 top-6 h-16 w-16 rotate-180 fill-teal text-teal sm:left-10 sm:top-24 sm:h-40 sm:w-40 lg:h-52 lg:w-52"
          strokeWidth={0}
        />
        {/* Prev / next arrows — top right (desktop only; on mobile they sit by the dots) */}
        <div className="absolute right-14 top-24 z-10 hidden gap-3 sm:flex">
          <button
            onClick={() => goto(i - 1)}
            aria-label="Previous review"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white transition-colors hover:bg-teal-dark"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => goto(i + 1)}
            aria-label="Next review"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white transition-colors hover:bg-teal-dark"
          >
            <ArrowRight size={20} />
          </button>
        </div>
        {/* Closing quote — bottom right */}
        <Quote
          aria-hidden
          className="pointer-events-none absolute bottom-20 right-3 h-16 w-16 fill-teal text-teal sm:bottom-28 sm:right-10 sm:h-40 sm:w-40 lg:h-52 lg:w-52"
          strokeWidth={0}
        />

        <div className="relative mx-auto w-full max-w-4xl text-center">
          <span className="mb-8 inline-flex items-center gap-2 rounded-lg border border-teal/40 px-4 py-1.5 font-heading text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
            {T.badge[lang]}
          </span>

          <div className="relative min-h-[19rem] sm:min-h-[17rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <p className="font-heading text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl lg:text-[2.5rem] lg:leading-[1.3]">
                  {r.text[lang]}
                </p>

                <div className="mt-10 flex flex-col items-center gap-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full bg-teal-soft ring-2 ring-teal/40">
                    <span className="absolute inset-0 flex items-center justify-center font-heading text-lg font-semibold text-teal-dark">
                      {initials(r.name)}
                    </span>
                    <FallbackImage
                      src={r.avatar}
                      alt={r.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-heading text-lg font-semibold text-ink">
                      {r.name}
                    </p>
                    <p className="mt-0.5 font-body text-sm text-mute">{r.role[lang]}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls — arrows (mobile) + dots */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => goto(i - 1)}
              aria-label="Previous review"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-white transition-colors hover:bg-teal-dark sm:hidden"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex justify-center gap-1.5">
              {REVIEWS.map((rev, n) => (
                <button
                  key={rev.name}
                  onClick={() => goto(n)}
                  aria-label={`Show review ${n + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    n === i ? "w-7 bg-teal" : "w-4 bg-ink/20 hover:bg-ink/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => goto(i + 1)}
              aria-label="Next review"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-white transition-colors hover:bg-teal-dark sm:hidden"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Slanted repeating wordmark banner */}
      <div className="relative -mt-8 select-none overflow-hidden py-10 sm:-mt-12 sm:py-14">
        <div className="-rotate-2">
          <div className="marquee-track flex whitespace-nowrap">
            {Array.from({ length: 2 }).map((_, dup) => (
              <div key={dup} className="flex shrink-0 items-center">
                {Array.from({ length: 8 }).map((_, n) => (
                  <span
                    key={n}
                    className="mx-6 font-heading text-5xl font-semibold uppercase tracking-tight sm:text-7xl"
                    style={
                      n % 2 === 0
                        ? { color: "var(--color-teal)" }
                        : {
                            color: "transparent",
                            WebkitTextStroke: "0.75px var(--color-teal)",
                            paintOrder: "stroke",
                          }
                    }
                  >
                    testimonial
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
