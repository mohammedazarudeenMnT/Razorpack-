import connectDB from "@/config/models/connectDB";
import SEO from "@/config/utils/admin/seo/seoSchema";

export async function getSEO(pageId: string) {
  try {
    await connectDB();
    const seo = await SEO.findOne({ id: pageId, isActive: true }).lean() as any;
    if (seo) {
      return {
        title: seo.title as string,
        description: seo.description as string,
        keywords: (seo.keywords || "") as string,
        ogImage: (seo.ogImage || "") as string,
      };
    }
  } catch (error) {
    console.error(`Failed to fetch SEO for ${pageId}:`, error);
  }
  return null;
}
