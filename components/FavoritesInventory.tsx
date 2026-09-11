"use client";
import Link from "next/link";
import { HeartCrack, ArrowRight } from "lucide-react";
import { CARS } from "@/lib/cars";
import CarCard from "./CarCard";
import { useFavorites } from "./FavoritesContext";
import { useLang } from "./LanguageProvider";

const T = {
  heading: { mk: "Омилени возила", en: "Saved cars" },
  car: { mk: "возило", en: "car" },
  cars: { mk: "возила", en: "cars" },
  saved: { mk: "зачувани", en: "saved" },
  copy: {
    mk: "Возилата што ги означивте со срцето се чуваат овде на овој уред, за лесно да ги споредите.",
    en: "The cars you heart are kept here on this device so you can compare them easily.",
  },
  emptyTitle: { mk: "Сѐ уште немате омилени возила", en: "No saved cars yet" },
  emptyCopy: {
    mk: "Допрете го срцето на било кое возило за да го зачувате тука за подоцна.",
    en: "Tap the heart on any car to save it here for later.",
  },
  browse: { mk: "Разгледај ги возилата", en: "Browse inventory" },
} as const;

export default function FavoritesInventory() {
  const { lang } = useLang();
  const { ids, ready } = useFavorites();

  // Preserve the order the user saved them in.
  const saved = ids
    .map((id) => CARS.find((c) => c.id === id))
    .filter((c): c is (typeof CARS)[number] => Boolean(c));

  return (
    <section className="section-padding bg-cloud pt-48 sm:pt-56">
      <div className="container-wide">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {T.heading[lang]}
          </h1>
          <p className="mt-4 font-body text-base leading-relaxed text-mute sm:text-lg">
            {T.copy[lang]}
          </p>
          {ready && saved.length > 0 && (
            <p className="mt-3 font-body text-sm font-medium text-ink-soft nums">
              {saved.length}{" "}
              {saved.length === 1 ? T.car[lang] : T.cars[lang]} {T.saved[lang]}
            </p>
          )}
        </div>

        {/* Grid / empty state — render nothing until hydrated to avoid a flash */}
        {ready && (
          <div className="mt-12">
            {saved.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {saved.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-[0.625rem] border border-dashed border-line bg-surface py-20 text-center">
                <HeartCrack size={40} strokeWidth={1.25} className="text-mute/50" />
                <p className="mt-4 font-heading text-lg font-semibold text-ink">
                  {T.emptyTitle[lang]}
                </p>
                <p className="mt-1 max-w-xs font-body text-sm text-mute">
                  {T.emptyCopy[lang]}
                </p>
                <Link
                  href="/cars"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal px-5 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
                >
                  {T.browse[lang]}
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
