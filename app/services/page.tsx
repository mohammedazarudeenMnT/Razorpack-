import { Metadata } from "next"
import { Header } from "@/components/Blufacade/Header"
import { Footer } from "@/components/Blufacade/Footer"
import { ServicesHero } from "@/components/Blufacade/pages/ServicesHero"
import { ServicesGrid } from "@/components/Blufacade/pages/ServicesGrid"

export const metadata: Metadata = {
  title: "Our Services | Rayzorpack - Industrial Packaging Solutions",
  description: "Explore our comprehensive industrial packaging services including contract packaging, export palletization, vacuum packaging, and VCI protection.",
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <ServicesHero />
      <ServicesGrid />
      <Footer />
    </main>
  )
}
