"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, Phone, Mail } from "lucide-react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";

// Structura-style "FAQ experience": a horizontal expanding carousel. The active
// card is wide + filled (teal, white text) and shows the question AND answer;
// the rest stay narrow + light and show only the question, fading toward the
// right edge. Prev/next arrows (and clicking a card) move the active card.
// On mobile this collapses to a classic stacked accordion.

const T = {
  heading: {
    mk: ["Често", "поставувани", "прашања"],
    en: ["Frequently", "Asked", "Questions"],
  },
  intro: {
    mk: "Одговори на прашањата што најчесто ги слушаме — тест возења, старо за ново, документација и сѐ помеѓу.",
    en: "Find answers to the questions we hear most — test drives, trade-ins, paperwork and everything in between.",
  },
  prevAria: { mk: "Претходно прашање", en: "Previous question" },
  nextAria: { mk: "Следно прашање", en: "Next question" },
  stillCurious: { mk: "Сѐ уште љубопитни?", en: "Still curious?" },
  moreQ: { mk: ["Имате уште", "прашања?"], en: ["Got more", "questions?"] },
  moreCopy: {
    mk: "Не го најдовте она што го барате? Јавете се и брзо ќе ви одговориме.",
    en: "Can't find what you're looking for? Reach out and we'll get right back to you.",
  },
  moreQShort: { mk: "Имате уште прашања?", en: "Got more questions?" },
  showContact: { mk: "Прикажи контакт панел", en: "Show contact panel" },
  showQuestion: { mk: "Прикажи прашање", en: "Show question" },
} as const;

const FAQS: { q: { mk: string; en: string }; a: { mk: string; en: string } }[] = [
  {
    q: {
      mk: "Можам ли да пробам возење пред да купам?",
      en: "Can I test drive a car before I buy it?",
    },
    a: {
      mk: "Секако. Секое возило на нашиот плац е достапно за тест возење. Дојдете, понесете возачка дозвола и одвојте колку што ви треба за да се уверите дека автомобилот е вистинскиот пред да одлучите.",
      en: "Absolutely. Every car on our lot is available for a test drive. Come by, bring your licence, and take as long as you need to make sure the car feels right before you commit.",
    },
  },
  {
    q: {
      mk: "Дали автомобилите доаѓаат со гаранција?",
      en: "Do your cars come with any guarantee?",
    },
    a: {
      mk: "Секој автомобил е целосно проверен и доаѓа со документирана историја. Отворени сме за состојбата и нудиме кратка механичка гаранција на возилата што исполнуваат услови, за да возите безгрижно.",
      en: "Each car is fully inspected and comes with a documented history. We're upfront about condition and offer a short mechanical guarantee on eligible vehicles, so you drive away with peace of mind.",
    },
  },
  {
    q: {
      mk: "Прифаќате ли старо за ново?",
      en: "Do you accept trade-ins?",
    },
    a: {
      mk: "Да. Донесете го вашиот тековен автомобил и ќе ви дадеме фер проценка без притисок, веднаш на лице место. Неговата вредност може директно да оди во автомобилот што го купувате од нас.",
      en: "Yes. Bring your current car and we'll give you a fair, no-pressure valuation on the spot. Its value can go straight toward the car you're buying from us.",
    },
  },
  {
    q: {
      mk: "Кој се грижи за преносот на сопственост и документацијата?",
      en: "Who handles the ownership transfer and paperwork?",
    },
    a: {
      mk: "Ние. Регистрацијата, преносот на сопственост и сите потребни документи ги подготвуваме за вас — во повеќето случаи сѐ е готово истиот ден.",
      en: "We do. Registration, ownership transfer and all the required documents are prepared for you — in most cases everything is ready the same day.",
    },
  },
  {
    q: {
      mk: "Можете ли да најдете конкретен автомобил што не е на залиха?",
      en: "Can you find a specific car that isn't in stock?",
    },
    a: {
      mk: "Често, да. Ако не го гледате точниот модел што го барате, кажете ни што ви треба и ќе ја искористиме нашата мрежа за да го обезбедиме вистинскиот автомобил за вас.",
      en: "Often, yes. If you don't see the exact model you're after, tell us what you're looking for and we'll use our network to source the right car for you.",
    },
  },
];

// Desktop card sizing (px) — kept as constants so the track translate stays exact.
const COLLAPSED = 248;
const ACTIVE = 432;
const GAP = 16;
const STEP = COLLAPSED + GAP;

export default function FAQ() {
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0); // mobile accordion
  // One extra slide past the questions is the "Got more questions?" CTA panel.
  const cta = FAQS.length;
  const last = FAQS.length;

  const prev = () => setActive((i) => Math.max(0, i - 1));
  const next = () => setActive((i) => Math.min(last, i + 1));

  // Keep exactly one collapsed card to the left of the active one (except at
  // the very start), so the active card is always comfortably in view.
  const translateX = active <= 1 ? 0 : -(active - 1) * STEP;

  return (
    <section id="faq" className="section-padding bg-cloud">
      <div className="container-wide">
        {/* ── Header ── */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <Reveal>
            <h2 className="font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {T.heading[lang][0]}
              <br />
              {T.heading[lang][1]}{" "}
              <span className="text-teal">{T.heading[lang][2]}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.05} className="lg:pt-3">
            <p className="max-w-md font-body text-base leading-relaxed text-mute lg:text-lg">
              {T.intro[lang]}
            </p>

            {/* Prev / next — desktop only (mobile uses the accordion) */}
            <div className="mt-5 hidden items-center gap-3 lg:flex">
              <button
                onClick={prev}
                disabled={active === 0}
                aria-label={T.prevAria[lang]}
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-line bg-transparent text-ink transition-all hover:border-teal hover:text-teal-dark disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:text-ink"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={next}
                disabled={active === last}
                aria-label={T.nextAria[lang]}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white transition-all hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-teal"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </Reveal>
        </div>

        {/* ── Desktop: expanding horizontal carousel ── */}
        <div className="relative mt-14 hidden lg:block">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              style={{ gap: GAP }}
              animate={{ x: translateX }}
              transition={{ type: "spring", stiffness: 260, damping: 34 }}
            >
              {FAQS.map((f, i) => {
                const on = i === active;
                return (
                  <motion.button
                    key={f.q.en}
                    onClick={() => setActive(i)}
                    animate={{ width: on ? ACTIVE : COLLAPSED }}
                    transition={{ type: "spring", stiffness: 260, damping: 34 }}
                    className={`group relative h-[27rem] shrink-0 overflow-hidden rounded-[0.9rem] text-left transition-colors ${
                      on
                        ? "text-white shadow-[0_24px_60px_-18px_rgba(49,158,143,0.5)]"
                        : "border border-line bg-cloud-2 hover:border-teal/40 hover:bg-white"
                    }`}
                    style={
                      on
                        ? {
                            backgroundImage:
                              "radial-gradient(130% 130% at 15% 0%, #6BCFBF 0%, #47B8A8 52%, #2E9A8B 100%)",
                          }
                        : undefined
                    }
                  >
                    <div className="flex h-full flex-col p-7">
                      <h3
                        className={`font-heading font-semibold tracking-tight transition-colors ${
                          on
                            ? "text-[1.6rem] leading-[1.15] text-white"
                            : "text-xl leading-snug text-ink-soft group-hover:text-ink"
                        }`}
                      >
                        {f.q[lang]}
                      </h3>

                      <AnimatePresence mode="wait">
                        {on && (
                          <motion.p
                            key={f.q.en}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                            className="mt-auto max-w-[23rem] font-body text-[1.15rem] leading-relaxed text-white/90"
                          >
                            {f.a[lang]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                );
              })}

              {/* ── CTA end-slide — no card, just text that pops up ── */}
              <motion.div
                animate={{ width: active === cta ? ACTIVE : COLLAPSED }}
                transition={{ type: "spring", stiffness: 260, damping: 34 }}
                className="relative h-[27rem] shrink-0 overflow-hidden"
              >
                {active === cta ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex h-full flex-col items-center justify-center px-6 text-center"
                  >
                    <span className="inline-flex items-center gap-2 rounded-lg border border-teal/40 px-4 py-1.5 font-heading text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
                      {T.stillCurious[lang]}
                    </span>
                    <h3 className="mt-5 font-heading text-[2rem] font-semibold leading-[1.08] tracking-tight text-ink">
                      {T.moreQ[lang][0]}
                      <br />
                      {T.moreQ[lang][1]}
                    </h3>
                    <p className="mt-4 max-w-[20rem] font-body text-[1.05rem] leading-relaxed text-mute">
                      {T.moreCopy[lang]}
                    </p>
                    <div className="mt-7 flex flex-col items-center gap-3">
                      <a href="tel:071394113" className="glow-btn !rounded-xl">
                        <Phone size={17} />
                        071 394 113
                      </a>
                      <a
                        href="mailto:dadojovanovski00@gmail.com"
                        className="btn-ghost !rounded-xl"
                      >
                        <Mail size={17} />
                        dadojovanovski00@gmail.com
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setActive(cta)}
                    className="group flex h-full w-full flex-col p-7 text-left"
                  >
                    <h3 className="font-heading text-xl font-semibold leading-snug tracking-tight text-ink-soft transition-colors group-hover:text-ink">
                      {T.moreQShort[lang]}
                    </h3>
                  </button>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Right-edge fade so the trailing cards melt into the section */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-cloud to-transparent" />

          {/* Progress dots */}
          <div className="mt-8 flex gap-1.5">
            {Array.from({ length: FAQS.length + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={
                  i === cta
                    ? T.showContact[lang]
                    : `${T.showQuestion[lang]} ${i + 1}`
                }
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === active ? "w-8 bg-teal" : "w-4 bg-ink/15 hover:bg-ink/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Mobile: stacked accordion ── */}
        <div className="mt-10 space-y-3 lg:hidden">
          {FAQS.map((f, i) => {
            const on = open === i;
            return (
              <div
                key={f.q.en}
                className={`overflow-hidden rounded-[0.75rem] border transition-colors ${
                  on ? "border-teal/50 bg-surface" : "border-line bg-surface-2"
                }`}
              >
                <button
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-heading text-base font-semibold text-ink">
                    {f.q[lang]}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      on ? "rotate-45 bg-teal text-white" : "bg-cloud-2 text-ink"
                    }`}
                  >
                    <Plus size={17} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <p className="px-5 pb-5 font-body text-sm leading-relaxed text-mute">
                        {f.a[lang]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
