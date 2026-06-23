import { notFound } from "next/navigation";
import { Header } from "@/components/Blufacade/Header";
import { Footer } from "@/components/Blufacade/Footer";
import { PageHero } from "@/components/Blufacade/pages/PageHero";
import connectDB from "@/config/models/connectDB";
import Product from "@/config/utils/admin/products/productSchema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Fetch single product by slug
async function getProductBySlug(slug: string) {
  try {
    await connectDB();
    const product = await Product.findOne({ slug, isDeleted: false }).lean();
    return product;
  } catch (error) {
    console.error("Failed to fetch product from DB:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const productData = await getProductBySlug(resolvedParams.slug);

  if (!productData) {
    notFound();
  }

  // Format the heading for the PageHero component which uses an '&' between lines
  // E.g., "VCI Film Rolls" -> "VCI FILM" & "ROLLS"
  const words = productData.productName.replace(/&/g, "").split(" ").filter(Boolean);
  const half = Math.ceil(words.length / 2);
  const headingLine1 = words.slice(0, half).join(" ") || "INDUSTRIAL";
  const headingLine2 = words.slice(half).join(" ") || "PRODUCT";

  return (
    <main className="min-h-screen">
      <Header />
      <PageHero
        label={productData.category || "Product Details"}
        headingLine1={headingLine1}
        headingLine2={headingLine2}
        description={productData.shortDescription || productData.description || "Industrial-grade packaging solutions."}
        image={productData.image || "/images/placeholder.svg"}
        imageAlt={productData.productName}
        theme="dark"
      />
      
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-medium text-[#36312d] mb-6">
              Product Overview
            </h2>
            <div className="w-24 h-1 bg-[#26A8E0] mx-auto rounded-full mb-8" />
            <p className="text-lg text-[#8c827a] max-w-3xl mx-auto leading-relaxed whitespace-pre-wrap">
              {productData.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
            {/* Left Column: Specs & Features */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Features List */}
              {productData.features && productData.features.length > 0 && (
                <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200">
                  <h3 className="text-xl font-medium text-[#36312d] mb-6">Key Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {productData.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#8CC63F] flex-shrink-0" />
                        <span className="text-[#8c827a]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications */}
              {productData.technicalSpecs && productData.technicalSpecs.length > 0 && (
                <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200">
                  <h3 className="text-xl font-medium text-[#36312d] mb-6">Technical Specifications</h3>
                  <div className="divide-y divide-stone-200">
                    {productData.technicalSpecs.map((spec: any, idx: number) => (
                      <div key={idx} className="py-3 flex justify-between items-center">
                        <span className="text-stone-600 font-medium">{spec.label}</span>
                        <span className="text-stone-500">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {productData.gallery && productData.gallery.length > 0 && (
                <div>
                  <h3 className="text-xl font-medium text-[#36312d] mb-6">Product Gallery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {productData.gallery.map((img: string, idx: number) => (
                      <div key={idx} className="aspect-square relative rounded-xl overflow-hidden shadow-sm border border-stone-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column: Applications & CTA */}
            <div className="space-y-8">
              {/* Applications */}
              {productData.applications && productData.applications.length > 0 && (
                <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
                  <h3 className="text-xl font-medium text-[#36312d] mb-4">Applications & Sectors</h3>
                  <ul className="space-y-3">
                    {productData.applications.map((app: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-3 text-[#8c827a]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#26A8E0]" />
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-[#0f1117] p-8 rounded-2xl text-white flex flex-col justify-center items-center text-center shadow-xl">
                <h3 className="text-2xl font-medium mb-4">Need this product?</h3>
                <p className="text-gray-400 mb-8 text-sm">
                  Get in touch with our packaging engineers to discuss your specific requirements and receive a custom quote.
                </p>
                <a href="/contact" className="inline-flex items-center justify-center bg-[#8CC63F] text-[#221E1F] px-8 py-3 rounded-full font-bold uppercase tracking-wide text-sm hover:bg-[#7AB52F] hover:text-white transition-colors w-full">
                  Request Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
