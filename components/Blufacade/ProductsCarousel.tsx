"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Product {
  id: string;
  title: string;
  description: string;
  prodImg: string;
  modelImg: string;
}

// Re-using existing local images since the disk space is full and we can't generate new ones right now
const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Rustoxy VCI Film Roll",
    description: "Anti-Corrosion Protection",
    prodImg: "/images/rayzor/products/vci-film-roll.png",
    modelImg: "/images/rayzor/products/vci-engine-wrap.png",
  },
  {
    id: "2",
    title: "Heavy Duty LDPE Sheet",
    description: "Industrial Strength Barrier",
    prodImg: "/images/rayzor/products/ldpe-sheet-roll.png",
    modelImg: "/images/rayzor/products/ldpe-machinery-cover.png",
  },
  {
    id: "3",
    title: "VCI Foil Barrier Bag",
    description: "Moisture-Proof Export Shield",
    prodImg: "/images/rayzor/products/foil-barrier-bag.png",
    modelImg: "/images/rayzor/products/foil-vacuum-seal.png",
  },
  {
    id: "4",
    title: "Clear Shrink Film",
    description: "Pallet Securing Stretch Wrap",
    prodImg: "/images/rayzor/products/shrink-film-roll.png",
    modelImg: "/images/rayzor/products/pallet-wrap-apply.png",
  },
  {
    id: "5",
    title: "VCI Emitter Pads",
    description: "Enclosed Cabinet Protection",
    prodImg: "/images/rayzor/products/vci-emitter-pad.png",
    modelImg: "/images/rayzor/products/emitter-pad-apply.png",
  },
  {
    id: "6",
    title: "VCI Paper Rolls",
    description: "Eco-Friendly Metal Wrap",
    prodImg: "/images/rayzor/products/vci-paper-roll.png",
    modelImg: "/images/rayzor/products/vci-paper-apply.png",
  },
  {
    id: "7",
    title: "Rustoxy VCI Pouch",
    description: "Auto-Parts Anti-Rust Sleeve",
    prodImg: "/images/rayzor/products/vci-film-roll.png",
    modelImg: "/images/rayzor/products/vci-engine-wrap.png",
  },
  {
    id: "8",
    title: "LDPE Container Liner",
    description: "Bulk Dry Cargo Transit Cover",
    prodImg: "/images/rayzor/products/ldpe-sheet-roll.png",
    modelImg: "/images/rayzor/products/ldpe-machinery-cover.png",
  },
  {
    id: "9",
    title: "Anti-Static LDPE Bags",
    description: "Electronics ESD Protection",
    prodImg: "/images/rayzor/products/shrink-film-roll.png",
    modelImg: "/images/rayzor/products/pallet-wrap-apply.png",
  },
  {
    id: "10",
    title: "Rustoxy Stretch Film",
    description: "High-Performance Hand Wrap",
    prodImg: "/images/rayzor/products/shrink-film-roll.png",
    modelImg: "/images/rayzor/products/pallet-wrap-apply.png",
  },
  {
    id: "11",
    title: "Custom VCI Sheets",
    description: "Heavy Equipment Layering",
    prodImg: "/images/rayzor/products/vci-film-roll.png",
    modelImg: "/images/rayzor/products/vci-engine-wrap.png",
  },
  {
    id: "12",
    title: "Desiccant Silica Gel",
    description: "Active Moisture Absorption",
    prodImg: "/images/rayzor/products/vci-emitter-pad.png",
    modelImg: "/images/rayzor/products/emitter-pad-apply.png",
  },
  {
    id: "13",
    title: "LDPE Pallet Covers",
    description: "Heavy Duty Weather Protection",
    prodImg: "/images/rayzor/products/ldpe-sheet-roll.png",
    modelImg: "/images/rayzor/products/ldpe-machinery-cover.png",
  },
  {
    id: "14",
    title: "VCI Gusset Bags",
    description: "Volumetric Steel Parts Storage",
    prodImg: "/images/rayzor/products/foil-barrier-bag.png",
    modelImg: "/images/rayzor/products/foil-vacuum-seal.png",
  },
  {
    id: "15",
    title: "Rustoxy Netting",
    description: "Corrosion & Scratch Shield",
    prodImg: "/images/rayzor/products/vci-paper-roll.png",
    modelImg: "/images/rayzor/products/vci-paper-apply.png",
  },
];

const COL_1_PRODUCTS = PRODUCTS.slice(0, 5);
const COL_2_PRODUCTS = PRODUCTS.slice(5, 10);
const COL_3_PRODUCTS = PRODUCTS.slice(10, 15);

export function ProductsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Mobile: staggered fade-in for the horizontal scroll cards
      mm.add("(max-width: 768px)", () => {
        const section = containerRef.current;
        if (!section) return;

        gsap.fromTo(
          section.querySelectorAll(".mobile-card"),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            },
          }
        );
      });

      // Desktop: 3-column scroll-pinned carousel
      mm.add("(min-width: 769px)", () => {
        const section = containerRef.current;
        if (!section) return;

        const col1List = section.querySelector(".col-1-list") as HTMLElement;
        const col2List = section.querySelector(".col-2-list") as HTMLElement;
        const col3List = section.querySelector(".col-3-list") as HTMLElement;

        const col1Box = section.querySelector(".col-1-box") as HTMLElement;
        const col2Box = section.querySelector(".col-2-box") as HTMLElement;
        const col3Box = section.querySelector(".col-3-box") as HTMLElement;

        if (
          !col1List ||
          !col2List ||
          !col3List ||
          !col1Box ||
          !col2Box ||
          !col3Box
        )
          return;

        // Calculate scroll distances (list height minus its container viewport height)
        const dist1 = col1List.offsetHeight - col1Box.offsetHeight;
        const dist2 = col2List.offsetHeight - col2Box.offsetHeight;
        const dist3 = col3List.offsetHeight - col3Box.offsetHeight;

        // Set initial positions:
        // Left (col1) and Right (col3) columns start offset upward (at the bottom of their lists)
        gsap.set(col1List, { y: -dist1 });
        gsap.set(col3List, { y: -dist3 });

        // Middle column starts normal (y: 0)
        gsap.set(col2List, { y: 0 });

        // Pin the entire section and scrub the translations
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=180%", // Adjust scroll length for smooth pacing
            scrub: 1.2, // Add slight lag for smoother scrub interaction
            pin: true,
            anticipatePin: 1,
          },
        });

        // Animate Left/Right down to y: 0, Middle up to y: -dist2
        tl.to(col1List, { y: 0, ease: "power1.inOut" }, 0)
          .to(col2List, { y: -dist2, ease: "power1.inOut" }, 0)
          .to(col3List, { y: 0, ease: "power1.inOut" }, 0);
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="bg-background overflow-x-hidden overflow-y-hidden relative py-10 md:py-16 md:h-screen md:flex md:flex-col md:justify-center w-full max-w-full"
    >
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-6 md:mb-10 text-center z-30 relative">
        <span className="inline-block text-[10px] md:text-xs font-bold text-brand uppercase tracking-widest mb-3 border border-brand/20 px-3 py-1 rounded-md">
          Our Product Lines
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-ink tracking-tight max-w-3xl mx-auto">
          Engineered Packaging Solutions
        </h2>
      </div>

      {/* ── MOBILE: 2x2 grid of first 4 products ── */}
      <div className="md:hidden w-full px-4 relative z-20">
        <div className="grid grid-cols-2 gap-3">
          {PRODUCTS.slice(0, 4).map((prod) => (
            <div key={`m-${prod.id}`} className="mobile-card">
              <ProductCard product={prod} />
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <span className="inline-block text-sm font-bold text-brand border border-brand/20 px-6 py-2.5 rounded-md cursor-default">
            View all 15 products
          </span>
        </div>
      </div>

      {/* ── DESKTOP: 3-column scroll-pinned carousel ── */}
      <div className="hidden md:grid w-full px-6 lg:px-8 mx-auto grid-cols-3 gap-5 lg:gap-6 h-[65vh] items-stretch overflow-hidden relative z-20">
        <div className="col-1-box w-full h-full overflow-hidden relative">
          <div className="col-1-list flex flex-col gap-6">
            {COL_1_PRODUCTS.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>

        <div className="col-2-box w-full h-full overflow-hidden relative">
          <div className="col-2-list flex flex-col gap-6">
            {COL_2_PRODUCTS.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>

        <div className="col-3-box w-full h-full overflow-hidden relative">
          <div className="col-3-list flex flex-col gap-6">
            {COL_3_PRODUCTS.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <figure className="group w-full cursor-pointer mobile-card">
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl border border-white/10 bg-white">
        {/* Product image — clean white bg, centered */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-8 bg-white group-hover:opacity-0 transition-opacity duration-500">
          <Image
            src={product.prodImg}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 30vw"
            className="object-contain p-8 group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* Application image — reveals on hover */}
        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Image
            src={product.modelImg}
            alt={`Application of ${product.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 30vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
        </div>

        {/* Hover content */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <h3 className="font-heading font-bold text-white text-base leading-snug mb-1">
            {product.title}
          </h3>
          <p className="text-white/60 text-[11px] mb-3">
            {product.description}
          </p>
          <span className="inline-flex items-center text-brand text-[11px] font-bold uppercase tracking-wider gap-1">
            View details →
          </span>
        </div>

        {/* Default bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 group-hover:opacity-0 transition-opacity duration-300 bg-ink/90 px-4 py-3">
          <h3 className="font-heading font-bold text-white text-sm leading-snug truncate">
            {product.title}
          </h3>
          <p className="text-white/50 text-[10px] mt-0.5 truncate">
            {product.description}
          </p>
        </div>
      </div>
    </figure>
  );
}
