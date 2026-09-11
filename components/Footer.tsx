"use client";
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";
import { useLang } from "./LanguageProvider";

// Footer (reference photo): a rounded light panel — a slightly-darker white so
// the section headings can be teal. LEFT = logo, intro copy, then the site map
// (no search box). RIGHT = Address / Open / Phone / Close in a 2×2 grid with a
// small map underneath. Bottom hairline: legal entity left, clean icons right.
const MAP_LAT = 41.0476308;
const MAP_LNG = 21.3453394;
const MAP_EMBED = `https://maps.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=15&hl=en&output=embed`;
const MAP_LINK = `https://www.google.com/maps/place/AVTO+PLAC+DADO/@${MAP_LAT},${MAP_LNG},16z`;

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2h3.3l-7.2 8.24L23.5 22h-6.6l-5.18-6.77L5.8 22H2.5l7.7-8.8L2 2h6.77l4.68 6.19L18.9 2Zm-1.16 18h1.83L7.35 3.9H5.4L17.74 20Z" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const T = {
  intro: {
    mk: "Доверлив автосалон во Битола. Чесни, транспарентни цени и внимателно избрани возила — секој чекор од купувањето поедноставен и јасен.",
    en: "A trusted car dealership in Bitola, North Macedonia. Honest, upfront pricing and hand-picked cars — every step of buying made simple and transparent.",
  },
  siteMap: { mk: "Мапа на страницата", en: "Site map" },
  address: { mk: "Адреса", en: "Address" },
  open: { mk: "Работно време", en: "Open" },
  phone: { mk: "Телефон", en: "Phone" },
  closed: { mk: "Затворено", en: "Close" },
  hoursOpen: {
    mk: ["Пон – Пет · 10:30 – 17:00", "Саб · 10:30 – 18:00"],
    en: ["Mon – Fri · 10:30 – 17:00", "Sat · 10:30 – 18:00"],
  },
  sundayClosed: { mk: "Недела · Затворено", en: "Sunday · Closed" },
  country: { mk: "Северна Македонија", en: "North Macedonia" },
  rights: { mk: "Сите права задржани.", en: "All rights reserved." },
  madeBy: { mk: "Изработено од", en: "Made by" },
  privacy: { mk: "Политика за приватност", en: "Privacy Policy" },
  terms: { mk: "Услови за користење", en: "Terms of Service" },
  links: {
    home: { mk: "Почетна", en: "Home" },
    cars: { mk: "Возила", en: "Inventory" },
    contact: { mk: "Контакт", en: "Contact" },
    directions: { mk: "Насоки", en: "Directions" },
    call: { mk: "Јави се", en: "Call Us" },
  },
} as const;

export default function Footer() {
  const { lang } = useLang();

  const SITEMAP: { label: string; href: string; external?: boolean }[] = [
    { label: T.links.home[lang], href: "/" },
    { label: T.links.cars[lang], href: "/cars" },
    { label: T.links.contact[lang], href: "#contact" },
    { label: T.links.directions[lang], href: MAP_LINK, external: true },
    { label: T.links.call[lang], href: SITE.phoneHref },
  ];

  const socials = [
    { Icon: XIcon, href: SITE.x, label: "X" },
    { Icon: FacebookIcon, href: SITE.facebook, label: "Facebook" },
    { Icon: InstagramIcon, href: SITE.instagram, label: "Instagram" },
  ];

  return (
    <footer className="bg-bg px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="relative w-full overflow-hidden rounded-[1.25rem] bg-ink">
        {/* soft teal glow rising from the bottom — even across the full width */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-[linear-gradient(to_top,rgba(95,203,187,0.16),transparent)]" />

        <div className="container-wide relative py-12 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* ── LEFT — brand, copy, site map ── */}
            <div>
              <Image
                src="/logo-white.png"
                alt="Avto Plac Dado"
                width={360}
                height={360}
                className="h-14 w-auto"
              />

              <p className="mt-6 max-w-md font-body text-base leading-relaxed text-white/75 sm:text-lg">
                {T.intro[lang]}
              </p>

              <p className="mt-8 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                {T.siteMap[lang]}
              </p>
              <div className="mt-4 grid max-w-md grid-cols-2 gap-x-8 gap-y-3 font-body text-base">
                {SITEMAP.map((l) =>
                  l.external ? (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white transition-colors hover:text-teal"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      key={l.label}
                      href={l.href}
                      className="text-white transition-colors hover:text-teal"
                    >
                      {l.label}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* ── RIGHT — Address / Open / Phone / Close + map ── */}
            <div>
              <div className="grid grid-cols-2 gap-x-10 gap-y-7">
                <div>
                  <h4 className="font-heading text-lg font-semibold !text-teal">{T.address[lang]}</h4>
                  <a
                    href={MAP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block font-body text-base leading-relaxed text-white/75 transition-colors hover:text-teal"
                  >
                    {SITE.address}
                    <br />
                    {T.country[lang]}
                  </a>
                </div>

                <div>
                  <h4 className="font-heading text-lg font-semibold !text-teal">{T.open[lang]}</h4>
                  <p className="mt-2 font-body text-base leading-relaxed text-white/75">
                    {T.hoursOpen[lang][0]}
                    <br />
                    {T.hoursOpen[lang][1]}
                  </p>
                </div>

                <div>
                  <h4 className="font-heading text-lg font-semibold !text-teal">{T.phone[lang]}</h4>
                  <a
                    href={SITE.phoneHref}
                    className="mt-2 block font-body text-base text-white/75 transition-colors hover:text-teal nums"
                  >
                    {SITE.phone}
                  </a>
                </div>

                <div>
                  <h4 className="font-heading text-lg font-semibold !text-teal">{T.closed[lang]}</h4>
                  <p className="mt-2 font-body text-base text-white/75">{T.sundayClosed[lang]}</p>
                </div>
              </div>

              {/* small map under the info */}
              <div className="mt-7 h-36 overflow-hidden rounded-lg border border-white/10 sm:h-40">
                <iframe
                  title={`${SITE.name} location in ${SITE.city}`}
                  src={MAP_EMBED}
                  className="h-full w-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* ── Bottom hairline — copyright + credit left, legal links & socials right ── */}
          <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="font-body text-sm text-white/50">
                © {new Date().getFullYear()} {SITE.legalName}. {T.rights[lang]}
              </p>
              <p className="mt-1.5 font-body text-xs text-white/35">
                {T.madeBy[lang]}{" "}
                <span className="font-medium text-white/60">CoreLab</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 sm:items-end">
              <div className="flex items-center gap-6">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-white/60 transition-colors hover:text-teal"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-4 font-body text-sm">
                <Link
                  href="/privacy-policy"
                  className="text-white/50 transition-colors hover:text-teal"
                >
                  {T.privacy[lang]}
                </Link>
                <span className="h-3 w-px bg-white/15" />
                <Link
                  href="/terms"
                  className="text-white/50 transition-colors hover:text-teal"
                >
                  {T.terms[lang]}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
