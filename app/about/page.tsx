import { Metadata } from "next"
import { Header } from "@/components/Blufacade/Header"
import { Footer } from "@/components/Blufacade/Footer"
import { AboutHero } from "@/components/Blufacade/pages/AboutHero"
import { AboutBusinessAreas } from "@/components/Blufacade/pages/AboutBusinessAreas"
import { AboutMissionVision } from "@/components/Blufacade/pages/AboutMissionVision"
import { AboutProcess } from "@/components/Blufacade/pages/AboutProcess"

export const metadata: Metadata = {
  title: "About Us | Rayzorpack - Industrial Strength",
  description: "Learn about Rayzorpack - your trusted partner for innovative industrial packaging solutions.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <AboutHero />
      <AboutBusinessAreas />
      <AboutMissionVision />
      <AboutProcess />
      <Footer />
    </main>
  )
}
