// Infinite brand conveyor. CSS-only marquee (no JS) — the track is duplicated
// so the -50% keyframe loops seamlessly. Real logo PNGs live in /public/brands
// and are rendered in greyscale so the strip reads as a clean, uncoloured row.
import FallbackImage from "./FallbackImage";
import { BRAND_META } from "@/lib/cars";

const BRAND_SLUGS = [
  "bmw",
  "audi",
  "volkswagen",
  "peugeot",
  "renault",
  "opel",
  "ford",
  "hyundai",
  "kia",
  "citroen",
  "fiat",
  "dacia",
  "nissan",
  "mazda",
  "seat",
  "chevrolet",
  "lancia",
];

export default function BrandsMarquee() {
  const row = [...BRAND_SLUGS, ...BRAND_SLUGS];
  return (
    <section className="mt-10 border-y border-line bg-cloud py-8 sm:mt-12">
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track items-center gap-[60px] pr-[60px]">
          {row.map((slug, i) => (
            <span
              key={`${slug}-${i}`}
              className="flex h-20 w-28 shrink-0 items-center justify-center"
            >
              <FallbackImage
                src={`/brands/${slug}.png`}
                alt={`${BRAND_META[slug]?.name ?? slug} logo`}
                className="max-h-[46px] max-w-[76px] object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-90"
                style={{ transform: `scale(${BRAND_META[slug]?.scale ?? 1})` }}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
