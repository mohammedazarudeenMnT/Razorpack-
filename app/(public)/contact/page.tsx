import { Metadata } from "next";
import { getSEO } from "@/lib/get-seo";
import { PageHero } from "@/components/Blufacade/pages/PageHero";
import { ContactContent } from "@/components/Blufacade/pages/ContactContent";
import connectDB from "@/config/models/connectDB";
import Banner from "@/config/utils/admin/banner/bannerSchema";
import Contact from "@/config/utils/admin/contact/ContactSchema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO("contact");
  const title = seo?.title || "Contact Us";
  const description = seo?.description || "";

  return {
    title,
    description,
    keywords: seo?.keywords || "",
    alternates: { canonical: "/contact" },
    openGraph: {
      title,
      description,
      url: "/contact",
      type: "website",
      ...(seo?.ogImage && { images: [{ url: seo.ogImage, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(seo?.ogImage && { images: [seo.ogImage] }),
    },
  };
}

async function getContactPageData() {
  try {
    await connectDB();
    const [banner, contact] = await Promise.all([
      Banner.findOne({ pageKey: "contact" }).lean(),
      Contact.findOne({}).lean(),
    ]);

    const heroBanner = banner
      ? {
          label: (banner as any).label || "Get In Touch",
          headingLine1: (banner as any).headingLine1 || "CONTACT",
          headingLine2: (banner as any).headingLine2 || "US",
          description:
            (banner as any).description ||
            "Reach out to our team for packaging consultations, bulk enquiries, or custom solutions.",
          image: (banner as any).image || "/images/rayzor/contact-hero.png",
        }
      : null;

    const contactInfo = contact
      ? {
          phone: (contact as any).primaryPhone || "",
          email: (contact as any).email || "",
          address: (contact as any).address || "",
          city: (contact as any).city || "",
          state: (contact as any).state || "",
          postcode: (contact as any).postcode || "",
          country: (contact as any).country || "",
        }
      : null;

    return { heroBanner, contactInfo };
  } catch (error) {
    console.error("Failed to fetch contact page data:", error);
    return { heroBanner: null, contactInfo: null };
  }
}

export default async function ContactPage() {
  const [{ heroBanner, contactInfo }, seo] = await Promise.all([
    getContactPageData(),
    getSEO("contact"),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: seo?.title || "Contact Us",
    description: seo?.description || heroBanner?.description || "",
    url: "https://www.rayzorpack.com/contact",
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Rayzor Industrial Packaging Pvt Ltd",
      url: "https://www.rayzorpack.com",
      ...(contactInfo && {
        telephone: contactInfo.phone,
        email: contactInfo.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: contactInfo.address,
          addressLocality: contactInfo.city,
          addressRegion: contactInfo.state,
          postalCode: contactInfo.postcode,
          addressCountry: contactInfo.country || "IN",
        },
      }),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen">
        {heroBanner && (
          <PageHero
            label={heroBanner.label}
            headingLine1={heroBanner.headingLine1}
            headingLine2={heroBanner.headingLine2}
            description={heroBanner.description}
            image={heroBanner.image}
            imageAlt="Rayzor Industrial Packaging Pvt Ltd Contact"
          />
        )}
        <ContactContent />
      </main>
    </>
  );
}
