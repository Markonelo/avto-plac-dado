"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, Car as CarIcon, Calendar, Gauge, Fuel, Settings2, ArrowRight } from "lucide-react";
import type { Car } from "@/lib/cars";
import { BRAND_META } from "@/lib/cars";
import FallbackImage from "./FallbackImage";
import { useLang } from "./LanguageProvider";
import { tFuel, tTrans, tBody } from "@/lib/i18n";

const T = {
  photoSoon: { mk: "Фотографија наскоро", en: "Photo coming soon" },
  addFav: { mk: "Додади во омилени", en: "Add to favourites" },
  removeFav: { mk: "Отстрани од омилени", en: "Remove from favourites" },
  viewDetails: { mk: "Види детали", en: "View details" },
} as const;

// Single inventory card (reference photo): photo on top with a favourite heart
// top-right and a circular brand logo bottom-right; then name, price, a thin
// divider, a stats row, another divider and the rating at the bottom.
// The whole card links to the car's detail page.
export default function CarCard({ car }: { car: Car }) {
  const { lang } = useLang();
  const [fav, setFav] = useState(false);
  const brand = BRAND_META[car.brandSlug];

  const stats = [
    { icon: Calendar, value: String(car.year) },
    { icon: Gauge, value: `${(car.mileage / 1000).toFixed(0)}k km` },
    { icon: Fuel, value: tFuel(car.fuel, lang) },
    { icon: Settings2, value: tTrans(car.transmission, lang) },
  ];

  return (
    <Link
      href={`/cars/${car.id}`}
      className="group flex flex-col overflow-hidden rounded-[0.625rem] border border-line bg-surface shadow-[0_1px_2px_rgba(17,19,24,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_18px_44px_rgba(17,19,24,0.10)]">
      {/* ── Photo ── */}
      <div className="relative">
        <div className="relative h-64 overflow-hidden bg-[radial-gradient(120%_120%_at_50%_20%,#f4f7f8_0%,#e8eef0_100%)] sm:h-72">
          {/* placeholder behind the (missing) photo */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-mute">
            <CarIcon size={44} strokeWidth={1} className="opacity-25" />
            <span className="font-body text-[10px] uppercase tracking-[0.18em] opacity-45">
              {T.photoSoon[lang]}
            </span>
          </div>

          <FallbackImage
            src={car.image}
            alt={car.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Favourite heart — top-right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFav((v) => !v);
            }}
            aria-label={fav ? T.removeFav[lang] : T.addFav[lang]}
            aria-pressed={fav}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/90 text-ink shadow-sm backdrop-blur-sm transition-colors hover:border-teal/50"
          >
            <Heart
              size={17}
              className={fav ? "fill-teal text-teal" : "text-ink/55"}
            />
          </button>
        </div>

        {/* Brand logo circle — straddles the seam between photo and card body */}
        <span
          className="absolute bottom-0 right-4 z-20 flex h-12 w-12 translate-y-1/2 items-center justify-center rounded-full border border-ink/30 bg-cloud-2 shadow-[0_4px_12px_rgba(17,19,24,0.15)]"
          title={brand?.name}
        >
          <FallbackImage
            src={`/brands/${car.brandSlug}.png`}
            alt={`${brand?.name} logo`}
            className="h-8 w-8 object-contain"
            style={{ transform: `scale(${brand?.scale ?? 1})` }}
          />
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col p-5 pt-6">
        <h3 className="font-heading text-xl font-semibold tracking-tight text-ink">
          {car.name}
        </h3>
        <p className="mt-1.5 font-heading text-2xl font-semibold text-teal-dark nums">
          €{car.price.toLocaleString("en-US")}
        </p>

        <div className="my-4 h-px w-full bg-line" />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
          {stats.map((s) => (
            <div key={s.value} className="flex items-center gap-2">
              <s.icon size={17} className="shrink-0 text-teal-dark" />
              <span className="font-body text-[15px] font-medium text-mute nums">
                {s.value}
              </span>
            </div>
          ))}
        </div>

        <div className="my-4 h-px w-full bg-line" />

        {/* Body type + view details — bottom */}
        <div className="mt-auto flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 font-heading text-base font-semibold text-teal-dark transition-colors group-hover:text-teal">
            {T.viewDetails[lang]}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="inline-flex items-center rounded-lg border border-teal/40 px-3 py-1 font-heading text-[11px] font-medium uppercase tracking-[0.18em] text-teal-dark">
            {tBody(car.body, lang)}
          </span>
        </div>
      </div>
    </Link>
  );
}
