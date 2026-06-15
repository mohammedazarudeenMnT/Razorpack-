"use client"

import Image from "next/image"
import { useState, useRef, useCallback, useEffect } from "react"
import Autoplay from "embla-carousel-autoplay"
import * as Lucide from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import Link from "next/link"

interface Slide {
  id: string
  imageUrl: string
  title: string
  highlight: string
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
}

const staticSlides: Slide[] = [
  {
    id: "slide-1",
    imageUrl: "/images/rayzor/hero-carousel/banner-6.png",
    title: "We're India's —",
    highlight: "Packaging Engineers.",
    description:
      "we don't just manufacture films — we engineer your entire packaging supply chain. From concept creation to factory production and global export.",
    primaryCta: { label: "Our Products", href: "/services" },
    secondaryCta: { label: "Get Enquiry", href: "/contact" },
  },
  {
    id: "slide-2",
    imageUrl: "/images/rayzor/hero-carousel/banner-7.png",
    title: "Performance,",
    highlight: "Protected.",
    description:
      "Durable, moisture-resistant LDPE film rolls, pouches, bags and sheets — manufactured in-house at our Madurai facility for over two decades.",
    primaryCta: { label: "View LDPE Range", href: "/services" },
    secondaryCta: { label: "Get Enquiry", href: "/contact" },
  },
  {
    id: "slide-3",
    imageUrl: "/images/rayzor/hero-carousel/banner-8.png",
    title: "Engineered",
    highlight: "For Export.",
    description:
      "Container liners, pallet covers, and export-grade palletization — from concept to container, we manage your packaging with precision.",
    primaryCta: { label: "Our Solutions", href: "/services" },
    secondaryCta: { label: "Contact Us", href: "/contact" },
  },
]

export function HeroSection() {
  const [slides] = useState<Slide[]>(staticSlides)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const autoplayRef = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true, playOnInit: true })
  )

  const handleSelect = useCallback(() => {
    if (api) setCurrent(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on("select", handleSelect)
    api.on("reInit", handleSelect)
    return () => {
      api.off("select", handleSelect)
      api.off("reInit", handleSelect)
    }
  }, [api, handleSelect])

  return (
    <section className="relative w-full overflow-hidden bg-ink">
      <Carousel
        setApi={setApi}
        plugins={[autoplayRef.current]}
        opts={{ loop: true, duration: 30, skipSnaps: false }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((s, index) => (
            <CarouselItem key={s.id} className="basis-full min-w-0 shrink-0 grow-0">
              {/* Full-height slide */}
              <div className="relative w-full" style={{ height: "calc(100vh - 64px)", minHeight: 500 }}>

                {/* ── IMAGE: fills entire slide ── */}
                <Image
                  src={s.imageUrl}
                  alt={s.title + " " + s.highlight}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority={index === 0}
                  quality={90}
                />

                {/* ── WHITE CARD: top-left, floating over image ── */}
                <div className="absolute top-0 left-0 z-20 bg-white/95 backdrop-blur-md p-4 sm:p-5 md:p-7 lg:p-10 xl:p-12 w-[70%] sm:w-[50%] md:w-[38%] lg:w-[32%] xl:w-[28%] shadow-2xl" style={{ borderBottomRightRadius: "1.25rem" }}>
                  <p className="text-brand text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2 md:mb-3">
                    Rayzor Industrial Packaging
                  </p>
                  <h1
                    className="font-heading text-ink"
                    style={{
                      fontSize: "clamp(1.3rem, 2.5vw, 2.8rem)",
                      fontWeight: 700,
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.title}
                    <br />
                    {s.highlight}
                  </h1>
                  <p className="text-steel text-xs lg:text-sm leading-relaxed mt-3 lg:mt-4 max-w-xs lg:max-w-sm hidden md:block line-clamp-3">
                    {s.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3 sm:mt-4 md:mt-5 lg:mt-6">
                    <Link
                      href={s.primaryCta.href}
                      className="inline-flex items-center gap-1 bg-brand text-white text-[10px] sm:text-[11px] md:text-xs lg:text-[13px] font-bold px-3 sm:px-4 md:px-5 lg:px-7 py-2 sm:py-2.5 md:py-2.5 lg:py-3 rounded-full hover:bg-brand-deep transition-colors shadow-md whitespace-nowrap"
                    >
                      {s.primaryCta.label}
                      <Lucide.ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </Link>
                    <Link
                      href={s.secondaryCta.href}
                      className="inline-flex items-center text-ink text-[10px] sm:text-[11px] md:text-xs lg:text-[13px] font-bold px-3 sm:px-4 md:px-5 lg:px-7 py-2 sm:py-2.5 md:py-2.5 lg:py-3 rounded-full border border-ink/15 hover:bg-ink hover:text-white transition-colors whitespace-nowrap"
                    >
                      {s.secondaryCta.label}
                    </Link>
                  </div>
                </div>


              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* ── SLIDE INDICATORS ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 bg-ink/40 backdrop-blur-sm px-4 py-2 rounded-full">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full ${
                index === current
                  ? "w-7 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
