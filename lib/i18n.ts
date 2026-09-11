// ──────────────────────────────────────────────────────────────────────────
// i18n core — Macedonian (mk) is the primary / SSR / SEO-indexed language;
// English (en) is a client-side convenience toggle (no URL routing, so search
// rankings never fragment). Mirrors the proven Auto Lavce setup.
//
// Components import `useLang()` from components/LanguageProvider and read copy
// from a local `T = { mk, en }` dictionary. Car-spec enums, features, colours
// and the generated car description are translated by the helpers below so the
// inventory + car pages fully switch language.
// ──────────────────────────────────────────────────────────────────────────
import type { Car, Fuel, Transmission, Body } from "./cars";

export type Lang = "mk" | "en";

// ── Fuel ──
export const FUEL_MK: Record<Fuel, string> = {
  Petrol: "Бензин",
  Diesel: "Дизел",
  Hybrid: "Хибрид",
  Electric: "Електричен",
};

// ── Transmission ──
export const TRANS_MK: Record<Transmission, string> = {
  Manual: "Рачен",
  Automatic: "Автоматик",
};

// ── Body ──
export const BODY_MK: Record<Body, string> = {
  Hatchback: "Хечбек",
  Sedan: "Седан",
  SUV: "Џип",
  Estate: "Караван",
  Coupé: "Купе",
  MPV: "Моноволумен",
};

// ── Colours ──
export const COLOR_MK: Record<string, string> = {
  Grey: "Сива",
  Black: "Црна",
  Blue: "Сина",
  White: "Бела",
  Red: "Црвена",
  Yellow: "Жолта",
  Brown: "Кафеава",
  Silver: "Сребрена",
  Green: "Зелена",
  Orange: "Портокалова",
};

// ── Equipment / features ──
export const FEATURE_MK: Record<string, string> = {
  "Climate control": "Автоматска клима",
  "Air conditioning": "Клима уред",
  "Trip computer": "Патен компјутер",
  "Cruise control": "Темпомат",
  "Alloy wheels": "Алу-фелни",
  "Factory CD radio": "Фабричко ЦД радио",
  "CD radio": "ЦД радио",
  "DVD radio": "DVD радио",
  "Electric windows": "Електрични прозорци",
  "Central locking": "Централно заклучување",
  "Power steering": "Сервоуправување",
  "Two keys": "Два клуча",
  ABS: "ABS",
  ESP: "ESP",
  "ABS & ESP": "ABS и ESP",
  Airbags: "Воздушни перничиња",
  "4 airbags": "4 воздушни перничиња",
  "6 airbags": "6 воздушни перничиња",
  "8 airbags": "8 воздушни перничиња",
  "Winter tyres": "Зимски гуми",
  "Summer tyres": "Летни гуми",
  "Fog lights": "Светла за магла",
  "Xenon headlights": "Ксенон светла",
  "Full service history": "Целосна сервисна историја",
  "Heated seats": "Грејачи на седишта",
  "Certified tow bar": "Атестирана кука",
  "Tow bar": "Кука за влечење",
  "Tinted rear windows": "Затемнети задни стакла",
  "Parking sensors": "Парктроник",
  Navigation: "Навигација",
  ISOFIX: "ISOFIX",
  "AUX input": "AUX приклучок",
  USB: "USB",
  "Rear camera": "Камера за паркирање",
};

// ── Helpers ──
export const tFuel = (v: Fuel, lang: Lang): string =>
  lang === "mk" ? FUEL_MK[v] ?? v : v;

export const tTrans = (v: Transmission, lang: Lang): string =>
  lang === "mk" ? TRANS_MK[v] ?? v : v;

export const tBody = (v: Body, lang: Lang): string =>
  lang === "mk" ? BODY_MK[v] ?? v : v;

export const tColor = (v: string, lang: Lang): string =>
  lang === "mk" ? COLOR_MK[v] ?? v : v;

export const tFeature = (v: string, lang: Lang): string =>
  lang === "mk" ? FEATURE_MK[v] ?? v : v;

// "Macedonian, registered until 02.2026" → "Македонска, регистрирана до 02.2026"
export function tRegistration(v: string, lang: Lang): string {
  if (lang !== "mk") return v;
  return v
    .replace(/^Macedonian/i, "Македонска")
    .replace(/registered until/i, "регистрирана до");
}

// Rebuild the car narrative in natural Macedonian from the car fields. The
// English source follows a fixed template, so we lift the engine displacement
// out of it and compose a clean Cyrillic sentence for both the visible copy and
// the Product JSON-LD (better local relevance for Google.mk).
export function carDescription(car: Car, lang: Lang): string {
  if (lang !== "mk") return car.description;

  const disp = car.description.match(/(\d\.\d)\s*-?\s*litre/i)?.[1];
  const dispPart = disp ? ` од ${disp} литри` : "";
  const fuelMk = (FUEL_MK[car.fuel] ?? car.fuel).toLowerCase();
  const transMk = (TRANS_MK[car.transmission] ?? car.transmission).toLowerCase();
  const colorMk = (COLOR_MK[car.color] ?? car.color).toLowerCase();
  // Use "en-US" (deterministic comma grouping) rather than "mk-MK": the
  // Macedonian locale's separator differs between Node's server ICU and the
  // browser's ICU, which caused a React hydration mismatch. This also matches
  // the "160,000" shown in the spec grid above the description.
  const km = car.mileage.toLocaleString("en-US");
  const fsh = /full service history/i.test(car.description)
    ? " со целосна сервисна историја"
    : "";
  const imported = /imported from slovenia/i.test(car.description)
    ? "Увезен од Словенија. "
    : "";

  return (
    `${car.name} (${car.year}) со ${fuelMk} мотор${dispPart} и јачина од ` +
    `${car.hp} КС, ${transMk} менувач и поминати ${km} км${fsh}. ` +
    `${imported}Бојата е ${colorMk}. Возилото е во одлична техничка и ` +
    `механичка состојба — моторот, каросеријата и внатрешноста се како нови — ` +
    `со комплетна документација подготвена и спремна за регистрација. ` +
    `Стандард ${car.euro}. Достапно во Авто Плац Дадо, Битола.`
  );
}

// Short power label, e.g. "110 КС" (mk) / "110 hp" (en).
export const tPower = (car: Car, lang: Lang): string =>
  lang === "mk" ? `${car.hp} КС` : `${car.hp} hp`;
