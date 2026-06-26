import { Metadata } from "next";
import { getSEO } from "@/lib/get-seo";
import { GalleryHero } from "@/components/Blufacade/pages/GalleryHero";
import { OurWorksSection } from "@/components/Blufacade/pages/OurWorksSection";
import connectDB from "@/config/models/connectDB";
import Banner from "@/config/utils/admin/banner/bannerSchema";
import GalleryWork from "@/config/utils/admin/gallery/galleryWorkSchema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO("gallery");
  const title = seo?.title || "Gallery";
  const description = seo?.description || "";

  return {
    title,
    description,
    keywords: seo?.keywords || "",
    alternates: { canonical: "/gallery" },
    openGraph: {
      title,
      description,
      url: "/gallery",
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

async function getGalleryPageData() {
  try {
    await connectDB();

    const [banner, works] = await Promise.all([
      Banner.findOne({ pageKey: "gallery" }).lean(),
      GalleryWork.find({ status: "active", isDeleted: false })
        .sort({ order: 1, createdAt: -1 })
        .lean(),
    ]);

    const bannerData = banner ? JSON.parse(JSON.stringify(banner)) : null;
    const worksList = JSON.parse(JSON.stringify(works || []));

    return { banner: bannerData, works: worksList };
  } catch (error) {
    console.error("Failed to fetch gallery page data:", error);
    return { banner: null, works: [] };
  }
}

export default async function GalleryPage() {
  const [{ banner, works }, seo] = await Promise.all([
    getGalleryPageData(),
    getSEO("gallery"),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo?.title || "Gallery",
    description: seo?.description || "",
    url: "https://www.rayzorpack.com/gallery",
    mainEntity: {
      "@type": "ImageGallery",
      numberOfItems: works.length,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen">
        <GalleryHero initialBanner={banner} />
        <OurWorksSection initialWorks={works} />
      </main>
    </>
  );
}
