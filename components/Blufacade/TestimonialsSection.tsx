"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2, Quote, Star } from "lucide-react";

// Animated number component
function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
}: {
  from?: number;
  to: number;
  duration?: number;
}) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    const animation = count.get();
    const controls = {
      start: () => {
        count.set(from);
        const startTime = Date.now();
        const animate = () => {
          const elapsed = (Date.now() - startTime) / 1000;
          const progress = Math.min(elapsed / duration, 1);
          count.set(from + (to - from) * progress);
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      },
    };
    controls.start();
  }, [to, duration, from]);

  useEffect(() => {
    const unsubscribe = rounded.onChange((value) => {
      setDisplayValue(value);
    });
    return () => unsubscribe();
  }, [rounded]);

  return <motion.span>{displayValue}</motion.span>;
}

const STATIC_TESTIMONIALS = [
  {
    _id: "static-1",
    name: "Vikram Logistics",
    location: "Chennai, TN",
    content:
      "Rayzorpack's LDPE films have completely eliminated our transit damage issues. The puncture resistance and stretchability are exactly what we needed for our heavy-duty pallets.",
    rating: 5,
    serviceType: "LDPE Film Rolls",
    avatar: "",
  },
  {
    _id: "static-2",
    name: "AutoParts India",
    location: "Pune, MH",
    content:
      "We shifted to their VCI Poly Bags 6 months ago, and our rust complaints have dropped to zero. Truly reliable anti-corrosion packaging.",
    rating: 5,
    serviceType: "VCI Poly Bags",
    avatar: "",
  },
  {
    _id: "static-3",
    name: "Kannan Textiles",
    location: "Tirupur, TN",
    content:
      "The custom printed LDPE bags provided by Rayzorpack not only protect our garments but also enhance our brand visibility. Great quality and timely delivery.",
    rating: 5,
    serviceType: "Custom LDPE Bags",
    avatar: "",
  },
  {
    _id: "static-4",
    name: "Global Exports",
    location: "Kochi, KL",
    content:
      "Their heavy-duty shrink films secure our shipments perfectly. We appreciate the consistent micron thickness and clarity in every single batch.",
    rating: 5,
    serviceType: "Shrink Films",
    avatar: "",
  },
];

export function TestimonialsSection() {
  const isLoading = false;
  const baseTestimonials = STATIC_TESTIMONIALS;

  // Split testimonials into two groups for two vertical columns
  const firstCol = baseTestimonials.filter((_, i) => i % 2 === 0);
  const secondCol = baseTestimonials.filter((_, i) => i % 2 !== 0);

  // Helper for horizontal scrolling marquee
  const HorizontalMarquee = ({
    items,
    reverse = false,
    duration = 30,
  }: {
    items: any[];
    reverse?: boolean;
    duration?: number;
  }) => {
    // Duplicate items for seamless loop
    const duplicatedItems = [...items, ...items, ...items, ...items];

    return (
      <div className="flex flex-row overflow-hidden w-full relative pointer-events-none fade-mask">
        {/* Fade gradient overlays */}
        <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#1a3d2b] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#1a3d2b] to-transparent z-10" />

        <motion.div
          animate={{
            x: reverse ? ["-75%", "0%"] : ["0%", "-75%"],
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex flex-row gap-6 py-4"
        >
          {duplicatedItems.map((testimonial, index) => (
            <div
              key={`${testimonial._id}-${index}`}
              className="w-[420px] shrink-0 bg-[#0f1a12]/50 backdrop-blur-md p-8 rounded-xl border border-white/5 relative flex flex-col pointer-events-auto group hover:bg-[#0f1a12]/80 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-white/5 group-hover:text-[#e8a020]/20 transition-colors" />

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "text-[#e8a020] fill-[#e8a020]"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>

              <p className="text-white/90 leading-relaxed mb-6 italic text-lg font-medium">
                "{testimonial.content}"
              </p>

              <div className="mt-auto flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#e8a020]/20 border border-[#e8a020]/30 shrink-0 flex items-center justify-center text-[#e8a020] font-black text-xl">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base leading-tight">
                    {testimonial.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] text-[#e8a020] font-bold">
                      {testimonial.location}
                    </span>
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
                      {testimonial.serviceType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <section
      id="testimonials"
      className="relative py-32 bg-[#1a3d2b] overflow-hidden"
    >
      {/* Background Subtle Patterns */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div className="absolute top-0 right-0 w-200 h-200 bg-[#e8a020]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-200 h-200 bg-[#0f1a12]/50 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative w-full max-w-[95%] xl:max-w-[1600px] mx-auto px-4 md:px-8 z-10 grid lg:grid-cols-[1fr_1.5fr] gap-12 items-center">
        {/* Left Content */}
        <div className="relative max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="inline-block text-xs font-bold text-brand uppercase tracking-widest mb-2 border border-brand/30 px-3 py-1 rounded-md">
              What They Say
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-extrabold text-white leading-[1.1] mb-6 md:mb-8"
          >
            Trusted by <br />
            <span className="text-brand">Industry</span> <br />
            Leaders
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg font-sans text-white/70 leading-relaxed mb-10"
          >
            Our commitment to quality manufacturing and engineering precision has
            made us the preferred packaging partner for top industrial brands.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-8 py-10 border-y border-white/10"
          >
            <div>
              <div className="text-5xl font-heading font-black text-white">
                <AnimatedCounter to={500} duration={2.5} />
                <span className="text-[#e8a020]">+</span>
              </div>
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-2">
                Clients Served
              </div>
            </div>
            <div>
              <div className="text-5xl font-heading font-black text-white">
                <AnimatedCounter to={98} duration={2.5} />
                <span className="text-[#e8a020]">%</span>
              </div>
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-2">
                Satisfaction Rate
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Columns (Marquee) */}
        <div className="flex flex-col gap-6 relative w-full overflow-hidden">
          <HorizontalMarquee items={firstCol} duration={60} />
          <HorizontalMarquee items={secondCol} reverse={true} duration={65} />
        </div>
      </div>
    </section>
  );
}
