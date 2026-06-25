"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface ServiceData {
  serviceName: string;
  category: string;
  description: string;
  image: string;
}

interface ServicesSectionProps {
  initialServices: ServiceData[];
}

export function ServicesSection({ initialServices }: ServicesSectionProps) {
  const containerRef = useRef<HTMLElement>(null);

  // Map server-provided services to the card format
  const SERVICES = initialServices.map((s, i) => ({
    id: String(i + 1).padStart(2, "0"),
    cardTitle: s.category || "Core Solutions",
    cardHeading: s.serviceName,
    cardText: s.description?.replace(/<[^>]+>/g, "").slice(0, 200) || "",
    bgImage: s.image,
  }));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const count = SERVICES.length;
      if (count === 0) return;

      mm.add("(min-width: 0px)", () => {
        const section = containerRef.current;
        if (!section) return;

        // Hide all cards/bg except first
        for (let i = 1; i < count; i++) {
          gsap.set(`.card-${i}`, { y: "100vh", opacity: 0 });
          gsap.set(`.bg-panel-${i}`, { opacity: 0 });
        }

        // If only 1 service, no scroll animation needed
        if (count <= 1) return;

        const scrollLength = `+=${count * 100}%`;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: scrollLength,
            pin: true,
            scrub: 1,
          },
        });

        // Build transitions dynamically
        for (let i = 0; i < count; i++) {
          // Hold current service
          tl.to({}, { duration: 1 });

          // Transition to next (skip for last)
          if (i < count - 1) {
            const label = `trans${i + 1}`;
            tl.addLabel(label)
              .to(`.card-${i}`, { y: "-100vh", opacity: 0, duration: 1, ease: "power2.inOut" }, label)
              .to(`.bg-panel-${i}`, { opacity: 0, duration: 1, ease: "power2.inOut" }, label)
              .to(`.bg-panel-${i + 1}`, { opacity: 1, duration: 1, ease: "power2.inOut" }, label)
              .to(`.card-${i + 1}`, { y: "0vh", opacity: 1, duration: 1, ease: "power2.inOut" }, label);
          }
        }

        // Parallax on backgrounds
        gsap.to(".parallax-bg", {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: scrollLength,
            scrub: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [SERVICES.length] },
  );

  if (SERVICES.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] bg-[#1b1c19] overflow-hidden"
    >
      {/* ══════════ UNIVERSAL PINNED LAYOUT ══════════ */}

      {/* Background Layers */}
      <div className="absolute inset-0 w-full h-full pointer-events-none bg-[#1b1c19]">
        {SERVICES.map((service, i) => (
          <div
            key={`bg-${service.id}`}
            className={`bg-panel-${i} absolute inset-0 w-full h-full overflow-hidden`}
            style={{ zIndex: i }}
          >
            <div className="absolute inset-0 w-full h-full scale-[1.15] origin-center">
              <Image
                src={service.bgImage}
                alt={service.cardTitle}
                fill
                sizes="100vw"
                className="parallax-bg object-cover brightness-[0.55]"
                priority={i === 0}
              />
            </div>
            {/* Darker gradient on mobile so text is legible */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1b1c19]/95 via-[#1b1c19]/60 lg:via-[#1b1c19]/50 to-transparent" />
          </div>
        ))}
      </div>

      {/* Foreground Content — always side-by-side on desktop */}
      <div className="relative z-10 w-full h-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 flex flex-row items-center pointer-events-none">
        {/* Left: heading — vertically centered */}
        <div className="w-[38%] lg:w-[40%] xl:w-[42%]">
          <h2
            className="text-[#fff] font-bold tracking-tight leading-[1.1]"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }}
          >
            Our Service <br />
            <span className="text-[var(--brand-blue)]">and Sectors</span>
          </h2>
        </div>

        {/* Right: Cards — vertically centered */}
        <div className="relative w-[62%] lg:w-[60%] xl:w-[55%] h-full flex justify-end items-center">
          {SERVICES.map((service, i) => (
            <div
              key={`card-${service.id}`}
              className={`card-${i} absolute w-full max-w-[400px] lg:max-w-[440px] xl:max-w-[520px] 2xl:max-w-[580px] bg-[#fff] p-4 lg:p-6 xl:p-10 2xl:p-12 shadow-2xl pointer-events-auto`}
              style={{ zIndex: i }}
            >
              <div className="absolute top-0 right-0 w-10 h-10 lg:w-14 lg:h-14 xl:w-20 xl:h-20 bg-[var(--brand-blue)]" />
              <div className="relative z-10">
                <span
                  className="text-[var(--brand-blue)] mb-2 lg:mb-3 block font-bold uppercase tracking-wider"
                  style={{ fontSize: "clamp(0.6rem, 1vw, 1rem)" }}
                >
                  {service.cardTitle}
                </span>
                <h3
                  className="font-semibold text-[#1b1c19] leading-tight mb-2 lg:mb-4 xl:mb-6 tracking-tight"
                  style={{ fontSize: "clamp(1rem, 2.5vw, 2.5rem)" }}
                >
                  {service.cardHeading}
                </h3>
                <p
                  className="text-[#30312e] leading-relaxed font-medium"
                  style={{ fontSize: "clamp(0.6rem, 1vw, 1rem)" }}
                >
                  {service.cardText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
