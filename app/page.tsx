import { Metadata } from "next";
import { Header } from "@/components/Blufacade/Header";
import { HeroSection } from "@/components/Blufacade/HeroSection";
import { CaseStudyStrip } from "@/components/Blufacade/CaseStudyStrip";
import { ProductsCarousel } from "@/components/Blufacade/ProductsCarousel";
import { ServicesSection } from "@/components/Blufacade/ServicesSection";
import { AboutTextSection } from "@/components/Blufacade/AboutTextSection";
import { MissionSection } from "@/components/Blufacade/MissionSection";
import { TestimonialsSection } from "@/components/Blufacade/TestimonialsSection";
import { ClientLogosSection } from "@/components/Blufacade/ClientLogosSection";
import { FAQSection } from "@/components/Blufacade/FAQSection";
import { Footer } from "@/components/Blufacade/Footer";
import { DemoWrapper } from "@/components/Blufacade/DemoWrapper";

export const metadata: Metadata = {
  title: "Rayzorpack | Premium Packaging Solutions & LDPE Films",
  description:
    "Rayzor Industrial Packaging Pvt Ltd is the leading manufacturer of premium packaging materials, LDPE Film Rolls, and Poly Bags in Madurai, Tamil Nadu. Transform your packaging with our industrial solutions.",
  keywords:
    "packaging solutions, LDPE film rolls, VCI poly bags, stretch films, custom packaging, Madurai, Tamil Nadu, industrial packaging",
  openGraph: {
    title: "Rayzorpack | Premium Packaging Solutions",
    description:
      "Leading manufacturer of premium packaging materials, LDPE Film Rolls, and Poly Bags.",
    url: "https://www.rayzorpack.com",
    siteName: "Rayzorpack",
    type: "website",
  },
};

export default function Home() {
  return (
    <DemoWrapper>
      <main className="relative w-full overflow-x-hidden">
        <Header />
        <div className="pt-16 lg:pt-20">
          <HeroSection />
        </div>
        <CaseStudyStrip />
        <ProductsCarousel />
        <div className="mt-12 md:mt-20">
          <ServicesSection />
        </div>
        <div className="mt-12 md:mt-20">
          <MissionSection />
        </div>

        <div className="mt-12 md:mt-20">
          <Footer />
        </div>
      </main>
    </DemoWrapper>
  );
}
