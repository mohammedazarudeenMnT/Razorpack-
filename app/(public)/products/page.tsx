import { Metadata } from "next";
import { getSEO } from "@/lib/get-seo";
import { PageHero } from "@/components/Blufacade/pages/PageHero";
import { ProductsGrid } from "@/components/Blufacade/pages/ProductsGrid";
import connectDB from "@/config/models/connectDB";
import Banner from "@/config/utils/admin/banner/bannerSchema";
import Product from "@/config/utils/admin/products/productSchema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO("products");
  return {
    title:
      seo?.title ||
      "Products | Rayzor Industrial Packaging Pvt Ltd - Industrial Strength",
    description:
      seo?.description ||
      "Explore our range of industrial packaging solutions.",
    keywords: seo?.keywords || "",
  };
}

async function getProductsPageData() {
  try {
    await connectDB();

    const [banner, products] = await Promise.all([
      Banner.findOne({ pageKey: "products" }).lean(),
      Product.find({ status: "active", isDeleted: false })
        .sort({ order: 1, createdAt: -1 })
        .lean(),
    ]);

    const heroBanner = banner
      ? {
          label: banner.label || "Our Products",
          headingLine1: banner.headingLine1 || "PACKAGING",
          headingLine2: banner.headingLine2 || "PROTECTION",
          description:
            banner.description ||
            "Precision-engineered VCI & LDPE films, pouches, bags, and shrink wraps — delivering industrial-grade corrosion prevention and product protection.",
          image: banner.image || "/images/products_hero_packaging_premium.png",
        }
      : null;

    const productsList = (products || []).map((p: any, index: number) => ({
      num: String(index + 1).padStart(2, "0"),
      name: p.productName,
      category: p.category || "Packaging",
      slug: p.slug,
      image: p.image,
    }));

    return { heroBanner, products: productsList };
  } catch (error) {
    console.error("Failed to fetch products page data:", error);
    return { heroBanner: null, products: [] };
  }
}

export default async function ProductsPage() {
  const { heroBanner, products } = await getProductsPageData();

  return (
    <main className="min-h-screen bg-white">
      {heroBanner && (
        <PageHero
          label={heroBanner.label}
          headingLine1={heroBanner.headingLine1}
          headingLine2={heroBanner.headingLine2}
          description={heroBanner.description}
          image={heroBanner.image}
          imageAlt="Rayzor Industrial Packaging Pvt Ltd Products"
        />
      )}
      <ProductsGrid initialProducts={products} />
    </main>
  );
}
