"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Mail, MapPin, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { useLang } from "./LanguageProvider";

// Contact hero — a clean white rounded panel (same recipe as CarsHero): the page
// intro, three quick points and two info cards on the LEFT, with a clean
// rounded contact-form card on the RIGHT. No backend: submit composes a
// pre-filled email so the visitor's own mail client does the sending.

const T = {
  kicker: { mk: "Стапи во контакт", en: "Get in touch" },
  heading: { mk: "Како можеме да помогнеме?", en: "How Can We Help?" },
  intro: {
    mk: "Јавете се на нашиот тим за преглед, прашање за цена или пријателски совет — ќе ви помогнеме да го најдете вистинскиот автомобил и ќе одговориме на сѐ пред да го посетите плацот во Битола.",
    en: "Reach our team for a viewing, a price question or friendly advice — we'll help you find the right car and answer anything before you visit the lot in Bitola.",
  },
  points: {
    mk: [
      "Побарајте автомобил или закажете преглед на автомобил",
      "Дознајте кој автомобил најмногу ви одговара",
      "Добијте помош со старо за ново",
    ],
    en: [
      "Request a car or book a viewing",
      "Find out which car fits you best",
      "Get help with a trade-in",
    ],
  },
  generalEnq: { mk: "Општи прашања", en: "General enquiries" },
  generalEnqCopy: {
    mk: "Преферирате е-пошта? Јавете се директно на нашиот тим и ќе одговориме истиот ден.",
    en: "Prefer email? Reach our team directly and we'll reply the same day.",
  },
  visitLot: { mk: "Посетете го плацот", en: "Visit the lot" },
  visitLotCopy: {
    mk: "Дојдете да ги видите автомобилите во живо — отворени сме:",
    en: "Come see the cars in person — we're open:",
  },
  hoursMonFri: { mk: "Пон–Пет 10:30–17:00", en: "Mon–Fri 10:30–17:00" },
  hoursSat: { mk: "Саб 10:30–18:00", en: "Sat 10:30–18:00" },
  hoursSun: { mk: "Недела затворено", en: "Sun closed" },
  ready: { mk: "Пораката е спремна за испраќање", en: "Message ready to send" },
  readyCopy: {
    mk: "Вашата апликација за е-пошта би требало да се отвори со пополнета порака. Само притиснете испрати и наскоро ќе ве контактираме.",
    en: "Your email app should have opened with your message pre-filled. Just hit send and we'll be in touch shortly.",
  },
  writeAnother: { mk: "Напиши друга порака", en: "Write another message" },
  contactTeam: { mk: "Контактирајте го нашиот тим", en: "Contact our team" },
  contactTeamCopy: {
    mk: "Пополнете го формуларот и брзо ќе ви одговориме.",
    en: "Fill in the form and we'll get right back to you.",
  },
  firstName: { mk: "Име", en: "First name" },
  lastName: { mk: "Презиме", en: "Last name" },
  emailAddr: { mk: "Е-пошта", en: "Email address" },
  phoneNum: { mk: "Телефонски број", en: "Phone number" },
  carInterest: { mk: "Автомобил од интерес (опционално)", en: "Car of interest (optional)" },
  carPlaceholder: { mk: "пр. BMW 320d — или сѐ уште не сте сигурни", en: "e.g. BMW 320d — or not sure yet" },
  yourMessage: { mk: "Вашата порака", en: "Your message" },
  messagePlaceholder: { mk: "Кажете ни што барате…", en: "Tell us what you're looking for…" },
  sendMessage: { mk: "Испрати порака", en: "Send message" },
} as const;

export default function ContactHero() {
  const { lang } = useLang();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    car: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = `${form.firstName} ${form.lastName}`.trim();
    const subject =
      lang === "mk"
        ? `Прашање од ${name || "посетител на веб-страницата"}`
        : `Enquiry from ${name || "a website visitor"}`;
    const body = (
      lang === "mk"
        ? [
            `Име: ${name}`,
            `Е-пошта: ${form.email}`,
            form.phone ? `Телефон: ${form.phone}` : null,
            form.car ? `Автомобил од интерес: ${form.car}` : null,
            "",
            form.message,
          ]
        : [
            `Name: ${name}`,
            `Email: ${form.email}`,
            form.phone ? `Phone: ${form.phone}` : null,
            form.car ? `Car of interest: ${form.car}` : null,
            "",
            form.message,
          ]
    )
      .filter((l) => l !== null)
      .join("\n");
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section className="bg-cloud p-2 pt-24 sm:p-2.5 sm:pt-28">
      <div className="relative overflow-hidden rounded-[0.625rem] bg-surface sm:rounded-[0.75rem]">
        {/* Soft dot texture + faint teal glow on the white backdrop */}
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.5]" />

        <div className="relative z-10 mx-auto grid w-full max-w-[86rem] gap-10 p-6 py-12 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,38rem)] lg:gap-14 lg:p-14">
          {/* ── Left: intro, points and info cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col"
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-teal/40 px-4 py-1.5 font-heading text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
              {T.kicker[lang]}
            </span>

            <h1 className="mt-6 max-w-xl font-heading text-[2.5rem] font-semibold leading-[1.03] tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]">
              {T.heading[lang]}
            </h1>

            <p className="mt-5 max-w-md font-body text-base leading-relaxed text-mute sm:text-lg">
              {T.intro[lang]}
            </p>

            {/* Three quick points */}
            <ul className="mt-8 space-y-3">
              {T.points[lang].map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <Check
                    size={18}
                    strokeWidth={2.5}
                    className="shrink-0 text-teal-dark"
                  />
                  <span className="font-body text-base text-ink-soft">{p}</span>
                </li>
              ))}
            </ul>

            {/* Two info cards, anchored to the bottom */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-auto lg:pt-12">
              <div className="rounded-[0.625rem] border border-line bg-surface p-5 transition-colors hover:border-teal/40">
                <h3 className="font-heading text-lg font-semibold text-ink">
                  {T.generalEnq[lang]}
                </h3>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-mute">
                  {T.generalEnqCopy[lang]}
                </p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-3.5 flex items-center gap-2 font-heading text-[15px] font-semibold text-teal-dark transition-colors hover:text-teal"
                >
                  <Mail size={15} className="shrink-0" />{" "}
                  <span className="min-w-0 whitespace-nowrap">{SITE.email}</span>
                </a>
              </div>

              <div className="rounded-[0.625rem] border border-line bg-surface p-5 transition-colors hover:border-teal/40">
                <h3 className="font-heading text-lg font-semibold text-ink">
                  {T.visitLot[lang]}
                </h3>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-mute">
                  {T.visitLotCopy[lang]}
                </p>
                <ul className="mt-2 space-y-0.5 font-body text-[15px] text-ink-soft">
                  <li>{T.hoursMonFri[lang]}</li>
                  <li>{T.hoursSat[lang]}</li>
                  <li>{T.hoursSun[lang]}</li>
                </ul>
                <span className="mt-3.5 inline-flex items-center gap-2 font-heading text-[15px] font-semibold text-ink">
                  <MapPin size={15} className="shrink-0 text-teal-dark" />{" "}
                  {SITE.address}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── Right: clean form card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="rounded-[0.75rem] border border-line bg-surface p-6 shadow-[0_24px_60px_-30px_rgba(17,19,24,0.3)] sm:p-8"
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-soft text-teal-dark">
                  <Check size={28} />
                </span>
                <h2 className="mt-5 font-heading text-2xl font-semibold text-ink">
                  {T.ready[lang]}
                </h2>
                <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-mute">
                  {T.readyCopy[lang]}
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 font-heading text-sm font-semibold text-teal-dark transition-colors hover:text-teal"
                >
                  {T.writeAnother[lang]}
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <h2 className="font-heading text-2xl font-semibold text-ink">
                  {T.contactTeam[lang]}
                </h2>
                <p className="mt-1.5 font-body text-sm text-mute">
                  {T.contactTeamCopy[lang]}
                </p>

                <div className="mt-6 flex flex-col gap-3.5">
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <FloatingField label={T.firstName[lang]}>
                      <input
                        type="text"
                        required
                        value={form.firstName}
                        onChange={set("firstName")}
                        placeholder="Dimitar"
                        className={INPUT}
                      />
                    </FloatingField>
                    <FloatingField label={T.lastName[lang]}>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={set("lastName")}
                        placeholder="Petrov"
                        className={INPUT}
                      />
                    </FloatingField>
                  </div>

                  <FloatingField label={T.emailAddr[lang]}>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@email.com"
                      className={INPUT}
                    />
                  </FloatingField>

                  <FloatingField label={T.phoneNum[lang]}>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="071 234 567"
                      className={`${INPUT} nums`}
                    />
                  </FloatingField>

                  <FloatingField label={T.carInterest[lang]}>
                    <input
                      type="text"
                      value={form.car}
                      onChange={set("car")}
                      placeholder={T.carPlaceholder[lang]}
                      className={INPUT}
                    />
                  </FloatingField>

                  <FloatingField label={T.yourMessage[lang]}>
                    <textarea
                      required
                      value={form.message}
                      onChange={set("message")}
                      rows={4}
                      placeholder={T.messagePlaceholder[lang]}
                      className={`${INPUT} resize-none`}
                    />
                  </FloatingField>

                  <button
                    type="submit"
                    className="group mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-[0.625rem] bg-teal px-6 py-4.5 font-heading text-base font-semibold text-white transition-colors hover:bg-teal-dark"
                  >
                    {T.sendMessage[lang]}
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const INPUT =
  "w-full bg-transparent font-body text-base text-ink outline-none placeholder:text-mute/60";

function FloatingField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[0.625rem] border border-line bg-surface px-3.5 pb-2.5 pt-2 transition-colors focus-within:border-teal">
      <label className="block font-body text-xs font-medium tracking-[0.02em] text-mute">
        {label}
      </label>
      {children}
    </div>
  );
}
