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
  return {
    title:
      seo?.title ||
      "Project Gallery & Portfolio | Rayzor Industrial Packaging Pvt Ltd",
    description:
      seo?.description ||
      "Explore our gallery of completed packaging projects.",
    keywords: seo?.keywords || "",
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
  const { banner, works } = await getGalleryPageData();

  return (
    <main className="min-h-screen">
      <GalleryHero initialBanner={banner} />
      <OurWorksSection initialWorks={works} />
    </main>
  );
}
