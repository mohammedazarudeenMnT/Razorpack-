"use client"

import { useEffect } from "react"

/**
 * DEMO MODE: Wraps the page and intercepts all link clicks
 * to prevent navigation. Remove this wrapper to re-enable links.
 */
export function DemoWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a")
      if (target) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    document.addEventListener("click", handler, true)
    return () => document.removeEventListener("click", handler, true)
  }, [])

  return (
    <>
      <style>{`
        a, a * { cursor: default !important; }
        button[aria-label="Go to slide 1"],
        button[aria-label="Go to slide 2"],
        button[aria-label="Go to slide 3"],
        button[aria-label="Slide 1"],
        button[aria-label="Slide 2"],
        button[aria-label="Slide 3"] { cursor: pointer !important; }
      `}</style>
      {children}
    </>
  )
}
