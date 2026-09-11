import { Suspense } from "react";
import type { Metadata } from "next";
import CarsHero from "@/components/CarsHero";
import CarsMarquee from "@/components/CarsMarquee";
import CarsInventory from "@/components/CarsInventory";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "Возила на продажба — половни автомобили во Битола",
  description:
    "Разгледајте ги сите автомобили на залиха во Авто Плац Дадо, Битола. " +
    "Филтрирајте по марка, каросерија, цена, менувач и година и најдете го " +
    "вашиот следен автомобил.",
  alternates: { canonical: "/cars" },
});

export default function CarsPage() {
  return (
    <>
      <CarsHero />
      <CarsMarquee />
      <Suspense fallback={<div className="min-h-[40rem] bg-cloud" />}>
        <CarsInventory />
      </Suspense>
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}
