import { Metadata } from "next";
import { getSEO } from "@/lib/get-seo";
import { PageHero } from "@/components/Blufacade/pages/PageHero";
import { AboutBusinessAreas } from "@/components/Blufacade/pages/AboutBusinessAreas";
import { AboutMissionVision } from "@/components/Blufacade/pages/AboutMissionVision";
import { AboutProcess } from "@/components/Blufacade/pages/AboutProcess";
import connectDB from "@/config/models/connectDB";
import Banner from "@/config/utils/admin/banner/bannerSchema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO("about");
  return {
    title:
      seo?.title ||
      "About Us | Rayzor Industrial Packaging Pvt Ltd - Industrial Strength",
    description:
      seo?.description ||
      "Learn about Rayzor Industrial Packaging Pvt Ltd - your trusted partner for innovative industrial packaging solutions.",
    keywords: seo?.keywords || "",
  };
}

async function getAboutPageData() {
  try {
    await connectDB();
    const banner = await Banner.findOne({ pageKey: "about" }).lean();

    if (banner) {
      return {
        label: banner.label || "About Us",
        headingLine1: banner.headingLine1 || "ELEVATING",
        headingLine2: banner.headingLine2 || "PACKAGING",
        description:
          banner.description ||
          "For over two decades, we've been the driving force behind tailor-made packaging solutions from our production hub in Madurai, Tamil Nadu.",
        image: banner.image || "/images/about_hero_packaging.png",
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch about page data:", error);
    return null;
  }
}

export default async function AboutPage() {
  const heroBanner = await getAboutPageData();

  return (
    <main className="min-h-screen bg-white">
      {heroBanner && (
        <PageHero
          label={heroBanner.label}
          headingLine1={heroBanner.headingLine1}
          headingLine2={heroBanner.headingLine2}
          description={heroBanner.description}
          image={heroBanner.image}
          imageAlt="Rayzor Industrial Packaging Pvt Ltd — About Us"
        />
      )}
      <AboutMissionVision />
      <AboutBusinessAreas />
      <AboutProcess />
    </main>
  );
}
