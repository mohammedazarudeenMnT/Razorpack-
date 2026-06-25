"use client";

import { PageHero } from "./PageHero";
import { useBanner } from "@/hooks/use-banner";

export function ContactHero() {
  const { banner, isLoading } = useBanner("contact");

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
      label={banner?.label || "Get In Touch"}
      headingLine1={banner?.headingLine1 || "CONTACT"}
      headingLine2={banner?.headingLine2 || "US"}
      description={banner?.description || ""}
      image={banner?.image || "/images/rayzor/contact-hero.png"}
      imageAlt="Rayzor Industrial Packaging Pvt Ltd Contact — Madurai Facility"
    />
  );
}
