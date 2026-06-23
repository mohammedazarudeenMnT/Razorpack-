"use client"

import React, { useRef, useState } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const STEPS = [
  {
    id: "consultation",
    number: "01",
    label: "CONSULTATION",
    description:
      "We begin with a thorough consultation to map out your exact packaging requirements. Our experts analyze your product, industry standards, and supply chain to determine the ideal specification for your VCI or LDPE packaging solution.",
    image: "/images/tn_consultation.png",
  },
  {
    id: "material-selection",
    number: "02",
    label: "MATERIAL SELECTION",
    description:
      "We select the optimal polymer grade — VCI formulations for corrosion-sensitive metals, or high-clarity LDPE for general industrial use. Our in-house material library ensures every gauge, density and additive is perfectly chosen for your application.",
    image: "/images/tn_materials.png",
  },
  {
    id: "manufacturing",
    number: "03",
    label: "MANUFACTURING",
    description:
      "Our Madurai production hub runs high-capacity extrusion lines, converting raw polymer into precision-calibrated film rolls, pouches, sheets, pallet covers and container liners — all under strict tolerances and the 'Made in India' standard.",
    image: "/images/tn_manufacturing.png",
  },
  {
    id: "quality-delivery",
    number: "04",
    label: "QUALITY & DELIVERY",
    description:
      "Every batch undergoes tensile strength, tear resistance and gauge-consistency testing in our in-house QA lab. Certified, palletised and dispatched on-time — we guarantee 99% on-schedule delivery across India and internationally.",
    image: "/images/tn_delivery.png",
  },
]

const RADIUS = 18
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function AboutProcess() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const activeRef = useRef(0)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const totalSteps = STEPS.length

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const rawProgress = self.progress
          const stepSize = 1 / totalSteps
          const stepIndex = Math.min(Math.floor(rawProgress / stepSize), totalSteps - 1)
          const stepProgress = ((rawProgress - stepIndex * stepSize) / stepSize) * 100

          if (activeRef.current !== stepIndex) {
            activeRef.current = stepIndex
            setActiveIndex(stepIndex)
          }

          const clamped = Math.min(Math.max(stepProgress, 0), 100)
          if (Math.abs(progressRef.current - clamped) > 0.3) {
            progressRef.current = clamped
            setProgress(clamped)
          }
        },
      })
    },
    { scope: sectionRef }
  )

  const strokeDashoffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE

  return (
    <div
      ref={sectionRef}
      className="relative font-sans"
      style={{ height: `${STEPS.length * 100}vh` }}
    >
      {/* ── STICKY SPLIT-SCREEN ── */}
      <div className="sticky top-0 h-screen w-full flex overflow-hidden">

        {/* ══════════════════════════════════════
            LEFT — Full-height cinematic image
        ══════════════════════════════════════ */}
        <div className="relative w-[52%] flex-shrink-0 overflow-hidden">
          {/* Images cross-fade */}
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: i === activeIndex ? 1 : 0 }}
            >
              <Image
                src={step.image}
                alt={step.label}
                fill
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}

          {/* Bottom gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />

          {/* Step counter bottom-left */}
          <div className="absolute bottom-10 left-10 z-20 flex items-end gap-4">
            <span
              key={activeIndex}
              className="text-white font-black tracking-tighter leading-none animate-numIn"
              style={{ fontSize: "clamp(5rem, 10vw, 8rem)" }}
            >
              {STEPS[activeIndex].number}
            </span>
            <div className="pb-3">
              <span className="text-white/50 text-xs font-bold tracking-[0.2em] uppercase block mb-1">
                Step
              </span>
              <span className="text-white/70 text-sm font-medium">
                of {String(STEPS.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Step label on image bottom */}
          <div className="absolute bottom-10 right-10 z-20">
            <span
              key={`label-${activeIndex}`}
              className="text-white/60 text-xs font-bold tracking-[0.25em] uppercase animate-fadeSlide"
            >
              {STEPS[activeIndex].label}
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT — Content panel
        ══════════════════════════════════════ */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">

          {/* Top: Section header */}
          <div className="flex-shrink-0 px-12 xl:px-16 pt-12 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-[2px] bg-[#38bdf8]" />
              <span className="text-[#38bdf8] text-[0.65rem] font-bold tracking-[0.22em] uppercase">
                Our Process
              </span>
            </div>
            <h2 className="text-2xl xl:text-3xl font-bold text-gray-900 tracking-tight">
              From Consultation{" "}
              <span className="text-[#38bdf8]">to Delivery</span>
            </h2>
          </div>

          {/* Middle: Step list */}
          <div className="flex-1 flex flex-col justify-center px-12 xl:px-16 py-6 gap-2">
            {STEPS.map((step, i) => {
              const isActive = i === activeIndex
              const isDone = i < activeIndex

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-5 py-4 border-b transition-colors duration-300 ${
                    isActive ? "border-gray-200" : "border-gray-100"
                  }`}
                >
                  {/* Progress indicator */}
                  <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
                    {isActive ? (
                      <svg viewBox="0 0 44 44" className="w-11 h-11 -rotate-90">
                        <circle
                          cx="22" cy="22" r={RADIUS}
                          fill="none" stroke="#e2e8f0" strokeWidth="2"
                        />
                        <circle
                          cx="22" cy="22" r={RADIUS}
                          fill="none" stroke="#38bdf8" strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray={CIRCUMFERENCE}
                          strokeDashoffset={strokeDashoffset}
                          style={{ transition: "stroke-dashoffset 0.06s linear" }}
                        />
                      </svg>
                    ) : isDone ? (
                      <div className="w-7 h-7 rounded-full bg-[#38bdf8] flex items-center justify-center shadow-md shadow-sky-200">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center">
                        <span className="text-gray-300 text-[0.6rem] font-bold">{step.number}</span>
                      </div>
                    )}
                  </div>

                  {/* Label + active badge */}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`font-bold tracking-widest uppercase transition-all duration-500 block ${
                        isActive
                          ? "text-gray-900 text-lg xl:text-xl"
                          : isDone
                          ? "text-gray-400 text-sm"
                          : "text-gray-300 text-sm"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <span className="text-[0.6rem] text-[#38bdf8] font-bold tracking-[0.18em] uppercase mt-0.5 block">
                        In Progress
                      </span>
                    )}
                  </div>

                  {/* Step number (right) */}
                  <span className={`text-xs font-mono tabular-nums flex-shrink-0 ${
                    isActive ? "text-[#38bdf8]" : "text-gray-200"
                  }`}>
                    {step.number}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Bottom: Description */}
          <div className="flex-shrink-0 px-12 xl:px-16 py-8 border-t border-gray-100 bg-gray-50/60">
            <div className="flex gap-5 items-start">
              <div className="w-[3px] bg-[#38bdf8] self-stretch rounded-full flex-shrink-0 mt-1" />
              <p
                key={activeIndex}
                className="text-gray-600 text-[0.95rem] xl:text-base leading-[1.9] animate-processIn"
              >
                {STEPS[activeIndex].description}
              </p>
            </div>

            {/* Progress pills */}
            <div className="flex items-center gap-2 mt-5 pl-8">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    i === activeIndex
                      ? "bg-[#38bdf8] w-8"
                      : i < activeIndex
                      ? "bg-[#38bdf8]/30 w-4"
                      : "bg-gray-200 w-4"
                  }`}
                />
              ))}
              <span className="text-gray-400 text-xs ml-2 font-medium tabular-nums">
                {activeIndex + 1} / {STEPS.length}
              </span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes processIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes numIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 0.6; transform: translateX(0); }
        }
        .animate-processIn { animation: processIn 0.4s ease forwards; }
        .animate-numIn { animation: numIn 0.5s ease forwards; }
        .animate-fadeSlide { animation: fadeSlide 0.5s ease forwards; }
      `}</style>
    </div>
  )
}
