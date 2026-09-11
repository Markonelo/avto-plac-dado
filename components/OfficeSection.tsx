"use client";
import { MapPin, Clock, PhoneCall, AtSign } from "lucide-react";
import { SITE } from "@/lib/site";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";

// "Our office" section — contact page only. A large Google Map pinned to the
// real AVTO PLAC DADO lot in Bitola, with a short intro above it. Deliberately
// NO phone / email / street-address details here (those live in the hero form).

const T = {
  kicker: { mk: "Нашата локација", en: "Our office" },
  heading: { mk: "Посетете нѐ во Битола", en: "Visit Us in Bitola" },
  intro: {
    mk: "Нашиот плац се наоѓа во самото срце на Битола. Дојдете да ги разгледате автомобилите во живо, пробајте некој на тест возење или само наминете да поздравите — без потреба од закажување.",
    en: "Our lot sits right in the heart of Bitola. Come browse the cars in person, take one for a spin, or just stop by to say hello — no appointment needed.",
  },
  hours: {
    mk: "Пон–Пет 10:30–17:00 · Саб 10:30–18:00 · Недела затворено",
    en: SITE.hours,
  },
  getDirections: { mk: "Насоки до нас", en: "Get directions" },
  address: { mk: "Адреса", en: "Address" },
  country: { mk: "Северна Македонија", en: "North Macedonia" },
  callUs: { mk: "Јави се", en: "Call us" },
  sendEmail: { mk: "Испрати е-пошта", en: "Send your email" },
} as const;

const MAP_LAT = 41.0476308;
const MAP_LNG = 21.3453394;
const MAP_EMBED = `https://maps.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=15&hl=en&output=embed`;
const MAP_LINK = `https://www.google.com/maps/place/AVTO+PLAC+DADO/@${MAP_LAT},${MAP_LNG},16z`;

export default function OfficeSection() {
  const { lang } = useLang();
  return (
    <section id="office" className="section-padding bg-bg">
      <div className="container-wide">
        {/* Intro */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-lg border border-teal/40 px-4 py-1.5 font-heading text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
            {T.kicker[lang]}
          </span>
          <h2 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {T.heading[lang]}
          </h2>
          <p className="mt-5 font-body text-base leading-relaxed text-mute sm:text-lg">
            {T.intro[lang]}
          </p>

          {/* Basic info — opening hours only */}
          <div className="mt-6 inline-flex items-center gap-2.5 rounded-lg border border-line bg-surface-2 px-4 py-2.5">
            <Clock size={16} className="shrink-0 text-teal-dark" />
            <span className="font-body text-sm font-medium text-ink-soft">
              {T.hours[lang]}
            </span>
          </div>
        </Reveal>

        {/* Big map */}
        <Reveal className="relative mt-12 h-[26rem] overflow-hidden rounded-[0.75rem] border border-line bg-ink sm:h-[34rem] lg:h-[42rem]">
          <iframe
            title={`${SITE.name} location in ${SITE.city}`}
            src={MAP_EMBED}
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-[0.625rem] bg-teal px-5 py-3 font-heading text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(17,19,24,0.5)] transition-colors hover:bg-teal-dark"
          >
            <MapPin size={16} /> {T.getDirections[lang]}
          </a>
        </Reveal>

        {/* Simple detail cards */}
        <Reveal className="mt-6 grid gap-4 sm:grid-cols-3">
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[0.625rem] border border-line bg-surface-2 p-6 transition-colors hover:border-teal/50"
          >
            <div className="flex items-center gap-2.5">
              <MapPin size={20} strokeWidth={1.75} className="text-teal-dark" />
              <span className="font-heading text-base font-semibold text-ink">
                {T.address[lang]}
              </span>
            </div>
            <p className="mt-3 font-body text-base font-medium leading-snug text-ink">
              {SITE.address}, {T.country[lang]}
            </p>
          </a>

          <a
            href={SITE.phoneHref}
            className="rounded-[0.625rem] border border-line bg-surface-2 p-6 transition-colors hover:border-teal/50"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall size={20} strokeWidth={1.75} className="text-teal-dark" />
              <span className="font-heading text-base font-semibold text-ink">
                {T.callUs[lang]}
              </span>
            </div>
            <p className="mt-3 font-body text-base font-medium text-ink nums">
              {SITE.phone}
            </p>
          </a>

          <a
            href={`mailto:${SITE.email}`}
            className="rounded-[0.625rem] border border-line bg-surface-2 p-6 transition-colors hover:border-teal/50"
          >
            <div className="flex items-center gap-2.5">
              <AtSign size={20} strokeWidth={1.75} className="text-teal-dark" />
              <span className="font-heading text-base font-semibold text-ink">
                {T.sendEmail[lang]}
              </span>
            </div>
            <p className="mt-3 break-all font-body text-base font-medium text-ink">
              {SITE.email}
            </p>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
