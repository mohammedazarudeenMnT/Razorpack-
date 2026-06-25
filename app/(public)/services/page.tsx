import { Metadata } from "next";
import { getSEO } from "@/lib/get-seo";
import { PageHero } from "@/components/Blufacade/pages/PageHero";
import { ServicesGrid } from "@/components/Blufacade/pages/ServicesGrid";
import connectDB from "@/config/models/connectDB";
import Banner from "@/config/utils/admin/banner/bannerSchema";
import Service from "@/config/utils/admin/services/serviceSchema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO("services");
  return {
    title:
      seo?.title ||
      "Our Services | Rayzor Industrial Packaging Pvt Ltd - Industrial Packaging Solutions",
    description:
      seo?.description ||
      "Explore our comprehensive industrial packaging services including contract packaging, export palletization, vacuum packaging, and VCI protection.",
    keywords: seo?.keywords || "",
  };
}

async function getServicesPageData() {
  try {
    await connectDB();

    const [banner, services] = await Promise.all([
      Banner.findOne({ pageKey: "services" }).lean(),
      Service.find({ status: "active", isDeleted: false })
        .sort({ order: 1, createdAt: -1 })
        .lean(),
    ]);

    const heroBanner = banner
      ? {
          label: banner.label || "Our Services",
          headingLine1: banner.headingLine1 || "SOLUTIONS",
          headingLine2: banner.headingLine2 || "SECTORS",
          description:
            banner.description ||
            "From contract packaging and export palletization to vacuum sealing and VCI protection — we deliver end-to-end industrial packaging services.",
          image: banner.image || "/images/rayzor/services/services_hero_premium.png",
        }
      : null;

    const servicesList = JSON.parse(JSON.stringify(services || []));

    return { heroBanner, services: servicesList };
  } catch (error) {
    console.error("Failed to fetch services page data:", error);
    return { heroBanner: null, services: [] };
  }
}

export default async function ServicesPage() {
  const { heroBanner, services } = await getServicesPageData();

  return (
    <main className="min-h-screen">
      {heroBanner && (
        <PageHero
          label={heroBanner.label}
          headingLine1={heroBanner.headingLine1}
          headingLine2={heroBanner.headingLine2}
          description={heroBanner.description}
          image={heroBanner.image}
          imageAlt="Rayzor Industrial Packaging Pvt Ltd Services"
        />
      )}
      <ServicesGrid initialServices={services} />
    </main>
  );
}
