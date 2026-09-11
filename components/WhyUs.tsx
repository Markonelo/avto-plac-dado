"use client";
import { ShieldCheck, Tag, FileCheck2, Headphones } from "lucide-react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";

const T = {
  kicker: { mk: "Зошто Авто Плац Дадо", en: "Why Avto Plac Dado" },
  heading: {
    mk: "Автосалон на кој навистина можете да му верувате",
    en: "A dealership you can actually trust",
  },
  copy: {
    mk: "Купувањето автомобил треба да биде едноставно. Токму така го чуваме — со квалитетна понуда, искрен разговор и фер договор.",
    en: "Buying a car should be simple. We keep it that way with quality stock, straight talk and a fair deal.",
  },
} as const;

const items = [
  {
    icon: ShieldCheck,
    title: { mk: "Внимателно избрани возила", en: "Hand-picked cars" },
    text: {
      mk: "Секое возило е проверено пред да стигне на плацот — без изненадувања и без скриени дефекти.",
      en: "Every car is inspected before it reaches the lot — no surprises, no hidden faults.",
    },
  },
  {
    icon: Tag,
    title: { mk: "Чесни цени", en: "Honest pricing" },
    text: {
      mk: "Фер, транспарентни цени со целосни спецификации наведени однапред. Она што го гледате е она што го плаќате.",
      en: "Fair, transparent prices with the full specs listed up front. What you see is what you pay.",
    },
  },
  {
    icon: FileCheck2,
    title: { mk: "Уредна документација", en: "Clean paperwork" },
    text: {
      mk: "Комплетна, проверена документација и непречен пренос од почеток до крај.",
      en: "Complete, verified documentation and a smooth handover from start to finish.",
    },
  },
  {
    icon: Headphones,
    title: { mk: "Локална поддршка", en: "Local support" },
    text: {
      mk: "Тука сме, во Битола — личен совет пред и по купувањето.",
      en: "We're right here in Bitola — personal advice before and after you buy.",
    },
  },
] as const;

export default function WhyUs() {
  const { lang } = useLang();
  return (
    <section className="section-padding bg-bg">
      <div className="container-wide">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="kicker justify-center">
            <span className="h-px w-6 bg-teal-dark" /> {T.kicker[lang]}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
            {T.heading[lang]}
          </h2>
          <p className="mx-auto mt-4 font-body text-mute">
            {T.copy[lang]}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <Reveal key={it.title.en} delay={i * 0.07}>
                <div className="soft-card h-full p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-soft text-teal-dark">
                    <Icon size={24} />
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-ink">
                    {it.title[lang]}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-mute">
                    {it.text[lang]}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
