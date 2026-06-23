"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import Image from "next/image";
import { useState, useCallback } from "react";
import { useContact } from "@/hooks/use-contact";

interface ServiceData {
  _id?: string;
  serviceName: string;
  shortDescription?: string;
  description: string;
  image: string;
  gallery?: string[];
  features: string[];
  slug: string;
  status?: string;
  views?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

interface ServiceDetailClientProps {
  serviceData: ServiceData;
}

export default function ServiceDetailClient({
  serviceData,
}: ServiceDetailClientProps) {
  const { contactInfo } = useContact();
  const [selectedImage, setSelectedImage] = useState(serviceData.image || "/placeholder.svg");
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const allImages = [
    serviceData.image,
    ...(serviceData.gallery || []),
  ].filter((img) => img && img.trim() !== "");

  const currentIndex = allImages.indexOf(selectedImage);

  const handlePrevImage = useCallback(() => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
    setSelectedImage(allImages[newIndex]);
    setImageLoading(true);
    setImageError(false);
  }, [currentIndex, allImages]);

  const handleNextImage = useCallback(() => {
    const newIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(allImages[newIndex]);
    setImageLoading(true);
    setImageError(false);
  }, [currentIndex, allImages]);

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
    setImageLoading(true);
    setImageError(false);
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Left - Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="order-1 lg:order-1"
            >
              {/* Main Image Container */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-xl overflow-hidden shadow-lg mb-3 sm:mb-4 bg-gray-100">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="w-8 h-8 border-2 border-[#8CC63F] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {imageError ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-sm">Image not available</span>
                  </div>
                ) : (
                  <Image
                    src={selectedImage}
                    alt={serviceData.serviceName}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                    className={`object-cover transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false);
                      setImageError(true);
                    }}
                  />
                )}

                {/* Navigation Arrows - Only show if multiple images */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all z-20 focus:outline-none focus:ring-2 focus:ring-[#8CC63F]"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-[#1E3A5F]" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all z-20 focus:outline-none focus:ring-2 focus:ring-[#8CC63F]"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#1E3A5F]" />
                    </button>
                    {/* Image Counter */}
                    <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 px-2 py-1 bg-black/60 rounded-md text-white text-xs sm:text-sm z-20">
                      {currentIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(image)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#8CC63F] ${
                        selectedImage === image
                          ? "border-[#8CC63F] ring-1 ring-[#8CC63F]"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      aria-label={`View image ${index + 1}`}
                      aria-current={selectedImage === image ? "true" : "false"}
                    >
                      <Image
                        src={image}
                        alt={`${serviceData.serviceName} - Image ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-2 lg:order-2"
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1E3A5F] mb-4 sm:mb-6">
                About This Service
              </h2>

              <div
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-600 mb-6 sm:mb-8 
                  prose-headings:text-[#1E3A5F] prose-headings:font-semibold
                  prose-p:leading-relaxed prose-p:text-gray-600
                  prose-li:text-gray-600 prose-li:leading-relaxed
                  prose-a:text-[#8CC63F] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-[#1E3A5F]"
                dangerouslySetInnerHTML={{ __html: serviceData.description }}
              />

              {/* Features */}
              {serviceData.features && serviceData.features.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#1E3A5F] mb-3 sm:mb-4">
                    Key Features
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {serviceData.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3">
                        <div className="mt-0.5 p-1 bg-[#8CC63F] rounded-full shrink-0">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a 
                  href="/contact"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    className="bg-[#014a74] hover:bg-[#012d47] text-white w-full h-11 sm:h-12 text-sm sm:text-base"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Us
                  </Button>
                </a>
                <a 
                  href={`https://wa.me/${contactInfo?.whatsappNumber?.replace(/\s+/g, '') || ""}?text=${encodeURIComponent(`I'm interested in ${serviceData.serviceName}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#014a74] text-[#014a74] hover:bg-[#014a74] hover:text-white w-full h-11 sm:h-12 text-sm sm:text-base"
                  >
                    <WhatsAppIcon className="h-4 w-4 mr-2" />
                    Get a Quote
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


    </div>
  );
}
