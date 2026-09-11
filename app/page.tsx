import Hero from "@/components/Hero";
import SearchFilter from "@/components/SearchFilter";
import BrandsMarquee from "@/components/BrandsMarquee";
import About from "@/components/About";
import CarsShowcase from "@/components/CarsShowcase";
import Testimonials from "@/components/Testimonials";
import BrandsCard from "@/components/BrandsCard";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <SearchFilter />
      <BrandsMarquee />
      <About />
      <CarsShowcase />
      <Testimonials />
      <BrandsCard />
      <FAQ />
      <Contact />
      <FinalCTA />
      <Footer />
    </>
  );
}
