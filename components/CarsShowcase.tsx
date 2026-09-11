"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Reveal from "./Reveal";
import FallbackImage from "./FallbackImage";
import { useLang } from "./LanguageProvider";

const T = {
  badge: { mk: "Издвоено од понудата", en: "Featured stock" },
  photoSoon: { mk: "Фотографија наскоро", en: "Photo coming soon" },
  fuel: {
    Petrol: { mk: "Бензин", en: "Petrol" },
    Diesel: { mk: "Дизел", en: "Diesel" },
    Hybrid: { mk: "Хибрид", en: "Hybrid" },
    Electric: { mk: "Електричен", en: "Electric" },
  } as Record<string, { mk: string; en: string }>,
  gearbox: {
    Manual: { mk: "Рачен", en: "Manual" },
    Automatic: { mk: "Автоматик", en: "Automatic" },
  } as Record<string, { mk: string; en: string }>,
} as const;

// Featured stock (reference photo): ONE big car, no card / no background / no
// pills. Name clear at the top, specs as plain text below, neighbouring cars
// peeking at the edges, and a ‹ 1/N › control underneath.
// TODO(client): drop transparent PNGs for the remaining cars at
// /public/showcase/car2.png … car5.png and edit specs below.
type ShowCar = {
  name: string;
  image: string;
  price: string;
  year: string;
  mileage: string;
  fuel: string;
  gearbox: string;
  // Per-car zoom to even out photos where the car fills less of the PNG canvas.
  scale?: number;
  // % of empty transparent space below the car in the PNG (measured once per
  // photo). Used to drop the car onto the shared shadow baseline. 0 = tight crop.
  botPad?: number;
};

const CARS: ShowCar[] = [
  {
    name: "Peugeot 2008",
    image: "/home%20page%20stock/ChatGPT%20Image%20Sep%2011,%202026,%2012_39_19%20AM.png",
    price: "€8,499",
    year: "2019",
    mileage: "160,000 km",
    fuel: "Petrol",
    gearbox: "Manual",
    scale: 0.8,
    botPad: 8,
  },
  {
    name: "Audi A1",
    image: "/home%20page%20stock/ChatGPT%20Image%20Sep%2011,%202026,%2012_40_54%20AM.png",
    price: "€8,499",
    year: "2015",
    mileage: "200,000 km",
    fuel: "Diesel",
    gearbox: "Manual",
    scale: 0.8,
    botPad: 8,
  },
  {
    name: "Citroën C4 Cactus",
    image: "/home%20page%20stock/ChatGPT%20Image%20Sep%2011,%202026,%2012_41_52%20AM.png",
    price: "€7,199",
    year: "2015",
    mileage: "180,000 km",
    fuel: "Petrol",
    gearbox: "Manual",
    scale: 0.8,
    botPad: 8,
  },
];

export default function CarsShowcase() {
  const [[i, dir], setState] = useState<[number, number]>([0, 0]);
  const { lang } = useLang();
  const car = CARS[i];
  const prev = CARS[(i - 1 + CARS.length) % CARS.length];
  const next = CARS[(i + 1) % CARS.length];

  const paginate = useCallback((d: number) => {
    setState(([p]) => [(p + d + CARS.length) % CARS.length, d]);
  }, []);

  const specs = [
    { icon: Tag, value: car.price },
    { icon: Gauge, value: car.mileage },
    { icon: Calendar, value: car.year },
    { icon: Fuel, value: T.fuel[car.fuel]?.[lang] ?? car.fuel },
    { icon: Settings2, value: T.gearbox[car.gearbox]?.[lang] ?? car.gearbox },
  ];

  return (
    <section className="section-padding overflow-hidden bg-cloud">
      <div className="container-wide">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-lg border border-teal/40 px-4 py-1.5 font-heading text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
            {T.badge[lang]}
          </span>
        </Reveal>

        {/* Name + specs */}
        <div className="relative mt-6 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={car.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                {car.name}
              </h2>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
                {specs.map((s, n) => (
                  <div key={n} className="flex items-center gap-5">
                    {n > 0 && (
                      <span className="hidden h-4 w-px bg-line sm:block" />
                    )}
                    <span className="flex items-center gap-2">
                      <s.icon size={18} className="text-mute" />
                      <span className="font-body text-base font-medium text-ink nums">
                        {s.value}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Car stage — coverflow: all cars slide between left / centre / right
            slots as one motion, so neighbours glide into place. */}
        <div className="relative mt-8 h-72 sm:h-96 lg:mt-4 lg:h-[38rem]">
          {/* Ground shadow at the shared baseline (grounds the cropped PNGs) */}
          <div className="pointer-events-none absolute bottom-[4%] left-1/2 z-0 h-7 w-[58%] -translate-x-1/2 rounded-[50%] bg-ink/45 blur-2xl sm:h-9" />
          <div className="pointer-events-none absolute bottom-[5%] left-1/2 z-0 h-4 w-[36%] -translate-x-1/2 rounded-[50%] bg-ink/40 blur-xl" />

          {/* Animated cars (visual only — clicks handled by the edge zones) */}
          {CARS.map((c, idx) => {
            const n = CARS.length;
            let d = idx - i;
            if (d > n / 2) d -= n;
            if (d < -n / 2) d += n;
            const slot =
              d === 0
                ? { x: "0%", scale: 1, opacity: 1, filter: "blur(0px)", zIndex: 20 }
                : d === -1
                  ? { x: "-56%", scale: 0.52, opacity: 0.38, filter: "blur(1.5px)", zIndex: 10 }
                  : d === 1
                    ? { x: "56%", scale: 0.52, opacity: 0.38, filter: "blur(1.5px)", zIndex: 10 }
                    : { x: d < 0 ? "-120%" : "120%", scale: 0.42, opacity: 0, filter: "blur(2px)", zIndex: 0 };
            return (
              <motion.div
                key={c.image}
                initial={false}
                animate={slot}
                transition={{
                  duration: 1.1,
                  ease: [0.22, 1, 0.36, 1],
                  opacity: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                }}
                className="pointer-events-none absolute inset-0 flex items-end justify-center px-4 pb-[6%]"
              >
                <FallbackImage
                  src={c.image}
                  alt={c.name}
                  className="max-h-full w-auto max-w-full object-contain"
                  style={{
                    transform: `translateY(${(c.botPad ?? 0) * (c.scale ?? 1)}%) scale(${c.scale ?? 1})`,
                    transformOrigin: "center bottom",
                  }}
                />
              </motion.div>
            );
          })}

          {/* Edge click zones — tap a peeking car to page the carousel */}
          <button
            onClick={() => paginate(-1)}
            aria-label={`Previous car: ${prev.name}`}
            className="absolute left-0 top-0 z-30 hidden h-full w-[24%] cursor-pointer md:block"
          />
          <button
            onClick={() => paginate(1)}
            aria-label={`Next car: ${next.name}`}
            className="absolute right-0 top-0 z-30 hidden h-full w-[24%] cursor-pointer md:block"
          />
        </div>

        {/* Controls */}
        <div className="-mt-2 flex items-center justify-center gap-5">
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous car"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal text-white transition-colors hover:bg-teal-dark"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-heading text-sm font-medium text-ink nums">
            {i + 1}/{CARS.length}
          </span>
          <button
            onClick={() => paginate(1)}
            aria-label="Next car"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal text-white transition-colors hover:bg-teal-dark"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
