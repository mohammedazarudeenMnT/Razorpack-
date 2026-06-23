import { Metadata } from "next"
import { Header } from "@/components/Blufacade/Header"
import { Footer } from "@/components/Blufacade/Footer"
import { ContactHero } from "@/components/Blufacade/pages/ContactHero"
import { ContactContent } from "@/components/Blufacade/pages/ContactContent"

export const metadata: Metadata = {
  title: "Contact Us | Rayzorpack - Get In Touch",
  description: "Contact Rayzorpack for packaging consultations, bulk enquiries, or custom solutions. Visit our facility in Madurai, Tamil Nadu.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <ContactHero />
      <ContactContent />
      <Footer />
    </main>
  )
}
