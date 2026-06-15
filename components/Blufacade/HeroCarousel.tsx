"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { ArrowRight, ArrowLeft } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

const AUTOPLAY_MS = 6000

const slides = [
  {
    tag: "01 — VCI / ANTI-CORROSION",
    title: (
      <>
        Protection,
        <br />
        <span className="text-brand">Engineered.</span>
      </>
    ),
    description:
      "Tailor-made VCI films under the Rustoxy brand shield automotive, electronics and food-industry components from corrosion — no oiling required.",
    image: "/images/rayzor/vci-film-rolls.png",
    alt: "VCI anti-corrosion film rolls in navy duotone",
    annotation: "VCI FILM ROLL — RUSTOXY",
    primary: { label: "Explore Products", href: "/services" },
    secondary: { label: "Get an Enquiry", href: "/contact" },
  },
  {
    tag: "02 — LDPE / FLEXIBLE",
    title: (
      <>
        Certified LDPE,
        <br />
        <span className="text-brand">Built to Spec.</span>
      </>
    ),
    description:
      "Durable, moisture-resistant film rolls, pouches, bags and sheets — manufactured in-house at our Madurai facility for over two decades.",
    image: "/images/rayzor/ldpe-film.png",
    alt: "LDPE flexible industrial film close-up",
    annotation: "LDPE FILM — GAUGE: CUSTOM",
    primary: { label: "Explore Products", href: "/services" },
    secondary: { label: "Get an Enquiry", href: "/contact" },
  },
  {
    tag: "03 — SPECIALTY",
    title: (
      <>
        16 Product Lines.
        <br />
        <span className="text-brand">One Partner.</span>
      </>
    ),
    description:
      "Pallet covers, container liners, shrink and antistatic films — trusted by Foxconn, Royal Enfield, Asian Paints and other OEM partners.",
    image: "/images/rayzor/hero-film-roll.png",
    alt: "Industrial film roll in studio lighting",
    annotation: "MADE IN MADURAI — IN",
    primary: { label: "Explore Products", href: "/services" },
    secondary: { label: "Get an Enquiry", href: "/contact" },
  },
]

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const autoplay = useRef(
    Autoplay({ delay: AUTOPLAY_MS, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const onSelect = useCallback((emblaApi: NonNullable<CarouselApi>) => {
    setCurrent(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <section className="relative bg-surface structural-grid border-b border-line pt-20 md:pt-24">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.tag}>
              <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                {/* Text */}
                <div className="md:col-span-7 flex flex-col items-start">
                  <span className="font-mono text-label-sm uppercase text-brand mb-6">
                    {slide.tag}
                  </span>
                  <h1 className="text-display-lg-mobile md:text-display-lg text-ink mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-body-lg text-steel max-w-xl mb-10">
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href={slide.primary.href}
                      className="inline-flex items-center gap-2 bg-primary text-white text-label-md uppercase px-8 py-4 rounded-md hover:bg-ink transition-colors group"
                    >
                      {slide.primary.label}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href={slide.secondary.href}
                      className="inline-flex items-center gap-2 bg-amber text-amber-ink text-label-md uppercase px-8 py-4 rounded-md hover:bg-brand-deep hover:text-white transition-colors"
                    >
                      {slide.secondary.label}
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div className="md:col-span-5 relative">
                  <div className="relative border border-line bg-white p-1">
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      width={760}
                      height={570}
                      priority={index === 0}
                      className="w-full aspect-[4/3] object-cover"
                    />
                    <div className="absolute -bottom-4 -left-4 bg-surface border border-line px-3 py-1.5 font-mono text-label-sm uppercase text-brand-deep">
                      {slide.annotation}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Controls + progress (carousel-08 pattern) */}
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 pb-10 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => api?.scrollPrev()}
              className="w-11 h-11 border border-line rounded-md flex items-center justify-center text-ink hover:bg-ink hover:text-white hover:border-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => api?.scrollNext()}
              className="w-11 h-11 border border-line rounded-md flex items-center justify-center text-ink hover:bg-ink hover:text-white hover:border-ink transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <span className="font-mono text-label-sm text-steel tabular-nums">
            {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>

          <div className="flex-1 flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.tag}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className="flex-1 py-2 group"
              >
                <span
                  className={`block h-0.5 transition-colors ${
                    index === current ? "bg-brand" : "bg-line group-hover:bg-steel"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </Carousel>
    </section>
  )
}
