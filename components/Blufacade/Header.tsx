"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, Instagram, Linkedin, Facebook, Twitter, Globe } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { siteConfig } from "@/config/site"

const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about" },
  { label: "PRODUCTS", href: "/products", hasDropdown: true },
  { label: "SERVICES", href: "/services" },
  { label: "GALLERY", href: "/portfolio" },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const pathname = usePathname()

  const services = siteConfig.services

  const mobileSocialLinks = [
    {
      label: "Instagram",
      href: siteConfig.social.instagram,
      icon: <Instagram className="w-5 h-5" />,
    },
    {
      label: "LinkedIn",
      href: siteConfig.social.linkedin,
      icon: <Linkedin className="w-5 h-5" />,
    },
    {
      label: "Facebook",
      href: siteConfig.social.facebook,
      icon: <Facebook className="w-5 h-5" />,
    },
    {
      label: "Twitter",
      href: siteConfig.social.twitter,
      icon: <Twitter className="w-5 h-5" />,
    },
  ].filter((s) => Boolean(s.href))

  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 50)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 ${
          scrolled ? "bg-surface border-b border-line" : "bg-surface"
        }`}
      >
        <div className="flex items-stretch justify-between h-16 lg:h-20">

          {/* Logo Area (Left) */}
          <div className="flex items-center pl-4 lg:pl-8 shrink-0">
            <Link href="/" className="flex items-center gap-2 lg:gap-2.5 group">
              <Image
                src="/images/rayzor/logo/Rayzor Final Logo File-03.png"
                alt="Rayzorpack Logo"
                width={40}
                height={40}
                className="h-8 w-8 lg:h-9 lg:w-9 object-contain"
                priority
              />
              <span className="text-lg lg:text-xl font-heading font-extrabold tracking-tight leading-none">
                <span className="text-[#2D2D2D]">RAYZOR</span><span className="text-[#44B8E8]">PACK</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Area (Right) */}
          <div className="hidden lg:flex items-stretch justify-end">
            <nav className="flex items-center px-4 xl:px-6 gap-4 xl:gap-6 h-full bg-surface">
              {/* DEMO MODE: links disabled for client presentation */}
              {navItems.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <span
                      key={item.label}
                      className="flex items-center gap-1 text-xs xl:text-[13px] font-semibold uppercase tracking-wide cursor-default text-ink whitespace-nowrap"
                    >
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </span>
                  )
                }

                return (
                  <span
                    key={item.label}
                    className={`text-xs xl:text-[13px] font-semibold uppercase tracking-wide cursor-default flex items-center h-full border-b-2 whitespace-nowrap ${
                      pathname === item.href
                        ? "text-brand border-brand"
                        : "text-ink border-transparent"
                    }`}
                  >
                    {item.label}
                  </span>
                )
              })}

              <span className="flex items-center gap-1.5 text-xs xl:text-[13px] font-semibold uppercase text-ink border border-ink rounded-md px-3 py-1.5 ml-2 cursor-default opacity-70 whitespace-nowrap">
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                 Download Profile
              </span>
            </nav>

            {/* CTA */}
            <span className="flex items-center justify-center bg-brand text-white px-6 xl:px-8 h-full font-bold text-xs xl:text-[13px] uppercase cursor-default whitespace-nowrap">
              CONTACT US
            </span>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center justify-end pr-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-ink"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-surface z-40 flex flex-col pt-24 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMenuOpen(false)
            }}
          >
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
              }}
              className="flex flex-col w-full px-8 py-8 gap-6"
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.label}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -20 },
                  }}
                  className="border-b border-line/60 pb-4"
                >
                  <Link
                    href={item.href}
                    className="text-2xl font-bold text-ink hover:text-brand transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -20 },
                }}
                className="pt-4"
              >
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full bg-brand text-white py-4 rounded-md font-bold text-lg hover:bg-brand-deep hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  GET QUOTE
                </Link>
              </motion.div>

              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 20 },
                }}
                className="mt-12 flex justify-center gap-6"
              >
                {mobileSocialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-white border border-line flex items-center justify-center text-ink hover:text-white hover:bg-brand hover:border-brand transition-all"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
