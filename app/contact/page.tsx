import type { Metadata } from "next";
import ContactHero from "@/components/ContactHero";
import OfficeSection from "@/components/OfficeSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "Контакт — Авто Плац Дадо Битола",
  description:
    "Контактирајте го Авто Плац Дадо во Битола. Јавете се, пишете ни или " +
    "посетете нѐ за секое возило, тест возење или прашање околу купување " +
    "автомобил.",
  alternates: { canonical: "/contact" },
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <OfficeSection />
      <FAQ />
      <Footer />
    </>
  );
}
