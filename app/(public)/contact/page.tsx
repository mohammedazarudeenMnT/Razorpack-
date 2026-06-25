import { Metadata } from "next";
import { getSEO } from "@/lib/get-seo";
import { PageHero } from "@/components/Blufacade/pages/PageHero";
import { ContactContent } from "@/components/Blufacade/pages/ContactContent";
import connectDB from "@/config/models/connectDB";
import Banner from "@/config/utils/admin/banner/bannerSchema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO("contact");
  return {
    title:
      seo?.title ||
      "Contact Us | Rayzor Industrial Packaging Pvt Ltd - Get In Touch",
    description:
      seo?.description ||
      "Contact Rayzor Industrial Packaging Pvt Ltd for packaging consultations, bulk enquiries, or custom solutions.",
    keywords: seo?.keywords || "",
  };
}

async function getContactPageData() {
  try {
    await connectDB();
    const banner = await Banner.findOne({ pageKey: "contact" }).lean();

    if (banner) {
      return {
        label: banner.label || "Get In Touch",
        headingLine1: banner.headingLine1 || "CONTACT",
        headingLine2: banner.headingLine2 || "US",
        description:
          banner.description ||
          "Reach out to our team in Madurai, Tamil Nadu for packaging consultations, bulk enquiries, or custom solutions.",
        image: banner.image || "/images/rayzor/contact-hero.png",
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch contact page data:", error);
    return null;
  }
}

export default async function ContactPage() {
  const heroBanner = await getContactPageData();

  return (
    <main className="min-h-screen">
      {heroBanner && (
        <PageHero
          label={heroBanner.label}
          headingLine1={heroBanner.headingLine1}
          headingLine2={heroBanner.headingLine2}
          description={heroBanner.description}
          image={heroBanner.image}
          imageAlt="Rayzor Industrial Packaging Pvt Ltd Contact"
        />
      )}
      <ContactContent />
    </main>
  );
}
