'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const STATIC_LOGOS = [
  { _id: '1', name: 'Google', logo: '/images/logos/google.svg' },
  { _id: '2', name: 'Amazon', logo: '/images/logos/amazon.svg' },
  { _id: '3', name: 'Cisco', logo: '/images/logos/cisco.svg' },
  { _id: '4', name: 'TCS', logo: '/images/logos/tcs.svg' },
  { _id: '5', name: 'Samsung', logo: '/images/logos/samsung.svg' },
];

export function ClientLogosSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <section className="py-12 bg-[#f7f5f0]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#1a3d2b]" />
          </div>
        </div>
      </section>
    );
  }

  // Duplicate logos multiple times for seamless loop on mobile
  const duplicatedLogos = [...STATIC_LOGOS, ...STATIC_LOGOS, ...STATIC_LOGOS];

  return (
    <section className="py-20 bg-surface overflow-hidden border-t border-line">
      <div className="container mx-auto px-6 mb-10">
        <div className="text-center mb-4">
          <span className="inline-block text-xs font-bold text-brand uppercase tracking-widest mb-4 border border-brand/20 px-3 py-1 rounded-md">
            Trusted By
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-ink">
            Our Happy Clients
          </h2>
        </div>
      </div>

      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f7f5f0] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f7f5f0] to-transparent z-10" />

        {/* Marquee Container */}
        <div className="marquee-container">
          <div className="marquee-content grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo._id}-${index}`}
                className="marquee-item shrink-0 mx-8 md:mx-12"
              >
                <div className="relative w-32 h-16 md:w-40 md:h-20 transition-all duration-300">
                  <Image
                    src={logo.logo}
                    alt={logo.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
        }

        .marquee-content {
          display: flex;
          align-items: center;
          animation: logos-marquee 40s linear infinite;
          will-change: transform;
          width: max-content;
        }

        .marquee-content:hover {
          animation-play-state: paused;
        }

        @keyframes logos-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @media (max-width: 768px) {
          .marquee-content {
            animation-duration: 25s;
          }
        }

        @media (max-width: 480px) {
          .marquee-content {
            animation-duration: 20s;
          }
        }
      `}</style>
    </section>
  );
}