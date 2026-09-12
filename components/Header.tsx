"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Clock, Mail, X } from "lucide-react";
import { SITE } from "@/lib/site";
import { useLang } from "./LanguageProvider";
import LangSwitch from "./LangSwitch";
import FavoritesNavButton from "./FavoritesNavButton";

const T = {
  nav: {
    home: { mk: "Почетна", en: "Home" },
    cars: { mk: "Возила", en: "Inventory" },
    contact: { mk: "Контакт", en: "Contact" },
  },
  callUs: { mk: "Јави се", en: "Call us" },
  menu: { mk: "Мени", en: "Menu" },
  closeMenu: { mk: "Затвори мени", en: "Close menu" },
  hours: {
    mk: ["Пон–Пет 10:30–17:00", "Саб 10:30–18:00 · Нед Затворено"],
    en: ["Mon–Fri 10:30–17:00", "Sat 10:30–18:00 · Sun Closed"],
  },
} as const;

function FacebookIcon({ size = 19 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { lang } = useLang();

  const links = [
    { href: "/", label: T.nav.home[lang] },
    { href: "/cars", label: T.nav.cars[lang] },
    { href: "/contact", label: T.nav.contact[lang] },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // On the home page, the top of the hero is dark (teal sky), so before the
  // white pill appears we switch to the white logo + white nav for contrast.
  const onDarkHero = pathname === "/" && !scrolled;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`mx-auto flex items-center justify-between rounded-[0.875rem] px-4 transition-all duration-300 md:px-6 ${
          scrolled
            ? "h-16 max-w-6xl border border-line bg-white/85 shadow-[0_12px_34px_rgba(17,19,24,0.10)] backdrop-blur-xl md:h-[80px]"
            : "h-16 max-w-[78rem] border border-transparent bg-transparent shadow-none md:h-[88px]"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center">
          <Image
            src={onDarkHero ? "/logo-white.png" : "/logo-light.png"}
            alt="Avto Plac Dado"
            width={505}
            height={360}
            priority
            className="h-12 w-auto transition-all duration-300 md:h-[4.125rem]"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-[0.625rem] px-4 py-2.5 font-heading text-[15px] font-medium transition-all ${
                onDarkHero
                  ? isActive(l.href)
                    ? "bg-white/15 text-white"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                  : isActive(l.href)
                    ? "bg-ink/5 text-ink"
                    : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <FavoritesNavButton onDark={onDarkHero} />
          <LangSwitch onDark={onDarkHero} />
          <a href={SITE.phoneHref} className="glow-btn hidden !rounded-[0.625rem] !px-6 !py-3 text-[15px] md:inline-flex">
            <Phone size={17} /> {T.callUs[lang]}
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/70 text-ink md:h-11 md:w-11 lg:hidden"
            aria-label={T.menu[lang]}
            aria-expanded={open}
          >
            {/* Animated hamburger → X */}
            <span className="relative block h-[14px] w-[22px]">
              <span
                className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-full -translate-y-1/2 rounded-full bg-current transition-all duration-200 ${
                  open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-full rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile / tablet menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-white lg:hidden"
          >
            {/* Top bar — centered logo + close button */}
            <div className="relative flex items-center justify-center px-5 pt-7 pb-3">
              <Image
                src="/logo-light.png"
                alt="Avto Plac Dado"
                width={505}
                height={360}
                className="h-16 w-auto"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label={T.closeMenu[lang]}
                className="absolute right-5 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-2 text-ink transition-colors hover:border-teal hover:text-teal-dark"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-1 px-5 pb-8 pt-2">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 + i * 0.05, ease: "easeOut" }}
                >
                  <Link
                    href={l.href}
                    className={`block border-b border-line px-2 py-4 font-heading text-xl font-semibold transition-colors ${
                      isActive(l.href) ? "text-teal-dark" : "text-ink hover:text-teal-dark"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href={SITE.phoneHref}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.35, ease: "easeOut" }}
                className="btn-primary mt-5 w-full !rounded-[0.75rem]"
              >
                <Phone size={18} /> {SITE.phone}
              </motion.a>

              {/* Contact details — fills out the menu */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.42, ease: "easeOut" }}
                className="mt-6 flex flex-col gap-4 rounded-[0.75rem] border border-line bg-surface-2 px-5 py-5"
              >
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${SITE.address}, ${SITE.city}, ${SITE.country}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-ink-soft transition-colors hover:text-teal-dark"
                >
                  <MapPin size={18} className="mt-0.5 shrink-0 text-teal-dark" />
                  <span className="font-body text-[15px] leading-snug">
                    {SITE.address}
                    <br />
                    {SITE.city}, {SITE.country}
                  </span>
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-3 text-ink-soft transition-colors hover:text-teal-dark"
                >
                  <Mail size={18} className="shrink-0 text-teal-dark" />
                  <span className="font-body text-[15px]">{SITE.email}</span>
                </a>
                <div className="flex items-start gap-3 text-ink-soft">
                  <Clock size={18} className="mt-0.5 shrink-0 text-teal-dark" />
                  <span className="font-body text-[15px] leading-snug">
                    {T.hours[lang][0]}
                    <br />
                    {T.hours[lang][1]}
                  </span>
                </div>
              </motion.div>

              {/* Socials */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.5, ease: "easeOut" }}
                className="mt-6 flex items-center gap-5"
              >
                <a
                  href={SITE.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-teal transition-colors hover:text-teal-dark"
                >
                  <FacebookIcon size={22} />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
