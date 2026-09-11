import type { Metadata } from "next";
import FavoritesInventory from "@/components/FavoritesInventory";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "Омилени возила — зачувана листа",
  description:
    "Возилата што ги зачувавте од понудата на Авто Плац Дадо во Битола, на едно место за лесна споредба.",
  alternates: { canonical: "/favorites" },
  robots: { index: false, follow: true },
});

export default function FavoritesPage() {
  return (
    <>
      <FavoritesInventory />
      <Contact />
      <Footer />
    </>
  );
}
