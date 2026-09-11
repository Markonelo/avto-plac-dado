"use client";
// Infinite brand-logo conveyor under the inventory hero. CSS-only marquee
// (track duplicated so the -50% keyframe loops seamlessly). Uses the real logo
// PNGs in /public/brands, optically normalised per-brand via BRAND_META.scale.
import { BRAND_META, brandsInStock } from "@/lib/cars";
import FallbackImage from "./FallbackImage";
import { useLang } from "./LanguageProvider";

const SLUGS = brandsInStock().map((b) => b.slug);

const T = {
  brands: { mk: "Марки што ги нудиме", en: "Brands you can find with us" },
} as const;

export default function CarsMarquee() {
  const { lang } = useLang();
  const set = [...SLUGS, ...SLUGS];
  const row = [...set, ...set];
  return (
    <section className="px-4 pb-10 pt-2 sm:px-6 sm:pb-12 sm:pt-3">
      <div className="mx-auto max-w-[88rem] px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-[0.9rem] border border-line bg-cloud-2/60 px-4 py-3 sm:px-8 sm:py-4">
          <p className="mb-4 text-center font-heading text-[11px] font-bold uppercase tracking-[0.22em] text-mute">
            {T.brands[lang]}
          </p>
          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
              {row.map((slug, i) => (
                <span
                  key={`${slug}-${i}`}
                  className="flex h-[72px] w-24 shrink-0 items-center justify-center opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                  title={BRAND_META[slug].name}
                >
                  <FallbackImage
                    src={`/brands/${slug}.png`}
                    alt={`${BRAND_META[slug].name} logo`}
                    className="max-h-[44px] max-w-[80px] object-contain"
                    style={{ transform: `scale(${BRAND_META[slug].scale})` }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
