"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { tBody } from "@/lib/i18n";
import {
  brandsInStock,
  BODIES,
  CARS,
  YEAR_MIN,
  YEAR_MAX,
  type Body,
} from "@/lib/cars";

// Floating search card (AEVUM style) — sits just under the hero.
// A lead-in to /cars: it writes the chosen filters into the URL and /cars
// (CarsInventory) reads them on mount. All options are derived from the real
// inventory in lib/cars.ts so the dropdowns always match the actual stock.
// Sales-only used-car dealer, so there is no New/Used condition switch.

// Brands actually in stock (display names, ordered by inventory count).
const BRANDS = brandsInStock().map((b) => b.name);
// Body types that actually appear in stock (keeps out empty categories).
const BODY_OPTS: Body[] = BODIES.filter((b) => CARS.some((c) => c.body === b));
// Every model year present, newest first.
const YEARS = Array.from(
  { length: YEAR_MAX - YEAR_MIN + 1 },
  (_, i) => YEAR_MAX - i
);
// Price brackets covering the real €3,100–€8,499 range. Value = "from-to"
// (empty side = open-ended), parsed in search().
const PRICE_OPTS = [
  { value: "-4000", en: "Up to €4,000", mk: "До €4.000" },
  { value: "4000-6000", en: "€4,000 – €6,000", mk: "€4.000 – €6.000" },
  { value: "6000-8000", en: "€6,000 – €8,000", mk: "€6.000 – €8.000" },
  { value: "8000-", en: "€8,000+", mk: "€8.000+" },
] as const;

const T = {
  labels: {
    make: { mk: "Марка", en: "Make" },
    body: { mk: "Каросерија", en: "Body Type" },
    year: { mk: "Година (од)", en: "Year (from)" },
    price: { mk: "Цена", en: "Price" },
  },
  search: { mk: "Пребарај", en: "Search" },
  anyMake: { mk: "Сите марки", en: "Any Make" },
  anyBody: { mk: "Сите каросерии", en: "Any Type" },
  anyYear: { mk: "Сите години", en: "Any Year" },
  anyPrice: { mk: "Сите цени", en: "Any Price" },
} as const;

type Opt = { label: string; value: string };

function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Opt[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="group relative flex flex-1 flex-col gap-1">
      <span className="font-heading text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-xl border border-line bg-surface-2 px-3.5 py-3 pr-9 font-body text-sm font-medium text-ink outline-none transition-colors hover:border-teal/50 focus:border-teal"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mute transition-colors group-hover:text-teal-dark"
        />
      </div>
    </label>
  );
}

export default function SearchFilter() {
  const router = useRouter();
  const { lang } = useLang();
  const [make, setMake] = useState("");
  const [body, setBody] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");

  const makeOpts: Opt[] = [
    { label: T.anyMake[lang], value: "" },
    ...BRANDS.map((b) => ({ label: b, value: b })),
  ];
  const bodyOpts: Opt[] = [
    { label: T.anyBody[lang], value: "" },
    ...BODY_OPTS.map((b) => ({ label: tBody(b, lang), value: b })),
  ];
  const yearOpts: Opt[] = [
    { label: T.anyYear[lang], value: "" },
    ...YEARS.map((y) => ({ label: String(y), value: String(y) })),
  ];
  const priceOpts: Opt[] = [
    { label: T.anyPrice[lang], value: "" },
    ...PRICE_OPTS.map((p) => ({ label: p[lang], value: p.value })),
  ];

  const search = () => {
    const p = new URLSearchParams();
    if (make) p.set("make", make);
    if (body) p.set("body", body);
    if (year) p.set("yearFrom", year);
    if (price) {
      const [from, to] = price.split("-");
      if (from) p.set("priceFrom", from);
      if (to) p.set("priceTo", to);
    }
    const q = p.toString();
    router.push(`/cars${q ? `?${q}` : ""}`);
  };

  return (
    <section className="relative z-30 -mt-20 px-4 sm:-mt-28 sm:px-6">
      <div className="container-wide !px-0">
        <div className="rounded-[0.625rem] border border-line bg-white/90 p-6 shadow-[0_24px_60px_rgba(17,19,24,0.12)] backdrop-blur-xl sm:p-8">
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Select label={T.labels.make[lang]} options={makeOpts} value={make} onChange={setMake} />
            <Select label={T.labels.body[lang]} options={bodyOpts} value={body} onChange={setBody} />
            <Select label={T.labels.year[lang]} options={yearOpts} value={year} onChange={setYear} />
            <Select label={T.labels.price[lang]} options={priceOpts} value={price} onChange={setPrice} />
            <button
              onClick={search}
              className="glow-btn !rounded-xl !px-6 !py-3 sm:w-auto"
            >
              <Search size={18} /> {T.search[lang]}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
