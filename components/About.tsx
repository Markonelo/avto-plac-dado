"use client";
import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import { SITE } from "@/lib/site";
import Reveal from "./Reveal";
import FallbackImage from "./FallbackImage";
import { useLang } from "./LanguageProvider";

// About Us band (reference photo): one big light card — dealership photo frame
// fills the WHOLE left; right column holds About Us heading, body, teal CTA and
// the stat row beneath it.
// TODO(client): drop a real dealership photo/video-still at
// /public/about/dealership.jpg and confirm the real stat numbers below.
const T = {
  photoSoon: { mk: "Фотографија наскоро", en: "Photo coming soon" },
  heading: { mk: "За нас", en: "About Us" },
  sub: {
    mk: "Возете паметно. Купувајте со доверба.",
    en: "Drive smarter. Buy with confidence.",
  },
  p1lead: { mk: `Во ${SITE.name}`, en: `At ${SITE.name}` },
  p1rest: {
    mk: " го правиме купувањето автомобил едноставно. Без разлика дали е вашиот прв автомобил или долгоочекувана надградба, нудиме внимателно избрана понуда на квалитетни возила по чесни, транспарентни цени — секое темелно проверено и подготвено за возење.",
    en: ", we keep buying a car simple. Whether it's your first car or a long-awaited upgrade, we offer a hand-picked selection of quality vehicles at honest, transparent prices — every one thoroughly inspected and ready to drive away.",
  },
  p2: {
    mk: `Без притисок и без изненадувања: тоа што го гледате е тоа што го плаќате. Од чиста, проверена документација до пријателски локален совет тука во ${SITE.city}, нашиот тим е со вас на секој чекор — и долго откако ќе го однесете возилото.`,
    en: `No pressure and no surprises: what you see is what you pay. From clean, verified paperwork to friendly local advice right here in ${SITE.city}, our team is with you at every step — and long after you've driven off the lot.`,
  },
  cta: { mk: "Дознајте повеќе за нас", en: "Learn more about us" },
} as const;

const STATS = [
  { value: "180+", label: { mk: "Задоволни клиенти", en: "Happy customers" } },
  { value: "50+", label: { mk: "Возила на залиха", en: "Cars in stock" } },
  { value: "200+", label: { mk: "Продадени возила", en: "Cars sold" } },
] as const;

export default function About() {
  const { lang } = useLang();
  return (
    <section className="section-padding bg-bg">
      <div className="container-wide">
        <Reveal className="overflow-hidden rounded-[0.75rem] border border-line bg-cloud p-5 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-10">
            {/* Photo frame */}
            <div className="relative min-h-[22rem] overflow-hidden rounded-[0.5rem] bg-ink sm:min-h-[30rem] lg:min-h-[38rem]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40">
                <Building2 size={56} strokeWidth={1} className="opacity-40" />
                <span className="font-body text-[11px] uppercase tracking-[0.18em]">
                  {T.photoSoon[lang]}
                </span>
              </div>
              <FallbackImage
                src="/about/dealership.jpg"
                alt={`${SITE.name} dealership in ${SITE.city}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Copy */}
            <div className="flex flex-col justify-between py-1 lg:py-2">
              <div>
                <h2 className="font-heading text-4xl font-semibold leading-none tracking-tight text-ink sm:text-5xl">
                  {T.heading[lang]}
                </h2>
                <p className="mt-3 font-heading text-lg font-medium text-ink/80">
                  {T.sub[lang]}
                </p>
                <p className="mt-6 font-body text-base leading-relaxed text-mute sm:text-lg">
                  <span className="font-semibold text-ink">{T.p1lead[lang]}</span>
                  {T.p1rest[lang]}
                </p>
                <p className="mt-4 font-body text-base leading-relaxed text-mute sm:text-lg">
                  {T.p2[lang]}
                </p>
                <Link
                  href="/about"
                  className="glow-btn mt-7 !rounded-xl !px-8 !py-4 !text-base"
                >
                  {T.cta[lang]} <ArrowUpRight size={20} />
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 divide-x divide-line border-t border-line pt-7">
                {STATS.map((s) => (
                  <div key={s.label.en} className="px-3 first:pl-0">
                    <p className="font-heading text-3xl font-semibold tracking-tight text-ink nums sm:text-[2.5rem] sm:leading-none">
                      {s.value}
                    </p>
                    <p className="mt-1.5 font-body text-xs text-mute sm:text-sm">
                      {s.label[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
