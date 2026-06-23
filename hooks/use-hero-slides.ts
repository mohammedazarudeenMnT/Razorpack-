"use client";

import useSWR from "swr";

export interface HeroSlide {
  imageUrl: string;
  title: string;
  highlight: string;
  tagline: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

interface BannerResponse {
  success: boolean;
  data: {
    slides?: HeroSlide[];
    images?: string[];
  };
}

export function useHeroSlides() {
  const { data, error, isLoading } = useSWR<BannerResponse>(
    "/api/banners?pageKey=home",
    (url) => fetch(url).then((r) => r.json()),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    slides: data?.data?.slides || [],
    isLoading,
    isError: error,
  };
}
