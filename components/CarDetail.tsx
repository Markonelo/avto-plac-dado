"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  Car as CarIcon,
  Palette,
  Leaf,
  Zap,
  FileCheck2,
  Phone,
  AtSign,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { Car } from "@/lib/cars";
import { BRAND_META } from "@/lib/cars";
import { SITE } from "@/lib/site";
import FallbackImage from "./FallbackImage";
import CarCard from "./CarCard";
import { useLang } from "./LanguageProvider";
import {
  tFuel,
  tTrans,
  tBody,
  tColor,
  tFeature,
  tRegistration,
  tPower,
  carDescription,
} from "@/lib/i18n";

const T = {
  backToInventory: { mk: "Назад кон возилата", en: "Back to inventory" },
  photoSoon: { mk: "Фотографија наскоро", en: "Photo coming soon" },
  fullscreen: { mk: "Цел екран", en: "Fullscreen" },
  prevPhoto: { mk: "Претходна фотографија", en: "Previous photo" },
  nextPhoto: { mk: "Следна фотографија", en: "Next photo" },
  viewPhoto: { mk: "Прикажи фотографија", en: "View photo" },
  price: { mk: "Цена", en: "Price" },
  callUs: { mk: "Јави се", en: "Call us" },
  emailUs: { mk: "Испрати е-пошта", en: "Email us" },
  buyThisCar: { mk: "Купи го ова возило", en: "Buy this car" },
  aboutCar: { mk: "За ова возило", en: "About this car" },
  equipment: { mk: "Опрема и карактеристики", en: "Equipment & features" },
  techSpecs: { mk: "Технички спецификации", en: "Technical specifications" },
  availableNow: { mk: "Достапно сега", en: "Available now" },
  docsReady: {
    mk: "Документацијата е подготвена за регистрација",
    en: "Documentation ready for registration",
  },
  moreStock: { mk: "Уште возила", en: "More stock" },
  moreCars: { mk: "Уште возила за разгледување", en: "More cars to check out" },
  viewAll: { mk: "Види ги сите", en: "View all" },
  closeFullscreen: { mk: "Затвори цел екран", en: "Close fullscreen" },
  zoomIn: { mk: "Зголеми", en: "Zoom in" },
  zoomOut: { mk: "Намали", en: "Zoom out" },
  // quick spec + tech spec labels
  year: { mk: "Година", en: "Year" },
  mileage: { mk: "Километража", en: "Mileage" },
  fuel: { mk: "Гориво", en: "Fuel" },
  transmission: { mk: "Менувач", en: "Transmission" },
  body: { mk: "Каросерија", en: "Body" },
  power: { mk: "Моќност", en: "Power" },
  colour: { mk: "Боја", en: "Colour" },
  emission: { mk: "Емисија", en: "Emission" },
  make: { mk: "Марка", en: "Make" },
  model: { mk: "Модел", en: "Model" },
  bodyStyle: { mk: "Тип на каросерија", en: "Body style" },
  fuelType: { mk: "Тип на гориво", en: "Fuel type" },
  enginePower: { mk: "Моќност на мотор", en: "Engine power" },
  emissionClass: { mk: "Стандард на емисија", en: "Emission class" },
  registration: { mk: "Регистрација", en: "Registration" },
} as const;

// ── Individual car detail page ────────────────────────────────────────────
// 1) Hero: a framed photo gallery on a dark panel, with the price bottom-left
//    and the name bottom-right beneath the frame, plus a "Buy this car" CTA.
// 2) Details: quick spec cards + generated description + full technical specs
//    on the left, with a STICKY enquiry card that scrolls along on the right.
// 3) "More cars to check out" — three related CarCards.
export default function CarDetail({
  car,
  related,
}: {
  car: Car;
  related: Car[];
}) {
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(1);
  // Point the image zooms toward (defaults to centre until the user clicks).
  const [origin, setOrigin] = useState("50% 50%");
  const brand = BRAND_META[car.brandSlug];
  const total = car.images.length;

  // Throttle photo navigation: a single physical click can register more than
  // once, and because the swap is instant that skips photos (1 → 3 → 5). Ignore
  // any nav that lands within the cooldown of the previous one, so one click
  // always moves exactly one photo.
  const lastNav = useRef(0);
  const NAV_COOLDOWN = 350; // ms between accepted photo changes
  const go = (dir: 1 | -1) => {
    const now = Date.now();
    if (now - lastNav.current < NAV_COOLDOWN) return;
    lastNav.current = now;
    setActive((i) => (i + dir + total) % total);
    setZoom(1);
    setOrigin("50% 50%");
  };
  const openLightbox = () => {
    setZoom(1);
    setOrigin("50% 50%");
    setLightbox(true);
  };
  const zoomIn = () => setZoom((z) => Math.min(z + 0.5, 4));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.5, 1));

  // Preload the whole gallery up-front so flicking through photos is instant —
  // no blank frame while the next file decodes (which reads as "skipping").
  useEffect(() => {
    car.images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [car.images]);

  // Fullscreen viewer: lock scroll + wire up keyboard (Esc / ← / →).
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, total]);

  const priceStr = `€${car.price.toLocaleString("en-US")}`;

  const kmStr = `${car.mileage.toLocaleString("en-US")} km`;

  // Quick spec cards (the clean grey cards under the hero).
  const quick = [
    { icon: Calendar, label: T.year[lang], value: String(car.year) },
    { icon: Gauge, label: T.mileage[lang], value: kmStr },
    { icon: Fuel, label: T.fuel[lang], value: tFuel(car.fuel, lang) },
    { icon: Settings2, label: T.transmission[lang], value: tTrans(car.transmission, lang) },
    { icon: CarIcon, label: T.body[lang], value: tBody(car.body, lang) },
    { icon: Zap, label: T.power[lang], value: tPower(car, lang) },
    { icon: Palette, label: T.colour[lang], value: tColor(car.color, lang) },
    { icon: Leaf, label: T.emission[lang], value: car.euro || "—" },
  ];

  // Full technical spec rows.
  const techSpecs: [string, string][] = [
    [T.make[lang], car.make],
    [T.model[lang], car.model],
    [T.year[lang], String(car.year)],
    [T.bodyStyle[lang], tBody(car.body, lang)],
    [T.mileage[lang], kmStr],
    [T.fuelType[lang], tFuel(car.fuel, lang)],
    [T.transmission[lang], tTrans(car.transmission, lang)],
    [T.enginePower[lang], tPower(car, lang)],
    [T.colour[lang], tColor(car.color, lang)],
    [T.emissionClass[lang], car.euro || "—"],
    [T.registration[lang], car.registration ? tRegistration(car.registration, lang) : "—"],
  ];

  const mailSubject =
    lang === "mk"
      ? `Прашање: ${car.name} (${car.year}) — ${priceStr}`
      : `Enquiry: ${car.name} (${car.year}) — ${priceStr}`;
  const mailBody =
    lang === "mk"
      ? `Здраво ${SITE.name},\n\nЗаинтересиран сум за ${car.name} (${car.year}) огласен на ${priceStr}.\nДали може да ми кажете повеќе / да закажеме преглед?\n\nБлагодарам!`
      : `Hi ${SITE.name},\n\nI'm interested in the ${car.year} ${car.name} listed at ${priceStr}.\nCould you tell me more / arrange a viewing?\n\nThank you!`;
  const mailHref = `mailto:${SITE.email}?subject=${encodeURIComponent(
    mailSubject
  )}&body=${encodeURIComponent(mailBody)}`;

  return (
    <>
      {/* ═══════════ 1 · HERO — framed gallery ═══════════ */}
      <section className="bg-surface pt-20 sm:pt-24">
        <div className="relative overflow-hidden">
          {/* Light backdrop */}
          <div className="absolute inset-0 bg-surface" />
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.5]" />

          <div className="relative z-10 px-4 py-6 sm:px-8 sm:py-8 lg:px-14 lg:py-10">
            {/* Breadcrumb */}
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 font-heading text-[13px] font-medium text-ink-soft transition-colors hover:text-teal-dark"
            >
              <ArrowLeft size={15} /> {T.backToInventory[lang]}
            </Link>

            {/* ── Framed gallery card ── */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mx-auto mt-4 max-w-5xl"
            >
              <div className="rounded-[1rem] border border-line bg-cloud-2 p-2.5 shadow-[0_24px_60px_-28px_rgba(17,19,24,0.35)] sm:p-3">
                {/* Main photo */}
                <div
                  onClick={openLightbox}
                  className="group relative aspect-[16/9] cursor-zoom-in overflow-hidden rounded-[0.7rem] bg-[radial-gradient(120%_120%_at_50%_20%,#f4f7f8_0%,#e2e9ec_100%)]"
                >
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-mute">
                    <CarIcon size={52} strokeWidth={1} className="opacity-25" />
                    <span className="font-body text-[10px] uppercase tracking-[0.18em] opacity-45">
                      {T.photoSoon[lang]}
                    </span>
                  </div>

                  <FallbackImage
                    src={car.images[active]}
                    alt={`${car.name} — photo ${active + 1}`}
                    className="absolute inset-0 z-[1] h-full w-full object-cover"
                  />

                  {/* Fullscreen hint — appears on hover */}
                  <span className="pointer-events-none absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-lg bg-ink/70 px-2.5 py-1.5 font-heading text-[11px] font-medium text-white opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <Maximize2 size={13} /> {T.fullscreen[lang]}
                  </span>

                  {/* Photo counter */}
                  {total > 1 && (
                    <span className="absolute right-3 top-3 z-10 rounded-lg bg-ink/70 px-2.5 py-1 font-heading text-[11px] font-semibold text-white backdrop-blur-sm nums">
                      {active + 1} / {total}
                    </span>
                  )}

                  {/* Prev / next arrows */}
                  {total > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          go(-1);
                        }}
                        aria-label={T.prevPhoto[lang]}
                        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/85 text-ink opacity-100 shadow-md backdrop-blur-sm transition-all hover:border-teal/50 hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          go(1);
                        }}
                        aria-label={T.nextPhoto[lang]}
                        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/85 text-ink opacity-100 shadow-md backdrop-blur-sm transition-all hover:border-teal/50 hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {total > 1 && (
                  <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto">
                    {car.images.map((src, i) => (
                      <button
                        key={src}
                        onClick={() => setActive(i)}
                        aria-label={`${T.viewPhoto[lang]} ${i + 1}`}
                        className={`relative aspect-[4/3] h-16 shrink-0 overflow-hidden rounded-lg border-2 bg-cloud-2 transition-all ${
                          i === active
                            ? "border-teal"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <FallbackImage
                          src={src}
                          alt={`${car.name} thumbnail ${i + 1}`}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Caption row: name + spec + price left · actions right ── */}
              <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
                <div className="min-w-0">
                  <h1 className="font-heading text-4xl font-semibold tracking-tight text-ink sm:text-[2.75rem]">
                    {car.name}
                  </h1>
                  <p className="mt-2 font-body text-base font-medium text-mute">
                    {tBody(car.body, lang)} · {brand?.name ?? car.make} · {car.year}
                  </p>
                  <p className="mt-5 flex items-baseline gap-1.5">
                    <span className="font-body text-[13px] font-medium text-mute">
                      {T.price[lang]}
                    </span>
                    <span className="font-heading text-4xl font-semibold text-teal-dark nums sm:text-5xl">
                      {priceStr}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={SITE.phoneHref}
                    aria-label={T.callUs[lang]}
                    className="flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-surface text-ink shadow-sm transition-colors hover:border-teal/50 hover:text-teal-dark"
                  >
                    <Phone size={20} />
                  </a>
                  <a
                    href={mailHref}
                    aria-label={T.emailUs[lang]}
                    className="flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-surface text-ink shadow-sm transition-colors hover:border-teal/50 hover:text-teal-dark"
                  >
                    <AtSign size={20} />
                  </a>
                  <a
                    href={mailHref}
                    className="inline-flex items-center gap-2 rounded-xl border border-teal bg-teal px-6 py-3.5 font-heading text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-teal-dark hover:border-teal-dark"
                  >
                    {T.buyThisCar[lang]}
                    <ArrowRight size={17} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ 2 · DETAILS (specs + sticky enquiry) ═══════════ */}
      <section className="section-padding bg-cloud">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10">
            {/* ── Left column: flowing content ── */}
            <div className="min-w-0">
              {/* Quick spec cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {quick.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-line bg-surface-2 p-4"
                  >
                    <s.icon size={18} className="text-teal-dark" />
                    <span className="mt-3 block font-body text-[11px] font-medium uppercase tracking-[0.13em] text-mute">
                      {s.label}
                    </span>
                    <span className="mt-1 block font-heading text-[15px] font-semibold text-ink nums">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mt-10">
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-ink">
                  {T.aboutCar[lang]}
                </h2>
                <p className="mt-4 max-w-2xl font-body text-[15px] leading-relaxed text-ink-soft">
                  {carDescription(car, lang)}
                </p>
              </div>

              {/* Features / equipment */}
              {car.features.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-heading text-2xl font-semibold tracking-tight text-ink">
                    {T.equipment[lang]}
                  </h2>
                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {car.features.map((f) => (
                      <li
                        key={f}
                        className="inline-flex items-center rounded-lg border border-line bg-surface px-3.5 py-2 font-body text-[14px] font-medium text-ink-soft transition-colors hover:border-teal/40 hover:text-teal-dark"
                      >
                        {tFeature(f, lang)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical specifications */}
              <div className="mt-10">
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-ink">
                  {T.techSpecs[lang]}
                </h2>
                <dl className="mt-4 overflow-hidden rounded-xl border border-line bg-surface">
                  {techSpecs.map(([k, v], i) => (
                    <div
                      key={k}
                      className={`flex items-center justify-between gap-4 px-4 py-3.5 ${
                        i % 2 ? "bg-surface" : "bg-surface-2"
                      }`}
                    >
                      <dt className="font-body text-[13px] font-medium uppercase tracking-[0.1em] text-mute">
                        {k}
                      </dt>
                      <dd className="text-right font-heading text-[15px] font-semibold text-ink nums">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* ── Right column: STICKY enquiry card ── */}
            <aside className="lg:relative">
              <div className="lg:sticky lg:top-24">
                <div className="rounded-[0.9rem] border border-line bg-surface p-6 shadow-[0_18px_44px_-20px_rgba(17,19,24,0.25)]">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-teal/40 px-3 py-1 font-heading text-[11px] font-medium uppercase tracking-[0.18em] text-teal-dark">
                    <ShieldCheck size={13} /> {T.availableNow[lang]}
                  </span>

                  <h3 className="mt-4 font-heading text-xl font-semibold tracking-tight text-ink">
                    {car.name}
                  </h3>
                  <p className="mt-1 font-body text-base font-medium text-mute nums">
                    {car.year}
                  </p>

                  <p className="mt-4 font-heading text-4xl font-semibold text-teal-dark nums">
                    {priceStr}
                  </p>

                  <div className="mt-5 flex flex-col gap-2.5">
                    <a href={mailHref} className="glow-btn !rounded-xl w-full">
                      {T.buyThisCar[lang]}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </a>
                    <a href={SITE.phoneHref} className="btn-ghost !rounded-xl w-full">
                      <Phone size={16} /> {SITE.phone}
                    </a>
                    <a href={mailHref} className="btn-ghost !rounded-xl w-full">
                      <AtSign size={16} /> {T.emailUs[lang]}
                    </a>
                  </div>

                  <div className="mt-5 space-y-2.5 border-t border-line pt-5">
                    <p className="flex items-start gap-2.5 font-body text-[13px] text-ink-soft">
                      <FileCheck2 size={16} className="mt-px shrink-0 text-teal-dark" />
                      {car.registration ? tRegistration(car.registration, lang) : T.docsReady[lang]}
                    </p>
                    <p className="flex items-start gap-2.5 font-body text-[13px] text-ink-soft">
                      <MapPin size={16} className="mt-px shrink-0 text-teal-dark" />
                      {SITE.address}, {SITE.city}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ═══════════ 3 · MORE CARS ═══════════ */}
      {related.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container-wide">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-lg border border-teal/40 px-4 py-1.5 font-heading text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
                  {T.moreStock[lang]}
                </span>
                <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {T.moreCars[lang]}
                </h2>
              </div>
              <Link
                href="/cars"
                className="hidden shrink-0 items-center gap-1.5 font-heading text-sm font-semibold text-teal-dark transition-colors hover:text-teal sm:inline-flex"
              >
                {T.viewAll[lang]} <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CarCard key={c.id} car={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ FULLSCREEN VIEWER ═══════════ */}
      <AnimatePresence>
        {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={() => setLightbox(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-sm"
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(false)}
            aria-label={T.closeFullscreen[lang]}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          {total > 1 && (
            <span className="absolute left-1/2 top-5 z-10 -translate-x-1/2 rounded-lg bg-white/10 px-3 py-1 font-heading text-[12px] font-semibold text-white nums">
              {active + 1} / {total}
            </span>
          )}

          {/* Image + mobile arrows — clicking the empty area closes the viewer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none relative flex h-full w-full flex-col items-center justify-center gap-4 px-2 py-6 sm:p-16"
          >
            {/* Image box — hugs the photo and clips the zoom overflow */}
            <div className="flex max-h-[calc(100%-5rem)] min-h-0 items-center justify-center overflow-hidden sm:max-h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={car.images[active]}
                alt={`${car.name} — photo ${active + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  // Toggle zoom, and when zooming in, zoom toward the click point.
                  // On zoom-out we keep the same origin so the image scales back
                  // to the exact point it grew from (no mid-animation jump).
                  if (zoom > 1) {
                    setZoom(1);
                  } else {
                    const r = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - r.left) / r.width) * 100;
                    const y = ((e.clientY - r.top) / r.height) * 100;
                    setOrigin(`${x}% ${y}%`);
                    setZoom(2);
                  }
                }}
                style={{ transform: `scale(${zoom})`, transformOrigin: origin }}
                className={`pointer-events-auto max-h-full max-w-full select-none rounded-[0.7rem] object-contain shadow-2xl transition-transform duration-200 ${
                  zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
              />
            </div>

            {/* Toolbar directly under the photo (mobile only):
                prev · zoom · next */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`pointer-events-auto flex w-full items-center gap-3 sm:hidden ${
                total > 1 ? "justify-between" : "justify-center"
              }`}
            >
              {total > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  aria-label={T.prevPhoto[lang]}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal text-white shadow-lg transition-colors hover:bg-teal-dark"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 p-1.5 backdrop-blur-sm">
                <button
                  onClick={zoomOut}
                  disabled={zoom <= 1}
                  aria-label={T.zoomOut[lang]}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ZoomOut size={19} />
                </button>
                <span className="min-w-[3.25rem] text-center font-heading text-sm font-semibold text-white nums">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={zoom >= 4}
                  aria-label={T.zoomIn[lang]}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ZoomIn size={19} />
                </button>
              </div>
              {total > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  aria-label={T.nextPhoto[lang]}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal text-white shadow-lg transition-colors hover:bg-teal-dark"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Prev / next — desktop side arrows */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label={T.prevPhoto[lang]}
                className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl bg-teal text-white shadow-lg transition-colors hover:bg-teal-dark sm:flex"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label={T.nextPhoto[lang]}
                className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl bg-teal text-white shadow-lg transition-colors hover:bg-teal-dark sm:flex"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Zoom controls — desktop only (mobile has them in the toolbar) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 rounded-xl border border-white/15 bg-white/10 p-1.5 backdrop-blur-sm sm:flex"
          >
            <button
              onClick={zoomOut}
              disabled={zoom <= 1}
              aria-label={T.zoomOut[lang]}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ZoomOut size={19} />
            </button>
            <span className="min-w-[3.25rem] text-center font-heading text-sm font-semibold text-white nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoom >= 4}
              aria-label={T.zoomIn[lang]}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ZoomIn size={19} />
            </button>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
