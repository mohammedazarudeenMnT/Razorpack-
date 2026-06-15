'use client'

import { useEffect, useMemo, useState } from 'react'
import { useContact } from '@/hooks/use-contact'

const INTRO_STYLE_ID = 'rayzorpack-faq-animations'

interface FAQItem {
  question: string
  answer: string
  meta: string
}

const faqData: FAQItem[] = [
  {
    question: 'What types of industrial packaging materials do you supply?',
    answer: 'We manufacture and supply a comprehensive range of industrial packaging solutions, including premium LDPE Film Rolls, VCI Anti-Rust Poly Bags, Stretch Films, HDPE Bags, and Bubble Wrap. Our products are engineered for maximum durability and transit protection.',
    meta: 'Products',
  },
  {
    question: 'What is VCI packaging and how does it prevent rust?',
    answer: 'VCI stands for Volatile Corrosion Inhibitor. Our VCI poly bags release invisible, odorless vapors that form a protective molecular layer on metal surfaces. This prevents moisture, salt, and oxygen from causing rust and corrosion during long-term storage or sea transit.',
    meta: 'Technology',
  },
  {
    question: 'Are your LDPE film rolls customizable?',
    answer: 'Yes, absolutely. We can customize the micron thickness, width, roll length, and even provide custom branding/printing to meet your specific industrial requirements and automated packaging machine specifications.',
    meta: 'Customization',
  },
  {
    question: 'Do you offer Pan-India delivery?',
    answer: 'Yes, from our state-of-the-art manufacturing facility in Madurai, we maintain robust logistics networks to supply packaging materials to major industrial hubs including Chennai, Bangalore, Pune, Delhi NCR, and across India.',
    meta: 'Shipping',
  },
  {
    question: 'Are you an ISO certified manufacturer?',
    answer: 'Yes, Rayzor Industrial Packaging Pvt Ltd is an ISO 9001:2015 certified company. We implement strict quality control protocols at every stage of manufacturing to ensure consistent micron thickness, tensile strength, and reliable performance.',
    meta: 'Quality',
  },
  {
    question: 'What is your minimum order quantity (MOQ)?',
    answer: 'Our MOQs vary depending on the product type and customization requirements. However, we strive to support both medium-scale manufacturers and large corporate enterprises. Please contact our sales team for specific product MOQs.',
    meta: 'Ordering',
  },
]

const palettes = {
  light: {
    surface: 'bg-[#f7f5f0] text-[#0f1a12]',
    panel: 'bg-white/80',
    border: 'border-[#1a3d2b]/10',
    heading: 'text-[#1a3d2b]',
    muted: 'text-[#6b7280]',
    iconRing: 'border-[#e8a020]/30',
    iconSurface: 'bg-[#e8a020]/10',
    icon: 'text-[#e8a020]',
    glow: 'rgba(232, 160, 32, 0.1)', // Amber glow
    aurora: 'radial-gradient(ellipse 50% 100% at 10% 0%, rgba(26, 61, 43, 0.05), rgba(247, 245, 240, 0.95) 70%)',
    shadow: 'shadow-lg shadow-[#1a3d2b]/5',
    overlay: 'linear-gradient(130deg, rgba(26,61,43,0.02) 0%, transparent 70%)',
  },
}

type ThemeType = keyof typeof palettes

export function FAQSection() {
  const getRootTheme = (): ThemeType => {
    return 'light'
  }

  const { contactInfo } = useContact()
  const [theme] = useState<ThemeType>(getRootTheme)
  const [introReady, setIntroReady] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(INTRO_STYLE_ID)) return
    const style = document.createElement('style')
    style.id = INTRO_STYLE_ID
    style.innerHTML = `
      @keyframes rp-fade-up {
        0% { transform: translate3d(0, 20px, 0); opacity: 0; filter: blur(6px); }
        60% { filter: blur(0); }
        100% { transform: translate3d(0, 0, 0); opacity: 1; filter: blur(0); }
      }
      .rp-fade {
        opacity: 0;
        transform: translate3d(0, 24px, 0);
        filter: blur(12px);
        transition: opacity 700ms ease, transform 700ms ease, filter 700ms ease;
      }
      .rp-fade--ready {
        animation: rp-fade-up 860ms cubic-bezier(0.22, 0.68, 0, 1) forwards;
      }
    `

    document.head.appendChild(style)

    return () => {
      if (style.parentNode) style.remove()
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIntroReady(true)
      return
    }
    const frame = window.requestAnimationFrame(() => setIntroReady(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const palette = useMemo(() => palettes[theme], [theme])

  const toggleQuestion = (index: number) => setActiveIndex((prev) => (prev === index ? -1 : index))

  useEffect(() => {
    if (typeof window === 'undefined') {
      setHasEntered(true)
      return
    }

    let timeout: ReturnType<typeof setTimeout>
    const onLoad = () => {
      timeout = setTimeout(() => setHasEntered(true), 120)
    }

    if (document.readyState === 'complete') {
      onLoad()
    } else {
      window.addEventListener('load', onLoad, { once: true })
    }

    return () => {
      window.removeEventListener('load', onLoad)
      clearTimeout(timeout)
    }
  }, [])

  const setCardGlow = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    target.style.setProperty('--faq-x', `${event.clientX - rect.left}px`)
    target.style.setProperty('--faq-y', `${event.clientY - rect.top}px`)
  }

  const clearCardGlow = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget
    target.style.removeProperty('--faq-x')
    target.style.removeProperty('--faq-y')
  }

  const handleWhatsAppClick = () => {
    const message = "Hi! I'm interested in your packaging solutions. Please provide more details."
    const whatsappNumber = contactInfo?.whatsappNumber || '919087787879'
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className={`relative w-full overflow-hidden transition-colors duration-700 ${palette.surface}`}>
      <div className="absolute inset-0 z-0" style={{ background: palette.aurora }} />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{ background: palette.overlay, mixBlendMode: 'multiply' }}
      />

      <section
        className={`relative z-10 mx-auto flex max-w-4xl flex-col gap-12 px-6 py-24 lg:max-w-5xl lg:px-12 ${
          hasEntered ? 'rp-fade--ready' : 'rp-fade'
        }`}
      >
        <header className="flex flex-col gap-8 text-center items-center">
          <div className="space-y-4">
            <span className="inline-block text-xs font-bold text-brand uppercase tracking-widest mb-2 border border-brand/20 px-3 py-1 rounded-md">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-extrabold leading-tight text-ink">
              Everything you need to know.
            </h2>
            <p className={`max-w-2xl text-lg ${palette.muted} mx-auto`}>
              Get answers to common questions about partnering with Rayzorpack for your industrial packaging needs.
            </p>
          </div>
        </header>

        <ul className="space-y-4">
          {faqData.map((item, index) => {
            const open = activeIndex === index
            const panelId = `faq-panel-${index}`
            const buttonId = `faq-trigger-${index}`

            return (
               <li
                key={item.question}
                className={`group relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 focus-within:-translate-y-1 ${palette.border} ${palette.panel} ${palette.shadow}`}
                onMouseMove={setCardGlow}
                onMouseLeave={clearCardGlow}
              >
                <div
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                    open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  style={{
                    background: `radial-gradient(400px circle at var(--faq-x, 50%) var(--faq-y, 50%), ${palette.glow}, transparent 60%)`,
                  }}
                />

                <button
                  type="button"
                  id={buttonId}
                  aria-controls={panelId}
                  aria-expanded={open}
                  onClick={() => toggleQuestion(index)}
                  className="relative flex w-full items-start gap-6 px-8 py-7 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <span
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-500 group-hover:scale-105 ${palette.iconRing} ${palette.iconSurface}`}
                  >
                    <svg
                      className={`relative h-5 w-5 transition-transform duration-500 ${palette.icon} ${
                        open ? 'rotate-45' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>

                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 pt-3">
                      <h3 className={`text-lg md:text-xl font-heading font-bold leading-tight ${palette.heading}`}>
                        {item.question}
                      </h3>
                      {item.meta && (
                        <span
                          className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity duration-300 sm:ml-auto border-[#1a3d2b]/20 text-[#1a3d2b]`}
                        >
                          {item.meta}
                        </span>
                      )}
                    </div>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`overflow-hidden text-base leading-relaxed transition-[max-height] duration-500 ease-in-out ${
                        open ? 'max-h-64' : 'max-h-0'
                      } ${palette.muted} font-sans`}
                    >
                      <p className="pr-2 pb-2">{item.answer}</p>
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>

        {/* Contact CTA Section */}
        <div className={`text-center p-10 rounded-3xl border bg-white shadow-lg mt-8 ${palette.border}`}>
          <h3 className={`text-2xl font-heading font-black mb-4 ${palette.heading}`}>Still have questions?</h3>
          <p className={`mb-8 text-lg font-sans ${palette.muted}`}>
            Our packaging experts are ready to help you find the perfect solution for your products.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleWhatsAppClick}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 bg-[#25D366] text-white shadow-md hover:shadow-lg`}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Chat on WhatsApp
            </button>
            <a
              href="mailto:sales@rayzorpack.com"
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 bg-[#1a3d2b] text-white shadow-md hover:shadow-lg`}
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}