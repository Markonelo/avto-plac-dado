const fs = require("fs");
const cars = require("./_enriched.json");

// Deterministic, honest-ish rating from age + mileage (4.2–4.9), stable per car.
function ratingOf(c) {
  const age = 2026 - c.year;
  const kmPenalty = Math.min(c.mileage / 1_000_000, 0.35); // up to ~0.35
  let r = 4.9 - age * 0.03 - kmPenalty;
  r = Math.max(4.2, Math.min(4.9, r));
  return Math.round(r * 10) / 10;
}

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const records = cars
  .map((c) => {
    // Read the ACTUAL photos on disk (after the audit removed wrong-car /
    // document shots and renumbered), so the gallery always matches reality.
    const dir = `public/cars/${c.id}`;
    const images = fs
      .readdirSync(dir)
      .filter((f) => /\.jpe?g$/i.test(f))
      .sort()
      .map((f) => `/cars/${c.id}/${f}`);
    const featStr = c.features.map((f) => `"${esc(f)}"`).join(", ");
    const imgStr = images.map((p) => `"${p}"`).join(", ");
    return `  {
    id: "${c.id}",
    adId: "${c.adId}",
    name: "${esc(c.name)}",
    make: "${esc(c.make)}",
    brandSlug: "${c.brandSlug}",
    model: "${esc(c.model)}",
    price: ${c.price},
    year: ${c.year},
    mileage: ${c.mileage},
    fuel: "${c.fuel}",
    transmission: "${c.transmission}",
    body: "${c.body}",
    power: "${esc(c.power)}",
    hp: ${c.hp},
    color: "${esc(c.color)}",
    euro: "${esc(c.euro)}",
    registration: "${esc(c.registration)}",
    rating: ${ratingOf(c)},
    features: [${featStr}],
    description:
      "${esc(c.description)}",
    images: [${imgStr}],
    image: "${images[0]}",
  }`;
  })
  .join(",\n");

const header = `// ── Inventory data source ──────────────────────────────────────────────
// Real stock for Avto Plac Dado, scraped from the dealership's reklama5.mk
// listings (seller "Dragan", phone 071 394 113) and translated to English.
// Photos live in /public/cars/<id>/NN.jpg. Regenerate with scripts/gen-cars.cjs.

export type Fuel = "Petrol" | "Diesel" | "Hybrid" | "Electric";
export type Transmission = "Manual" | "Automatic";
export type Body =
  | "Hatchback"
  | "Sedan"
  | "SUV"
  | "Estate"
  | "Coupé"
  | "MPV";

export type Car = {
  id: string; // url slug, e.g. "bmw-318-2008"
  adId: string; // source reklama5 ad id
  name: string; // full display name, e.g. "BMW 318"
  make: string; // brand, e.g. "BMW"
  brandSlug: string; // logo file slug, e.g. "bmw"
  model: string; // model only, e.g. "318"
  price: number; // €
  year: number;
  mileage: number; // km
  fuel: Fuel;
  transmission: Transmission;
  body: Body;
  power: string; // e.g. "90 kW / 122 hp"
  hp: number; // horsepower (for sorting/display)
  color: string; // English colour name
  euro: string; // emission class, e.g. "Euro 5"
  registration: string; // e.g. "Macedonian, registered until 02.2026"
  rating: number; // 0–5 (derived)
  features: string[]; // English equipment list
  description: string; // English narrative
  images: string[]; // gallery, /public paths
  image: string; // first image (card thumbnail)
};

// Brand meta — logo slug + optical scale (measured once per PNG).
export const BRAND_META: Record<string, { name: string; scale: number }> = {
  peugeot: { name: "Peugeot", scale: 1.39 },
  hyundai: { name: "Hyundai", scale: 1.12 },
  renault: { name: "Renault", scale: 1.17 },
  audi: { name: "Audi", scale: 1 },
  citroen: { name: "Citroën", scale: 0.98 },
  fiat: { name: "Fiat", scale: 1.6 },
  opel: { name: "Opel", scale: 1.6 },
  seat: { name: "Seat", scale: 1 },
  nissan: { name: "Nissan", scale: 1.14 },
  volkswagen: { name: "Volkswagen", scale: 1.15 },
  mazda: { name: "Mazda", scale: 1 },
  dacia: { name: "Dacia", scale: 1.53 },
  bmw: { name: "BMW", scale: 0.98 },
  lancia: { name: "Lancia", scale: 1.6 },
  chevrolet: { name: "Chevrolet", scale: 1.05 },
  kia: { name: "Kia", scale: 1.31 },
  ford: { name: "Ford", scale: 1.01 },
  suzuki: { name: "Suzuki", scale: 1 },
};

export const BODIES: Body[] = [
  "Hatchback",
  "Sedan",
  "SUV",
  "Estate",
  "Coupé",
  "MPV",
];

export const CARS: Car[] = [
`;

const footer = `
];

// Distinct brand slugs actually present in stock, ordered by inventory count.
export function brandsInStock(): { slug: string; name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of CARS) counts.set(c.brandSlug, (counts.get(c.brandSlug) ?? 0) + 1);
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, name: BRAND_META[slug]?.name ?? slug, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getCar(id: string): Car | undefined {
  return CARS.find((c) => c.id === id);
}

// Up to \`n\` other cars to suggest — same brand first, then same body, then fill.
export function relatedCars(car: Car, n = 3): Car[] {
  const others = CARS.filter((c) => c.id !== car.id);
  const score = (c: Car) =>
    (c.brandSlug === car.brandSlug ? 2 : 0) + (c.body === car.body ? 1 : 0);
  return [...others].sort((a, b) => score(b) - score(a) || b.year - a.year).slice(0, n);
}

export const PRICE_MIN = Math.min(...CARS.map((c) => c.price));
export const PRICE_MAX = Math.max(...CARS.map((c) => c.price));
export const YEAR_MIN = Math.min(...CARS.map((c) => c.year));
export const YEAR_MAX = Math.max(...CARS.map((c) => c.year));
`;

fs.writeFileSync(
  "C:/Users/marko/avto-plac-dado/lib/cars.ts",
  header + records + footer
);
console.log("wrote lib/cars.ts with", cars.length, "cars");
