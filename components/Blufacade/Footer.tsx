"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Lucide from "lucide-react";
import { siteConfig } from "@/config/site";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { label: "Header", href: "/" },
    { label: "Details", href: "/about" },
    { label: "Specs", href: "/services" },
    { label: "Gallery", href: "/portfolio" },
  ];

  const productLinks = [
    { label: "LDPE Film Rolls", href: "/services/ldpe-film-rolls" },
    { label: "LDPE Bags", href: "/services/ldpe-bags" },
    { label: "VCI Poly Bags", href: "/services/vci-poly-bags" },
    { label: "Stretch Films", href: "/services/stretch-films" },
    { label: "HDPE Bags", href: "/services/hdpe-bags" },
    { label: "Bubble Wrap", href: "/services/bubble-wrap" },
  ];

  const socialLinks = [
    { label: "Website", href: "/" },
    { label: "Facebook", href: siteConfig.social.facebook || "#" },
    { label: "Twitter", href: siteConfig.social.twitter || "#" },
    { label: "Instagram", href: siteConfig.social.instagram || "#" },
  ];

  useGSAP(
    () => {
      if (!watermarkRef.current) return;

      // Scroll trigger fade in and scale
      gsap.fromTo(
        watermarkRef.current,
        {
          y: "20%",
          opacity: 0,
          scale: 0.95,
        },
        {
          y: "0%",
          opacity: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );

      // Continuous loop for a shining shimmer highlight sheen sweeping across the watermark
      gsap.to(watermarkRef.current, {
        backgroundPosition: "200% center",
        duration: 8,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: containerRef },
  );

  return (
    <footer
      ref={containerRef}
      className="relative bg-surface text-ink py-10 md:py-16 overflow-hidden"
    >
      {/* ── Top divider: branded strip ── */}
      <div className="relative z-10 flex items-center gap-4 max-w-7xl mx-auto px-6 md:px-12 -mt-6 md:-mt-8 mb-8 md:mb-12">
        <div className="flex-1 h-px bg-linear-to-r from-transparent to-line" />
        <div className="flex items-center gap-2.5 bg-surface px-4 py-2">
          <Image
            src="/images/rayzor/logo/Rayzor Final Logo File-03.png"
            alt="Rayzorpack"
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
          />
          <span className="font-heading font-extrabold text-sm tracking-tight">
            <span className="text-[#2D2D2D]">RAYZOR</span><span className="text-[#44B8E8]">PACK</span>
          </span>
        </div>
        <div className="flex-1 h-px bg-linear-to-l from-transparent to-line" />
      </div>

      {/* Gigantic watermark text in background */}
      <div className="absolute inset-x-0 -bottom-8 hidden md:flex justify-center items-end select-none pointer-events-none z-0 overflow-hidden h-full">
        <span
          ref={watermarkRef}
          className="text-[18vw] font-sans font-black tracking-tighter leading-none uppercase bg-clip-text text-transparent origin-bottom will-change-transform"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(45,45,45,0.06) 15%, rgba(45,45,45,0.2) 40%, rgba(68,184,232,0.15) 60%, rgba(68,184,232,0.25) 75%, rgba(45,45,45,0.06) 90%)",
            backgroundSize: "200% auto",
            backgroundPosition: "0% center",
          }}
        >
          RAYZORPACK
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 pb-10 md:pb-16">
          {/* Column 1: Navigation */}
          <div className="lg:col-span-2">
            <h3 className="font-sans font-extrabold text-[#1b1c19] text-lg tracking-tight mb-6">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-neutral-500 hover:text-[#006196] transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Other Pages */}
          <div className="lg:col-span-3">
            <h3 className="font-sans font-extrabold text-[#1b1c19] text-lg tracking-tight mb-6">
              Other Pages
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-neutral-500 hover:text-[#006196] transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div className="lg:col-span-3">
            <h3 className="font-sans font-extrabold text-[#1b1c19] text-lg tracking-tight mb-6">
              Social Media
            </h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href !== "/" ? "_blank" : undefined}
                    rel={link.href !== "/" ? "noopener noreferrer" : undefined}
                    className="text-neutral-500 hover:text-[#006196] transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-4 flex flex-col justify-start">
            <h3 className="font-sans font-extrabold text-ink text-base md:text-lg tracking-tight mb-3 md:mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-steel text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
              Stay up-to-date with Rayzorpack latest packaging innovations,
              products launch, and other cool things - all delivered in your
              inbox.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-4 max-w-sm"
            >
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full bg-transparent border-b border-[#bfc7d2] py-2 text-sm text-[#1b1c19] placeholder-neutral-400 focus:outline-none focus:border-[#006196] transition-colors font-medium"
                required
              />
              <button
                type="submit"
                className="bg-[#1b1c19] hover:bg-[#006196] text-white px-6 py-2.5 rounded-full text-sm font-bold w-fit transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-line pt-6 md:pt-8 flex flex-col items-center md:flex-row md:justify-between gap-4 md:gap-6 relative z-10 text-center md:text-left">
          {/* Terms and Privacy */}
          <div className="flex gap-4 md:gap-6 text-xs md:text-sm font-bold text-ink">
            <Link
              href="/terms-conditions"
              className="hover:text-[#006196] transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-[#006196] transition-colors"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-xs md:text-sm text-steel font-medium">
            © 2026 Rayzor Industrial Packaging Pvt Ltd.
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2.5 group hover:opacity-85 transition-opacity"
            aria-label="Scroll to top"
          >
            <div className="border border-[#1b1c19] px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#1b1c19] flex items-center justify-center">
              Back to Top
            </div>
            <div className="w-8 h-8 rounded-full border border-[#1b1c19] flex items-center justify-center text-[#1b1c19] group-hover:bg-[#1b1c19] group-hover:text-white transition-all">
              <Lucide.ArrowUpRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
