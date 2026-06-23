"use client"

import React from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function AboutHero() {
  const cards = [
    {
      title: "Rayzorpack Holding",
      description: "An industrial packaging leader shaping the protective materials, sustainable solutions, and supply chain foundation of the global economy.",
      linkText: "MORE",
      linkHref: "/about/holding",
    },
    {
      title: "Business Areas",
      description: "The Group unites specialized facilities across key sectors — from VCI protective films and bulk packaging to automation technology and logistics.",
      linkText: "MORE",
      linkHref: "/about/business-areas",
    },
    {
      title: "Integrated Model",
      description: "Our operating model is built on deep material science, high vertical integration, and proprietary engineering capabilities to deliver unmatched reliability.",
      linkText: "MORE",
      linkHref: "/about/integrated-model",
    },
    {
      title: "Development Strategy",
      description: "A long-term strategy focused on expanding our global manufacturing base and strengthening our role as the premier partner in industrial packaging.",
      linkText: "MORE",
      linkHref: "/about/strategy",
    },
  ]

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-screen bg-white flex flex-col justify-end pb-0 overflow-hidden font-sans pt-24 lg:pt-0">
      
      {/* ── 1. RIGHT SIDE CONTENT ── */}
      <div className="right-content absolute top-[15%] lg:top-[20%] right-6 lg:right-12 xl:right-20 pointer-events-none z-[1] max-w-[45%] lg:max-w-sm xl:max-w-md text-left hidden lg:block">
        {/* Accent line */}
        <div className="w-10 h-1 bg-[var(--brand-blue)] mb-5 rounded-full" />
        <span className="text-[var(--brand-blue)] text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] mb-3 block">About Rayzorpack</span>
        <h1 className="text-[var(--brand-dark)] font-heading font-extrabold leading-[1.1] tracking-tight text-2xl lg:text-3xl xl:text-4xl mb-4">
          25+ Years of<br />
          <span className="text-[var(--brand-blue)]">Industrial Excellence</span>
        </h1>
        <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
          From our manufacturing hub in Madurai, we engineer precision packaging solutions trusted by 500+ global clients across automotive, electronics, and heavy industry sectors.
        </p>
        {/* Stats row */}
        <div className="flex gap-8">
          <div>
            <span className="text-[var(--brand-dark)] font-heading font-extrabold text-2xl xl:text-3xl">500+</span>
            <span className="block text-[#6B7280] text-[10px] uppercase tracking-wider mt-1">Clients</span>
          </div>
          <div>
            <span className="text-[var(--brand-dark)] font-heading font-extrabold text-2xl xl:text-3xl">20+</span>
            <span className="block text-[#6B7280] text-[10px] uppercase tracking-wider mt-1">Countries</span>
          </div>
          <div>
            <span className="text-[var(--brand-dark)] font-heading font-extrabold text-2xl xl:text-3xl">99%</span>
            <span className="block text-[#6B7280] text-[10px] uppercase tracking-wider mt-1">On-Time</span>
          </div>
        </div>
      </div>

      {/* ── 2. BACKGROUND IMAGE W/ COMPLEX MASK (Rendered OVER the text) ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden flex justify-start">
        {/* We place the image strictly on the left side on desktop, and mask it to blend beautifully into the white background on the right */}
        <div
          className="relative w-full h-full"
          style={{ clipPath: "polygon(0 0, 70% 0, 55% 100%, 0 100%)" }}
        >
          <Image
            src="/images/tn_about_hero.png"
            alt="Rayzorpack Manufacturing Hub - Madurai, Tamil Nadu"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Bottom fade so cards sit cleanly */}
          <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-white via-white/70 to-transparent" />
        </div>
      </div>

      {/* ── OVERLAPPING CARDS GRID ── */}
      <div className="relative z-10 w-full px-4 lg:px-12 xl:px-24 pb-6 lg:pb-12 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="about-card group relative bg-white rounded-xl p-5 lg:p-6 border border-gray-100 shadow-lg flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <h3 className="text-gray-900 text-xl lg:text-2xl font-bold mb-4 tracking-wide">
                {card.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-12 flex-grow">
                {card.description}
              </p>
              
              <a 
                href={card.linkHref} 
                className="mt-auto inline-flex items-center justify-between text-[var(--brand-blue)] font-bold tracking-widest text-sm uppercase transition-colors group-hover:text-[var(--brand-blue)]"
              >
                <span>{card.linkText}</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
