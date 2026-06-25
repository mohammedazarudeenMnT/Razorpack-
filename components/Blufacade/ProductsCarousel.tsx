"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface ProductData {
  productName: string;
  image: string;
  slug: string;
  shortDescription: string;
}

interface ProductsCarouselProps {
  initialProducts: ProductData[];
}

export function ProductsCarousel({ initialProducts }: ProductsCarouselProps) {
  const containerRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Map server-provided products to card format
  const PRODUCTS = initialProducts.map((p, i) => ({
    name: p.productName,
    num: String(i + 1).padStart(2, "0"),
    image: p.image,
    slug: p.slug,
    shortDescription: p.shortDescription || "",
  }));

  // Horizontal Parallax Scroll Animation
  useGSAP(
    () => {
      const container = containerRef.current;
      const slider = sliderRef.current;
      if (!container || !slider) return;

      // The total distance the slider needs to move to completely exit the left side.
      // By scrolling by -scrollWidth, the right padding (100vw) will ensure the last
      // card goes completely off-screen before the animation ends.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1, // Smooth scrubbing
          start: "top top",
          end: () => `+=${slider.scrollWidth}`, // Scroll duration proportional to width
        },
      });

      tl.to(slider, {
        x: () => -slider.scrollWidth,
        ease: "none", // Linear movement tied exactly to scroll
      });
    },
    { scope: containerRef, dependencies: [PRODUCTS.length] },
  );

  if (PRODUCTS.length === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100vh] bg-[#e3e1da] overflow-hidden flex flex-col justify-center"
    >
      {/* ─── FIXED BACKGROUND TITLE ─── */}
      <div className="absolute top-8 md:top-16 left-8 md:left-16 z-0 pointer-events-none">
        <h2 className="text-6xl md:text-[8rem] font-black text-[#1b1c19]/5 tracking-tighter leading-none uppercase">
          Products
          <br />
          Catalog
        </h2>
      </div>

      {/* ─── HORIZONTAL SLIDER ─── */}
      {/* pl-[50vw] md:pl-[60vw] makes the first card half-visible from the right when the section starts.
          pr-[100vw] gives empty space at the end so it can scroll fully off left. */}
      <div
        ref={sliderRef}
        className="flex items-center gap-8 md:gap-16 h-full pl-[50vw] md:pl-[60vw] pr-[100vw] will-change-transform z-10"
      >
        {PRODUCTS.map((product, i) => {
          // Alternating slight rotations for that messy, thrown-card physical look
          const rotateClass = [
            "-rotate-2",
            "rotate-2",
            "-rotate-1",
            "rotate-1",
          ][i % 4];
          // Alternating Brand Primary Colors
          const bgColors = [
            "bg-[var(--brand-blue)]",
            "bg-[#004e7a]",
            "bg-[#0a1118]",
            "bg-[#002f4a]",
          ];
          const bgColor = bgColors[i % 4];

          return (
            <Link
              href={product.slug ? `/products/${product.slug}` : "/products"}
              key={product.num}
              className={`shrink-0 w-[80vw] md:w-[450px] aspect-[3/4] rounded-[1.5rem] md:rounded-[2rem] border-[3px] md:border-4 border-[#1b1c19] ${bgColor} shadow-[8px_8px_0px_0px_#1b1c19] md:shadow-[12px_12px_0px_0px_#1b1c19] overflow-hidden flex flex-col relative transition-transform hover:scale-[1.02] duration-300 ${rotateClass}`}
            >
              {/* TOP: Image Area */}
              <div className="h-[55%] relative border-b-[3px] md:border-b-4 border-[#1b1c19] bg-[#fff]">
                <Image
                  src={product.image}
                  fill
                  className="object-cover"
                  alt={product.name}
                  sizes="(max-width: 768px) 80vw, 450px"
                  priority={i < 4}
                />
              </div>

              {/* BOTTOM: Text Content perfectly matching reference */}
              <div className="h-[45%] p-6 md:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-white font-black text-[1.75rem] md:text-3xl lg:text-[2rem] uppercase leading-[0.95] tracking-tight break-words hyphens-auto pr-2">
                    {product.name}
                  </h3>
                  <span className="text-white/80 font-mono text-lg md:text-xl lg:text-2xl font-bold shrink-0">
                    {product.num}
                  </span>
                </div>

                <div className="flex items-end justify-between mt-4">
                  <p className="text-white/90 text-sm md:text-base font-medium max-w-[220px] leading-tight">
                    {product.shortDescription
                      ? product.shortDescription.slice(0, 80) + (product.shortDescription.length > 80 ? "..." : "")
                      : "Premium industrial packaging engineered for ultimate protection."}
                  </p>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1b1c19] flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
