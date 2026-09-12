// ──────────────────────────────────────────────────────────────────────────
// SEO core — everything Google.mk sees is written in Macedonian (Cyrillic +
// Latin transcriptions), targeting Bitola / Пелагонија. Mirrors the proven
// Auto Lavce setup (top-5 on Google). Macedonian is the canonical language;
// the English toggle is client-side only, so a single indexed URL per page
// keeps all ranking signal in one place.
// ──────────────────────────────────────────────────────────────────────────
import type { Metadata } from "next";
import type { Car } from "./cars";
import { SITE } from "./site";
import {
  FUEL_MK,
  TRANS_MK,
  BODY_MK,
  COLOR_MK,
  carDescription,
} from "./i18n";

const BASE_URL = SITE.url; // https://avtoplacdado.com
const SITE_NAME = SITE.name; // Avto Plac Dado
const NAME_CYR = SITE.nameCyrillic; // Авто Плац Дадо

const DEFAULT_DESCRIPTION =
  "Авто Плац Дадо — автосалон во Битола. Широк избор на половни автомобили " +
  "по фер цени, со комплетна документација и подготвени за регистрација. " +
  "Најдете го вашиот следен автомобил во Битола.";

const KEYWORDS = [
  "автосалон Битола",
  "половни автомобили Битола",
  "купи автомобил Битола",
  "автомобили на продажба Битола",
  "авто плац Битола",
  "коли на продажба Битола",
  "половни возила Македонија",
  "автосалон Пелагонија",
  "Авто Плац Дадо",
  "avto plac Bitola",
  "avtosalon Bitola",
  "polovni avtomobili Bitola",
  "koli na prodazba Bitola",
  "Avto Plac Dado",
];

// Geo (from the footer map pin).
const GEO = { latitude: 41.0476308, longitude: 21.3453394 };

export function buildMeta(overrides?: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: `Автосалон Битола | ${NAME_CYR} — Половни Автомобили Битола`,
      template: `%s | ${NAME_CYR} — Битола`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: KEYWORDS,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "mk_MK",
      url: BASE_URL,
      siteName: SITE_NAME,
      title: `Автосалон Битола | ${NAME_CYR}`,
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${NAME_CYR} — Автосалон Битола`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Автосалон Битола | ${NAME_CYR}`,
      description: DEFAULT_DESCRIPTION,
      images: ["/og-image.jpg"],
    },
    alternates: { canonical: BASE_URL },
    ...overrides,
  };
}

// Per-car page metadata (Macedonian). URL: /cars/<id>.
export function buildCarMeta(car: Car): Metadata {
  const priceText =
    car.price > 0
      ? `${car.price.toLocaleString("mk-MK")} €`
      : "Цена по договор";
  const fuelMk = FUEL_MK[car.fuel] ?? car.fuel;
  const transMk = TRANS_MK[car.transmission] ?? car.transmission;
  const bodyMk = BODY_MK[car.body] ?? car.body;
  const km = car.mileage.toLocaleString("mk-MK");

  const title = `${car.name} (${car.year}) — ${priceText}`;
  const description =
    `Купи ${car.name} (${car.year}) во Битола: ${fuelMk}, ${transMk}, ` +
    `${bodyMk}, ${car.hp} КС, ${km} км. ${priceText}. ` +
    `Автосалон ${NAME_CYR}, Битола.`;
  const url = `${BASE_URL}/cars/${car.id}`;

  return buildMeta({
    title,
    description,
    openGraph: {
      type: "website",
      locale: "mk_MK",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: car.image || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${car.name} (${car.year}) — ${NAME_CYR} Битола`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [car.image || "/og-image.jpg"],
    },
    alternates: { canonical: url },
  });
}

// AutoDealer + LocalBusiness — injected once in the root layout.
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["AutoDealer", "LocalBusiness"],
    name: NAME_CYR,
    alternateName: SITE_NAME,
    legalName: SITE.legalName,
    url: BASE_URL,
    telephone: SITE.phoneHref.replace("tel:", ""),
    email: SITE.email,
    image: `${BASE_URL}/og-image.jpg`,
    logo: `${BASE_URL}/logo-light.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "8-ми Септември 7",
      addressLocality: "Битола",
      addressRegion: "Пелагониски регион",
      postalCode: "7000",
      addressCountry: "MK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:30",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "10:30",
        closes: "18:00",
      },
    ],
    priceRange: "€€",
    description: DEFAULT_DESCRIPTION,
    areaServed: [
      "Битола",
      "Прилеп",
      "Ресен",
      "Демир Хисар",
      "Охрид",
      "Пелагониски регион",
    ],
    hasMap: `https://maps.google.com/?q=${GEO.latitude},${GEO.longitude}`,
    sameAs: [SITE.facebook].filter(Boolean),
  };
}

// Product schema for a single car page (Macedonian description).
export function carProductSchema(car: Car) {
  const disp = car.description.match(/(\d\.\d)\s*-?\s*litre/i)?.[1];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${car.name} (${car.year})`,
    description: carDescription(car, "mk"),
    sku: car.id,
    color: COLOR_MK[car.color] ?? car.color,
    image: car.images?.length ? car.images : car.image ? [car.image] : undefined,
    brand: { "@type": "Brand", name: car.make },
    offers: {
      "@type": "Offer",
      ...(car.price > 0 ? { price: car.price, priceCurrency: "EUR" } : {}),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      url: `${BASE_URL}/cars/${car.id}`,
      seller: { "@type": "AutoDealer", name: NAME_CYR },
    },
    vehicleModelDate: car.year,
    productionDate: String(car.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "KMT",
    },
    vehicleEngine: {
      "@type": "EngineSpecification",
      fuelType: FUEL_MK[car.fuel] ?? car.fuel,
      ...(disp
        ? {
            engineDisplacement: {
              "@type": "QuantitativeValue",
              value: disp,
              unitCode: "LTR",
            },
          }
        : {}),
    },
    vehicleTransmission: TRANS_MK[car.transmission] ?? car.transmission,
    bodyType: BODY_MK[car.body] ?? car.body,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}
