"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

export function DynamicGoogleAnalytics() {
  const [gaId, setGaId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data?.googleAnalyticsId) {
          setGaId(result.data.googleAnalyticsId);
        }
      })
      .catch(() => {});
  }, []);

  if (!gaId) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
