"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Reveal from "./Reveal";
import FallbackImage from "./FallbackImage";
import { useLang } from "./LanguageProvider";
import { brandsInStock } from "@/lib/cars";

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

// Optical scale per logo PNG (measured once from each mark's opaque bounding box).
const SCALE: Record<string, number> = {
  peugeot: 1.39, hyundai: 1.12, renault: 1.17, audi: 1, citroen: 0.98,
  fiat: 1.6, opel: 1.6, seat: 1, nissan: 1.14, volkswagen: 1.15, mazda: 1,
  dacia: 1.53, bmw: 0.98, lancia: 1.6, chevrolet: 1.05, kia: 1.31, ford: 1.01,
  suzuki: 1,
};

// Counts are derived from live inventory so the card never goes stale on a
// daily inventory sync (brandsInStock() is sorted by count desc, then name).
const BRANDS: Brand[] = brandsInStock().map((b) => ({
  name: b.name,
  slug: b.slug,
  count: b.count,
  scale: SCALE[b.slug] ?? 1,
}));

export default function BrandsCard() {
  const router = useRouter();
  const { lang } = useLang();
  const [active, setActive] = useState(0); // first brand highlighted by default

  // On the lg 6-col grid, optically centre the final row only when it is short
  // by exactly one tile (5 of 6) — otherwise leave rows flush.
  const lastRowShift =
    BRANDS.length % 6 === 5 ? BRANDS.length - 5 : -1;

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
                    lastRowShift >= 0 && n >= lastRowShift
                      ? "lg:translate-x-[calc(50%+0.5rem)]"
                      : ""
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
