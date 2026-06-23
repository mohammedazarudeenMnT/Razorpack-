"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SLIDES = [
  {
    id: "who-we-are",
    menuTitle: "Who We Are",
    boxTitle: "Rayzor Industrial Packaging",
    description:
      "Welcome to Rayzor Industrial Packaging Pvt Ltd, where expertise meets innovation. For over two decades, we've been the driving force behind tailor-made packaging solutions.",
    image: "/images/rayzor_manufacturing_hub.png",
  },
  {
    id: "specialized-solutions",
    menuTitle: "Specialized Solutions",
    boxTitle: "Comprehensive Product Range",
    description:
      "Specializing in VCI Film Rolls, Pouches, Bags, Sheets, LDPE Films, Pallet Covers, and Container Liners to cater to diverse industrial environments and supply chains.",
    image: "/images/rayzor_vci_film_rolls.png",
  },
  {
    id: "made-in-india",
    menuTitle: "Made in India Legacy",
    boxTitle: "Precision & Quality",
    description:
      "Our production hub in Madurai, Tamil Nadu stands as a testament to our commitment to precision. In-house production and strict quality standards ensure flexibility and reliability.",
    image: "/images/tn_made_in_india.png",
  },
  {
    id: "dedicated-collaboration",
    menuTitle: "Dedicated Collaboration",
    boxTitle: "Fast & Optimal Solutions",
    description:
      "Whether on the phone or on-site, our dedicated team collaborates with you. Our meticulously crafted bags offer premium protection against moisture, gases, and leaks.",
    image: "/images/tn_collaboration.png",
  },
];

export function AboutBusinessAreas() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 20%",
          scrub: 1,
        },
      });

      // Section bg: white → dark
      tl.fromTo(
        section,
        { backgroundColor: "#ffffff" },
        { backgroundColor: "#1b1c1d", ease: "none" },
        0,
      );

      // Heading text: dark → white
      tl.fromTo(
        section.querySelector(".business-title"),
        { color: "var(--brand-dark)" },
        { color: "var(--brand-white)", ease: "none" },
        0,
      );

      // Menu variables: light theme → dark theme
      tl.fromTo(
        section,
        {
          "--menu-text": "rgba(63,72,80,0.8)",
          "--menu-bg-active": "#f1f5f9",
          "--menu-hover-bg": "rgba(0,0,0,0.05)",
          "--menu-hover-text": "#000000",
        },
        {
          "--menu-text": "rgba(255,255,255,0.7)",
          "--menu-bg-active": "#252628",
          "--menu-hover-bg": "#202123",
          "--menu-hover-text": "#ffffff",
          ease: "none",
        },
        0,
      );

      // Overlay box fade in/out
      tl.fromTo(
        section.querySelector(".overlay-box"),
        { opacity: 0 },
        { opacity: 1, ease: "none" },
        0,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 lg:py-32 font-sans overflow-hidden transition-colors"
      style={{ backgroundColor: "#1b1c1d" }}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 flex flex-col lg:flex-row gap-12 xl:gap-20">
        {/* ── LEFT SIDEBAR ── */}
        <div className="w-full lg:w-[35%] xl:w-[30%] flex flex-col justify-center py-8 lg:py-0">
          <h2
            className="business-title text-5xl md:text-[4rem] font-heading font-extrabold tracking-tight mb-12 whitespace-nowrap"
            style={{ color: "var(--brand-white)" }}
          >
            <span>Business </span>
            <span className="text-[var(--brand-blue)]">Areas</span>
          </h2>

          <style>{`
            .menu-btn {
              background-color: transparent;
              color: var(--menu-text, rgba(255,255,255,0.7));
            }
            .menu-btn:hover {
              background-color: var(--menu-hover-bg, #202123);
              color: var(--menu-hover-text, #ffffff);
            }
            .menu-btn.active {
              background-color: var(--menu-bg-active, #252628);
              color: #38bdf8;
              box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
            }
          `}</style>

          <ul className="flex flex-col gap-4">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === activeIndex;
              return (
                <li key={slide.id}>
                  <button
                    onClick={() => setActiveIndex(idx)}
                    className={`menu-btn w-full text-left px-6 py-5 rounded-2xl text-[1.05rem] font-medium transition-all duration-300 ${isActive ? "active" : ""}`}
                  >
                    {slide.menuTitle}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── RIGHT SLIDER ── */}
        <div className="w-full lg:w-[65%] xl:w-[70%] relative h-[500px] md:h-[650px] lg:h-[750px]">
          {/* Images Wrapper with Overflow Hidden */}
          <div className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden bg-[#111]">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                    isActive
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.boxTitle}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              );
            })}
          </div>

          {/* Overlay Box - Inside image, bottom left corner! */}
          <div className="overlay-box absolute bottom-5 left-5 z-20 w-[calc(100%-3rem)] md:w-auto max-w-[450px]">
            <div className="bg-[#202123]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
              <h3 className="text-white text-2xl md:text-3xl font-medium mb-4 leading-tight">
                {SLIDES[activeIndex].boxTitle}
              </h3>
              <p className="text-white/80 text-sm md:text-[0.95rem] leading-relaxed mb-8 md:mb-12">
                {SLIDES[activeIndex].description}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 z-20 flex gap-3">
            <button
              onClick={handlePrev}
              className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors focus:outline-none"
              aria-label="Previous Slide"
            >
              <ChevronLeft
                className="w-5 h-5 md:w-6 md:h-6"
                strokeWidth={2.5}
              />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors focus:outline-none"
              aria-label="Next Slide"
            >
              <ChevronRight
                className="w-5 h-5 md:w-6 md:h-6"
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
