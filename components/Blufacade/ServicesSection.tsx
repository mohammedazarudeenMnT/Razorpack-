"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useMemo } from "react";
import { siteConfig } from "@/config/site";
import { RevealOnScroll } from "@/components/gsap/reveal-on-scroll";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionValue,
} from "motion/react";

const serviceImages: Record<string, string> = {
  "ldpe-film-rolls": "/images/rayzor/services/ldpe-film-rolls.jpg",
  "ldpe-bags": "/images/rayzor/services/ldpe-bags.jpg",
  "vci-poly-bags": "/images/rayzor/services/vci-poly-bags.jpg",
  "stretch-films": "/images/rayzor/services/stretch-films.jpg",
  "hdpe-bags": "/images/rayzor/services/hdpe-bags.jpg",
  "bubble-wrap": "/images/rayzor/services/bubble-wrap.jpg",
};

const serviceSquares: Record<string, { x: number; y: number; size: number }[]> =
  {
    "ldpe-film-rolls": [
      { x: 5, y: 30, size: 16 },
      { x: 10, y: 42, size: 10 },
      { x: 3, y: 52, size: 7 },
      { x: 80, y: 70, size: 14 },
      { x: 85, y: 82, size: 9 },
    ],
    "ldpe-bags": [
      { x: 82, y: 55, size: 16 },
      { x: 88, y: 68, size: 10 },
      { x: 78, y: 72, size: 7 },
      { x: 85, y: 42, size: 6 },
      { x: 90, y: 80, size: 8 },
    ],
    "vci-poly-bags": [
      { x: 4, y: 24, size: 16 },
      { x: 10, y: 36, size: 10 },
      { x: 2, y: 44, size: 7 },
      { x: 78, y: 78, size: 14 },
      { x: 84, y: 88, size: 8 },
    ],
    "stretch-films": [
      { x: 82, y: 26, size: 14 },
      { x: 88, y: 38, size: 10 },
      { x: 78, y: 44, size: 7 },
      { x: 84, y: 54, size: 5 },
      { x: 90, y: 60, size: 8 },
    ],
    "hdpe-bags": [
      { x: 6, y: 28, size: 14 },
      { x: 12, y: 40, size: 10 },
      { x: 4, y: 50, size: 7 },
      { x: 82, y: 72, size: 12 },
      { x: 88, y: 84, size: 8 },
    ],
    "bubble-wrap": [
      { x: 80, y: 30, size: 16 },
      { x: 86, y: 44, size: 10 },
      { x: 76, y: 50, size: 7 },
      { x: 82, y: 60, size: 6 },
      { x: 88, y: 70, size: 8 },
    ],
  };

const GRID_COLS = 12;
const GRID_ROWS = 8;

/* ------------------------------------------------------------------ */
/*  PIXEL OVERLAY                                                      */
/* ------------------------------------------------------------------ */

function PixelOverlay() {
  const cells = useMemo(() => {
    const arr: { row: number; col: number }[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        arr.push({ row: r, col: c });
      }
    }
    return arr;
  }, []);

  return (
    <>
      <style>{`
        .svc-pixel-cell {
          position: absolute;
          background: rgba(0,0,0,0.8);
          opacity: 0;
          transform: scale(0);
          transition: opacity 0.25s, transform 0.25s;
          transition-delay: var(--delay-out);
        }
        .group:hover .svc-pixel-cell {
          opacity: 1;
          transform: scale(1);
          transition-delay: var(--delay-in) !important;
        }
      `}</style>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 5 }}
      >
        {cells.map(({ row, col }) => {
          const delayIn = (row + col) * 0.018;
          const delayOut = (GRID_ROWS - row + (GRID_COLS - col)) * 0.012;
          return (
            <div
              key={`${row}-${col}`}
              className="svc-pixel-cell"
              style={
                {
                  left: `${(col / GRID_COLS) * 100}%`,
                  top: `${(row / GRID_ROWS) * 100}%`,
                  width: `${100 / GRID_COLS}%`,
                  height: `${100 / GRID_ROWS}%`,
                  "--delay-in": `${delayIn}s`,
                  "--delay-out": `${delayOut}s`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  MAGNETIC SQUARE                                                    */
/* ------------------------------------------------------------------ */

function MagneticSquare({
  x,
  y,
  size,
  pointerX,
  pointerY,
}: {
  x: number;
  y: number;
  size: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const centerX = x / 100;
  const centerY = y / 100;
  const tx = useTransform(pointerX, (px) => (px - centerX) * 40);
  const ty = useTransform(pointerY, (py) => (py - centerY) * 40);
  const sx = useSpring(tx, { stiffness: 80, damping: 18, mass: 0.6 });
  const sy = useSpring(ty, { stiffness: 80, damping: 18, mass: 0.6 });

  return (
    <motion.div
      className="pointer-events-none absolute bg-black"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        x: sx,
        y: sy,
        zIndex: 6,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SERVICE CARD                                                       */
/* ------------------------------------------------------------------ */

function ServiceCard({
  service,
  index,
}: {
  service: { id: string; title: string; description: string; icon: string };
  index: number;
}) {
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const cardRef = useRef<HTMLDivElement>(null);
  const squares = serviceSquares[service.id] || [];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set((e.clientX - rect.left) / rect.width);
    pointerY.set((e.clientY - rect.top) / rect.height);
  };

  const handlePointerLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/services/${service.id}`} className="block">
        <div
          ref={cardRef}
          className="group relative overflow-hidden rounded-md"
          style={{ aspectRatio: "4/3" }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          {/* Background image */}
          <Image
            src={
              serviceImages[service.id] ||
              "/images/rayzor/services/hero-services.jpg"
            }
            alt={service.title}
            fill
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Pixel-block hover overlay */}
          <PixelOverlay />

          {/* Magnetic squares */}
          {squares.map((sq, i) => (
            <MagneticSquare
              key={i}
              x={sq.x}
              y={sq.y}
              size={sq.size}
              pointerX={pointerX}
              pointerY={pointerY}
            />
          ))}

          {/* Info bar — full-width bottom, dark overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-linear-to-t from-ink via-ink/90 to-transparent pt-16 pb-5 px-5">
            <h3 className="font-heading font-bold text-white text-lg leading-snug mb-1">
              {service.title}
            </h3>
            <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
              {service.description}
            </p>
            <div className="flex items-center gap-1.5 text-brand text-xs font-bold mt-3 group-hover:gap-3 transition-all">
              View Details
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  SECTION                                                            */
/* ------------------------------------------------------------------ */

export function ServicesSection() {
  const services = siteConfig.services;

  return (
    <section
      id="services"
      className="relative bg-surface py-12 overflow-hidden"
    >
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8">
        {/* ─── SECTION HEADER ─── */}
        <div className="mb-8 md:mb-16 text-center">
          <span className="inline-block text-[10px] md:text-xs font-bold text-brand uppercase tracking-widest mb-3 md:mb-4 border border-brand/20 px-3 py-1 rounded-md">
            Our Services
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold text-ink tracking-tight max-w-3xl mx-auto">
            Industrial Packaging Solutions
          </h2>
          <p className="text-steel text-sm md:text-base mt-3 md:mt-4 max-w-xl mx-auto px-2">
            Engineered for durability — from LDPE film rolls to VCI anti-corrosion solutions
          </p>
        </div>

        {/* ─── HERO IMAGE ─── */}
        <RevealOnScroll effect="fadeIn">
          <div className="relative w-full aspect-4/3 sm:aspect-3/1 md:aspect-16/5 rounded-md overflow-hidden mb-8 md:mb-16 border border-line">
            <Image
              src="/images/rayzor/services/hero-services.jpg"
              alt="Rayzor Industrial Packaging facility"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />
            <div className="absolute inset-0 z-10 flex flex-col justify-center p-6 md:p-12">
              <span className="inline-block px-3 py-1 mb-3 md:mb-4 w-fit rounded-md bg-brand text-white text-[10px] md:text-xs font-bold uppercase tracking-widest">
                Our Services
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-[1.1] tracking-tight max-w-lg">
                How we protect
                <br />
                your components
                <br />
                across the world
              </h2>
            </div>
          </div>
        </RevealOnScroll>

        {/* ─── 3×2 Service cards grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
