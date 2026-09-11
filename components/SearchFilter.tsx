"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { useLang } from "./LanguageProvider";
import type { Lang } from "@/lib/i18n";

// Floating search card (AEVUM style) — sits just under the hero.
// Purely a lead-in to /cars for now; wires the chosen filters into the URL.
// Option VALUES stay English/canonical so /cars filtering keeps matching; only
// the visible LABELS switch language.
const TABS = ["All", "New", "Used"] as const;

const MAKES = ["Any Make", "Mercedes-Benz", "BMW", "Audi", "Volkswagen", "Toyota"];
const BODIES = ["Any Type", "Hatchback", "Sedan", "SUV", "Estate", "Coupé", "Convertible", "Van"];
const YEARS = ["Any Year", "2023", "2022", "2021", "2020", "2019", "2018"];
const PRICES = ["Any Price", "Up to €10,000", "€10,000 – €20,000", "€20,000 – €30,000", "€30,000+"];

const T = {
  tabs: {
    All: { mk: "Сите", en: "All" },
    New: { mk: "Нови", en: "New" },
    Used: { mk: "Половни", en: "Used" },
  },
  labels: {
    make: { mk: "Марка", en: "Make" },
    body: { mk: "Каросерија", en: "Body Type" },
    year: { mk: "Година", en: "Year" },
    price: { mk: "Цена", en: "Price" },
  },
  search: { mk: "Пребарај", en: "Search" },
  opt: {
    "Any Make": { mk: "Сите марки", en: "Any Make" },
    "Any Type": { mk: "Сите каросерии", en: "Any Type" },
    Hatchback: { mk: "Хечбек", en: "Hatchback" },
    Sedan: { mk: "Седан", en: "Sedan" },
    SUV: { mk: "Џип", en: "SUV" },
    Estate: { mk: "Караван", en: "Estate" },
    "Coupé": { mk: "Купе", en: "Coupé" },
    Convertible: { mk: "Кабриолет", en: "Convertible" },
    Van: { mk: "Комбе", en: "Van" },
    "Any Year": { mk: "Сите години", en: "Any Year" },
    "Any Price": { mk: "Сите цени", en: "Any Price" },
    "Up to €10,000": { mk: "До €10.000", en: "Up to €10,000" },
    "€10,000 – €20,000": { mk: "€10.000 – €20.000", en: "€10,000 – €20,000" },
    "€20,000 – €30,000": { mk: "€20.000 – €30.000", en: "€20,000 – €30,000" },
    "€30,000+": { mk: "€30.000+", en: "€30,000+" },
  } as Record<string, { mk: string; en: string }>,
} as const;

const optLabel = (o: string, lang: Lang) => T.opt[o]?.[lang] ?? o;

function Select({
  label,
  options,
  value,
  onChange,
  lang,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  lang: Lang;
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
            <option key={o} value={o}>
              {optLabel(o, lang)}
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
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [make, setMake] = useState(MAKES[0]);
  const [body, setBody] = useState(BODIES[0]);
  const [year, setYear] = useState(YEARS[0]);
  const [price, setPrice] = useState(PRICES[0]);

  const search = () => {
    const p = new URLSearchParams();
    if (tab !== "All") p.set("condition", tab.toLowerCase());
    if (make !== MAKES[0]) p.set("make", make);
    if (body !== BODIES[0]) p.set("body", body);
    if (year !== YEARS[0]) p.set("year", year);
    if (price !== PRICES[0]) p.set("price", price);
    const q = p.toString();
    router.push(`/cars${q ? `?${q}` : ""}`);
  };

  return (
    <section className="relative z-30 -mt-20 px-4 sm:-mt-28 sm:px-6">
      <div className="container-wide !px-0">
        <div className="rounded-[0.625rem] border border-line bg-white/90 p-4 shadow-[0_24px_60px_rgba(17,19,24,0.12)] backdrop-blur-xl sm:p-5">
          {/* Tabs */}
          <div className="mb-4 flex gap-1 border-b border-line pb-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-4 py-2 font-heading text-sm font-medium transition-colors ${
                  tab === t ? "text-ink" : "text-mute hover:text-ink"
                }`}
              >
                {T.tabs[t][lang]}
                {tab === t && (
                  <span className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-teal" />
                )}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Select label={T.labels.make[lang]} options={MAKES} value={make} onChange={setMake} lang={lang} />
            <Select label={T.labels.body[lang]} options={BODIES} value={body} onChange={setBody} lang={lang} />
            <Select label={T.labels.year[lang]} options={YEARS} value={year} onChange={setYear} lang={lang} />
            <Select label={T.labels.price[lang]} options={PRICES} value={price} onChange={setPrice} lang={lang} />
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
