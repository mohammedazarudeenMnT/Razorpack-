import type { MetadataRoute } from "next";
import connectDB from "@/config/models/connectDB";
import Product from "@/config/utils/admin/products/productSchema";
import Service from "@/config/utils/admin/services/serviceSchema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.rayzorpack.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    await connectDB();

    const [products, services] = await Promise.all([
      Product.find({ status: "active", isDeleted: false }).select("slug updatedAt").lean(),
      Service.find({
        status: "active",
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      }).select("slug updatedAt").lean(),
    ]);

    dynamicPages = [
      ...(products || []).map((p: any) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...(services || []).map((s: any) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: s.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap:", error);
  }

  return [...staticPages, ...dynamicPages];
}
