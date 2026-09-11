"use client";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { SlidersHorizontal, X, ArrowDownWideNarrow, ChevronDown, Frown } from "lucide-react";
import { CARS } from "@/lib/cars";
import CarsFilters, { EMPTY_FILTERS, type Filters } from "./CarsFilters";
import CarCard from "./CarCard";
import { useLang } from "./LanguageProvider";

type Sort = "featured" | "price-asc" | "price-desc" | "year-desc" | "mileage-asc";

const SORTS: { label: { mk: string; en: string }; value: Sort }[] = [
  { label: { mk: "Издвоени", en: "Featured" }, value: "featured" },
  { label: { mk: "Цена: од најниска", en: "Price: low to high" }, value: "price-asc" },
  { label: { mk: "Цена: од највисока", en: "Price: high to low" }, value: "price-desc" },
  { label: { mk: "Најнов годиште", en: "Newest year" }, value: "year-desc" },
  { label: { mk: "Најмала километража", en: "Lowest mileage" }, value: "mileage-asc" },
];

const T = {
  inventory: { mk: "Возила", en: "Inventory" },
  car: { mk: "возило", en: "car" },
  cars: { mk: "возила", en: "cars" },
  available: { mk: "достапни", en: "available" },
  filters: { mk: "Филтри", en: "Filters" },
  closeFilters: { mk: "Затвори филтри", en: "Close filters" },
  noMatch: { mk: "Ниту едно возило не одговара на филтрите", en: "No cars match your filters" },
  noMatchCopy: {
    mk: "Проширете го опсегот на цена или годиште, или отстранете некој филтер.",
    en: "Try widening your price or year range, or clearing a filter.",
  },
  clearAll: { mk: "Исчисти ги сите филтри", en: "Clear all filters" },
  show: { mk: "Прикажи", en: "Show" },
} as const;

export default function CarsInventory() {
  const { lang } = useLang();
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<Sort>("featured");
  const [drawer, setDrawer] = useState(false);

  // Keep the view anchored to the top of the inventory whenever the filters
  // change — otherwise a shorter result list can leave the page scrolled down
  // by the footer, which reads as "it jumped to the bottom".
  const topRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const el = topRef.current;
    if (!el) return;
    // Wait for the (now shorter) list to lay out, then recompute Lenis'
    // dimensions — otherwise its cached scroll limit is stale and it refuses
    // to move — and scroll to the inventory top by absolute position.
    const raf = requestAnimationFrame(() => {
      const y = el.getBoundingClientRect().top + window.scrollY - 110;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(y, { force: true });
      } else {
        window.scrollTo({ top: Math.max(y, 0), behavior: "smooth" });
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [filters, lenis]);

  // Seed brand filter from ?make= (BrandsCard on the home page links here).
  useEffect(() => {
    const make = params.get("make");
    if (!make) return;
    const slug = CARS.find((c) => c.make.toLowerCase() === make.toLowerCase())?.brandSlug;
    if (slug) setFilters((f) => ({ ...f, brands: [slug] }));
  }, [params]);

  const patch = (p: Partial<Filters>) => setFilters((f) => ({ ...f, ...p }));

  // ── Custom scrollbar for the desktop filters sidebar ──
  // Native scrollbar styling is unreliable across browsers (Firefox/Zen ignore
  // ::-webkit-scrollbar sizing), so we hide it and draw our own short, wide,
  // draggable teal pill on the left edge.
  const THUMB_H = 234; // fixed pill height (px)
  const TRACK_PAD = 8; // inset from top/bottom (matches inset-y-2)
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startScroll: number } | null>(null);
  const [bar, setBar] = useState({ show: false, top: 0 });
  const [dragging, setDragging] = useState(false);

  const recalcBar = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const range = el.scrollHeight - el.clientHeight;
    if (range <= 4) {
      setBar((b) => (b.show ? { ...b, show: false } : b));
      return;
    }
    const travel = el.clientHeight - TRACK_PAD * 2 - THUMB_H;
    const top = (el.scrollTop / range) * Math.max(travel, 0);
    setBar({ show: true, top });
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(recalcBar);
    window.addEventListener("resize", recalcBar);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", recalcBar);
    };
  }, [recalcBar]);

  const onThumbDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    dragRef.current = { startY: e.clientY, startScroll: el.scrollTop };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onThumbMove = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!dragRef.current || !el) return;
    const travel = el.clientHeight - TRACK_PAD * 2 - THUMB_H;
    const range = el.scrollHeight - el.clientHeight;
    const dy = e.clientY - dragRef.current.startY;
    el.scrollTop = dragRef.current.startScroll + (dy / Math.max(travel, 1)) * range;
  };
  const onThumbUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    setDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const pFrom = filters.priceFrom ? Number(filters.priceFrom) : -Infinity;
    const pTo = filters.priceTo ? Number(filters.priceTo) : Infinity;
    const yFrom = filters.yearFrom ? Number(filters.yearFrom) : -Infinity;
    const yTo = filters.yearTo ? Number(filters.yearTo) : Infinity;

    const list = CARS.filter((c) => {
      if (q) {
        const hay = `${c.name} ${c.make} ${c.model} ${c.body} ${c.fuel}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.bodies.length && !filters.bodies.includes(c.body)) return false;
      if (filters.brands.length && !filters.brands.includes(c.brandSlug)) return false;
      if (filters.model && c.model !== filters.model) return false;
      if (filters.transmission !== "Any" && c.transmission !== filters.transmission) return false;
      if (c.price < pFrom || c.price > pTo) return false;
      if (c.year < yFrom || c.year > yTo) return false;
      return true;
    });

    const sorted = [...list];
    switch (sort) {
      case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
      case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
      case "year-desc": sorted.sort((a, b) => b.year - a.year); break;
      case "mileage-asc": sorted.sort((a, b) => a.mileage - b.mileage); break;
      default: sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [filters, sort]);

  return (
    <section className="section-padding bg-cloud">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div ref={topRef} className="scroll-mt-28" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[20rem_1fr] lg:gap-10">
          {/* ── Sidebar (desktop) — custom short teal pill scrollbar on the left ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="relative">
                <div
                  ref={scrollRef}
                  onScroll={recalcBar}
                  data-lenis-prevent
                  className="no-scrollbar max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-[0.625rem] border border-line bg-surface"
                >
                  <CarsFilters value={filters} onChange={patch} resultCount={filtered.length} bare />
                </div>

                {/* Custom draggable scrollbar */}
                {bar.show && (
                  <div
                    className="absolute inset-y-2 left-1.5 w-1"
                    aria-hidden
                  >
                    <div
                      onPointerDown={onThumbDown}
                      onPointerMove={onThumbMove}
                      onPointerUp={onThumbUp}
                      style={{ height: THUMB_H, transform: `translateY(${bar.top}px)` }}
                      className={`w-full cursor-grab touch-none rounded-full bg-teal hover:bg-teal-dark active:cursor-grabbing ${
                        dragging
                          ? "transition-colors"
                          : "transition-[transform,background-color] duration-300 ease-out"
                      }`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Main column ── */}
          <div>
            {/* Toolbar */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
                  {T.inventory[lang]}
                </h2>
                <p className="mt-0.5 font-body text-sm text-mute nums">
                  {filtered.length} {filtered.length === 1 ? T.car[lang] : T.cars[lang]} {T.available[lang]}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="relative">
                  <ArrowDownWideNarrow
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute"
                  />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    className="cursor-pointer appearance-none rounded-lg border border-line bg-surface py-2.5 pl-9 pr-9 font-body text-sm font-medium text-ink outline-none transition-colors hover:border-teal/40 focus:border-teal"
                  >
                    {SORTS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label[lang]}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mute"
                  />
                </div>

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setDrawer(true)}
                  className="flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 font-heading text-sm font-medium text-ink transition-colors hover:border-teal/40 lg:hidden"
                >
                  <SlidersHorizontal size={15} /> {T.filters[lang]}
                </button>
              </div>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[0.625rem] border border-dashed border-line bg-surface py-20 text-center">
                <Frown size={40} strokeWidth={1.25} className="text-mute/50" />
                <p className="mt-4 font-heading text-lg font-semibold text-ink">
                  {T.noMatch[lang]}
                </p>
                <p className="mt-1 max-w-xs font-body text-sm text-mute">
                  {T.noMatchCopy[lang]}
                </p>
                <button
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="mt-5 rounded-lg bg-teal px-5 py-2.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
                >
                  {T.clearAll[lang]}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
              onClick={() => setDrawer(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-cloud shadow-2xl"
            >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-heading text-base font-semibold text-ink">{T.filters[lang]}</span>
              <button
                onClick={() => setDrawer(false)}
                aria-label={T.closeFilters[lang]}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink transition-colors hover:border-teal/40"
              >
                <X size={17} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <CarsFilters value={filters} onChange={patch} resultCount={filtered.length} />
            </div>
            <div className="border-t border-line p-4">
              <button
                onClick={() => setDrawer(false)}
                className="w-full rounded-lg bg-teal px-5 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
              >
                {T.show[lang]} {filtered.length} {filtered.length === 1 ? T.car[lang] : T.cars[lang]}
              </button>
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
