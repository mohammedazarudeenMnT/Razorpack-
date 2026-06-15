export interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  linkUrl?: string;
}

export const bannerApi = {
  async getBanners(): Promise<{ success: boolean; data: Banner[] }> {
    try {
      const res = await fetch("/api/banners?pageKey=home", {
        next: { revalidate: 60 },
      });
      const json = await res.json();

      if (!json.success || !json.data) {
        return { success: false, data: [] };
      }

      const doc = json.data;

      // Support both single image and images array (carousel)
      const urls: string[] =
        doc.images && doc.images.length > 0
          ? doc.images
          : doc.image
            ? [doc.image]
            : [];

      const banners: Banner[] = urls.map((url: string, i: number) => ({
        id: `banner-${i}`,
        imageUrl: url,
        title: doc.title || "",
        linkUrl: "/services",
      }));

      return { success: true, data: banners };
    } catch {
      return { success: false, data: [] };
    }
  },
};
