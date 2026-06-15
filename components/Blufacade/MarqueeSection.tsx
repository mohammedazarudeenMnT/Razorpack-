"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion"
import { cn } from "@/lib/utils"

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

interface SingleLineVelocityProps {
  text: string
  baseVelocity: number
  className?: string
}

function SingleLineVelocity({ text, baseVelocity, className }: SingleLineVelocityProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  })

  const [repetitions, setRepetitions] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const calculateRepetitions = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const textWidth = textRef.current.offsetWidth
        const newRepetitions = Math.ceil(containerWidth / textWidth) + 2
        setRepetitions(newRepetitions)
      }
    }

    calculateRepetitions()

    window.addEventListener("resize", calculateRepetitions)
    return () => window.removeEventListener("resize", calculateRepetitions)
  }, [text])

  const x = useTransform(baseX, (v) => `${wrap(-100 / repetitions, 0, v)}%`)

  const directionFactor = React.useRef<number>(1)
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()

    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="w-full overflow-hidden whitespace-nowrap" ref={containerRef}>
      <motion.div className={cn("inline-block", className)} style={{ x }}>
        {Array.from({ length: repetitions }).map((_, i) => (
          <span key={i} ref={i === 0 ? textRef : null}>
            {text}{" "}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function MarqueeSection() {
  const topText = "PREMIUM LDPE FILM ROLLS • VCI POLY BAGS • STRETCH FILMS •"
  const bottomText = "ISO 9001:2015 CERTIFIED • PAN INDIA DELIVERY • ECO-FRIENDLY •"

  return (
    <div className="relative py-16 overflow-hidden bg-[#f7f5f0]">
      {/* Top Strip - Green, tilted, moving right */}
      <div className="relative -rotate-2 -mx-4 mb-4">
        <div className="bg-[#1a3d2b] py-6 overflow-hidden border-y border-[#1a3d2b]/20 shadow-xl">
          <SingleLineVelocity
            text={topText}
            baseVelocity={1}
            className="text-[#e8a020] text-4xl md:text-5xl lg:text-6xl font-heading font-black mx-8 tracking-widest uppercase"
          />
        </div>
      </div>

      {/* Bottom Strip - Amber, tilted opposite, moving left */}
      <div className="relative rotate-2 -mx-4">
        <div className="bg-[#e8a020] py-6 overflow-hidden border-y border-[#e8a020]/20 shadow-xl">
          <SingleLineVelocity
            text={bottomText}
            baseVelocity={-1}
            className="text-[#1a3d2b] text-4xl md:text-5xl lg:text-6xl font-heading font-black mx-8 tracking-widest uppercase"
          />
        </div>
      </div>
    </div>
  )
}
