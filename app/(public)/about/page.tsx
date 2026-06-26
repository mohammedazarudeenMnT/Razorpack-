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
  const title = seo?.title || "About Us";
  const description = seo?.description || "";

  return {
    title,
    description,
    keywords: seo?.keywords || "",
    alternates: { canonical: "/about" },
    openGraph: {
      title,
      description,
      url: "/about",
      type: "website",
      ...(seo?.ogImage && { images: [{ url: seo.ogImage, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(seo?.ogImage && { images: [seo.ogImage] }),
    },
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
  const [heroBanner, seo] = await Promise.all([
    getAboutPageData(),
    getSEO("about"),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: seo?.title || "About Us",
    description: seo?.description || heroBanner?.description || "",
    url: "https://www.rayzorpack.com/about",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
    </>
  );
}
