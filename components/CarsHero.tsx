"use client";
import { motion } from "framer-motion";
import { CARS, brandsInStock, PRICE_MIN } from "@/lib/cars";
import FallbackImage from "./FallbackImage";
import { useLang } from "./LanguageProvider";

const T = {
  headline1: { mk: "Разгледајте ги сите", en: "Browse Every Car" },
  headline2: { mk: "возила на едно место", en: "In One Place" },
  copy: {
    mk: "Секое возило на нашиот плац во Битола — внимателно избрано, фер оценето и подготвено за преглед. Филтрирајте по марка, каросерија, цена и повеќе за да го најдете вашето.",
    en: "Every car in our Bitola lot — hand-picked, fairly priced and ready to view. Filter by brand, body, price and more to find yours.",
  },
  carsInStock: { mk: "Возила на залиха", en: "Cars in stock" },
  brands: { mk: "Марки", en: "Brands" },
  startingFrom: { mk: "Почнува од", en: "Starting from" },
} as const;

// Inventory hero — a clean white panel with the headline up top and the
// dealership line-up photo (cars on white) anchored along the bottom so it
// blends seamlessly into the background.

// Brand logos, filled solid teal via CSS mask. Kept strictly to the far left/
// right edges (out of the centered text column) and only 3 per side so the
// backdrop reads as a subtle accent rather than clutter.
const FLOATING_LOGOS = [
  // scattered around the content column — asymmetric, not mirrored
  { slug: "audi", pos: "left-[13%] top-[9%]", size: "h-12 w-28", opacity: 0.46 },
  { slug: "hyundai", pos: "left-[4%] top-[24%]", size: "h-10 w-24", opacity: 0.36 },
  { slug: "opel", pos: "left-[6%] top-[52%]", size: "h-10 w-24", opacity: 0.38 },
  { slug: "citroen", pos: "left-[23%] top-[71%]", size: "h-11 w-28", opacity: 0.4 },
  { slug: "volkswagen", pos: "left-[34%] top-[86%]", size: "h-9 w-24", opacity: 0.32 },
  { slug: "peugeot", pos: "right-[19%] top-[15%]", size: "h-11 w-24", opacity: 0.4 },
  { slug: "kia", pos: "right-[5%] top-[27%]", size: "h-10 w-24", opacity: 0.34 },
  { slug: "renault", pos: "right-[7%] top-[48%]", size: "h-12 w-24", opacity: 0.48 },
  { slug: "seat", pos: "right-[4%] top-[73%]", size: "h-10 w-28", opacity: 0.36 },
  { slug: "nissan", pos: "right-[31%] top-[85%]", size: "h-10 w-24", opacity: 0.33 },
  { slug: "mazda", pos: "left-[19%] top-[37%]", size: "h-10 w-24", opacity: 0.35 },
  { slug: "dacia", pos: "right-[22%] top-[58%]", size: "h-10 w-24", opacity: 0.37 },
  { slug: "chevrolet", pos: "left-[4%] top-[73%]", size: "h-10 w-24", opacity: 0.32 },
];

export default function CarsHero() {
  const { lang } = useLang();
  return (
    <section className="bg-cloud p-2 pt-24 sm:p-2.5 sm:pt-28">
      <div className="relative w-full overflow-hidden rounded-[0.625rem] bg-surface sm:rounded-[0.75rem]">

        {/* Floating brand logos, filled solid teal via CSS mask (desktop only —
            phones are too narrow to fit them beside the text) */}
        <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
          {FLOATING_LOGOS.map((l) => (
            <span
              key={l.slug + l.pos}
              className={`absolute ${l.pos} ${l.size} block bg-teal`}
              style={{
                opacity: l.opacity,
                WebkitMaskImage: `url(/brands/${l.slug}.png)`,
                maskImage: `url(/brands/${l.slug}.png)`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          ))}
        </div>

        {/* Content — text block on top, line-up photo anchored at the bottom */}
        <div className="relative z-10 flex flex-col items-center justify-start px-5 pb-0 pt-[5vh] text-center sm:pt-[6vh]">
          <div className="flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06, ease: "easeOut" }}
              className="max-w-4xl font-heading text-[2.6rem] font-semibold leading-[1.03] tracking-tight text-ink sm:text-6xl lg:text-[4rem]"
            >
              {T.headline1[lang]}
              <br />
              <span className="!text-teal-dark">{T.headline2[lang]}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
              className="mt-4 max-w-xl font-body text-base leading-relaxed text-mute sm:text-lg"
            >
              {T.copy[lang]}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18, ease: "easeOut" }}
              className="mt-8 flex items-start justify-center gap-6 sm:gap-10"
            >
              <div className="text-center">
                <p className="font-heading text-4xl font-semibold text-ink nums sm:text-5xl">
                  {CARS.length}
                </p>
                <p className="mt-1.5 font-body text-[13px] uppercase tracking-[0.16em] text-mute">
                  {T.carsInStock[lang]}
                </p>
              </div>
              <span className="h-12 w-px bg-line" />
              <div className="text-center">
                <p className="font-heading text-4xl font-semibold text-ink nums sm:text-5xl">
                  {brandsInStock().length}
                </p>
                <p className="mt-1.5 font-body text-[13px] uppercase tracking-[0.16em] text-mute">
                  {T.brands[lang]}
                </p>
              </div>
              <span className="h-12 w-px bg-line" />
              <div className="text-center">
                <p className="font-heading text-4xl font-semibold text-ink nums sm:text-5xl">
                  €{(PRICE_MIN / 1000).toFixed(1)}k
                </p>
                <p className="mt-1.5 font-body text-[13px] uppercase tracking-[0.16em] text-mute">
                  {T.startingFrom[lang]}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Line-up photo — cars on white, blends into the panel */}
          <FallbackImage
            src="/cars-hero.png"
            alt="Avto Plac Dado inventory line-up"
            className="pointer-events-none -mx-5 mb-0 mt-1 max-h-[44svh] w-[calc(100%+2.5rem)] max-w-none object-contain object-top sm:mt-1.5 sm:max-h-[52svh]"
          />
        </div>
      </div>
    </section>
  );
}
