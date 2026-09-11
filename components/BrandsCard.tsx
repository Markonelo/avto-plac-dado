"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Reveal from "./Reveal";
import FallbackImage from "./FallbackImage";
import { useLang } from "./LanguageProvider";

const T = {
  kicker: { mk: "најдете ја вашата марка", en: "Find your fit" },
  heading: {
    mk: ["Најдете ја марката", "што ја барате"],
    en: ["Find the brand you're", "looking for"],
  },
  copy: {
    mk: "Изберете марка подолу за да ја филтрирате целата понуда. Секој резултат вклучува јасна цена и комплетни податоци за возилото.",
    en: "Select a make below to filter our full inventory. Every result includes upfront pricing and complete vehicle details.",
  },
  cars: { mk: "возила", en: "cars" },
} as const;

// "Find the brand you're looking for" — brand picker card (reference photo).
// One big light card: pill kicker + heading + copy, then a grid of brand tiles,
// each with a logo, name and stock count. Selecting one highlights it (cream
// tile) and jumps to that make in /cars. Filter is by make only.
// TODO(client): logos live at /public/brands/<slug>.png. `scale` optically
// normalises each mark, since the source PNGs have very different internal
// padding (measured once from each logo's opaque bounding box).
type Brand = { name: string; slug: string; count: number; scale?: number };

const BRANDS: Brand[] = [
  { name: "Peugeot", slug: "peugeot", count: 4, scale: 1.39 },
  { name: "Hyundai", slug: "hyundai", count: 4, scale: 1.12 },
  { name: "Renault", slug: "renault", count: 4, scale: 1.17 },
  { name: "Audi", slug: "audi", count: 3, scale: 1 },
  { name: "Citroën", slug: "citroen", count: 2, scale: 0.98 },
  { name: "Fiat", slug: "fiat", count: 2, scale: 1.6 },
  { name: "Opel", slug: "opel", count: 2, scale: 1.6 },
  { name: "Seat", slug: "seat", count: 2, scale: 1 },
  { name: "Nissan", slug: "nissan", count: 2, scale: 1.14 },
  { name: "Volkswagen", slug: "volkswagen", count: 2, scale: 1.15 },
  { name: "Mazda", slug: "mazda", count: 1, scale: 1 },
  { name: "Dacia", slug: "dacia", count: 1, scale: 1.53 },
  { name: "BMW", slug: "bmw", count: 1, scale: 0.98 },
  { name: "Lancia", slug: "lancia", count: 1, scale: 1.6 },
  { name: "Chevrolet", slug: "chevrolet", count: 1, scale: 1.05 },
  { name: "Kia", slug: "kia", count: 1, scale: 1.31 },
  { name: "Ford", slug: "ford", count: 1, scale: 1.01 },
];

export default function BrandsCard() {
  const router = useRouter();
  const { lang } = useLang();
  const [active, setActive] = useState(0); // first brand highlighted by default

  const pick = (b: Brand, n: number) => {
    setActive(n);
    router.push(`/cars?make=${encodeURIComponent(b.name)}`);
  };

  return (
    <section className="section-padding bg-cloud">
      <div className="container-wide">
        <Reveal className="overflow-hidden rounded-[0.75rem] border border-line bg-surface-2 p-6 shadow-[0_24px_60px_rgba(17,19,24,0.06)] sm:p-10 lg:p-14">
          {/* Header */}
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-lg border border-teal/40 px-4 py-1.5 font-heading text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
              {T.kicker[lang]}
            </span>
            <h2 className="mt-6 font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {T.heading[lang][0]}
              <br className="hidden sm:block" /> {T.heading[lang][1]}
            </h2>
            <p className="mt-5 max-w-lg font-body text-base leading-relaxed text-mute">
              {T.copy[lang]}
            </p>
          </div>

          {/* Brand grid */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {BRANDS.map((b, n) => {
              const on = n === active;
              return (
                <button
                  key={b.slug}
                  onClick={() => pick(b, n)}
                  aria-label={`${b.name} — ${b.count} ${T.cars[lang]}`}
                  className={`group flex flex-col items-center justify-center gap-3 rounded-2xl border px-4 py-6 text-center transition-all duration-300 hover:-translate-y-0.5 ${
                    n >= 12 ? "lg:translate-x-[calc(50%+0.5rem)]" : ""
                  } ${
                    on
                      ? "border-teal/50 bg-[#F6F0E4] shadow-[0_14px_30px_rgba(17,19,24,0.08)]"
                      : "border-line bg-white hover:border-teal/40 hover:shadow-[0_12px_26px_rgba(17,19,24,0.07)]"
                  }`}
                >
                  {/* Logo — optically normalised via per-brand scale */}
                  <span className="relative flex h-[4.75rem] w-[4.75rem] items-center justify-center">
                    <FallbackImage
                      src={`/brands/${b.slug}.png`}
                      alt={`${b.name} logo`}
                      className="h-full w-full object-contain"
                      style={{ transform: `scale(${b.scale ?? 1})` }}
                    />
                  </span>
                  <span className="font-heading text-sm font-semibold text-ink">
                    {b.name}
                  </span>
                  <span className="font-body text-xs font-medium text-mute nums">
                    {b.count} {T.cars[lang]}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
