"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/lib/site";
import FallbackImage from "./FallbackImage";
import { useLang } from "./LanguageProvider";

const T = {
  headline1: { mk: "Најдете го вашиот автомобил", en: "Find Your Car In" },
  headline2: { mk: "во Авто Плац Дадо", en: "Avto Plac Dado" },
  tagline: {
    mk: "Врвни автомобили, чесни цени и внимателно избрана понуда — тука во Битола.",
    en: `Premium cars, honest pricing and a hand-picked selection — right here in ${SITE.city}.`,
  },
} as const;

// Full-bleed AEVUM-style hero: each slide is a complete scene photo (car baked
// into the background). Text, spec card and dots float over it.
// TODO(client): drop more scene photos at /public/hero-home-2.png … and add
// entries below to grow the carousel.
type HeroSlide = {
  name: string;
  image: string;
  imageMobile?: string;
};

const SLIDES: HeroSlide[] = [
  {
    name: "Citroën C4 Cactus",
    image: "/hero-home-1.png",
    imageMobile: "/hero-home-mobile.png",
  },
];

export default function Hero() {
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const { lang } = useLang();

  const goto = useCallback(
    (n: number) => setI(((n % SLIDES.length) + SLIDES.length) % SLIDES.length),
    []
  );

  // Auto-advance every 6s (only matters once there's more than one slide).
  useEffect(() => {
    if (SLIDES.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [i]);

  return (
    <section className="bg-cloud">
      <div className="relative min-h-[44rem] w-full overflow-hidden sm:h-[100svh] sm:min-h-[42rem]">
        {/* ── Full-bleed scene photo ─────────────────────────────────── */}
        <AnimatePresence>
          <motion.div
            key={slide.image}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {/* Desktop / tablet scene */}
            <FallbackImage
              src={slide.image}
              alt={slide.name}
              className={`absolute inset-0 h-full w-full object-cover object-center ${
                slide.imageMobile ? "hidden sm:block" : ""
              }`}
            />
            {/* Mobile-only scene */}
            {slide.imageMobile && (
              <FallbackImage
                src={slide.imageMobile}
                alt={slide.name}
                className="absolute inset-0 h-full w-full object-cover object-center sm:hidden"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Legibility scrims — darken the sky (top) and left edge so the
            white text reads, without hiding the car. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/25 to-transparent" />

        {/* ── Content overlay ────────────────────────────────────────── */}
        {/* Heading — centred, near the top, over the sky */}
        <div className="absolute inset-x-0 top-24 z-20 px-5 text-center sm:top-28 sm:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            className={`mx-auto font-heading font-semibold leading-[1.04] tracking-tight !text-white/85 drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] ${
              lang === "mk"
                ? "max-w-5xl text-[2.35rem] sm:text-[3.4rem] lg:text-[4.3rem]"
                : "max-w-5xl text-[2.75rem] sm:text-6xl lg:text-[5rem]"
            }`}
          >
            {T.headline1[lang]}
            <br />
            {T.headline2[lang]}
          </motion.h1>
        </div>

        {/* Tagline — right, vertically centred (where the spec card was) */}
        <div className="absolute right-5 top-1/2 z-20 hidden max-w-[20rem] -translate-y-1/2 sm:right-8 lg:block">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14, ease: "easeOut" }}
            className="text-right font-body text-lg font-light leading-relaxed text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]"
          >
            {T.tagline[lang]}
          </motion.p>
        </div>

        {/* Mobile tagline (under the heading) */}
        <div className="absolute inset-x-0 bottom-16 z-20 flex flex-col items-center px-6 lg:hidden">
          <p className="max-w-xs text-center font-body text-sm font-light leading-relaxed text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]">
            {T.tagline[lang]}
          </p>
        </div>

        {/* ── Carousel dots (bottom-centre) ──────────────────────────── */}
        {SLIDES.length > 1 && (
          <div className="absolute inset-x-0 bottom-7 z-20 flex justify-center">
            <div className="flex items-center gap-1.5">
              {SLIDES.map((s, n) => (
                <button
                  key={s.name}
                  onClick={() => goto(n)}
                  aria-label={`Show ${s.name}`}
                  className={`h-1.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-all duration-300 ${
                    n === i ? "w-7 bg-teal" : "w-4 bg-white/70 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
