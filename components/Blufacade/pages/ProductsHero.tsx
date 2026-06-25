"use client";

import { PageHero } from "./PageHero";
import { useBanner } from "@/hooks/use-banner";

export function ProductsHero() {
  const { banner, isLoading } = useBanner("products");

  if (isLoading) {
    return (
      <div className="relative w-full h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-[var(--brand-blue)] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm font-medium tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PageHero
      label={banner?.label || "Our Products"}
      headingLine1={banner?.headingLine1 || "PACKAGING"}
      headingLine2={banner?.headingLine2 || "PROTECTION"}
      description={banner?.description || ""}
      image={banner?.image || "/images/products_hero_packaging_v2.png"}
      imageAlt="Rayzor Industrial Packaging Pvt Ltd VCI & LDPE Packaging Products"
      showPlayButton={false}
      bgGraphicTopRight="/images/rayzor/hero/hero_products_bg_tr.png"
      bgGraphicBottomLeft="/images/rayzor/hero/hero_products_bg_bl.png"
    />
  );
}
