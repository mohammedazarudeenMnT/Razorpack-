import { Metadata } from "next";
import { PageHero } from "@/components/Blufacade/pages/PageHero";
import { PortfolioGrid } from "@/components/Blufacade/pages/PortfolioGrid";

export const metadata: Metadata = {
  title: "Project Gallery & Portfolio | Rayzor Industrial Packaging Pvt Ltd",
  description:
    "Explore our gallery of completed packaging projects. From custom LDPE films to advanced VCI corrosion protection solutions, see how we safeguard industrial shipments.",
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen">
      <PageHero
        label="Project Gallery"
        headingLine1="PACKAGING"
        headingLine2="GALLERY"
        description="Explore our record of industrial-grade protection. A showcase of custom-printed poly bags, high-performance stretch wrapping, and advanced VCI corrosion prevention setups."
        image="/images/gallery_hero_packaging.png"
        imageAlt="Rayzor Industrial Packaging Pvt Ltd Project Gallery"
        theme="light"
        bgGraphicTopRight="/images/rayzor/hero/hero_products_bg_tr.png"
        bgGraphicBottomLeft="/images/rayzor/hero/hero_products_bg_bl.png"
      />
      <PortfolioGrid />
    </main>
  );
}
