import { notFound } from "next/navigation";
import { Header } from "@/components/Blufacade/Header";
import { Footer } from "@/components/Blufacade/Footer";
import { PageHero } from "@/components/Blufacade/pages/PageHero";
import { ServiceDetailContent } from "@/components/Blufacade/pages/ServiceDetailContent";
import { FALLBACK_SERVICES } from "@/lib/fallback-services";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

import { cache } from "react";

// Base fetcher to be deduplicated
const getServiceBase = cache(async (slug: string) => {
  const connectDB = (await import("@/config/models/connectDB")).default;
  const Service = (
    await import("@/config/utils/admin/services/serviceSchema")
  ).default;

  await connectDB();

  const service = await Service.findOne({
    slug,
    status: "active",
    $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
  })
    .select("-isDeleted -__v")
    .lean();

  return service ? JSON.parse(JSON.stringify(service)) : null;
});

// Fetch single service by slug
async function getServiceBySlug(slug: string, increment = false) {
  try {
    const service = await getServiceBase(slug);

    if (service && increment) {
      const Service = (
        await import("@/config/utils/admin/services/serviceSchema")
      ).default;
      // Increment view count separately from fetch
      await Service.findByIdAndUpdate(service._id, {
        $inc: { views: 1 },
      });
    }

    if (service) {
      return service;
    }

    // If not found in DB, check fallback services
    const fallback = FALLBACK_SERVICES.find((s) => s.slug === slug);
    if (fallback) {
      return fallback;
    }

    return null;
  } catch (error) {
    console.error("Error fetching service:", error);
    // Fallback on error
    const fallback = FALLBACK_SERVICES.find((s) => s.slug === slug);
    return fallback || null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const serviceData = await getServiceBySlug(resolvedParams.slug);

  if (!serviceData) {
    return {
      title: "Service Not Found - Blufacade",
      description: "The requested service could not be found.",
    };
  }

  return {
    title:
      serviceData.seoTitle ||
      `${serviceData.serviceName} - Blufacade Facade Solutions`,
    description: serviceData.seoDescription || serviceData.description,
    keywords:
      serviceData.seoKeywords ||
      `${serviceData.serviceName}, facade solutions, ACP cladding, structural glazing, Blufacade`,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const serviceData = await getServiceBySlug(resolvedParams.slug, true);

  if (!serviceData) {
    notFound();
  }

  // Format the heading for the PageHero component which uses an '&' between lines
  const words = serviceData.serviceName.replace(/&/g, "").split(" ").filter(Boolean);
  const headingLine1 = words[0] || "INDUSTRIAL";
  const headingLine2 = words.slice(1).join(" ") || "SERVICES";

  return (
    <main className="min-h-screen">
      <Header />
      <PageHero
        label={serviceData.category || "Service Details"}
        headingLine1={headingLine1}
        headingLine2={headingLine2}
        description={serviceData.shortDescription || serviceData.description.replace(/<[^>]+>/g, '').substring(0, 150) + "..."}
        image={serviceData.image || "/images/placeholder.svg"}
        imageAlt={serviceData.serviceName}
        theme="dark"
      />
      <ServiceDetailContent serviceData={serviceData} />
      <Footer />
    </main>
  );
}
