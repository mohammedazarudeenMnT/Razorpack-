"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, ExternalLink, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePortfolio } from "@/hooks/use-portfolio"

export function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState("All")
  const { portfolios, isLoading } = usePortfolio(1, 100)

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    if (!portfolios) return ["All"]
    const uniqueCats = new Set(portfolios.map(p => p.category).filter(Boolean) as string[])
    return ["All", ...Array.from(uniqueCats)]
  }, [portfolios])

  // Filter items
  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return portfolios
    return portfolios.filter(item => item.category === activeCategory)
  }, [activeCategory, portfolios, activeCategory])

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 mb-12 justify-center">
            {[1, 2, 3].map(i => <div key={i} className="h-10 w-24 bg-gray-100 rounded-full animate-pulse" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-lg">
                <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-6 w-3/4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                  <div className="h-16 w-full bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Category Filter */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-[#014a74] text-white shadow-lg"
                    : "bg-[#fefaf6] text-gray-600 hover:bg-[#014a74]/10 hover:text-[#014a74]"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* Portfolio Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group h-full"
              >
                <Link href={`/gallery/${item.slug}`} className="block h-full">
                  <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-gray-100 h-full flex flex-col hover:-translate-y-1">
                    {/* Image */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.projectName}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                           <Building2 className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center z-10">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          <ExternalLink className="w-5 h-5 text-[#014a74]" />
                        </div>
                      </div>

                      {/* Category Badge */}
                      {item.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#f58420] text-white text-xs font-bold uppercase tracking-wider z-20 shadow-md">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-[#014a74] mb-3 group-hover:text-[#f58420] transition-colors line-clamp-1">
                        {item.projectName}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500 mb-4 uppercase tracking-wide">
                        {item.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#f58420]" />
                            <span>{item.location}</span>
                          </div>
                        )}
                        {item.completionDate && (
                           <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#f58420]" />
                            <span>{item.completionDate}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                        {item.shortDescription || item.description?.replace(/<[^>]*>?/gm, '').substring(0, 100) + "..."}
                      </p>
                      
                      <div className="flex items-center text-[#014a74] text-sm font-bold mt-auto group-hover:underline decoration-[#f58420] underline-offset-4">
                        View Case Study
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any projects matching the selected category. Please try selecting a different category.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
