"use client";
import { MapPin, PhoneCall, AtSign, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";

const T = {
  heading: { mk: "Контактирајте нѐ", en: "Contact us" },
  copy: {
    mk: "Дојдете да ги видите автомобилите во живо или јавете се во секое време. Со задоволство ќе одговориме на прашања, ќе закажеме тест возење или ќе ви помогнеме да го најдете вистинскиот автомобил.",
    en: "Come see the cars in person or reach out any time. We're happy to answer questions, arrange a test drive, or help you find the right car.",
  },
  getInTouch: { mk: "Стапи во контакт", en: "Get in touch" },
  address: { mk: "Адреса", en: "Address" },
  callUs: { mk: "Јави се", en: "Call us" },
  sendEmail: { mk: "Испрати е-пошта", en: "Send your email" },
  country: { mk: "Северна Македонија", en: "North Macedonia" },
} as const;

// Contact band (reference photo): NOT a card. Big rounded Google Map on the LEFT,
// text + detail boxes on the RIGHT. Map is pinned to the real AVTO PLAC DADO
// location in Bitola. Sales-only business, so no booking/rent wording.
const MAP_LAT = 41.0476308;
const MAP_LNG = 21.3453394;
const MAP_EMBED = `https://maps.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=15&hl=en&output=embed`;
const MAP_LINK = `https://www.google.com/maps/place/AVTO+PLAC+DADO/@${MAP_LAT},${MAP_LNG},16z`;

export default function Contact() {
  const { lang } = useLang();
  return (
    <section id="contact" className="section-padding bg-bg">
      <div className="container-wide">
        <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Left — heading, copy, button, detail boxes */}
          <Reveal className="flex h-full flex-col justify-between">
            <div>
              <h2 className="font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                {T.heading[lang]}
              </h2>
              <p className="mt-5 max-w-xl font-body text-base leading-relaxed text-mute sm:text-lg">
                {T.copy[lang]}
              </p>

              <a
                href={`mailto:${SITE.email}`}
                className="group mt-8 inline-flex w-fit items-center gap-3 rounded-2xl bg-teal px-7 py-4 font-heading text-base font-semibold text-white transition-colors hover:bg-teal-dark"
              >
                {T.getInTouch[lang]}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white transition-transform group-hover:translate-x-0.5">
                  <ArrowRight size={16} />
                </span>
              </a>
            </div>

            {/* Detail boxes */}
            <div className="mt-12 space-y-4">
              {/* Address — full width */}
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-line bg-surface-2 p-6 transition-colors hover:border-teal/50"
              >
                <div className="flex items-center gap-2.5 text-mute">
                  <MapPin size={20} strokeWidth={1.75} className="text-teal-dark" />
                  <span className="font-heading text-base font-semibold text-ink">
                    {T.address[lang]}
                  </span>
                </div>
                <p className="mt-3 font-body text-base font-medium leading-snug text-ink">
                  {SITE.address}, {T.country[lang]}
                </p>
              </a>

              {/* Phone + Email — two columns */}
              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href={SITE.phoneHref}
                  className="block rounded-xl border border-line bg-surface-2 p-6 transition-colors hover:border-teal/50"
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
                  className="block rounded-xl border border-line bg-surface-2 p-6 transition-colors hover:border-teal/50"
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
              </div>
            </div>
          </Reveal>

          {/* Right — map */}
          <Reveal className="relative h-[24rem] overflow-hidden rounded-xl border border-line bg-ink sm:h-[30rem] lg:h-[36rem]">
            <iframe
              title={`${SITE.name} location in ${SITE.city}`}
              src={MAP_EMBED}
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
