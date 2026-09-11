import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CarDetail from "@/components/CarDetail";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { CARS, getCar, relatedCars } from "@/lib/cars";
import { buildCarMeta, carProductSchema, breadcrumbSchema } from "@/lib/seo";

// Pre-render every car page at build time.
export function generateStaticParams() {
  return CARS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const car = getCar(id);
  if (!car) return { title: "Возилото не е пронајдено" };
  return buildCarMeta(car);
}

export default async function CarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = getCar(id);
  if (!car) notFound();

  const related = relatedCars(car, 3);

  const productLd = carProductSchema(car);
  const breadcrumbLd = breadcrumbSchema([
    { name: "Почетна", url: "/" },
    { name: "Возила", url: "/cars" },
    { name: `${car.name} (${car.year})`, url: `/cars/${car.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <CarDetail car={car} related={related} />
      <Contact />
      <Footer />
    </>
  );
}
