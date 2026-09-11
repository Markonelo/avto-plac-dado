"use client";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFavorites } from "./FavoritesContext";
import { useLang } from "./LanguageProvider";

const T = {
  label: { mk: "Омилени возила", en: "Saved cars" },
} as const;

/**
 * Header favourites control — a pill icon button that links to /favorites.
 * The heart fills teal once you've saved a car, and a count badge springs in
 * to show how many. Adapts to the dark hero header. Honors reduced-motion.
 */
export default function FavoritesNavButton({
  onDark = false,
  className = "",
}: {
  onDark?: boolean;
  className?: string;
}) {
  const { count } = useFavorites();
  const { lang } = useLang();
  const reduce = useReducedMotion();
  const active = count > 0;

  return (
    <Link
      href="/favorites"
      aria-label={T.label[lang]}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-[0.625rem] border transition-colors duration-200 md:h-11 md:w-11 ${
        onDark
          ? "border-white/25 text-white/85 hover:border-white/45 hover:text-white"
          : active
            ? "border-teal/50 bg-teal/10 text-teal-dark"
            : "border-line bg-white/70 text-ink-soft hover:border-teal/40 hover:text-teal-dark"
      } ${className}`}
    >
      <motion.span
        className="flex items-center justify-center"
        whileHover={reduce ? undefined : { scale: [1, 1.22, 0.94, 1.12, 1] }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Heart size={18} className={active ? "fill-current" : ""} />
      </motion.span>

      <AnimatePresence>
        {active && (
          <motion.span
            initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            transition={
              reduce
                ? { duration: 0.1 }
                : { type: "spring", stiffness: 520, damping: 24 }
            }
            className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-teal px-1 font-heading text-[11px] font-bold leading-none text-white ring-2 ring-white nums"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
