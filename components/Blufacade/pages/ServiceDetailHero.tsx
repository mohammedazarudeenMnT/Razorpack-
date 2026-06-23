"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ServiceDetailHero({ serviceData }: { serviceData: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const imageWrapper = imageWrapperRef.current;
      const textWrapper = textWrapperRef.current;
      const bgText = bgTextRef.current;

      if (!container || !imageWrapper || !textWrapper || !bgText) return;

      // Pin the section and animate the image
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=150vh", // Scroll distance for the animation
          scrub: 1, // Smooth scrubbing
          pin: true,
          pinSpacing: true, // Keep the space so it scrolls normally after
        },
      });

      // Animate the image wrapper to expand to full screen
      tl.to(imageWrapper, {
        width: "100vw",
        height: "100vh",
        bottom: 0,
        right: 0,
        borderRadius: "0px",
        ease: "none",
      }, 0);

      // Fade out the left text slightly as the image takes over
      tl.to(textWrapper, {
        opacity: 0,
        y: -50,
        ease: "none",
      }, 0);

      // Parallax the massive background text
      tl.to(bgText, {
        y: "-20vh",
        ease: "none",
      }, 0);
    },
    { scope: containerRef }
  );

  // Generate a display name for the huge background text (first word or full name if short)
  const hugeText = serviceData.serviceName.split(" ")[0];

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden flex items-center">
      
      {/* Massive Background Typography (cut off at the absolute top) */}
      <h1 
        ref={bgTextRef}
        className="absolute top-[-25%] md:top-[-35%] left-0 w-full text-[clamp(15rem,25vw,35rem)] font-bold text-white tracking-tighter leading-[0.75] select-none whitespace-nowrap pointer-events-none z-0"
      >
        {hugeText}
      </h1>

      <div className="container relative z-10 mx-auto px-[4vw] h-full flex items-center justify-between">
        
        {/* Left Side: Text & Button */}
        <div ref={textWrapperRef} className="w-full lg:w-1/2 flex flex-col justify-center">
          <h2 className="text-[clamp(2.5rem,4vw,4rem)] font-medium text-white leading-[1.1] mb-10 max-w-xl">
            {serviceData.shortDescription || serviceData.serviceName}
          </h2>
          
          <div>
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center gap-3 bg-white text-[#0a0a0a] px-8 py-4 rounded-full font-medium hover:scale-105 transition-transform"
            >
              Get in touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Side: Image Wrapper (Starts Small, Scales Up) */}
        <div 
          ref={imageWrapperRef}
          className="absolute right-[4vw] bottom-[10vh] w-[40vw] h-[25vh] lg:w-[28vw] lg:h-[30vh] rounded-[2rem] overflow-hidden z-20 origin-bottom-right shadow-2xl"
        >
          <Image
            src={serviceData.image || "/images/placeholder.svg"}
            alt={serviceData.serviceName}
            fill
            className="object-cover"
            priority
          />
        </div>

      </div>
    </section>
  );
}
