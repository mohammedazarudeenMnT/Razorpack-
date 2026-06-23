"use client";

import { PageHero } from "./PageHero";

export function ProductsHero() {
  return (
    <PageHero
      label="Our Products"
      headingLine1="PACKAGING"
      headingLine2="PROTECTION"
      description="Precision-engineered VCI & LDPE films, pouches, bags, and shrink wraps — delivering industrial-grade corrosion prevention and product protection across 16+ specialized solutions."
      image="/images/rayzorpack_hero_premium.png"
      imageAlt="Rayzorpack VCI & LDPE Packaging Products"
      showPlayButton={false}
    />
  );
}
