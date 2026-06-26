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
  const title = seo?.title || "Our Services";
  const description = seo?.description || "";

  return {
    title,
    description,
    keywords: seo?.keywords || "",
    alternates: { canonical: "/services" },
    openGraph: {
      title,
      description,
      url: "/services",
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
  const [{ heroBanner, services }, seo] = await Promise.all([
    getServicesPageData(),
    getSEO("services"),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo?.title || "Our Services",
    description: seo?.description || heroBanner?.description || "",
    url: "https://www.rayzorpack.com/services",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: services.length,
      itemListElement: services.map((s: any, i: number) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://www.rayzorpack.com/services/${s.slug}`,
        name: s.serviceName,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
    </>
  );
}
