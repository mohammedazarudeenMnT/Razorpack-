"use client"

import { TextReveal } from "@/components/ui/text-reveal"
import { RevealOnScroll } from "@/components/gsap/reveal-on-scroll"

export function AboutTextSection() {
  return (
    <section id="about" className="relative bg-surface overflow-hidden">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--brand-blue) 1px, transparent 1px), linear-gradient(to bottom, var(--brand-blue) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* TextReveal — scroll-driven word-by-word fade */}
      <TextReveal className="relative z-10 [&_span]:text-ink/15 [&_span_span]:text-ink">
        Delivering premium packaging solutions that protect your products and elevate your industry — 20 plus years of precision engineering from Madurai to the world.
      </TextReveal>

      {/* Bottom detail strip */}
      <div className="relative z-10 border-t border-line">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <RevealOnScroll effect="fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="font-mono text-[11px] text-brand uppercase tracking-wider block mb-1">
                  Who We Are
                </span>
                <p className="text-steel text-sm max-w-lg leading-relaxed">
                  Rayzor Industrial Packaging Pvt Ltd — ISO certified manufacturer of LDPE Film Rolls, VCI Poly Bags, and custom packaging materials in Madurai, Tamil Nadu.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-heading font-extrabold text-ink">20<span className="text-brand">+</span></p>
                  <p className="font-mono text-[10px] text-steel uppercase tracking-wider">Years</p>
                </div>
                <div className="w-px h-10 bg-line" />
                <div className="text-center">
                  <p className="text-2xl font-heading font-extrabold text-ink">16</p>
                  <p className="font-mono text-[10px] text-steel uppercase tracking-wider">Products</p>
                </div>
                <div className="w-px h-10 bg-line" />
                <div className="text-center">
                  <p className="text-2xl font-heading font-extrabold text-ink">7<span className="text-brand">+</span></p>
                  <p className="font-mono text-[10px] text-steel uppercase tracking-wider">OEM Partners</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
