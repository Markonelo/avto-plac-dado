"use client";
import { Search, ChevronDown, X } from "lucide-react";
import {
  BODIES,
  brandsInStock,
  BRAND_META,
  CARS,
  PRICE_MIN,
  PRICE_MAX,
  YEAR_MIN,
  YEAR_MAX,
  type Body,
  type Transmission,
} from "@/lib/cars";
import FallbackImage from "./FallbackImage";
import { useLang } from "./LanguageProvider";
import { tBody, tTrans } from "@/lib/i18n";

const T = {
  filters: { mk: "Филтри", en: "Filters" },
  clearAll: { mk: "Исчисти сѐ", en: "Clear all" },
  car: { mk: "возило", en: "car" },
  cars: { mk: "возила", en: "cars" },
  match: { mk: "одговараат", en: "match" },
  searchCar: { mk: "Пребарај возило", en: "Search car" },
  searchPlaceholder: { mk: "пр. Golf, џип, Audi…", en: "e.g. Golf, SUV, Audi…" },
  bodyType: { mk: "Тип на каросерија", en: "Body type" },
  price: { mk: "Цена (€)", en: "Price (€)" },
  brand: { mk: "Марка", en: "Brand" },
  model: { mk: "Модел", en: "Model" },
  anyModel: { mk: "Сите модели", en: "Any model" },
  transmission: { mk: "Менувач", en: "Transmission" },
  any: { mk: "Сите", en: "Any" },
  year: { mk: "Година", en: "Year" },
} as const;

export type Filters = {
  q: string;
  bodies: Body[];
  priceFrom: string;
  priceTo: string;
  brands: string[]; // brand slugs
  model: string; // "" = any
  transmission: "Any" | Transmission;
  yearFrom: string;
  yearTo: string;
};

export const EMPTY_FILTERS: Filters = {
  q: "",
  bodies: [],
  priceFrom: "",
  priceTo: "",
  brands: [],
  model: "",
  transmission: "Any",
  yearFrom: "",
  yearTo: "",
};

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
      {children}
    </span>
  );
}

export default function CarsFilters({
  value,
  onChange,
  resultCount,
  bare = false,
}: {
  value: Filters;
  onChange: (patch: Partial<Filters>) => void;
  resultCount: number;
  // When true, drop the card chrome (border/bg/rounding) so a parent can own it —
  // used by the desktop sticky sidebar so its rounded corners stay clipped
  // consistently while the filters scroll inside.
  bare?: boolean;
}) {
  const { lang } = useLang();
  const brands = brandsInStock();
  // Models available given the currently-selected brands (or all).
  const models = [
    ...new Set(
      CARS.filter(
        (c) => value.brands.length === 0 || value.brands.includes(c.brandSlug)
      ).map((c) => c.model)
    ),
  ].sort();

  const dirty =
    value.q !== "" ||
    value.bodies.length > 0 ||
    value.priceFrom !== "" ||
    value.priceTo !== "" ||
    value.brands.length > 0 ||
    value.model !== "" ||
    value.transmission !== "Any" ||
    value.yearFrom !== "" ||
    value.yearTo !== "";

  return (
    <aside
      className={
        bare
          ? "p-5 sm:p-6"
          : "rounded-[0.625rem] border border-line bg-surface p-5 sm:p-6"
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-ink">{T.filters[lang]}</h2>
        {dirty && (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="flex items-center gap-1 font-body text-xs font-medium text-mute transition-colors hover:text-teal-dark"
          >
            <X size={13} /> {T.clearAll[lang]}
          </button>
        )}
      </div>

      <p className="mt-1 font-body text-xs text-mute nums">
        {resultCount} {resultCount === 1 ? T.car[lang] : T.cars[lang]} {T.match[lang]}
      </p>

      {/* ── Search ── */}
      <div className="mt-5 flex flex-col gap-2">
        <FieldLabel>{T.searchCar[lang]}</FieldLabel>
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute"
          />
          <input
            type="text"
            value={value.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder={T.searchPlaceholder[lang]}
            className="w-full rounded-lg border border-line bg-surface-2 py-2.5 pl-9 pr-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-mute/70 hover:border-teal/40 focus:border-teal"
          />
        </div>
      </div>

      <Divider />

      {/* ── Body type — blocky buttons ── */}
      <div className="flex flex-col gap-2">
        <FieldLabel>{T.bodyType[lang]}</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {BODIES.map((b) => {
            const on = value.bodies.includes(b);
            return (
              <button
                key={b}
                onClick={() => onChange({ bodies: toggle(value.bodies, b) })}
                aria-pressed={on}
                className={`rounded-md border px-3 py-2 font-heading text-sm font-medium transition-all ${
                  on
                    ? "border-teal bg-teal text-white shadow-[0_6px_16px_rgba(95,203,187,0.25)]"
                    : "border-line bg-surface-2 text-ink hover:border-teal/40 hover:bg-white"
                }`}
              >
                {tBody(b, lang)}
              </button>
            );
          })}
        </div>
      </div>

      <Divider />

      {/* ── Price from / to ── */}
      <div className="flex flex-col gap-2">
        <FieldLabel>{T.price[lang]}</FieldLabel>
        <div className="flex items-center gap-2">
          <NumberInput
            placeholder={`${PRICE_MIN.toLocaleString("en-US")}`}
            value={value.priceFrom}
            onChange={(v) => onChange({ priceFrom: v })}
          />
          <span className="h-px w-3 shrink-0 bg-line" />
          <NumberInput
            placeholder={`${PRICE_MAX.toLocaleString("en-US")}`}
            value={value.priceTo}
            onChange={(v) => onChange({ priceTo: v })}
          />
        </div>
      </div>

      <Divider />

      {/* ── Brand — logo tiles (own scroll so the panel stays short) ── */}
      <div className="flex flex-col gap-2">
        <FieldLabel>{T.brand[lang]}</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {brands.map((b) => {
            const on = value.brands.includes(b.slug);
            return (
              <button
                key={b.slug}
                onClick={() =>
                  onChange({
                    brands: toggle(value.brands, b.slug),
                    // reset model if it no longer belongs to the new brand set
                    model: "",
                  })
                }
                aria-pressed={on}
                title={`${b.name} — ${b.count} ${T.cars[lang]}`}
                className={`flex flex-col items-center gap-1 rounded-md border px-1 py-2.5 transition-all ${
                  on
                    ? "border-teal bg-teal-soft"
                    : "border-line bg-surface-2 hover:border-teal/40 hover:bg-white"
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center">
                  <FallbackImage
                    src={`/brands/${b.slug}.png`}
                    alt={`${b.name} logo`}
                    className="max-h-full max-w-full object-contain"
                    style={{ transform: `scale(${BRAND_META[b.slug]?.scale ?? 1})` }}
                  />
                </span>
                <span className="w-full truncate text-center font-body text-[10px] font-medium text-mute">
                  {b.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Divider />

      {/* ── Model ── */}
      <div className="flex flex-col gap-2">
        <FieldLabel>{T.model[lang]}</FieldLabel>
        <SelectBox
          value={value.model}
          onChange={(v) => onChange({ model: v })}
          options={[{ label: T.anyModel[lang], value: "" }, ...models.map((m) => ({ label: m, value: m }))]}
        />
      </div>

      <Divider />

      {/* ── Transmission ── */}
      <div className="flex flex-col gap-2">
        <FieldLabel>{T.transmission[lang]}</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {(["Any", "Manual", "Automatic"] as const).map((t) => {
            const on = value.transmission === t;
            return (
              <button
                key={t}
                onClick={() =>
                  onChange({ transmission: on && t !== "Any" ? "Any" : t })
                }
                aria-pressed={on}
                className={`rounded-md border px-2 py-2 font-heading text-[13px] font-medium transition-all ${
                  on
                    ? "border-teal bg-teal text-white shadow-[0_6px_16px_rgba(95,203,187,0.25)]"
                    : "border-line bg-surface-2 text-ink hover:border-teal/40 hover:bg-white"
                }`}
              >
                {t === "Any" ? T.any[lang] : tTrans(t, lang)}
              </button>
            );
          })}
        </div>
      </div>

      <Divider />

      {/* ── Year from / to ── */}
      <div className="flex flex-col gap-2">
        <FieldLabel>{T.year[lang]}</FieldLabel>
        <div className="flex items-center gap-2">
          <NumberInput
            placeholder={`${YEAR_MIN}`}
            value={value.yearFrom}
            onChange={(v) => onChange({ yearFrom: v })}
          />
          <span className="h-px w-3 shrink-0 bg-line" />
          <NumberInput
            placeholder={`${YEAR_MAX}`}
            value={value.yearTo}
            onChange={(v) => onChange({ yearTo: v })}
          />
        </div>
      </div>
    </aside>
  );
}

function Divider() {
  return <div className="my-3 h-px w-full bg-line" />;
}

function NumberInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 font-body text-sm text-ink outline-none transition-colors placeholder:text-mute/70 hover:border-teal/40 focus:border-teal nums"
    />
  );
}

function SelectBox({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-lg border border-line bg-surface-2 px-3.5 py-2.5 pr-9 font-body text-sm font-medium text-ink outline-none transition-colors hover:border-teal/40 focus:border-teal"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mute"
      />
    </div>
  );
}
