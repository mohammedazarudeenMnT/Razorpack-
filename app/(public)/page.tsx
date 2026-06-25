import { Metadata } from "next";
import { HeroSection } from "@/components/Blufacade/HeroSection";
import { ProductsCarousel } from "@/components/Blufacade/ProductsCarousel";
import { ServicesSection } from "@/components/Blufacade/ServicesSection";
import { UniqueSection } from "@/components/Blufacade/UniqueSection";
import { MissionSection } from "@/components/Blufacade/MissionSection";
import { getSEO } from "@/lib/get-seo";
import connectDB from "@/config/models/connectDB";
import Banner from "@/config/utils/admin/banner/bannerSchema";
import Service from "@/config/utils/admin/services/serviceSchema";
import Product from "@/config/utils/admin/products/productSchema";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO("home");
  return {
    title: seo?.title || "Rayzor Industrial Packaging Pvt Ltd | Premium Packaging Solutions & LDPE Films",
    description: seo?.description || "Rayzor Industrial Packaging Pvt Ltd is the leading manufacturer of premium packaging materials, LDPE Film Rolls, and Poly Bags in Madurai, Tamil Nadu.",
    keywords: seo?.keywords || "packaging solutions, LDPE film rolls, VCI poly bags, stretch films, custom packaging, Madurai, Tamil Nadu",
    openGraph: {
      title: seo?.title || "Rayzor Industrial Packaging Pvt Ltd | Premium Packaging Solutions",
      description: seo?.description || "Leading manufacturer of premium packaging materials, LDPE Film Rolls, and Poly Bags.",
      url: "https://www.rayzorpack.com",
      siteName: "Rayzor Industrial Packaging Pvt Ltd",
      type: "website",
    },
  };
}

async function getHomeData() {
  try {
    await connectDB();

    const [banner, services, products] = await Promise.all([
      Banner.findOne({ pageKey: "home" }).lean(),
      Service.find({ status: "active", isDeleted: false })
        .sort({ order: 1, createdAt: -1 })
        .limit(4)
        .lean(),
      Product.find({ status: "active", isDeleted: false })
        .sort({ order: 1, createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    // Process hero slides
    const raw = banner?.slides || [];
    const images = banner?.images || [];
    const heroSlides = raw.map((s: any, i: number) => ({
      imageUrl: s.imageUrl || images[i] || "",
      title: s.title || "",
      highlight: (s.highlight || "").replace(/\\n/g, "\n"),
      tagline: (s.tagline || "").replace(/\\n/g, "\n"),
      description: s.description || "",
      primaryCtaLabel: s.primaryCtaLabel || "",
      primaryCtaHref: s.primaryCtaHref || "",
    }));

    // Process services
    const servicesList = services.map((s: any) => ({
      serviceName: s.serviceName,
      category: s.category || "",
      description: s.description || "",
      image: s.image || "",
    }));

    // Process products
    const productsList = products.map((p: any) => ({
      productName: p.productName,
      image: p.image || "",
      slug: p.slug || "",
      shortDescription: p.shortDescription || "",
    }));

    return { heroSlides, services: servicesList, products: productsList };
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
    return { heroSlides: [], services: [], products: [] };
  }
}

export default async function Home() {
  const { heroSlides, services, products } = await getHomeData();

  return (
    <main className="relative w-full overflow-x-hidden">
      <HeroSection initialSlides={heroSlides} />
      <UniqueSection />
      <ServicesSection initialServices={services} />
      <ProductsCarousel initialProducts={products} />
      <MissionSection />
    </main>
  );
}
